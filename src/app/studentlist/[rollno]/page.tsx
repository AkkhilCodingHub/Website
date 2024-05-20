"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Select from "react-select"; // Multi-column selection
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
} from "@react-pdf/renderer";
import Link from "next/link"; // For navigating to profile page
import axios from "axios";
import { Student } from "@/types/admin";
// Assuming you have a component for displaying student profiles
import Profile from "@/app/profile/page"; // Replace with your actual profile component path

const StudentsList: React.FC = () => {
  const router = useRouter();
  const { branch, semester } = useParams(); // Access query parameters

  const [students, setStudents] = useState<Student[]>([]); // Use sample or mock data
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]); // Array of selected student roll numbers
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    null
  );
  const [showPrintComponent, setShowPrintComponent] = useState(false);
  const [selectedStudentNames, setSelectedStudentNames] = useState<string[]>(
    []
  );

  // Replace this with your actual student data fetching logic (not HSBTΕ API)
  useEffect(() => {
    const fetchData = async () => {
      const url = `/api/students?branch=${branch}&semester=${semester}`;
      console.log("API URL:", url);

      const response = await axios.get(
        `/api/students?branch=${branch}&semester=${semester}`
      ); // Assuming API endpoint
      setStudents(response.data);
    };

    fetchData();
  }, [branch, semester]); // Re-run effect when branch or semester changes

  const handleStudentSelect = (Student: Student) => {
    const studentRollNo = Student.rollno; // Assuming 'rollno' is the property for student ID

    if (selectedStudents.includes(studentRollNo.toString())) {
      // Deselect student if already selected
      setSelectedStudents(
        selectedStudents.filter((rollNo) => rollNo !== studentRollNo.toString())
      );
    } else {
      // Select student if not already selected
      setSelectedStudents([...selectedStudents, studentRollNo.toString()]);
    }
  };

  const handleStudentClick = (rollno: Number) => {
    // Navigate to student profile page with student ID as a parameter
    router.push(`/profile/${rollno}`); // Use router.push for navigation
  };

  const handlePrint = async () => {
    const names = students
      .filter((student) => selectedStudents.includes(student.rollno.toString()))
      .map((student) => student.name);
    setSelectedStudentNames(names);
    setShowPrintComponent(true);
  };

  const PrintContent: React.FC = () => {
    if (!selectedStudentNames.length) return null; // Correctly returns null when there are no names

    return (
      <PDFDownloadLink
        document={
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
        }
        fileName="selected_students.pdf"
      >
        {({ blob, url }) => (
          <button
            onClick={() => blob && window.open(url?.toString(), "_blank")}
          >
            Print Selected Students
          </button>
        )}
      </PDFDownloadLink>
    );
  };

  // Admin functionalities
  const [isAdmin, setIsAdmin] = useState(false); // Replace with logic to check for admin user

  const handleViewProfile = (studentId: string) => {
    setSelectedStudentId(studentId);
  };

  const [filterOptions, setFilterOptions] = useState<{ [key: string]: string }>(
    {}
  );
  const handleFilterChange = (selectedOption: any) => {
    setFilterOptions({
      ...filterOptions,
      [selectedOption.value]: selectedOption.label,
    }); // Update filter state

    // Placeholder for edit functionality (implementation details depend on your requirements)
    const handleEditStudent = (student: Student) => {
      console.log("Edit student:", student);
      // Replace with actual logic for editing student data (e.g., navigate to edit form)
    };
    return (
      <div>
        <h1>Students List</h1>
        <Select
          options={Object.keys(filterOptions).map((key) => ({
            value: key,
            label: filterOptions[key],
          }))}
          isMulti // Allow multiple selections
          value={Object.keys(filterOptions).map((key) => ({
            value: key,
            label: filterOptions[key],
          }))} // Pre-select based on filter state
          onChange={handleFilterChange}
        />
        <ul>
          {students.map((student) => (
            <li key={student.rollno}>
              <button onClick={() => handleStudentSelect(student)}>
                {selectedStudents.includes(student.rollno.toString())
                  ? "Deselect"
                  : "Select"}
              </button>
              {/* Make the student name clickable and call handleStudentClick when clicked */}
              <a
                onClick={() => handleStudentClick(student.rollno)}
                style={{ cursor: "pointer", color: "blue" }}
              >
                {student.name}
              </a>
              <Link href={`/profile/${student.rollno}`}>
                <a>Profile</a>
              </Link>
              {isAdmin && (
                <>
                  <button
                    onClick={() => handleViewProfile(student.rollno.toString())}
                  >
                    View Profile
                  </button>
                  <button onClick={() => handleEditStudent(student)}>
                    Edit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>

        <button onClick={handlePrint}>Print Selected Students</button>
        {showPrintComponent && <PrintContent />}
        {selectedProfileId && (
          <Profile
            rollno={selectedProfileId}
            name={""}
            branch={""}
            semester={0}
            marks={0}
            subject={""}
          />
        )}

        {/* Admin functionalities (conditionally render) */}
        {isAdmin && (
          <div>
            <h2>Admin Panel</h2>
            {/* Edit functionality (placeholder, replace with actual implementation) */}
            <button disabled={!selectedStudentId}>Edit Selected Student</button>

            {/* Add other admin functionalities here (e.g., add new student, delete student) */}
            <button>Add New Student</button>
            <button disabled={!selectedStudents.length}>
              Delete Selected Students
            </button>
          </div>
        )}
      </div>
    );
  };
};

export default StudentsList;