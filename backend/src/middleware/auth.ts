import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    console.log('\n=== Auth Middleware ===');
    console.log('Path:', req.path);
    console.log('Headers:', req.headers);

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('No authorization header');
      res.status(401).json({
        success: false,
        message: 'No authorization header'
      });
      return;
    }

    if (!authHeader.startsWith('Bearer ')) {
      console.log('Invalid token format');
      res.status(401).json({
        success: false,
        message: 'Invalid token format'
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('No token provided');
      res.status(401).json({
        success: false,
        message: 'No token provided'
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      console.log('Token verified for user:', decoded.userId);
      req.userId = decoded.userId;
      next();
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
}; 