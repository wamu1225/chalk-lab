import { sections } from './sections';
import type { Progress } from '../utils/progress';
import { discoveredCount } from '../utils/progress';
import { QUIZ_PASS, QUIZ_PER_PLAY } from './quiz';
import { CHALK_CARDS, TOTAL_CARDS } from './chalkCards';

export type Badge = {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  earned: (p: Progress) => boolean;
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
  },
  {
    id: 'all-read',
    name: 'チョーク博士',
    emoji: '🎓',
    desc: 'すべてのよみものを読んだ',
    earned: (p) => sections.every((s) => p.visitedSections.includes(s.id)),
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
  },
  {
    id: 'quiz-perfect',
    name: 'チョークマスター',
    emoji: '👑',
    desc: `チョーク検定で${QUIZ_PER_PLAY}問全問正解した`,
    earned: (p) => p.quizBest >= QUIZ_PER_PLAY,
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
  },
  {
    id: 'dex-complete',
    name: '図鑑コンプリート',
    emoji: '🏆',
    desc: '図鑑のカードをすべてあつめた',
    earned: (p) => discoveredCount(p) >= TOTAL_CARDS,
  },
  {
    id: 'rare-collector',
    name: 'レアハンター',
    emoji: '💎',
    desc: 'すべてのレア（★★★）カードをあつめた',
    earned: (p) => CHALK_CARDS.filter((c) => c.rarity === 3).every((c) => p.cards[c.id]?.discovered),
  },
];

// 進捗からバッジidの配列を再計算
export function computeBadges(p: Progress): string[] {
  return BADGES.filter((b) => b.earned(p)).map((b) => b.id);
}
