// マスコット「チョーくん」：チョークを擬人化した内製SVGキャラ。
// 表情差分：normal / smile / cheer / celebrate。背景は透明（ページ上に置く）。

export type MascotExpr = 'normal' | 'smile' | 'cheer' | 'celebrate';

const BODY = `
  <rect x="20" y="12" width="24" height="52" rx="9" fill="#fdfdfb" stroke="#d9d7cc" stroke-width="1.5"/>
  <rect x="35" y="13" width="9" height="50" rx="6" fill="#eceadf"/>
  <rect x="20" y="58" width="24" height="6" rx="3" fill="#dedcd2"/>
  <circle cx="24.5" cy="35" r="2" fill="#f3b6b0" opacity="0.7"/>
  <circle cx="39.5" cy="35" r="2" fill="#f3b6b0" opacity="0.7"/>`;

const EYES_DOT = `<circle cx="27.5" cy="30" r="2.4" fill="#33312b"/><circle cx="36.5" cy="30" r="2.4" fill="#33312b"/>`;
const EYES_HAPPY = `<path d="M25 31 q2.5 -3 5 0" stroke="#33312b" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M34 31 q2.5 -3 5 0" stroke="#33312b" stroke-width="2" fill="none" stroke-linecap="round"/>`;

const ARMS_DOWN = `<path d="M20 42 q-6 3 -6 9" stroke="#fdfdfb" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M44 42 q6 3 6 9" stroke="#fdfdfb" stroke-width="4" fill="none" stroke-linecap="round"/>`;
const ARMS_ONEUP = `<path d="M20 42 q-6 3 -6 9" stroke="#fdfdfb" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M44 41 q8 -1 9 -9" stroke="#fdfdfb" stroke-width="4" fill="none" stroke-linecap="round"/>`;
const ARMS_BOTHUP = `<path d="M20 41 q-8 -1 -9 -9" stroke="#fdfdfb" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M44 41 q8 -1 9 -9" stroke="#fdfdfb" stroke-width="4" fill="none" stroke-linecap="round"/>`;

const SPARKLE = `<g stroke="#f4c64a" stroke-width="2" stroke-linecap="round"><line x1="12" y1="16" x2="12" y2="22"/><line x1="9" y1="19" x2="15" y2="19"/><line x1="52" y1="14" x2="52" y2="20"/><line x1="49" y1="17" x2="55" y2="17"/></g>`;

function face(expr: MascotExpr): string {
  switch (expr) {
    case 'smile':
      return EYES_DOT + `<path d="M27 37 q5 5 10 0" stroke="#33312b" stroke-width="2" fill="none" stroke-linecap="round"/>` + ARMS_DOWN;
    case 'cheer':
      return EYES_HAPPY + `<ellipse cx="32" cy="39" rx="3.2" ry="3" fill="#d9665a"/>` + ARMS_ONEUP;
    case 'celebrate':
      return EYES_HAPPY + `<path d="M26 36 q6 8 12 0 q-6 1 -12 0 z" fill="#d9665a"/>` + ARMS_BOTHUP + SPARKLE;
    case 'normal':
    default:
      return EYES_DOT + `<path d="M28 38 q4 3 8 0" stroke="#33312b" stroke-width="2" fill="none" stroke-linecap="round"/>` + ARMS_DOWN;
  }
}

export function mascotInner(expr: MascotExpr): string {
  // 腕は体より後ろ→先に腕、その上に体＋顔
  const f = face(expr);
  // 腕部分（ARMS_*）を体の後ろに描くため、armsを抽出せず単純に body の前後で重ねる：
  // ここでは body を先に描き、その上に顔（腕含む）を重ねる簡易構成。
  return `${BODY}${f}`;
}
