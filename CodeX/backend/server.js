import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import { seedDatabase } from './seed.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Base diagnostic route
app.get('/', (req, res) => {
  res.json({ message: "AURA Haute Parfumerie API is active." });
});

// GET all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: "Unable to retrieve collection collections." });
  }
});

// POST save order
app.post('/api/orders', async (req, res) => {
  try {
    const { shippingInfo, items, subtotal, shippingFee, totalAmount, paymentMethod, upiId } = req.body;
    
    // Server-side validation
    if (!shippingInfo || !items || items.length === 0 || !subtotal || !totalAmount || !paymentMethod) {
      return res.status(400).json({ message: "Incomplete order details provided." });
    }

    if (paymentMethod === 'upi' && !upiId) {
      return res.status(400).json({ message: "UPI payment ID is required." });
    }

    // Create custom human-readable Order identifier (e.g., AUR-20260804-XYZW)
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const generatedOrderId = `AUR-${datePrefix}-${randomSuffix}`;

    const newOrder = new Order({
      shippingInfo,
      items,
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod,
      upiId
    });

    const savedOrder = await newOrder.save();
    console.log(`New Order saved successfully: ID ${savedOrder._id} (Ref: ${generatedOrderId})`);

    // Return the generated order ID. 
    // App.jsx reads orderId from orderData.orderId, so we return the generated ID.
    // We will return generatedOrderId as orderId to make it look highly professional.
    res.status(201).json({
      success: true,
      orderId: generatedOrderId,
      dbId: savedOrder._id
    });
  } catch (error) {
    console.error("Error saving order to MongoDB:", error);
    res.status(500).json({ message: "Internal server error saving order details." });
  }
});

// Connect to Database and start server
const startServer = async () => {
  await connectDB();
  await seedDatabase();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
