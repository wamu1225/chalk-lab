import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BASE, SITE_NAME, navigateTo } from '../utils/nav';
import { ChalkIcon } from './ChalkIcon';
import { BADGES } from '../data/badges';
import { loadProgress } from '../utils/progress';
import { LevelBanner } from './LevelBanner';
import { BadgeMedal } from './BadgeMedal';
import { sections } from '../data/sections';
import { QUIZ_PER_PLAY } from '../data/quiz';

export function Badges() {
  const [progress, setProgress] = useState(loadProgress());

  useEffect(() => {
    document.title = `ステータス＆バッジ | ${SITE_NAME}`;
    window.scrollTo(0, 0);
    setProgress(loadProgress());
  }, []);

  const earned = new Set(BADGES.filter((b) => b.earned(progress)).map((b) => b.id));
  const earnedCount = earned.size;

  return (
    <article className="badges-screen">
      <h1 className="quiz-h1"><ChalkIcon motif="play-badges" size={28} className="h1-icon" />ステータス＆バッジ</h1>
      <LevelBanner />
      {earnedCount === BADGES.length && (
        <div className="complete-banner" role="status">
          <ChalkIcon motif="play-badges" size={40} className="complete-banner-icon" />
          <div>
            <strong>コンプリート達成！</strong>
            すべてのバッジを集めました。チョークのことなら、もうあなたは博士です！
          </div>
        </div>
      )}
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
        {[...BADGES]
          .sort((a, b) => (earned.has(b.id) ? 1 : 0) - (earned.has(a.id) ? 1 : 0))
          .map((b) => {
            const has = earned.has(b.id);
            const prog = !has && b.progress ? b.progress(progress) : null;
            const pct = prog ? Math.min(100, Math.round((prog.now / prog.goal) * 100)) : 0;
            return (
              <div key={b.id} className={`badge-card ${has ? 'earned' : 'locked'}`}>
                <BadgeMedal id={b.id} earned={has} size={58} className="badge-medal" />
                <div className="badge-name">{b.name}</div>
                <div className="badge-desc">{b.desc}</div>
                {prog && (
                  <div className="badge-progress">
                    <span className="badge-progress-bar"><span style={{ width: `${pct}%` }} /></span>
                    <span className="badge-progress-num">{prog.now} / {prog.goal}</span>
                  </div>
                )}
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
