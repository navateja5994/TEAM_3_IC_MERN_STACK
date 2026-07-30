import { useState, useEffect } from 'react'
import auraNoir from './assets/aura_noir_1785314427784.jpg'
import bleuAzur from './assets/bleu_azur_1785314454142.jpg'
import roseDamour from './assets/rose_damour_1785314440459.jpg'
import amberLumiere from './assets/amber_lumiere_1785314468637.jpg'
import oudInsense from './assets/oud_insense.jpg'
import rougeSoiree from './assets/rouge_soiree.jpg'
import vertEclat from './assets/vert_eclat.jpg'
import soleilDor from './assets/soleil_dor.jpg'
import cuirImperial from './assets/cuir_imperial.jpg'
import jardinDeNuit from './assets/jardin_de_nuit.jpg'
import santalSupreme from './assets/santal_supreme.jpg'
import neroliBlanc from './assets/neroli_blanc.jpg'
import noirEpice from './assets/noir_epice.jpg'
import './App.css'

const PRODUCTS = [
  {
    id: 1,
    name: 'AURA NOIR',
    category: 'men',
    price: 145.0,
    image: auraNoir,
    concentration: 'Eau de Parfum',
    description: 'An intense, mysterious scent combining earthy vetiver, smoky cedarwood, and cracked black pepper.',
    notes: ['Vetiver', 'Cedarwood', 'Black Pepper', 'Sandalwood'],
    rating: 4.9,
    reviews: 124
  },
  {
    id: 2,
    name: 'BLEU AZUR',
    category: 'men',
    price: 125.0,
    image: bleuAzur,
    concentration: 'Eau de Parfum',
    description: 'A clean, crisp composition featuring marine sea salt, zesty bergamot, and rich, earthy ambergris.',
    notes: ['Sea Salt', 'Bergamot', 'Ambergris', 'Grapefruit'],
    rating: 4.7,
    reviews: 98
  },
  {
    id: 3,
    name: 'ROSE D\'AMOUR',
    category: 'women',
    price: 135.0,
    image: roseDamour,
    concentration: 'Eau de Parfum',
    description: 'An enchanting, seductive fragrance layered with sweet Damask rose, warm patchouli, and dark cocoa.',
    notes: ['Damask Rose', 'Patchouli', 'Dark Chocolate', 'Vanilla'],
    rating: 4.8,
    reviews: 156
  },
  {
    id: 4,
    name: 'AMBER LUMIÈRE',
    category: 'women',
    price: 175.0,
    image: amberLumiere,
    concentration: 'Extrait de Parfum',
    description: 'A glowing, sophisticated blend of warm golden amber, sweet tonka bean, and sheer white musk.',
    notes: ['Golden Amber', 'Tonka Bean', 'White Musk', 'Benzoin'],
    rating: 5.0,
    reviews: 82
  },
  {
    id: 5,
    name: 'OUD INSENSÉ',
    category: 'men',
    price: 165.0,
    image: oudInsense,
    concentration: 'Extrait de Parfum',
    description: 'A deep, hypnotic blend of premium Cambodian oud, dark leather, warm saffron, and burning incense.',
    notes: ['Cambodian Oud', 'Leather', 'Saffron', 'Incense'],
    rating: 4.9,
    reviews: 112
  },
  {
    id: 6,
    name: 'ROUGE SOIRÉE',
    category: 'women',
    price: 155.0,
    image: rougeSoiree,
    concentration: 'Eau de Parfum',
    description: 'A glamorous, velvety symphony of sweet jasmine grandiflorum, bitter almond, warm amberwood, and sheer musk.',
    notes: ['Jasmine', 'Bitter Almond', 'Amberwood', 'Musk'],
    rating: 4.8,
    reviews: 143
  },
  {
    id: 7,
    name: 'VERT ÉCLAT',
    category: 'men',
    price: 130.0,
    image: vertEclat,
    concentration: 'Eau de Parfum',
    description: 'A bright, invigorating creation featuring fresh crushed mint, crisp green tea, zesty lime, and clean white cedar.',
    notes: ['Mint', 'Green Tea', 'Lime', 'White Cedar'],
    rating: 4.6,
    reviews: 76
  },
  {
    id: 8,
    name: 'SOLEIL D\'OR',
    category: 'women',
    price: 180.0,
    image: soleilDor,
    concentration: 'Extrait de Parfum',
    description: 'A glowing, radiant composition layered with sweet orange blossom, creamy coconut milk, sea salt, and ylang-ylang.',
    notes: ['Orange Blossom', 'Coconut Milk', 'Sea Salt', 'Ylang-Ylang'],
    rating: 5.0,
    reviews: 64
  },
  {
    id: 9,
    name: 'CUIR IMPÉRIAL',
    category: 'men',
    price: 160.0,
    image: cuirImperial,
    concentration: 'Eau de Parfum',
    description: 'A powerful, sophisticated fusion of rich Russian leather, smoky tobacco leaf, and warm amberwood.',
    notes: ['Russian Leather', 'Tobacco Leaf', 'Amberwood', 'Cacao'],
    rating: 4.8,
    reviews: 92
  },
  {
    id: 10,
    name: 'JARDIN DE NUIT',
    category: 'women',
    price: 150.0,
    image: jardinDeNuit,
    concentration: 'Eau de Parfum',
    description: 'A seductive nocturnal bloom blending sweet night-blooming jasmine, creamy tuberose, and warm Madagascar vanilla.',
    notes: ['Night Jasmine', 'Tuberose', 'Vanilla', 'Sandalwood'],
    rating: 4.9,
    reviews: 104
  },
  {
    id: 11,
    name: 'SANTAL SUPRÊME',
    category: 'men',
    price: 170.0,
    image: santalSupreme,
    concentration: 'Extrait de Parfum',
    description: 'A smooth, enveloping composition of warm Australian sandalwood, spicy cardamom, and sheer papyrus.',
    notes: ['Sandalwood', 'Cardamom', 'Papyrus', 'Leather'],
    rating: 4.7,
    reviews: 88
  },
  {
    id: 12,
    name: 'NEROLI BLANC',
    category: 'women',
    price: 140.0,
    image: neroliBlanc,
    concentration: 'Eau de Parfum',
    description: 'A sparkling, sunlit masterpiece combining crisp Tunisian neroli, sweet orange blossom, and clean white musk.',
    notes: ['Neroli', 'Orange Blossom', 'White Musk', 'Petitgrain'],
    rating: 5.0,
    reviews: 73
  },
  {
    id: 13,
    name: 'NOIR ÉPICE',
    category: 'men',
    price: 155.0,
    image: noirEpice,
    concentration: 'Eau de Parfum',
    description: 'An exotic, spicy blend featuring warm cinnamon bark, zesty fresh ginger, and rich Indonesian patchouli.',
    notes: ['Cinnamon Bark', 'Ginger', 'Patchouli', 'Pimento'],
    rating: 4.8,
    reviews: 65
  }
]

function App() {
  const [cart, setCart] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [checkoutStep, setCheckoutStep] = useState('cart') // 'cart', 'shipping', 'payment', 'success'
  const [activeInfoTab, setActiveInfoTab] = useState(null)
  
  // Checkout states
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('upi') // 'upi', 'cod'
  const [upiId, setUpiId] = useState('')
  const [upiError, setUpiError] = useState('')
  const [shippingErrors, setShippingErrors] = useState({})
  
  // Simulation states
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [cartBadgeAnimation, setCartBadgeAnimation] = useState(false)

  // Trigger mini cart icon animation when cart changes
  useEffect(() => {
    if (cart.length > 0) {
      setCartBadgeAnimation(true)
      const timer = setTimeout(() => setCartBadgeAnimation(false), 500)
      return () => clearTimeout(timer)
    }
  }, [cart])

  // Cart operations
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { product, quantity: 1 }]
    })
  }

  const updateQuantity = (productId, amount) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + amount
            return { ...item, quantity: newQty }
          }
          return item
        })
        .filter((item) => item.quantity > 0)
    })
  }

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))
  }

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const getCartTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  // Input Handlers
  const handleShippingChange = (e) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({ ...prev, [name]: value }))
    // Clear errors as user types
    if (shippingErrors[name]) {
      setShippingErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Validators
  const validateShipping = () => {
    const errors = {}
    if (!shippingInfo.name.trim()) errors.name = 'Full Name is required'
    if (!shippingInfo.email.trim() || !/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      errors.email = 'Valid Email is required'
    }
    if (!shippingInfo.address.trim()) errors.address = 'Address is required'
    if (!shippingInfo.city.trim()) errors.city = 'City is required'
    if (!shippingInfo.state.trim()) errors.state = 'State is required'
    if (!shippingInfo.zip.trim() || !/^\d{5,6}$/.test(shippingInfo.zip)) {
      errors.zip = 'Valid ZIP/Postal Code is required'
    }
    if (!shippingInfo.phone.trim() || !/^\d{10}$/.test(shippingInfo.phone)) {
      errors.phone = 'Valid 10-digit Phone Number is required'
    }
    setShippingErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleShippingSubmit = (e) => {
    e.preventDefault()
    if (validateShipping()) {
      setCheckoutStep('payment')
    }
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    if (paymentMethod === 'upi') {
      if (!upiId.trim() || !/^[a-zA-Z0-9.-]+@[a-zA-Z0-9.-]+$/.test(upiId)) {
        setUpiError('Please enter a valid UPI ID (e.g. user@bank)')
        return
      }
      setUpiError('')
    }

    setIsProcessing(true)

    // Simulate luxury transaction gateway delay
    setTimeout(() => {
      setIsProcessing(false)
      const randomOrderId = 'AUR-' + Math.floor(100000 + Math.random() * 900000)
      setOrderId(randomOrderId)
      setCheckoutStep('success')
      setCart([]) // Clear cart
    }, 2000)
  }

  // Filters
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.notes.some(note => note.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="app-container">
      {/* Top Banner / Announcement */}
      <div className="announcement-bar">
        <span>Complimentary Standard Shipping & Signature Luxury Gift Wrapping on all Orders</span>
      </div>

      {/* Header */}
      <header className="main-header">
        <div className="header-logo">
          <a href="#" onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}>
            <h1>PRATHAP</h1>
            <span className="logo-sub">HAUTE PARFUMERIE</span>
          </a>
        </div>

        <div className="search-bar-container">
          <svg className="search-icon" viewBox="0 0 24 24" width="18" height="18">
            <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <input
            type="text"
            placeholder="Search fragrances, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        <div className="header-actions">
          <button 
            className="cart-toggle-btn" 
            onClick={() => { setIsCartOpen(true); setCheckoutStep('cart'); }}
            aria-label="Open Cart"
          >
            <div className={`cart-icon-wrapper ${cartBadgeAnimation ? 'shake' : ''}`}>
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path fill="currentColor" d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              {getCartTotalItems() > 0 && (
                <span className="cart-badge">{getCartTotalItems()}</span>
              )}
            </div>
            <span className="cart-total-preview">₹{getSubtotal().toFixed(2)}</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <h2 className="hero-subtitle">THE ART OF SCENT</h2>
              <h3 className="hero-title">Elegance in Every Droplet</h3>
              <p className="hero-text">
                Discover our curated portfolio of rare ingredients, designed to express individuality, confidence, and ultimate sophistication.
              </p>
              <a href="#fragrance-collection" className="gold-btn">Explore Collections</a>
            </div>
          </section>

          {/* Main Content Layout */}
          <main className="main-content" id="fragrance-collection">
            
            {/* Navigation Filters */}
            <div className="filter-navigation">
              <h2>Our Collections</h2>
              <div className="filter-tabs">
                <button 
                  className={`filter-tab ${selectedCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  All Fragrances
                </button>
                <button 
                  className={`filter-tab ${selectedCategory === 'men' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('men')}
                >
                   Men's 
                </button>
                <button 
                  className={`filter-tab ${selectedCategory === 'women' ? 'active' : ''}`}
                  onClick={() => setSelectedCategory('women')}
                >
                  Women's
                </button>
                
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No masterworks match your current search details.</p>
                <button className="reset-filter-btn" onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}>
                  Show All Masterpieces
                </button>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <div className="product-card" key={product.id}>
                    <div className="product-image-container">
                      <img src={product.image} alt={product.name} className="product-image" />
                      <div className="product-badge">{product.concentration}</div>
                    </div>
                    
                    <div className="product-details">
                      <span className="product-category">
                        {product.category === 'men' ? 'POUR HOMME' : product.category === 'women' ? 'POUR FEMME' : 'MIXTE'}
                      </span>
                      <h3 className="product-name">{product.name}</h3>
                      
                      {/* Rating */}
                      <div className="product-rating">
                        <div className="stars">
                          {'★'.repeat(Math.floor(product.rating))}
                          {product.rating % 1 !== 0 ? '½' : ''}
                        </div>
                        <span className="rating-text">({product.reviews} reviews)</span>
                      </div>

                      <p className="product-description">{product.description}</p>
                      
                      {/* Notes tag list */}
                      <div className="product-notes">
                        {product.notes.map((note, index) => (
                          <span key={index} className="note-tag">{note}</span>
                        ))}
                      </div>

                      <div className="product-footer">
                        <span className="product-price">₹{product.price.toFixed(2)}</span>
                        <button 
                          className="add-to-cart-btn"
                          onClick={() => addToCart(product)}
                        >
                          <span>Add To Cart</span>
                          <svg viewBox="0 0 24 24" width="16" height="16">
                            <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

      {/* Information Modal Overlay */}
      {activeInfoTab && (
        <div className="info-modal-overlay" onClick={() => setActiveInfoTab(null)}>
          <div className="info-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="info-modal-close" onClick={() => setActiveInfoTab(null)} aria-label="Close Info Panel">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
            <div className="info-modal-body">
              {activeInfoTab === 'about' && (
                <div className="info-tab-content">
                  <span className="info-subtitle">LA MAISON</span>
                  <h3 className="info-title">THE LEGACY OF PRATHAP</h3>
                  <div className="info-divider"></div>
                  <p>
                    Founded on the principles of Haute Parfumerie, PRATHAP is a house dedicated to the art of scent. We blend time-honored distillation techniques with contemporary design, creating sophisticated olfactory masterworks that express individuality, confidence, and ultimate luxury.
                  </p>
                  <p>
                    Every composition is hand-poured, matured to perfection, and bottled in custom obsidian crystal. For us, a fragrance is not merely an accessory—it is an intimate statement of identity and a physical memory of refined elegance.
                  </p>
                  <p>Each perfume is crafted with premium ingredients and designed to reflect confidence, individuality, and sophistication.</p>
                  <p>At PRATHAP, fragrance is more than a scent—it's your signature, leaving a lasting impression wherever you go.</p>
                  <p>PRATHAP – Where Luxury Becomes a Signature.</p>
                </div>
              )}
              {activeInfoTab === 'sourcing' && (
                <div className="info-tab-content">
                  <span className="info-subtitle">L'ARTISANAT</span>
                  <h3 className="info-title">ARTISAN SOURCING</h3>
                  <div className="info-divider"></div>
                  <p>
                    We traverse the globe to source the rarest, most exquisite raw botanical ingredients. From the hand-picked Damask Rose in Turkey to the deep Cambodian Oud, our ingredients are sustainably harvested by local growers who have preserved their botanical heritage for generations.
                  </p>
                  <p>
                    We believe that true luxury lies in the purity of the soil and the dedication of the hand. Our team monitors every stage of growth, ensuring each bloom and resin is harvested at the peak of its olfactory potency, producing oils of unmatched complexity and projection.
                  </p>
                </div>
              )}
              {activeInfoTab === 'consultation' && (
                <div className="info-tab-content">
                  <span className="info-subtitle">EXPÉRIENCE UNIQUE</span>
                  <h3 className="info-title">OLFACTORY CONSULTATIONS</h3>
                  <div className="info-divider"></div>
                  <p>
                    Scent is the most intimate form of self-expression. Our bespoke virtual and in-boutique consultations help you discover or build your signature scent profile.
                  </p>
                  <p>
                    Schedule a private, one-on-one session with our master perfumers. During this sensory journey, you will explore top notes, base configurations, and configure a custom bottle matching your unique personality, lifestyle, and olfactory desires.
                  </p>
                  <button className="gold-action-btn book-consultation-btn" onClick={() => { alert('Olfactory consultation booking request submitted. Our concierge team will reach out shortly.'); setActiveInfoTab(null); }}>
                    Book Private Consultation
                  </button>
                </div>
              )}
              {activeInfoTab === 'contact' && (
                <div className="info-tab-content">
                  <span className="info-subtitle">CONTACT CONCIERGE</span>
                  <h3 className="info-title">CONNECT WITH OUR MAISON</h3>
                  <div className="info-divider"></div>
                  <p>
                    Our concierge team is at your disposal for orders, boutique information, or private event bookings.
                  </p>
                  <div className="contact-details-list">
                    <div className="contact-item">
                      <strong>FLAGSHIP BOUTIQUE:</strong>
                      <span>Colaba Causeway, Mumbai, Maharashtra 400005, India</span>
                    </div>
                    <div className="contact-item">
                      <strong>ELECTRONIC CORRESPONDENCE:</strong>
                      <span>concierge@prathap.com</span>
                    </div>
                    <div className="contact-item">
                      <strong>MAISON HOTLINE:</strong>
                      <span>+91 98765 43210</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Cart & Checkout Sidebar Drawer */}
      <div className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
        <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            {checkoutStep !== 'cart' && checkoutStep !== 'success' && (
              <button className="back-btn" onClick={() => {
                if (checkoutStep === 'shipping') setCheckoutStep('cart')
                if (checkoutStep === 'payment') setCheckoutStep('shipping')
              }}>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                </svg>
              </button>
            )}
            <h3>
              {checkoutStep === 'cart' && 'YOUR SELECTIONS'}
              {checkoutStep === 'shipping' && 'DELIVERY ADDRESS'}
              {checkoutStep === 'payment' && 'SECURE PAYMENT'}
              {checkoutStep === 'success' && 'ORDER COMPLETED'}
            </h3>
            <button className="close-drawer-btn" onClick={() => setIsCartOpen(false)} aria-label="Close Cart">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>

          <div className="drawer-body">
            {/* Step 1: Cart Items */}
            {checkoutStep === 'cart' && (
              <>
                {cart.length === 0 ? (
                  <div className="empty-cart-view">
                    <svg viewBox="0 0 24 24" width="60" height="60" className="empty-cart-icon">
                      <path fill="currentColor" d="M19 13H5v-2h14v2z"/>
                    </svg>
                    <p className="empty-text">Your luxury fragrance chest is currently empty.</p>
                    <button className="continue-shopping-btn" onClick={() => setIsCartOpen(false)}>
                      Continue Searching
                    </button>
                  </div>
                ) : (
                  <div className="cart-items-container">
                    {cart.map((item) => (
                      <div className="cart-item-card" key={item.product.id}>
                        <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
                        <div className="cart-item-info">
                          <span className="cart-item-category">{item.product.category === 'men' ? 'POUR HOMME' : item.product.category === 'women' ? 'POUR FEMME' : 'MIXTE'}</span>
                          <h4>{item.product.name}</h4>
                          <span className="cart-item-price">₹{item.product.price.toFixed(2)}</span>

                          <div className="cart-item-controls">
                            <div className="quantity-selector">
                              <button onClick={() => updateQuantity(item.product.id, -1)} aria-label="Decrease quantity">-</button>
                              <span>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.product.id, 1)} aria-label="Increase quantity">+</button>
                            </div>
                            <button className="remove-item-btn" onClick={() => removeFromCart(item.product.id)}>
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Step 2: Shipping Details Form */}
            {checkoutStep === 'shipping' && (
              <form onSubmit={handleShippingSubmit} className="checkout-form">
                <div className="form-group">
                  <label htmlFor="shipping-name">Full Name</label>
                  <input
                    type="text"
                    id="shipping-name"
                    name="name"
                    value={shippingInfo.name}
                    onChange={handleShippingChange}
                    placeholder="E.g., Julian Harrison"
                    className={shippingErrors.name ? 'error-input' : ''}
                  />
                  {shippingErrors.name && <span className="error-text">{shippingErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="shipping-email">Email Address</label>
                  <input
                    type="email"
                    id="shipping-email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    placeholder="E.g., julian@example.com"
                    className={shippingErrors.email ? 'error-input' : ''}
                  />
                  {shippingErrors.email && <span className="error-text">{shippingErrors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="shipping-address">Delivery Address</label>
                  <input
                    type="text"
                    id="shipping-address"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    placeholder="E.g., Flat 402, Golden Crest Apartments"
                    className={shippingErrors.address ? 'error-input' : ''}
                  />
                  {shippingErrors.address && <span className="error-text">{shippingErrors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="shipping-city">City</label>
                    <input
                      type="text"
                      id="shipping-city"
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      placeholder="E.g., Mumbai"
                      className={shippingErrors.city ? 'error-input' : ''}
                    />
                    {shippingErrors.city && <span className="error-text">{shippingErrors.city}</span>}
                  </div>

                  <div className="form-group half">
                    <label htmlFor="shipping-state">State</label>
                    <input
                      type="text"
                      id="shipping-state"
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                      placeholder="E.g., Maharashtra"
                      className={shippingErrors.state ? 'error-input' : ''}
                    />
                    {shippingErrors.state && <span className="error-text">{shippingErrors.state}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="shipping-zip">ZIP / Postal Code</label>
                    <input
                      type="text"
                      id="shipping-zip"
                      name="zip"
                      value={shippingInfo.zip}
                      onChange={handleShippingChange}
                      placeholder="E.g., 400001"
                      className={shippingErrors.zip ? 'error-input' : ''}
                    />
                    {shippingErrors.zip && <span className="error-text">{shippingErrors.zip}</span>}
                  </div>

                  <div className="form-group half">
                    <label htmlFor="shipping-phone">Phone Number</label>
                    <input
                      type="tel"
                      id="shipping-phone"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleShippingChange}
                      placeholder="10-digit number"
                      className={shippingErrors.phone ? 'error-input' : ''}
                    />
                    {shippingErrors.phone && <span className="error-text">{shippingErrors.phone}</span>}
                  </div>
                </div>

                <button type="submit" className="gold-action-btn">
                  Continue to Payment
                </button>
              </form>
            )}

            {/* Step 3: Payment Section */}
            {checkoutStep === 'payment' && (
              <div className="payment-container">
                <div className="payment-tabs">
                  <button
                    className={`payment-tab-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('upi')}
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor" d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                    </svg>
                    <span>UPI Transfer</span>
                  </button>
                  <button
                    className={`payment-tab-btn ${paymentMethod === 'cod' ? 'active' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"/>
                    </svg>
                    <span>Cash on Delivery</span>
                  </button>
                </div>

                <form onSubmit={handlePlaceOrder} className="payment-form">
                  {paymentMethod === 'upi' ? (
                    <div className="upi-payment-details">
                      <div className="form-group">
                        <label htmlFor="upi-id-input">Enter UPI ID</label>
                        <input
                          type="text"
                          id="upi-id-input"
                          placeholder="e.g. mobileNumber@upi, name@okaxis"
                          value={upiId}
                          onChange={(e) => {
                            setUpiId(e.target.value)
                            if (upiError) setUpiError('')
                          }}
                          className={upiError ? 'error-input' : ''}
                        />
                        {upiError && <span className="error-text">{upiError}</span>}
                      </div>

                      <div className="upi-qr-scanner-box">
                        <p className="qr-label">Or Scan Instant QR Code</p>
                        <div className="qr-code-placeholder">
                          {/* Built-in high fidelity SVG QR Code simulator */}
                          <svg viewBox="0 0 100 100" width="140" height="140" className="simulated-qr">
                            <rect x="0" y="0" width="100" height="100" fill="#121217" />
                            {/* Outer Corners */}
                            <path d="M5 5h20v5H10v15H5zm70 0h20v20h-5V10H75zm-70 70h5v15h15v5H5zm90 0h5v25h-25v-5h15v-15z" fill="#d4af37" />
                            {/* QR Anchors */}
                            <rect x="15" y="15" width="20" height="20" fill="#d4af37" />
                            <rect x="18" y="18" width="14" height="14" fill="#121217" />
                            <rect x="21" y="21" width="8" height="8" fill="#d4af37" />
                            
                            <rect x="65" y="15" width="20" height="20" fill="#d4af37" />
                            <rect x="68" y="18" width="14" height="14" fill="#121217" />
                            <rect x="71" y="21" width="8" height="8" fill="#d4af37" />
                            
                            <rect x="15" y="65" width="20" height="20" fill="#d4af37" />
                            <rect x="18" y="68" width="14" height="14" fill="#121217" />
                            <rect x="21" y="71" width="8" height="8" fill="#d4af37" />

                            {/* Simulated Dots */}
                            <rect x="42" y="18" width="4" height="4" fill="#d4af37" />
                            <rect x="50" y="22" width="6" height="4" fill="#d4af37" />
                            <rect x="44" y="32" width="8" height="4" fill="#d4af37" />
                            <rect x="48" y="44" width="4" height="8" fill="#d4af37" />
                            <rect x="18" y="44" width="8" height="4" fill="#d4af37" />
                            <rect x="30" y="50" width="4" height="6" fill="#d4af37" />
                            <rect x="66" y="42" width="10" height="4" fill="#d4af37" />
                            <rect x="74" y="48" width="6" height="8" fill="#d4af37" />
                            <rect x="45" y="66" width="6" height="6" fill="#d4af37" />
                            <rect x="54" y="72" width="8" height="4" fill="#d4af37" />
                            <rect x="68" y="68" width="4" height="8" fill="#d4af37" />
                            <rect x="78" y="66" width="6" height="6" fill="#d4af37" />
                            <rect x="48" y="80" width="12" height="4" fill="#d4af37" />
                            <rect x="72" y="80" width="8" height="6" fill="#d4af37" />
                          </svg>
                        </div>
                        <span className="qr-helper-text">Payable amount: <strong>₹{(getSubtotal() + 15).toFixed(2)}</strong> (Includes ₹15 Shipping & Insured Wrapping)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="cod-payment-details">
                      <div className="cod-alert-box">
                        <svg viewBox="0 0 24 24" width="24" height="24" className="cod-alert-icon">
                          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                        </svg>
                        <p><strong>Cash on Delivery selected.</strong> Please make sure you have the exact amount of <strong>₹{(getSubtotal() + 15).toFixed(2)}</strong> ready in cash upon delivery to your doorstep.</p>
                      </div>
                      <div className="cod-info-bullets">
                        <ul>
                          <li>Contactless delivery verification code will be sent via SMS/Phone.</li>
                          <li>Guaranteed dispatch within 24 Hours.</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="gold-action-btn place-order-btn" 
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="btn-spinner-text">
                        <span className="gold-spinner"></span> Securing Order...
                      </span>
                    ) : (
                      `Authorize & Place Order - ₹${(getSubtotal() + 15).toFixed(2)}`
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Step 4: Success/Confirmation Screen */}
            {checkoutStep === 'success' && (
              <div className="checkout-success-view">
                <div className="success-icon-ring">
                  <svg viewBox="0 0 24 24" width="50" height="50" className="success-check-icon">
                    <path fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
                <h3>THANK YOU FOR YOUR PATRONAGE</h3>
                <p className="success-msg">Your olfactory journey begins now. We have received your order and are preparing the shipment.</p>
                
                <div className="order-receipt-summary">
                  <div className="receipt-row">
                    <span>Order Identification</span>
                    <strong className="order-id">{orderId}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Consignee</span>
                    <span>{shippingInfo.name}</span>
                  </div>
                  <div className="receipt-row">
                    <span>Payment Mode</span>
                    <span>{paymentMethod === 'upi' ? `UPI (${upiId || 'QR Scan'})` : 'Cash on Delivery'}</span>
                  </div>
                  <div className="receipt-row">
                    <span>Shipment Address</span>
                    <span className="receipt-address">{shippingInfo.address}, {shippingInfo.city}</span>
                  </div>
                </div>

                <button className="continue-shopping-btn gold-border-btn" onClick={() => {
                  setIsCartOpen(false)
                  setCheckoutStep('cart')
                }}>
                  Back to Boutique
                </button>
              </div>
            )}
          </div>

          {/* Drawer Footer (Summary calculations, sticky at bottom for Cart items) */}
          {checkoutStep === 'cart' && cart.length > 0 && (
            <div className="drawer-footer">
              <div className="summary-row">
                <span>Fragrance Selection Subtotal</span>
                <span>₹{getSubtotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Insured Courier & Scent Wrapping</span>
                <span>₹15.00</span>
              </div>
              <div className="summary-row total-row">
                <span>Grand Total</span>
                <span>₹{(getSubtotal() + 15).toFixed(2)}</span>
              </div>

              <button className="gold-action-btn" onClick={() => setCheckoutStep('shipping')}>
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>PRATHAP</h3>
            <p>Crafting memories through bespoke olfactory masterworks since 2026.</p>
          </div>
          <div className="footer-links">
            <h4>Boutique Information</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveInfoTab('about'); }}>About PRATHAP</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveInfoTab('sourcing'); }}>Artisan Sourcing</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveInfoTab('consultation'); }}>Consultation Services</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setActiveInfoTab('contact'); }}>Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} PRATHAP Parfumerie. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
