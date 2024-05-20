"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Select from 'react-select'; // Multi-column selection component
import { PDFDownloadLink, Document, Page, Text, View } from '@react-pdf/renderer'; // PDF generation components
import Link from 'next/link'; // Component for client-side navigation
import axios from 'axios'; // HTTP client for making requests
import { Student } from '@/types/admin' // Type definition for Student
import Profile from '../profile/page'; // Profile component for student details

// Main component for displaying the list of students
const StudentsList: React.FC = () => {
  const router = useRouter(); // Hook for router instance
  const { branch, semester } = useParams(); // Access query parameters for branch and semester

  // State for storing list of students
  const [students, setStudents] = useState<Student[]>([]);
  // State for storing the ID of the currently selected student
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  // State for storing the roll numbers of selected students
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  // State for storing the ID of the profile being viewed
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  // State to toggle visibility of the print component
  const [showPrintComponent, setShowPrintComponent] = useState(false);
  // State for storing names of students selected for printing
  const [selectedStudentNames, setSelectedStudentNames] = useState<string[]>([]);

  // Effect for fetching student data based on branch and semester
  useEffect(() => {
    const fetchData = async () => {
      const url = `/api/students?branch=${branch}&semester=${semester}`;
      console.log('API URL:', url); // Log the constructed URL for debugging

      const response = await axios.get(url); // Fetch data from API
      setStudents(response.data); // Update state with fetched data
    };

    fetchData();
  }, [branch, semester]); // Dependency array to re-run effect on change

  // Handler for selecting/deselecting a student
  const handleStudentSelect = (student: Student) => {
    const studentRollNo = student.rollno;

    if (selectedStudents.includes(studentRollNo.toString())) {
      // Remove student from selection if already selected
      setSelectedStudents(selectedStudents.filter((rollNo) => rollNo !== studentRollNo.toString()));
    } else {
      // Add student to selection if not already selected
      setSelectedStudents([...selectedStudents, studentRollNo.toString()]);
    }
  };

  // Handler for clicking on a student name
  const handleStudentClick = (rollno: number) => {
    router.push(`/profile/${rollno}`); // Navigate to the profile page of the student
  };

  // Handler for initiating the print process
  const handlePrint = async () => {
    const names = students.filter(student =>
      selectedStudents.includes(student.rollno.toString())
    ).map(student => student.name);
    setSelectedStudentNames(names); // Set names of students to be printed
    setShowPrintComponent(true); // Show the print component
  };

  // Component for rendering the print content
  const PrintContent: React.FC = () => {
    if (!selectedStudentNames.length) return null; // Return null if no names to print

    return (
      <PDFDownloadLink document={
        <Document>
          <Page>
            <Text>Selected Students:</Text>
            <ol style={{ marginLeft: 20 }}>
              {selectedStudentNames.map(name => (
                <li key={name}>{name}</li> // List each selected student's name
              ))}
            </ol>
          </Page>
        </Document>
      } fileName="selected_students.pdf">
        {({ blob, url }) => (
          <button onClick={() => blob && window.open(url?.toString(), '_blank')}>
            Print Selected Students
          </button>
        )}
      </PDFDownloadLink>
    );
  };

  // State and handlers for admin functionalities
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is admin

  const handleViewProfile = (studentId: string) => {
    setSelectedStudentId(studentId); // Set the ID of the student whose profile is to be viewed
  };

  // State and handler for filter options in the select component
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: string }>({});
  const handleFilterChange = (selectedOption: any) => {
    setFilterOptions({ ...filterOptions, [selectedOption.value]: selectedOption.label }); // Update filter state
  };

  // Handler for editing student information
  const handleEditStudent = (student: Student) => {
    console.log('Edit student:', student);
    // Placeholder for actual edit logic
  };

  return (
    <div>
      <h1>Students List</h1>
      <Select
        options={Object.keys(filterOptions).map((key) => ({ value: key, label: filterOptions[key] }))}
        isMulti // Allow multiple selections
        value={Object.keys(filterOptions).map((key) => ({ value: key, label: filterOptions[key] }))} // Pre-select based on filter state
        onChange={handleFilterChange}
      />
      <ul>
        {students.map((student) => (
          <li key={student.rollno}>
            <button onClick={() => handleStudentSelect(student)}>
              {selectedStudents.includes(student.rollno.toString()) ? 'Deselect' : 'Select'}
            </button>
            <a onClick={() => handleStudentClick(student.rollno)} style={{ cursor: 'pointer', color: 'blue' }}>
              {student.name}
            </a>
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
      {showPrintComponent && <PrintContent />}
      {selectedProfileId && <Profile rollno={selectedProfileId} name={''} branch={''} semester={0} marks={0} subject={''} />}

      {isAdmin && (
        <div>
          <h2>Admin Panel</h2>
          <button disabled={!selectedStudentId}>Edit Selected Student</button>
          <button>Add New Student</button>
          <button disabled={!selectedStudents.length}>Delete Selected Students</button>
        </div>
      )}
    </div>
  );
};

export default StudentsList;