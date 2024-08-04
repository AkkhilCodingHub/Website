import mongoose from "mongoose";

export interface Semester {
  value: number;
  label: string;
}

export interface Branch {
  value: string;
  label: string;
}

export interface Student {
  name: string;
  rollno: string;
  branch: string;
  semester: number;
  fatherName: string;
  instituteName: string;
  branchName: string;
  subjects: {
    name: string;
    extTheory: number;
    extPractical?: number;
  }[];
  sessional: number;
  grandTotal: number;
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

// Mongoose schema for Branch documents
const branchSchema = new mongoose.Schema({
  value: { type: String, required: true, unique: true },
  label: { type: String, required: true },
});

// Mongoose schema for Semester documents
const semesterSchema = new mongoose.Schema({
  value: { type: Number, required: true, unique: true },
  label: { type: String, required: true },
});

// Mongoose schema for Student documents
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollno: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  semester: { type: Number, required: true },
  fatherName: { type: String, required: true },
  instituteName: { type: String, required: true },
  branchName: { type: String, required: true },
  subjects: [{
    name: { type: String, required: true },
    extTheory: { type: Number, required: true },
    extPractical: { type: Number },
  }],
  sessional: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
});

// Create models
export const BranchModel = mongoose.models.Branch || mongoose.model('Branch', branchSchema);
export const SemesterModel = mongoose.models.Semester || mongoose.model('Semester', semesterSchema);
export const StudentModel = mongoose.models.Student || mongoose.model('Student', studentSchema);

// Function to fetch branches and semesters from the database
export async function fetchBranchesAndSemesters(): Promise<{ branches: Branch[], semesters: Semester[] }> {
  const { getDb } = await import('@/utils/services/mongo');
  await getDb();

  const branches = await BranchModel.find().sort({ label: 1 }).lean();
  const semesters = await SemesterModel.find().sort({ value: 1 }).lean();

  return {
    branches: branches.map(({ value, label }) => ({ value, label })),
    semesters: semesters.map(({ value, label }) => ({ value, label }))
  };
}