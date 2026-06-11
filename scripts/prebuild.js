const fs = require('fs');
const path = require('path');

// Ensure public directory exists
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// Copy all .html files from root to public
const files = fs.readdirSync('.');
for (const file of files) {
  if (file.endsWith('.html')) {
    console.log(`Copying ${file} to public/${file}`);
    fs.copyFileSync(file, path.join('public', file));
  }
}

// Copy directories
const dirsToCopy = ['imgFile', 'Project files'];
for (const dir of dirsToCopy) {
  if (fs.existsSync(dir)) {
    console.log(`Copying directory ${dir} to public/${dir}`);
    fs.cpSync(dir, path.join('public', dir), { recursive: true });
  }
}

console.log('Prebuild copy complete!');
