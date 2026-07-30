const Booking = require('../models/Booking');
const Show = require('../models/Show');
const Screen = require('../models/Screen');
const User = require('../models/User');
const Movie = require('../models/Movie');
const { Op } = require('sequelize');

exports.getStats = async (req, res, next) => {
  try {
    // 1. Total Bookings (Paid)
    const totalBookings = await Booking.count({ where: { paymentStatus: 'Paid' } });

    // 2. Tickets Sold (Total reserved seats across paid bookings)
    const paidBookings = await Booking.findAll({ where: { paymentStatus: 'Paid' } });
    let ticketsSold = 0;
    paidBookings.forEach(b => {
      ticketsSold += b.seats.length;
    });

    // 3. Today's Revenue (Paid bookings created today)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayBookings = await Booking.findAll({
      where: {
        paymentStatus: 'Paid',
        createdAt: {
          [Op.between]: [startOfToday, endOfToday]
        }
      }
    });

    let todayRevenue = 0;
    todayBookings.forEach(b => {
      todayRevenue += b.totalAmount;
    });

    // 4. Available Shows
    const availableShowsCount = await Show.count({ where: { isActive: true } });

    // 5. Occupancy Rate
    const activeShows = await Show.findAll({
      where: { isActive: true },
      include: [{ model: Screen, as: 'screenId' }]
    });

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
    const recentBookings = await Booking.findAll({
      where: { paymentStatus: 'Paid' },
      include: [
        { model: User, as: 'userId', attributes: ['name', 'email', 'phoneNumber'] },
        {
          model: Show,
          as: 'showId',
          include: [
            { model: Movie, as: 'movieId', attributes: ['title', 'language'] }
          ]
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    // 7. Total Customers
    const totalCustomers = await User.count({ where: { role: 'customer' } });

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
