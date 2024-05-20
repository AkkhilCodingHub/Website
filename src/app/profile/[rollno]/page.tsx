"use client";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for making HTTP requests
import { Student, StudentProfile } from "@/types/admin"; // Import Student and StudentProfile types

// Define the Profile component with Student type props
const Profile: React.FC<Student> = ({ rollno }) => {
  const [studentData, setStudentData] = useState<StudentProfile | null>(null); // Use StudentProfile type for state

  // Fetch student profile data using axios and useEffect hook
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await axios.get(`/api/students/${rollno}`);
        setStudentData(response.data); // Set student data from response
      } catch (error) {
        console.error("Failed to fetch student data:", error); // Log error if request fails
      }
    };
    fetchStudentProfile();
  }, [rollno]); // Dependency array to re-run effect when rollno changes

  // Render loading state if student data is not yet loaded
  if (!studentData) {
    return <p>Loading profile...</p>;
  }

  // Render the student profile information
  return (
    <div className="profile-container px-4 py-8 bg-white rounded-md shadow-md">
      <h1>{studentData.name}</h1>
      <p className="text-gray-500 mb-2">
        Roll Number: {studentData.rollNumber}
      </p>
      <p className="text-gray-500 mb-2">Semester: {studentData.semester}</p>
      <p className="text-gray-500 mb-2">Branch: {studentData.branch}</p>
      <h2>Marks</h2>
      <table className="w-full table-auto rounded-md border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-700 bg-gray-100">
              Subject
            </th>
            <th className="px-4 py-2 text-left font-medium text-gray-700 bg-gray-100">
              Marks
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(studentData.marks).map(([subject, marks]) => (
            <tr
              key={subject}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="px-4 py-2 text-left text-gray-700">{subject}</td>
              <td className="px-4 py-2 text-left text-gray-700">
                {typeof marks === "number" ? marks : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
