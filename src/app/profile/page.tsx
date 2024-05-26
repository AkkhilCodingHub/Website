"use client";
import React from 'react';
import { Student } from '@/types/admin'; // Import Student type

// Define the Profile component with Student type props
const Profile: React.FC<{ student: Student }> = ({ student }) => {
  // Check if student data is available
  if (!student) {
    return <p>Loading profile...</p>;
  }

  // Render the student profile information
  return (
    <div className="profile-container px-4 py-8 bg-white rounded-md shadow-md">
      <h1>{student.name}</h1>
      <p className="text-gray-500 mb-2">
        Roll Number: {student.rollno}
      </p>
      <p className="text-gray-500 mb-2">Semester: {student.semester}</p>
      <p className="text-gray-500 mb-2">Branch: {student.branch}</p>
      <h2>Marks</h2>
      <table className="w-full table-auto rounded-md border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-700 bg-gray-100">Subject</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700 bg-gray-100">Marks</th>
          </tr>
        </thead>
        <tbody>
          {/* Assuming marks is a simple number for simplicity */}
          <tr className="border-b border-gray-200 hover:bg-gray-100">
            <td className="px-4 py-2 text-left text-gray-700">{student.subject}</td>
            <td className="px-4 py-2 text-left text-gray-700">{student.marks}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
