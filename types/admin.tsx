import mongoose from "mongoose";
export interface Admin{
  name: string;
  pin: string;
}

export interface Teacher{
  name: string;
  pin: string;
}

export interface Student {
  // Define your student data structure here (e.g., name, branch, semester)
  name: string;
  rollno: number;
  branch: string;
  semester: number;
  // Add other relevant fields
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
