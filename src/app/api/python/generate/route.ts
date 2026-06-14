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
    const excelFile = formData.get('excel') as File;
    const pdfFiles = formData.getAll('pdf') as File[];
    
    if (!excelFile || pdfFiles.length === 0) {
      return NextResponse.json({ error: 'Missing files' }, { status: 400 });
    }

    const tempDir = os.tmpdir();
    
    // Save excel
    const excelBuffer = Buffer.from(await excelFile.arrayBuffer());
    const tempExcelPath = path.join(tempDir, `excel_${Date.now()}_${excelFile.name}`);
    fs.writeFileSync(tempExcelPath, excelBuffer);

    // Save pdfs
    const tempPdfPaths: string[] = [];
    for (const pdfFile of pdfFiles) {
      const buffer = Buffer.from(await pdfFile.arrayBuffer());
      const tempPdfPath = path.join(tempDir, `pdf_${Date.now()}_${pdfFile.name}`);
      fs.writeFileSync(tempPdfPath, buffer);
      tempPdfPaths.push(tempPdfPath);
    }

    const outExcelPath = path.join(tempDir, `out_${Date.now()}_${excelFile.name}`);

    const form = {
      style: formData.get('style') || '',
      name: formData.get('name') || '',
      fabric: formData.get('fabric') || '',
      season: formData.get('season') || '',
      category: formData.get('category') || '',
      assign: formData.get('assign') || '',
      cmph_k: formData.get('cmph_k') || '',
      cmph_l: formData.get('cmph_l') || '',
      cmph_m: formData.get('cmph_m') || '',
      sub_enabled: formData.get('sub_enabled') === 'true',
      sub_qty: formData.get('sub_qty') || '',
      sub_cmph: formData.get('sub_cmph') || '',
      sub_l: formData.get('sub_l') || '',
    };

    const scriptPath = path.resolve('Project files', '사업 3부', 'CMPH Recap Tool', 'CMPH_Recap_Tool.py');
    
    let pdfArgs = tempPdfPaths.map(p => `"--pdf" "${p}"`).join(' ');
    // Use stringify and escape quotes for CLI
    const formJson = JSON.stringify(form).replace(/"/g, '\\"');
    
    const command = `python "${scriptPath}" --generate --excel "${tempExcelPath}" --out "${outExcelPath}" --form "${formJson}" ${pdfArgs}`;
    
    const { stdout, stderr } = await execAsync(command);

    // Clean up inputs
    if (fs.existsSync(tempExcelPath)) fs.unlinkSync(tempExcelPath);
    for (const p of tempPdfPaths) {
      if (fs.existsSync(p)) fs.unlinkSync(p);
    }

    try {
      // Look for the last line which should be JSON
      const lines = stdout.trim().split('\n');
      const lastLine = lines[lines.length - 1];
      const result = JSON.parse(lastLine);
      if (result.error) throw new Error(result.error);
      
      if (result.success && fs.existsSync(outExcelPath)) {
        const fileBuffer = fs.readFileSync(outExcelPath);
        fs.unlinkSync(outExcelPath); // Clean up output
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Disposition': `attachment; filename="${excelFile.name.replace('.xlsx', '_updated.xlsx')}"`,
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          },
        });
      } else {
        throw new Error('No output file generated');
      }
    } catch (e: any) {
      console.error("Python output:", stdout);
      console.error("Python stderr:", stderr);
      return NextResponse.json({ error: e.message || 'Generate failed' }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
