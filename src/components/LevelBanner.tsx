import { useEffect, useState } from 'react';
import { loadProgress } from '../utils/progress';
import { computeXp, levelInfo, LEVELS } from '../utils/level';

export function LevelBanner({ compact = false }: { compact?: boolean }) {
  const [xp, setXp] = useState(0);

  useEffect(() => {
    setXp(computeXp(loadProgress()));
  }, []);

  const info = levelInfo(xp);
  const pct = info.span > 0 ? Math.min(100, Math.round((info.intoLevel / info.span) * 100)) : 100;
  const nextTitle = info.nextMin !== null ? LEVELS[info.level]?.title : null;

  return (
    <div className={`level-banner ${compact ? 'compact' : ''}`}>
      <div className="level-banner-head">
        <span className="level-badge">Lv.{info.level}</span>
        <span className="level-title">{info.title}</span>
        <span className="level-xp">{info.xp} XP</span>
      </div>
      <div className="level-bar"><span style={{ width: `${pct}%` }} /></div>
      <div className="level-foot">
        {info.isMax
          ? '最高レベル到達！チョークのすべてを極めた'
          : `あと ${info.toNext} XP で「${nextTitle}」`}
      </div>
    </div>
  );
}
