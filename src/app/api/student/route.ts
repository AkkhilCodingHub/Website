import { Student } from '../../../types/admin';
import { NextApiRequest, NextApiResponse } from 'next';
import { computer, Electronics, Mechanical, Civil, Architecture } from '../../../types/admin';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Student[]>) {
  const { branch, semester } = req.query;

  try {
    let students: Student[] = [];

    switch (branch) {
      case 'Computer':
        students = computer.filter(student => student.semester === Number(semester));
        break;
      case 'Electronics':
        students = Electronics.filter(student => student.semester === Number(semester));
        break;
      case 'Mechanical':
        students = Mechanical.filter(student => student.semester === Number(semester));
        break;
      case 'Civil':
        students = Civil.filter(student => student.semester === Number(semester));
        break;
      case 'Architecture':
        students = Architecture.filter(student => student.semester === Number(semester));
        break;
      default:
        break;
    }

    res.status(200).json(students); // Send fetched student data as typed JSON response
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json([]); // Handle errors and send an empty array as JSON
  }
}
