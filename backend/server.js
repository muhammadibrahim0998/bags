import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';

// Import Routes
import itemsRoutes from './routes/items.js';
import uploadRoutes from './routes/upload.js';
import salesRoutes from './routes/sales.js';
import cashSessionsRoutes from './routes/cashSessions.js';
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';
import shopsRoutes from './routes/shops.js';
import updatesRoutes from './routes/updates.js';

dotenv.config();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to Database
connectDB();

const app = express();

// Trust proxy for Railway (crucial for secure cookies behind reverse proxies)
app.set('trust proxy', 1);

// Middleware
const allowedOrigins = [
  'https://nexflow-inventory.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.error(`[CORS Blocked]: Request from origin ${origin} rejected.`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allows frontend to send cookies/headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-owner-password', 'x-user-role'],
  exposedHeaders: ['x-owner-password', 'x-user-role']
}));

app.use(express.json());
app.use(cookieParser());

// Request logger for debugging Railway traffic
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.get('origin')}`);
  next();
});

// Static Folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// API Routes
app.use('/api/items', itemsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/cash-sessions', cashSessionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/shops', shopsRoutes);
app.use('/api/updates', updatesRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Nexflow Inventory API is running...');
});

// Custom 404 Handler (This catches any route not defined above)
app.use((req, res) => {
  console.log(`[404] Route Not Found: ${req.method} ${req.url}`);
  res.status(404).json({
    success: false,
    message: `Route not found on Nexflow API: ${req.method} ${req.url}`
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});