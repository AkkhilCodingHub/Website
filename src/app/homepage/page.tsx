"use client";
import React, { useState, useEffect } from 'react';
import { branches, Semester, Student, Semesters } from '../../types/admin';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // For routing
 
const Homepage: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [availableSemesters, setAvailableSemesters] = useState<Semester[]>(Semesters); 
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Track login status
  const [isTeacher, setIsTeacher] = useState<boolean>(false); // Track user role

  const router = useRouter(); // Get router instance

  useEffect(() => {
    // Check for existing login state or fetch from storage (implement based on your authentication system)
    const storedLogin = localStorage.getItem('isLoggedIn'); // Placeholder example
    setIsLoggedIn(storedLogin === 'true');

    // Check for user role or fetch from storage (implement based on your authentication system)
    const storedUserRole = localStorage.getItem('userRole'); // Placeholder example
    setIsTeacher(storedUserRole === 'teacher');
  }, []);

  const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (selectedValue !== null) {
      setSelectedBranch(selectedValue);
      setStudents([]); // Clear students when branch changes

      // Update available semesters based on selected branch using pre-defined semesters
      const availableSemesters = selectedValue === 'mlt'
        ? Semesters.filter((semester) => semester.value <= 3) // Filter first 3 semesters for MLT
        : Semesters; // Use all semesters for other branches

        setAvailableSemesters(availableSemesters);
    }
  };

  const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const semester = parseInt(event.target.value);

    if (selectedBranch && semester > 0) { // Only fetch if branch is selected and semester is not empty
      fetchStudents(selectedBranch, semester);
    } else {
      setStudents([]); // Clear students if no branch or invalid semester is selected
    }
  };

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
  const handleStudentClick = (studentId: string) => {
    // Navigate to student profile page with student ID as a parameter
    router.push(`/students/${studentId}`); // Use router.push for navigation
  };

  return (
    <div className="homepage">
      <div id="login-button">
        {isLoggedIn ? ( 
          <button onClick={() => router.push('/')}>Logout</button> // Logout button if logged in
        ) : (
          <Link href="/loginPage">
            <button onClick={() => router.push('/loginPage')}>Login</button>
          </Link>
        ) }
      </div>
      <h1>Student Management System</h1>
      <div>
        <label htmlFor="branch">Select Branch:</label>
        <select id="branch" name="branch" value={selectedBranch} onChange={handleBranchChange}>
          <option value="">-- Select Branch --</option>
          {branches.map((branch) => (
            <option key={branch.value} value={branch.value}>
              {branch.label}
            </option>
          ))}
        </select>
      </div>
      {selectedBranch && (
        <div>
          <label htmlFor="semester">Select Semester:</label>
          <select id="semester" name="semester" value={semesters.length > 0 ? semesters[0].value : ''} onChange={handleSemesterChange}>
            {availableSemesters.map((semester) => (
              <option key={semester.value} value={semester.value}>
                {semester.label}
              </option>
            ))}
          </select>
        </div>
      )}
      {students.length > 0 && (
        <ul>
          {students.map((student) => (
            <li key={student.rollno}> {/* Use student ID as key */}
              <Link href={`/students/${student.rollno}`}> {/* Link to student profile */}
                <a>{student.name}</a>
              </Link>
              , Semester: {student.semester}
            </li>
          ))}
        </ul>
      )}
      {isLoggedIn && isTeacher && (
        <button onClick={() => router.push('/upload')}>Upload Students</button>
      )}
    </div>
  );
};

export default Homepage;