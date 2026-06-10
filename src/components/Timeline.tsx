import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BASE, SITE_NAME, navigateTo } from '../utils/nav';
import { TIMELINE } from '../data/timeline';
import { ChalkIcon } from './ChalkIcon';

export function Timeline() {
  const [i, setI] = useState(0);

  useEffect(() => {
    document.title = `チョーク誕生の旅 | ${SITE_NAME}`;
    window.scrollTo(0, 0);
  }, []);

  const step = TIMELINE[i];
  const last = i === TIMELINE.length - 1;

  return (
    <article className="timeline-screen">
      <h1 className="quiz-h1"><ChalkIcon motif="play-timeline" size={28} className="h1-icon" />チョーク誕生の旅</h1>
      <p className="quiz-lead">毎日のチョークは、何千万年も前の小さな生き物からできました。順番にたどってみよう。</p>

      <div className="timeline-stage">
        <svg viewBox="0 0 300 170" className="timeline-svg" role="img" aria-label={step.title} dangerouslySetInnerHTML={{ __html: step.svg }} />
      </div>

      <div className="timeline-dots" role="tablist" aria-label="ステップ">
        {TIMELINE.map((_, k) => (
          <button key={k} className={`tl-dot ${k === i ? 'active' : ''}`} onClick={() => setI(k)} aria-label={`ステップ ${k + 1}`} aria-selected={k === i} role="tab" />
        ))}
      </div>

      <h2 className="timeline-title">{step.title}</h2>
      <p className="timeline-body">{step.body}</p>

      <div className="timeline-nav">
        <button className="quiz-btn-ghost" onClick={() => setI((n) => Math.max(0, n - 1))} disabled={i === 0}>← まえ</button>
        <span className="timeline-count">{i + 1} / {TIMELINE.length}</span>
        {last ? (
          <a className="quiz-btn-primary" href={`${BASE}/geology/`} onClick={(e) => { e.preventDefault(); navigateTo('/geology/'); }}>くわしく読む →</a>
        ) : (
          <button className="quiz-btn-primary" onClick={() => setI((n) => n + 1)}>つぎ →</button>
        )}
      </div>

      <div className="quiz-back">
        <a href={`${BASE}/`} onClick={(e) => { e.preventDefault(); navigateTo('/'); }}><ArrowLeft size={16} /> トップへ戻る</a>
      </div>
    </article>
  );
}
