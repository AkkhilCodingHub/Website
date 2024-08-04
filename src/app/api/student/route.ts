import { NextResponse } from 'next/server';
import { connectToDb } from '@/utils/services/mongo';
import { StudentModel } from '@/types/admin';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const branch = searchParams.get('branch');
  const semester = searchParams.get('semester');

  if (!branch || !semester) {
    return NextResponse.json({ error: 'Branch and semester are required' }, { status: 400 });
  }

  try {
    await connectToDb();
    const students = await StudentModel.find({ branch, semester: parseInt(semester) })
      .select('name rollno semester')
      .sort('rollno')
      .lean();

    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'An error occurred while fetching students' }, { status: 500 });
  }
}