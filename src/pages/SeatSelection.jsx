import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { ArrowLeft, Ticket, Coffee, ChevronRight, ShoppingBag } from 'lucide-react';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Flow Steps: 'seats' -> 'food'
  const [step, setStep] = useState('seats');
  const [foodItems, setFoodItems] = useState([]);
  const [foodQuantities, setFoodQuantities] = useState({}); // { itemId: quantity }

  useEffect(() => {
    const fetchShowData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/shows/${showId}`);
        setShow(res.data.show);
        setSeats(res.data.seats);
        setBookedSeats(res.data.bookedSeats || []);
      } catch (err) {
        console.error('Failed to load show seating:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchShowData();
  }, [showId]);

  useEffect(() => {
    // Fetch Food Items when step turns to food
    if (step === 'food') {
      const fetchFood = async () => {
        try {
          const res = await api.get('/api/food');
          setFoodItems(res.data);
        } catch (err) {
          console.error('Failed to load concessions menu:', err);
        }
      };
      fetchFood();
    }
  }, [step]);

  const handleSeatClick = (seatCode, isBooked) => {
    if (isBooked) return;

    setSelectedSeats(prev => {
      if (prev.includes(seatCode)) {
        return prev.filter(s => s !== seatCode);
      } else {
        if (prev.length >= 10) {
          alert('You can select a maximum of 10 seats per booking.');
          return prev;
        }
        return [...prev, seatCode];
      }
    });
  };

  // Helper to fetch seat category
  const getSeatCategory = (row, number) => {
    const seatConfig = seats.find(s => s.row === row && s.number === number);
    return seatConfig ? seatConfig.category : 'Standard';
  };

  // Calculations
  const calculateTicketSubtotal = () => {
    if (!show) return 0;
    let subtotal = 0;
    selectedSeats.forEach(seatCode => {
      const match = seatCode.match(/^([A-Z]+)(\d+)$/);
      if (match) {
        const row = match[1];
        const num = parseInt(match[2]);
        const cat = getSeatCategory(row, num);
        subtotal += show.prices[cat] || 150;
      }
    });
    return subtotal;
  };

  const ticketSubtotal = calculateTicketSubtotal();
  const convenienceFee = 30 * selectedSeats.length;
  const ticketTax = Math.round((ticketSubtotal) * 0.18);
  const ticketTotal = ticketSubtotal + convenienceFee + ticketTax;

  // Concessions adjustment
  const handleFoodQtyChange = (itemId, change) => {
    setFoodQuantities(prev => {
      const current = prev[itemId] || 0;
      const nextVal = Math.max(0, current + change);
      return { ...prev, [itemId]: nextVal };
    });
  };

  const getFoodSubtotal = () => {
    let subtotal = 0;
    foodItems.forEach(item => {
      const qty = foodQuantities[item._id] || 0;
      subtotal += item.price * qty;
    });
    return subtotal;
  };

  const foodSubtotal = getFoodSubtotal();
  const foodTax = Math.round(foodSubtotal * 0.18);
  const totalBillAmount = ticketTotal + foodSubtotal + foodTax;

  const handleProceedToCheckout = () => {
    // Compile food items array
    const selectedFood = [];
    foodItems.forEach(item => {
      const qty = foodQuantities[item._id] || 0;
      if (qty > 0) {
        selectedFood.push({
          foodItemId: item._id,
          name: item.name,
          price: item.price,
          quantity: qty
        });
      }
    });

    // Store in localStorage
    const bookingDetails = {
      showId,
      selectedSeats,
      foodItems: selectedFood,
      ticketSubtotal,
      foodSubtotal,
      convenienceFee,
      tax: ticketTax + foodTax,
      totalAmount: totalBillAmount
    };
    localStorage.setItem('currentBookingData', JSON.stringify(bookingDetails));
    
    navigate('/checkout');
  };

  // Group seats by row
  const getRowSeatsMap = () => {
    const rowMap = {};
    seats.forEach(seat => {
      if (!rowMap[seat.row]) {
        rowMap[seat.row] = [];
      }
      rowMap[seat.row].push(seat);
    });
    // Sort columns inside rows
    Object.keys(rowMap).forEach(row => {
      rowMap[row].sort((a, b) => a.number - b.number);
    });
    // Return sorted keys
    return Object.keys(rowMap).sort().reduce((obj, key) => {
      obj[key] = rowMap[key];
      return obj;
    }, {});
  };

  if (loading || !show) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div className="flex-center" style={{ flex: 1, padding: '40px' }}>
          <div className="skeleton" style={{ width: '80%', height: '400px', borderRadius: 'var(--radius-lg)' }}></div>
        </div>
        <Footer />
      </div>
    );
  }

  const rowsMap = getRowSeatsMap();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ flex: 1, padding: '40px 0' }}>
        {step === 'seats' ? (
          <div className="booking-wizard-layout">
            {/* Left side: Seating Grid */}
            <div className="card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <ArrowLeft size={18} />
                </button>
                <h3 style={{ color: '#ffffff' }}>Choose Seat Position</h3>
              </div>

              {/* Screen curve indicator */}
              <div className="cinema-screen-container">
                <div className="screen-curve"></div>
                <span className="screen-direction-text">SCREEN THIS WAY</span>
              </div>

              {/* Seats Grid */}
              <div style={{ width: '100%', overflowX: 'auto', padding: '20px 0' }}>
                {Object.keys(rowsMap).map(rowLabel => {
                  const rowSeats = rowsMap[rowLabel];
                  return (
                    <div key={rowLabel} className="seat-row">
                      <span className="row-label">{rowLabel}</span>
                      
                      {rowSeats.map((seat, idx) => {
                        const seatCode = `${seat.row}${seat.number}`;
                        const isBooked = bookedSeats.includes(seatCode);
                        const isSelected = selectedSeats.includes(seatCode);
                        
                        let cellClass = 'seat-cell-standard';
                        if (seat.category === 'Premium') cellClass = 'seat-cell-premium';
                        if (seat.category === 'Recliner') cellClass = 'seat-cell-recliner';
                        if (isSelected) cellClass = 'seat-cell-selected';
                        if (isBooked) cellClass = 'seat-cell-booked';

                        return (
                          <React.Fragment key={seat._id}>
                            {/* Insert Aisle gap at the center of the column layout */}
                            {idx === Math.ceil(rowSeats.length / 2) && (
                              <div className="seat-cell-space" />
                            )}
                            <div 
                              className={`seat-grid-cell ${cellClass}`}
                              onClick={() => handleSeatClick(seatCode, isBooked)}
                              title={`${seatCode} (${seat.category} - ₹${show.prices[seat.category]})`}
                            >
                              {seat.number}
                            </div>
                          </React.Fragment>
                        );
                      })}

                      <span className="row-label" style={{ marginLeft: '12px' }}>{rowLabel}</span>
                    </div>
                  );
                })}
              </div>

              {/* Legends */}
              <div className="seating-legend">
                <div className="legend-item">
                  <div className="legend-color-box seat-cell-standard" style={{ width: '16px', height: '16px' }}></div>
                  <span>Standard (₹{show.prices.Standard})</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color-box seat-cell-premium" style={{ width: '16px', height: '16px' }}></div>
                  <span>Premium (₹{show.prices.Premium})</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color-box seat-cell-recliner" style={{ width: '16px', height: '16px' }}></div>
                  <span>VIP Recliner (₹{show.prices.Recliner})</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color-box seat-cell-selected" style={{ width: '16px', height: '16px' }}></div>
                  <span>Selected</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color-box seat-cell-booked" style={{ width: '16px', height: '16px' }}></div>
                  <span>Already Booked</span>
                </div>
              </div>
            </div>

            {/* Right side: Dynamic Calculations Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card" style={{ padding: '24px' }}>
                <h4 style={{ color: '#ffffff', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Ticket size={18} style={{ color: 'var(--primary)' }} /> Booking Summary
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <p><strong style={{ color: '#ffffff' }}>Movie:</strong> {show.movieId.title}</p>
                  <p><strong style={{ color: '#ffffff' }}>Format:</strong> {show.screenId.type}</p>
                  <p><strong style={{ color: '#ffffff' }}>Showtime:</strong> {show.date} | {show.time}</p>
                  <p><strong style={{ color: '#ffffff' }}>Screen:</strong> {show.screenId.name}</p>
                </div>

                <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />

                <div style={{ minHeight: '80px' }}>
                  {selectedSeats.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', paddingTop: '20px' }}>No seats selected. Tap seats in the map to select.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <p><strong style={{ color: '#ffffff' }}>Selected Seats:</strong></p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {selectedSeats.map(seat => (
                          <span key={seat} style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                            {seat}
                          </span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Tickets Subtotal</span>
                          <span style={{ color: '#ffffff', fontWeight: '600' }}>₹{ticketSubtotal}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>Convenience Fees</span>
                          <span style={{ color: '#ffffff', fontWeight: '600' }}>₹{convenienceFee}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>GST Taxes (18%)</span>
                          <span style={{ color: '#ffffff', fontWeight: '600' }}>₹{ticketTax}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', borderTop: '1px dashed var(--border-color)', paddingTop: '10px', color: '#ffffff', fontWeight: 'bold' }}>
                          <span>Payable Amount</span>
                          <span style={{ color: 'var(--primary)' }}>₹{ticketTotal}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  disabled={selectedSeats.length === 0}
                  onClick={() => setStep('food')}
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '24px', display: 'flex', justifyContent: 'center', opacity: selectedSeats.length === 0 ? 0.5 : 1 }}
                >
                  Add Concessions <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Food and Beverages Concession step */
          <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => setStep('seats')} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <ArrowLeft size={18} />
                </button>
                <h2 style={{ color: '#ffffff', fontSize: '1.8rem', fontWeight: 800 }}>Grab Some Concessions!</h2>
              </div>
              <button onClick={handleProceedToCheckout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Skip Food Add-on
              </button>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Make your movie experience premium with our freshly prepared cinema snacks, cold beverages, and premium combo packages, delivered straight to your seat.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1fr', gap: '30px' }}>
              {/* Concessions lists */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {foodItems.map(item => {
                  const qty = foodQuantities[item._id] || 0;
                  return (
                    <div key={item._id} className="food-card">
                      <div className="food-image-wrap">
                        <img src={item.image} alt={item.name} className="food-image" />
                        <span className="badge badge-normal" style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(7, 8, 10, 0.8)' }}>
                          {item.category}
                        </span>
                      </div>
                      <div className="food-info">
                        <div>
                          <h4 className="food-name">{item.name}</h4>
                          <span className="food-price">₹{item.price}</span>
                        </div>
                        
                        <div style={{ marginTop: '12px' }}>
                          {qty === 0 ? (
                            <button 
                              onClick={() => handleFoodQtyChange(item._id, 1)}
                              className="btn btn-secondary"
                              style={{ width: '100%', padding: '6px 12px', fontSize: '0.85rem' }}
                            >
                              Add Concessions
                            </button>
                          ) : (
                            <div className="food-counter">
                              <div onClick={() => handleFoodQtyChange(item._id, -1)} className="food-counter-btn">-</div>
                              <span className="food-counter-val">{qty}</span>
                              <div onClick={() => handleFoodQtyChange(item._id, 1)} className="food-counter-btn">+</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Running total for step concessions */}
              <div className="card" style={{ height: 'fit-content', padding: '24px' }}>
                <h4 style={{ color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingBag size={18} style={{ color: 'var(--primary)' }} /> Bill Breakdown
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Tickets ({selectedSeats.length} seats)</span>
                    <span>₹{ticketTotal}</span>
                  </div>

                  {foodSubtotal > 0 && (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Food Subtotal</span>
                        <span>₹{foodSubtotal}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Food GST Tax (18%)</span>
                        <span>₹{foodTax}</span>
                      </div>
                    </>
                  )}

                  <hr style={{ border: '0', borderTop: '1px solid var(--border-color)', margin: '12px 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffffff', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    <span>Total Bill</span>
                    <span style={{ color: 'var(--primary)' }}>₹{totalBillAmount}</span>
                  </div>
                </div>

                <button 
                  onClick={handleProceedToCheckout} 
                  className="btn btn-primary"
                  style={{ width: '100%', marginTop: '24px', display: 'flex', justifyContent: 'center' }}
                >
                  Proceed to Checkout <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SeatSelection;
