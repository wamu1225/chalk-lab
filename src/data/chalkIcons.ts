// チョークラボの内製SVGアイコン（絵文字の代替）。
// 「黒板に白チョークの線画＋カテゴリ色タイル」で全点統一。
// React（ChalkIcon.tsx）と SSG（prerender.ts）の両方がこの定義を共有する。

export const ICON_TINT = {
  board: '#2a4a3a',
  material: '#3a3550',
  legend: '#5a4420',
  geology: '#2d4456',
  eco: '#2f4a2c',
  sports: '#523040',
  health: '#344a4a',
  compare: '#3f3f46',
} as const;

export type IconTint = keyof typeof ICON_TINT;

// 円石藻のスポーク生成
function spokes(cx: number, cy: number, ri: number, ro: number): string {
  let s = '';
  for (let a = 0; a < 360; a += 45) {
    const r = (a * Math.PI) / 180;
    s += `<line x1="${(cx + ri * Math.cos(r)).toFixed(1)}" y1="${(cy + ri * Math.sin(r)).toFixed(1)}" x2="${(cx + ro * Math.cos(r)).toFixed(1)}" y2="${(cy + ro * Math.sin(r)).toFixed(1)}"/>`;
  }
  return s;
}

// motif id → { tint, art(0..64座標の白チョーク線画) }
export const ICON_ART: Record<string, { tint: IconTint; art: string }> = {
  'white-chalk': { tint: 'board', art: `<path d="M11 50 q9 -7 19 -2 q10 5 21 -4" fill="none" stroke="#fdfdfb" stroke-width="3.2" stroke-linecap="round" opacity="0.8"/><g transform="rotate(-43 32 28)"><rect x="26" y="11" width="12" height="34" rx="2" fill="#fdfdfb"/><rect x="33.5" y="11" width="4.5" height="34" rx="1.5" fill="#dcdacf"/><rect x="26" y="41" width="12" height="4" rx="1" fill="#c4c2b6"/></g>` },
  'color-chalk': { tint: 'board', art: `<rect x="16" y="22" width="9" height="26" rx="2" fill="#fdfdfb"/><rect x="16" y="22" width="9" height="6" rx="2" fill="#e0556a"/><rect x="27.5" y="18" width="9" height="30" rx="2" fill="#fdfdfb"/><rect x="27.5" y="18" width="9" height="6" rx="2" fill="#5b8def"/><rect x="39" y="24" width="9" height="24" rx="2" fill="#fdfdfb"/><rect x="39" y="24" width="9" height="6" rx="2" fill="#e7b53a"/>` },
  'dustless': { tint: 'board', art: `<rect x="26" y="12" width="11" height="27" rx="2" fill="#fdfdfb"/><rect x="32" y="12" width="5" height="27" rx="1.5" fill="#dcdacf"/><g fill="#fdfdfb"><circle cx="25" cy="46" r="1.6" opacity="0.7"/><circle cx="31" cy="50" r="1.6" opacity="0.6"/><circle cx="37" cy="47" r="1.6" opacity="0.7"/><circle cx="28" cy="55" r="1.3" opacity="0.5"/><circle cx="34" cy="56" r="1.3" opacity="0.5"/></g>` },
  'luminous': { tint: 'board', art: `<g stroke="#ffe9a8" stroke-width="2.6" stroke-linecap="round"><line x1="32" y1="6" x2="32" y2="13"/><line x1="14" y1="14" x2="19" y2="19"/><line x1="50" y1="14" x2="45" y2="19"/><line x1="9" y1="30" x2="16" y2="30"/><line x1="55" y1="30" x2="48" y2="30"/></g><rect x="26" y="20" width="12" height="28" rx="2" fill="#fdfdfb"/><rect x="33" y="20" width="5" height="28" rx="1.5" fill="#dcdacf"/>` },
  'calcium-carbonate': { tint: 'material', art: `<g fill="none" stroke="#fdfdfb" stroke-width="2.8" stroke-linejoin="round"><polygon points="32,12 41,17 41,27 32,32 23,27 23,17"/><polygon points="22,32 29,36 29,46 22,50 15,46 15,36"/><polygon points="42,32 49,36 49,46 42,50 35,46 35,36"/></g>` },
  'gypsum': { tint: 'material', art: `<g stroke="#fdfdfb" stroke-width="2.6" fill="none" stroke-linejoin="round"><polygon points="32,12 47,22 32,32 17,22"/><path d="M17 22 V40 L32 50 V32"/><path d="M47 22 V40 L32 50"/></g>` },
  'hagoromo': { tint: 'legend', art: `<rect x="18" y="32" width="28" height="20" rx="3" fill="none" stroke="#fdfdfb" stroke-width="3"/><line x1="18" y1="38" x2="46" y2="38" stroke="#fdfdfb" stroke-width="2.4"/><rect x="26" y="18" width="6" height="15" rx="1.5" fill="#fdfdfb"/><rect x="34" y="21" width="6" height="12" rx="1.5" fill="#fdfdfb" opacity="0.85"/><g stroke="#ffe2a0" stroke-width="2.6" stroke-linecap="round"><line x1="50" y1="13" x2="50" y2="21"/><line x1="46" y1="17" x2="54" y2="17"/></g>` },
  'chalk-rock': { tint: 'geology', art: `<path d="M14 24 L20 20 L28 26 L36 21 L44 27 L50 23 L50 44 L14 44 Z" fill="#fdfdfb"/><path d="M11 49 q8 -4 16 0 t16 0 t16 0" fill="none" stroke="#cfe0e8" stroke-width="2.6" stroke-linecap="round" opacity="0.85"/>` },
  'coccolith': { tint: 'geology', art: `<circle cx="32" cy="32" r="18" fill="none" stroke="#fdfdfb" stroke-width="3"/><circle cx="32" cy="32" r="8" fill="none" stroke="#fdfdfb" stroke-width="2.6"/><g stroke="#fdfdfb" stroke-width="2.6" stroke-linecap="round">${spokes(32, 32, 9, 17)}</g>` },
  'cretaceous': { tint: 'geology', art: `<g fill="#fdfdfb"><ellipse cx="32" cy="22" rx="3.6" ry="7.5"/><ellipse cx="21" cy="27" rx="3.3" ry="6.5" transform="rotate(-30 21 27)"/><ellipse cx="43" cy="27" rx="3.3" ry="6.5" transform="rotate(30 43 27)"/><ellipse cx="32" cy="40" rx="7.5" ry="8.5"/></g>` },
  'scallop': { tint: 'eco', art: `<path d="M32 44 L16 24 q16 -13 32 0 Z" fill="none" stroke="#fdfdfb" stroke-width="3" stroke-linejoin="round"/><g stroke="#fdfdfb" stroke-width="2.2" stroke-linecap="round"><line x1="32" y1="44" x2="23" y2="27"/><line x1="32" y1="44" x2="32" y2="23"/><line x1="32" y1="44" x2="41" y2="27"/></g><circle cx="32" cy="44" r="2.6" fill="#fdfdfb"/>` },
  'eggshell': { tint: 'eco', art: `<path d="M32 13 C20 13 18 34 18 40 a14 14 0 0 0 28 0 C46 34 44 13 32 13 Z" fill="none" stroke="#fdfdfb" stroke-width="3"/><path d="M25 30 l5 4 l-3 4 l5 3" fill="none" stroke="#fdfdfb" stroke-width="2.4" stroke-linejoin="round"/>` },
  'climbing': { tint: 'sports', art: `<path d="M20 30 q0 22 12 22 q12 0 12 -22 z" fill="none" stroke="#fdfdfb" stroke-width="3"/><path d="M20 30 q12 -9 24 0" fill="none" stroke="#fdfdfb" stroke-width="3"/><line x1="32" y1="24" x2="32" y2="15" stroke="#fdfdfb" stroke-width="2.6" stroke-linecap="round"/><circle cx="22" cy="52" r="2" fill="#fdfdfb" opacity="0.6"/><circle cx="42" cy="53" r="1.6" fill="#fdfdfb" opacity="0.5"/>` },
  'billiard': { tint: 'sports', art: `<rect x="17" y="33" width="19" height="17" rx="2" fill="none" stroke="#fdfdfb" stroke-width="3"/><ellipse cx="26.5" cy="37" rx="6.5" ry="2.6" fill="#fdfdfb" opacity="0.85"/><line x1="42" y1="14" x2="30" y2="34" stroke="#fdfdfb" stroke-width="3" stroke-linecap="round"/>` },
  'tailors-chalk': { tint: 'sports', art: `<polygon points="20,18 46,38 16,42" fill="none" stroke="#fdfdfb" stroke-width="3" stroke-linejoin="round"/><line x1="12" y1="50" x2="52" y2="50" stroke="#fdfdfb" stroke-width="2.6" stroke-dasharray="4 3" stroke-linecap="round"/>` },
  'dust': { tint: 'health', art: `<rect x="20" y="24" width="24" height="12" rx="2" fill="#fdfdfb"/><rect x="20" y="24" width="24" height="4" rx="2" fill="#c9c7bc"/><g fill="#fdfdfb"><circle cx="18" cy="45" r="2.4" opacity="0.6"/><circle cx="26" cy="49" r="2" opacity="0.5"/><circle cx="34" cy="46" r="2.4" opacity="0.6"/><circle cx="44" cy="49" r="2" opacity="0.5"/></g>` },
  'blackboard': { tint: 'compare', art: `<rect x="11" y="22" width="19" height="22" rx="2" fill="none" stroke="#fdfdfb" stroke-width="3"/><path d="M15 30 q4 -3 8 0" fill="none" stroke="#fdfdfb" stroke-width="2.2" stroke-linecap="round"/><rect x="34" y="22" width="19" height="22" rx="2" fill="#fdfdfb"/><path d="M38 30 h11 M38 36 h8" stroke="#7a8a82" stroke-width="2.2" stroke-linecap="round"/>` },
  'making': { tint: 'board', art: `<rect x="12" y="20" width="20" height="24" rx="3" fill="none" stroke="#fdfdfb" stroke-width="3"/><rect x="32" y="27" width="22" height="10" rx="3" fill="#fdfdfb"/><rect x="48" y="27" width="6" height="10" rx="3" fill="#dcdacf"/>` },
  'blackboard-origin': { tint: 'compare', art: `<rect x="14" y="12" width="36" height="26" rx="3" fill="none" stroke="#fdfdfb" stroke-width="3"/><path d="M20 18 h16 M20 24 h12" stroke="#fdfdfb" stroke-width="2" stroke-linecap="round"/><line x1="20" y1="38" x2="14" y2="54" stroke="#fdfdfb" stroke-width="3" stroke-linecap="round"/><line x1="44" y1="38" x2="50" y2="54" stroke="#fdfdfb" stroke-width="3" stroke-linecap="round"/><line x1="32" y1="38" x2="32" y2="50" stroke="#fdfdfb" stroke-width="3" stroke-linecap="round"/>` },
  'sidewalk': { tint: 'board', art: `<line x1="10" y1="48" x2="54" y2="48" stroke="#fdfdfb" stroke-width="3" stroke-linecap="round"/><g transform="rotate(34 40 32)"><rect x="35" y="16" width="9" height="26" rx="2" fill="#fdfdfb"/><rect x="35" y="38" width="9" height="4" rx="1" fill="#c4c2b6"/></g><path d="M13 46 q7 -11 15 0" fill="none" stroke="#fdfdfb" stroke-width="2.4" stroke-linecap="round"/>` },
  'school-spec': { tint: 'board', art: `<rect x="15" y="26" width="34" height="11" rx="3" fill="#fdfdfb"/><g stroke="#2a4a3a" stroke-width="1.6"><line x1="22" y1="26" x2="22" y2="32"/><line x1="29" y1="26" x2="29" y2="32"/><line x1="36" y1="26" x2="36" y2="32"/><line x1="43" y1="26" x2="43" y2="32"/></g><g stroke="#fdfdfb" stroke-width="2" stroke-linecap="round"><line x1="15" y1="46" x2="49" y2="46"/><line x1="15" y1="43" x2="15" y2="49"/><line x1="49" y1="43" x2="49" y2="49"/></g>` },
  'cud': { tint: 'board', art: `<g fill="none" stroke-width="3"><circle cx="25" cy="25" r="11" stroke="#e0556a"/><circle cx="39" cy="25" r="11" stroke="#5b8def"/><circle cx="32" cy="36" r="11" stroke="#e7b53a"/></g><path d="M24 47 l6 6 l12 -13" fill="none" stroke="#fdfdfb" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>` },
  'allergy-free': { tint: 'health', art: `<path d="M32 11 L48 18 V34 Q48 48 32 54 Q16 48 16 34 V18 Z" fill="none" stroke="#fdfdfb" stroke-width="3" stroke-linejoin="round"/><path d="M24 32 l6 6 l12 -13" fill="none" stroke="#fdfdfb" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` },
  'air-standard': { tint: 'health', art: `<path d="M14 44 a18 18 0 0 1 36 0" fill="none" stroke="#fdfdfb" stroke-width="3"/><line x1="32" y1="44" x2="43" y2="29" stroke="#f4c64a" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="44" r="3.2" fill="#fdfdfb"/><g stroke="#fdfdfb" stroke-width="2" stroke-linecap="round"><line x1="16" y1="42" x2="19" y2="40"/><line x1="48" y1="42" x2="45" y2="40"/></g>` },
  'recycle': { tint: 'eco', art: `<g fill="none" stroke="#fdfdfb" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 30 a14 14 0 0 1 24 -3"/><path d="M44 18 v9 h-9"/><path d="M44 36 a14 14 0 0 1 -24 3"/><path d="M20 48 v-9 h9"/></g>` },
  'limestone': { tint: 'material', art: `<polygon points="18,40 22,24 38,20 48,30 44,46 26,48" fill="none" stroke="#fdfdfb" stroke-width="3" stroke-linejoin="round"/><path d="M22 24 L34 34 L48 30 M34 34 L30 48" fill="none" stroke="#fdfdfb" stroke-width="2"/>` },
  'pigment': { tint: 'material', art: `<path d="M24 20 q6 9 0 14 q-6 -5 0 -14 Z" fill="#e0556a"/><path d="M40 20 q6 9 0 14 q-6 -5 0 -14 Z" fill="#5b8def"/><path d="M32 34 q6 9 0 14 q-6 -5 0 -14 Z" fill="#e7b53a"/>` },
  'dover': { tint: 'geology', art: `<circle cx="46" cy="19" r="5" fill="none" stroke="#fdfdfb" stroke-width="2.4"/><path d="M12 26 L18 22 L26 28 L34 23 L42 30 L50 25 L50 40 L12 40 Z" fill="#fdfdfb"/><path d="M10 47 q8 -4 16 0 t16 0 t12 0" fill="none" stroke="#cfe0e8" stroke-width="2.6" stroke-linecap="round" opacity="0.85"/>` },
  'coating': { tint: 'board', art: `<rect x="26" y="16" width="12" height="32" rx="2" fill="#fdfdfb"/><rect x="33" y="16" width="5" height="32" rx="1.5" fill="#dcdacf"/><g stroke="#ffe9a8" stroke-width="2.4" stroke-linecap="round"><line x1="47" y1="18" x2="47" y2="24"/><line x1="44" y1="21" x2="50" y2="21"/></g>` },

  // ── あそび（ゲーム系ページ用・絵文字の代替） ──
  'play-hub': { tint: 'board', art: `<rect x="16" y="16" width="32" height="32" rx="7" fill="none" stroke="#fdfdfb" stroke-width="3"/><g fill="#fdfdfb"><circle cx="25" cy="25" r="2.7"/><circle cx="39" cy="25" r="2.7"/><circle cx="25" cy="39" r="2.7"/><circle cx="39" cy="39" r="2.7"/></g>` },
  'play-map': { tint: 'legend', art: `<path d="M14 18 L26 14 L38 18 L50 14 V46 L38 50 L26 46 L14 50 Z" fill="none" stroke="#fdfdfb" stroke-width="3" stroke-linejoin="round"/><line x1="26" y1="14" x2="26" y2="46" stroke="#fdfdfb" stroke-width="2" opacity="0.55"/><line x1="38" y1="18" x2="38" y2="50" stroke="#fdfdfb" stroke-width="2" opacity="0.55"/><path d="M19 40 q8 -10 14 -5 t12 -9" fill="none" stroke="#f4c64a" stroke-width="2.6" stroke-dasharray="4 3" stroke-linecap="round"/>` },
  'play-dex': { tint: 'board', art: `<g transform="rotate(-9 23 32)"><rect x="13" y="18" width="20" height="28" rx="3" fill="none" stroke="#fdfdfb" stroke-width="2.8" opacity="0.7"/></g><rect x="28" y="19" width="21" height="29" rx="3" fill="none" stroke="#fdfdfb" stroke-width="3"/><path d="M38.5 28 l1.9 3.8 4.2 .6 -3 3 .7 4.2 -3.8 -2 -3.8 2 .7 -4.2 -3 -3 4.2 -.6 Z" fill="#f4c64a"/>` },
  'play-workshop': { tint: 'material', art: `<path d="M27 13 h10 M30 13 v11 L19 45 a4 4 0 0 0 3.6 6 h18.8 a4 4 0 0 0 3.6 -6 L34 24 V13" fill="none" stroke="#fdfdfb" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/><circle cx="28" cy="42" r="2.1" fill="#fdfdfb"/><circle cx="35" cy="37" r="1.6" fill="#fdfdfb" opacity="0.8"/>` },
  'play-draw': { tint: 'board', art: `<rect x="12" y="13" width="40" height="28" rx="3" fill="none" stroke="#fdfdfb" stroke-width="3"/><path d="M18 27 q6 -8 12 0 t12 0" fill="none" stroke="#f4c64a" stroke-width="2.6" stroke-linecap="round"/><g transform="rotate(38 41 50)"><rect x="37" y="44" width="7.5" height="13" rx="1.6" fill="#fdfdfb"/></g>` },
  'play-quiz': { tint: 'geology', art: `<rect x="18" y="12" width="28" height="40" rx="3" fill="none" stroke="#fdfdfb" stroke-width="3"/><g stroke="#fdfdfb" stroke-width="2.2" stroke-linecap="round"><line x1="24" y1="21" x2="40" y2="21"/><line x1="24" y1="28" x2="36" y2="28"/></g><path d="M24 40 l5 5 l11 -11" fill="none" stroke="#f4c64a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` },
  'play-guess': { tint: 'sports', art: `<rect x="20" y="14" width="24" height="36" rx="3" fill="none" stroke="#fdfdfb" stroke-width="3"/><path d="M26.5 26 a5.5 5.5 0 1 1 8 4.9 q-2.5 1.4 -2.5 4.1" fill="none" stroke="#fdfdfb" stroke-width="2.8" stroke-linecap="round"/><circle cx="32" cy="41" r="1.9" fill="#fdfdfb"/>` },
  'play-timeline': { tint: 'geology', art: `<g fill="none" stroke="#fdfdfb" stroke-width="3" stroke-linecap="round"><line x1="20" y1="12" x2="44" y2="12"/><line x1="20" y1="52" x2="44" y2="52"/><path d="M22 12 q0 14 10 20 q-10 6 -10 20"/><path d="M42 12 q0 14 -10 20 q10 6 10 20"/></g><circle cx="32" cy="45" r="2.8" fill="#f4c64a"/>` },
  'play-badges': { tint: 'legend', art: `<path d="M23 11 h7 l2 6 l2 -6 h7 l-6.5 15 h-5 Z" fill="none" stroke="#fdfdfb" stroke-width="2.6" stroke-linejoin="round"/><circle cx="32" cy="40" r="11.5" fill="none" stroke="#fdfdfb" stroke-width="3"/><path d="M32 34.5 l1.9 3.8 4.2 .6 -3 3 .7 4.2 -3.8 -2 -3.8 2 .7 -4.2 -3 -3 4.2 -.6 Z" fill="#f4c64a"/>` },
};

// セクション id → motif id
export const SECTION_ICON: Record<string, string> = {
  basics: 'white-chalk',
  types: 'color-chalk',
  making: 'making',
  hagoromo: 'hagoromo',
  whiteboard: 'blackboard',
  geology: 'chalk-rock',
  sports: 'climbing',
  health: 'dust',
};

// 静的SVG文字列（prerender 用 / Reactでも利用可）
export function iconSvg(motif: string, size: number): string {
  const def = ICON_ART[motif];
  if (!def) return '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64" role="img" aria-hidden="true"><rect width="64" height="64" rx="14" fill="${ICON_TINT[def.tint]}"/>${def.art}</svg>`;
}
