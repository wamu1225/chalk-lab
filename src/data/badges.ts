import { sections } from './sections';
import type { Progress } from '../utils/progress';
import { discoveredCount, masterySum } from '../utils/progress';
import { computeXp, levelInfo } from '../utils/level';
import { QUIZ_PASS, QUIZ_PER_PLAY } from './quiz';
import { CHALK_CARDS, TOTAL_CARDS } from './chalkCards';

export type Badge = {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  earned: (p: Progress) => boolean;
  // 任意：未獲得バッジに「いま n / 目標」の進捗ヒントを出す（数えられる実績のみ）
  progress?: (p: Progress) => { now: number; goal: number };
};

export const BADGES: Badge[] = [
  {
    id: 'first-read',
    name: 'チョークの入口',
    emoji: '🚪',
    desc: 'よみものを1つ読んだ',
    earned: (p) => p.visitedSections.length >= 1,
  },
  {
    id: 'half-read',
    name: 'チョーク見習い',
    emoji: '📗',
    desc: 'よみものを半分（4つ）読んだ',
    earned: (p) => p.visitedSections.length >= 4,
    progress: (p) => ({ now: p.visitedSections.length, goal: 4 }),
  },
  {
    id: 'all-read',
    name: 'よみもの全踏破',
    emoji: '🎓',
    desc: 'すべてのよみものを読んだ',
    earned: (p) => sections.every((s) => p.visitedSections.includes(s.id)),
    progress: (p) => ({ now: sections.filter((s) => p.visitedSections.includes(s.id)).length, goal: sections.length }),
  },
  {
    id: 'first-quiz',
    name: 'はじめての検定',
    emoji: '✏️',
    desc: 'チョーク検定に1回挑戦した',
    earned: (p) => p.quizPlays >= 1,
  },
  {
    id: 'quiz-pass',
    name: '検定合格',
    emoji: '🏅',
    desc: `チョーク検定で${QUIZ_PASS}問以上正解した`,
    earned: (p) => p.quizBest >= QUIZ_PASS,
    progress: (p) => ({ now: p.quizBest, goal: QUIZ_PASS }),
  },
  {
    id: 'quiz-perfect',
    name: 'チョークマスター',
    emoji: '👑',
    desc: `チョーク検定で${QUIZ_PER_PLAY}問全問正解した`,
    earned: (p) => p.quizBest >= QUIZ_PER_PLAY,
    progress: (p) => ({ now: p.quizBest, goal: QUIZ_PER_PLAY }),
  },
  {
    id: 'dex-starter',
    name: 'はじめての1枚',
    emoji: '🃏',
    desc: 'チョーク図鑑のカードを1枚あつめた',
    earned: (p) => discoveredCount(p) >= 1,
  },
  {
    id: 'dex-half',
    name: '図鑑コレクター',
    emoji: '📇',
    desc: '図鑑のカードを半分あつめた',
    earned: (p) => discoveredCount(p) >= Math.ceil(TOTAL_CARDS / 2),
    progress: (p) => ({ now: discoveredCount(p), goal: Math.ceil(TOTAL_CARDS / 2) }),
  },
  {
    id: 'dex-complete',
    name: '図鑑コンプリート',
    emoji: '🏆',
    desc: '図鑑のカードをすべてあつめた',
    earned: (p) => discoveredCount(p) >= TOTAL_CARDS,
    progress: (p) => ({ now: discoveredCount(p), goal: TOTAL_CARDS }),
  },
  {
    id: 'rare-collector',
    name: 'レアハンター',
    emoji: '💎',
    desc: 'すべてのレア（★★★）カードをあつめた',
    earned: (p) => CHALK_CARDS.filter((c) => c.rarity === 3).every((c) => p.cards[c.id]?.discovered),
    progress: (p) => {
      const rares = CHALK_CARDS.filter((c) => c.rarity === 3);
      return { now: rares.filter((c) => p.cards[c.id]?.discovered).length, goal: rares.length };
    },
  },
  {
    id: 'level-doctor',
    name: 'チョーク博士',
    emoji: '',
    desc: 'レベル「チョーク博士」に到達した',
    earned: (p) => levelInfo(computeXp(p)).level >= 5,
  },
  {
    id: 'all-mastery',
    name: '習熟マスター',
    emoji: '',
    desc: 'すべての図鑑カードを習熟MAX（★★★）にした',
    earned: (p) => masterySum(p) >= TOTAL_CARDS * 3,
    progress: (p) => ({ now: masterySum(p), goal: TOTAL_CARDS * 3 }),
  },
  {
    id: 'daily-3',
    name: '3日れんぞく',
    emoji: '',
    desc: '今日の検定に3日連続で挑戦した',
    earned: (p) => p.dailyStreak >= 3,
    progress: (p) => ({ now: p.dailyStreak, goal: 3 }),
  },
  {
    id: 'daily-7',
    name: '7日れんぞく',
    emoji: '',
    desc: '今日の検定に7日連続で挑戦した',
    earned: (p) => p.dailyStreak >= 7,
    progress: (p) => ({ now: p.dailyStreak, goal: 7 }),
  },
  {
    id: 'workshop-first',
    name: '工房デビュー',
    emoji: '',
    desc: 'チョーク工房でマイチョークを作った',
    earned: (p) => p.craftedChalks.length >= 1,
  },
  {
    id: 'workshop-master',
    name: 'チョークの名工',
    emoji: '',
    desc: '工房でランクA以上のチョークを作った',
    earned: (p) => p.craftedChalks.some((c) => c.rank === 'S' || c.rank === 'A'),
  },
];

// 進捗からバッジidの配列を再計算
export function computeBadges(p: Progress): string[] {
  return BADGES.filter((b) => b.earned(p)).map((b) => b.id);
}
