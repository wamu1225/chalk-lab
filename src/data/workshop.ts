// チョーク工房：成分の配合からチョークの性能を判定する。
// 判定式はよみもの（basics/types/making）の「確認できる事実」に対応：
//  - 炭酸カルシウムは粒が詰まって折れにくく、比重が大きく粉が舞いにくい（ダストレス）
//  - 石膏はやわらかく書きやすいが粉が舞いやすい
//  - ホタテ貝殻は炭酸カルシウム。混ぜすぎると硬くなりすぎて書き味が落ちる
//  - 顔料で発色、表面コーティングで手が汚れにくく書き味も向上

export type Recipe = {
  carbonate: number; // 炭酸カルシウム
  gypsum: number;    // 石膏
  scallop: number;   // ホタテ貝殻（エコ）
  pigment: number;   // 顔料
  coating: boolean;  // 表面コーティング
};

export type Scores = {
  smoothness: number; // 書き味
  strength: number;   // 折れにくさ
  dustless: number;   // 粉の出にくさ
  color: number;      // 発色
  eco: number;        // エコ率
  overall: number;    // 総合
  rank: 'S' | 'A' | 'B' | 'C';
  comment: string;
};

export const DEFAULT_RECIPE: Recipe = { carbonate: 60, gypsum: 20, scallop: 10, pigment: 25, coating: true };

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export function computeScores(r: Recipe): Scores {
  const overScallop = Math.max(0, r.scallop - 25); // 混ぜすぎ域
  const smoothness = clamp(45 + r.gypsum * 0.40 + (r.coating ? 15 : 0) - r.pigment * 0.12 - overScallop * 0.6);
  const strength = clamp(45 + r.carbonate * 0.35 + Math.min(r.scallop, 35) * 0.30);
  const dustless = clamp(42 + r.carbonate * 0.35 - r.gypsum * 0.30 + r.scallop * 0.20);
  const color = clamp(25 + r.pigment * 0.75);
  const eco = clamp(r.scallop * 1.4);
  // バランスボーナス：4性能すべてを高く保つ（万能チョークは作れない＝バランスが大事）ほど加点
  const perf = [smoothness, strength, dustless, color];
  const avg = 0.3 * smoothness + 0.25 * strength + 0.25 * dustless + 0.2 * color;
  const balanceBonus = Math.min(15, Math.max(0, (Math.min(...perf) - 50) * 0.6));
  const overall = clamp(avg + balanceBonus);
  const rank: Scores['rank'] = overall >= 85 ? 'S' : overall >= 72 ? 'A' : overall >= 55 ? 'B' : 'C';

  let comment: string;
  if (eco >= 65) comment = 'ホタテ貝殻をたっぷり活かしたエコなチョーク！資源の循環の好例です。';
  else if (overScallop > 0 && smoothness < 55) comment = 'ホタテを入れすぎて硬くなりすぎたかも。書き味が落ちています。';
  else if (dustless >= 75 && dustless >= smoothness) comment = '炭酸カルシウムをしっかり固めた、粉が舞いにくいダストレス系！';
  else if (smoothness >= 75) comment = '石膏を効かせた、なめらかな書き味のチョーク！';
  else if (color >= 70) comment = '顔料を効かせた、発色あざやかな色チョーク！';
  else comment = 'バランス型のチョーク。配合を変えて、もっと尖らせてみよう。';

  return { smoothness, strength, dustless, color, eco, overall, rank, comment };
}

export const INGREDIENTS: { key: keyof Omit<Recipe, 'coating'>; label: string; hint: string }[] = [
  { key: 'carbonate', label: '炭酸カルシウム', hint: '折れにくく・粉が舞いにくい土台' },
  { key: 'gypsum', label: '石膏', hint: 'やわらかく書きやすい／粉は舞いやすい' },
  { key: 'scallop', label: 'ホタテ貝殻', hint: 'エコ。入れすぎると硬くなりすぎる' },
  { key: 'pigment', label: '顔料', hint: '色・発色のもと' },
];

// おすすめ配合（実在のチョーク像を再現）。遊びながら「成分→性質」の関係が学べる。
export const PRESETS: { name: string; note: string; recipe: Recipe }[] = [
  { name: 'ダストレスふう', note: '炭酸カルシウム多め。折れにくく粉が舞いにくい、今の学校の主流タイプ。', recipe: { carbonate: 95, gypsum: 20, scallop: 12, pigment: 35, coating: true } },
  { name: '石膏チョークふう', note: '石膏多め。やわらかく書きやすいけれど、粉は舞いやすい。', recipe: { carbonate: 35, gypsum: 80, scallop: 5, pigment: 35, coating: false } },
  { name: '羽衣ふう', note: 'なめらか・折れにくい・手が汚れにくい。伝説の羽衣チョークのイメージ。', recipe: { carbonate: 90, gypsum: 45, scallop: 10, pigment: 30, coating: true } },
  { name: 'エコふう', note: 'ホタテ貝殻を多めに。ごみを減らすエコ配合（入れすぎると硬くなる）。', recipe: { carbonate: 70, gypsum: 20, scallop: 22, pigment: 30, coating: true } },
  { name: '色チョークふう', note: '顔料を多めに。発色あざやかな色チョーク。', recipe: { carbonate: 80, gypsum: 25, scallop: 10, pigment: 85, coating: true } },
];

export const SCORE_BARS: { key: keyof Omit<Scores, 'overall' | 'rank' | 'comment'>; label: string }[] = [
  { key: 'smoothness', label: '書き味' },
  { key: 'strength', label: '折れにくさ' },
  { key: 'dustless', label: '粉の出にくさ' },
  { key: 'color', label: '発色' },
  { key: 'eco', label: 'エコ率' },
];
