"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import { useRouter } from 'next/router';
import { Admin, User as Teacher } from '@/types/admin'; // Import admin and teacher data types
import loginPage from '../login/page'; // Import login and teacher functions from auth.js (assuming)
import { getTeachers, addTeacher, removeTeacher } from '@/types/dbstruct';
import { LoginProps } from '../login/page'; // Import LoginProps interface from login/page.tsx

// Function to update the admin pin using axios for HTTP requests
async function updateAdminPin(newPin: string): Promise<any> {
  try {
    const response = await axios.post('/api/update-Admin-Pin', { pin: newPin });
    return response.data; // Return data from axios response
  } catch (error) {
    console.error('Error updating admin pin:', error);
    throw error;
  }
}

interface AdminDashboardProps {
  user: Admin | null;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const router = useRouter();
  const [adminPin, setAdminPin] = useState<string>('');
  const [resetPasswordEmail, setResetPasswordEmail] = useState<string>('');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [newTeacherName, setNewTeacherName] = useState<string>('');
  const [newTeacherPin, setNewTeacherPin] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showAdminPinPopup, setShowAdminPinPopup] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      setIsLoggedIn(true);
    } else {
      router.push('/login');
    }

    const fetchTeachers = async () => {
      if (isLoggedIn) {
        try {
          const fetchedTeachers: Teacher[] = await getTeachers();
          setTeachers(fetchedTeachers);
        } catch (error) {
          console.error('Error fetching teachers:', error);
        }
      }
    };
    fetchTeachers();
  }, [isLoggedIn]);

  const handleLogin = async (username: string, pin: string) => {
    if (pin === process.env.REACT_APP_ADMIN_PIN) {
      setIsLoggedIn(true);
      localStorage.setItem('adminUser', JSON.stringify(true));
      router.push('/Dashboard');
    } else {
      try {
        const onLogin = (username: string, pin: string) => {
          console.log(`Logged in as ${username} with pin ${pin}`);
          setIsLoggedIn(true);
          router.push('/userDashboard');
        };

        const loginProps: LoginProps = {
          username,
          pin,
          onLogin,
          errorMessage: '',
          isLoading: false,
          successMessage: ''
        };

        const loginResponse = await loginPage(loginProps);
        if (loginResponse === "success") {
          setIsLoggedIn(true);
          router.push('/Dashboard');
        } else {
          console.error('Login failed:');
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    }
  };

  const handleResetAdminPassword = async (newAdminPin: string) => {
    try {
      console.log('Resetting admin password...', resetPasswordEmail);
      const response = await updateAdminPin(newAdminPin);
      if (response.ok) {
        console.log('Admin password reset successfully.');
      } else {
        throw new Error('Failed to reset admin password.');
      }
      setResetPasswordEmail('');
    } catch (error) {
      console.error('Error resetting admin password:', error);
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
      setNewTeacherPin('');
      setTeachers([...teachers, newTeacher]);
    } catch (error) {
      console.error('Error adding teacher:', error);
    }
  };

  const handleRemoveTeacher = async (teacher: Teacher) => {
    try {
      console.log('Removing teacher:', teacher);
      await removeTeacher(teacher.name);
      setTeachers(teachers.filter((t) => t.name !== teacher.name));
    } catch (error) {
      console.error('Error removing teacher:', error);
    }
  };

  const handleShowAdminPinPopup = () => {
    setShowAdminPinPopup(true);
  };

  const handleAdminPinChangeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!showAdminPinPopup) return;

    try {
      const updateAdminPinResponse = await updateAdminPin(adminPin);
      if (updateAdminPinResponse.ok) {
        console.log('Admin pin updated successfully.');
        setShowAdminPinPopup(false);
        setAdminPin('');
      } else {
        console.error('Error updating admin pin:', updateAdminPinResponse.message);
      }
    } catch (error) {
      console.error('Error updating admin pin:', error);
    } finally {
      setAdminPin('');
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h1>Admin Dashboard</h1>
          <h2>Welcome, {user?.id}</h2>
          <h3>Teachers</h3>
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

          {showAdminPinPopup && (
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
      {isLoggedIn ? (
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
          <button onClick={() => handleLogin('admin', adminPin)} className="login-btn">
            Login as Admin
          </button>
          <button onClick={() => handleLogin('exampleUser', 'examplePin')} className="login-btn">
            Login as User
          </button>
          <button onClick={() => handleResetAdminPassword('newAdminPin')}>
            Forgot your pin?
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;