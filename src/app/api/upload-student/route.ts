import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { connectToDb } from '../../../services/mongo';
import { Student } from '../../../types/admin';
import ExcelJS from 'exceljs';

// Set up multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Extend NextApiRequest to include the file
interface NextApiRequestWithFile extends NextApiRequest {
  file: Express.Multer.File;
}

// Middleware to handle file upload with multer
const multerUpload = upload.single('file');

// Function to process student data
const processStudentData = async (buffer: Buffer): Promise<Student[]> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet(1);
  const students: Student[] = [];

  if (!worksheet) {
    throw new Error('No worksheet found in the Excel file');
  }

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber > 1) { // Skip header row
      const student: Student = {
        name: row.getCell(1).text,
        rollno: +row.getCell(2).text,
        branch: row.getCell(3).text,
        semester: +row.getCell(4).text,
        subject: row.getCell(5).text,
        marks: +row.getCell(6).text,
      };
      students.push(student);
    }
  });

  return students;
};

// POST handler
export const POST = async (req: NextApiRequestWithFile, res: NextApiResponse) => {
  console.log('Uploading student data...');
  multerUpload(req as any, res as any, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      res.status(500).json({ error: err.message });
      return;
    } else if (err) {
      console.error('Unknown upload error:', err);
      res.status(500).json({ error: 'Unknown error occurred when uploading.' });
      return;
    }

    const reqWithFile = req as NextApiRequestWithFile;
    if (!reqWithFile.file) {
      res.status(400).send('No file uploaded');
      return;
    }

    try {
      const students = await processStudentData(reqWithFile.file.buffer);
      const db = await connectToDb();
      const collection = db.collection<Student>('students');
      await collection.insertMany(students);
      await db.close();
      res.status(200).json(students);
    } catch (error) {
      console.error('Error processing upload or database operation:', error);
      res.status(500).json({ error: 'Failed to process uploaded file or database error.' });
    }
  });
};
