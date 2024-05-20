import { changedb } from '@/services/mongo';
import express from 'express';
import { User } from '@/types/admin'; // Import User type from admin types
const router = express.Router();

// Connect to a real database to fetch user credentials
const db = changedb(); // Assuming 'database' module handles database operations

async function getUserCredentials(): Promise<User[]> {
  const usersCollection = (await db).collection('users'); // Access the 'users' collection
  const users = await usersCollection.find({}).toArray(); // Fetch all users
  return users.map(user => ({ name: user.name, pin: user.pin })); // Map to expected structure
}

router.post('/', async (req, res) => {
  const { name, pin } = req.body;
  // Fetch user credentials from the database
  const users = await getUserCredentials();
  const user = users.find(user => user.name === name && user.pin === pin);
  
  if (user) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid username or pin' });
  }
});

export default router;
