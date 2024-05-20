import express from 'express';
const router = express.Router();

// Connect to a real database to fetch user credentials and admin pin
const db = require('./database'); // Assuming 'database' module handles database operations

interface User {
  username: string;
  pin: string;
  adminPin?: string;
}

async function getUserCredentials(): Promise<User[]> {
  const result = await db.query('SELECT username, pin, adminPin FROM users');
  return result.rows;
}

router.post('/', async (req, res) => {
  const { name, pin } = req.body;
  // Fetch user credentials from the database
  const users = await getUserCredentials();
  const user = users.find((user: User) => user.username === name && user.pin === pin);
  
  if (user) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid username or pin' });
  }
});

export default router;
