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

export const computer: Student[] = [
  {
    name: "Arju",
    rollno: 1,
    branch: "Computer",
    semester: 3,
    subject: "Mathematics",
    marks: 85,
  },
  {
    name: "Sara",
    rollno: 2,
    branch: "Computer",
    semester: 3,
    subject: "Physics",
    marks: 79,
  },
  {
    name: "Rahul",
    rollno: 3,
    branch: "Computer",
    semester: 3,
    subject: "Computer Science",
    marks: 88,
  },
  {
    name: "Priya",
    rollno: 4,
    branch: "Computer",
    semester: 3,
    subject: "Programming",
    marks: 90,
  },
  {
    name: "Vivek",
    rollno: 5,
    branch: "Computer",
    semester: 3,
    subject: "Data Structures",
    marks: 82,
  },
];

export const Electronics: Student[] = [
  {
    name: "Nikil",
    rollno: 1,
    branch: "Electronics",
    semester: 2,
    subject: "Physics",
    marks: 78,
  },
  {
    name: "Riya",
    rollno: 2,
    branch: "Electronics",
    semester: 2,
    subject: "Electrical Circuits",
    marks: 85,
  },
  {
    name: "Amit",
    rollno: 3,
    branch: "Electronics",
    semester: 2,
    subject: "Digital Electronics",
    marks: 92,
  },
  {
    name: "Sneha",
    rollno: 4,
    branch: "Electronics",
    semester: 2,
    subject: "Signals and Systems",
    marks: 87,
  },
  {
    name: "Rajesh",
    rollno: 5,
    branch: "Electronics",
    semester: 2,
    subject: "Communication Systems",
    marks: 80,
  },
];

export const Mechanical: Student[] =[
  {
    name: "Manav",
    rollno: 1,
    branch: "Mechanical",
    semester: 4,
    subject: "Chemistry",
    marks: 88,
  },
  {
    name: "Suresh",
    rollno: 2,
    branch: "Mechanical",
    semester: 4,
    subject: "Thermodynamics",
    marks: 84,
  },
  {
    name: "Pooja",
    rollno: 3,
    branch: "Mechanical",
    semester: 4,
    subject: "Fluid Mechanics",
    marks: 90,
  },
  {
    name: "Arun",
    rollno: 4,
    branch: "Mechanical",
    semester: 4,
    subject: "Machine Design",
    marks: 86,
  },
  {
    name: "Anjali",
    rollno: 5,
    branch: "Mechanical",
    semester: 4,
    subject: "Automobile Engineering",
    marks: 82,
  },
];

export const Civil: Student[] = [
  {
    name: "Karan",
    rollno: 1,
    branch: "Civil",
    semester: 1,
    subject: "English",
    marks: 92,
  },
  {
    name: "Rahul",
    rollno: 2,
    branch: "Civil",
    semester: 1,
    subject: "History",
    marks: 85,
  },
  {
    name: "Sonia",
    rollno: 3,
    branch: "Civil",
    semester: 1,
    subject: "Geography",
    marks: 88,
  },
  {
    name: "Amita",
    rollno: 4,
    branch: "Civil",
    semester: 1,
    subject: "Economics",
    marks: 90,
  },
  {
    name: "Raj",
    rollno: 5,
    branch: "Civil",
    semester: 1,
    subject: "Political Science",
    marks: 84,
  },
];

export const Architecture: Student[] = [
  {
    name: "Angel",
    rollno: 1,
    branch: "Architecture",
    semester: 5,
    subject: "Biology",
    marks: 74,
  },
  {
    name: "Sara",
    rollno: 2,
    branch: "Architecture",
    semester: 5,
    subject: "Design Principles",
    marks: 80,
  },
  {
    name: "Rahul",
    rollno: 3,
    branch: "Architecture",
    semester: 5,
    subject: "Architectural History",
    marks: 88,
  },
  {
    name: "Priya",
    rollno: 4,
    branch: "Architecture",
    semester: 5,
    subject: "Urban Planning",
    marks: 86,
  },
  {
    name: "Vivek",
    rollno: 5,
    branch: "Architecture",
    semester: 5,
    subject: "Sustainable Architecture",
    marks: 82,
  },
];
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