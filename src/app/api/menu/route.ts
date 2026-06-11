import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import fs from 'fs/promises';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), '.data', 'menuData.json');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET() {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return NextResponse.json(JSON.parse(data), { headers: corsHeaders });
  } catch (error) {
    console.error('Error reading menu data:', error);
    return NextResponse.json({ error: 'Failed to read menu data' }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const newMenuData = await request.json();
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(newMenuData, null, 2), 'utf-8');
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error saving menu data:', error);
    return NextResponse.json({ error: 'Failed to save menu data' }, { status: 500, headers: corsHeaders });
  }
}
