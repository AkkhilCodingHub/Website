import mongoose from 'mongoose';

let connection: mongoose.Connection | null = null;

export async function connectToDb() {
  try {
    if (!connection) {
      await mongoose.connect(process.env.mongoUri!);
      connection = mongoose.connection;

      connection.on('connected', () => {
        console.log('MongoDB connected successfully');
      });

      connection.on('error', (err) => {
        console.log("MongoDB connection error-" + err);
        process.exit();
      });
    }
    return connection;
  } catch (error) {
    console.log('Something went wrong!');
    console.log(error);
    throw error;
  }
}

export async function getDb() {
  if (!connection) {
    await connectToDb();
  }
  return connection;
}