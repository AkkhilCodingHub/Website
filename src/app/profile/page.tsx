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
    <div className="profile-container">
      <h1>{studentData.name}</h1>
      <p>Roll Number: {studentData.rollNumber}</p>
      <p>Semester: {studentData.semester}</p>
      <p>Branch: {studentData.branch}</p>
      <h2>Marks</h2>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(studentData.marks).map(([subject, marks]) => (
            <tr key={subject}>
              <td>{subject}</td>
              <td>{marks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Profile;