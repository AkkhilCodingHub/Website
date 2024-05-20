import { NextApiRequest, NextApiResponse } from 'next';
import multer, { FileFilterCallback } from 'multer';
import { changedb } from '@/services/mongo';
import { Student } from '@/types/admin';
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

/**
 * Processes the uploaded Excel file to extract student data.
 * @param buffer - The buffer containing the Excel file data.
 * @returns A promise that resolves to an array of Student objects.
 */
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

/**
 * API route handler for uploading student data via an Excel file.
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 */
export default async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('Uploading student data...');
  // Use multer to handle the file upload
  multerUpload(req as any, res as any, async (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(500).json({ error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json({ error: 'Unknown error occurred when uploading.' });
    }

    const reqWithFile = req as NextApiRequestWithFile;
    if (!reqWithFile.file) {
      return res.status(400).send('No file uploaded');
    }

    try {
      const students = await processStudentData(reqWithFile.file.buffer);
      const db = await changedb();
      const collection = db.collection<Student>('students');
      await collection.insertMany(students);
      await db.close();
      res.status(200).json(students);
    } catch (error) {
      console.error('Error processing upload:', error);
      res.status(500).json({ error: 'Failed to process uploaded file.' });
    }
  });
};

