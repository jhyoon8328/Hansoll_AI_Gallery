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
    const formData = await request.formData();
    const category = formData.get('category') as string;
    const isNewCategory = formData.get('isNewCategory') === 'true';
    const menuName = formData.get('menuName') as string;
    const file = formData.get('file') as File | null;

    const allowOverwrite = formData.get('overwrite') === 'true';

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400, headers: corsHeaders });
    }

    let projectFilesDir = path.join(process.cwd(), 'Project files', category);
    if (menuName) {
      projectFilesDir = path.join(projectFilesDir, menuName);
    }

    // Create directory if it doesn't exist
    await fs.mkdir(projectFilesDir, { recursive: true });

    if (file && file.size > 0) {
      const filePath = path.join(projectFilesDir, file.name);
      
      try {
        await fs.access(filePath);
        // If no error, file exists
        if (!allowOverwrite) {
          return NextResponse.json({ error: 'FILE_EXISTS' }, { status: 409, headers: corsHeaders });
        }
      } catch (e) {
        // File does not exist, proceed
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      await fs.writeFile(filePath, buffer);

      // Save to public directory as well for immediate access in dev server
      let publicFilesDir = path.join(process.cwd(), 'public', 'Project files', category);
      if (menuName) {
        publicFilesDir = path.join(publicFilesDir, menuName);
      }
      await fs.mkdir(publicFilesDir, { recursive: true });
      const publicFilePath = path.join(publicFilesDir, file.name);
      await fs.writeFile(publicFilePath, buffer);

      // Upload to Supabase Storage
      try {
        const { createClient } = require('@supabase/supabase-js');
        const SUPABASE_URL = 'https://yuklsrhmcbdanswxysrw.supabase.co';
        // Using anon key, as storage allows public uploads or we have policy. In adminPage, anon key was used.
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1a2xzcmhtY2JkYW5zd3h5c3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNTgwODQsImV4cCI6MjA5NjYzNDA4NH0.PEgzBsLD6Or7P32ao6LaKgSmf-SE1ay829eFQpkzhgE';
        const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        let supabasePath = `${category}/${file.name}`;
        if (menuName) {
            supabasePath = `${category}/${menuName}/${file.name}`;
        }
        
        // Supabase strict regex workaround for Korean: Base64 URL safe encoding
        const encodedURIComponent = encodeURIComponent(supabasePath);
        const storageKey = Buffer.from(encodedURIComponent, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        
        let contentType = 'application/octet-stream';
        if (file.name.endsWith('.html')) contentType = 'text/html; charset=utf-8';
        if (file.name.endsWith('.py')) contentType = 'text/plain; charset=utf-8';
        if (file.name.endsWith('.txt')) contentType = 'text/plain; charset=utf-8';
        if (file.name.endsWith('.json')) contentType = 'application/json; charset=utf-8';

        const { data, error } = await supabase.storage
          .from('hansoll-files')
          .upload(storageKey, buffer, {
            contentType: contentType,
            upsert: true
          });
        if (error) {
           console.error("Supabase upload error:", error);
        }
      } catch (sbErr) {
        console.error("Supabase exception:", sbErr);
      }
    }

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error in upload route:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500, headers: corsHeaders });
  }
}
