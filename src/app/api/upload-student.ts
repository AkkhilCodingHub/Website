import { Readable } from 'stream';
import { NextApiRequest, NextApiResponse } from 'next';
import { changedb } from '@/services/mongo';
import { Student } from '@/types/admin';
import * as ExcelJS from 'exceljs'; // Import exceljs library


export default async function handler(req: NextApiRequest, res: NextApiResponse<Student[] | string | { error: string }>) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  if (!req.body) {
    return res.status(400).send('Missing file data');
  }

  try {
    // Check if request body is a Blob (representing uploaded file)
    if (!(req.body instanceof Blob)) {
      return res.status(400).send('Invalid file format');
    }

    const file = new File([req.body], 'students.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); // Assuming Excel file
      
    
    const reader = new FileReader();
    reader.readAsArrayBuffer(file); // Read file content as an ArrayBuffer

    reader.onload = async (event: ProgressEvent<FileReader>) => {
      if (!event.target || !event.target.result) {
        return res.status(400).send('Invalid Excel file format');
      }
      
      const buffer = event.target.result as ArrayBuffer;

      // Process the ArrayBuffer to extract student data directly (no stream conversion)
      const students = await processStudentData(buffer);

      // Connect to MongoDB and insert student data (similar to previous code)
      const db = await changedb();
      const collection = db.collection<Student>('students');
      await collection.insertMany(students);

      await db.close();

      res.status(200).json(students); // Send uploaded students data
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      res.status(500).json({ error: 'Failed to read uploaded file.' }); // User-friendly error
    };
  } catch (error) {
    console.error('Error uploading students:');
    res.status(500).json({ error: 'An error occurred during upload.'}); // User-friendly error
  }
}

async function processStudentData(buffer: ArrayBuffer): Promise<Student[]> {
  const workbook = new ExcelJS.Workbook();
  const stream = new Readable(); // Create a ReadableStream
  stream.push(buffer); // Push the buffer data into the stream
  stream.push(null); // Signal the end of the stream
  await workbook.xlsx.read(stream);

  const worksheet = workbook.getWorksheet(1); // Assuming student data is in the first worksheet (index 1)
  const students: Student[] = [];

  if (!worksheet) {
    throw new Error('No worksheet found in the Excel file');
  }

  // Skip header row (assuming row 1)
  for (let row = 2; row <= worksheet.actualRowCount; row++) {
    const student: Student = {
      name: worksheet.getCell(row, 1).value as string || '', // Assuming name in column A
      rollno: Number(worksheet.getCell(row, 2).value) || 0, // Assuming rollno in column B
      branch: worksheet.getCell(row, 3).value as string || '', // Assuming branch in column C
      semester: Number(worksheet.getCell(row, 4).value) || 0, // Assuming semester in column D.
      subject: worksheet.getCell(row, 5).value as string || '', // Assuming subject in column D
      marks: Number(worksheet.getCell(row, 6).value) || 0, // Assuming marks in column E
    };
    students.push(student);
  }

  return students;
}