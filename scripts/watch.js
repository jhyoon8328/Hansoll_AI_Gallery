const fs = require('fs');
const path = require('path');

function copyFile(src, dest) {
    try {
        const destDir = path.dirname(dest);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        fs.copyFileSync(src, dest);
        console.log(`[Watcher] Copied updated file: ${src} -> ${dest}`);
    } catch(e) {
        console.error(`[Watcher] Error copying ${src}:`, e.message);
    }
}

// Watch root directory for HTML files
fs.watch('.', (eventType, filename) => {
    if (filename && filename.endsWith('.html') && !filename.startsWith('public')) {
        copyFile(filename, path.join('public', filename));
    }
});

// Watch Project files directory recursively
const projectFilesDir = 'Project files';
if (fs.existsSync(projectFilesDir)) {
    fs.watch(projectFilesDir, { recursive: true }, (eventType, filename) => {
        if (filename) {
            const src = path.join(projectFilesDir, filename);
            const dest = path.join('public', projectFilesDir, filename);
            
            // Debounce or just check if file exists (it could be a delete event)
            if (fs.existsSync(src)) {
                const stat = fs.statSync(src);
                if (stat.isFile()) {
                    copyFile(src, dest);
                }
            }
        }
    });
}

console.log('[Watcher] Started watching for file changes in real-time...');
