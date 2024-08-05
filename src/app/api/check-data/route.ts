import { NextResponse } from 'next/server';
import { connectToDb } from '@/utils/services/mongo';
import { StudentModel } from '@/types/admin';

export async function GET() {
  try {
    await connectToDb();
    const count = await StudentModel.countDocuments();
    return NextResponse.json({ hasData: count > 0 });
  } catch (error) {
    console.error('Error checking data:', error);
    return NextResponse.json({ error: 'An error occurred while checking data' }, { status: 500 });
  }
}
