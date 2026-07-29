const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Admin = require('./models/Admin');
const Movie = require('./models/Movie');
const Screen = require('./models/Screen');
const Seat = require('./models/Seat');
const Show = require('./models/Show');
const Booking = require('./models/Booking');
const BookingSeat = require('./models/BookingSeat');
const Payment = require('./models/Payment');
const FoodItem = require('./models/FoodItem');
const FoodOrder = require('./models/FoodOrder');
const Offer = require('./models/Offer');

const seedDatabase = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartnotify';
    console.log(`Connecting to MongoDB for seeding: ${connStr}`);
    await mongoose.connect(connStr);

    // 1. Clean all collections
    console.log('Clearing existing collections...');
    await User.deleteMany({});
    await Admin.deleteMany({});
    await Movie.deleteMany({});
    await Screen.deleteMany({});
    await Seat.deleteMany({});
    await Show.deleteMany({});
    await Booking.deleteMany({});
    await BookingSeat.deleteMany({});
    await Payment.deleteMany({});
    await FoodItem.deleteMany({});
    await FoodOrder.deleteMany({});
    await Offer.deleteMany({});
    console.log('Database cleared.');

    // 2. Seed Users & Admin
    console.log('Seeding users...');
    const salt = await bcrypt.genSalt(10);
    const adminPass = await bcrypt.hash('admin123', salt);
    const userPass = await bcrypt.hash('user123', salt);

    const adminUser = await User.create({
      name: 'Cinema Manager',
      email: 'admin@cinebook.com',
      phoneNumber: '+919999999999',
      passwordHash: adminPass,
      role: 'admin'
    });

    await Admin.create({
      userId: adminUser._id,
      permissions: ['all']
    });

    const regularUser = await User.create({
      name: 'John Doe',
      email: 'customer@cinebook.com',
      phoneNumber: '+918888888888',
      passwordHash: userPass,
      role: 'customer'
    });

    console.log('Users seeded.');

    // 3. Seed Food Items
    console.log('Seeding food items...');
    const foodItems = await FoodItem.create([
      {
        name: 'Salted Popcorn (Medium)',
        price: 150,
        image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&q=80&w=400',
        category: 'Snacks'
      },
      {
        name: 'Caramel Popcorn (Large)',
        price: 220,
        image: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff?auto=format&fit=crop&q=80&w=400',
        category: 'Snacks'
      },
      {
        name: 'Cheese Nachos',
        price: 180,
        image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&q=80&w=400',
        category: 'Snacks'
      },
      {
        name: 'Coca-Cola (Regular)',
        price: 90,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400',
        category: 'Beverages'
      },
      {
        name: 'Mineral Water Bottle',
        price: 40,
        image: 'https://images.unsplash.com/photo-1608889175123-8ec330b86f84?auto=format&fit=crop&q=80&w=400',
        category: 'Beverages'
      },
      {
        name: 'Solo Classic Combo',
        price: 220,
        description: 'Regular Popcorn + Regular Soft Drink',
        image: 'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?auto=format&fit=crop&q=80&w=400',
        category: 'Combos'
      },
      {
        name: 'Couple Premium Combo',
        price: 430,
        description: 'Large Popcorn + 2 Regular Soft Drinks + Nachos',
        image: 'https://images.unsplash.com/photo-1572177812157-5c889861139e?auto=format&fit=crop&q=80&w=400',
        category: 'Combos'
      }
    ]);
    console.log('Food items seeded.');

    // 4. Seed Offers
    console.log('Seeding offers...');
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Valid for 1 year

    await Offer.create([
      {
        code: 'WELCOME50',
        description: 'Get 50% discount up to ₹150 on your first booking!',
        discountPercentage: 50,
        maxDiscount: 150,
        expiryDate
      },
      {
        code: 'CINEBOOK20',
        description: 'Get 20% discount up to ₹100 on standard tickets!',
        discountPercentage: 20,
        maxDiscount: 100,
        expiryDate
      }
    ]);
    console.log('Offers seeded.');

    // 5. Seed Screens and Auto-generate Seats
    console.log('Seeding screens and seats...');
    const screen1 = await Screen.create({
      name: 'Screen 1',
      type: 'Dolby Atmos 4K',
      rows: 8, // A to H
      cols: 10
    });

    const screen2 = await Screen.create({
      name: 'Screen 2',
      type: 'IMAX 3D',
      rows: 8,
      cols: 12
    });

    const screen3 = await Screen.create({
      name: 'Screen 3',
      type: 'Premium Gold Class',
      rows: 6, // A to F
      cols: 8
    });

    // Helper function to seed seats for a screen
    const generateSeatsForScreen = async (screen) => {
      const rowChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const seats = [];
      for (let r = 0; r < screen.rows; r++) {
        const rowLabel = rowChars[r];
        let category = 'Standard';
        const rowRatio = r / screen.rows;
        if (rowRatio >= 0.75) {
          category = 'Recliner';
        } else if (rowRatio >= 0.35) {
          category = 'Premium';
        }

        for (let c = 1; c <= screen.cols; c++) {
          seats.push({
            screenId: screen._id,
            row: rowLabel,
            number: c,
            category
          });
        }
      }
      await Seat.insertMany(seats);
    };

    await generateSeatsForScreen(screen1);
    await generateSeatsForScreen(screen2);
    await generateSeatsForScreen(screen3);
    console.log('Screens and physical seats initialized.');

    // 6. Seed Movies (Telugu, English, Hindi, Tamil, Kannada, Malayalam)
    console.log('Seeding movies...');
    const movies = await Movie.create([
      {
        title: 'Kalki 2898 AD',
        description: 'A modern avatar of Vishnu, a Hindu god, is believed to have descended to earth to protect the world from evil forces. Set in a post-apocalyptic world in the year 2898 AD.',
        duration: 180,
        rating: 8.9,
        numRatings: 2540,
        language: 'Telugu',
        genres: ['Sci-Fi', 'Action', 'Drama'],
        certificate: 'U/A',
        formats: ['2D', '3D', 'IMAX'],
        releaseDate: new Date('2024-06-27'),
        posterUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
        backdropUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200',
        trailerUrl: 'https://www.youtube.com/embed/kQDd1AhGIHk',
        status: 'Now Showing',
        cast: [
          { name: 'Prabhas', character: 'Bhairava', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
          { name: 'Amitabh Bachchan', character: 'Ashwatthama', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
          { name: 'Kamal Haasan', character: 'Supreme Yaskin', imageUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150' }
        ],
        crew: [
          { name: 'Nag Ashwin', role: 'Director', imageUrl: '' },
          { name: 'C. Aswani Dutt', role: 'Producer', imageUrl: '' }
        ]
      },
      {
        title: 'Avatar: The Way of Water',
        description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
        duration: 192,
        rating: 9.1,
        numRatings: 8430,
        language: 'English',
        genres: ['Sci-Fi', 'Adventure', 'Action'],
        certificate: 'U/A',
        formats: ['3D', 'IMAX 3D', '4DX'],
        releaseDate: new Date('2022-12-16'),
        posterUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&q=80&w=400',
        backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
        trailerUrl: 'https://www.youtube.com/embed/d9MyW72ELq0',
        status: 'Now Showing',
        cast: [
          { name: 'Sam Worthington', character: 'Jake Sully', imageUrl: '' },
          { name: 'Zoe Saldana', character: 'Neytiri', imageUrl: '' },
          { name: 'Sigourney Weaver', character: 'Kiri', imageUrl: '' }
        ],
        crew: [
          { name: 'James Cameron', role: 'Director', imageUrl: '' },
          { name: 'Jon Landau', role: 'Producer', imageUrl: '' }
        ]
      },
      {
        title: 'Jawan',
        description: 'A personal vendetta drives a man to rectify the wrongs in society, while keeping a promise made years ago. He comes up against a monstrous outlaw who knows no fear and has caused extreme suffering to many.',
        duration: 169,
        rating: 8.7,
        numRatings: 4320,
        language: 'Hindi',
        genres: ['Action', 'Thriller'],
        certificate: 'U/A',
        formats: ['2D', 'IMAX'],
        releaseDate: new Date('2023-09-07'),
        posterUrl: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&q=80&w=400',
        backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1200',
        trailerUrl: 'https://www.youtube.com/embed/COv527yly_s',
        status: 'Now Showing',
        cast: [
          { name: 'Shah Rukh Khan', character: 'Vikram Rathore / Azad', imageUrl: '' },
          { name: 'Nayanthara', character: 'Narmada Rai', imageUrl: '' },
          { name: 'Vijay Sethupathi', character: 'Kaalie Gaikwad', imageUrl: '' }
        ],
        crew: [
          { name: 'Atlee Kumar', role: 'Director', imageUrl: '' },
          { name: 'Gauri Khan', role: 'Producer', imageUrl: '' }
        ]
      },
      {
        title: 'Leo',
        description: 'Parthiban is a mild-mannered cafe owner in Kashmir, who fends off a gang of murderous thugs and becomes a local hero. However, this act of heroism triggers a chain of events that links him to a dangerous drug cartel.',
        duration: 164,
        rating: 8.5,
        numRatings: 3120,
        language: 'Tamil',
        genres: ['Action', 'Thriller', 'Crime'],
        certificate: 'A',
        formats: ['2D', '4DX'],
        releaseDate: new Date('2023-10-19'),
        posterUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&q=80&w=400',
        backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1200',
        trailerUrl: 'https://www.youtube.com/embed/Po3jG409rLo',
        status: 'Now Showing',
        cast: [
          { name: 'Thalapathy Vijay', character: 'Parthiban / Leo Das', imageUrl: '' },
          { name: 'Sanjay Dutt', character: 'Antony Das', imageUrl: '' },
          { name: 'Trisha Krishnan', character: 'Sathya', imageUrl: '' }
        ],
        crew: [
          { name: 'Lokesh Kanagaraj', role: 'Director', imageUrl: '' },
          { name: 'S. S. Lalit Kumar', role: 'Producer', imageUrl: '' }
        ]
      },
      {
        title: 'Manjummel Boys',
        description: 'A group of friends from a small town in Kerala go on a trip to Kodaikanal. Their vacation turns into a desperate rescue mission when one of them falls into the infamous Guna Caves.',
        duration: 135,
        rating: 9.0,
        numRatings: 1820,
        language: 'Malayalam',
        genres: ['Survival', 'Drama', 'Adventure'],
        certificate: 'U',
        formats: ['2D'],
        releaseDate: new Date('2024-02-22'),
        posterUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400',
        backdropUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200',
        trailerUrl: 'https://www.youtube.com/embed/id848Ww1YLo',
        status: 'Now Showing',
        cast: [
          { name: 'Soubin Shahir', character: 'Kuttan', imageUrl: '' },
          { name: 'Sreenath Bhasi', character: 'Subhash', imageUrl: '' },
          { name: 'Balikrishna', character: 'Sixen', imageUrl: '' }
        ],
        crew: [
          { name: 'Chidambaram S. Poduval', role: 'Director', imageUrl: '' },
          { name: 'Babu Shahir', role: 'Producer', imageUrl: '' }
        ]
      },
      {
        title: 'Kantara',
        description: 'When greed paves the way for betrayal, scheming, and death, a young tribal man reluctantly takes on the mantle of his ancestors to seek justice for his community against feudal land-grabbers.',
        duration: 150,
        rating: 8.8,
        numRatings: 2890,
        language: 'Kannada',
        genres: ['Drama', 'Thriller', 'Action'],
        certificate: 'U/A',
        formats: ['2D'],
        releaseDate: new Date('2022-09-30'),
        posterUrl: 'https://images.unsplash.com/photo-1542204172-e7052809f852?auto=format&fit=crop&q=80&w=400',
        backdropUrl: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=1200',
        trailerUrl: 'https://www.youtube.com/embed/8F203X-t8k4',
        status: 'Now Showing',
        cast: [
          { name: 'Rishab Shetty', character: 'Shiva', imageUrl: '' },
          { name: 'Sapthami Gowda', character: 'Leela', imageUrl: '' },
          { name: 'Kishore', character: 'Muralidhar (Forest Officer)', imageUrl: '' }
        ],
        crew: [
          { name: 'Rishab Shetty', role: 'Director', imageUrl: '' },
          { name: 'Vijay Kiragandur', role: 'Producer', imageUrl: '' }
        ]
      },
      {
        title: 'Deadpool & Wolverine',
        description: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth, Deadpool. They team up to defeat a common enemy and restore safety to their universe.',
        duration: 127,
        rating: 9.0,
        numRatings: 12050,
        language: 'English',
        genres: ['Action', 'Comedy', 'Sci-Fi'],
        certificate: 'A',
        formats: ['2D', '3D', 'IMAX 3D'],
        releaseDate: new Date('2024-07-26'),
        posterUrl: 'https://images.unsplash.com/photo-1601513525393-839385590632?auto=format&fit=crop&q=80&w=400',
        backdropUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200',
        trailerUrl: 'https://www.youtube.com/embed/73_1biulk6g',
        status: 'Featured',
        cast: [
          { name: 'Ryan Reynolds', character: 'Wade Wilson / Deadpool', imageUrl: '' },
          { name: 'Hugh Jackman', character: 'Logan / Wolverine', imageUrl: '' },
          { name: 'Emma Corrin', character: 'Cassandra Nova', imageUrl: '' }
        ],
        crew: [
          { name: 'Shawn Levy', role: 'Director', imageUrl: '' },
          { name: 'Kevin Feige', role: 'Producer', imageUrl: '' }
        ]
      },
      {
        title: 'Interstellar',
        description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival on a dying Earth.',
        duration: 169,
        rating: 9.3,
        numRatings: 94000,
        language: 'English',
        genres: ['Sci-Fi', 'Drama', 'Adventure'],
        certificate: 'U',
        formats: ['2D', 'IMAX 2D'],
        releaseDate: new Date('2026-11-07'), // Scheduled for re-release or coming soon
        posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&q=80&w=400',
        backdropUrl: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&q=80&w=1200',
        trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
        status: 'Coming Soon',
        cast: [
          { name: 'Matthew McConaughey', character: 'Cooper', imageUrl: '' },
          { name: 'Anne Hathaway', character: 'Brand', imageUrl: '' },
          { name: 'Jessica Chastain', character: 'Murph', imageUrl: '' }
        ],
        crew: [
          { name: 'Christopher Nolan', role: 'Director', imageUrl: '' },
          { name: 'Emma Thomas', role: 'Producer', imageUrl: '' }
        ]
      }
    ]);
    console.log('Movies seeded successfully.');

    // 7. Seed Shows dynamically for the next 7 days
    console.log('Seeding shows dynamically for the next 7 days...');
    const nowShowingMovies = movies.filter(m => m.status === 'Now Showing' || m.status === 'Featured');
    const timeSlots = ['10:00 AM', '01:30 PM', '04:30 PM', '07:30 PM', '10:30 PM'];
    
    const showRecords = [];

    // Helper: format YYYY-MM-DD
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + dayOffset);
      const dateString = formatDate(targetDate);

      // Loop through screens and assign movies
      // Screen 1: Kalki / Leo
      // Screen 2: Avatar / Jawan
      // Screen 3: Kantara / Manjummel Boys / Deadpool

      // Screen 1 Shows
      for (let s = 0; s < 4; s++) {
        const movie = s < 2 
          ? nowShowingMovies.find(m => m.title === 'Kalki 2898 AD') 
          : nowShowingMovies.find(m => m.title === 'Leo');

        if (movie) {
          showRecords.push({
            movieId: movie._id,
            screenId: screen1._id,
            date: dateString,
            time: timeSlots[s],
            prices: { Standard: 180, Premium: 280, Recliner: 450 }
          });
        }
      }

      // Screen 2 Shows
      for (let s = 0; s < 4; s++) {
        const movie = s < 2 
          ? nowShowingMovies.find(m => m.title === 'Avatar: The Way of Water') 
          : nowShowingMovies.find(m => m.title === 'Jawan');

        if (movie) {
          showRecords.push({
            movieId: movie._id,
            screenId: screen2._id,
            date: dateString,
            time: timeSlots[s],
            prices: { Standard: 200, Premium: 300, Recliner: 500 }
          });
        }
      }

      // Screen 3 Shows
      for (let s = 0; s < 3; s++) {
        const movieArr = [
          nowShowingMovies.find(m => m.title === 'Kantara'),
          nowShowingMovies.find(m => m.title === 'Manjummel Boys'),
          nowShowingMovies.find(m => m.title === 'Deadpool & Wolverine')
        ].filter(Boolean);

        const movie = movieArr[s % movieArr.length];

        if (movie) {
          showRecords.push({
            movieId: movie._id,
            screenId: screen3._id,
            date: dateString,
            time: timeSlots[s + 1], // Offset to start at 1:30 PM
            prices: { Standard: 250, Premium: 400, Recliner: 600 }
          });
        }
      }
    }

    await Show.insertMany(showRecords);
    console.log(`Successfully scheduled ${showRecords.length} shows across 7 days.`);

    console.log('\n=========================================');
    console.log('Database Seeding Completed Successfully!');
    console.log('Default Accounts Created:');
    console.log(`- Customer: customer@cinebook.com (password: user123)`);
    console.log(`- Admin:    admin@cinebook.com    (password: admin123)`);
    console.log('=========================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
