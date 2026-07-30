const Screen = require('../models/Screen');
const Seat = require('../models/Seat');

// Get all screens
exports.getScreens = async (req, res, next) => {
  try {
    const screens = await Screen.findAll({ where: { isActive: true } });
    res.json(screens);
  } catch (error) {
    next(error);
  }
};

// Admin: Create Screen & generate seats layout automatically
exports.createScreen = async (req, res, next) => {
  try {
    const { name, type, rows, cols } = req.body;

    if (!name || !type || !rows || !cols) {
      return res.status(400).json({ error: 'Please provide screen name, type, rows count, and columns count.' });
    }

    const existingScreen = await Screen.findOne({ where: { name } });
    if (existingScreen) {
      return res.status(400).json({ error: 'Screen with this name already exists.' });
    }

    const screen = await Screen.create({ name, type, rows, cols });

    // Auto-generate physical seats
    // Row characters list
    const rowChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const seats = [];

    for (let r = 0; r < rows; r++) {
      const rowLabel = rowChars[r] || `R${r + 1}`;
      
      // Categorize seats by row position
      let category = 'Standard';
      const rowRatio = r / rows;
      if (rowRatio >= 0.8) {
        category = 'Recliner';
      } else if (rowRatio >= 0.4) {
        category = 'Premium';
      }

      for (let c = 1; c <= cols; c++) {
        seats.push({
          screenId: screen.id, // Use SQL .id instead of Mongoose ._id
          row: rowLabel,
          number: c,
          category
        });
      }
    }

    // Save seats in bulk via SQL
    await Seat.bulkCreate(seats);

    res.status(201).json({
      message: 'Screen created and seat layouts initialized successfully',
      screen,
      seatsCount: seats.length
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete (deactivate) Screen
exports.deleteScreen = async (req, res, next) => {
  try {
    const screen = await Screen.findByPk(req.params.id);

    if (!screen) {
      return res.status(404).json({ error: 'Screen not found.' });
    }

    await screen.update({ isActive: false });
    res.json({ message: 'Screen deleted successfully' });
  } catch (error) {
    next(error);
  }
};
