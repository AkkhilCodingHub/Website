"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { Student } from '@/types/admin';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const StudentListContent: React.FC = () => {
  const searchParams = useSearchParams();
  const branch = searchParams?.get('branch') ?? '';
  const semester = searchParams?.get('semester') ?? '';

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudents() {
      if (!branch || !semester) {
        setError('Branch and semester are required');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/students?branch=${encodeURIComponent(branch)}&semester=${encodeURIComponent(semester)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch students');
        }
        const data = await response.json();
        setStudents(data);
      } catch (err) {
        setError('An error occurred while fetching students');
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, [branch, semester]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">
        Student List - {branch || 'Unknown Branch'} (Semester {semester || 'Unknown'})
      </h1>
      {students.length === 0 ? (
        <p>No students found for this branch and semester.</p>
      ) : (
        <ul className="space-y-2">
          {students.map((student) => (
            <li
              key={student.rollno}
              className="flex items-center justify-between bg-white shadow rounded-lg p-4"
            >
              <div>
                <Link href={`/studentlist/${encodeURIComponent(student.rollno)}`}>
                  <span className="text-blue-600 hover:underline">{student.name}</span>
                </Link>
                <span className="ml-4 text-gray-600">Roll No: {student.rollno}</span>
              </div>
              <span className="text-gray-600">Semester: {student.semester}</span>
            </li>
          ))}
        </ul>
      )}
      <Link href="/">
        <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Back to Home
        </button>
      </Link>
    </div>
  );
};

const StudentList: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StudentListContent />
    </Suspense>
  );
};

export default StudentList;