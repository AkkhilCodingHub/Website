import { MongoClient } from "mongodb";
import mongoose from 'mongoose';

let client: MongoClient;
let db: any;


export async function connectToDb() {
  try {
    mongoose.connect(process.env.mongoUri!)
    const connection = mongoose.connection;

    connection.on('connected', () => {
      console.log('MongoDB connection successfully');
    })

    connection.on('error', (err) => {
      console.log("MongoDB connection error-" + err);
      process.exit();
    })

  } catch (error) {
    console.log('Something went wrong!');
    console.log(error);
  }
  
}

// Interface for Mongoose connection object
interface MyConnection extends mongoose.Connection {}

// Function to connect to the database and return the Mongoose connection object (recommended approach - type guard)
export const changedb = async (): Promise<MyConnection> => {
  const connection = await mongoose.connect(process.env.mongoUri!);

  // Type guard to ensure the connection is a MyConnection
  if (isMyConnection(connection)) {
    console.log("Connected to MongoDB");
    return connection;
  } else {
    throw new Error('Unexpected connection object type');
  }
};

// Type guard function to check if the object is a MyConnection
function isMyConnection(obj: unknown): obj is MyConnection {
  return obj instanceof mongoose.Connection; // Check if it's a Connection instance
}