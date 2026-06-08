import { useEffect, useState } from 'react';
import { ArrowLeft, Award } from 'lucide-react';
import { BASE, SITE_NAME, navigateTo } from '../utils/nav';
import { QUIZ, QUIZ_PASS } from '../data/quiz';
import { loadProgress, saveProgress, masterCard } from '../utils/progress';
import { getCard } from '../data/chalkCards';
import { ChalkIcon } from './ChalkIcon';
import { computeBadges } from '../data/badges';

type Phase = 'intro' | 'playing' | 'result';

export function Quiz() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [best, setBest] = useState(0);

  useEffect(() => {
    document.title = `チョーク検定 | ${SITE_NAME}`;
    window.scrollTo(0, 0);
    setBest(loadProgress().quizBest);
  }, []);

  const start = () => {
    setIndex(0);
    setSelected(null);
    setAnswered(false);
    setCorrect(0);
    setPhase('playing');
  };

  const choose = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === QUIZ[index].answer) {
      setCorrect((c) => c + 1);
      // 正解したら関連する図鑑カードの習熟度を上げる
      const cardId = QUIZ[index].relatedCardId;
      if (cardId) masterCard(cardId);
    }
  };

  const next = () => {
    if (index >= QUIZ.length - 1) {
      const finalCorrect = correct;
      const p = loadProgress();
      p.quizPlays += 1;
      if (finalCorrect > p.quizBest) p.quizBest = finalCorrect;
      p.badges = computeBadges(p);
      saveProgress(p);
      setBest(p.quizBest);
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
          チョークの科学・歴史・トリビアから全{QUIZ.length}問。
          {QUIZ_PASS}問以上の正解で合格です。よみものを読んでから挑戦すると解きやすいですよ。
        </p>
        {best > 0 && <p className="quiz-best">これまでの最高記録：{best} / {QUIZ.length} 問</p>}
        <button className="quiz-btn-primary" onClick={start}>検定をはじめる</button>
        <div className="quiz-back">
          <a href={`${BASE}/`} onClick={(e) => { e.preventDefault(); navigateTo('/'); }}><ArrowLeft size={16} /> トップへ戻る</a>
        </div>
      </article>
    );
  }

  if (phase === 'result') {
    const passed = correct >= QUIZ_PASS;
    const perfect = correct === QUIZ.length;
    return (
      <article className="quiz-screen">
        <div className="quiz-result-emoji" aria-hidden="true">{perfect ? '👑' : passed ? '🏅' : '✏️'}</div>
        <h1 className="quiz-h1">{perfect ? '全問正解！チョークマスター！' : passed ? '合格！おめでとう' : 'もう少し！'}</h1>
        <p className="quiz-score">{correct} / {QUIZ.length} 問 正解</p>
        <p className="quiz-best">最高記録：{best} / {QUIZ.length} 問</p>
        <div className="quiz-result-actions">
          <button className="quiz-btn-primary" onClick={start}>もう一度挑戦</button>
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

  const cur = QUIZ[index];
  return (
    <article className="quiz-screen">
      <div className="quiz-progress-bar"><span style={{ width: `${((index) / QUIZ.length) * 100}%` }} /></div>
      <div className="quiz-counter">第 {index + 1} 問 / {QUIZ.length}</div>
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
            {index >= QUIZ.length - 1 ? '結果を見る' : '次の問題へ'}
          </button>
        </div>
      )}
    </article>
  );
}
