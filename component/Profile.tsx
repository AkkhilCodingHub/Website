import React, { useState, useEffect } from 'react';

interface ProfileProps {
  studentId: string;
}

const Profile: React.FC<ProfileProps> = ({ studentId }) => {
  const [studentData, setStudentData] = useState<any>(null); // Replace with actual profile data type

  // Replace with your logic to fetch student profile data based on studentId
  useEffect(() => {
    const fetchStudentProfile = async () => {
      const profileData = {
        name: 'John Doe',
        semester: 1,
        rollNumber: '211630800003',
        branch: 'Computer Engineering',
        marks: {
          'Computer Networks': 62,
          'Computer Programming Using Python': 54,
          'Software Engineering': 80,
          'Web Development Using PHP': 78,
          'Cloud Computing': 82,
          'Industrial Training': 90,
        },
      }; // Replace with actual data fetching logic
      setStudentData(profileData);
    };
    fetchStudentProfile();
  }, [studentId]);

  if (!studentData) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <h1>{studentData.name}</h1>
      <p>Roll Number: {studentData.rollNumber}</p>
      <p>Semester: {studentData.semester}</p>
      <p>Branch: {studentData.branch}</p>
      <h2>Marks</h2>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Marks</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(studentData.marks).map(([subject, marks]) => (
            <tr key={subject}>
              <td>{subject}</td>
              <td>{marks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
