import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get('filePath');

  if (!filePath) {
    return NextResponse.json({ error: 'filePath is required' }, { status: 400, headers: corsHeaders });
  }

  try {
    const absolutePath = path.join(process.cwd(), filePath);
    // Prevent directory traversal
    if (!absolutePath.startsWith(process.cwd())) {
        return NextResponse.json({ error: 'Invalid path' }, { status: 403, headers: corsHeaders });
    }

    const content = await fs.readFile(absolutePath, 'utf-8');
    return new NextResponse(content, { headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' } });
  } catch (error) {
    return NextResponse.json({ error: 'File not found or unreadable' }, { status: 404, headers: corsHeaders });
  }
}
