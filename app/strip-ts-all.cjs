const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      try {
        const result = babel.transformSync(content, {
          presets: [['@babel/preset-typescript']],
          plugins: ['@babel/plugin-syntax-jsx'],
          filename: fullPath,
          retainLines: true,
        });
        if (result && result.code) {
          fs.writeFileSync(fullPath, result.code, 'utf8');
          console.log('Stripped TS from', fullPath);
        }
      } catch (err) {
        console.error('Error in', fullPath, err.message);
      }
    }
  }
}

processDir(path.join(__dirname, 'src', 'modules', 'authenticated', 'preConfig'));
console.log('Done.');
