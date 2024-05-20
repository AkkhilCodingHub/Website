"use client";
import { Student } from '../../types/admin';
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone'; // Assuming you're using react-dropzone
import axios from 'axios';
interface StudentUploadProps {
  onUploadSuccess: (students: Student[]) => void; // Callback for successful upload
}

const StudentUpload: React.FC<StudentUploadProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true); // Start loading
    try {
      const formData = new FormData();
      formData.append('file', file);

      // Check if the server supports the POST method for this endpoint
      const options = {
        method: 'OPTIONS',
        url: '/api/upload-student',
      };
      const preflightResponse = await axios(options);

      if (preflightResponse.status === 204 || preflightResponse.status === 200) { // 204 No Content or 200 OK means allowed
        const response = await axios.post('/api/upload-student', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.status === 200) {
          const uploadedStudents = response.data;
          onUploadSuccess(uploadedStudents);
          setFile(null); // Reset file after successful upload
        } else {
          const errorText = response.statusText; // Get error message from server if possible
          throw new Error(errorText || 'Error uploading students');
        }
      } else {
        throw new Error('POST method not allowed for this endpoint');
      }
    } catch (error: any) {
      console.error('Error uploading students:', error);
      setUploadError(error.message || 'Failed to upload');
    } finally {
      setIsLoading(false); // End loading
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
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <button onClick={handleUpload} disabled={!file || isLoading} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
          Upload Students
        </button>
      )}
      {uploadError && <p className="error text-red-500">{uploadError}</p>}
    </div>
  );
};

export default StudentUpload;
