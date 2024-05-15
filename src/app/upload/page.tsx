"use client";
import { Student } from '../../types/admin';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone'; // Assuming you're using react-dropzone

interface StudentUploadProps {
  onUploadSuccess: (students: Student[]) => void; // Callback for successful upload
}

const StudentUpload: React.FC<StudentUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { getRootProps, getInputProps } = useDropzone({
accept: {
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel.sheet.macroEnabled.12': ['.xlsm'],
  'application/vnd.ms-excel.sheet.binary.macroEnabled.12': ['.xlsb'],
},

    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]); // Set the uploaded file
      setUploadError(null); // Clear previous error
    },
  });

  const handleUpload = async () => {
    if (!file) {
      setUploadError('Please select an Excel file to upload.');
      return; // Handle no file selected case
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Replace with your actual API route for handling student upload
      const response = await fetch('/api/upload-students', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error uploading students');
      }

      const uploadedStudents = await response.json();
      onUploadSuccess(uploadedStudents); // Call callback with uploaded data
      setFile(null); // Clear file selection
    } catch (error) {
      console.error('Error uploading students:', error);
      const formData = new FormData();
      formData.append('file', file);
    }
  };

  return (
    <div className="student-upload flex flex-col items-center space-y-4"> {/* Container with flexbox for layout */}
  <div {...getRootProps({ className: 'dropzone bg-gray-200 rounded-md p-4 text-center hover:bg-gray-300 transition duration-300' })}> {/* Dropzone area */}
    <input {...getInputProps()} />
    {file ? (
      <p className="text-green-500">Uploaded: {file.name}</p>
    ) : (
      <p className="text-gray-500">Drag & drop or click to select an Excel file with student data.</p>
    )}
  </div>
  <button onClick={handleUpload} disabled={!file} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
    Upload Students
  </button>
  {uploadError && <p className="error text-red-500">{uploadError}</p>}
</div>
  )
};

export default StudentUpload; 