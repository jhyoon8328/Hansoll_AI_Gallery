const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://yuklsrhmcbdanswxysrw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1a2xzcmhtY2JkYW5zd3h5c3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNTgwODQsImV4cCI6MjA5NjYzNDA4NH0.PEgzBsLD6Or7P32ao6LaKgSmf-SE1ay829eFQpkzhgE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const BUCKET_NAME = 'hansoll-files';

async function uploadFile(filePath, supabasePath) {
    try {
        const fileContent = fs.readFileSync(filePath);
        // Determine content type roughly based on extension
        let contentType = 'application/octet-stream';
        if (filePath.endsWith('.html')) contentType = 'text/html; charset=utf-8';
        if (filePath.endsWith('.py')) contentType = 'text/plain; charset=utf-8';
        if (filePath.endsWith('.txt')) contentType = 'text/plain; charset=utf-8';
        if (filePath.endsWith('.json')) contentType = 'application/json; charset=utf-8';

        // Supabase Storage strict regex does not allow Korean or spaces. 
        // We will encode the path using base64 (browser compatible way: btoa(encodeURIComponent))
        const encodedURIComponent = encodeURIComponent(supabasePath);
        const storageKey = Buffer.from(encodedURIComponent, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
        
        const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET_NAME}/${storageKey}`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': contentType,
                'x-upsert': 'true'
            },
            body: fileContent
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error(`[FAIL] ${supabasePath}:`, errText);
        } else {
            console.log(`[SUCCESS] Uploaded: ${supabasePath}`);
        }
    } catch (e) {
        console.error(`[ERROR] Failed to read/upload ${filePath}:`, e.message);
    }
}

async function uploadDirectory(dirPath, basePath = '') {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const relativePath = path.join(basePath, file);
        
        // Supabase uses forward slashes
        const supabasePath = relativePath.split(path.sep).join('/');

        if (fs.statSync(fullPath).isDirectory()) {
            await uploadDirectory(fullPath, relativePath);
        } else {
            await uploadFile(fullPath, supabasePath);
        }
    }
}

async function main() {
    const targetDir = path.join(__dirname, '..', 'Project files');
    console.log(`Starting bulk upload from: ${targetDir}`);
    
    if (!fs.existsSync(targetDir)) {
        console.error("Directory 'Project files' not found!");
        return;
    }

    await uploadDirectory(targetDir);
    console.log("Bulk upload process completed.");
}

main();
