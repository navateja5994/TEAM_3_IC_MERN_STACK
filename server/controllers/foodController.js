const FoodItem = require('../models/FoodItem');

// Get all available food items
exports.getFoodItems = async (req, res, next) => {
  try {
    const items = await FoodItem.findAll({ where: { isAvailable: true } });
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

    const item = await FoodItem.create({ name, price, image, category });

    res.status(201).json({ message: 'Food item added successfully', item });
  } catch (error) {
    next(error);
  }
};

// Admin: Update food item
exports.updateFoodItem = async (req, res, next) => {
  try {
    const item = await FoodItem.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Food item not found.' });
    }

    await item.update(req.body);

    res.json({ message: 'Food item updated successfully', item });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete/Disable food item
exports.deleteFoodItem = async (req, res, next) => {
  try {
    const item = await FoodItem.findByPk(req.params.id);

    if (!item) {
      return res.status(404).json({ error: 'Food item not found.' });
    }

    await item.update({ isAvailable: false });
    res.json({ message: 'Food item removed successfully' });
  } catch (error) {
    next(error);
  }
};
