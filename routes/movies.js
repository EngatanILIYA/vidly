const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('name');
    res.send(movies);
});
router.post('/', async (req, res) => {
    const { title, genreId, genreName, numberInStock, dailyRentalRate } = req.body;

    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).json({message: error.details[0].message});

        const genre = await Genre.findById(req.body.genreId);
        if (!genre) return res.status(400).send('Invalid Genre...');

        let movie = new Movie({
            title: title,
            genreId: genreId,
            genreName: genreName,
            numberInStock: numberInStock,
            dailyRentalRate: dailyRentalRate
        });
        movie = await movie.save();
        return res.status(200).json({
            message: 'Added successfully',
            movie: {
                _id: movie._id,
                title: movie.title,
                genreName: movie.genreName
            }
        })

    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: "something went wrong..." })
    }
});

router.put('/:id', async (req, res) => {
    const { title, genreId, genreName, numberInStock, dailyRentalRate} = req.body;

    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error);
    
        const genre = await Genre.findById(req.body.genreId);
        if (!genre) return res.status(400).send('Invalid Genre...');
    
        const movie = await Movie.findByIdAndUpdate(req.params.id,
            {
                title: title,
                genreId: genreId,
                genreName: genreName,
                numberInStock: numberInStock,
                dailyRentalRate: dailyRentalRate
            }, { new: true });

        return res.status(200).json({ 
            message: "Updated Successfully..."
        });
        
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({ error: "Something Went Wrong..."})
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const movie = await Movie.findByIdAndRemove(req.p/arams.id);
    
        if (!movie) return res.status(400).send('The Movie With The Given ID Was Not Found...');
        
        return res.status(200).json({
            message: "Deleted Successfully..."
        })
        
    } catch (error) {
        return res.status(500).json({ error: "Somthing Went Wrong..."})
    }
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie) return res.status(400).send('The Movie With The Given ID Was Not Found...');

    res.send(movie);
});

module.exports = router;