export const screens = [
  {
    id: "scr1",
    name: "Screen 1 (IMAX)",
    formats: ["IMAX", "3D", "2D"],
    timings: [
      { time: "10:00 AM", status: "Available" },
      { time: "01:30 PM", status: "Filling Fast" },
      { time: "04:45 PM", status: "Sold Out" },
      { time: "07:30 PM", status: "Filling Fast" },
      { time: "10:30 PM", status: "Available" }
    ]
  },
  {
    id: "scr2",
    name: "Screen 2 (Premium Cinema)",
    formats: ["2D", "3D"],
    timings: [
      { time: "09:00 AM", status: "Available" },
      { time: "12:15 PM", status: "Filling Fast" },
      { time: "03:30 PM", status: "Available" },
      { time: "06:45 PM", status: "Filling Fast" },
      { time: "09:45 PM", status: "Available" }
    ]
  },
  {
    id: "scr3",
    name: "Screen 3 (4DX Experience)",
    formats: ["4DX", "3D"],
    timings: [
      { time: "11:15 AM", status: "Filling Fast" },
      { time: "02:30 PM", status: "Sold Out" },
      { time: "05:45 PM", status: "Available" },
      { time: "08:45 PM", status: "Filling Fast" },
      { time: "11:45 PM", status: "Available" }
    ]
  }
];

export const generateDates = () => {
  const dates = [];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    
    let label = "";
    if (i === 0) label = "Today";
    else if (i === 1) label = "Tomorrow";
    else label = `${d.getDate()} ${months[d.getMonth()]}`;

    dates.push({
      id: `d-${i}`,
      label: label,
      dayName: daysOfWeek[d.getDay()],
      dateStr: d.toISOString().split("T")[0]
    });
  }
  return dates;
};

// Generates a mock seat layout for a given screen and show time
// We'll generate a grid: 10 rows (A-J), 12 seats per row
export const generateSeatLayout = (showId) => {
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
  const layout = [];
  
  // Hash showId to consistently seed random booked seats for the same show
  let seed = 0;
  if (showId) {
    for (let i = 0; i < showId.length; i++) {
      seed += showId.charCodeAt(i);
    }
  }

  const seededRandom = () => {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  rows.forEach((row, rowIndex) => {
    let category = "Standard";
    let price = 180;
    
    if (rowIndex < 2) {
      category = "Recliner";
      price = 450;
    } else if (rowIndex < 5) {
      category = "Premium";
      price = 300;
    }

    const rowSeats = [];
    for (let number = 1; number <= 14; number++) {
      // Create aisles: skip index 4 and 11 for realistic cinema layout
      if (number === 4 || number === 11) {
        rowSeats.push({ isAisle: true });
      } else {
        const rand = seededRandom();
        let status = "Available";
        if (rand < 0.3) {
          status = "Booked";
        } else if (rand < 0.35) {
          status = "VIP"; // Special VIP reserved (unavailable/premium colored)
        }

        rowSeats.push({
          id: `${row}-${number}`,
          row,
          number,
          category,
          price,
          status
        });
      }
    }
    layout.push({ rowName: row, seats: rowSeats });
  });

  return layout;
};
