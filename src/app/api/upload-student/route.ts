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
      cb(null, false);
    }
  }
});

// Extend NextApiRequest to include the file
interface NextApiRequestWithFile extends NextApiRequest {
  file: Express.Multer.File;
}

// Middleware to handle file upload with multer
const multerUpload = upload.single('file');

const convertToCSV = (students: Student[]): string => {
  const fields = ['name', 'rollno', 'branch', 'semester', 'subject', 'marks'];
  return parse(students, { fields });
};

const processStudentData = async (buffer: Buffer): Promise<Student[]> => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet(1);
  const students: Student[] = [];

  if (!worksheet) {
    throw new Error('No worksheet found in the Excel file');
  }

  worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (rowNumber > 1) {
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

export const options = (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(204).end();
};

export const post = async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('Uploading student data...');
  multerUpload(req as any, res as any, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ error: err.message });
    } else if (err) {
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
        await collection.insertMany(students);
      } else if (students && students.length === 1) {
        await collection.insertOne(students[0]);
      } else {
        throw new Error('No student data to upload');
      }

      await db.close();
      res.status(200).json({ data: csvData });
    } catch ( error) {
      console.error('Error processing upload:', error);
      res.status(500).json({ error: 'Failed to process uploaded file.' });
    }
  });
};

