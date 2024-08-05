"use client";
import React, { useState, useEffect } from 'react';
import { Branch, Semester, fetchBranchesAndSemesters } from '@/types/admin';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Homepage: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);

  const router = useRouter();

  useEffect(() => {
    async function loadBranchesAndSemesters() {
      const { branches, semesters } = await fetchBranchesAndSemesters();
      setBranches(branches);
      setSemesters(semesters);
    }
    loadBranchesAndSemesters();
  }, []);

  const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    if (selectedValue !== null) {
      setSelectedBranch(selectedValue);
    }
  };

  const handleSemesterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const semester = parseInt(event.target.value);

    if (selectedBranch && semester > 0) {
      router.push(`/studentlist?branch=${selectedBranch}&semester=${semester}`);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat bg-center bg-url bg-[url('/image.jpeg')]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8">
          Student Management System
        </h1>
        <div className="flex flex-col items-center sm:flex-row sm:justify-center mb-4">
          <div className="flex flex-col items-center sm:items-start sm:mr-4 mb-4 sm:mb-0">
            <label htmlFor="branch" className="text-gray-700 font-medium mb-1">
              Select Branch:
            </label>
            <select
              id="branch"
              name="branch"
              value={selectedBranch !== null ? selectedBranch : ""}
              onChange={handleBranchChange}
              className="border border-gray-300 bg-sky-600 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Branch --</option>
              {branches.map((branch) => (
                <option key={branch.value} value={branch.value}>
                  {branch.label}
                </option>
              ))}
            </select>
          </div>
          {selectedBranch && (
            <div className="flex items-center justify-center sm:justify-start w-full sm:w-1/2">
              <label
                htmlFor="semester"
                className="text-gray-700 font-medium mr-2 sm:mr-4"
              >
                Select Semester:
              </label>
              <select
                id="semester"
                name="semester"
                onChange={handleSemesterChange}
                className="border border-gray-300 bg-sky-600 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Semester --</option>
                {semesters.map((semester) => (
                  <option key={semester.value} value={semester.value}>
                    {semester.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="mt-8 text-center">
          <Link href="/upload">
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Upload Student Data
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;