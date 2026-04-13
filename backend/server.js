import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';


dotenv.config();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to Database
connectDB();

const app = express();

// Trust proxy for Railway (needed for secure cookies behind reverse proxy)
app.set('trust proxy', 1);

// Middleware
const allowedOrigins = [
  'https://nexflow-inventory.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-owner-password', 'x-user-role'],
  exposedHeaders: ['x-owner-password', 'x-user-role']
}));

app.use(express.json());
app.use(cookieParser());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.get('origin')}`);
  next();
});


// Static Folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

import itemsRoutes from './routes/items.js';
import uploadRoutes from './routes/upload.js';
import salesRoutes from './routes/sales.js';
import cashSessionsRoutes from './routes/cashSessions.js';
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';
import shopsRoutes from './routes/shops.js';
import updatesRoutes from './routes/updates.js';

// Routes
app.use('/api/items', itemsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/cash-sessions', cashSessionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/shops', shopsRoutes);
app.use('/api/updates', updatesRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error';
  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Inventory API is running...');
});

// Custom 404 Handler
app.use((req, res) => {
  console.log(`[404] NOT FOUND: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: `Route not found on Nexflow API: ${req.method} ${req.url}`
  });
});

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
