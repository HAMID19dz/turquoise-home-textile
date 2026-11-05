import fs from 'fs';
import path from 'path';

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  const text = await res.text();
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, text, 'utf8');
  console.log('Saved ' + dest + ' (' + text.length + ' bytes)');
}

async function main() {
  await download('https://raw.githubusercontent.com/sickn33/antigravity-awesome-skills/main/skills/3d-web-experience/SKILL.md', '.agent/skills/3d-web-experience/SKILL.md');
  await download('https://raw.githubusercontent.com/sickn33/antigravity-awesome-skills/main/skills/threejs-loaders/SKILL.md', '.agent/skills/threejs-loaders/SKILL.md');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
