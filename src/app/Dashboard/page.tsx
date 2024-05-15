"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Admin, Teacher } from '@/types/admin'; // Import admin and teacher data types
import loginPage from '../login/page'; // Import login and teacher functions from auth.js (assuming)
import { getTeachers, addTeacher, removeTeacher } from '@/types/dbstruct';

interface AdminDashboardProps {
  user: Admin | null;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const router = useRouter();
  const [adminPin, setAdminPin] = useState<string >('');
  const [resetPasswordEmail, setResetPasswordEmail] = useState<string>('');
  const [teachers, setTeachers] = useState<Teacher[]>([]); // State for teachers list
  const [newTeacherName, setNewTeacherName] = useState<string>(''); // New teacher name
  const [newTeacherPin, setNewTeacherPin] = useState<string>(''); // New teacher pin
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Login state
  const [showAdminPinPopup, setShowAdminPinPopup] = useState(false); // Pop-up visibility for admin pin

  useEffect(() => {
    // Check if user is already logged in (from localStorage or session storage)
    const storedUser = localStorage.getItem('adminUser'); // Adapt storage based on your preference
    if (storedUser) {
      setIsLoggedIn(true);
    } else {
      router.push('/login'); // Redirect to login page if not logged in
    }

    // Fetch teachers on dashboard mount (if logged in)
    const fetchTeachers = async () => {
      if (isLoggedIn) {
        try {
          const fetchedTeachers: Teacher[] = await getTeachers();
          setTeachers(fetchedTeachers);
        } catch (error) {
          console.error('Error fetching teachers:', error);
          // Handle errors appropriately (e.g., display error message)
        }
      }
    };
    fetchTeachers();
  }, [isLoggedIn]);

  const handleLogin = async () => {
    try {
      const loginResponse = await loginPage(adminPin, ''); // Pass retrieved adminPin
      if (loginResponse === "success") { // Assuming loginPage returns "success" on success
        setIsLoggedIn(true);
        localStorage.setItem('adminUser', JSON.stringify(true)); // Set admin logged in flag
      } else {
        console.error('Login failed:');
        // Display error message to user
      }
    } catch (error) {
      console.error('Error during login:', error);
      // Handle errors appropriately (e.g., display error message)
    } finally {
      setAdminPin(''); // Clear input field after login attempt
    }
  };
  

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

  const handleAddTeacher = async () => {
    try {
      if (!newTeacherName || !newTeacherPin) {
        throw new Error('Please enter teacher name and pin');
      }
      const newTeacher: Teacher = { name: newTeacherName, pin: newTeacherPin };
      await addTeacher(newTeacher);
      console.log('Added new teacher:', newTeacher);
      setNewTeacherName('');
      setNewTeacherPin(''); // Clear input fields
      setTeachers([...teachers, newTeacher]); // Update local state (temporary)
    } catch (error) {
      console.error('Error adding teacher:', error);
      // Handle errors appropriately (e.g., display error message)
    }
  };

  const handleRemoveTeacher = async (teacher: Teacher) => {
    try {
      console.log('Removing teacher:', teacher);
      await removeTeacher(teacher.name);
      setTeachers(teachers.filter((t) => t.name !== teacher.name)); // Update local state (temporary)
    } catch (error) {
      console.error('Error removing teacher:', error);
      // Handle errors appropriately (e.g., display error message)
    }
  };
  
  const handleShowAdminPinPopup = () => {
    setShowAdminPinPopup(true);
  };

  const handleAdminPinChangeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!showAdminPinPopup) return; // Avoid unnecessary actions

    // Implement logic to securely update admin pin on the server (replace with your API call)
    try {
      const updateAdminPinResponse = await updateAdminPin(adminPin); // Replace with actual API call
      if (updateAdminPinResponse.ok) {
        console.log('Admin pin updated successfully.');
        setShowAdminPinPopup(false); // Close pop-up after successful update
        setAdminPin(''); // Clear login input field (optional)
      } else {
        const data = await updateAdminPinResponse.json();
        console.error('Error updating admin pin:', data.message);
        // Handle errors appropriately (e.g., display error message in the pop-up)
      }
    } catch (error) {
      console.error('Error updating admin pin:', error);
      // Handle errors appropriately (e.g., display generic error message in the pop-up)
    } finally {
      setAdminPin(''); // Clear admin pin input field after submission (optional)
    }
  };

  return (
    <div>
  {isLoggedIn ? (
    <>
      <h1>Admin Dashboard</h1>
      <h2>Welcome, {user?.name}</h2> {/* Display admin name if logged in */}
      <h3>Teachers</h3>
      {/* ... teacher list and functionality (unchanged) */}
      {teachers.length > 0 ? (
        <ul className="teachers-list">
          {teachers.map((teacher) => (
            <li key={teacher.name} className="teacher-item">
              {teacher.name}
              <button onClick={() => handleRemoveTeacher(teacher)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No teachers found.</p>
      )}
      <h3>Add Teacher</h3>
      <input
        type="text"
        value={newTeacherName}
        onChange={(e) => setNewTeacherName(e.target.value)}
        placeholder="Teacher Name"
        className="input-field"
      />
      <input
        type="password"
        value={newTeacherPin}
        onChange={(e) => setNewTeacherPin(e.target.value)}
        placeholder="Teacher Pin"
        className="input-field"
      />
      <button onClick={handleAddTeacher} className="add-teacher-btn">
        Add Teacher
      </button>
    </>
  ) : (
    <div>
      <h3>Change Admin Pin</h3>
      <button onClick={handleShowAdminPinPopup} className="change-pin-btn">
        Change Pin
      </button>

      {showAdminPinPopup && ( // Show pop-up only if visible
        <div className="admin-pin-popup">
          <h2>Change Admin Pin</h2>
          <form onSubmit={handleAdminPinChangeSubmit} className="change-pin-form">
            <input
              type="password"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              placeholder="New Admin Pin"
              className="input-field"
            />
            <button type="submit" className="change-pin-btn">
              Change Pin
            </button>
          </form>
          <button onClick={() => setShowAdminPinPopup(false)} className="cancel-btn">
            Cancel
          </button>
        </div>
      )}
    </div>
  )}
  {isLoggedIn} ? (
    <button onClick={() => localStorage.removeItem('adminUser')}>
      Logout
    </button>
  ) : (
    <div>
      <h2>Login</h2>
      <input
        type="password"
        value={adminPin}
        onChange={(e) => setAdminPin(e.target.value)}
        placeholder="Admin Pin"
        className="input-field"
      />
      <button onClick={handleLogin} className="login-btn">
        Login
      </button>
      <p>
        Forgot your pin? {/* Placeholder for password reset functionality */}
      </p>
    </div>
  )
</div>
  )
};

export default AdminDashboard;
