import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import { User, IUser } from './models/User';
import { authMiddleware, AuthRequest } from './middleware/auth';

// Load environment variables
dotenv.config();

// Create Express app
const app: Express = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Environment variables with type safety
const {
  PORT = 3000,
  JWT_SECRET = 'fallback-secret-key',
  JWT_EXPIRES_IN = '24h',
  MONGODB_URI = 'mongodb://localhost:27017/admin_dashboard',
  NODE_ENV = 'development',
  LOG_LEVEL = 'debug'
} = process.env;

// Logging middleware based on environment
if (NODE_ENV === 'development' && LOG_LEVEL === 'debug') {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check route
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is healthy',
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Login route
app.post('/api/login', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('\n=== Login Request ===');
    console.log('Body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('Missing credentials');
      res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found:', email);
      res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValidPassword);

    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
      return;
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    console.log('Login successful:', { email, userId: user._id });
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Protected routes
app.get('/api/dashboard', authMiddleware, async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find().lean<IUser[]>();
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.isActive).length;
    const inactiveUsers = totalUsers - activeUsers;

    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name || '',
      email: user.email,
      isActive: user.isActive || false,
      region: user.region || '',
      createdAt: user.createdAt.toISOString()
    }));

    res.json({
      success: true,
      data: {
        users: formattedUsers,
        analytics: {
          totalUsers,
          activeUsers,
          inactiveUsers,
          deletedUsersCount: 0
        },
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

// Add user route
app.post('/api/users', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, region } = req.body;

    if (!email || !name) {
      res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User already exists'
      });
      return;
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      region,
      password: await bcrypt.hash('defaultPassword123', 10),
      isActive: true,
      createdAt: new Date()
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        region: user.region,
        isActive: user.isActive,
        createdAt: user.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add user'
    });
  }
});

// Connect to MongoDB with retry logic
const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    if (retries > 0) {
      console.log(`MongoDB connection failed. Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(retries - 1);
    }
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server after DB connection
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
  });
};

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app; 