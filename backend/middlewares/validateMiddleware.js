const Joi = require('joi');

const signupSchema = Joi.object({
    full_name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'technician', 'admin').optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

exports.validateSignup = (req, res, next) => {
    const { error } = signupSchema.validate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });
    next();
};

exports.validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });
    next();
};