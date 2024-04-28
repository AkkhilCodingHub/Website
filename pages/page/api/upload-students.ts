import { NextApiRequest, NextApiResponse } from 'next';
import { read as XLSXRead } from 'xlsx'; // Assuming xlsx library uses read instead of parse
import { changedb, connectToDb } from '@/pages/services/mongo';
import { Student } from '@/types/admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Student[] | { error: string }>) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  if (!req.body) {
    return res.status(400).send('Missing file data');
  }

  try {
    const workbook = XLSXRead(req.body, { type: 'binary' }); // Assuming binary data
    const sheetName = workbook.SheetNames[0]; // Assuming first sheet contains data

    if (!sheetName) {
      return res.status(400).send('Invalid Excel file format');
    }

    const worksheet = workbook.Sheets[sheetName];
    const students: Student[] = [];

    // Extract student data from the worksheet (replace with your logic)
    for (const rowKey in worksheet) {
      if (rowKey.startsWith('A')) continue; // Skip header row (assuming row A)
      const row = worksheet[rowKey];
      if (!row) continue; // Skip empty rows

      // Replace with your logic to extract student data from each row
      const student: Student = {
        name: row['A'],
        rollno: row['B'],
        branch: row['C'],
        semester: row['D'],
      };
      students.push(student);
    }

    // Connect to MongoDB and insert student data
    const db = await changedb();
    const collection = db.collection<Student>('students'); // Typed collection
    await collection.insertMany(students);

    await db.close();

    res.status(200).json(students); // Send uploaded students data
  } catch (error) {
    console.error('Error uploading students:', error);
    res.status(500).json({ error: error.message || 'An error occurred during upload.' }); // User-friendly error
  }
}
