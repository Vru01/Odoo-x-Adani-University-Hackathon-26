// Import from the Central Hub (models/index.js) to fix associations
const { User, RefreshToken } = require('../models'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper: Generate Token (Updated to use user_id)
const generateAccessToken = (user) => {
    // We use user.user_id now, not user.id
    return jwt.sign({ id: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRATION });
};

// 1. SIGNUP
exports.signup = async (req, res) => {
    try {
        const { full_name, email, password, role } = req.body;
        
        // CHECK: user exists
        const userExists = await User.findOne({ where: { email } });
        if (userExists) return res.status(400).json({ msg: 'User already exists' });

        // SECURITY: Logic for Account Status
        // If they ask to be 'admin' or 'technician', set to PENDING.
        // If they are just 'user', set to ACTIVE (or restrict by domain if you prefer).
        let initialStatus = 'active';
        if (role === 'admin' || role === 'technician') {
            initialStatus = 'pending';
        }

        // HASH PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // CREATE: User
        const newUser = await User.create({ 
            full_name, 
            email, 
            password_hash: hashedPassword, // Map to DB column
            role: role || 'user',
            account_status: initialStatus
        });

        // Response varies based on status
        if (initialStatus === 'pending') {
            return res.status(201).json({ msg: 'Registration successful! Please wait for Admin approval to log in.' });
        }

        res.status(201).json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during signup' });
    }
};

// 2. LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        // CHECK PASSWORD (compare with password_hash)
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        // CHECK ACCOUNT STATUS (The Gatekeeper)
        if (user.account_status === 'pending') {
            return res.status(403).json({ msg: 'Your account is pending approval. Please contact Admin.' });
        }
        if (user.account_status === 'rejected') {
            return res.status(403).json({ msg: 'Your account has been rejected.' });
        }

        // Generate Tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign({ id: user.user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });

        // Save Refresh Token
        let expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);

        await RefreshToken.create({
            token: refreshToken,
            user_id: user.user_id, // Explicitly map foreign key
            expiryDate: expiryDate,
        });

        res.json({
            accessToken,
            refreshToken,
            user: { 
                id: user.user_id, 
                full_name: user.full_name, 
                email: user.email, 
                role: user.role,
                avatar: user.avatar_url 
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error during login' });
    }
};

// 3. REFRESH TOKEN
exports.refreshToken = async (req, res) => {
    const { requestToken } = req.body;
    if (!requestToken) return res.status(403).json({ msg: 'Refresh Token is required!' });

    try {
        const refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

        if (!refreshToken) return res.status(403).json({ msg: 'Refresh token is not in database!' });

        if (RefreshToken.verifyExpiration(refreshToken)) {
            await RefreshToken.destroy({ where: { token: refreshToken.token } }); // delete by token or ID
            return res.status(403).json({ msg: 'Refresh token was expired. Please make a new signin request' });
        }

        // Find user by FK
        const user = await User.findByPk(refreshToken.user_id);
        const newAccessToken = generateAccessToken(user);

        res.json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
};

// 4. LOGOUT
exports.logout = async (req, res) => {
    try {
        const { requestToken } = req.body;
        await RefreshToken.destroy({ where: { token: requestToken } });
        res.status(200).json({ msg: 'Logged out successfully!' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// 5. GET USER PROFILE
exports.getProfile = async (req, res) => {
    try {
        // req.user.id comes from the authMiddleware
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password_hash'] } // Exclude the hash
        });
        if (!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// 6. GOOGLE LOGIN
exports.googleLogin = async (req, res) => {
    const { token } = req.body; 

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { email, name } = ticket.getPayload(); 

        let user = await User.findOne({ where: { email } });

        if (!user) {
            // Create new Google User
            // Note: Google users are usually trusted, so we might set them to 'active' by default
            const randomPassword = Math.random().toString(36).slice(-8); 
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(randomPassword, salt);

            user = await User.create({
                full_name: name,
                email: email,
                password_hash: hashedPassword,
                role: 'user', // Default role
                account_status: 'active' // Auto-activate Google users? Or use 'pending'?
            });
        }

        // Check Status
        if (user.account_status !== 'active') {
             return res.status(403).json({ msg: 'Account not active.' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign({ id: user.user_id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRATION });

        let expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        await RefreshToken.create({ token: refreshToken, user_id: user.user_id, expiryDate: expiryDate });

        res.json({
            accessToken,
            refreshToken,
            user: { id: user.user_id, full_name: user.full_name, email: user.email, role: user.role }
        });

    } catch (err) {
        res.status(400).json({ msg: "Google Sign-In Failed", error: err.message });
    }
};