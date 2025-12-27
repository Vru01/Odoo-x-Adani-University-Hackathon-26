const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        // req.user is populated by your authMiddleware (verifyToken)
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: "Access Denied: You do not have permission to perform this action." 
            });
        }
        next();
    };
};

module.exports = roleMiddleware;