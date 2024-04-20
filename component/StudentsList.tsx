import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Select from 'react-select'; // Multi-column selection
import { PDFDownloadLink, Document, Page, Text, View } from '@react-pdf/renderer';
import { Link } from 'next/link'; // For navigating to profile page

// Assuming you have a component for displaying student profiles
import Profile from './Profile'; // Replace with your actual profile component path

// Assuming you have a sample student data structure
interface Student {
  name: string;
  rollno:number;
  semester: number;
  // Add other student data fields as needed (e.g., rollNumber, marks)
}

interface SelectedColumn {
  columnName: string;
  students: Student[];
}

const StudentsList: React.FC = () => {
  const router = useRouter();
  const { branch, semester } = router.query; // Access query parameters

  const [students, setStudents] = useState<Student[]>([]); // Use sample or mock data
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumn[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  // Replace this with your actual student data fetching logic (not HSBTΕ API)
  useEffect(() => {
    const sampleStudentData = [
      // Replace with your actual student data
      { name: 'John Doe', semester: 1, id: '1' },
      { name: 'Jane Smith', semester: 2, id: '2' },
      { name: 'Alice Walker', semester: 3, id: '3' },
    ];
    setStudents(sampleStudentData);
  }, []);

  const handleColumnSelect = (selectedOption: any) => { // Adjust type based on your data
    const newColumn = { columnName: selectedOption.value, students: [] };
    setSelectedColumns([...selectedColumns, newColumn]);
  };

  const handleStudentSelect = (student: Student, columnName: string) => {
    setSelectedColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.columnName === columnName
          ? { ...col, students: [...col.students, student] }
          : col
      )
    );
  };

  const handleOpenProfile = (studentId: string) => {
    setSelectedProfileId(studentId);
  };

  const handlePrint = () => {
    // Implement logic to print selected student profiles using @react-pdf/renderer
    const selectedStudentNames = selectedColumns.reduce((acc, col) => {
      return [...acc, ...col.students.map((student) => student.name)];
    }, []);

    const doc = (
      <Document>
        <Page>
          <Text>Selected Students:</Text>
          <List style={{ marginLeft: 20 }}>
            {selectedStudentNames.map((name) => (
              <ListItem key={name}>{name}</ListItem>
            ))}
          </List>
        </Page>
      </Document>
    );

    <PDFDownloadLink document={doc} fileName="selected_students.pdf">
      {({ blob, url }) => (
        <button onClick={() => blob && window.open(url, '_blank')}>
          Print Selected Students
        </button>
      )}
    </PDFDownloadLink>;
  };

  // Admin functionalities (placeholder)
  const isAdmin = false; // Replace with logic to check for admin user

  return (
    <div>
      <h1>Students List</h1>
      <Select
        value={selectedColumns.map((col) => ({ value: col.columnName, label: col.columnName }))}
        onChange={handleColumnSelect}
        options={
          // Generate options based on your sample student data
          students.length > 0
            ? students[0] // Assuming first student has relevant data fields
              ? Object.keys(students[0]).map((key) => ({ value: key, label: key }))
              : []
            : []
        }
        isMulti // Enable multi-selection
      />
      {selectedColumns.map((col) => (
        <div key={col.columnName}>
          <h2>{col.columnName}</h2>
          <ul>
            {col.students.map((student) => (
              <li key={student.name}>
                {student.name} (
                <button onClick={() => handleStudentSelect(student, col.columnName)}>
                  Select
                </button>
                <Link href={`/profile/${student.id}`}>
                  <a>Profile</a>
                </Link>
                )
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button onClick={handlePrint}>Print Selected Students</button>

      {selectedProfileId && <Profile studentId={selectedProfileId} />}

      {/* Admin functionalities (conditionally render) */}
      {isAdmin && (
        <div>
          <h2>Admin Panel</h2>
          {/* Add your admin functionalities here (e.g., edit columns, promote students, upload new data) */}
        </div>
      )}
    </div>
  );
};

export default StudentsList;