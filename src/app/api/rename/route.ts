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
    const { category, oldName, newName, overwrite } = body;

    if (!category || !oldName || !newName) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400, headers: corsHeaders });
    }

    const oldDirPath = path.join(process.cwd(), 'Project files', category, oldName);
    const newDirPath = path.join(process.cwd(), 'Project files', category, newName);

    try {
      await fs.access(newDirPath);
      if (!overwrite) {
        return NextResponse.json({ error: 'ALREADY_EXISTS' }, { status: 409, headers: corsHeaders });
      }
    } catch (e) {
      // Does not exist, safe to rename normally below
    }

    let oldDirExists = true;
    try {
      await fs.access(oldDirPath);
    } catch (e) {
      oldDirExists = false;
    }

    if (!oldDirExists) {
      // If old dir doesn't exist, there's nothing to rename or merge.
      // If they requested overwrite, new dir already exists, so we are done.
      if (overwrite) {
        return NextResponse.json({ success: true }, { headers: corsHeaders });
      } else {
        return NextResponse.json({ error: 'OLD_DIR_NOT_FOUND' }, { status: 404, headers: corsHeaders });
      }
    }

    try {
      if (overwrite) {
        // If overwrite is true, the new directory already exists. 
        // We move files from old to new, then delete old.
        try {
          const files = await fs.readdir(oldDirPath);
          for (const file of files) {
            const oldFilePath = path.join(oldDirPath, file);
            const newFilePath = path.join(newDirPath, file);
            // Ignore if file already exists in new dir or overwrite it
            await fs.rename(oldFilePath, newFilePath).catch(() => {});
          }
          await fs.rm(oldDirPath, { recursive: true, force: true });
        } catch (mergeErr) {
          console.error("Merge error during overwrite:", mergeErr);
        }
      } else {
        await fs.rename(oldDirPath, newDirPath);
      }
    } catch (e) {
      return NextResponse.json({ error: 'RENAME_FAILED' }, { status: 500, headers: corsHeaders });
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error in rename route:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500, headers: corsHeaders });
  }
}
