"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Fixed import from "next/navigation" to "next/router"
import { Student } from "@/types/admin";
import Profile from "@/app/profile/page";
import jsPDF from "jspdf";
import { computer, Electronics, Mechanical, Civil, Architecture } from "@/types/admin";

const StudentsList: React.FC = () => {
  const router = useRouter();
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const [filterOptions, setFilterOptions] = useState<{ [key: string]: string }>({});

  const handleBranchSemesterSelection = (branch: string, semester: number) => {
    setSelectedBranch(branch);
    setSelectedSemester(semester);
  };

  const filteredStudents = () => {
    let students: Student[] = [];

    switch (selectedBranch) {
      case "Computer":
        students = computer.filter(student => student.semester === selectedSemester);
        break;
      case "Electronics":
        students = Electronics.filter(student => student.semester === selectedSemester);
        break;
      case "Mechanical":
        students = Mechanical.filter(student => student.semester === selectedSemester);
        break;
      case "Civil":
        students = Civil.filter(student => student.semester === selectedSemester);
        break;
      case "Architecture":
        students = Architecture.filter(student => student.semester === selectedSemester);
        break;
      default:
        break;
    }

    return students;
  };

  const handleStudentClick = (branch: string, semester: number) => {
    handleBranchSemesterSelection(branch, semester);
    router.push(`/profile/${branch}/${semester}`);
  };

  const handleFilterChange = (selectedOption: any) => {
    setFilterOptions({
      ...filterOptions,
      [selectedOption.value]: selectedOption.label,
    });
  };

  // State for storing list of students
  const [students, setStudents] = useState<Student[]>(filteredStudents());
  // State for storing the ID of the currently selected student
  const [selectedProfileId, setSelectedProfileId] = useState<{ branch: string, semester: number } | null>(null);
  // State for storing the branch and semester of selected students
  const [selectedStudents, setSelectedStudents] = useState<{ branch: string, semester: number }[]>([]);
  // State to toggle visibility of the print component
  const [showPrintComponent, setShowPrintComponent] = useState(false);
  // State for storing names of students selected for printing
  const [selectedStudentNames, setSelectedStudentNames] = useState<string[]>([]);

  // Handler for selecting/deselecting a student
  const handleStudentSelect = (student: Student) => {
    const studentInfo = { branch: student.branch, semester: student.semester };

    if (selectedStudents.some(s => s.branch === studentInfo.branch && s.semester === studentInfo.semester)) {
      // Remove student from selection if already selected
      setSelectedStudents(selectedStudents.filter(s => s.branch !== studentInfo.branch || s.semester !== studentInfo.semester));
    } else {
      // Add student to selection if not already selected
      setSelectedStudents([...selectedStudents, studentInfo]);
    }
  };

  // Handler for initiating the print process
  const handlePrint = async () => {
    if (selectedStudents.length === 0) {
      alert("No students selected for printing.");
      return;
    }

    const names = students
      .filter(student => selectedStudents.some(s => s.branch === student.branch && s.semester === student.semester))
      .map(student => student.name);
    setSelectedStudentNames(names); // Set names of students to be printed
    setShowPrintComponent(true); // Show the print component
  };

  // Component for rendering the print content
  const PrintContent: React.FC = () => {
    if (!selectedStudentNames.length) return null; // Return null if no names to print

    const generatePDF = () => {
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

  const handleViewProfile = (branch: string, semester: number) => {
    setSelectedProfileId({ branch, semester }); // Set the ID of the student whose profile is to be viewed
  };

  // Handler for editing student information
  const handleEditStudent = (student: Student) => {
    console.log("Edit student:", student);
    // Placeholder for actual edit logic
  };

  const selectedStudent = students.find(
    (student) => selectedProfileId && student.branch === selectedProfileId.branch && student.semester === selectedProfileId.semester
  );

  console.log("Selected Profile ID:", selectedProfileId);
  console.log("Selected Student:", selectedStudent);

  return (
    <div className="p-5 font-sans">
      <h1 className="text-gray-800 border-b-2 border-gray-600">Students List</h1>
      {/* Select component code here */}
      <ul className="list-none p-0">
        {filteredStudents().map((student) => (
          <li key={`${student.name}-${student.rollno}`} className="mb-2.5 border-b border-gray-300 pb-2.5">
            <button onClick={() => handleStudentSelect(student)} className={`mr-2.5 px-2.5 py-1.5 ${selectedStudents.some(s => s.branch === student.branch && s.semester === student.semester) ? 'bg-red-500' : 'bg-green-500'} text-white border-none rounded`}>
              {selectedStudents.some(s => s.branch === student.branch && s.semester === student.semester)
                ? "Deselect"
                : "Select"}
            </button>
            <a
              onClick={() => handleStudentClick(student.branch, student.semester)}
              className="cursor-pointer text-blue-600 mr-2.5"
            >
              {student.name}
            </a>
            {/* Link component code here */}
            {isAdmin && (
              <>
                <button
                  onClick={() => handleViewProfile(student.branch, student.semester)}
                  className="ml-2.5 bg-blue-600 text-white px-2.5 py-1.5 border-none rounded"
                >
                  View Profile
                </button>
                <button onClick={() => handleEditStudent(student)} className="ml-2.5 bg-yellow-400 text-white px-2.5 py-1.5 border-none rounded">Edit</button>
              </>
            )}
          </li>
        ))}
      </ul>

      <button onClick={handlePrint} className="bg-green-500 text-white px-5 py-2.5 border-none rounded cursor-pointer">Print Selected Students</button>
      {showPrintComponent && <PrintContent />}
      {selectedProfileId && selectedStudent ? (
        <Profile student={selectedStudent} />
      ) : (
        <p>No student selected or student data not found.</p>
      )}
      {isAdmin && (
        <div className="mt-5">
          <h2>Admin Panel</h2>
          <button disabled={!selectedProfileId} className="bg-gray-700 text-white px-5 py-2.5 border-none rounded cursor-pointer">Edit Selected Student</button>
          <button className="bg-teal-700 text-white px-5 py-2.5 border-none rounded cursor-pointer ml-2.5">Add New Student</button>
          <button disabled={!selectedStudents.length} className="bg-red-500 text-white px-5 py-2.5 border-none rounded cursor-pointer ml-2.5">
            Delete Selected Students
          </button>
        </div>
      )}
    </div>
  );
};
export default StudentsList;
