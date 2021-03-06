const express = require("express");

const Movie = require("../models/movie");

const router = express.Router();

router.post("", (req, res, next) => {
  const movie = new Movie({
    title: req.body.title,
    content: req.body.content
  });
  movie.save().then(createdMovie => {
    res.status(201).json({
      message: "Movie added successfully",
      movieId: createdMovie._id
    });
  });
});

router.put("/:id", (req, res, next) => {
  const movie = new Movie({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Movie.updateOne({ _id: req.params.id }, movie).then(result => {
    res.status(200).json({ message: "Update successful!" });
  });
});

router.get("", (req, res, next) => {
  Movie.find().then(documents => {
    res.status(200).json({
      message: "Movies fetched successfully!",
      movies: documents
    });
  });
});

router.get("/:id", (req, res, next) => {
  Movie.findById(req.params.id).then(movie => {
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(404).json({ message: "Movie not found!" });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Movie.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Movie deleted!" });
  });
});

module.exports = router;
 