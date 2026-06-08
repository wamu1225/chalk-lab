// チョーク博士レベル：読む・解く・集める・バッジ を1本のXPに束ねる進行システム。
// XPは progress から決定的に算出する（増分管理は不要）。
import type { Progress } from './progress';
import { discoveredCount, masterySum } from './progress';

export const XP_RULES = {
  perSectionRead: 20,   // よみもの読了（1セクション）
  perCardFound: 10,     // 図鑑カード発見
  perMasteryStar: 5,    // 図鑑カードの習熟★（合計）
  perQuizPlay: 8,       // チョーク検定に挑戦
  perQuizBest: 5,       // 検定の最高正解数 1問あたり
  perBadge: 15,         // バッジ獲得
};

export function computeXp(p: Progress): number {
  return (
    p.visitedSections.length * XP_RULES.perSectionRead +
    discoveredCount(p) * XP_RULES.perCardFound +
    masterySum(p) * XP_RULES.perMasteryStar +
    p.quizPlays * XP_RULES.perQuizPlay +
    p.quizBest * XP_RULES.perQuizBest +
    p.badges.length * XP_RULES.perBadge
  );
}

export type LevelDef = { min: number; title: string };

// レベル定義（min XP に到達でそのレベル）。完全制覇でほぼ最上位に届く設計。
export const LEVELS: LevelDef[] = [
  { min: 0,   title: 'チョーク みならい' },
  { min: 60,  title: 'チョーク係' },
  { min: 140, title: '黒板マスター' },
  { min: 240, title: 'チョーク研究員' },
  { min: 380, title: 'チョーク博士' },
  { min: 560, title: 'チョーク マイスター' },
  { min: 800, title: 'チョーク王' },
];

export type LevelInfo = {
  level: number;        // 1始まり
  title: string;
  xp: number;
  curMin: number;       // 現レベルの下限
  nextMin: number | null; // 次レベルの下限（最上位は null）
  intoLevel: number;    // 現レベル内での到達XP
  span: number;         // 現レベルの幅（最上位は0）
  toNext: number;       // 次レベルまで残りXP（最上位は0）
  isMax: boolean;
};

export function levelInfo(xp: number): LevelInfo {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].min) idx = i;
  }
  const cur = LEVELS[idx];
  const next = idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
  const isMax = next === null;
  return {
    level: idx + 1,
    title: cur.title,
    xp,
    curMin: cur.min,
    nextMin: next ? next.min : null,
    intoLevel: xp - cur.min,
    span: next ? next.min - cur.min : 0,
    toNext: next ? next.min - xp : 0,
    isMax,
  };
}
