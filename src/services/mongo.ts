import { MongoClient } from "mongodb";
import mongoose from 'mongoose';

let client: MongoClient;
let db: any;


export async function connectToDb() {
  try {
    await mongoose.connect(process.env.mongoUri!);
    const connection = mongoose.connection;

    connection.on('connected', () => {
      console.log('MongoDB connection successfully established.');
    });

    connection.on('error', (err) => {
      console.error("MongoDB connection error: " + err);
      process.exit(1);
    });

    return connection; // Return the connection object
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
  
}

// Interface for Mongoose connection object
interface MyConnection extends mongoose.Connection {}

// Function to connect to the database and return the Mongoose connection object (recommended approach - type guard)
export const changedb = async (): Promise<MyConnection> => {
  try {
    const connection = await mongoose.connect(process.env.mongoUri!);
    console.log("Connected to MongoDB");

    // Type guard to ensure the connection is a MyConnection
    if (isMyConnection(connection)) {
      return connection;
    } else {
      throw new Error('Unexpected connection object type');
    }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

// Type guard function to check if the object is a MyConnection
function isMyConnection(obj: unknown): obj is MyConnection {
  return obj instanceof mongoose.Connection; // Check if it's a Connection instance
}