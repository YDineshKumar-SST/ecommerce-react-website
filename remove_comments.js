import fs from 'fs';
import path from 'path';
import strip from 'strip-comments';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx') || filePath.endsWith('.css')) {
    const content = fs.readFileSync(filePath, 'utf8');
    let stripped;
    try {
      if (filePath.endsWith('.css')) {
        // Strip only block comments for CSS
        stripped = strip.block(content);
      } else {
        // Strip all comments for JS/JSX
        stripped = strip(content);
        // Sometimes React JSX comments inside tags aren't perfectly stripped if they are `{/* ... */}`
        // Let's do a regex replacement for JSX comments just to be super sure
        stripped = stripped.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
      }
      
      // Also it's good to remove multiple empty lines left behind
      // Not perfect but helps
      
      if (content !== stripped) {
        fs.writeFileSync(filePath, stripped, 'utf-8');
        console.log(`Stripped comments from: ${filePath}`);
      }
    } catch (e) {
      console.error(`Error processing ${filePath}: ${e.message}`);
    }
  }
});
