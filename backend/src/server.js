import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import employeeRoutes from './routes/employeeRoutes.js';
import { initializeDatabase } from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend communication (allow any localhost or origin specified)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Built-in JSON body parser
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Employee Directory REST API',
  });
});

// Mount Employee Routes
app.use('/employees', employeeRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: process.env.NODE_ENV === 'production' ? undefined : err.message,
  });
});

// Start Server & Connect to Database
const startServer = async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Employee Directory API server running on port ${PORT}`);
    console.log(`📡 Endpoints available at:`);
    console.log(`   - GET    http://localhost:${PORT}/employees`);
    console.log(`   - POST   http://localhost:${PORT}/employees`);
    console.log(`   - PUT    http://localhost:${PORT}/employees/:id`);
    console.log(`   - DELETE http://localhost:${PORT}/employees/:id`);
    console.log(`   - GET    http://localhost:${PORT}/employees/stats/summary`);
  });
};

startServer();
