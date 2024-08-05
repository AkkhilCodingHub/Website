import mongoose from 'mongoose';

let connection: mongoose.Connection | null = null;

export async function connectToDb() {
  try {
    if (!connection) {
      const mongoUri = process.env.MONGODB_URI;
      if (!mongoUri) {
        throw new Error('MONGODB_URI is not defined in the environment variables');
      }
      await mongoose.connect(mongoUri);
      connection = mongoose.connection;

      connection.on('connected', () => {
        console.log('MongoDB connected successfully');
      });

      connection.on('error', (err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
      });
    }
    return connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function getDb() {
  if (!connection) {
    await connectToDb();
  }
  return connection;
}