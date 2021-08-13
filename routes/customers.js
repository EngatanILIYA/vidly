const { Customer, validate } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');

    res.send(customers);
});

router.post('/', async (req, res) => {
    const {name, isGold, phone} = req.body
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let customer = new Customer({
            name: name,
            isGold: isGold,
            phone: phone
        });
        customer = await customer.save();
        return res.status(200).json({
            message: "Added Successfully...",
            customer: {
                name: customer.name
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: " Something Went Wrong..."
        })
    }
});

router.put('/:id', async (req, res) => {
    const { name, isGold, phone } = req.body
    try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id,
        {
            name: name,
            isGold: isGold,
            phone: phone
        }, { new: true });

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    return res.status(200).json({ 
        message: "Updated Successfully...",
        customer: {
            name: customer.name
        }
    })

    res.send(customer);
    } catch (error) {
        return res.status(500).json({
            message: "Something Went Wrong..."
        })
    }
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) return res.status(404).send('The customer with the given ID was not found.');

    res.send(customer);
});

module.exports = router;