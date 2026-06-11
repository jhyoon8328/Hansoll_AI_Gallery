import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { oldName, newName } = body;

    if (!oldName || !newName) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400, headers: corsHeaders });
    }

    const oldDirPath = path.join(process.cwd(), 'Project files', oldName);
    const newDirPath = path.join(process.cwd(), 'Project files', newName);

    try {
      // Check if new directory already exists
      await fs.access(newDirPath);
      return NextResponse.json({ error: 'ALREADY_EXISTS' }, { status: 409, headers: corsHeaders });
    } catch (e) {
      // Does not exist, safe to rename
    }

    try {
      await fs.access(oldDirPath);
      await fs.rename(oldDirPath, newDirPath);
    } catch (e) {
      return NextResponse.json({ error: 'OLD_DIR_NOT_FOUND' }, { status: 404, headers: corsHeaders });
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error in rename-cat route:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500, headers: corsHeaders });
  }
}
