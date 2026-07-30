const Movie = require('../models/Movie');
const { Op } = require('sequelize');

// Get all movies (supports language, genre, and status filters)
exports.getMovies = async (req, res, next) => {
  try {
    const { language, genre, status } = req.query;
    const filter = { isActive: true };

    if (language && language !== 'All Languages') {
      filter.language = language;
    }

    if (genre) {
      filter.genres = {
        [Op.like]: `%"${genre}"%`
      };
    }

    if (status) {
      filter.status = status;
    }

    const movies = await Movie.findAll({
      where: filter,
      order: [['releaseDate', 'DESC']]
    });
    res.json(movies);
  } catch (error) {
    next(error);
  }
};

// Get single movie details
exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie || !movie.isActive) {
      return res.status(404).json({ error: 'Movie not found.' });
    }
    res.json(movie);
  } catch (error) {
    next(error);
  }
};

// Admin: Add new movie
exports.createMovie = async (req, res, next) => {
  try {
    const {
      title,
      description,
      duration,
      rating,
      numRatings,
      language,
      genres,
      certificate,
      formats,
      releaseDate,
      posterUrl,
      backdropUrl,
      trailerUrl,
      cast,
      crew,
      status
    } = req.body;

    const movie = await Movie.create({
      title,
      description,
      duration,
      rating,
      numRatings,
      language,
      genres: Array.isArray(genres) ? genres : [genres],
      certificate,
      formats: Array.isArray(formats) ? formats : [formats],
      releaseDate,
      posterUrl,
      backdropUrl,
      trailerUrl,
      cast: cast || [],
      crew: crew || [],
      status: status || 'Now Showing'
    });

    res.status(201).json({ message: 'Movie created successfully', movie });
  } catch (error) {
    next(error);
  }
};

// Admin: Edit movie details
exports.updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found.' });
    }

    // Apply updates
    await movie.update(req.body);

    res.json({ message: 'Movie updated successfully', movie });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete (deactivate) movie
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found.' });
    }

    await movie.update({ isActive: false });
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    next(error);
  }
};
