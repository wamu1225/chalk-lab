// 「チョーク誕生の旅」タイムライン体験のデータ。
// 円石藻 → 海底に堆積 → 白亜 → 白亜紀 → 黒板のチョーク。事実は geology/basics 記事に対応。

function spokes(cx: number, cy: number, ri: number, ro: number): string {
  let s = '';
  for (let a = 0; a < 360; a += 45) {
    const r = (a * Math.PI) / 180;
    s += `<line x1="${(cx + ri * Math.cos(r)).toFixed(1)}" y1="${(cy + ri * Math.sin(r)).toFixed(1)}" x2="${(cx + ro * Math.cos(r)).toFixed(1)}" y2="${(cy + ro * Math.sin(r)).toFixed(1)}"/>`;
  }
  return s;
}

const BG = '<rect width="300" height="170" rx="14" fill="#22402f"/>';
const SEA = (y: number) => `<path d="M0 ${y} q30 -9 60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#cfe0e8" stroke-width="3" stroke-linecap="round" opacity="0.7"/>`;

export type TimelineStep = { title: string; body: string; svg: string };

export const TIMELINE: TimelineStep[] = [
  {
    title: '① 小さなプランクトン「円石藻」',
    body: '海には、目に見えないほど小さな植物プランクトン「円石藻（えんせきそう）」がいます。体は炭酸カルシウムの小さな殻（コッコリス）でできています。',
    svg: `${BG}${SEA(34)}
      <g transform="translate(150,100)"><circle r="34" fill="none" stroke="#fdfdfb" stroke-width="4"/><circle r="15" fill="none" stroke="#fdfdfb" stroke-width="3"/><g stroke="#fdfdfb" stroke-width="3" stroke-linecap="round">${spokes(0, 0, 17, 32)}</g></g>
      <g fill="#fdfdfb" opacity="0.7"><circle cx="58" cy="74" r="3"/><circle cx="242" cy="62" r="2.5"/><circle cx="70" cy="132" r="2.5"/><circle cx="236" cy="126" r="3"/></g>`,
  },
  {
    title: '② 海の底にしずんで積もる',
    body: '円石藻が死ぬと、殻が海の底にしずみます。長い長い年月をかけて、殻がどんどん積もっていきます。',
    svg: `${BG}${SEA(28)}
      <g fill="#fdfdfb" opacity="0.85"><circle cx="70" cy="55" r="2.5"/><circle cx="120" cy="70" r="2"/><circle cx="165" cy="58" r="2.5"/><circle cx="210" cy="72" r="2"/><circle cx="95" cy="92" r="2"/><circle cx="190" cy="95" r="2.5"/><circle cx="140" cy="104" r="2"/></g>
      <g stroke="#dcdacf" stroke-width="3.5" stroke-linecap="round"><line x1="24" y1="124" x2="276" y2="124"/><line x1="24" y1="138" x2="276" y2="138"/><line x1="24" y1="152" x2="276" y2="152"/></g>`,
  },
  {
    title: '③ 押し固められて「白亜」に',
    body: '積もった殻が、上の重みで押し固められ、白くてやわらかい岩「白亜（はくあ）」になりました。英語ではこれを chalk（チョーク）といいます。',
    svg: `${BG}${SEA(132)}
      <path d="M34 56 L58 44 L92 62 L124 46 L156 64 L192 48 L222 64 L256 50 L266 134 L34 134 Z" fill="#fdfdfb"/>`,
  },
  {
    title: '④ 恐竜の時代「白亜紀」',
    body: '世界中で円石藻が大量に増え、分厚い白亜の地層ができた時代が「白亜紀」。英語名 Cretaceous は、ラテン語でチョークを意味する creta が語源です。',
    svg: `${BG}${SEA(140)}
      <circle cx="250" cy="40" r="14" fill="none" stroke="#f4c64a" stroke-width="3"/>
      <path d="M20 70 L40 60 L66 76 L92 62 L116 78 L116 134 L20 134 Z" fill="#fdfdfb"/>
      <g fill="#fdfdfb" transform="translate(196,96)"><ellipse cx="0" cy="-12" rx="5" ry="11"/><ellipse cx="-12" cy="-6" rx="4" ry="9" transform="rotate(-30 -12 -6)"/><ellipse cx="12" cy="-6" rx="4" ry="9" transform="rotate(30 12 -6)"/><ellipse cx="0" cy="9" rx="11" ry="12"/></g>`,
  },
  {
    title: '⑤ 削って黒板のチョークに',
    body: '昔の黒板チョークは、この白亜を削って作られました。毎日使う一本のチョークの中に、はるか昔の海の生き物の痕跡がつまっているのです。',
    svg: `${BG}
      <path d="M40 120 q40 -20 84 -4 q44 16 84 -10" fill="none" stroke="#fdfdfb" stroke-width="5" stroke-linecap="round" opacity="0.85"/>
      <g transform="rotate(-34 150 76)"><rect x="138" y="36" width="24" height="80" rx="5" fill="#fdfdfb"/><rect x="152" y="36" width="10" height="80" rx="4" fill="#dcdacf"/><rect x="138" y="110" width="24" height="6" rx="2" fill="#c4c2b6"/></g>
      <g fill="#fdfdfb" opacity="0.6"><circle cx="60" cy="140" r="3"/><circle cx="86" cy="148" r="2.2"/></g>`,
  },
];
