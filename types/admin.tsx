import mongoose from "mongoose";
export interface Admin{
  name: string;
  pin: string;
}

export interface Teacher{
  name: string;
  pin: string;
}

// Mongoose schema for Teacher documents
export const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure unique teacher names
    },
  pin: {
    type: String,
    required: true,
    unique: true, // Ensure unique PINs
    },
    // Add additional fields as needed (e.g., email, subjects taught, etc.)
});
