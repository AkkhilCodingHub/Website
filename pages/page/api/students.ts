import { changedb } from '@/pages/services/mongo';
import { Student } from '@/types/admin';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Student[]>) {
  const { branch, semester } = req.query;

  try {
    // Replace with your actual MongoDB connection details (environment variables recommended)
    const db = changedb();
    const collection = (await db).collection<Student>('students') ; // Typed collection

    // Replace with your actual filtering logic for branch and semester
    const students = await collection.find({ branch, semester }).toArray();

    res.status(200).json(students); // Send fetched student data as typed JSON response
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send(newFunction()); // Handle errors
  } 
}
function newFunction(): Student[] {
  return 'Error retrieving students';
}

