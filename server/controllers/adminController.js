const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Screen = require('../models/Screen');
const User = require('../models/User');
const Payment = require('../models/Payment');

exports.getStats = async (req, res, next) => {
  try {
    // 1. Total Bookings (Paid)
    const totalBookings = await Booking.countDocuments({ paymentStatus: 'Paid' });

    // 2. Tickets Sold (Total reserved seats across paid bookings)
    const paidBookings = await Booking.find({ paymentStatus: 'Paid' });
    let ticketsSold = 0;
    paidBookings.forEach(b => {
      ticketsSold += b.seats.length;
    });

    // 3. Today's Revenue (Paid bookings created today)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayBookings = await Booking.find({
      paymentStatus: 'Paid',
      createdAt: { $gte: startOfToday, $lte: endOfToday }
    });

    let todayRevenue = 0;
    todayBookings.forEach(b => {
      todayRevenue += b.totalAmount;
    });

    // 4. Available Shows
    const availableShowsCount = await Show.countDocuments({ isActive: true });

    // 5. Occupancy Rate
    // (Total booked seats on all active shows / Total capacity of screens for all active shows) * 100
    const activeShows = await Show.find({ isActive: true }).populate('screenId');
    let totalBookedSeatsCount = 0;
    let totalCapacity = 0;

    activeShows.forEach(show => {
      if (show.screenId) {
        totalBookedSeatsCount += show.bookedSeats.length;
        totalCapacity += (show.screenId.rows * show.screenId.cols);
      }
    });

    const occupancyRate = totalCapacity > 0
      ? parseFloat(((totalBookedSeatsCount / totalCapacity) * 100).toFixed(1))
      : 0;

    // 6. Recent bookings list
    const recentBookings = await Booking.find({ paymentStatus: 'Paid' })
      .populate('userId', 'name email phoneNumber')
      .populate({
        path: 'showId',
        populate: { path: 'movieId', select: 'title language' }
      })
      .sort({ createdAt: -1 })
      .limit(10);

    // 7. Total Customers
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    res.json({
      totalBookings,
      ticketsSold,
      todayRevenue,
      availableShowsCount,
      occupancyRate,
      totalCustomers,
      recentBookings
    });
  } catch (error) {
    next(error);
  }
};
