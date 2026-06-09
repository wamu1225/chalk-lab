import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BASE, SITE_NAME, navigateTo } from '../utils/nav';
import { sections } from '../data/sections';
import { SECTION_ICON } from '../data/chalkIcons';
import { ChalkIcon } from './ChalkIcon';
import { loadProgress } from '../utils/progress';

export function AdventureMap() {
  const [visited, setVisited] = useState<string[]>([]);

  useEffect(() => {
    document.title = `チョークの旅マップ | ${SITE_NAME}`;
    window.scrollTo(0, 0);
    setVisited(loadProgress().visitedSections);
  }, []);

  const done = new Set(visited);
  const nextIdx = sections.findIndex((s) => !done.has(s.id));

  return (
    <article className="map-screen">
      <h1 className="quiz-h1">🗺️ チョークの旅</h1>
      <p className="quiz-lead">
        よみものをめぐる旅のマップです。読んだ地点には<strong>✓スタンプ</strong>。
        「つぎはここ！」の地点から読み進めて、ぜんぶ踏破しよう！
      </p>
      <div className="map-progress">{done.size} / {sections.length} 地点 踏破</div>

      <ol className="map-path">
        {sections.map((s, i) => {
          const isDone = done.has(s.id);
          const isNext = i === nextIdx;
          return (
            <li key={s.id} className={`map-stop ${isDone ? 'done' : ''} ${isNext ? 'next' : ''}`}>
              <a
                href={`${BASE}/${s.id}/`}
                onClick={(e) => { e.preventDefault(); navigateTo(`/${s.id}/`); }}
              >
                <span className="map-node">
                  <ChalkIcon motif={SECTION_ICON[s.id]} size={52} />
                  {isDone && <span className="map-check" aria-label="読了">✓</span>}
                </span>
                <span className="map-stop-body">
                  <span className="map-stop-title">{i + 1}. {s.shortTitle}</span>
                  {isNext && <span className="map-stop-tag">つぎはここ！</span>}
                  {isDone && !isNext && <span className="map-stop-read">読了ずみ</span>}
                </span>
              </a>
            </li>
          );
        })}
        <li className="map-goal">🏆 ゴール：チョーク博士！</li>
      </ol>

      <div className="quiz-back">
        <a href={`${BASE}/`} onClick={(e) => { e.preventDefault(); navigateTo('/'); }}><ArrowLeft size={16} /> トップへ戻る</a>
      </div>
    </article>
  );
}
