import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {
  Home,
  Movies,
  MovieDetails,
  Booking,
  Food,
  Checkout,
  Payment,
  Ticket,
  Profile,
  Offers
} from './pages/MovieAppPages';
import './App.css';

function App() {
  return (
    <BookingProvider>
      <Router>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/booking/:id" element={<Booking />} />
              <Route path="/food" element={<Food />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/ticket" element={<Ticket />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/offers" element={<Offers />} />
              {/* Fallback route */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </BookingProvider>
  );
}

export default App;
