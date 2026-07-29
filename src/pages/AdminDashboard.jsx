import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Film, Tv, Calendar, Coffee, Tag, Ticket, TrendingUp, DollarSign, Users, Award, 
  Plus, Edit, Trash, BarChart, Upload, ArrowRight
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Tabs: 'stats' | 'movies' | 'screens' | 'shows' | 'food' | 'offers' | 'bookings'
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Entities state lists
  const [movies, setMovies] = useState([]);
  const [screens, setScreens] = useState([]);
  const [shows, setShows] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [offers, setOffers] = useState([]);

  // Form inputs states
  const [movieForm, setMovieForm] = useState({
    title: '', description: '', duration: 120, rating: 8.5, numRatings: 100,
    language: 'English', genres: '', certificate: 'U/A', formats: '2D, 3D',
    releaseDate: '', posterUrl: '', backdropUrl: '', trailerUrl: '', status: 'Now Showing'
  });
  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadingBackdrop, setUploadingBackdrop] = useState(false);

  const [screenForm, setScreenForm] = useState({ name: '', type: 'Dolby Atmos 4K', rows: 8, cols: 10 });
  const [showForm, setShowForm] = useState({ movieId: '', screenId: '', date: '', time: '10:00 AM', priceStd: 150, pricePrem: 250, priceRec: 400 });
  const [foodForm, setFoodForm] = useState({ name: '', price: 100, image: '', category: 'Snacks' });
  const [offerForm, setOfferForm] = useState({ code: '', description: '', discountPercentage: 10, maxDiscount: 100, expiryDate: '' });

  // Load Admin Stats & Data
  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const res = await api.get('/api/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadAllData = async () => {
    try {
      const [moviesRes, screensRes, showsRes, foodRes, offersRes] = await Promise.all([
        api.get('/api/movies'),
        api.get('/api/screens'),
        api.get('/api/shows'),
        api.get('/api/food'),
        api.get('/api/offers')
      ]);
      setMovies(moviesRes.data);
      setScreens(screensRes.data);
      setShows(showsRes.data);
      setFoodItems(foodRes.data);
      setOffers(offersRes.data);
    } catch (err) {
      console.error('Failed to load dashboard lists:', err);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadStats();
      loadAllData();
    } else {
      navigate('/');
    }
  }, [user, navigate]);

  // Image Upload helper
  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    if (field === 'posterUrl') setUploadingPoster(true);
    if (field === 'backdropUrl') setUploadingBackdrop(true);

    try {
      const res = await api.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMovieForm(prev => ({ ...prev, [field]: res.data.imageUrl }));
    } catch (err) {
      alert('Image upload failed.');
    } finally {
      if (field === 'posterUrl') setUploadingPoster(false);
      if (field === 'backdropUrl') setUploadingBackdrop(false);
    }
  };

  // CRUD actions
  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      const body = {
        ...movieForm,
        genres: movieForm.genres.split(',').map(g => g.trim()),
        formats: movieForm.formats.split(',').map(f => f.trim())
      };
      await api.post('/api/movies', body);
      alert('Movie added successfully.');
      loadAllData();
      setMovieForm({
        title: '', description: '', duration: 120, rating: 8.5, numRatings: 100,
        language: 'English', genres: '', certificate: 'U/A', formats: '2D, 3D',
        releaseDate: '', posterUrl: '', backdropUrl: '', trailerUrl: '', status: 'Now Showing'
      });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add movie.');
    }
  };

  const handleDeleteMovie = async (id) => {
    if (!window.confirm('Delete this movie?')) return;
    try {
      await api.delete(`/api/movies/${id}`);
      loadAllData();
    } catch (err) {
      alert('Failed to delete movie.');
    }
  };

  const handleAddScreen = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/screens', screenForm);
      alert('Screen created successfully. Physical seats generated.');
      loadAllData();
      setScreenForm({ name: '', type: 'Dolby Atmos 4K', rows: 8, cols: 10 });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create screen.');
    }
  };

  const handleAddShow = async (e) => {
    e.preventDefault();
    try {
      const body = {
        movieId: showForm.movieId,
        screenId: showForm.screenId,
        date: showForm.date,
        time: showForm.time,
        prices: {
          Standard: showForm.priceStd,
          Premium: showForm.pricePrem,
          Recliner: showForm.priceRec
        }
      };
      await api.post('/api/shows', body);
      alert('Show scheduled successfully.');
      loadAllData();
      loadStats();
    } catch (err) {
      alert(err.response?.data?.error || 'Clash detected or schedule failed.');
    }
  };

  const handleCancelShow = async (id) => {
    if (!window.confirm('Cancel this show?')) return;
    try {
      await api.delete(`/api/shows/${id}`);
      loadAllData();
      loadStats();
    } catch (err) {
      alert('Failed to cancel show.');
    }
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/food', foodForm);
      alert('Food item added successfully.');
      loadAllData();
      setFoodForm({ name: '', price: 100, image: '', category: 'Snacks' });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to add food.');
    }
  };

  const handleAddOffer = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/offers', offerForm);
      alert('Coupon created successfully.');
      loadAllData();
      setOfferForm({ code: '', description: '', discountPercentage: 10, maxDiscount: 100, expiryDate: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create coupon.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <div className="admin-layout">
        {/* Admin Navigation Sidebar */}
        <div className="admin-sidebar">
          <div 
            className={`admin-nav-item ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart size={18} /> Analytics Summary
          </div>
          <div 
            className={`admin-nav-item ${activeTab === 'movies' ? 'active' : ''}`}
            onClick={() => setActiveTab('movies')}
          >
            <Film size={18} /> Movie Listings
          </div>
          <div 
            className={`admin-nav-item ${activeTab === 'screens' ? 'active' : ''}`}
            onClick={() => setActiveTab('screens')}
          >
            <Tv size={18} /> Auditorium Screens
          </div>
          <div 
            className={`admin-nav-item ${activeTab === 'shows' ? 'active' : ''}`}
            onClick={() => setActiveTab('shows')}
          >
            <Calendar size={18} /> Showtimes Scheduler
          </div>
          <div 
            className={`admin-nav-item ${activeTab === 'food' ? 'active' : ''}`}
            onClick={() => setActiveTab('food')}
          >
            <Coffee size={18} /> F&B Concessions
          </div>
          <div 
            className={`admin-nav-item ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
          >
            <Tag size={18} /> Offers & Coupons
          </div>
        </div>

        {/* Dashboard Body panel */}
        <div className="admin-body">
          {activeTab === 'stats' && (
            <div>
              <h2 style={{ color: '#ffffff', marginBottom: '24px', fontWeight: 800 }}>Analytics Overview</h2>

              {loadingStats || !stats ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                  {[1, 2, 3, 4].map(n => (
                    <div key={n} className="skeleton" style={{ height: '100px', borderRadius: 'var(--radius-lg)' }}></div>
                  ))}
                </div>
              ) : (
                <>
                  {/* Stats card indicators */}
                  <div className="admin-stats-grid">
                    <div className="stat-widget">
                      <div className="stat-icon"><DollarSign size={24} /></div>
                      <div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Today's Sales</p>
                        <span className="stat-number">₹{stats.todayRevenue}</span>
                      </div>
                    </div>
                    <div className="stat-widget">
                      <div className="stat-icon"><Ticket size={24} /></div>
                      <div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Tickets Sold</p>
                        <span className="stat-number">{stats.ticketsSold}</span>
                      </div>
                    </div>
                    <div className="stat-widget">
                      <div className="stat-icon"><TrendingUp size={24} /></div>
                      <div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Occupancy Rate</p>
                        <span className="stat-number">{stats.occupancyRate}%</span>
                      </div>
                    </div>
                    <div className="stat-widget">
                      <div className="stat-icon"><Users size={24} /></div>
                      <div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total Customers</p>
                        <span className="stat-number">{stats.totalCustomers}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Bookings lists */}
                  <div className="card" style={{ marginTop: '30px' }}>
                    <h3 style={{ color: '#ffffff', marginBottom: '16px' }}>Recent ticket sales</h3>
                    <div style={{ overflowX: 'auto' }}>
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Booking Ref</th>
                            <th>Customer</th>
                            <th>Movie</th>
                            <th>Showtime</th>
                            <th>Seats</th>
                            <th>Total Paid</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.recentBookings.map(b => (
                            <tr key={b._id}>
                              <td style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{b.bookingId}</td>
                              <td>
                                <p style={{ fontWeight: 600 }}>{b.userId?.name}</p>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{b.userId?.phoneNumber}</span>
                              </td>
                              <td>{b.showId?.movieId?.title || 'Unknown Movie'}</td>
                              <td>{b.showId?.date} | {b.showId?.time}</td>
                              <td>{b.seats.join(', ')}</td>
                              <td>₹{b.totalAmount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'movies' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
                {/* Movie list grid */}
                <div>
                  <h3 style={{ color: '#ffffff', marginBottom: '16px' }}>Active Movie Catalog</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {movies.map(movie => (
                      <div key={movie._id} className="card" style={{ display: 'flex', gap: '20px', padding: '16px' }}>
                        <img 
                          src={movie.posterUrl} 
                          alt={movie.title} 
                          style={{ width: '60px', height: '90px', borderRadius: '4px', objectFit: 'cover' }}
                        />
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h4 style={{ color: '#ffffff', fontWeight: 'bold' }}>{movie.title}</h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{movie.language} • {movie.genres.join(', ')}</p>
                            <span className="badge badge-normal" style={{ marginTop: '8px' }}>{movie.status}</span>
                          </div>
                          <button 
                            onClick={() => handleDeleteMovie(movie._id)} 
                            className="btn-icon" 
                            style={{ color: 'var(--secondary-accent)' }}
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add movie form */}
                <div className="card" style={{ height: 'fit-content' }}>
                  <h3 style={{ color: '#ffffff', marginBottom: '20px' }}>Add New Movie</h3>
                  <form onSubmit={handleAddMovie} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Movie Title</label>
                      <input 
                        type="text" required value={movieForm.title} 
                        onChange={(e) => setMovieForm({...movieForm, title: e.target.value})} 
                        className="input-field" 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Description / Synopsis</label>
                      <textarea 
                        required value={movieForm.description} 
                        onChange={(e) => setMovieForm({...movieForm, description: e.target.value})} 
                        className="input-field" style={{ minHeight: '80px', resize: 'vertical' }}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group">
                        <label className="form-label">Language</label>
                        <select 
                          className="input-field" style={{ background: 'var(--input-bg)' }}
                          value={movieForm.language} onChange={(e) => setMovieForm({...movieForm, language: e.target.value})}
                        >
                          <option value="English">English</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Telugu">Telugu</option>
                          <option value="Tamil">Tamil</option>
                          <option value="Kannada">Kannada</option>
                          <option value="Malayalam">Malayalam</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Status</label>
                        <select 
                          className="input-field" style={{ background: 'var(--input-bg)' }}
                          value={movieForm.status} onChange={(e) => setMovieForm({...movieForm, status: e.target.value})}
                        >
                          <option value="Now Showing">Now Showing</option>
                          <option value="Coming Soon">Coming Soon</option>
                          <option value="Featured">Featured</option>
                          <option value="Trending">Trending</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div className="form-group">
                        <label className="form-label">Duration (min)</label>
                        <input 
                          type="number" required value={movieForm.duration} 
                          onChange={(e) => setMovieForm({...movieForm, duration: parseInt(e.target.value)})} 
                          className="input-field" 
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Age Certificate</label>
                        <input 
                          type="text" required value={movieForm.certificate} 
                          onChange={(e) => setMovieForm({...movieForm, certificate: e.target.value})} 
                          className="input-field" placeholder="U/A"
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Genres (comma separated)</label>
                      <input 
                        type="text" required value={movieForm.genres} 
                        onChange={(e) => setMovieForm({...movieForm, genres: e.target.value})} 
                        className="input-field" placeholder="Action, Sci-Fi, Drama"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Formats (comma separated)</label>
                      <input 
                        type="text" required value={movieForm.formats} 
                        onChange={(e) => setMovieForm({...movieForm, formats: e.target.value})} 
                        className="input-field" placeholder="2D, 3D, IMAX"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Release Date</label>
                      <input 
                        type="date" required value={movieForm.releaseDate} 
                        onChange={(e) => setMovieForm({...movieForm, releaseDate: e.target.value})} 
                        className="input-field" 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Trailer Youtube URL</label>
                      <input 
                        type="text" value={movieForm.trailerUrl} 
                        onChange={(e) => setMovieForm({...movieForm, trailerUrl: e.target.value})} 
                        className="input-field" placeholder="https://www.youtube.com/embed/..."
                      />
                    </div>
                    
                    {/* Poster upload */}
                    <div className="form-group">
                      <label className="form-label">Movie Poster Image</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                          type="text" required value={movieForm.posterUrl} 
                          onChange={(e) => setMovieForm({...movieForm, posterUrl: e.target.value})} 
                          className="input-field" placeholder="Or paste image URL"
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0 12px', cursor: 'pointer' }}>
                          <Upload size={16} /> 
                          <span style={{ fontSize: '0.8rem' }}>{uploadingPoster ? 'Uploading...' : 'Upload'}</span>
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'posterUrl')} style={{ display: 'none' }} />
                        </label>
                      </div>
                    </div>

                    {/* Backdrop upload */}
                    <div className="form-group">
                      <label className="form-label">Landscape Backdrop Image</label>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <input 
                          type="text" required value={movieForm.backdropUrl} 
                          onChange={(e) => setMovieForm({...movieForm, backdropUrl: e.target.value})} 
                          className="input-field" placeholder="Or paste image URL"
                        />
                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0 12px', cursor: 'pointer' }}>
                          <Upload size={16} /> 
                          <span style={{ fontSize: '0.8rem' }}>{uploadingBackdrop ? 'Uploading...' : 'Upload'}</span>
                          <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'backdropUrl')} style={{ display: 'none' }} />
                        </label>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                      Publish Movie
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'screens' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
              <div>
                <h3 style={{ color: '#ffffff', marginBottom: '16px' }}>Active Theatre Auditoriums</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {screens.map(screen => (
                    <div key={screen._id} className="card" style={{ padding: '20px' }}>
                      <h4 style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 'bold' }}>{screen.name}</h4>
                      <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '4px' }}>{screen.type}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '8px' }}>
                        Layout structure: {screen.rows} rows (A to {String.fromCharCode(65 + screen.rows - 1)}) x {screen.cols} columns per row.
                      </p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>
                        Total capacity: {screen.rows * screen.cols} luxury seats initialized.
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ height: 'fit-content' }}>
                <h3 style={{ color: '#ffffff', marginBottom: '20px' }}>Create New Auditorium</h3>
                <form onSubmit={handleAddScreen} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Screen Name</label>
                    <input 
                      type="text" required placeholder="e.g. Screen 4" value={screenForm.name}
                      onChange={(e) => setScreenForm({...screenForm, name: e.target.value})}
                      className="input-field" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Sound/Projection Specs</label>
                    <input 
                      type="text" required placeholder="e.g. Dolby Atmos, IMAX 3D, Premium Class" value={screenForm.type}
                      onChange={(e) => setScreenForm({...screenForm, type: e.target.value})}
                      className="input-field" 
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Rows count</label>
                      <input 
                        type="number" required min={1} max={15} value={screenForm.rows}
                        onChange={(e) => setScreenForm({...screenForm, rows: parseInt(e.target.value)})}
                        className="input-field" 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Seats per Row</label>
                      <input 
                        type="number" required min={1} max={20} value={screenForm.cols}
                        onChange={(e) => setScreenForm({...screenForm, cols: parseInt(e.target.value)})}
                        className="input-field" 
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                    Initialize Screen
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'shows' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
              <div>
                <h3 style={{ color: '#ffffff', marginBottom: '16px' }}>Scheduled Shows</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {shows.map(show => (
                    <div key={show._id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
                      <div>
                        <h4 style={{ color: '#ffffff', fontWeight: 'bold' }}>{show.movieId?.title}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{show.screenId?.name} ({show.screenId?.type})</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Date: {show.date} | Time: {show.time}</p>
                      </div>
                      <button 
                        onClick={() => handleCancelShow(show._id)} 
                        className="btn-icon" 
                        style={{ color: 'var(--secondary-accent)' }}
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ height: 'fit-content' }}>
                <h3 style={{ color: '#ffffff', marginBottom: '20px' }}>Schedule New Show</h3>
                <form onSubmit={handleAddShow} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Select Movie</label>
                    <select 
                      required className="input-field" style={{ background: 'var(--input-bg)' }}
                      value={showForm.movieId} onChange={(e) => setShowForm({...showForm, movieId: e.target.value})}
                    >
                      <option value="">-- Choose Movie --</option>
                      {movies.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Select Screen</label>
                    <select 
                      required className="input-field" style={{ background: 'var(--input-bg)' }}
                      value={showForm.screenId} onChange={(e) => setShowForm({...showForm, screenId: e.target.value})}
                    >
                      <option value="">-- Choose Screen --</option>
                      {screens.map(s => <option key={s._id} value={s._id}>{s.name} ({s.type})</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input 
                        type="date" required value={showForm.date}
                        onChange={(e) => setShowForm({...showForm, date: e.target.value})}
                        className="input-field" 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Showtime</label>
                      <input 
                        type="text" required placeholder="e.g. 01:30 PM" value={showForm.time}
                        onChange={(e) => setShowForm({...showForm, time: e.target.value})}
                        className="input-field" 
                      />
                    </div>
                  </div>

                  <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#ffffff', marginTop: '6px' }}>Configure Seating Prices</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.65rem' }}>Standard</label>
                      <input 
                        type="number" required value={showForm.priceStd}
                        onChange={(e) => setShowForm({...showForm, priceStd: parseInt(e.target.value)})}
                        className="input-field" 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.65rem' }}>Premium</label>
                      <input 
                        type="number" required value={showForm.pricePrem}
                        onChange={(e) => setShowForm({...showForm, pricePrem: parseInt(e.target.value)})}
                        className="input-field" 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.65rem' }}>Recliner</label>
                      <input 
                        type="number" required value={showForm.priceRec}
                        onChange={(e) => setShowForm({...showForm, priceRec: parseInt(e.target.value)})}
                        className="input-field" 
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                    Schedule Show
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'food' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
              <div>
                <h3 style={{ color: '#ffffff', marginBottom: '16px' }}>Concessions Stand Items</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
                  {foodItems.map(item => (
                    <div key={item._id} className="food-card">
                      <div className="food-image-wrap">
                        <img src={item.image} alt={item.name} className="food-image" />
                      </div>
                      <div className="food-info">
                        <h4 className="food-name" style={{ fontSize: '0.9rem' }}>{item.name}</h4>
                        <span className="food-price" style={{ fontSize: '0.95rem' }}>₹{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ height: 'fit-content' }}>
                <h3 style={{ color: '#ffffff', marginBottom: '20px' }}>Add Food Item</h3>
                <form onSubmit={handleAddFood} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Item Name</label>
                    <input 
                      type="text" required placeholder="e.g. Caramel Popcorn" value={foodForm.name}
                      onChange={(e) => setFoodForm({...foodForm, name: e.target.value})}
                      className="input-field" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price (₹)</label>
                    <input 
                      type="number" required value={foodForm.price}
                      onChange={(e) => setFoodForm({...foodForm, price: parseInt(e.target.value)})}
                      className="input-field" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select 
                      className="input-field" style={{ background: 'var(--input-bg)' }}
                      value={foodForm.category} onChange={(e) => setFoodForm({...foodForm, category: e.target.value})}
                    >
                      <option value="Snacks">Snacks</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Combos">Combos</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Image URL</label>
                    <input 
                      type="text" required placeholder="Paste unsplash or web url" value={foodForm.image}
                      onChange={(e) => setFoodForm({...foodForm, image: e.target.value})}
                      className="input-field" 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                    Publish Food Item
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'offers' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
              <div>
                <h3 style={{ color: '#ffffff', marginBottom: '16px' }}>Active Discount Offers</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {offers.map(offer => (
                    <div key={offer._id} className="card" style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem', letterSpacing: '0.05em' }}>{offer.code}</span>
                          <p style={{ color: '#ffffff', fontSize: '0.9rem', marginTop: '4px' }}>{offer.description}</p>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '6px' }}>
                            Discount: {offer.discountPercentage}% (Up to ₹{offer.maxDiscount})
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ height: 'fit-content' }}>
                <h3 style={{ color: '#ffffff', marginBottom: '20px' }}>Create Promo Code</h3>
                <form onSubmit={handleAddOffer} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Coupon Code</label>
                    <input 
                      type="text" required placeholder="e.g. HOLIDAY30" value={offerForm.code}
                      onChange={(e) => setOfferForm({...offerForm, code: e.target.value})}
                      className="input-field" 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Description</label>
                    <input 
                      type="text" required placeholder="Get 30% discount..." value={offerForm.description}
                      onChange={(e) => setOfferForm({...offerForm, description: e.target.value})}
                      className="input-field" 
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Discount %</label>
                      <input 
                        type="number" required value={offerForm.discountPercentage}
                        onChange={(e) => setOfferForm({...offerForm, discountPercentage: parseInt(e.target.value)})}
                        className="input-field" 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Max Discount (₹)</label>
                      <input 
                        type="number" required value={offerForm.maxDiscount}
                        onChange={(e) => setOfferForm({...offerForm, maxDiscount: parseInt(e.target.value)})}
                        className="input-field" 
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input 
                      type="date" required value={offerForm.expiryDate}
                      onChange={(e) => setOfferForm({...offerForm, expiryDate: e.target.value})}
                      className="input-field" 
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                    Publish Coupon
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
      <style>{`
        @media (max-width: 992px) {
          .admin-layout {
            grid-template-columns: 1fr !important;
          }
          .admin-sidebar {
            flex-direction: row !important;
            overflow-x: auto;
            padding: 12px !important;
            border-right: none !important;
            border-bottom: 1px solid var(--border-color);
            gap: 12px;
          }
          .admin-nav-item {
            flex: 0 0 auto;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
