import React, { useState, useEffect } from 'react';

interface Branch {
  value: string;
  label: string;
}

const branches: Branch[] = [
  {value: 'diploma', label: 'Diploma'},
  { value: 'architecture', label: 'Architecture' },
  { value: 'computer', label: 'Computer' },
  { value: 'civil', label: 'Civil' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'mechanical', label: 'Machanical' },
  { value: 'mlt', label: 'MLT' },
  { value: 'ic', label: 'I/C' },
];

interface Semester {
  value: number;
  label: string;
}

const Homepage: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [students, setStudents] = useState<any[]>([]); // Replace with actual student data type

  useEffect(() => {
    updateSemesters(selectedBranch);
  }, [selectedBranch]);

  const updateSemesters = (branch: string | null) => {
    if (branch === 'mlt') {
      setSemesters(Array.from({ length: 3 }, (_, i) => ({ value: i + 1, label: `Semester ${i + 1}` })));
    } else {
      setSemesters(Array.from({ length: 6 }, (_, i) => ({ value: i + 1, label: `Semester ${i + 1}` })));
    }
  };

  const fetchStudents = async (branch: string, semester: number) => {
    try {
      // Simulate API call to MongoDB (replace with your actual implementation)
      const response = await fetch('http://your-api-endpoint/students', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        // Add query parameters if needed (e.g., branch, semester)
        query: {
          branch,
          semester,
        },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch students: ${response.statusText}`);
      }
  
      const data = await response.json();
      setStudents(data); // Update state with fetched student data
    } catch (error) {
      console.error('Error fetching students:', error);
      // Handle errors appropriately (e.g., display error message)
    }
  };
  
  const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (selectedValue !== null) {
      setSelectedBranch(selectedValue);
    }
  };

  const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const semester = parseInt(event.target.value);
  
    // Check if selectedBranch is defined and has a value
    if (selectedBranch) {
      // Call the fetchStudents function with the selectedBranch and semester values
      fetchStudents(selectedBranch, semester);
    } else {
      // Handle the case where selectedBranch is null or undefined
      // For example, you could display an error message or disable the button
    }
  };
  
  
  return (
    <div>
      <div id="login-button">
        <button>Login</button>
      </div>
      <h1>Branch list</h1>
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
            {semesters.map((semester) => (
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
            <li key={student.name}>
              Name: {student.name}, Semester: {student.semester}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Homepage;
