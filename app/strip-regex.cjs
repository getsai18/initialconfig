const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Strip interfaces
      content = content.replace(/interface\s+\w+\s*\{[^}]+\}/g, '');
      
      // Strip Record types
      content = content.replace(/:\s*Record<[^>]+>/g, '');
      
      // Strip generic types
      content = content.replace(/<string\[\]>|<any\[\]>|<number\[\]>/g, '');
      
      // Strip basic types in function params or variable declarations
      content = content.replace(/:\s*(any\[\]|string\[\]|number\[\]|boolean\[\]|any|string|number|boolean|FileList|(()\s*=>\s*void)|(([\w]+:\s*\w+)\s*=>\s*\w+))/g, '');

      // Strip non-null assertion before commas, closing parens, etc.
      // E.g. clienteActivoId! -> clienteActivoId
      content = content.replace(/(\w+)!([,)\s;])/g, '$1$2');

      fs.writeFileSync(fullPath, content, 'utf8');
      console.log('Processed', fullPath);
    }
  }
}

processDir(path.join(__dirname, 'src', 'modules', 'authenticated', 'preConfig'));
console.log('Regex strip done.');
