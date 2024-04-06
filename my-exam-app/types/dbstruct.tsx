import { connectToDb } from "../services/mongo"; // Assuming mongo.js handles database connection
import { Admin, Teacher } from "./admin"; // Import admin and teacher interfaces

export const login = async (name: string, pin: string): Promise<{ success: boolean; message?: string; admin?: Admin }> => {
  const db = await connectToDb();
  const admin = await db.collection<Admin>("admins").findOne({ name, pin });

  // Check if admin exists and return appropriate response
  if (!admin) {
    return { success: false, message: "Invalid username or PIN" };
  }

  // Login successful, return admin data
  return { success: true, admin };
};

// Function to fetch all teachers from database
export const getTeachers = async (): Promise<Teacher[]> => {
  const db = await connectToDb();
  const TeacherModel = db.model<Teacher>("Teacher", /* Your Teacher schema */); // Define Teacher model
  const teachers = await TeacherModel.find();
  return teachers;
};

// Function to add a new teacher to database
export const addTeacher = async (teacher: Teacher): Promise<void> => {
  const db = await connectToDb();
  const TeacherModel = db.model<Teacher>("Teacher", /* Your Teacher schema */); // Define Teacher model
  await TeacherModel.create(teacher); // Use Mongoose create method
};

// Function to remove a teacher from database
export const removeTeacher = async (teacherName: string): Promise<void> => {
  const db = await connectToDb();
  const TeacherModel = db.model<Teacher>("Teacher", /* Your Teacher schema */); // Define Teacher model
  await TeacherModel.deleteOne({ name: teacherName }); // Use Mongoose deleteOne method
};
