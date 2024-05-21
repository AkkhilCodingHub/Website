import mongoose from "mongoose";

export interface Admin{
  id: string;
  pin: string;
}

export interface Semester {
  value: number;
  label: string;
}


export interface Branch {
  value: string;
  label: string;
}

export interface User{
  name: string;
  pin: string;
}

export interface Student {
  name: string;
  rollno: number;
  branch: string;
  semester: number;
  subject: string;
  marks: number;
}

export type StudentData = Student | Student[];

export interface StudentProfile {
  name: string;
  rollNumber: string;
  semester: number;
  branch: string;
  marks: {
    [subject: string]: number | null;
  };
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

export const branches: Branch[] = [
  { value: 'architecture', label: 'Architecture' },
  { value: 'computer', label: 'Computer' },
  { value: 'civil', label: 'Civil' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'mechanical', label: 'Machanical' },
  { value: 'mlt', label: 'MLT' },
  { value: 'ic', label: 'I/C' },
];

export const Semesters: Semester[] = [
  {value: 1, label: 'Semester 1'},
  { value: 2, label: 'Semester 2' },
  { value: 3, label: 'Semester 3' },
  { value: 4, label: 'Semester 4' },
  { value: 5, label: 'Semester 5' },
  { value: 6, label: 'Semester 6' },
  ];

export const admins: Admin[] = [
  { id: 'admin', pin: 'admin' },
];