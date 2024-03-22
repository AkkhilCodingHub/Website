import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Shared header component */}
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">College Exam Branch</h1>
        <nav className="flex space-x-4">
          <a href="/" className="hover:underline">
            Home
          </a>
          <a href="/about" className="hover:underline">
            About Us
          </a>
          <a href="/announcements" className="hover:underline">
            Announcements
          </a>
          <a href="/exams" className="hover:underline">
            Exams
          </a>
        </nav>
      </header>

      {/* Render the main content of the page */}
      <main className="flex-grow p-4">{children}</main>

      {/* Shared footer component */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>College Name &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Layout;
