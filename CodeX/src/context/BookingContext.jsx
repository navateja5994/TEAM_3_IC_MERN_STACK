import React, { createContext, useContext, useState, useEffect } from 'react';
import { currentUser as initialUser } from '../data/users';
import { foodItems } from '../data/foodItems';

const BookingContext = createContext();

export const useBooking = () => {
  return useContext(BookingContext);
};

export const BookingProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const local = localStorage.getItem('cinebook_user');
    return local ? JSON.parse(local) : initialUser;
  });

  const [booking, setBooking] = useState({
    movie: null,
    format: "",
    date: null, // object: { id, label, dateStr }
    screen: null, // object: { id, name }
    time: "",
    seats: [], // array of seat objects: { id, row, number, price, category }
    food: {}, // map of foodId -> quantity
  });

  const [currentTicket, setCurrentTicket] = useState(null);

  useEffect(() => {
    localStorage.setItem('cinebook_user', JSON.stringify(user));
  }, [user]);

  const selectMovie = (movie) => {
    setBooking({
      movie,
      format: movie.formats[0] || "2D",
      date: null,
      screen: null,
      time: "",
      seats: [],
      food: {},
    });
  };

  const selectFormat = (format) => {
    setBooking(prev => ({
      ...prev,
      format,
      // reset screen/time/seats if format changes
      screen: null,
      time: "",
      seats: []
    }));
  };

  const selectDate = (date) => {
    setBooking(prev => ({ ...prev, date, seats: [] }));
  };

  const selectShowtime = (screen, time) => {
    setBooking(prev => ({
      ...prev,
      screen: { id: screen.id, name: screen.name },
      time,
      seats: []
    }));
  };

  const toggleSeat = (seat) => {
    setBooking(prev => {
      const exists = prev.seats.some(s => s.id === seat.id);
      let updatedSeats;
      if (exists) {
        updatedSeats = prev.seats.filter(s => s.id !== seat.id);
      } else {
        updatedSeats = [...prev.seats, seat];
      }
      return { ...prev, seats: updatedSeats };
    });
  };

  const adjustFood = (foodId, delta) => {
    setBooking(prev => {
      const updatedFood = { ...prev.food };
      const currentQty = updatedFood[foodId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      if (newQty === 0) {
        delete updatedFood[foodId];
      } else {
        updatedFood[foodId] = newQty;
      }
      return { ...prev, food: updatedFood };
    });
  };

  const clearBooking = () => {
    setBooking({
      movie: null,
      format: "",
      date: null,
      screen: null,
      time: "",
      seats: [],
      food: {},
    });
  };

  const addFavoriteMovie = (movieId) => {
    setUser(prev => {
      const favorites = prev.favouriteMovies || [];
      const updated = favorites.includes(movieId)
        ? favorites.filter(id => id !== movieId)
        : [...favorites, movieId];
      return { ...prev, favouriteMovies: updated };
    });
  };

  const finalizeBooking = (paymentMethod) => {
    const bookingId = `BK-${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Calculate total prices
    const ticketCost = booking.seats.reduce((sum, s) => sum + s.price, 0);
    const convenienceFee = booking.seats.length * 30; // ₹30 per ticket
    
    // Food items summary
    const foodList = [];
    let foodCost = 0;
    
    Object.entries(booking.food).forEach(([id, qty]) => {
      const item = foodItems.find(f => f.id === id);
      if (item) {
        foodList.push({ name: item.name, qty });
        foodCost += item.price * qty;
      }
    });

    const totalAmount = ticketCost + convenienceFee + foodCost;

    const newTicket = {
      id: bookingId,
      movieTitle: booking.movie.title,
      moviePoster: booking.movie.poster,
      date: booking.date.label,
      time: booking.time,
      screen: booking.screen.name,
      seats: booking.seats.map(s => s.id),
      format: booking.format,
      totalAmount,
      foodItems: foodList,
      bookingDate: new Date().toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      }),
      paymentMethod
    };

    setUser(prev => ({
      ...prev,
      upcomingBookings: [newTicket, ...(prev.upcomingBookings || [])]
    }));

    setCurrentTicket(newTicket);
    clearBooking();

    return bookingId;
  };

  return (
    <BookingContext.Provider value={{
      user,
      booking,
      currentTicket,
      setCurrentTicket,
      selectMovie,
      selectFormat,
      selectDate,
      selectShowtime,
      toggleSeat,
      adjustFood,
      clearBooking,
      addFavoriteMovie,
      finalizeBooking
    }}>
      {children}
    </BookingContext.Provider>
  );
};
