import fs from 'fs';
import path from 'path';

const file = 'node_modules/@animate-ui/react/dist/utils/motion.js';
if (fs.existsSync(file)) {
  const code = fs.readFileSync(file, 'utf8');
  console.log('Searching in motion.js for "React.use" or ".use("');
  const lines = code.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('.use(') || l.includes('use(')) {
      console.log(`Line ${i}:`, l.slice(0, 120));
    }
  });
}
