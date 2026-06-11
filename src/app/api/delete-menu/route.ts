import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, menuName } = body;

    if (!category || !menuName) {
      return NextResponse.json({ error: 'Category and MenuName are required' }, { status: 400, headers: corsHeaders });
    }

    const dirPath = path.join(process.cwd(), 'Project files', category, menuName);

    // Prevent directory traversal
    if (!dirPath.startsWith(process.cwd())) {
        return NextResponse.json({ error: 'Invalid path' }, { status: 403, headers: corsHeaders });
    }

    try {
      await fs.rm(dirPath, { recursive: true, force: true });
    } catch (e) {
      console.warn("Could not delete directory or it doesn't exist:", e);
      // We continue even if the directory didn't exist
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error in delete-menu route:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500, headers: corsHeaders });
  }
}
