import React, { useState } from "react";
import { useRouter } from "next/router";

interface LoginProps {
  // Add props if needed
}

const LoginPage: React.FC<LoginProps> = () => {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implement login logic using your service
    if (name === "HOD-EXAM" && pin === "admin@examcs") {
      // Replace with secure validation
      router.push("/admin/dashboard");
    } else {
      Console.log('not a admin')
    }
  };

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
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
