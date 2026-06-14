const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://yuklsrhmcbdanswxysrw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1a2xzcmhtY2JkYW5zd3h5c3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNTgwODQsImV4cCI6MjA5NjYzNDA4NH0.PEgzBsLD6Or7P32ao6LaKgSmf-SE1ay829eFQpkzhgE';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function sync() {
    console.log("Starting sync...");
    
    const bucket = 'hansoll-files';
    const pyPath = path.join(__dirname, 'Project files/사업 3부/CMPH Recap Tool/CMPH_Recap_Tool_Backup.py');
    const batPath = path.join(__dirname, 'Project files/사업 3부/CMPH Recap Tool/CMPH_실행_Backup.bat');

    function getStorageKey(filePath) {
        const encoded = encodeURIComponent(filePath);
        return Buffer.from(encoded, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    if (fs.existsSync(pyPath)) {
        const pyBuffer = fs.readFileSync(pyPath);
        const key = getStorageKey('사업 3부/CMPH Recap Tool/CMPH_Recap_Tool_Backup.py');
        const { data, error } = await supabase.storage.from(bucket).upload(key, pyBuffer, { upsert: true, contentType: 'text/plain; charset=utf-8' });
        if (error) console.error("PY Upload error:", error);
        else console.log("PY Upload success:", data);
    }
    
    if (fs.existsSync(batPath)) {
        const batBuffer = fs.readFileSync(batPath);
        const key = getStorageKey('사업 3부/CMPH Recap Tool/CMPH_실행_Backup.bat');
        const { data, error } = await supabase.storage.from(bucket).upload(key, batBuffer, { upsert: true, contentType: 'application/octet-stream' });
        if (error) console.error("BAT Upload error:", error);
        else console.log("BAT Upload success:", data);
    }

    const menuData = {
        MenuId: "CMPH recap 작성 (Backup)",
        menu_path: "Project files/사업 3부/CMPH Recap Tool/CMPH_Recap_Tool_Backup.py",
        menu_name: "CMPH recap 작성 (Backup)",
        menu_type: "파이썬 스크립트",
        file_path: "CMPH_Recap_Tool_Backup.py",
        url_address: "",
        YN_use: true,
        menu_meta: {
            description: "테크팩 PDF에서 데이터를 추출하여 리캡 엑셀 자동 작성 (백업)",
            folderName: "CMPH Recap Tool",
            parentCategory: "사업 3부"
        }
    };
    
    const { data: dbData, error: dbError } = await supabase.from('MenuSetting').upsert(menuData, { onConflict: 'MenuId' });
    if (dbError) console.error("DB Upsert error:", dbError);
    else console.log("DB Upsert success");
}

sync();
