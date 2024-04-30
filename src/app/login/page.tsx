"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";

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
      router.push("./dashboard");
    } else {
      console.log('Login failed');
    }
  }
  return (
    <div>
      {/* Login form with name and pin fields */}
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="pin"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;