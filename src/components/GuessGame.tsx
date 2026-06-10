import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BASE, SITE_NAME, navigateTo } from '../utils/nav';
import { CHALK_CARDS } from '../data/chalkCards';
import type { ChalkCard } from '../data/chalkCards';
import { loadProgress, masterCard } from '../utils/progress';
import { ChalkIcon } from './ChalkIcon';
import { CharaChalk } from './CharaChalk';

const ROUNDS = 8;

type Round = { card: ChalkCard; options: string[]; answer: number };
type Phase = 'intro' | 'playing' | 'result';

function shuffle<T>(a: T[]): T[] {
  const r = [...a];
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function buildRounds(discovered: ChalkCard[]): Round[] {
  return shuffle(discovered).slice(0, ROUNDS).map((card) => {
    const distractors = shuffle(CHALK_CARDS.filter((c) => c.id !== card.id)).slice(0, 3);
    const options = shuffle([card, ...distractors]).map((c) => c.name);
    return { card, options, answer: options.indexOf(card.name) };
  });
}

export function GuessGame() {
  const [discovered, setDiscovered] = useState<ChalkCard[]>([]);
  const [phase, setPhase] = useState<Phase>('intro');
  const [rounds, setRounds] = useState<Round[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);

  useEffect(() => {
    document.title = `チョーク絵当て | ${SITE_NAME}`;
    window.scrollTo(0, 0);
    const p = loadProgress();
    setDiscovered(CHALK_CARDS.filter((c) => p.cards[c.id]?.discovered));
  }, []);

  const start = () => {
    setRounds(buildRounds(discovered));
    setIndex(0); setSelected(null); setAnswered(false); setCorrect(0);
    setPhase('playing');
  };

  const choose = (i: number) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    if (i === rounds[index].answer) {
      setCorrect((c) => c + 1);
      masterCard(rounds[index].card.id); // 正解で図鑑の習熟度UP
    }
  };

  const next = () => {
    if (index >= rounds.length - 1) setPhase('result');
    else { setIndex((n) => n + 1); setSelected(null); setAnswered(false); }
  };

  // カードが少なすぎる場合の案内
  if (discovered.length < 2) {
    return (
      <article className="quiz-screen">
        <h1 className="quiz-h1"><ChalkIcon motif="play-guess" size={28} className="h1-icon" />チョーク絵当て</h1>
        <p className="quiz-lead">
          集めた図鑑カードの絵を見て、名前を当てるゲームです。
          図鑑カードが<strong>2枚</strong>あればあそべます（いまは{discovered.length}枚）。
          よみものを1つ読めば、すぐにあそべるよ！
        </p>
        <div className="quiz-modes">
          <a className="quiz-btn-primary" href={`${BASE}/map/`} onClick={(e) => { e.preventDefault(); navigateTo('/map/'); }}>旅マップでよみものへ</a>
        </div>
        <div className="quiz-back">
          <a href={`${BASE}/`} onClick={(e) => { e.preventDefault(); navigateTo('/'); }}><ArrowLeft size={16} /> トップへ戻る</a>
        </div>
      </article>
    );
  }

  if (phase === 'intro') {
    return (
      <article className="quiz-screen">
        <h1 className="quiz-h1"><ChalkIcon motif="play-guess" size={28} className="h1-icon" />チョーク絵当て</h1>
        <p className="quiz-lead">
          図鑑カードの絵を見て、正しい名前を当てよう。全{Math.min(ROUNDS, discovered.length)}問。
          正解すると、そのカードの<strong>習熟度（★）</strong>が上がります。
        </p>
        <div className="quiz-modes">
          <button className="quiz-btn-primary" onClick={start}>はじめる</button>
        </div>
        <div className="quiz-back">
          <a href={`${BASE}/dex/`} onClick={(e) => { e.preventDefault(); navigateTo('/dex/'); }}>図鑑を見る</a>
        </div>
      </article>
    );
  }

  if (phase === 'result') {
    const total = rounds.length;
    const perfect = correct === total;
    const passed = correct >= Math.ceil(total * 0.7);
    return (
      <article className="quiz-screen">
        <div className="quiz-result-emoji"><CharaChalk expr={perfect ? 'celebrate' : passed ? 'cheer' : 'normal'} size={80} /></div>
        <h1 className="quiz-h1">{perfect ? 'ぜんぶ正解！' : passed ? 'よくできました！' : 'おしい！'}</h1>
        <p className="quiz-score">{correct} / {total} 問 正解</p>
        <p className="quiz-chara-line">チョーくん：{perfect ? 'カードマスターだね！' : 'よみものを読むと、もっと分かるよ！'}</p>
        <div className="quiz-result-actions">
          <button className="quiz-btn-primary" onClick={start}>もう一度</button>
          <a className="quiz-btn-ghost" href={`${BASE}/dex/`} onClick={(e) => { e.preventDefault(); navigateTo('/dex/'); }}>図鑑を見る</a>
        </div>
        <div className="quiz-back">
          <a href={`${BASE}/`} onClick={(e) => { e.preventDefault(); navigateTo('/'); }}><ArrowLeft size={16} /> トップへ戻る</a>
        </div>
      </article>
    );
  }

  const cur = rounds[index];
  return (
    <article className="quiz-screen">
      <div className="quiz-progress-bar"><span style={{ width: `${(index / rounds.length) * 100}%` }} /></div>
      <div className="quiz-counter">第 {index + 1} 問 / {rounds.length}</div>
      <h1 className="quiz-question">これ、なんのチョーク？</h1>
      <div className="guess-figure"><ChalkIcon motif={cur.card.id} size={110} /></div>
      <div className="quiz-choices">
        {cur.options.map((name, i) => {
          let cls = 'quiz-choice';
          if (answered) {
            if (i === cur.answer) cls += ' correct';
            else if (i === selected) cls += ' wrong';
          }
          return (
            <button key={i} className={cls} onClick={() => choose(i)} disabled={answered}>{name}</button>
          );
        })}
      </div>
      {answered && (
        <div className={`quiz-explain ${selected === cur.answer ? 'ok' : 'ng'}`}>
          <strong>{selected === cur.answer ? '⭕ 正解！習熟度が上がった！' : `❌ せいかいは「${cur.card.name}」`}</strong>
          <p>{cur.card.front}</p>
          <button className="quiz-btn-primary quiz-next" onClick={next}>
            {index >= rounds.length - 1 ? '結果を見る' : '次の問題へ'}
          </button>
        </div>
      )}
    </article>
  );
}
