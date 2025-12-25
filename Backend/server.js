import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors"; // <--- 1. IMPORT CORS

import authRoutes from './routes/auth.js'; 
import productRoutes from './routes/products.routs.js';
import cartRoutes from './routes/cart.routs.js';
import { connectDB } from "./lib/db.js";
import couponsRoutes from './routes/coupons.routs.js';
import paymentRoutes from './routes/payment.routs.js';
import analyticsRoutes from './routes/analytics.routs.js';

dotenv.config();

const app = express();
app.set("trust proxy", 1);
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL, 
  credentials: true,              
  methods: ["GET", "POST", "PUT", "DELETE"], 
}));

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponsRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});