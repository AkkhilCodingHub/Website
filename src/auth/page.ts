import { Request, Response, NextFunction } from 'express';
import { Admin } from '@/types/admin';
import jwt from 'jsonwebtoken';

interface VerifyAdminTokenRequest extends Request {
  admin: Admin;
}

// Middleware to verify if the admin token is valid
export function verifyAdminToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT secret is undefined');
    }
    const decoded = jwt.verify(token, secret);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    // Attach admin details to the request after successful verification
    (req as VerifyAdminTokenRequest).admin = decoded as Admin;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(500).json({ message: 'Failed to authenticate token' });
  }
}

// Function to generate a new admin token
export function generateAdminToken(admin: Admin) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT secret is undefined');
  }
  const token = jwt.sign(
    { adminId: admin.id, adminPin: admin.pin },
    secret,
    { expiresIn: '1h' }
  );
  return token;
}

