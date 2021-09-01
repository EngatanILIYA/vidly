const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async(req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message});

        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).json({ message: "User Already Registered..." });

        user = new User({ 
            name: name,
            email: email,
            password: password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        const token = user.generateAuthToken();
        // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']))
        res.header('x-auth-token', token).json({
            message: "Uploaded Successfully...",
            user: { email: user.email }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something Went Wrong..."
        })
    }
});

module.exports = router