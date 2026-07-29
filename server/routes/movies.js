const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const { authMiddleware, authorize } = require('../middleware/auth');

// Public
router.get('/', movieController.getMovies);
router.get('/:id', movieController.getMovieById);

// Admin-only CRUD
router.post('/', authMiddleware, authorize(['admin']), movieController.createMovie);
router.put('/:id', authMiddleware, authorize(['admin']), movieController.updateMovie);
router.delete('/:id', authMiddleware, authorize(['admin']), movieController.deleteMovie);

module.exports = router;
