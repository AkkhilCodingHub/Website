"use client";
import React, { useState, useEffect } from 'react';
import { branches, Semester, Student, Semesters } from '@/types/admin';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For routing
import { getTeachers } from '@/types/dbstruct';
 
// Homepage component using React functional component syntax
const Homepage: React.FC = () => {
  // State hooks for various properties
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [availableSemesters, setAvailableSemesters] = useState<Semester[]>(Semesters); 
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Track login status
  const [isTeacher, setIsTeacher] = useState<boolean>(false); // Track user role

  const router = useRouter(); // Get router instance

  // Effect hook to check login and user role from local storage
  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn'); // Placeholder example
    setIsLoggedIn(storedLogin === 'true');

    const storedUserRole = localStorage.getItem('userRole'); // Placeholder example
    setIsTeacher(storedUserRole === 'teacher');
  }, []);

  // Handler for branch selection change
  const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (selectedValue !== null) {
      setSelectedBranch(selectedValue);
      setStudents([]); // Clear students when branch changes

      // Update available semesters based on selected branch
      const availableSemesters = selectedValue === 'mlt'
        ? Semesters.filter((semester) => semester.value <= 3) // Filter first 3 semesters for MLT
        : Semesters; // Use all semesters for other branches

        setAvailableSemesters(availableSemesters);
    }
  };

  // Handler for semester selection change
  const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const semester = parseInt(event.target.value);

    if (selectedBranch && semester > 0) { // Only fetch if branch is selected and semester is valid
      fetchStudents(selectedBranch, semester);
    } else {
      setStudents([]); // Clear students if no branch or invalid semester is selected
    }
  };

  // Function to fetch students based on branch and semester
  const fetchStudents = async (branch: string, semester: number) => {
    try {
      const response = await fetch(`/api/students?branch=${branch}&semester=${semester}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch students: ${response.statusText}`);
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      // Handle errors appropriately (e.g., display error message)
    }
  };
  
  // Render method returns the JSX for the homepage
  return (
        <div className="min-h-screen bg-cover bg-no-repeat bg-center bg-url bg-[url('./image.jpeg')]" style={{ backgroundImage: `url(./image.jpeg)` }}>
          <div className="container mx-auto px-4 py-8"> {/* Container for layout */}
    
            {/* Login/Logout Button */}
            {isLoggedIn ? (
              <div className="flex justify-end">
                {isTeacher ? (
                  <span className="text-green-500 font-bold">{`Teacher: ${getTeachers}`}</span>
                ) : (
                  <span className="text-blue-500 font-bold">Admin</span>
                )}
              </div>
            ) : (
              <button className="absolute top-0 right-0 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Link href="/login">Login</Link>
              </button>
            )}
    
            {/* Heading */}
            <h1 className="text-4xl font-bold text-center mb-8">Student Management System</h1>
    
            {/* Branches and Semesters (Responsive Layout) */}
            <div className="flex flex-col sm:flex-row sm:space-x-4">
              <div className="w-full sm:w-1/2">
                <label htmlFor="branch" className="text-gray-700 font-medium mb-1">Select Branch:</label>
                <select id="branch" name="branch" value={selectedBranch !== null ? selectedBranch : ''} onChange={handleBranchChange} className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">-- Select Branch --</option>
                  {branches.map((branch) => (
                    <option key={branch.value} value={branch.value}>
                      {branch.label}
                    </option>
                  ))}
                </select>
              </div>
              {selectedBranch && (
                <div className="flex items-center justify-center sm:justify-start w-full sm:w-1/2">
                  <label htmlFor="semester" className="text-gray-700 font-medium mr-2 sm:mr-4">Select Semester:</label>
                  <select id="semester" name="semester" value={semesters.length > 0 ? semesters[0].value : ''} onChange={handleSemesterChange} className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {availableSemesters.map((semester) => (
                      <option key={semester.value} value={semester.value}>
                        {semester.label}
                      </option>
                    ))}
                  </select>
                  <svg className="hidden sm:block h-5 w-5 text-gray-500 ml-2 transform transition duration-300 ease-in-out" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                              </div>
                            )}
                          </div>
                  
                          {/* Student List */}
                          {students.length > 0 && (
                            <ul>
                              {students.map((student) => (
                                <li key={student.rollno} className="flex items-center justify-between border-b border-gray-200 py-2">
                                  <Link href={`/studentlist/${student.rollno}`}>
                                    <a className="text-gray-700">{student.name}</a>
                                  </Link>
                                  <span className="text-gray-500">Semester: {student.semester}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                  
                          {/* Upload Button (Conditional based on isTeacher) */}
                          {isLoggedIn && isTeacher && (
                            <button className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                              Upload Students
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  };
export default Homepage;