import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1f3a2e"/>
      <stop offset="100%" stop-color="#16291f"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="12" height="630" fill="#f4c64a"/>

  <g transform="translate(880, 150) rotate(20 120 165)">
    <rect x="60" y="20" width="60" height="300" rx="14" fill="#fdfdfb"/>
    <rect x="60" y="20" width="60" height="44" rx="14" fill="#f4c64a"/>
  </g>
  <circle cx="980" cy="500" r="6" fill="#fdfdfb" opacity="0.6"/>
  <circle cx="940" cy="470" r="4" fill="#fdfdfb" opacity="0.5"/>
  <circle cx="1010" cy="460" r="3" fill="#fdfdfb" opacity="0.5"/>

  <text x="80" y="210" font-family="'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic',Meiryo,sans-serif" font-size="92" font-weight="700" fill="#fdfdfb">チョークラボ</text>
  <text x="80" y="285" font-family="'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic',Meiryo,sans-serif" font-size="34" font-weight="600" fill="#f4c64a">チョークの科学・歴史・トリビアを楽しく学ぶ</text>

  <text x="80" y="385" font-family="'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic',Meiryo,sans-serif" font-size="24" fill="#cbd5cc">黒板のチョークから羽衣チョーク、白亜（地質）まで</text>
  <text x="80" y="420" font-family="'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic',Meiryo,sans-serif" font-size="24" fill="#cbd5cc">クイズとバッジ集めで遊びながら学べる解説サイト</text>

  <line x1="80" y1="505" x2="700" y2="505" stroke="#3c5a49" stroke-width="2"/>
  <text x="80" y="555" font-family="'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic',Meiryo,sans-serif" font-size="22" fill="#f4c64a" font-weight="600">study-apps.com/chalk-lab/</text>
</svg>`;

async function main() {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  const outPath = path.join(PUBLIC_DIR, 'ogp.png');
  await sharp(Buffer.from(svg)).png().toFile(outPath);
  console.log(`✓ Generated ogp.png (1200x630) at ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
