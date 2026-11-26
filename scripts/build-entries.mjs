// Writes the entries as static JSON so the exported site can load them
// (API routes don't run on a static export).
import fs from 'fs';
import path from 'path';

const src = path.join(process.cwd(), 'data', 'entries');
const out = path.join(process.cwd(), 'public', 'data');
const outEntries = path.join(out, 'entries');
fs.mkdirSync(outEntries, { recursive: true });

const entries = fs
  .readdirSync(src)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(src, f), 'utf-8')))
  .sort((a, b) => new Date(b.capturedDate).getTime() - new Date(a.capturedDate).getTime());

fs.writeFileSync(path.join(out, 'entries.json'), JSON.stringify(entries));
for (const e of entries) {
  fs.writeFileSync(path.join(outEntries, `${e.id}.json`), JSON.stringify(e));
}
console.log(`Wrote ${entries.length} entries to public/data`);
