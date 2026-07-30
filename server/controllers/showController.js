const Show = require('../models/Show');
const Screen = require('../models/Screen');
const Seat = require('../models/Seat');
const Movie = require('../models/Movie');

// Get active shows by movie and date
exports.getShows = async (req, res, next) => {
  try {
    const { movieId, date } = req.query;
    const filter = { isActive: true };

    if (movieId) filter.movieId = movieId;
    if (date) filter.date = date;

    const shows = await Show.findAll({
      where: filter,
      include: [
        { model: Movie, as: 'movie' },
        { model: Screen, as: 'screen' }
      ],
      order: [['time', 'ASC']]
    });

    res.json(shows);
  } catch (error) {
    next(error);
  }
};

// Get show details and seats layout/occupancy status
exports.getShowById = async (req, res, next) => {
  try {
    const show = await Show.findByPk(req.params.id, {
      include: [
        { model: Movie, as: 'movie' },
        { model: Screen, as: 'screen' }
      ]
    });

    if (!show || !show.isActive) {
      return res.status(404).json({ error: 'Show not found.' });
    }

    // Retrieve all physical seats in this screen using raw screenId attribute
    const seats = await Seat.findAll({
      where: { screenId: show.screenId },
      order: [['row', 'ASC'], ['number', 'ASC']]
    });

    res.json({
      show,
      seats,
      bookedSeats: show.bookedSeats
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create new Show (assign screen, movie, date, showtime, and ticket category prices)
exports.createShow = async (req, res, next) => {
  try {
    const { movieId, screenId, date, time, prices } = req.body;

    if (!movieId || !screenId || !date || !time) {
      return res.status(400).json({ error: 'Please provide movieId, screenId, date, and time.' });
    }

    // Validate Screen exists
    const screen = await Screen.findByPk(screenId);
    if (!screen || !screen.isActive) {
      return res.status(404).json({ error: 'Screen not found.' });
    }

    // Check for show clash on same screen, date, and time
    const clash = await Show.findOne({
      where: { screenId, date, time, isActive: true }
    });
    if (clash) {
      return res.status(400).json({ error: 'Another show is already scheduled in this screen at this date and time.' });
    }

    const show = await Show.create({
      movieId,
      screenId,
      date,
      time,
      prices: prices || { Standard: 150, Premium: 250, Recliner: 400 }
    });

    res.status(201).json({ message: 'Show scheduled successfully', show });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete/Cancel Show
exports.deleteShow = async (req, res, next) => {
  try {
    const show = await Show.findByPk(req.params.id);

    if (!show) {
      return res.status(404).json({ error: 'Show not found.' });
    }

    await show.update({ isActive: false });
    res.json({ message: 'Show cancelled successfully' });
  } catch (error) {
    next(error);
  }
};
