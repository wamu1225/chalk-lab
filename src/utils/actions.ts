// ユーザー行動の記録＋演出（トースト）を一手に集約する。
// 読了・検定終了などのイベントで、カード発見・レベルアップ・バッジ獲得を通知する。
import { loadProgress, saveProgress, markSectionVisited } from './progress';
import type { Progress, CraftedChalk } from './progress';
import { computeBadges, BADGES } from '../data/badges';
import { computeXp, levelInfo } from './level';
import { pushToast } from './toast';

function notifyLevelAndBadges(prev: Progress, next: Progress) {
  const prevLevel = levelInfo(computeXp(prev)).level;
  const nextInfo = levelInfo(computeXp(next));
  if (nextInfo.level > prevLevel) {
    pushToast({ mascot: 'celebrate', title: `レベルアップ！「${nextInfo.title}」`, accent: true, link: { label: 'ステータスを見る →', path: '/badges/' } });
  }
  const newBadges = next.badges.filter((b) => !prev.badges.includes(b));
  for (const id of newBadges) {
    const b = BADGES.find((x) => x.id === id);
    if (b) pushToast({ badgeId: id, title: `バッジ獲得：${b.name}`, link: { label: 'バッジを見る →', path: '/badges/' } });
  }
  // 全バッジ達成＝完全制覇の瞬間に特別な祝福
  if (prev.badges.length < BADGES.length && next.badges.length >= BADGES.length) {
    pushToast({ mascot: 'celebrate', title: '🏆 コンプリート達成！すべてのバッジを集めた！', accent: true, link: { label: 'ステータスを見る →', path: '/badges/' } });
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
    pushToast({ mascot: 'celebrate', title: '全問正解！チョークマスター！', accent: true });
  }
  notifyLevelAndBadges(prev, p);
  return p;
}

function yesterdayKey(todayKey: string): string {
  const [y, m, d] = todayKey.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

// チョーク工房：マイチョークを1本作る。棚に追加＋演出。
export function recordCraft(prev: Progress, chalk: CraftedChalk): Progress {
  const p = loadProgress();
  p.craftedChalks = [chalk, ...p.craftedChalks].slice(0, 50);
  p.badges = computeBadges(p);
  saveProgress(p);
  pushToast({ emoji: '🧪', title: `マイチョーク「${chalk.name}」完成！ ランク${chalk.rank}`, accent: true, link: { label: '工房を見る →', path: '/workshop/' } });
  notifyLevelAndBadges(prev, p);
  return p;
}

// 今日の検定の終了：通常の集計に加え、デイリー連続記録を更新する。
export function recordDailyFinish(prev: Progress, correct: number, perPlay: number, todayKey: string): Progress {
  const p = loadProgress();
  p.quizPlays += 1;
  if (correct > p.quizBest) p.quizBest = correct;
  if (p.dailyLastDate !== todayKey) {
    p.dailyStreak = p.dailyLastDate === yesterdayKey(todayKey) ? p.dailyStreak + 1 : 1;
    p.dailyLastDate = todayKey;
    pushToast({ mascot: 'cheer', title: `🗓️ 今日の検定クリア！ ${p.dailyStreak}日連続`, accent: true });
  }
  p.badges = computeBadges(p);
  saveProgress(p);
  if (correct === perPlay) {
    pushToast({ mascot: 'celebrate', title: '全問正解！チョークマスター！', accent: true });
  }
  notifyLevelAndBadges(prev, p);
  return p;
}
