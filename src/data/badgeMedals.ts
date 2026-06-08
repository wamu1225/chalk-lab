// 達成バッジの内製SVGメダル（絵文字の代替）。
// メダル枠（ティア色の円）＋白いグリフ。未獲得は灰色＋錠前。

const TIER: Record<string, string> = {
  read: '#3a9d5d',     // よみもの系（緑）
  quiz: '#e0a82e',     // 検定系（金）
  dex: '#5b8def',      // 図鑑系（青）
  special: '#9b6bd6',  // 特別（紫）
  daily: '#e07b39',    // 継続系（オレンジ）
};

const GLYPHS: Record<string, string> = {
  book: `<g fill="none" stroke="#fff" stroke-width="2.6" stroke-linejoin="round"><path d="M32 27 q-5 -3 -10 -2 v14 q5 -1 10 2 Z"/><path d="M32 27 q5 -3 10 -2 v14 q-5 -1 -10 2 Z"/></g>`,
  books: `<g fill="#fff"><rect x="21" y="37" width="22" height="6" rx="1.5"/><rect x="23" y="30" width="18" height="6" rx="1.5" opacity="0.85"/><rect x="25" y="23" width="14" height="6" rx="1.5" opacity="0.7"/></g>`,
  mortarboard: `<path d="M32 23 L46 29 L32 35 L18 29 Z" fill="#fff"/><path d="M24 32 v6 q8 5 16 0 v-6" fill="none" stroke="#fff" stroke-width="2.4"/><line x1="45" y1="29" x2="45" y2="40" stroke="#fff" stroke-width="2" stroke-linecap="round"/><circle cx="45" cy="41" r="1.8" fill="#fff"/>`,
  pencil: `<g transform="rotate(45 32 32)"><rect x="29" y="19" width="6" height="20" rx="1" fill="#fff"/><path d="M29 39 L32 45 L35 39 Z" fill="#fff"/><rect x="29" y="19" width="6" height="4" fill="rgba(0,0,0,0.25)"/></g>`,
  check: `<path d="M23 32 l6 7 l13 -14" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  crown: `<path d="M22 41 L19 26 L27 33 L32 23 L37 33 L45 26 L42 41 Z" fill="#fff"/><rect x="22" y="41" width="20" height="3.2" fill="#fff"/>`,
  card: `<rect x="25" y="21" width="14" height="20" rx="2.5" fill="#fff"/><path d="M28 26 h8 M28 30 h6" stroke="#1f3a2e" stroke-width="1.6" stroke-linecap="round"/>`,
  cards: `<rect x="20" y="23" width="14" height="19" rx="2.5" fill="#fff" opacity="0.8" transform="rotate(-10 27 32)"/><rect x="30" y="22" width="14" height="19" rx="2.5" fill="#fff" transform="rotate(10 37 32)"/>`,
  trophy: `<g fill="#fff"><path d="M26 22 h12 v6 a6 6 0 0 1 -12 0 Z"/><rect x="30" y="33" width="4" height="5"/><rect x="25" y="38" width="14" height="3.4" rx="1"/></g><path d="M26 23 q-5 0 -5 4 q0 3 4 4" fill="none" stroke="#fff" stroke-width="2"/><path d="M38 23 q5 0 5 4 q0 3 -4 4" fill="none" stroke="#fff" stroke-width="2"/>`,
  gem: `<path d="M24 27 h16 l4 5 l-12 12 l-12 -12 Z" fill="#fff"/><g stroke="rgba(0,0,0,0.22)" stroke-width="1.4" fill="none"><path d="M24 27 l4 5 h8 l4 -5 M28 32 l4 12 M36 32 l-4 12"/></g>`,
  star: `<path d="M32 21 l3.2 7 7.8 0.6 -6 5.1 1.9 7.6 -6.9 -4.1 -6.9 4.1 1.9 -7.6 -6 -5.1 7.8 -0.6 Z" fill="#fff"/>`,
  starburst: `<path d="M32 20 l2.2 7.5 7.5 -2.2 -5.3 5.7 5.3 5.7 -7.5 -2.2 -2.2 7.5 -2.2 -7.5 -7.5 2.2 5.3 -5.7 -5.3 -5.7 7.5 2.2 Z" fill="#fff"/>`,
  lock: `<rect x="24" y="31" width="16" height="13" rx="2.5" fill="#9aa0a6"/><path d="M27 31 v-4 a5 5 0 0 1 10 0 v4" fill="none" stroke="#9aa0a6" stroke-width="3"/><circle cx="32" cy="37" r="1.8" fill="#1f3a2e"/>`,
  calendar: `<rect x="20" y="22" width="24" height="20" rx="2.5" fill="none" stroke="#fff" stroke-width="2.6"/><line x1="20" y1="28" x2="44" y2="28" stroke="#fff" stroke-width="2.6"/><line x1="26" y1="19" x2="26" y2="24" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><line x1="38" y1="19" x2="38" y2="24" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M27 35 l3.4 3.4 l6 -6.4" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  flame: `<path d="M32 17 C40 25 38 33 34 37 C39 37 40 30 40 30 C44 36 42 46 32 46 C22 46 21 37 25 32 C25 35 27 37 29 37 C26 33 27 24 32 17 Z" fill="#fff"/>`,
};

type MedalDef = { tier: keyof typeof TIER; glyph: string };

export const MEDAL: Record<string, MedalDef> = {
  'first-read': { tier: 'read', glyph: 'book' },
  'half-read': { tier: 'read', glyph: 'books' },
  'all-read': { tier: 'read', glyph: 'mortarboard' },
  'first-quiz': { tier: 'quiz', glyph: 'pencil' },
  'quiz-pass': { tier: 'quiz', glyph: 'check' },
  'quiz-perfect': { tier: 'quiz', glyph: 'crown' },
  'dex-starter': { tier: 'dex', glyph: 'card' },
  'dex-half': { tier: 'dex', glyph: 'cards' },
  'dex-complete': { tier: 'dex', glyph: 'trophy' },
  'rare-collector': { tier: 'special', glyph: 'gem' },
  'level-doctor': { tier: 'special', glyph: 'star' },
  'all-mastery': { tier: 'special', glyph: 'starburst' },
  'daily-3': { tier: 'daily', glyph: 'calendar' },
  'daily-7': { tier: 'daily', glyph: 'flame' },
};

// メダルの内側SVG文字列（React / 文字列の双方で使う）
export function medalInner(id: string, earned: boolean): string {
  const def = MEDAL[id];
  if (!earned || !def) {
    return `<circle cx="32" cy="32" r="30" fill="#3a3a40"/><circle cx="32" cy="32" r="22.5" fill="rgba(0,0,0,0.2)"/>${GLYPHS.lock}`;
  }
  const ring = TIER[def.tier];
  return `<circle cx="32" cy="32" r="30" fill="${ring}"/><circle cx="32" cy="32" r="29" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/><circle cx="32" cy="32" r="22.5" fill="rgba(0,0,0,0.18)"/>${GLYPHS[def.glyph]}`;
}
