const FoodItem = require('../models/FoodItem');

// Get all available food items
exports.getFoodItems = async (req, res, next) => {
  try {
    const items = await FoodItem.find({ isAvailable: true });
    res.json(items);
  } catch (error) {
    next(error);
  }
};

// Admin: Add new food item
exports.createFoodItem = async (req, res, next) => {
  try {
    const { name, price, image, category } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Please provide name and price.' });
    }

    const item = new FoodItem({ name, price, image, category });
    await item.save();

    res.status(201).json({ message: 'Food item added successfully', item });
  } catch (error) {
    next(error);
  }
};

// Admin: Update food item
exports.updateFoodItem = async (req, res, next) => {
  try {
    const item = await FoodItem.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ error: 'Food item not found.' });
    }

    res.json({ message: 'Food item updated successfully', item });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete/Disable food item
exports.deleteFoodItem = async (req, res, next) => {
  try {
    const item = await FoodItem.findByIdAndUpdate(
      req.params.id,
      { $set: { isAvailable: false } },
      { new: true }
    );

    if (!item) {
      return res.status(404).json({ error: 'Food item not found.' });
    }

    res.json({ message: 'Food item removed successfully' });
  } catch (error) {
    next(error);
  }
};
