"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface LoginProps {
  // Initial values
  username?: string;
  pin?: string;

  // Error handling
  errorMessage?: string;

  // Login function
  onLogin: (username: string, pin: string) => void;

  // Loading state
  isLoading?: boolean;

  // Success message
  successMessage?: string;
}

const Login: React.FC<LoginProps> = () => {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const router = useRouter();
  const [showPinPopup, setShowPinPopup] = useState(false); // Admin pin pop-up visibility
  const [adminPinInput, setAdminPinInput] = useState(""); // Entered admin pin
  const errorRef = useRef<HTMLDivElement>(null); // Reference to error message element

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, pin })
    });

    if (response.ok) {
      router.push("/"); // Assuming root path for successful login
    } else {
      const data = await response.json();
      if (errorRef.
        current) {
        errorRef.current.textContent = data.message; // Display error from response
      }
    }
  };

  const handleAdminPinSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (adminPinInput === process.env.REACT_APP_ADMIN_PIN) { // Use environment variable
      router.push("/Dashboard");
    } else {
      setAdminPinInput(""); // Clear entered pin after submission
      if (errorRef.current) {
        errorRef.current.textContent = "Incorrect Admin Pin. Please try again.";
      }
    }
    setShowPinPopup(false); // Close pop-up
  };

  const handleShowAdminPinPopup = () => {
    setShowPinPopup(true);
  };

  return (
<div className="login-container bg-gray-100 flex flex-col items-center justify-center h-screen ">
  {/* Login form with name and pin fields */}
  <form onSubmit={handleLogin} className="flex flex-col space-y-2"> {/* Form with flexbox layout */}
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

  {/* Button to trigger admin pin pop-up */}
  <button onClick={handleShowAdminPinPopup} className="bg-gray-200 text-gray-500 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
    Dashboard (Admin)
  </button>

  {showPinPopup && ( // Show pop-up only if visible
    <div className="pin-popup fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center"> {/* Pop-up with fixed positioning */}
      <div className="bg-white rounded-md shadow-md p-4 flex flex-col space-y-2"> {/* Pop-up content */}
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

  {/* Error message element (optional) */}
  {errorRef.current && <div ref={errorRef} className="error-message"></div>}
</div>
  )
};

export default Login;
