import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Admin, Teacher } from '../../types/admin'; // Import admin and teacher data types

interface AdminDashboardProps {
  user: Admin | null;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const router = useRouter();
  const [adminPin, setAdminPin] = useState<string>('');
  const [resetPasswordEmail, setResetPasswordEmail] = useState<string>('');
  const [teachers, setTeachers] = useState<Teacher[]>([]); // State for teachers list
  const [newTeacherName, setNewTeacherName] = useState<string>(''); // New teacher name
  const [newTeacherPin, setNewTeacherPin] = useState<string>(''); // New teacher pin

  useEffect(() => {
    // Check if user is logged in as admin
    if (!user || user.name !== 'HOD-EXAM') {
      router.push('/login'); // Redirect to login page if not admin
    }

    // Fetch teachers list on dashboard mount
    const fetchTeachers = async () => {
      try {
        // Replace with actual logic to fetch teachers from database
        const fetchedTeachers: Teacher[] = [
          { name: 'Applied math', pin: '1325' }, // Example teachers
          // ...
        ];
        setTeachers(fetchedTeachers);
      } catch (error) {
        console.error('Error fetching teachers:', error);
        // Handle errors appropriately (e.g., display error message)
      }
    };
    fetchTeachers();
  }, []);

  const handleResetAdminPassword = async () => {
    // Implement logic to securely reset admin password (e.g., send reset token)
    try {
      console.log('Resetting admin password...', resetPasswordEmail);
      setResetPasswordEmail(''); // Clear input field
    } catch (error) {
      console.error('Error resetting admin password:', error);
      // Handle errors appropriately (e.g., display error message)
    }
  };

  const handleResetAdminPin = async () => {
    // Implement logic to securely reset admin pin (e.g., send new pin)
    try {
      if (adminPin !== 'admin@examcs') { // Check for correct current pin
        throw new Error('Incorrect current admin pin');
      }
      console.log('Resetting admin pin...');
      setAdminPin(''); // Clear input field
    } catch (error) {
      console.error('Error resetting admin pin:', error);
      // Handle errors appropriately (e.g., display error message)
    }
  };

  const handleAddTeacher = async () => {
    // Implement logic to add a new teacher to database
    try {
      if (!newTeacherName || !newTeacherPin) {
        throw new Error('Please enter teacher name and pin');
      }
      const newTeacher: Teacher = { name: newTeacherName, pin: newTeacherPin };
      // Add newTeacher to database
      console.log('Adding new teacher:', newTeacher);
      setNewTeacherName('');
      setNewTeacherPin(''); // Clear input fields
      setTeachers([...teachers, newTeacher]); // Update local state (temporary)
    } catch (error) {
      console.error('Error adding teacher:', error);
      // Handle errors appropriately (e.g., display error message)
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Welcome, {user?.name}</h2>

      <div>
        <h3>Reset Admin Password</h3>
        <input
          type="email"
          value={resetPasswordEmail}
          onChange={(e) => setResetPasswordEmail(e.target.value)}
          placeholder="Enter registered email"
        />
        <button onClick={handleResetAdminPassword}>Reset Password</button>
      </div>

      <div>
        <h3>Reset Admin Pin</h3>
        <input
          type="password"
          value={adminPin}
          onChange={(e) => setAdminPin(e.target.value)}
          placeholder="Current Admin Pin"
        />
        <button onClick={handleResetAdminPin}>Reset Pin</button>
      </div>

      <h2>Teacher Management</h2>
      <div>
        <h3>Add Teacher</h3>
        <input
          type="text"
          value={newTeacherName}
          onChange={(e) => setNewTeacherName(e.target.value)}
          placeholder="Teacher Name"
        />
        <input
          type="password"
          value={newTeacherPin}
          onChange={(e) => setNewTeacherPin(e.target.value)}
          placeholder="Teacher Pin"
        />
        <button onClick={handleAddTeacher}>Add Teacher</button>
      </div>

      {/* (Optional) Implement functionality for removing teachers */}
    </div>
  );
};