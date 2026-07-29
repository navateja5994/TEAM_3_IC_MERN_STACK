const Screen = require('../models/Screen');
const Seat = require('../models/Seat');

// Get all screens
exports.getScreens = async (req, res, next) => {
  try {
    const screens = await Screen.find({ isActive: true });
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

    const existingScreen = await Screen.findOne({ name });
    if (existingScreen) {
      return res.status(400).json({ error: 'Screen with this name already exists.' });
    }

    const screen = new Screen({ name, type, rows, cols });
    await screen.save();

    // Auto-generate physical seats
    // Row characters list
    const rowChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const seats = [];

    for (let r = 0; r < rows; r++) {
      const rowLabel = rowChars[r] || `R${r + 1}`;
      
      // Categorize seats by row position
      // E.g., first 40% are Standard, middle 40% are Premium, top 20% are Recliner
      let category = 'Standard';
      const rowRatio = r / rows;
      if (rowRatio >= 0.8) {
        category = 'Recliner';
      } else if (rowRatio >= 0.4) {
        category = 'Premium';
      }

      for (let c = 1; c <= cols; c++) {
        seats.push({
          screenId: screen._id,
          row: rowLabel,
          number: c,
          category
        });
      }
    }

    // Save seats
    await Seat.insertMany(seats);

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
    const screen = await Screen.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: false } },
      { new: true }
    );

    if (!screen) {
      return res.status(404).json({ error: 'Screen not found.' });
    }

    res.json({ message: 'Screen deleted successfully' });
  } catch (error) {
    next(error);
  }
};
