export const currentUser = {
  name: "Alexander Mercer",
  email: "alex.mercer@cinebook.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
  upcomingBookings: [
    {
      id: "BK-88491",
      movieTitle: "Interstellar Odyssey",
      moviePoster: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=150&q=80",
      date: "31 Jul",
      time: "07:30 PM",
      screen: "Screen 1 (IMAX)",
      seats: ["C-5", "C-6"],
      format: "IMAX",
      totalAmount: 1140, // 2 Recliner tickets + food/tax
      foodItems: [
        { name: "Salted Caramel Popcorn (L)", qty: 1 },
        { name: "Premium Cola (L)", qty: 1 }
      ]
    }
  ],
  previousBookings: [
    {
      id: "BK-47201",
      movieTitle: "Kalki 2898 AD",
      moviePoster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=150&q=80",
      date: "15 Jul 2026",
      time: "03:30 PM",
      screen: "Screen 2 (Premium Cinema)",
      seats: ["E-8", "E-9"],
      format: "3D",
      totalAmount: 600
    },
    {
      id: "BK-11029",
      movieTitle: "Minnal Murali: Unleashed",
      moviePoster: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=150&q=80",
      date: "02 Jul 2026",
      time: "06:45 PM",
      screen: "Screen 3 (4DX Experience)",
      seats: ["F-1", "F-2"],
      format: "2D",
      totalAmount: 510
    }
  ],
  favouriteMovies: ["m1", "m2", "m5"]
};
