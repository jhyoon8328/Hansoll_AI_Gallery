const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://yuklsrhmcbdanswxysrw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1a2xzcmhtY2JkYW5zd3h5c3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNTgwODQsImV4cCI6MjA5NjYzNDA4NH0.PEgzBsLD6Or7P32ao6LaKgSmf-SE1ay829eFQpkzhgE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  console.log("Fetching existing MenuSetting...");
  const { data: rows, error } = await supabase.from('MenuSetting').select('*');
  if (error) {
    console.error("Fetch error:", error);
    return;
  }

  const updatedRecords = [];

  for (const row of rows) {
    let newRecord = { ...row };
    newRecord.menu_meta = row.menu_meta || {};

    if (row.menu_type === 'category' || row.menu_type === '카테고리') {
      newRecord.menu_type = '카테고리';
      newRecord.menu_path = '';
      newRecord.url_address = '';
    } else {
      // Subitem migration
      const parentCategory = row.menu_meta.parentCategory || row.menu_path; // fall back to old menu_path if already migrated
      newRecord.menu_meta.parentCategory = parentCategory;
      
      const fileName = row.file_path;
      const folderName = row.menu_meta.folderName || row.menu_name;
      
      let typeText = "정보 없음";
      let url = null;
      
      if (fileName) {
        newRecord.menu_path = `Project files/${parentCategory}/${folderName}/${fileName}`;
        
        if (fileName.endsWith('.txt')) {
          typeText = "URL 링크";
          // Try to read file to extract URL
          try {
            const filePath = path.join(__dirname, 'Project files', parentCategory, folderName, fileName);
            if (fs.existsSync(filePath)) {
              const text = fs.readFileSync(filePath, 'utf8');
              url = text.split('\n')[0].trim();
            }
          } catch(e) {
            console.error(`Failed to read URL from ${fileName}:`, e.message);
          }
        } else if (fileName.endsWith('.html')) {
          typeText = "HTML 웹페이지";
        } else if (fileName.endsWith('.py')) {
          typeText = "파이썬 스크립트";
        } else {
          typeText = "실행 파일 (" + fileName.split('.').pop() + ")";
        }
      } else {
        newRecord.menu_path = '';
      }
      
      newRecord.menu_type = typeText;
      newRecord.url_address = url || '';
    }
    
    updatedRecords.push(newRecord);
  }

  console.log(`Migrating ${updatedRecords.length} records...`);

  // Upsert all records back
  const { error: upsertError } = await supabase.from('MenuSetting').upsert(updatedRecords, { onConflict: 'MenuId' });
  if (upsertError) {
    console.error("Upsert failed:", upsertError);
  } else {
    console.log("Migration complete!");
  }
}

run();
