const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://yuklsrhmcbdanswxysrw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1a2xzcmhtY2JkYW5zd3h5c3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNTgwODQsImV4cCI6MjA5NjYzNDA4NH0.PEgzBsLD6Or7P32ao6LaKgSmf-SE1ay829eFQpkzhgE';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const BUCKET_NAME = 'hansoll-files';

async function listFiles() {
    try {
        const { data, error } = await supabase.storage.from(BUCKET_NAME).list('', {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
        });

        if (error) {
            console.error('Error fetching list:', error);
            return;
        }

        console.log('Files in Supabase:');
        data.forEach(file => {
            console.log(file.name);
        });
        console.log('Total files found in bucket:', data.length);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

listFiles();
