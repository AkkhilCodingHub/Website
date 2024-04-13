import { changedb } from "../services/mongo"; // Assuming mongo.js handles database connection using connectDb
import { Admin, Teacher } from "./admin"; // Import admin and teacher interfaces
import mongoose from 'mongoose'; // Import Mongoose directly (assuming separate import)

// Function to fetch all admins from database
export const login = async (name: string, pin: string): Promise<{ success: boolean; message?: string; admin?: Admin }> => {
  const connection = await changedb(); // Use the correct function `connectDb`
  const db = connection.db("Cluster0"); // Access database instance using connection

  const adminCollection = db.collection<Admin>("admins"); // Use generic type for collection
  const admin = await adminCollection.findOne({ name, pin });

  // Check if admin exists and return appropriate response
  if (!admin) {
    return { success: false, message: "Invalid username or PIN" };
  }

  // Login successful, return admin data
  return { success: true, admin };
};

const main = async () => {
  try {
    const connection = await changedb();
    
    // Mongoose schema for Teacher documents
    const teacherSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true,
        unique: true, // Ensure unique teacher names
      },
      pin: {
        type: String,
        required: true,
      },
      // Add additional fields as needed (e.g., email, subjects taught, etc.)
    });

    // Function to fetch all teachers from database
    export const getTeachers = async (): Promise<Teacher[]> => {
      const connection = await changedb();
      const db = connection.db("Cluster0");
      const TeacherModel = db.model<Teacher>("Teacher", teacherSchema); // Define Teacher model
      const teachers = await TeacherModel.find();
      return teachers;
    };

    // Function to add a new teacher to database
    export const addTeacher = async (teacher: Teacher): Promise<void> => {
      const connection = await changedb();
      const db = connection.db("Cluster0");
      const TeacherModel = db.model<Teacher>("Teacher", teacherSchema); // Define Teacher model
      await TeacherModel.create(teacher); // Use Mongoose create method
    };

    // Function to remove a teacher from database
    export const removeTeacher = async (teacherName: string): Promise<void> => {
      const connection = await changedb();
      const db = connection.db("Cluster0");
      const TeacherModel = db.model<Teacher>("Teacher", teacherSchema); // Define Teacher model
      await TeacherModel.deleteOne({ name: teacherName }); // Use Mongoose deleteOne method
    };
  } catch (error) {
    console.error('Error connecting to MongoDB or performing operations:', error);
  }
};

main(); // Run the main function

export default mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema); // Use mongoose models directly
