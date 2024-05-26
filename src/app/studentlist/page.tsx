"use client";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Select from "react-select"; // Multi-column selection component
import Link from "next/link"; // Component for client-side navigation
import { Student } from "@/types/admin"; // Type definition for Student
import Profile from "@/app/profile/page"; // Profile component for student details
import jsPDF from "jspdf"; // PDF generation library

// Main component for displaying the list of students
const StudentsList: React.FC = () => {
  const router = useRouter(); // Hook for router instance
  // Mock data for students
  const mockStudents: Student[] = [
    {
      name: "Arju",
      rollno: 1,
      branch: "Computer",
      semester: 3,
      subject: "Mathematics",
      marks: 85,
    },
    {
      name: "Nikil",
      rollno: 2,
      branch: "Electronics",
      semester: 2,
      subject: "Physics",
      marks: 78,
    },
    {
      name: "Manav",
      rollno: 3,
      branch: "Mechanical",
      semester: 4,
      subject: "Chemistry",
      marks: 88,
    },
    {
      name: "Karan",
      rollno: 4,
      branch: "Civil",
      semester: 1,
      subject: "English",
      marks: 92,
    },
    {
      name: "Angel",
      rollno: 5,
      branch: "Architecture",
      semester: 5,
      subject: "Biology",
      marks: 74,
    },
  ];

  // State for storing list of students
  const [students, setStudents] = useState<Student[]>(mockStudents);
  // State for storing the ID of the currently selected student
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    null
  );
  // State for storing the roll numbers of selected students
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  // State to toggle visibility of the print component
  const [showPrintComponent, setShowPrintComponent] = useState(false);
  // State for storing names of students selected for printing
  const [selectedStudentNames, setSelectedStudentNames] = useState<string[]>(
    []
  );

  // Handler for selecting/deselecting a student
  const handleStudentSelect = (student: Student) => {
    const studentRollNo = student.rollno.toString();

    if (selectedStudents.includes(studentRollNo)) {
      // Remove student from selection if already selected
      setSelectedStudents(
        selectedStudents.filter((rollNo) => rollNo !== studentRollNo)
      );
    } else {
      // Add student to selection if not already selected
      setSelectedStudents([...selectedStudents, studentRollNo]);
    }
  };

  // Handler for clicking on a student name
  const handleStudentClick = (rollno: number) => {
    setSelectedProfileId(rollno); // Ensure this is correctly setting the ID
    router.push(`/profile/${rollno}`); // This navigates to the profile page
  };

  // Handler for initiating the print process
  const handlePrint = async () => {
    if (selectedStudents.length === 0) {
      alert("No students selected for printing.");
      return;
    }

    const names = students
      .filter(student => selectedStudents.includes(student.rollno.toString()))
      .map(student => student.name);
    console.log("Names to print:", names); // Debugging log
    setSelectedStudentNames(names); // Set names of students to be printed
    setShowPrintComponent(true); // Show the print component
  };

  // Component for rendering the print content
  const PrintContent: React.FC = () => {
    if (!selectedStudentNames.length) return null; // Return null if no names to print

    const generatePDF = () => {
      console.log("Generating PDF for:", selectedStudentNames); // Debugging log
      const doc = new jsPDF();
      doc.text("Selected Students:", 10, 10);
      selectedStudentNames.forEach((name, index) => {
        doc.text(`${index + 1}. ${name}`, 10, 20 + 10 * index);
      });
      doc.save("selected_students.pdf");
    };

    return <button onClick={generatePDF}>Print Selected Students</button>;
  };

  // State and handlers for admin functionalities
  const [isAdmin, setIsAdmin] = useState(false); // State to check if user is admin

  const handleViewProfile = (studentId: string) => {
    setSelectedProfileId(parseInt(studentId)); // Set the ID of the student whose profile is to be viewed
  };

  // State and handler for filter options in the select component
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: string }>(
    {}
  );
  const handleFilterChange = (selectedOption: any) => {
    setFilterOptions({
      ...filterOptions,
      [selectedOption.value]: selectedOption.label,
    }); // Update filter state
  };

  // Handler for editing student information
  const handleEditStudent = (student: Student) => {
    console.log("Edit student:", student);
    // Placeholder for actual edit logic
  };

  const selectedStudent = students.find(
    (student) => student.rollno === selectedProfileId
  );

  console.log("Selected Profile ID:", selectedProfileId);
  console.log("Selected Student:", selectedStudent);

  return (
    <div className="p-5 font-sans">
      <h1 className="text-gray-800 border-b-2 border-gray-600">
        Students List
      </h1>
      <Select
        options={Object.keys(filterOptions).map((key) => ({
          value: key,
          label: filterOptions[key],
        }))}
        isMulti
        value={Object.keys(filterOptions).map((key) => ({
          value: key,
          label: filterOptions[key],
        }))}
        onChange={handleFilterChange}
        className="select-filter"
      />
      <ul className="list-none p-0">
        {students.map((student) => (
          <li
            key={student.rollno}
            className="mb-2.5 border-b border-gray-300 pb-2.5"
          >
            <button
              onClick={() => handleStudentSelect(student)}
              className={`mr-2.5 px-2.5 py-1.5 ${
                selectedStudents.includes(student.rollno.toString())
                  ? "bg-red-500"
                  : "bg-green-500"
              } text-white border-none rounded`}
            >
              {selectedStudents.includes(student.rollno.toString())
                ? "Deselect"
                : "Select"}
            </button>
            <a
              onClick={() => handleStudentClick(student.rollno)}
              className="cursor-pointer text-blue-600 mr-2.5"
            >
              {student.name}
            </a>
            <Link legacyBehavior href={`/profile/${student.rollno}`}>
              <a className="text-blue-600">Profile</a>
            </Link>
            {isAdmin && (
              <>
                <button
                  onClick={() => handleViewProfile(student.rollno.toString())}
                  className="ml-2.5 bg-blue-600 text-white px-2.5 py-1.5 border-none rounded"
                >
                  View Profile
                </button>
                <button
                  onClick={() => handleEditStudent(student)}
                  className="ml-2.5 bg-yellow-400 text-white px-2.5 py-1.5 border-none rounded"
                >
                  Edit
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={handlePrint}
        className="bg-green-500 text-white px-5 py-2.5 border-none rounded cursor-pointer"
      >
        Print Selected Students
      </button>
      {showPrintComponent && <PrintContent />}
      {selectedProfileId && selectedStudent ? (
        <Profile student={selectedStudent} />
      ) : (
        <p>No student selected or student data not found.</p>
      )}
      {isAdmin && (
        <div className="mt-5">
          <h2>Admin Panel</h2>
          <button
            disabled={!selectedProfileId}
            className="bg-gray-700 text-white px-5 py-2.5 border-none rounded cursor-pointer"
          >
            Edit Selected Student
          </button>
          <button className="bg-teal-700 text-white px-5 py-2.5 border-none rounded cursor-pointer ml-2.5">
            Add New Student
          </button>
          <button
            disabled={!selectedStudents.length}
            className="bg-red-500 text-white px-5 py-2.5 border-none rounded cursor-pointer ml-2.5"
          >
            Delete Selected Students
          </button>
        </div>
      )}
    </div>
  );
};
export default StudentsList;
