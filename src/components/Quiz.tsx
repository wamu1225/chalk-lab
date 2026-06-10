import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Award, Flame } from 'lucide-react';
import { BASE, SITE_NAME, navigateTo } from '../utils/nav';
import { QUIZ, QUIZ_PASS, QUIZ_PER_PLAY, buildQuizPlay, buildDailyPlay, getTodayKey } from '../data/quiz';
import type { QuizQuestion } from '../data/quiz';
import { loadProgress, masterCard } from '../utils/progress';
import type { Progress } from '../utils/progress';
import { recordQuizFinish, recordDailyFinish } from '../utils/actions';
import { getCard } from '../data/chalkCards';
import { ChalkIcon } from './ChalkIcon';
import { CharaChalk } from './CharaChalk';

type Phase = 'intro' | 'playing' | 'result';

export function Quiz() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [play, setPlay] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [mode, setMode] = useState<'random' | 'daily'>('random');
  const [dailyDone, setDailyDone] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(0);
  const startSnap = useRef<Progress | null>(null);

  useEffect(() => {
    document.title = `チョーク検定 | ${SITE_NAME}`;
    window.scrollTo(0, 0);
    const pr = loadProgress();
    setBest(pr.quizBest);
    setDailyDone(pr.dailyLastDate === getTodayKey());
    setDailyStreak(pr.dailyStreak);
  }, []);

  const total = play.length || QUIZ_PER_PLAY;

  const start = (m: 'random' | 'daily' = 'random') => {
    setMode(m);
    startSnap.current = loadProgress();
    setPlay(m === 'daily' ? buildDailyPlay(getTodayKey()) : buildQuizPlay());
    setIndex(0);
    setSelected(null);
    setAnswered(false);
    setCorrect(0);
    setStreak(0);
    setMaxStreak(0);
    setPhase('playing');
  };

  const choose = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === play[index].answer) {
      setCorrect((c) => c + 1);
      setStreak((s) => {
        const ns = s + 1;
        setMaxStreak((m) => Math.max(m, ns));
        return ns;
      });
      const cardId = play[index].relatedCardId;
      if (cardId) masterCard(cardId);
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    if (index >= play.length - 1) {
      const prev = startSnap.current ?? loadProgress();
      const p = mode === 'daily'
        ? recordDailyFinish(prev, correct, play.length, getTodayKey())
        : recordQuizFinish(prev, correct, play.length);
      setBest(p.quizBest);
      setDailyDone(p.dailyLastDate === getTodayKey());
      setDailyStreak(p.dailyStreak);
      setPhase('result');
    } else {
      setIndex((n) => n + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  if (phase === 'intro') {
    return (
      <article className="quiz-screen">
        <h1 className="quiz-h1">📝 チョーク検定</h1>
        <p className="quiz-lead">
          全{QUIZ.length}問の中から、毎回ランダムに{QUIZ_PER_PLAY}問を出題。
          {QUIZ_PASS}問以上の正解で合格です。選択肢の並びも毎回シャッフルされます。
          <br />「今日の検定」は全員おなじ{QUIZ_PER_PLAY}問。毎日挑戦して連続記録をのばそう。
        </p>
        {best > 0 && <p className="quiz-best">これまでの最高記録：{best} / {QUIZ_PER_PLAY} 問</p>}
        <div className="quiz-modes">
          <button className="quiz-btn-primary" onClick={() => start('random')}>ランダム検定をはじめる</button>
          <button className="quiz-btn-daily" onClick={() => start('daily')}>🗓️ 今日の検定{dailyDone ? '（今日クリア済み）' : ''}</button>
        </div>
        {dailyStreak > 0 && <p className="quiz-best">今日の検定 連続記録：{dailyStreak}日{dailyDone ? '（今日クリア済み）' : ''}</p>}
        <div className="quiz-back">
          <a href={`${BASE}/`} onClick={(e) => { e.preventDefault(); navigateTo('/'); }}><ArrowLeft size={16} /> トップへ戻る</a>
        </div>
      </article>
    );
  }

  if (phase === 'result') {
    const passed = correct >= QUIZ_PASS;
    const perfect = correct === total;
    return (
      <article className="quiz-screen">
        <div className="quiz-result-emoji"><CharaChalk expr={perfect ? 'celebrate' : passed ? 'cheer' : 'normal'} size={80} /></div>
        <h1 className="quiz-h1">{perfect ? '全問正解！チョークマスター！' : passed ? '合格！おめでとう' : 'もう少し！'}</h1>
        <p className="quiz-chara-line">{perfect ? 'チョーくん：かんぺき！きみはチョーク博士だ！' : passed ? 'チョーくん：合格おめでとう！その調子！' : 'チョーくん：だいじょうぶ、よみものを読めばもっと解けるよ！'}</p>
        <p className="quiz-score">{correct} / {total} 問 正解</p>
        <p className="quiz-best">最高記録：{best} / {QUIZ_PER_PLAY} 問 ／ 最高連続正解：{maxStreak}</p>
        <div className="quiz-result-actions">
          <button className="quiz-btn-primary" onClick={() => start('random')}>もう一度（別の問題で）</button>
          <a className="quiz-btn-ghost" href={`${BASE}/badges/`} onClick={(e) => { e.preventDefault(); navigateTo('/badges/'); }}>
            <Award size={16} /> バッジを見る
          </a>
        </div>
        {!passed && (
          <p className="quiz-hint">💡 よみものを読み返すと、ぐっと解きやすくなります。</p>
        )}
        <div className="quiz-back">
          <a href={`${BASE}/`} onClick={(e) => { e.preventDefault(); navigateTo('/'); }}><ArrowLeft size={16} /> トップへ戻る</a>
        </div>
      </article>
    );
  }

  const cur = play[index];
  return (
    <article className="quiz-screen">
      <div className="quiz-progress-bar"><span style={{ width: `${(index / total) * 100}%` }} /></div>
      <div className="quiz-topbar">
        <span className="quiz-counter">第 {index + 1} 問 / {total}</span>
        <span className="quiz-difficulty" title={`難易度 ${cur.difficulty}`}>{'★'.repeat(cur.difficulty)}{'☆'.repeat(3 - cur.difficulty)}</span>
        {streak >= 2 && <span className="quiz-combo"><Flame size={14} /> {streak} 連続正解！</span>}
      </div>
      <h1 className="quiz-question">{cur.q}</h1>
      <div className="quiz-choices">
        {cur.choices.map((c, i) => {
          let cls = 'quiz-choice';
          if (answered) {
            if (i === cur.answer) cls += ' correct';
            else if (i === selected) cls += ' wrong';
          }
          return (
            <button key={i} className={cls} onClick={() => choose(i)} disabled={answered}>
              {c}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className={`quiz-explain ${selected === cur.answer ? 'ok' : 'ng'}`}>
          <strong>{selected === cur.answer ? '⭕ 正解！' : '❌ ざんねん'}</strong>
          {selected === cur.answer && cur.relatedCardId && getCard(cur.relatedCardId) && (
            <p className="quiz-card-up">
              <ChalkIcon motif={cur.relatedCardId} size={20} className="quiz-card-up-icon" />
              図鑑「{getCard(cur.relatedCardId)!.name}」の習熟度が上がった！
            </p>
          )}
          <p>{cur.explain}</p>
          {cur.relatedSectionId && (
            <a href={`${BASE}/${cur.relatedSectionId}/`} onClick={(e) => { e.preventDefault(); navigateTo(`/${cur.relatedSectionId}/`); }}>
              くわしく読む →
            </a>
          )}
          <button className="quiz-btn-primary quiz-next" onClick={next}>
            {index >= play.length - 1 ? '結果を見る' : '次の問題へ'}
          </button>
        </div>
      )}
    </article>
  );
}
