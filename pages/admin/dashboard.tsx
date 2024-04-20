import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Admin, Teacher } from '../../types/admin'; // Import admin and teacher data types
import { login } from '../../component/Auth/LoginPage'; // Import login and teacher functions from auth.js (assuming)
import { getTeachers, addTeacher, removeTeacher } from '../../types/dbstruct';
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Login state

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
      const loginResponse = await login(adminPin, ''); // Assuming pin is the authentication method
      if (loginResponse.success) {
        setIsLoggedIn(true);
        localStorage.setItem('adminUser', JSON.stringify(loginResponse.admin)); // Store admin data (adapt storage)
      } else {
        console.error('Login failed:', loginResponse.message);
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

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h1>Admin Dashboard</h1>
          <h2>Welcome, {user?.name}</h2> {/* Display admin name if logged in */}
          <h3>Teachers</h3>
          {teachers.length > 0 ? (
            <ul>
              {teachers.map((teacher) => (
                <li key={teacher.name}>
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
          />
          <input
            type="password"
            value={newTeacherPin}
            onChange={(e) => setNewTeacherPin(e.target.value)}
            placeholder="Teacher Pin"
          />
          <button onClick={handleAddTeacher}>Add Teacher</button>
        </>
      ) : (
        <div>
          <h2>Login</h2>
          <input
            type="password"
            value={adminPin}
            onChange={(e) => setAdminPin(e.target.value)}
            placeholder="Admin Pin"
          />
          <button onClick={handleLogin}>Login</button>
          <p>
            Forgot your pin? {/* Placeholder for password reset functionality */}
          </p>
        </div>
      )}
    </div>
  );
};


export default AdminDashboard;
