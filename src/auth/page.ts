import { Request, Response, NextFunction } from 'express';
import { Admin } from '@/types/admin';


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
    // Assuming verifyToken is a function that validates the token and returns the decoded token if valid
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    // Attach admin details to the request after successful verification
    (req as VerifyAdminTokenRequest).admin = decoded.admin;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(500).json({ message: 'Failed to authenticate token' });
  }
}

// Function to generate a new admin token
export function generateAdminToken(admin: Admin) {
  // Assuming generateToken is a function that takes admin details and returns a signed JWT
  return generateToken({
    adminId: admin.id,
    adminPin: admin.pin
  });
}

// Helper functions (assuming they exist)
function verifyToken(token: string) {
  // Logic to verify the token
  // This is a placeholder, replace with actual token verification logic
  return { admin: { id: '123', pin: 'hashedPin' } }; // Mocked decoded token
}

function generateToken(details: { adminId: string; adminPin: string }) {
  // Logic to generate a token
  // This is a placeholder, replace with actual token generation logic
  return 'generatedToken'; // Mocked token
}
