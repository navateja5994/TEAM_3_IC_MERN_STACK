const Movie = require('../models/Movie');

// Get all movies (supports language, genre, and status filters)
exports.getMovies = async (req, res, next) => {
  try {
    const { language, genre, status } = req.query;
    const filter = { isActive: true };

    if (language && language !== 'All Languages') {
      filter.language = language;
    }

    if (genre) {
      filter.genres = genre; // matches if genre is in genres array
    }

    if (status) {
      filter.status = status;
    }

    const movies = await Movie.find(filter).sort({ releaseDate: -1 });
    res.json(movies);
  } catch (error) {
    next(error);
  }
};

// Get single movie details
exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
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

    const movie = new Movie({
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

    await movie.save();
    res.status(201).json({ message: 'Movie created successfully', movie });
  } catch (error) {
    next(error);
  }
};

// Admin: Edit movie details
exports.updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found.' });
    }

    res.json({ message: 'Movie updated successfully', movie });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete (deactivate) movie
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: false } },
      { new: true }
    );

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found.' });
    }

    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    next(error);
  }
};
