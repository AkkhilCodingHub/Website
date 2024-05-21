import { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { changedb } from '@/services/mongo';
import { StudentData as Student } from '@/types/admin';
import ExcelJS from 'exceljs';
import { parse } from 'json2csv';

// Set up multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage, 
  fileFilter: (req, file, cb) => {
    if (file.originalname === 'studentD.xlsx') {
      cb(null, true);
    } else {
      cb(null, false); // Corrected to pass 'null' instead of an Error object
    }
  }
});

// Extend NextApiRequest to include the file
interface NextApiRequestWithFile extends NextApiRequest {
  file: Express.Multer.File;
}

// Middleware to handle file upload with multer
const multerUpload = upload.single('file');

/**
 * Converts Excel data to CSV format.
 * @param students - Array of Student objects.
 * @returns A string in CSV format.
 */
const convertToCSV = (students: Student[]): string => {
  const fields = ['name', 'rollno', 'branch', 'semester', 'subject', 'marks'];
  return parse(students, { fields });
};

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
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(204).end();
    return;
  }

  // Handle POST request
  if (req.method === 'POST') {
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
        const csvData = convertToCSV(students);
        const db = await changedb();
        const collection = db.collection<Student>('students');
        
        if (Array.isArray(students) && students.length > 0) {
          await collection.insertMany(students); // Insert the array of students directly
        } else if (students && students.length === 1) {
          await collection.insertOne(students[0]); // Insert a single student
        } else {
          throw new Error('No student data to upload');
        }

        await db.close();
        res.status(200).json({ data: csvData });
      } catch (error) {
        console.error('Error processing upload:', error);
        res.status(500).json({ error: 'Failed to process uploaded file.' });
      }
    });
  } else {
    // Respond with 405 Method Not Allowed if not POST
    res.setHeader('Allow', 'POST, OPTIONS');
    res.status(405).end('Method Not Allowed');
  }
};
