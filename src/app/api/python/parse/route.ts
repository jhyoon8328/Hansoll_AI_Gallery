import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import os from 'os';

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `upload_${Date.now()}_${file.name}`);
    
    fs.writeFileSync(tempFilePath, buffer);

    const scriptPath = path.resolve('Project files', '사업 3부', 'CMPH Recap Tool', 'CMPH_Recap_Tool.py');
    const { stdout, stderr } = await execAsync(`python "${scriptPath}" --parse "${tempFilePath}"`);

    // Clean up
    if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

    try {
      const parsedData = JSON.parse(stdout);
      if (parsedData.error) throw new Error(parsedData.error);
      return NextResponse.json(parsedData);
    } catch (e: any) {
      console.error("Python output:", stdout);
      console.error("Python stderr:", stderr);
      return NextResponse.json({ error: e.message || 'Parse failed' }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
