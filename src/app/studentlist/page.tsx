"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Select from 'react-select'; // Multi-column selection
import { PDFDownloadLink, Document, Page, Text, View } from '@react-pdf/renderer';
import  Link  from 'next/link'; // For navigating to profile page
import axios from 'axios';
import {Student} from '@/types/admin'
// Assuming you have a component for displaying student profiles
import Profile from '../profile/page'; // Replace with your actual profile component path

const StudentsList: React.FC = () => {
  const router = useRouter();
  const { branch, semester } = router.query; // Access query parameters

  const [students, setStudents] = useState<Student[]>([]); // Use sample or mock data
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]); // Array of selected student roll numbers
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);

  // Replace this with your actual student data fetching logic (not HSBTΕ API)
  useEffect(() => {
  const fetchData = async () => {
    const response = await axios.get(`/api/students?branch=${branch}&semester=${semester}`); // Assuming API endpoint
    setStudents(response.data);
  };

  fetchData();
}, [branch, semester]); // Re-run effect when branch or semester changes

const handleStudentSelect = (Student : Student) => {
  const studentRollNo = Student.rollno; // Assuming 'rollno' is the property for student ID

  if (selectedStudents.includes(studentRollNo.toString())) {
    // Deselect student if already selected
    setSelectedStudents(selectedStudents.filter((rollNo) => rollNo !== studentRollNo.toString()));
  } else {
    // Select student if not already selected
    setSelectedStudents([...selectedStudents, studentRollNo.toString()]);
  }
};

  
  const handleStudentClick = (studentId: string) => {
    // Navigate to student profile page with student ID as a parameter
    router.push(`/studentlist/${studentId}`); // Use router.push for navigation
  };

  const handlePrint = () => {
    // Implement logic to print selected student profiles based on selectedStudents array
    const selectedStudentNames = students.filter((student) =>
      selectedStudents.includes(student.rollno.toString()) // Filter based on rollno in selectedStudents
    ).map((student) => student.name); // Extract names of filtered students
  
    const doc = (
      <Document>
        <Page>
          <Text>Selected Students:</Text>
          <ol style={{ marginLeft: 20 }}>
            {selectedStudentNames.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ol>
        </Page>
      </Document>
    );
  
    <PDFDownloadLink document={doc} fileName="selected_students.pdf">
      {({ blob, url }) => (
        <button onClick={() => blob && window.open(url?.toString(), '_blank')}>
          Print Selected Students
        </button>
      )}
    </PDFDownloadLink>;
  };
   // Admin functionalities
   const [isAdmin, setIsAdmin] = useState(false); // Replace with logic to check for admin user
   const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
 
   const handleViewProfile = (studentId: string) => {
     setSelectedStudentId(studentId);
   };
 
   // Placeholder for edit functionality (implementation details depend on your requirements)
   const handleEditStudent = (student: Student) => {
     console.log('Edit student:', student);
     // Replace with actual logic for editing student data (e.g., navigate to edit form)
   };
 
  return (
    <div>
      <h1>Students List</h1>

      {/* Optional: Use Select component for filtering (future enhancement) */}
      {/* <Select // ... options for filtering */}
      {/*   onChange={(selectedOption) => { ... }} // Handle filter selection */}
      {/*   isMulti */}
      {/* /> */}

      <ul>
        {students.map((student) => (
          <li key={student.rollno}>
            {student.name} 
            <button onClick={() => handleStudentSelect(student)}>
              {selectedStudents.includes(student.rollno.toString()) ? 'Deselect' : 'Select'}
            </button>
            <Link href={`/profile/${student.rollno}`}>
              <a>Profile</a>
            </Link>
            {isAdmin && (
              <>
                <button onClick={() => handleViewProfile(student.rollno.toString())}>View Profile</button>
                <button onClick={() => handleEditStudent(student)}>Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>
      <button onClick={handlePrint}>Print Selected Students</button>
      {selectedProfileId && <Profile rollno={selectedProfileId} name={''} branch={''} semester={0} marks={''} />}

      {/* Admin functionalities (conditionally render) */}
      {isAdmin && (
        <div>
        <h2>Admin Panel</h2>
        {/* Edit functionality (placeholder, replace with actual implementation) */}
        <button disabled={!selectedStudentId}>Edit Selected Student</button>

        {/* Add other admin functionalities here (e.g., add new student, delete student) */}
        <button>Add New Student</button>
        <button disabled={!selectedStudents.length}>Delete Selected Students</button>
      </div>
    )}
  </div>
);
};

export default StudentsList;