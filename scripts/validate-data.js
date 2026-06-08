// Validates src/data/sections.ts
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sectionsPath = path.join(__dirname, '..', 'src', 'data', 'sections.ts');

if (!fs.existsSync(sectionsPath)) {
  console.error('Error: src/data/sections.ts not found');
  process.exit(1);
}

const src = fs.readFileSync(sectionsPath, 'utf-8').replace(/\r/g, '');

const sectionBlocks = [];
const blockRe = /\{\s*id:\s*'([^']+)'[\s\S]*?\n  \},\n/g;
let m;
while ((m = blockRe.exec(src)) !== null) {
  sectionBlocks.push({ id: m[1], block: m[0] });
}

const expected = ['basics', 'types', 'making', 'hagoromo', 'whiteboard', 'geology', 'sports', 'health'];
const ids = sectionBlocks.map((b) => b.id);

const missing = expected.filter((e) => !ids.includes(e));
if (missing.length) {
  console.error(`Error: missing required section ids: ${missing.join(', ')}`);
  process.exit(1);
}

const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
if (dupes.length) {
  console.error(`Error: duplicate section ids: ${dupes.join(', ')}`);
  process.exit(1);
}

const errors = [];
for (const { id, block } of sectionBlocks) {
  if (/lead:\s*'\s*（準備中）\s*'/.test(block)) errors.push(`[${id}] lead is still "（準備中）"`);
  if (/toc:\s*\[\s*\]/.test(block)) errors.push(`[${id}] toc is empty`);
  const contentMatch = block.match(/content:\s*`([\s\S]*?)`,\s*updatedAt/);
  if (contentMatch) {
    const contentLen = contentMatch[1].length;
    if (contentLen < 1000) errors.push(`[${id}] content is too short (${contentLen} chars, minimum 1000)`);
  }
  const tocMatch = block.match(/toc:\s*\[([\s\S]*?)\],\s*content:/);
  if (tocMatch && contentMatch) {
    const tocItems = [...tocMatch[1].matchAll(/'([^']+)'/g)].length;
    const h2Items = (contentMatch[1].match(/^## /gm) || []).length;
    if (tocItems !== h2Items) {
      errors.push(`[${id}] TOC has ${tocItems} items but content has ${h2Items} h2 headings`);
    }
  }
}

if (errors.length) {
  console.error('Validation errors:');
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}

console.log(`✓ validate-data: ${ids.length} sections (${ids.join(', ')})`);
