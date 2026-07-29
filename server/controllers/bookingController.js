const Booking = require('../models/Booking');
const BookingSeat = require('../models/BookingSeat');
const Show = require('../models/Show');
const Seat = require('../models/Seat');
const FoodItem = require('../models/FoodItem');
const FoodOrder = require('../models/FoodOrder');
const Offer = require('../models/Offer');
const Payment = require('../models/Payment');

// Create a new Booking (Pending state, atomic seat lock)
exports.createBooking = async (req, res, next) => {
  try {
    const { showId, seats, foodItems, couponCode } = req.body;
    const userId = req.user.id;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ error: 'Please select at least one seat.' });
    }

    const show = await Show.findById(showId).populate('screenId');
    if (!show || !show.isActive) {
      return res.status(404).json({ error: 'Show not found.' });
    }

    // 1. Double check seat availability on Show
    const alreadyBooked = seats.some(seat => show.bookedSeats.includes(seat));
    if (alreadyBooked) {
      return res.status(400).json({ error: 'One or more selected seats are already booked.' });
    }

    // 2. Query physical seat categories to determine ticket prices
    // Parse seat codes, e.g. "A5" -> row: "A", number: 5
    const seatQueries = seats.map(seatStr => {
      const match = seatStr.match(/^([A-Z]+)(\d+)$/);
      if (!match) return null;
      return { row: match[1], number: parseInt(match[2]) };
    }).filter(Boolean);

    // Fetch matching seat configurations
    const seatsConfig = await Seat.find({
      screenId: show.screenId._id,
      $or: seatQueries.map(q => ({ row: q.row, number: q.number }))
    });

    // Calculate ticket subtotal based on seat category
    let ticketSubtotal = 0;
    const seatCategoryMap = {}; // mapping for confirmation

    for (const seatStr of seats) {
      const match = seatStr.match(/^([A-Z]+)(\d+)$/);
      const row = match ? match[1] : '';
      const num = match ? parseInt(match[2]) : 0;
      
      const config = seatsConfig.find(s => s.row === row && s.number === num);
      const category = config ? config.category : 'Standard';
      seatCategoryMap[seatStr] = category;

      const price = show.prices[category] || 150;
      ticketSubtotal += price;
    }

    // 3. Atomically update Show bookedSeats list (guarantees concurrency safety)
    const updatedShow = await Show.findOneAndUpdate(
      { _id: showId, bookedSeats: { $nin: seats }, isActive: true },
      { $push: { bookedSeats: { $each: seats } } },
      { new: true }
    );

    if (!updatedShow) {
      return res.status(400).json({ error: 'Failed to reserve seats. One or more seats were booked by another customer.' });
    }

    // 4. Calculate Food Subtotal
    let foodSubtotal = 0;
    const resolvedFoodItems = [];

    if (foodItems && Array.isArray(foodItems) && foodItems.length > 0) {
      const foodItemIds = foodItems.map(item => item.foodItemId);
      const dbFoodItems = await FoodItem.find({ _id: { $in: foodItemIds } });

      for (const item of foodItems) {
        const dbItem = dbFoodItems.find(f => f._id.toString() === item.foodItemId);
        if (dbItem && dbItem.isAvailable) {
          const itemTotal = dbItem.price * item.quantity;
          foodSubtotal += itemTotal;
          resolvedFoodItems.push({
            foodItemId: dbItem._id,
            name: dbItem.name,
            price: dbItem.price,
            quantity: item.quantity
          });
        }
      }
    }

    // 5. Apply Promo Coupon if applicable
    let discount = 0;
    if (couponCode) {
      const offer = await Offer.findOne({ code: couponCode.trim().toUpperCase(), isActive: true });
      if (offer && new Date() < offer.expiryDate) {
        const rawDiscount = (ticketSubtotal * offer.discountPercentage) / 100;
        discount = Math.min(rawDiscount, offer.maxDiscount);
      }
    }

    // 6. Tax and Fee Calculations (e.g. GST 18%, Convenience fee 30 per ticket or flat)
    const convenienceFee = 30 * seats.length;
    const taxableAmount = (ticketSubtotal - discount) + foodSubtotal;
    const tax = Math.round(taxableAmount * 0.18); // 18% GST
    const totalAmount = taxableAmount + convenienceFee + tax;

    // 7. Create unique Booking reference ID
    const bookingId = 'MCB-' + Math.floor(100000 + Math.random() * 900000);

    const booking = new Booking({
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
    });

    await booking.save();

    // 8. Unique lock inserts into BookingSeat (secondary check / record keeping)
    try {
      const bookingSeats = seats.map(seat => ({
        showId,
        seatNumber: seat,
        bookingId: booking._id,
        status: 'booked'
      }));
      await BookingSeat.insertMany(bookingSeats);
    } catch (err) {
      // Clean up and rollback seat selection on clash
      await Show.findByIdAndUpdate(showId, { $pull: { bookedSeats: { $in: seats } } });
      await Booking.findByIdAndDelete(booking._id);
      return res.status(400).json({ error: 'Seat collision detected. Reservation rolled back.' });
    }

    // 9. Record FoodOrder if food is purchased
    if (resolvedFoodItems.length > 0) {
      const foodOrder = new FoodOrder({
        bookingId: booking._id,
        userId,
        items: resolvedFoodItems.map(f => ({
          foodItemId: f.foodItemId,
          quantity: f.quantity,
          price: f.price
        })),
        totalAmount: foodSubtotal
      });
      await foodOrder.save();
    }

    res.status(201).json({
      message: 'Booking initialized. Complete mock payment.',
      booking
    });
  } catch (error) {
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

    const booking = await Booking.findById(bookingId).populate('showId');
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    if (booking.paymentStatus === 'Paid') {
      return res.status(400).json({ error: 'Booking is already paid.' });
    }

    // Update payment status
    booking.paymentStatus = 'Paid';
    await booking.save();

    // Create Payment log
    const transactionId = 'TXN-' + Math.floor(10000000 + Math.random() * 90000000);
    const payment = new Payment({
      bookingId: booking._id,
      userId: booking.userId,
      paymentMethod,
      transactionId,
      amount: booking.totalAmount,
      status: 'Success'
    });
    await payment.save();

    res.json({
      message: 'Payment confirmed successfully.',
      booking,
      payment
    });
  } catch (error) {
    next(error);
  }
};

// Get User's Booking History
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate({
        path: 'showId',
        populate: [
          { path: 'movieId' },
          { path: 'screenId' }
        ]
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

// Get specific Booking Details
exports.getBookingDetails = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'showId',
        populate: [
          { path: 'movieId' },
          { path: 'screenId' }
        ]
      });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Verify authorized user
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized access to booking.' });
    }

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

// Cancel Booking (Admin/User)
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    // Verify auth
    if (booking.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized.' });
    }

    if (booking.bookingStatus === 'Cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled.' });
    }

    // 1. Release seats from Show
    await Show.findByIdAndUpdate(booking.showId, {
      $pull: { bookedSeats: { $in: booking.seats } }
    });

    // 2. Remove locks from BookingSeat
    await BookingSeat.deleteMany({ bookingId: booking._id });

    // 3. Mark booking status as Cancelled
    booking.bookingStatus = 'Cancelled';
    booking.paymentStatus = 'Cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully. Refund initiated.' });
  } catch (error) {
    next(error);
  }
};
