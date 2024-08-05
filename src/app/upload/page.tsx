"use client";
import React, { useState, useEffect } from 'react';
import { Branch, Semester, fetchBranchesAndSemesters } from '@/types/admin';

const UploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    async function loadBranchesAndSemesters() {
      const { branches, semesters } = await fetchBranchesAndSemesters();
      setBranches(branches);
      setSemesters(semesters);
    }
    loadBranchesAndSemesters();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Data uploaded successfully');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      setMessage('An error occurred while uploading the data');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Upload Student Data</h1>
      <div className="mb-4">
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="mb-2" />
        <button
          onClick={handleUpload}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload
        </button>
      </div>
      {message && <p className="text-green-600">{message}</p>}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Available Branches and Semesters</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">Branches</h3>
            <ul>
              {branches.map((branch) => (
                <li key={branch.value}>{branch.label} ({branch.value})</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Semesters</h3>
            <ul>
              {semesters.map((semester) => (
                <li key={semester.value}>{semester.label} ({semester.value})</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;