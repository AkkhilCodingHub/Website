import { Student } from '@/pages/types/admin';
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
    <div className="student-upload">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        {file ? (
          <p>Uploaded: {file.name}</p>
        ) : (
          <p>Drag & drop or click to select an Excel file with student data.</p>
        )}
      </div>
      <button onClick={handleUpload} disabled={!file}>
        Upload Students
      </button>
      {uploadError && <p className="error">{uploadError}</p>}
    </div>
  );
};

export default StudentUpload;
