// Writes the entries as static JSON so the exported site can load them
// (API routes don't run on a static export).
import fs from 'fs';
import path from 'path';

// Newest first, by when the entry was added. Falls back through createdAt,
// capturedDate, then the millisecond timestamp in the id, so an entry with a
// missing or unparseable date never lands in the middle of the list.
function toTime(v) {
  if (v === undefined || v === null || v === '') return NaN;
  if (typeof v === 'number') return v;
  if (/^\d{10,}$/.test(String(v))) return Number(v);
  return new Date(v).getTime();
}
function addedAt(e) {
  for (const v of [e.createdAt, e.capturedDate]) {
    const t = toTime(v);
    if (Number.isFinite(t)) return t;
  }
  const m = /^entry_(\d{10,})/.exec(String(e.id));
  return m ? Number(m[1]) : 0;
}

const src = path.join(process.cwd(), 'data', 'entries');
const out = path.join(process.cwd(), 'public', 'data');
const outEntries = path.join(out, 'entries');
fs.mkdirSync(outEntries, { recursive: true });

const entries = fs
  .readdirSync(src)
  .filter((f) => f.endsWith('.json'))
  .map((f) => JSON.parse(fs.readFileSync(path.join(src, f), 'utf-8')))
  .sort((a, b) => addedAt(b) - addedAt(a) || String(b.id).localeCompare(String(a.id)));

fs.writeFileSync(path.join(out, 'entries.json'), JSON.stringify(entries));
for (const e of entries) {
  fs.writeFileSync(path.join(outEntries, `${e.id}.json`), JSON.stringify(e));
}
console.log(`Wrote ${entries.length} entries to public/data`);
