import { NextRequest, NextResponse } from 'next/server';
import { connectToDb } from '@/utils/services/mongo';
import { StudentModel, BranchModel, SemesterModel, ExcelRowData } from '@/types/admin';
import multer from 'multer';
import * as ExcelJS from 'exceljs';

const upload = multer({ storage: multer.memoryStorage() });

// New way to configure the route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const data = await new Promise<ExcelRowData[]>((resolve, reject) => {
      const middleware = upload.single('file');
      middleware(req as any, {} as any, async (err: any) => {
        if (err) reject(err);
        const file = (req as any).file;
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(file.buffer);
        const worksheet = workbook.getWorksheet(1);
        if (!worksheet) {
          reject(new Error('Worksheet not found'));
          return;
        }
        const jsonData: ExcelRowData[] = [];
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          if (rowNumber > 1) { // Skip header row
            const rowData: ExcelRowData = {
              name: row.getCell(1).value?.toString() || '',
              rollno: row.getCell(2).value?.toString() || '',
              branch: row.getCell(3).value?.toString() || '',
              semester: row.getCell(4).value?.toString() || '',
              fatherName: row.getCell(5).value?.toString() || '',
              instituteName: row.getCell(6).value?.toString() || '',
              subjects: row.getCell(7).value?.toString() || '[]',
              sessional: row.getCell(8).value?.toString() || '',
              grandTotal: row.getCell(9).value?.toString() || '',
            };
            jsonData.push(rowData);
          }
        });
        resolve(jsonData);
      });
    });

    await connectToDb();

    // Fetch all branches and semesters
    const branches = await BranchModel.find().lean();
    const semesters = await SemesterModel.find().lean();

    // Create a map for quick lookup
    const branchMap = new Map(branches.map(b => [b.value, b]));
    const semesterMap = new Map(semesters.map(s => [s.value, s]));

    const studentsToInsert = data.map((row: ExcelRowData) => ({
      name: row.name,
      rollno: row.rollno,
      branch: row.branch,
      semester: parseInt(row.semester),
      fatherName: row.fatherName,
      instituteName: row.instituteName,
      branchName: branchMap.get(row.branch)?.label || row.branch,
      subjects: JSON.parse(row.subjects).map((subject: any) => ({
        name: subject.name,
        extTheory: parseInt(subject.extTheory),
        extPractical: subject.extPractical ? parseInt(subject.extPractical) : undefined,
      })),
      sessional: parseInt(row.sessional),
      grandTotal: parseInt(row.grandTotal),
    }));

    await StudentModel.insertMany(studentsToInsert);

    return NextResponse.json({ message: 'Data uploaded successfully' });
  } catch (error) {
    console.error('Error uploading data:', error);
    return NextResponse.json({ error: 'An error occurred while uploading the data' }, { status: 500 });
  }
}