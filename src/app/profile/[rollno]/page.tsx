"use client";
import React, { useState, useEffect } from 'react';
import { Student } from '@/types/admin';

const Profile: React.FC<Student> = ({ rollno }) => {
  const [studentData, setStudentData] = useState<any>(null); // Replace with actual profile data type

  // Replace with your logic to fetch student profile data based on studentId
  useEffect(() => {
  const fetchStudentProfile = async () => {
      const response = await fetch(`/api/students/${rollno}`);
      const data = await response.json();
      setStudentData(data);
    };
    fetchStudentProfile();
    })
  if (!studentData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container px-4 py-8 bg-white rounded-md shadow-md"> {/* Container with styles */}
  <h1>{studentData.name}</h1>
  <p className="text-gray-500 mb-2">
    Roll Number: {studentData.rollNumber}
  </p>
  <p className="text-gray-500 mb-2">Semester: {studentData.semester}</p>
  <p className="text-gray-500 mb-2">Branch: {studentData.branch}</p>
  <h2>Marks</h2>
  <table className="w-full table-auto rounded-md border border-gray-200"> {/* Styled table */}
    <thead>
      <tr>
        <th className="px-4 py-2 text-left font-medium text-gray-700 bg-gray-100">Subject</th>
        <th className="px-4 py-2 text-left font-medium text-gray-700 bg-gray-100">Marks</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(studentData.marks).map(([subject, marks]) => (
        <tr key={subject} className="border-b border-gray-200 hover:bg-gray-100"> {/* Row styling */}
          <td className="px-4 py-2 text-left text-gray-700">{subject}</td>
          <td className="px-4 py-2 text-left text-gray-700">{(marks as Number).toString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
  )
};

export default Profile;