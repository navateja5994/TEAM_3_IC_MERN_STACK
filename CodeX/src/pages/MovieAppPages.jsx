import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiStarFill, RiTimeLine, RiPlayCircleLine, RiCalendarLine, RiUser3Line,
  RiDownloadLine, RiPrinterLine, RiHeartFill, RiHeartLine, RiShoppingBagLine,
  RiCloseLine, RiCheckDoubleLine, RiBankCardFill, RiQrCodeLine, RiWalletLine,
  RiAddLine, RiSubtractLine, RiTicketLine, RiArrowRightLine, RiInformationLine
} from 'react-icons/ri';

import { useBooking } from '../context/BookingContext';
import { movies } from '../data/movies';
import { screens, generateDates, generateSeatLayout } from '../data/shows';
import { foodItems } from '../data/foodItems';
import { offers } from '../data/offers';
import HeroBanner from '../components/HeroBanner';
import LanguageFilter from '../components/LanguageFilter';
import './MovieApp.css';

// Page animations
const pageTransition = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
  transition: { duration: 0.4, ease: 'easeOut' }
};

/* ==========================================================================
   1. HOME PAGE
   ========================================================================== */
export function Home() {
  const [activeLanguage, setActiveLanguage] = useState('All Movies');
  const navigate = useNavigate();

  const handleSelectLanguage = (lang) => {
    setActiveLanguage(lang);
  };

  const filteredNowShowing = movies.filter(movie => {
    const isShowing = movie.status === 'now-showing';
    const matchesLang = activeLanguage === 'All Movies' || movie.language === activeLanguage;
    return isShowing && matchesLang;
  });

  const comingSoonMovies = movies.filter(movie => movie.status === 'coming-soon');
  const trendingMovies = movies.filter(movie => movie.isTrending);

  return (
    <motion.div {...pageTransition} className="home-page-container">
      <HeroBanner movies={movies} />
      
      <div className="container main-content-layout">
        {/* Language Filter */}
        <section className="section-container">
          <h2 className="section-title">Explore by <span className="gold-text">Language</span></h2>
          <LanguageFilter activeLanguage={activeLanguage} onSelectLanguage={handleSelectLanguage} />
        </section>

        {/* Now Showing Grid */}
        <section className="section-container">
          <h2 className="section-title">Now <span className="gold-text">Showing</span></h2>
          {filteredNowShowing.length === 0 ? (
            <div className="empty-state">
              <p>No movies available in {activeLanguage} right now.</p>
            </div>
          ) : (
            <div className="movie-grid">
              {filteredNowShowing.map(movie => (
                <MovieCardGridItem key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </section>

        {/* Trending Section */}
        {trendingMovies.length > 0 && (
          <section className="section-container trending-section">
            <h2 className="section-title">Trending <span className="gold-text">Movies</span></h2>
            <div className="movie-grid">
              {trendingMovies.map(movie => (
                <MovieCardGridItem key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        )}

        {/* Coming Soon Grid */}
        <section className="section-container">
          <h2 className="section-title">Coming <span className="gold-text">Soon</span></h2>
          <div className="movie-grid">
            {comingSoonMovies.map(movie => (
              <MovieCardGridItem key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}

// Supporting MovieCard in grid
function MovieCardGridItem({ movie }) {
  const { selectMovie } = useBooking();
  const navigate = useNavigate();

  const handleAction = (e) => {
    e.stopPropagation();
    selectMovie(movie);
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie-card-grid-item glass-card" onClick={handleAction}>
      <div className="movie-card-poster-w">
        <img src={movie.poster} alt={movie.title} />
        <div className="movie-card-overlay">
          {movie.status === 'now-showing' ? (
            <button className="btn-primary" onClick={handleAction}>Book Now</button>
          ) : (
            <span className="coming-soon-badge">Coming Soon</span>
          )}
        </div>
        {movie.userRating > 0 && (
          <div className="card-rating">
            <RiStarFill /> {movie.userRating}
          </div>
        )}
      </div>
      <div className="movie-card-desc">
        <h3>{movie.title}</h3>
        <p className="genres">{movie.genre.join(', ')}</p>
        <div className="meta">
          <span>{movie.language}</span>
          <span>{movie.duration}</span>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. MOVIES LISTING PAGE
   ========================================================================== */
export function Movies() {
  const [activeLanguage, setActiveLanguage] = useState('All Movies');
  const [searchVal, setSearchVal] = useState('');
  const location = useLocation();

  // Load search query from URL if any
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchVal(searchParam);
    }
  }, [location.search]);

  const filteredMovies = movies.filter(movie => {
    const matchesLang = activeLanguage === 'All Movies' || movie.language === activeLanguage;
    const matchesSearch = movie.title.toLowerCase().includes(searchVal.toLowerCase()) ||
                          movie.genre.some(g => g.toLowerCase().includes(searchVal.toLowerCase())) ||
                          movie.language.toLowerCase().includes(searchVal.toLowerCase());
    return matchesLang && matchesSearch;
  });

  return (
    <motion.div {...pageTransition} className="movies-page-container container">
      <div className="movies-page-header">
        <h1 className="page-title text-gold">Movies in Mall CineBook</h1>
        <div className="movies-search-bar">
          <input 
            type="text" 
            placeholder="Search by title, genre, language..." 
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
        </div>
      </div>

      <LanguageFilter activeLanguage={activeLanguage} onSelectLanguage={setActiveLanguage} />

      <div className="movie-grid-container">
        {filteredMovies.length === 0 ? (
          <div className="empty-state">
            <p>No movies matched your selection. Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="movie-grid">
            {filteredMovies.map(movie => (
              <MovieCardGridItem key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   3. MOVIE DETAILS PAGE
   ========================================================================== */
export function MovieDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, selectMovie, selectFormat, addFavoriteMovie, user } = useBooking();
  const [showTrailer, setShowTrailer] = useState(false);

  const movie = movies.find(m => m.id === id);

  useEffect(() => {
    if (movie) {
      selectMovie(movie);
      // Auto trigger trailer if redirected with playTrailer query
      const params = new URLSearchParams(location.search);
      if (params.get('playTrailer') === 'true') {
        setShowTrailer(true);
      }
    }
  }, [id]);

  if (!movie) {
    return (
      <div className="container page-error-state">
        <h2>Movie not found</h2>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  const handleBookTickets = () => {
    navigate(`/booking/${movie.id}`);
  };

  const isFavorite = user.favouriteMovies?.includes(movie.id);

  return (
    <motion.div {...pageTransition} className="movie-details-container">
      {/* Parallax Backdrop */}
      <div className="detail-backdrop-w">
        <div className="detail-backdrop-img" style={{ backgroundImage: `url(${movie.backdrop})` }} />
        <div className="detail-backdrop-overlay" />
      </div>

      <div className="container detail-content-layout">
        {/* Left Side: Poster & Favorite Button */}
        <div className="detail-poster-column">
          <div className="detail-poster-img glass-panel">
            <img src={movie.poster} alt={movie.title} />
          </div>
          <button 
            className={`btn-secondary fav-toggle-btn ${isFavorite ? 'favorite' : ''}`}
            onClick={() => addFavoriteMovie(movie.id)}
          >
            {isFavorite ? <RiHeartFill className="heart-icon active" /> : <RiHeartLine className="heart-icon" />}
            <span>{isFavorite ? 'In Favorites' : 'Add to Favorites'}</span>
          </button>
        </div>

        {/* Right Side: Details & Shows */}
        <div className="detail-info-column">
          <div className="badges-row">
            <span className="info-badge rating">{movie.rating}</span>
            <span className="info-badge duration"><RiTimeLine /> {movie.duration}</span>
            <span className="info-badge language">{movie.language}</span>
          </div>

          <h1 className="detail-title">{movie.title}</h1>
          <p className="detail-genres">{movie.genre.join(' • ')}</p>
          
          <div className="rating-box glass-panel">
            <div className="rating-score">
              <RiStarFill className="star-icon" />
              <div>
                <strong>{movie.userRating || 'N/A'}/10</strong>
                <span>Rating</span>
              </div>
            </div>
            <button className="btn-secondary trailer-trigger-btn" onClick={() => setShowTrailer(true)}>
              <RiPlayCircleLine /> Play Trailer
            </button>
          </div>

          <div className="info-section">
            <h3>Synopsis</h3>
            <p className="synopsis-text">{movie.description}</p>
          </div>

          <div className="info-section">
            <h3>Cast & Crew</h3>
            <div className="cast-grid">
              {movie.cast.map((member, i) => (
                <div key={i} className="cast-card">
                  <img src={member.image} alt={member.name} />
                  <strong>{member.name}</strong>
                  <span>{member.role}</span>
                </div>
              ))}
            </div>
            <p className="director-name"><strong>Director:</strong> {movie.director}</p>
          </div>

          {movie.status === 'now-showing' && (
            <div className="info-section booking-quick-action glass-panel">
              <h3>Select Show Format</h3>
              <div className="format-selector">
                {movie.formats.map(f => (
                  <button 
                    key={f}
                    className={`format-btn ${booking.format === f ? 'active' : ''}`}
                    onClick={() => selectFormat(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <button className="btn-primary start-booking-btn" onClick={handleBookTickets}>
                Book Tickets <RiArrowRightLine />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Video Trailer Modal */}
      <AnimatePresence>
        {showTrailer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowTrailer(false)}
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="modal-content-video glass-panel"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setShowTrailer(false)} aria-label="Close trailer">
                <RiCloseLine />
              </button>
              <div className="video-responsive">
                <iframe
                  width="853"
                  height="480"
                  src={movie.trailerUrl}
                  title="Movie Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ==========================================================================
   4. BOOKING PAGE (DATE, SHOWTIME, SEAT SELECTION)
   ========================================================================== */
export function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { booking, selectDate, selectShowtime, toggleSeat } = useBooking();
  
  const dates = generateDates();
  const movie = movies.find(m => m.id === id);

  // Initialize defaults
  useEffect(() => {
    if (movie) {
      if (!booking.date) selectDate(dates[0]);
    }
  }, [movie]);

  if (!movie) {
    return (
      <div className="container page-error-state">
        <h2>Movie not found</h2>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    );
  }

  // Generate show-specific seat layout consistently based on selected date & time
  const showKey = `${id}-${booking.date?.id}-${booking.screen?.id}-${booking.time}`;
  const seatLayout = booking.time ? generateSeatLayout(showKey) : [];

  // Summary figures
  const selectedSeatsCount = booking.seats.length;
  const ticketCost = booking.seats.reduce((sum, s) => sum + s.price, 0);

  const handleProceedToFood = () => {
    navigate('/food');
  };

  return (
    <motion.div {...pageTransition} className="booking-page-container container">
      <div className="booking-flow-header">
        <h1 className="booking-movie-title">{movie.title} <span className="gold-text">({booking.format})</span></h1>
        <p className="booking-movie-meta">{movie.language} • {movie.genre.join(', ')}</p>
      </div>

      {/* Step 1: Date Selection */}
      <div className="booking-step-section glass-panel">
        <h2 className="step-title"><span className="step-num">1</span> Select Date</h2>
        <div className="date-picker-scroll">
          {dates.map((d) => (
            <button
              key={d.id}
              className={`date-pill ${booking.date?.id === d.id ? 'active' : ''}`}
              onClick={() => selectDate(d)}
            >
              <span className="day-name">{d.dayName}</span>
              <span className="date-num">{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Showtimes Selection */}
      <div className="booking-step-section glass-panel">
        <h2 className="step-title"><span className="step-num">2</span> Select Screen & Time</h2>
        <div className="screens-container">
          {screens
            .filter(scr => scr.formats.includes(booking.format))
            .map((scr) => (
              <div key={scr.id} className="screen-row">
                <span className="screen-name">{scr.name}</span>
                <div className="times-container">
                  {scr.timings.map((slot) => {
                    const isSelected = booking.screen?.id === scr.id && booking.time === slot.time;
                    let statusClass = "available";
                    if (slot.status === "Filling Fast") statusClass = "filling-fast";
                    if (slot.status === "Sold Out") statusClass = "sold-out";

                    return (
                      <button
                        key={slot.time}
                        className={`time-pill ${isSelected ? 'active' : ''} ${statusClass}`}
                        disabled={slot.status === "Sold Out"}
                        onClick={() => selectShowtime(scr, slot.time)}
                      >
                        <span className="time-val">{slot.time}</span>
                        <span className="time-status">{slot.status}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Step 3: Interactive Seat Selection */}
      {booking.time ? (
        <div className="booking-step-section seat-selection-section glass-panel">
          <h2 className="step-title"><span className="step-num">3</span> Select Seats</h2>
          
          <div className="seat-legend">
            <div className="legend-item"><span className="legend-box seat-available" /> Available</div>
            <div className="legend-item"><span className="legend-box seat-selected" /> Selected</div>
            <div className="legend-item"><span className="legend-box seat-booked" /> Booked</div>
            <div className="legend-item"><span className="legend-box seat-vip" /> VIP</div>
          </div>

          <div className="cinema-screen-w">
            <div className="screen-curve" />
            <span className="screen-text">SCREEN THIS WAY</span>
          </div>

          <div className="seat-grid-scroller">
            <div className="seat-grid">
              {seatLayout.map((rowItem, rIndex) => (
                <div key={rowItem.rowName} className="seat-row-layout">
                  <span className="row-letter">{rowItem.rowName}</span>
                  <div className="row-seats">
                    {rowItem.seats.map((seat, sIndex) => {
                      if (seat.isAisle) {
                        return <div key={`aisle-${sIndex}`} className="seat-aisle" />;
                      }
                      
                      const isSelected = booking.seats.some(s => s.id === seat.id);
                      let seatClass = "available";
                      if (seat.status === "Booked") seatClass = "booked";
                      if (seat.status === "VIP") seatClass = "vip";
                      if (isSelected) seatClass = "selected";

                      return (
                        <button
                          key={seat.id}
                          className={`seat-btn ${seatClass}`}
                          disabled={seat.status === "Booked"}
                          onClick={() => toggleSeat({
                            id: seat.id,
                            row: seat.row,
                            number: seat.number,
                            price: seat.price,
                            category: seat.category
                          })}
                          title={`${seat.id} (${seat.category} - ₹${seat.price})`}
                        >
                          {seat.number}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Bar */}
          {selectedSeatsCount > 0 && (
            <div className="seat-checkout-summary-bar fade-in">
              <div className="summary-left">
                <p>Selected Seats: <strong>{booking.seats.map(s => s.id).join(', ')}</strong></p>
                <p>Tickets: <strong>{selectedSeatsCount}</strong> • Subtotal: <strong className="gold-text">₹{ticketCost}</strong></p>
              </div>
              <button className="btn-primary proceed-btn" onClick={handleProceedToFood}>
                Add Food & Drinks <RiArrowRightLine />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="booking-step-section seat-placeholder glass-panel">
          <RiTicketLine className="ticket-placeholder-icon" />
          <p>Please select show date and timing to view available seats.</p>
        </div>
      )}
    </motion.div>
  );
}

/* ==========================================================================
   5. FOOD ORDERING PAGE
   ========================================================================== */
export function Food() {
  const navigate = useNavigate();
  const { booking, adjustFood } = useBooking();

  // Validate booking steps done
  useEffect(() => {
    if (!booking.movie || !booking.time || booking.seats.length === 0) {
      navigate('/');
    }
  }, [booking]);

  const handleSkipOrProceed = () => {
    navigate('/checkout');
  };

  const getQuantity = (id) => booking.food[id] || 0;

  return (
    <motion.div {...pageTransition} className="food-page-container container">
      <div className="page-header-flex">
        <div>
          <h1 className="page-title text-gold">Pre-Book Gourmet Snacks</h1>
          <p className="page-subtitle">Save up to 20% by pre-ordering snacks. Avoid long queues at the counter!</p>
        </div>
        <button className="btn-secondary" onClick={handleSkipOrProceed}>
          Skip to Checkout
        </button>
      </div>

      <div className="food-grid">
        {foodItems.map(item => (
          <div key={item.id} className="food-card-w glass-card">
            <div className="food-card-img">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="food-card-details">
              <span className="food-cat">{item.category}</span>
              <h3>{item.name}</h3>
              <p className="food-desc">{item.description}</p>
              <div className="food-card-price-row">
                <span className="food-price">₹{item.price}</span>
                <div className="food-counter">
                  {getQuantity(item.id) > 0 ? (
                    <>
                      <button className="counter-btn minus" onClick={() => adjustFood(item.id, -1)}>
                        <RiSubtractLine />
                      </button>
                      <span className="counter-val">{getQuantity(item.id)}</span>
                      <button className="counter-btn plus" onClick={() => adjustFood(item.id, 1)}>
                        <RiAddLine />
                      </button>
                    </>
                  ) : (
                    <button className="add-snack-btn btn-secondary" onClick={() => adjustFood(item.id, 1)}>
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="food-bottom-bar glass-panel fade-in">
        <div className="food-summary-desc">
          <RiShoppingBagLine className="summary-icon" />
          <div>
            <strong>Snacks added: {Object.values(booking.food).reduce((a, b) => a + b, 0)} items</strong>
            <p>Customize your movie experience</p>
          </div>
        </div>
        <button className="btn-primary" onClick={handleSkipOrProceed}>
          Go to Checkout <RiArrowRightLine />
        </button>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   6. CHECKOUT SUMMARY PAGE
   ========================================================================== */
export function Checkout() {
  const navigate = useNavigate();
  const { booking } = useBooking();

  useEffect(() => {
    if (!booking.movie || !booking.time || booking.seats.length === 0) {
      navigate('/');
    }
  }, [booking]);

  if (!booking.movie) return null;

  // Calculate pricing breakdown
  const ticketCost = booking.seats.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = booking.seats.length * 30; // ₹30 per ticket
  
  const selectedFood = Object.entries(booking.food)
    .map(([id, qty]) => {
      const item = foodItems.find(f => f.id === id);
      return item ? { ...item, qty } : null;
    })
    .filter(Boolean);

  const foodCost = selectedFood.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const gstTax = Math.round((ticketCost + foodCost) * 0.18); // 18% GST
  const totalAmount = ticketCost + convenienceFee + foodCost + gstTax;

  return (
    <motion.div {...pageTransition} className="checkout-page-container container">
      <h1 className="page-title text-gold">Review Booking Summary</h1>
      
      <div className="checkout-grid-layout">
        {/* Left Panel: Booking Details */}
        <div className="checkout-details-panel glass-panel">
          <div className="checkout-movie-header">
            <img src={booking.movie.poster} alt={booking.movie.title} className="checkout-poster" />
            <div className="checkout-movie-meta">
              <h2>{booking.movie.title}</h2>
              <span className="format-badge">{booking.format}</span>
              <p>Language: <strong>{booking.movie.language}</strong></p>
              <p>Duration: <strong>{booking.movie.duration}</strong></p>
            </div>
          </div>

          <div className="checkout-info-rows">
            <div className="info-row">
              <RiCalendarLine className="row-icon" />
              <div>
                <span>Date & Time</span>
                <strong>{booking.date?.label} • {booking.time}</strong>
              </div>
            </div>

            <div className="info-row">
              <RiTicketLine className="row-icon" />
              <div>
                <span>Screen & Seats</span>
                <strong>{booking.screen?.name} • Seats: {booking.seats.map(s => s.id).join(', ')}</strong>
              </div>
            </div>
          </div>

          {/* Snacks list */}
          <div className="checkout-snacks-list">
            <h3>Add-on Food & Beverages</h3>
            {selectedFood.length === 0 ? (
              <p className="no-snacks-text">No snacks added. <Link to="/food" className="gold-text">Click here to add snacks</Link></p>
            ) : (
              <div className="snacks-items">
                {selectedFood.map(item => (
                  <div key={item.id} className="snack-summary-row">
                    <span>{item.name} <strong>x{item.qty}</strong></span>
                    <span>₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Checkout Summary Cost */}
        <div className="checkout-summary-panel glass-panel">
          <h3>Payment Bill Details</h3>
          
          <div className="bill-rows">
            <div className="bill-row">
              <span>Ticket Subtotal ({booking.seats.length} Tickets)</span>
              <span>₹{ticketCost}</span>
            </div>
            
            {foodCost > 0 && (
              <div className="bill-row">
                <span>Food & Beverage Subtotal</span>
                <span>₹{foodCost}</span>
              </div>
            )}

            <div className="bill-row">
              <span>Convenience Fee (₹30 x {booking.seats.length})</span>
              <span>₹{convenienceFee}</span>
            </div>

            <div className="bill-row">
              <span>GST & Taxes (18%)</span>
              <span>₹{gstTax}</span>
            </div>

            <div className="bill-row total-amount-row">
              <span>Total Payable Amount</span>
              <span className="gold-text">₹{totalAmount}</span>
            </div>
          </div>

          <div className="checkout-note">
            <RiInformationLine />
            <span>By clicking proceed, you agree to our policies. Tickets are non-refundable.</span>
          </div>

          <button className="btn-primary proceed-to-pay-btn" onClick={() => navigate('/payment')}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   7. PAYMENT PAGE
   ========================================================================== */
export function Payment() {
  const navigate = useNavigate();
  const { booking, finalizeBooking } = useBooking();
  const [activeTab, setActiveTab] = useState('card');
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');
  const [netBank, setNetBank] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!booking.movie || !booking.time || booking.seats.length === 0) {
      navigate('/');
    }
  }, [booking]);

  if (!booking.movie) return null;

  const handlePayNow = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment transaction
    setTimeout(() => {
      setIsProcessing(false);
      const ticketId = finalizeBooking(activeTab.toUpperCase());
      navigate('/ticket');
    }, 2500);
  };

  const handleCardInput = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({ ...prev, name: value })); // simplified
  };

  return (
    <motion.div {...pageTransition} className="payment-page-container container">
      <h1 className="page-title text-gold">Checkout Payment</h1>
      
      <div className="payment-layout">
        {/* Payment Tabs Selector */}
        <div className="payment-tabs-column glass-panel">
          <h3>Select Payment Method</h3>
          <button className={`pay-tab ${activeTab === 'card' ? 'active' : ''}`} onClick={() => setActiveTab('card')}>
            <RiBankCardFill className="tab-icon" />
            <div>
              <strong>Credit/Debit Card</strong>
              <span>Visa, MasterCard, RuPay</span>
            </div>
          </button>
          
          <button className={`pay-tab ${activeTab === 'upi' ? 'active' : ''}`} onClick={() => setActiveTab('upi')}>
            <RiQrCodeLine className="tab-icon" />
            <div>
              <strong>UPI QR / App</strong>
              <span>Google Pay, PhonePe, Paytm</span>
            </div>
          </button>

          <button className={`pay-tab ${activeTab === 'netbanking' ? 'active' : ''}`} onClick={() => setActiveTab('netbanking')}>
            <RiWalletLine className="tab-icon" />
            <div>
              <strong>Net Banking</strong>
              <span>Select popular Indian banks</span>
            </div>
          </button>
        </div>

        {/* Payment Forms Content */}
        <div className="payment-form-column glass-panel">
          {isProcessing ? (
            <div className="payment-loader-overlay">
              <div className="spinner" />
              <h2>Processing Secure Payment...</h2>
              <p>Do not reload this page or press back button.</p>
            </div>
          ) : (
            <form onSubmit={handlePayNow} className="payment-form-body">
              {activeTab === 'card' && (
                <div className="card-form-inputs fade-in">
                  <h3>Enter Card Details</h3>
                  <div className="form-group">
                    <label>Card Number</label>
                    <input type="text" placeholder="XXXX XXXX XXXX XXXX" required maxLength="19" />
                  </div>
                  <div className="form-group">
                    <label>Card Holder Name</label>
                    <input type="text" placeholder="Full Name" required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input type="text" placeholder="MM/YY" required maxLength="5" />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input type="password" placeholder="***" required maxLength="3" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'upi' && (
                <div className="upi-form-inputs fade-in">
                  <h3>Scan QR or Enter UPI ID</h3>
                  <div className="qr-code-simulator">
                    <RiQrCodeLine className="qr-sim-icon" />
                    <p>Scan this QR code with any UPI app (GPay, PhonePe, Paytm) to authorize transaction.</p>
                  </div>
                  <div className="or-separator"><span>OR</span></div>
                  <div className="form-group">
                    <label>Enter UPI ID / VPA</label>
                    <input 
                      type="text" 
                      placeholder="username@okaxis" 
                      value={upiId} 
                      onChange={(e) => setUpiId(e.target.value)} 
                    />
                  </div>
                </div>
              )}

              {activeTab === 'netbanking' && (
                <div className="nb-form-inputs fade-in">
                  <h3>Select Netbanking Bank</h3>
                  <div className="bank-grid">
                    {['SBI', 'HDFC', 'ICICI', 'Axis', 'KOTAK', 'PNB'].map(bank => (
                      <label key={bank} className={`bank-label ${netBank === bank ? 'selected' : ''}`}>
                        <input 
                          type="radio" 
                          name="bank" 
                          value={bank} 
                          checked={netBank === bank}
                          onChange={(e) => setNetBank(e.target.value)}
                        />
                        <span>{bank} Bank</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <button type="submit" className="btn-primary make-payment-btn">
                Pay Securely
              </button>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   8. DIGITAL TICKET PAGE
   ========================================================================== */
export function Ticket() {
  const { currentTicket, setCurrentTicket } = useBooking();
  const ticketRef = useRef();

  if (!currentTicket) {
    return (
      <div className="container page-error-state">
        <RiTicketLine className="error-icon" />
        <h2>No Active Ticket Found</h2>
        <p>You haven't booked any ticket in this session yet.</p>
        <Link to="/" className="btn-primary">Go to Home</Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMock = () => {
    // Generate simple text download mock
    const content = `
    ============================================
                MALL CINEBOOK TICKET
    ============================================
    Booking ID  : ${currentTicket.id}
    Movie       : ${currentTicket.movieTitle} (${currentTicket.format})
    Date & Time : ${currentTicket.date} | ${currentTicket.time}
    Screen      : ${currentTicket.screen}
    Seats       : ${currentTicket.seats.join(', ')}
    Total Paid  : INR ${currentTicket.totalAmount}
    ============================================
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `CineBook-Ticket-${currentTicket.id}.txt`;
    link.click();
  };

  return (
    <motion.div {...pageTransition} className="ticket-page-container container">
      <div className="ticket-success-message">
        <div className="success-circle">
          <RiCheckDoubleLine />
        </div>
        <h1>Booking Successful!</h1>
        <p>Your ticket is confirmed. Present the digital ticket QR code at the entrance.</p>
      </div>

      {/* Ticket Stump Design */}
      <div className="ticket-stump-w" ref={ticketRef}>
        <div className="ticket-left">
          <div className="ticket-poster-side">
            <img src={currentTicket.moviePoster} alt={currentTicket.movieTitle} />
          </div>
          <div className="ticket-main-details">
            <span className="booking-id-lbl">Booking ID: {currentTicket.id}</span>
            <h2>{currentTicket.movieTitle}</h2>
            <div className="ticket-badges-row">
              <span className="ticket-badge">{currentTicket.format}</span>
              <span className="ticket-badge">VIP Lounge</span>
            </div>

            <div className="ticket-meta-grid">
              <div>
                <span>DATE</span>
                <strong>{currentTicket.date}</strong>
              </div>
              <div>
                <span>TIME</span>
                <strong>{currentTicket.time}</strong>
              </div>
              <div>
                <span>SCREEN</span>
                <strong>{currentTicket.screen.split(' ')[1] || 'S1'}</strong>
              </div>
              <div>
                <span>SEATS</span>
                <strong>{currentTicket.seats.join(', ')}</strong>
              </div>
            </div>
            
            {currentTicket.foodItems?.length > 0 && (
              <div className="ticket-food-add-on">
                <span>PRE-BOOKED SNACKS:</span>
                <p>{currentTicket.foodItems.map(f => `${f.name} (x${f.qty})`).join(', ')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Perforated separator */}
        <div className="ticket-perforated-divider">
          <div className="circle-cutout top" />
          <div className="dotted-line" />
          <div className="circle-cutout bottom" />
        </div>

        {/* Barcode / Stub Side */}
        <div className="ticket-right-stub">
          <div className="qr-code-w">
            <RiQrCodeLine className="qr-graphic" />
          </div>
          <span className="scan-instructions">SCAN AT ENTRANCE</span>
          <div className="barcode-graphic">
            <div className="bar" style={{ width: '2px' }} />
            <div className="bar" style={{ width: '4px' }} />
            <div className="bar" style={{ width: '1px' }} />
            <div className="bar" style={{ width: '3px' }} />
            <div className="bar" style={{ width: '2px' }} />
            <div className="bar" style={{ width: '4px' }} />
            <div className="bar" style={{ width: '1px' }} />
          </div>
          <span className="price-lbl">Paid: ₹{currentTicket.totalAmount}</span>
        </div>
      </div>

      {/* Action triggers */}
      <div className="ticket-action-btns">
        <button className="btn-secondary ticket-btn" onClick={handleDownloadMock}>
          <RiDownloadLine /> Download Ticket
        </button>
        <button className="btn-primary ticket-btn" onClick={handlePrint}>
          <RiPrinterLine /> Print Ticket
        </button>
      </div>

      <div className="ticket-back-link">
        <Link to="/" onClick={() => setCurrentTicket(null)}>Back to Home Screen</Link>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   9. USER PROFILE PAGE
   ========================================================================== */
export function Profile() {
  const { user } = useBooking();
  const [activeTab, setActiveTab] = useState('upcoming');

  const favMoviesList = movies.filter(m => user.favouriteMovies?.includes(m.id));

  return (
    <motion.div {...pageTransition} className="profile-page-container container">
      <div className="profile-banner-header glass-panel">
        <img src={user.avatar} alt={user.name} className="profile-avatar" />
        <div className="profile-user-info">
          <h1>{user.name}</h1>
          <p>{user.email} • {user.phone}</p>
          <div className="profile-quick-stats">
            <div className="stat-pill">
              <strong>{user.upcomingBookings?.length || 0}</strong>
              <span>Upcoming</span>
            </div>
            <div className="stat-pill">
              <strong>{user.previousBookings?.length || 0}</strong>
              <span>Watched</span>
            </div>
            <div className="stat-pill">
              <strong>{user.favouriteMovies?.length || 0}</strong>
              <span>Favorites</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs-w">
        <button className={`profile-tab ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>
          Upcoming Bookings
        </button>
        <button className={`profile-tab ${activeTab === 'previous' ? 'active' : ''}`} onClick={() => setActiveTab('previous')}>
          Purchase History
        </button>
        <button className={`profile-tab ${activeTab === 'favorites' ? 'active' : ''}`} onClick={() => setActiveTab('favorites')}>
          Favorite Movies
        </button>
      </div>

      {/* Tab Contents */}
      <div className="profile-tab-content">
        {activeTab === 'upcoming' && (
          <div className="tickets-list">
            {(!user.upcomingBookings || user.upcomingBookings.length === 0) ? (
              <div className="empty-state glass-panel">
                <p>No upcoming bookings found. Book your tickets now!</p>
                <Link to="/movies" className="btn-primary">Browse Movies</Link>
              </div>
            ) : (
              user.upcomingBookings.map(t => (
                <ProfileTicketCard key={t.id} ticket={t} isUpcoming={true} />
              ))
            )}
          </div>
        )}

        {activeTab === 'previous' && (
          <div className="tickets-list">
            {(!user.previousBookings || user.previousBookings.length === 0) ? (
              <div className="empty-state glass-panel">
                <p>No purchase history found.</p>
              </div>
            ) : (
              user.previousBookings.map(t => (
                <ProfileTicketCard key={t.id} ticket={t} isUpcoming={false} />
              ))
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="favorites-grid">
            {favMoviesList.length === 0 ? (
              <div className="empty-state glass-panel">
                <p>No favorite movies added yet.</p>
                <Link to="/movies" className="btn-primary">Explore Movies</Link>
              </div>
            ) : (
              <div className="movie-grid">
                {favMoviesList.map(movie => (
                  <MovieCardGridItem key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Supporting ProfileTicketCard
function ProfileTicketCard({ ticket, isUpcoming }) {
  const { setCurrentTicket } = useBooking();
  const navigate = useNavigate();

  const handleViewTicket = () => {
    setCurrentTicket(ticket);
    navigate('/ticket');
  };

  return (
    <div className="profile-ticket-card glass-panel fade-in">
      <img src={ticket.moviePoster} alt={ticket.movieTitle} className="ticket-poster" />
      <div className="ticket-card-info">
        <div className="ticket-header-row">
          <h3>{ticket.movieTitle} <span className="format-badge">{ticket.format}</span></h3>
          <span className="booking-id">{ticket.id}</span>
        </div>
        
        <div className="ticket-details-grid">
          <div>
            <span>DATE</span>
            <strong>{ticket.date}</strong>
          </div>
          <div>
            <span>TIME</span>
            <strong>{ticket.time}</strong>
          </div>
          <div>
            <span>SCREEN</span>
            <strong>{ticket.screen}</strong>
          </div>
          <div>
            <span>SEATS</span>
            <strong>{ticket.seats.join(', ')}</strong>
          </div>
        </div>

        {ticket.foodItems?.length > 0 && (
          <div className="ticket-snacks-added">
            <span>Snacks:</span> {ticket.foodItems.map(f => `${f.name} (x${f.qty})`).join(', ')}
          </div>
        )}

        <div className="ticket-footer-row">
          <span>Amount Paid: <strong>₹{ticket.totalAmount}</strong></span>
          {isUpcoming && (
            <button className="btn-primary view-ticket-btn" onClick={handleViewTicket}>
              View Ticket QR
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   10. OFFERS PAGE
   ========================================================================== */
export function Offers() {
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  return (
    <motion.div {...pageTransition} className="offers-page-container container">
      <div className="offers-header">
        <h1 className="page-title text-gold">Exclusive Offers & Promotions</h1>
        <p className="page-subtitle">Grab the best promo codes for discounts on credit cards, ticket formats, and combo sets.</p>
      </div>

      <div className="offers-grid">
        {offers.map(offer => (
          <div key={offer.id} className="offer-card-w glass-card">
            <div className="offer-card-visual" style={{ background: offer.color }}>
              <img src={offer.image} alt={offer.title} />
              <div className="discount-tag">{offer.discount}</div>
            </div>
            <div className="offer-card-desc">
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              <div className="promo-code-box">
                <span className="code-text">Promo Code: <strong>{offer.code}</strong></span>
                <button 
                  className={`copy-code-btn ${copiedCode === offer.code ? 'copied' : ''}`}
                  onClick={() => handleCopyCode(offer.code)}
                >
                  {copiedCode === offer.code ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
