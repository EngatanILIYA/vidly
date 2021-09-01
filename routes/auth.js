const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const { max } = require('lodash');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).json({ message: "Invalid Email or Password..." });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Invalid Email or Password..." });
        
        const token = user.generateAuthToken();
        res.send(token)
        
    } catch (error) {
        return res.status(500).json({
            message: "Something Went Wrong...",
        })
    }
});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;