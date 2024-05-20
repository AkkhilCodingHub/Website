import { changedb } from "../services/mongo"; // Assuming mongo.js handles database connection using connectDb
import { Admin, Teacher, teacherSchema } from "./admin"; // Import admin and teacher interfaces
import { Collection } from "mongoose";

// Function to fetch all admins from database
export const login = async (name: string, pin: string): Promise<{ success: boolean; message?: string; admin?: Admin }> => {
  const db = await changedb(); // Use the correct function `connectDb`
  const adminCollection = db.collection("admins") as Collection<Admin>; // Use generic type for collection
  const admin = await adminCollection.findOne({ name, pin });

  // Check if admin exists and return appropriate response
  if (!admin) {
    return { success: false, message: "Invalid username or PIN" };
  }

  // Login successful, return admin data
  return { success: true, admin };
};

    // Function to fetch all teachers from database
    const getTeachers = async (): Promise<Teacher[]> => {
      const db = await changedb();
      const TeacherModel = db.model("Teacher", teacherSchema); // Define Teacher model
      const teachers = await TeacherModel.find().exec(); // Use await to wait for the find operation
      return teachers;
    };


    // Function to add a new teacher to database
    const addTeacher = async (teacher: Teacher): Promise<void> => {
      const db = await changedb();
      const TeacherModel = db.model("Teacher", teacherSchema); // Define Teacher model
      await TeacherModel.create(teacher); // Use Mongoose create method
    };

    // Function to remove a teacher from database
    const removeTeacher = async (teacherName: string): Promise<void> => {
      const db = await changedb();
      const TeacherModel = db.model("Teacher", teacherSchema); // Define Teacher model
      await TeacherModel.deleteOne({ name: teacherName }); // Use Mongoose deleteOne method
    };



export { getTeachers, addTeacher, removeTeacher};