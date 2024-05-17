"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Select from 'react-select'; // Multi-column selection
import { PDFDownloadLink, Document, Page, Text, View } from '@react-pdf/renderer';
import  Link  from 'next/link'; // For navigating to profile page
import axios from 'axios';
import {Student} from '@/types/admin'
// Assuming you have a component for displaying student profiles
import Profile from '../../profile/page'; // Replace with your actual profile component path

const StudentsList: React.FC = () => {
  const router = useRouter();
  const { branch, semester } = useParams.arguments; // Access query parameters

  const [students, setStudents] = useState<Student[]>([]); // Use sample or mock data
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
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


  const handleStudentSelect = (student: Student) => {
    const studentRollNo = student.rollno; // Assuming 'rollno' is the property for student ID
  
    // **Change:** Create a copy of the selectedStudents array to avoid mutation
    const newSelectedStudents = [...selectedStudents]; 
  
    if (newSelectedStudents.includes(studentRollNo.toString())) {
      // Deselect student if already selected
      const index = newSelectedStudents.indexOf(studentRollNo.toString());
      newSelectedStudents.splice(index, 1);
    } else {
      // Select student if not already selected
      newSelectedStudents.push(studentRollNo.toString());
    }
  
    setSelectedStudents(newSelectedStudents);
  };

  const handleStudentClick = (rollno: Number) => {
   // Navigate to student profile page with student ID as a parameter
   router.push(`/studentlist/${rollno}`); // Use router.push for navigation
  };

  const handlePrint = async () => {
    try {
      // Implement logic to print selected student profiles based on selectedStudents array
     const selectedStudentNames = students.filter((student) =>
      selectedStudents.includes(student.rollno.toString())
     ).map((student) => student.name); // Extract names of filtered students
     // Clear selected students after printing
     setSelectedStudents([]);

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
      // **Change:** Wrap the JSX content in a function that returns it
      return (
        <PDFDownloadLink document={doc} fileName="selected_students.pdf">
         {({ blob, url }) => (
           <button onClick={() => blob && window.open(url?.toString(), '_blank')}>
             Print Selected Students
           </button>
          )}
        </PDFDownloadLink>
     );
   } catch (error) {
     console.error('Error generating PDF:', error);
     // Optionally display an error message to the user
     return null;
    }
  };

  // Admin functionalities
  const [isAdmin, setIsAdmin] = useState(false); // Replace with logic to check for admin user
  
  const handleViewProfile = (studentId: string) => {
    setSelectedStudentId(studentId);
  };
  
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: string }>({});
  const handleFilterChange = (selectedOption: any) => {
    setFilterOptions({ ...filterOptions, [selectedOption.value]: selectedOption.label }); // Update filter state
    
    // Placeholder for edit functionality (implementation details depend on your requirements)
    const handleEditStudent = (student: Student) => {
    console.log('Edit student:', student);
    // Replace with actual logic for editing student data (e.g., navigate to edit form)
  };
return (
<div>
  <h1>Students List</h1>

  {/* Select component for filtering */}
  <Select
    options={Object.keys(filterOptions).map((key) => ({ value: key, label: filterOptions[key] }))}
    isMulti // Allow multiple selections
    value={Object.keys(filterOptions).map((key) => ({ value: key, label: filterOptions[key] }))} // Pre-select based on filter state
    onChange={handleFilterChange}
    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" // Basic styling
  />

  <ul className="list-none p-0"> {/* Style the list for better presentation */}
    {students.map((student) => (
      <li key={student.rollno} className="flex items-center justify-between py-2 border-b border-gray-200 hover:bg-gray-100"> {/* Style each list item */}
        <div>
          {student.name}
          <button onClick={() => handleStudentSelect(student)}>
            {selectedStudents.includes(student.rollno.toString()) ? 'Deselect' : 'Select'}
          </button>
          <Link href={`/profile/${student.rollno}`}>
            <a>Profile</a>
          </Link>
        </div>
        {isAdmin && (
          <>
            <button onClick={() => handleViewProfile(student.rollno.toString())}>View Profile</button>
            <button onClick={() => handleEditStudent(student)}>Edit</button>
          </>
        )}
      </li>
    ))}
  </ul>

  <button onClick={handlePrint} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50" disabled={!selectedStudents.length}>
    Print Selected Students
  </button>

  {selectedProfileId && <Profile rollno={selectedProfileId} name={''} branch={''} semester={0} marks={0} subject={''} />}

  {/* Admin functionalities (conditionally render) */}
  {isAdmin && (
    <div>
      <h2>Admin Panel</h2>

      {/* Edit functionality (placeholder, replace with actual implementation) */}
      <button disabled={!selectedStudentId} className="bg-gray-200 text-gray-500 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50">
        Edit Selected Student
      </button>

      {/* Add other admin functionalities here (e.g., add new student, delete student) */}
      <button className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Add New Student</button>
      <button disabled={!selectedStudents.length} className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50">Delete Selected Students</button>
    </div>
  )}
</div>
)
  };
};

export default StudentsList;