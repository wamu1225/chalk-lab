// 記事に埋め込む黒板風SVG図。content 内の [[figure:ID]] で参照する。
// App.tsx（React）と prerender.ts（SSG）が共有。

const BG = '#22402f';   // 黒板
const CH = '#fdfdfb';   // チョーク白
const AC = '#f4c64a';   // アクセント黄
const SUB = '#bcd0c4';  // 補助（淡い緑白）
const FONT = "'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic',Meiryo,sans-serif";

function sawtooth(x0: number, x1: number, yTop: number, yBot: number, step: number): string {
  let d = `M ${x0} ${yBot}`;
  let x = x0;
  let up = true;
  while (x < x1) {
    x = Math.min(x + step, x1);
    d += ` L ${x} ${up ? yTop : yBot}`;
    up = !up;
  }
  return d;
}

function arrow(x: number, y: number): string {
  // 右向き矢印（先端 x,y）
  return `<path d="M ${x - 14} ${y} L ${x - 2} ${y} M ${x - 7} ${y - 4} L ${x - 2} ${y} L ${x - 7} ${y + 4}" fill="none" stroke="${SUB}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function t(x: number, y: number, s: string, fill = CH, size = 13, anchor = 'middle', weight = '600'): string {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${FONT}" font-size="${size}" font-weight="${weight}" fill="${fill}">${s}</text>`;
}

// ── 図1：黒板に書けるしくみ ──
const writeMechanism = (() => {
  const surface = sawtooth(28, 332, 150, 176, 24);
  const powder = [76, 124, 172, 220, 268]
    .map((x, i) => `<circle cx="${x}" cy="${168 - (i % 2) * 2}" r="2.4" fill="${CH}" opacity="0.9"/>`)
    .join('');
  return `<rect x="0" y="0" width="360" height="200" rx="12" fill="${BG}"/>
    <path d="${surface}" fill="none" stroke="${CH}" stroke-width="2.6" stroke-linejoin="round"/>
    <g transform="rotate(-30 150 150)"><rect x="142" y="68" width="16" height="84" rx="3" fill="${CH}"/><rect x="151" y="68" width="7" height="84" rx="2.5" fill="#d4d2c7"/><rect x="142" y="148" width="16" height="4" rx="1" fill="#bdbbb0"/></g>
    ${powder}
    <line x1="150" y1="74" x2="196" y2="78" stroke="${SUB}" stroke-width="1.4"/>
    ${t(200, 82, 'チョーク', CH, 14, 'start')}
    <line x1="248" y1="116" x2="190" y2="166" stroke="${AC}" stroke-width="1.4"/>
    ${t(250, 112, 'けずれた粉', AC, 12, 'start')}
    ${t(180, 194, '黒板の表面のこまかいデコボコ', SUB, 12)}`;
})();

// ── 図2：チョークの製造工程 ──
const makingFlow = (() => {
  const cx = [50, 145, 240, 335];
  const labels = ['混ぜる', '押し出す', '切る', '乾かす'];
  const boxes = cx.map((x) => `<rect x="${x - 34}" y="18" width="68" height="66" rx="10" fill="none" stroke="${CH}" stroke-width="1.6"/>`).join('');
  const arrows = [97.5, 192.5, 287.5].map((x) => arrow(x + 14, 51)).join('');
  const labelText = cx.map((x, i) => t(x, 104, labels[i], CH, 13)).join('');
  // アイコン
  const icons = [
    // 混ぜる（ボウル＋まぜ棒）
    `<g transform="translate(${cx[0]},50)"><path d="M-15 -2 a15 11 0 0 0 30 0 Z" fill="none" stroke="${CH}" stroke-width="2"/><line x1="6" y1="-16" x2="-2" y2="4" stroke="${CH}" stroke-width="2" stroke-linecap="round"/></g>`,
    // 押し出す（型から棒）
    `<g transform="translate(${cx[1]},50)"><rect x="-18" y="-12" width="14" height="24" rx="2" fill="none" stroke="${CH}" stroke-width="2"/><rect x="-4" y="-5" width="22" height="10" rx="3" fill="${CH}"/></g>`,
    // 切る（棒＋ナイフ）
    `<g transform="translate(${cx[2]},50)"><rect x="-18" y="-5" width="30" height="10" rx="3" fill="${CH}"/><line x1="6" y1="-16" x2="14" y2="14" stroke="${AC}" stroke-width="2.4" stroke-linecap="round"/></g>`,
    // 乾かす（太陽）
    `<g transform="translate(${cx[3]},48)"><circle r="8" fill="none" stroke="${AC}" stroke-width="2"/><g stroke="${AC}" stroke-width="2" stroke-linecap="round"><line x1="0" y1="-15" x2="0" y2="-11"/><line x1="0" y1="11" x2="0" y2="15"/><line x1="-15" y1="0" x2="-11" y2="0"/><line x1="11" y1="0" x2="15" y2="0"/><line x1="-10" y1="-10" x2="-7" y2="-7"/><line x1="7" y1="7" x2="10" y2="10"/><line x1="10" y1="-10" x2="7" y2="-7"/><line x1="-7" y1="7" x2="-10" y2="10"/></g></g>`,
  ].join('');
  return `<rect x="0" y="0" width="380" height="120" rx="12" fill="${BG}"/>${boxes}${arrows}${icons}${labelText}`;
})();

// ── 図3：円石藻 → 白亜 → 白亜紀 ──
const geologyTimeline = (() => {
  const cx = [52, 158, 264, 348];
  const labels = ['円石藻', '海底につもる', '白亜（白い岩）', '白亜紀'];
  const arrows = [105, 211, 306].map((x) => arrow(x + 8, 50)).join('');
  const labelText = cx.map((x, i) => t(x, 100, labels[i], CH, 12)).join('');
  const icons = [
    // 円石藻（小さな円盤）
    `<g transform="translate(${cx[0]},48)"><circle r="15" fill="none" stroke="${CH}" stroke-width="2.2"/><circle r="6" fill="none" stroke="${CH}" stroke-width="2"/><g stroke="${CH}" stroke-width="2" stroke-linecap="round"><line x1="7" y1="0" x2="14" y2="0"/><line x1="-7" y1="0" x2="-14" y2="0"/><line x1="0" y1="7" x2="0" y2="14"/><line x1="0" y1="-7" x2="0" y2="-14"/></g></g>`,
    // つもる（層）
    `<g transform="translate(${cx[1]},48)" stroke="${SUB}" stroke-width="2.4" stroke-linecap="round"><line x1="-16" y1="-8" x2="16" y2="-8"/><line x1="-16" y1="0" x2="16" y2="0"/><line x1="-16" y1="8" x2="16" y2="8"/><g stroke="${CH}"><circle cx="-6" cy="-13" r="1.6" fill="${CH}" stroke="none"/><circle cx="8" cy="-14" r="1.6" fill="${CH}" stroke="none"/></g></g>`,
    // 白亜（崖）
    `<g transform="translate(${cx[2]},48)"><path d="M-16 -4 L-10 -8 L-2 -2 L6 -7 L16 -1 L16 14 L-16 14 Z" fill="${CH}"/></g>`,
    // 白亜紀（足あと）
    `<g transform="translate(${cx[3]},48)" fill="${CH}"><ellipse cx="0" cy="-9" rx="3" ry="6"/><ellipse cx="-8" cy="-5" rx="2.6" ry="5" transform="rotate(-30 -8 -5)"/><ellipse cx="8" cy="-5" rx="2.6" ry="5" transform="rotate(30 8 -5)"/><ellipse cx="0" cy="6" rx="6" ry="7"/></g>`,
  ].join('');
  return `<rect x="0" y="0" width="400" height="120" rx="12" fill="${BG}"/>${arrows}${icons}${labelText}`;
})();

export type Figure = { viewBox: string; caption: string; body: string };

export const FIGURES: Record<string, Figure> = {
  'write-mechanism': {
    viewBox: '0 0 360 200',
    caption: 'チョークはこすれて粉になり、その粉が黒板表面の細かなデコボコにひっかかって、文字として残ります。',
    body: writeMechanism,
  },
  'making-flow': {
    viewBox: '0 0 380 120',
    caption: '炭酸カルシウム製チョークの作り方：材料を混ぜ、細い棒状に押し出し、長さをそろえて切り、熱でしっかり乾かします。',
    body: makingFlow,
  },
  'geology-timeline': {
    viewBox: '0 0 400 120',
    caption: '小さなプランクトン「円石藻」の殻が海底に積もって固まり、白い岩「白亜」に。その地層が大量にできた時代が「白亜紀」です。',
    body: geologyTimeline,
  },
};

// 静的SVG文字列（prerender 用）
export function figureSvg(id: string): string {
  const f = FIGURES[id];
  if (!f) return '';
  return `<figure class="content-figure"><svg viewBox="${f.viewBox}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${f.caption}">${f.body}</svg><figcaption>${f.caption}</figcaption></figure>`;
}
