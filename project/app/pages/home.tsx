import React from "react";
import Layout from "../layout/layout";

const HomePage = () => {
  return (
    <Layout>
      <h1 className="text-3xl font-bold text-center mb-4">
        Welcome to the College Exam Branch
      </h1>
      <p className="text-lg">
        This website provides information and resources related to exams
        conducted by the college.
      </p>

      {/* Add additional content sections for announcements, important information, etc. */}
    </Layout>
  );
};

export default HomePage;
