import fs from 'fs';
import path from 'path';

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.name.endsWith('.js') || entry.name.endsWith('.mjs')) {
      const content = fs.readFileSync(full, 'utf8');
      if (content.includes('.use(') || content.includes('React.use') || content.includes('react.use')) {
        console.log('Found in:', full);
      }
    }
  }
}

walk('node_modules/@animate-ui/react');
