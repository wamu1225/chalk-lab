// ユーザー行動の記録＋演出（トースト）を一手に集約する。
// 読了・検定終了などのイベントで、カード発見・レベルアップ・バッジ獲得を通知する。
import { loadProgress, saveProgress, markSectionVisited } from './progress';
import type { Progress } from './progress';
import { computeBadges, BADGES } from '../data/badges';
import { computeXp, levelInfo } from './level';
import { pushToast } from './toast';

function notifyLevelAndBadges(prev: Progress, next: Progress) {
  const prevLevel = levelInfo(computeXp(prev)).level;
  const nextInfo = levelInfo(computeXp(next));
  if (nextInfo.level > prevLevel) {
    pushToast({ emoji: '⭐', title: `レベルアップ！「${nextInfo.title}」`, accent: true, link: { label: 'ステータスを見る →', path: '/badges/' } });
  }
  const newBadges = next.badges.filter((b) => !prev.badges.includes(b));
  for (const id of newBadges) {
    const b = BADGES.find((x) => x.id === id);
    if (b) pushToast({ badgeId: id, title: `バッジ獲得：${b.name}`, link: { label: 'バッジを見る →', path: '/badges/' } });
  }
}

// よみもの読了：訪問記録＋カード発見＋バッジ再計算＋演出
export function recordSectionRead(sectionId: string): void {
  const prev = loadProgress();
  const newCards = markSectionVisited(sectionId); // visited / discovered を保存
  const next = loadProgress();
  next.badges = computeBadges(next);
  saveProgress(next);
  if (newCards.length) {
    pushToast({ emoji: '🎉', title: '新しいカードを発見！', cards: newCards, link: { label: '図鑑を見る →', path: '/dex/' } });
  }
  notifyLevelAndBadges(prev, next);
}

// 検定終了：挑戦回数・最高記録・バッジ再計算＋演出。prev は検定開始時のスナップショット。
export function recordQuizFinish(prev: Progress, correct: number, perPlay: number): Progress {
  const p = loadProgress();
  p.quizPlays += 1;
  if (correct > p.quizBest) p.quizBest = correct;
  p.badges = computeBadges(p);
  saveProgress(p);
  if (correct === perPlay) {
    pushToast({ emoji: '👑', title: '全問正解！チョークマスター！', accent: true });
  }
  notifyLevelAndBadges(prev, p);
  return p;
}
