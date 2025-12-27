const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db'); 
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import models
const { User } = require('./models'); // Ensure we pull User from your central export

dotenv.config();
const app = express();

// ... [Your existing middleware configs: Helmet, RateLimit] ...
app.use(helmet());
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100, 
    message: "Too many requests from this IP, please try again later."
});
app.use('/api/', limiter);

// Connect to Database
connectDB();

// 👇 SEEDING FUNCTION
const seedAdmin = async () => {
    try {
        // Check if an admin already exists
        const adminExists = await User.findOne({ where: { role: 'admin' } });

        if (!adminExists) {
            console.log("⚠️ No Admin found. Creating default Admin...");
            
            // We pass the plain password 'admin'. 
            // The 'beforeCreate' hook in User.js will automatically hash it.
            await User.create({
                full_name: 'System Administrator',
                email: 'admin@gearguard.com', // Change this email if needed
                password_hash: 'admin',       // Default password
                role: 'admin',
                account_status: 'active'
            });

            console.log("✅ Default Admin Created: admin@gearguard.com / admin");
        }
    } catch (error) {
        console.error("❌ Error seeding admin:", error.message);
    }
};

// 👇 SYNC DATABASE & RUN SEEDER
sequelize.sync({ alter: true }).then(async () => {
    console.log("✅ MySQL Tables Synced Successfully");
    // Run the seeder after sync is complete
    await seedAdmin(); 
});

// ... [Rest of your middlewares, Swagger, and Routes] ...
app.use(express.json());
app.use(cors());

// Swagger Config
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'GearGuard API',
            version: '1.0.0',
            description: 'Maintenance Management System API',
            contact: {
                name: 'Backend Developer'
            }
        },
        servers: [{ url: `http://localhost:${process.env.PORT || 5000}` }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./docs/*.js', './routes/*.js'] 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/equipment', require('./routes/equipmentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/workcenters', require('./routes/workCenterRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;