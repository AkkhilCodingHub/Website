"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Student } from "@/types/admin"; // Import the Student type

// Mock data for demonstration
const mockStudents: Student[] = [
  { name: "Arju", rollno: 1, branch: "Computer", semester: 3, subject: "Mathematics", marks: 85 },
  { name: "Nikil", rollno: 2, branch: "Electronics", semester: 2, subject: "Physics", marks: 78 },
  { name: "Manav", rollno: 3, branch: "Mechanical", semester: 4, subject: "Chemistry", marks: 88 },
  { name: "karan", rollno: 4, branch: "Civil", semester: 1, subject: "English", marks: 92 },
  { name: "angel", rollno: 5, branch: "Architecture", semester: 5, subject: "Biology", marks: 74 },
];

// Function to simulate fetching data based on roll number
const fetchStudentData = async (rollno: number): Promise<Student | undefined> => {
  // Simulate an API call
  return mockStudents.find(student => student.rollno === rollno);
};

const Profile: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const params = useParams<{ rollno: string }>(); // Specify the expected type of the parameters
  const rollno = params.rollno; // Directly access the rollno parameter

  useEffect(() => {
    if (rollno) {
      const rollNumber = parseInt(rollno, 10);
      fetchStudentData(rollNumber).then(data => {
        setStudent(data ?? null); // Handle undefined case
        setLoading(false);
      }).catch(() => {
        setLoading(false); // Handle errors appropriately in a real scenario
      });
    }
  }, [rollno]);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!student) {
    return <p>Student data not available.</p>;
  }

  return (
    <div className="profile-container px-4 py-8 w-full h-full fixed top-0 left-0 bg-cover bg-[url('/image.jpeg')] rounded-md shadow-md">
      <h1>{student.name}</h1>
      <p className="text-white mb-2">Roll Number: {student.rollno}</p>
      <p className="text-white mb-2">Semester: {student.semester}</p>
      <p className="text-white mb-2">Branch: {student.branch}</p>
      <h2>Marks</h2>
      <table className="w-full table-auto rounded-md border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-700 bg-gray-100">
              Subject
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700 border-r border-gray-500 bg-gray-100">
              Marks
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200 hover:bg-gray-100">
            <td className="px-4 py-2 text-left text-gray-700 bg-sky-600 w-1/2 ">
              {student.subject}
            </td>
            <td className="px-4 py-2 text-left text-gray-700 bg-sky-600 w-1/2">
              {student.marks}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Profile;

