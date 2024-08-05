import mongoose from "mongoose";

export interface Semester {
  value: number;
  label: string;
}

export interface Branch {
  value: string;
  label: string;
}

export interface Subject {
  name: string;
  extTheory: number;
  extPractical?: number;
}

export interface Student {
  name: string;
  rollno: string;
  branch: string;
  semester: number;
  fatherName: string;
  instituteName: string;
  branchName: string;
  subjects: Subject[];
  sessional: number;
  grandTotal: number;
}

// New interface for Excel row data
export interface ExcelRowData {
  name: string;
  rollno: string;
  branch: string;
  semester: string;
  fatherName: string;
  instituteName: string;
  subjects: string;
  sessional: string;
  grandTotal: string;
}

const branchSchema = new mongoose.Schema({
  value: { type: String, required: true, unique: true },
  label: { type: String, required: true },
});

const semesterSchema = new mongoose.Schema({
  value: { type: Number, required: true, unique: true },
  label: { type: String, required: true },
});

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  extTheory: { type: Number, required: true },
  extPractical: { type: Number },
});

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollno: { type: String, required: true, unique: true },
  branch: { type: String, required: true },
  semester: { type: Number, required: true },
  fatherName: { type: String, required: true },
  instituteName: { type: String, required: true },
  branchName: { type: String, required: true },
  subjects: [subjectSchema],
  sessional: { type: Number, required: true },
  grandTotal: { type: Number, required: true },
});

export const BranchModel = mongoose.models.Branch || mongoose.model('Branch', branchSchema);
export const SemesterModel = mongoose.models.Semester || mongoose.model('Semester', semesterSchema);
export const StudentModel = mongoose.models.Student || mongoose.model('Student', studentSchema);

export async function fetchBranchesAndSemesters(): Promise<{ branches: Branch[], semesters: Semester[] }> {
  const { getDb } = await import('@/utils/services/mongo');
  await getDb();

  const branchDocs = await BranchModel.find().sort({ label: 1 }).lean().exec();
  const semesterDocs = await SemesterModel.find().sort({ value: 1 }).lean().exec();

  const branches: Branch[] = branchDocs.map(doc => ({
    value: doc.value,
    label: doc.label
  }));

  const semesters: Semester[] = semesterDocs.map(doc => ({
    value: doc.value,
    label: doc.label
  }));

  return { branches, semesters };
}