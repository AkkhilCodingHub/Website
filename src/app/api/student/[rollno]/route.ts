import { NextResponse } from 'next/server';
import { connectToDb } from '@/utils/services/mongo';
import { StudentModel } from '@/types/admin';

export async function GET(request: Request, { params }: { params: { rollno: string } }) {
  const { rollno } = params;

  try {
    await connectToDb();
    const student = await StudentModel.findOne({ rollno }).lean();

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error('Error fetching student details:', error);
    return NextResponse.json({ error: 'An error occurred while fetching student details' }, { status: 500 });
  }
}