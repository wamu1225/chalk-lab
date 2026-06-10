// チョークラボの学習進捗（localStorage）。キーはサイト固有にする。
import { cardsForSection } from '../data/chalkCards';

const KEY = 'chalk-lab:progress';

export type CardState = {
  discovered: boolean;       // 関連よみものを読んで発見済みか
  mastery: 0 | 1 | 2 | 3;    // クイズ正解で上がる習熟度
};

export type Progress = {
  visitedSections: string[]; // 閲覧したセクションid
  quizPlays: number;         // クイズ挑戦回数
  quizBest: number;          // クイズ最高正解数
  badges: string[];          // 獲得バッジid
  cards: Record<string, CardState>; // 図鑑カードの状態（cardId → 状態）
  dailyLastDate: string;     // 今日の検定に最後に挑戦した日（YYYY-MM-DD）
  dailyStreak: number;       // 今日の検定の連続挑戦日数
  craftedChalks: CraftedChalk[]; // チョーク工房で作った「マイチョーク」
};

export type CraftedChalk = { name: string; rank: string; overall: number; ts: number };

const DEFAULT: Progress = { visitedSections: [], quizPlays: 0, quizBest: 0, badges: [], cards: {}, dailyLastDate: '', dailyStreak: 0, craftedChalks: [] };

// 初回訪問のウェルカムカード（コールドスタート緩和）。
// 「白墨」1枚を最初から発見済みにして、図鑑が空っぽの状態で始まらないようにする。
const WELCOME_CARD_ID = 'white-chalk';

function freshProgress(): Progress {
  return { ...DEFAULT, cards: { [WELCOME_CARD_ID]: { discovered: true, mastery: 0 } } };
}

function sanitizeCards(raw: unknown): Record<string, CardState> {
  const out: Record<string, CardState> = {};
  if (!raw || typeof raw !== 'object') return out;
  for (const [id, v] of Object.entries(raw as Record<string, unknown>)) {
    if (!v || typeof v !== 'object') continue;
    const c = v as { discovered?: unknown; mastery?: unknown };
    const mastery = typeof c.mastery === 'number' ? Math.max(0, Math.min(3, Math.floor(c.mastery))) : 0;
    out[id] = { discovered: c.discovered === true, mastery: mastery as 0 | 1 | 2 | 3 };
  }
  return out;
}

export function loadProgress(): Progress {
  if (typeof window === 'undefined') return freshProgress();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return freshProgress();
    const p = JSON.parse(raw);
    return {
      visitedSections: Array.isArray(p.visitedSections) ? p.visitedSections : [],
      quizPlays: typeof p.quizPlays === 'number' ? p.quizPlays : 0,
      quizBest: typeof p.quizBest === 'number' ? p.quizBest : 0,
      badges: Array.isArray(p.badges) ? p.badges : [],
      cards: sanitizeCards(p.cards),
      dailyLastDate: typeof p.dailyLastDate === 'string' ? p.dailyLastDate : '',
      dailyStreak: typeof p.dailyStreak === 'number' ? p.dailyStreak : 0,
      craftedChalks: Array.isArray(p.craftedChalks)
        ? p.craftedChalks.filter((c: unknown): c is CraftedChalk =>
            !!c && typeof c === 'object' &&
            typeof (c as CraftedChalk).name === 'string' &&
            typeof (c as CraftedChalk).rank === 'string').slice(0, 50)
        : [],
    };
  } catch {
    return freshProgress();
  }
}

export function saveProgress(p: Progress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // ignore quota / privacy mode errors
  }
}

function ensureCard(p: Progress, id: string): CardState {
  if (!p.cards[id]) p.cards[id] = { discovered: false, mastery: 0 };
  return p.cards[id];
}

// 戻り値：この訪問で新たに発見されたカードidの配列（発見演出に使う）
export function markSectionVisited(id: string): string[] {
  const p = loadProgress();
  let changed = false;
  const newlyDiscovered: string[] = [];
  if (!p.visitedSections.includes(id)) {
    p.visitedSections.push(id);
    changed = true;
  }
  // この記事に紐づくカードを「発見」状態にする
  for (const card of cardsForSection(id)) {
    const cs = ensureCard(p, card.id);
    if (!cs.discovered) { cs.discovered = true; changed = true; newlyDiscovered.push(card.id); }
  }
  if (changed) saveProgress(p);
  return newlyDiscovered;
}

// クイズ正解時：カードの習熟度を1つ上げる（最大3）。未発見なら発見もする。
export function masterCard(cardId: string): void {
  const p = loadProgress();
  const cs = ensureCard(p, cardId);
  cs.discovered = true;
  if (cs.mastery < 3) cs.mastery = (cs.mastery + 1) as 0 | 1 | 2 | 3;
  saveProgress(p);
}

export function discoveredCount(p: Progress): number {
  return Object.values(p.cards).filter((c) => c.discovered).length;
}

export function masterySum(p: Progress): number {
  return Object.values(p.cards).reduce((sum, c) => sum + (c.discovered ? c.mastery : 0), 0);
}
