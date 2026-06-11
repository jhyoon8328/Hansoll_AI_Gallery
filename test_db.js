const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://yuklsrhmcbdanswxysrw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1a2xzcmhtY2JkYW5zd3h5c3J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwNTgwODQsImV4cCI6MjA5NjYzNDA4NH0.PEgzBsLD6Or7P32ao6LaKgSmf-SE1ay829eFQpkzhgE');

async function run() {
  const { data, error } = await supabase.from('MenuSetting').select('*');
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}
run();
