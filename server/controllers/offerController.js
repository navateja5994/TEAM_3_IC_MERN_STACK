const Offer = require('../models/Offer');
const { Op } = require('sequelize');

// Get all active offers
exports.getOffers = async (req, res, next) => {
  try {
    const offers = await Offer.findAll({
      where: {
        isActive: true,
        expiryDate: {
          [Op.gt]: new Date()
        }
      }
    });
    res.json(offers);
  } catch (error) {
    next(error);
  }
};

// Admin: Add new offer
exports.createOffer = async (req, res, next) => {
  try {
    const { code, description, discountPercentage, maxDiscount, expiryDate } = req.body;

    if (!code || !description || !discountPercentage || !maxDiscount || !expiryDate) {
      return res.status(400).json({ error: 'Please fill all required coupon fields.' });
    }

    const offerExists = await Offer.findOne({ where: { code: code.toUpperCase() } });
    if (offerExists) {
      return res.status(400).json({ error: 'Coupon code already exists.' });
    }

    const offer = await Offer.create({
      code: code.toUpperCase(),
      description,
      discountPercentage,
      maxDiscount,
      expiryDate
    });

    res.status(201).json({ message: 'Offer created successfully', offer });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete (disable) offer
exports.deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByPk(req.params.id);

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found.' });
    }

    await offer.update({ isActive: false });
    res.json({ message: 'Offer disabled successfully' });
  } catch (error) {
    next(error);
  }
};
