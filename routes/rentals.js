const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();


Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-deteOut');
    res.send(rentals);
});

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(400).send('Invalid Customer...');

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send("Invalid Movie...");

    if (movie.numberInStock === 0) return res.status(400).send('Movie Not In Stock...');

    let rental = new Rental ({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    try {
        rental = new Fawn.Task()
            .save('rentals', rental)
            .update('movies', { 
                _id: movie._id 
            }, 
            { 
                $inc: {
                    numberInStock: -1
                }
            })
            .run();
            return res.status(200).json({
                message: "Added Successfully",
                rental: {
                    title: rental.title,
                    genreName: rental.genreName
                }
            })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Something Went Wrong...'})
    }
});
router.get('/', async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if(!rental) return res,status(404).send('The Rental With The Given ID Was Not Found...');

    res.send(rental);
});

module.exports = router;