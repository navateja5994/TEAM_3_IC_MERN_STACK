const Offer = require('../models/Offer');

// Get all active offers
exports.getOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find({ isActive: true, expiryDate: { $gt: new Date() } });
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

    const offerExists = await Offer.findOne({ code: code.toUpperCase() });
    if (offerExists) {
      return res.status(400).json({ error: 'Coupon code already exists.' });
    }

    const offer = new Offer({
      code: code.toUpperCase(),
      description,
      discountPercentage,
      maxDiscount,
      expiryDate
    });

    await offer.save();
    res.status(201).json({ message: 'Offer created successfully', offer });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete (disable) offer
exports.deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: false } },
      { new: true }
    );

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found.' });
    }

    res.json({ message: 'Offer disabled successfully' });
  } catch (error) {
    next(error);
  }
};
