const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Seat = require('../models/Seat');
const FoodItem = require('../models/FoodItem');
const Offer = require('../models/Offer');
const Movie = require('../models/Movie');
const Screen = require('../models/Screen');
const { sequelize } = require('../config/db');

// Create a new Booking (Pending state, atomic seat lock via SQL Transaction)
exports.createBooking = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { showId, seats, foodItems, couponCode } = req.body;
    const userId = req.user.id;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Please select at least one seat.' });
    }

    // 1. Lock the Show row to prevent concurrent race conditions
    const show = await Show.findByPk(showId, {
      include: [{ model: Screen, as: 'screenId' }],
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!show || !show.isActive) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Show not found.' });
    }

    // 2. Double check seat availability on Show
    const currentBookedSeats = show.bookedSeats; // Array via getter
    const alreadyBooked = seats.some(seat => currentBookedSeats.includes(seat));
    if (alreadyBooked) {
      await transaction.rollback();
      return res.status(400).json({ error: 'One or more selected seats are already booked.' });
    }

    // 3. Query physical seat categories to determine ticket prices
    // Parse seat codes, e.g. "A5" -> row: "A", number: 5
    const seatQueries = seats.map(seatStr => {
      const match = seatStr.match(/^([A-Z]+)(\d+)$/);
      if (!match) return null;
      return { row: match[1], number: parseInt(match[2]) };
    }).filter(Boolean);

    // Fetch matching seat configurations
    const seatsConfig = [];
    for (const q of seatQueries) {
      const seat = await Seat.findOne({
        where: {
          screenId: show.screenId.id,
          row: q.row,
          number: q.number
        },
        transaction
      });
      if (seat) seatsConfig.push(seat);
    }

    // Calculate ticket subtotal based on seat category
    let ticketSubtotal = 0;
    for (const seatStr of seats) {
      const match = seatStr.match(/^([A-Z]+)(\d+)$/);
      const row = match ? match[1] : '';
      const num = match ? parseInt(match[2]) : 0;
      
      const config = seatsConfig.find(s => s.row === row && s.number === num);
      const category = config ? config.category : 'Standard';

      const price = show.prices[category] || 150;
      ticketSubtotal += price;
    }

    // 4. Update Show bookedSeats list (guarantees concurrency safety inside transaction)
    const updatedBookedSeats = [...currentBookedSeats, ...seats];
    show.bookedSeats = updatedBookedSeats; // Setter stringifies it
    await show.save({ transaction });

    // 5. Calculate Food Subtotal
    let foodSubtotal = 0;
    const resolvedFoodItems = [];

    if (foodItems && Array.isArray(foodItems) && foodItems.length > 0) {
      const foodItemIds = foodItems.map(item => item.foodItemId);
      const dbFoodItems = await FoodItem.findAll({
        where: { id: foodItemIds },
        transaction
      });

      for (const item of foodItems) {
        const dbItem = dbFoodItems.find(f => f.id.toString() === item.foodItemId.toString());
        if (dbItem && dbItem.isAvailable) {
          const itemTotal = dbItem.price * item.quantity;
          foodSubtotal += itemTotal;
          resolvedFoodItems.push({
            foodItemId: dbItem.id,
            name: dbItem.name,
            price: dbItem.price,
            quantity: item.quantity
          });
        }
      }
    }

    // 6. Apply Promo Coupon if applicable
    let discount = 0;
    if (couponCode) {
      const offer = await Offer.findOne({
        where: { code: couponCode.trim().toUpperCase(), isActive: true },
        transaction
      });
      if (offer && new Date() < offer.expiryDate) {
        const rawDiscount = (ticketSubtotal * offer.discountPercentage) / 100;
        discount = Math.min(rawDiscount, offer.maxDiscount);
      }
    }

    // 7. Tax and Fee Calculations
    const convenienceFee = 30 * seats.length;
    const taxableAmount = (ticketSubtotal - discount) + foodSubtotal;
    const tax = Math.round(taxableAmount * 0.18); // 18% GST
    const totalAmount = taxableAmount + convenienceFee + tax;

    // 8. Create unique Booking reference ID
    const bookingId = 'MCB-' + Math.floor(100000 + Math.random() * 900000);

    const booking = await Booking.create({
      userId,
      showId,
      bookingId,
      seats,
      foodItems: resolvedFoodItems,
      ticketSubtotal: ticketSubtotal - discount,
      foodSubtotal,
      convenienceFee,
      tax,
      totalAmount,
      paymentStatus: 'Pending',
      bookingStatus: 'Booked',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingId}`
    }, { transaction });

    // Commit Transaction (lock released successfully)
    await transaction.commit();

    res.status(201).json({
      message: 'Booking initialized. Complete mock payment.',
      booking
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

// Confirm Mock Payment & Finalize booking
exports.confirmPayment = async (req, res, next) => {
  try {
    const { bookingId, paymentMethod } = req.body;

    if (!bookingId || !paymentMethod) {
      return res.status(400).json({ error: 'Please provide bookingId and paymentMethod.' });
    }

    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    if (booking.paymentStatus === 'Paid') {
      return res.status(400).json({ error: 'Booking is already paid.' });
    }

    // Update payment status
    await booking.update({ paymentStatus: 'Paid' });

    res.json({
      message: 'Payment confirmed successfully.',
      booking
    });
  } catch (error) {
    next(error);
  }
};

// Get User's Booking History
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Show,
          as: 'showId',
          include: [
            { model: Movie, as: 'movieId' },
            { model: Screen, as: 'screenId' }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// Get specific Booking Details
exports.getBookingDetails = async (req, res, next) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        {
          model: Show,
          as: 'showId',
          include: [
            { model: Movie, as: 'movieId' },
            { model: Screen, as: 'screenId' }
          ]
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Verify authorized user
    if (booking.userId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access to booking.' });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// Cancel Booking (Admin/User)
exports.cancelBooking = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const booking = await Booking.findByPk(req.params.id, { transaction });
    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Verify auth
    if (booking.userId.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
      await transaction.rollback();
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    if (booking.bookingStatus === 'Cancelled') {
      await transaction.rollback();
      return res.status(400).json({ error: 'Booking is already cancelled.' });
    }

    // 1. Release seats from Show
    const show = await Show.findByPk(booking.showId, { transaction, lock: transaction.LOCK.UPDATE });
    if (show) {
      const currentBooked = show.bookedSeats;
      const updatedBooked = currentBooked.filter(seat => !booking.seats.includes(seat));
      show.bookedSeats = updatedBooked;
      await show.save({ transaction });
    }

    // 2. Mark booking status as Cancelled
    await booking.update({
      bookingStatus: 'Cancelled',
      paymentStatus: 'Cancelled'
    }, { transaction });

    await transaction.commit();
    res.json({ message: 'Booking cancelled successfully. Refund initiated.' });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
