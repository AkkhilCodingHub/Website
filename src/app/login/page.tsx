"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation"; // Corrected import for useRouter
import axios from "axios";

// Interface defining the properties for the Login component
export interface LoginProps {
  username?: string; // Optional initial username
  pin?: string; // Optional initial pin

  errorMessage?: string; // Optional error message for display

  onLogin: (username: string, pin: string) => void; // Function to call on successful login

  isLoading?: boolean; // Flag to indicate if the login process is in progress

  successMessage?: string; // Optional success message for display
}

// Functional component for handling user login
const Login: React.FC<LoginProps> = () => {
  const [name, setName] = useState(""); // State for storing username
  const [pin, setPin] = useState(""); // State for storing user pin
  const router = useRouter(); // Hook to access the router object
  const [showPinPopup, setShowPinPopup] = useState(false); // State to manage visibility of the admin pin popup
  const [adminPinInput, setAdminPinInput] = useState(""); // State for storing the admin pin input
  const errorRef = useRef<HTMLDivElement>(null); // Ref to access the DOM element for displaying errors

  // Handler for login form submission
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await axios.post('/api/login', {
        name,
        pin
      });

      if (response.status === 200) {
        router.push("/"); // Navigate to the root path on successful login
      } else {
        if (errorRef.current) {
          errorRef.current.textContent = response.data.message; // Display error message from response
        }
      }
    } catch (error: any) {
      if (errorRef.current) {
        errorRef.current.textContent = error.response.data.message || "An error occurred"; // Display error message from exception
      }
    }
  };

  // Handler for admin pin form submission
  const handleAdminPinSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (adminPinInput === process.env.REACT_APP_ADMIN_PIN) { // Check if the entered pin matches the environment variable
      router.push("/Dashboard"); // Navigate to the Dashboard on successful pin entry
    } else {
      setAdminPinInput(""); // Clear the pin input on failure
      if (errorRef.current) {
        errorRef.current.textContent = "Incorrect Admin Pin. Please try again."; // Display error message
      }
    }
    setShowPinPopup(false); // Close the admin pin popup
  };

  // Handler to show the admin pin popup
  const handleShowAdminPinPopup = () => {
    setShowPinPopup(true);
  };

  // Render method for the Login component
  return (
<div className="login-container bg-gray-100 flex flex-col items-center justify-center h-screen ">
  {/* Login form with username and pin input fields */}
  <form onSubmit={handleLogin} className="flex flex-col space-y-2">
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <input
      type="password"
      value={pin}
      onChange={(e) => setPin(e.target.value)}
      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
      Login
    </button>
  </form>

  {/* Button to trigger the display of the admin pin popup */}
  <button onClick={handleShowAdminPinPopup} className="bg-gray-200 text-gray-500 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
    Dashboard (Admin)
  </button>

  {/* Conditional rendering of the admin pin popup based on its visibility state */}
  {showPinPopup && (
    <div className="pin-popup fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-md shadow-md p-4 flex flex-col space-y-2">
        <h2>Enter Admin Pin</h2>
        <form onSubmit={handleAdminPinSubmit} className="flex flex-col space-y-2">
          <input
            type="password"
            value={adminPinInput}
            onChange={(e) => setAdminPinInput(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:offset-2 focus:ring-blue-500">
            Submit
          </button>
        </form>
        <button onClick={() => setShowPinPopup(false)} className="text-gray-500 hover:underline">Cancel</button>
      </div>
    </div>
  )}

  {/* Optional rendering of the error message element */}
  {errorRef.current && <div ref={errorRef} className="error-message"></div>}
</div>
  )
};

export default Login;
