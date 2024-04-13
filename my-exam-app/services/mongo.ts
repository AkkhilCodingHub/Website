import { MongoClient } from "mongodb";
import mongoose from 'mongoose';

const mongoUri = "mongodb+srv://akkhilsharmaclass:AoPvk0JAMOPSHG1d@cluster0.j8cbmc1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Replace with your connection string

let client: MongoClient;
let db: any;

export const connectToDb = async () => {
  if (!client) {
    client = await MongoClient.connect(mongoUri);
    db = client.db();
    console.log("Connected to MongoDB");
  }
  return db;
};

// Interface for Mongoose connection object
interface MyConnection extends mongoose.Connection {}

// Function to connect to the database and return the Mongoose connection object (recommended approach - type guard)
export const changedb = async (): Promise<MyConnection> => {
  
  const connection = await mongoose.connect(mongoUri);

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
