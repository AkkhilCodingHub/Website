import React, { createContext, useState, useEffect } from "react";

interface AuthContextValue {
  user: { name?: string } | null;
  setUser: (user: { name?: string } | null) => void;
  
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  setUser: () => {},
});

const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<AuthContextValue["user"]>(null);
  
  useEffect(() => {
    // Check for existing login on component mount
    const storedUser = localStorage.getItem("user"); // Replace with secure storage
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
