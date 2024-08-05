"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Student } from '@/types/admin';

const StudentProfile: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const { rollno } = params;

  useEffect(() => {
    async function fetchStudentDetail() {
      try {
        const response = await fetch(`/api/students/${rollno}`);
        if (!response.ok) {
          throw new Error('Failed to fetch student details');
        }
        const data = await response.json();
        setStudent(data);
        setLoading(false);
      } catch (err) {
        setError('An error occurred while fetching student details');
        setLoading(false);
      }
    }

    fetchStudentDetail();
  }, [rollno]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!student) return <div>No student data found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex items-center p-6 bg-blue-600 text-white">
          <Image
            src="/default-profile.jpg" // Replace with actual image path
            alt={student.name}
            width={100}
            height={100}
            className="rounded-full mr-6"
          />
          <div>
            <h1 className="text-2xl font-bold">{student.name}</h1>
            <p>Roll No: {student.rollno}</p>
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Haryana State Board of Technical Education</h2>
          <h3 className="text-lg font-semibold mb-2">Result of December - 2023 Exam</h3>
          <table className="w-full mb-4">
            <tbody>
              <tr>
                <td className="font-semibold">Father Name:</td>
                <td>{student.fatherName}</td>
              </tr>
              <tr>
                <td className="font-semibold">Institute Name:</td>
                <td>{student.instituteName}</td>
              </tr>
              <tr>
                <td className="font-semibold">Branch Name:</td>
                <td>{student.branchName}</td>
              </tr>
            </tbody>
          </table>
          <h4 className="text-lg font-semibold mb-2">Exam Type - {student.semester}th SEMESTER Regular</h4>
          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Subject Name</th>
                <th className="border border-gray-300 p-2">Ext. Theory</th>
                <th className="border border-gray-300 p-2">Ext. Practical</th>
              </tr>
            </thead>
            <tbody>
              {student.subjects.map((subject, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">{subject.name}</td>
                  <td className="border border-gray-300 p-2 text-center">{subject.extTheory}/100</td>
                  <td className="border border-gray-300 p-2 text-center">
                    {subject.extPractical ? `${subject.extPractical}/50` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4">
            <Link href="/studentlist">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Back to Student List
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;