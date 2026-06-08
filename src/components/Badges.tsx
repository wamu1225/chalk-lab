import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BASE, SITE_NAME, navigateTo } from '../utils/nav';
import { BADGES } from '../data/badges';
import { loadProgress } from '../utils/progress';
import { sections } from '../data/sections';
import { QUIZ_PER_PLAY } from '../data/quiz';

export function Badges() {
  const [progress, setProgress] = useState(loadProgress());

  useEffect(() => {
    document.title = `あつめたバッジ | ${SITE_NAME}`;
    window.scrollTo(0, 0);
    setProgress(loadProgress());
  }, []);

  const earned = new Set(BADGES.filter((b) => b.earned(progress)).map((b) => b.id));
  const earnedCount = earned.size;

  return (
    <article className="badges-screen">
      <h1 className="quiz-h1">🏆 あつめたバッジ</h1>
      <p className="quiz-lead">
        よみものを読んだり、チョーク検定に挑戦したりすると、バッジがあつまります。
        いまの達成：<strong>{earnedCount} / {BADGES.length}</strong> 個。
      </p>

      <div className="badge-stats">
        <div className="badge-stat">
          <span className="badge-stat-num">{progress.visitedSections.length} / {sections.length}</span>
          <span className="badge-stat-label">読んだよみもの</span>
        </div>
        <div className="badge-stat">
          <span className="badge-stat-num">{progress.quizBest} / {QUIZ_PER_PLAY}</span>
          <span className="badge-stat-label">検定の最高記録</span>
        </div>
      </div>

      <div className="badge-grid">
        {BADGES.map((b) => {
          const has = earned.has(b.id);
          return (
            <div key={b.id} className={`badge-card ${has ? 'earned' : 'locked'}`}>
              <div className="badge-emoji" aria-hidden="true">{has ? b.emoji : '🔒'}</div>
              <div className="badge-name">{b.name}</div>
              <div className="badge-desc">{b.desc}</div>
            </div>
          );
        })}
      </div>

      <div className="badge-cta">
        <a className="quiz-btn-primary" href={`${BASE}/quiz/`} onClick={(e) => { e.preventDefault(); navigateTo('/quiz/'); }}>
          チョーク検定に挑戦
        </a>
      </div>
      <div className="quiz-back">
        <a href={`${BASE}/`} onClick={(e) => { e.preventDefault(); navigateTo('/'); }}><ArrowLeft size={16} /> トップへ戻る</a>
      </div>
    </article>
  );
}
