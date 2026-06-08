import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BASE, SITE_NAME, navigateTo } from '../utils/nav';
import { CHALK_CARDS, CATEGORY_LABEL, TOTAL_CARDS } from '../data/chalkCards';
import type { CardCategory } from '../data/chalkCards';
import { loadProgress, discoveredCount, masterySum } from '../utils/progress';

function rarityStars(n: number): string {
  return '★'.repeat(n) + '☆'.repeat(3 - n);
}

export function Dex() {
  const [progress, setProgress] = useState(loadProgress());

  useEffect(() => {
    document.title = `チョーク図鑑 | ${SITE_NAME}`;
    window.scrollTo(0, 0);
    setProgress(loadProgress());
  }, []);

  const found = discoveredCount(progress);
  const maxMastery = TOTAL_CARDS * 3;
  const masteryPct = maxMastery ? Math.round((masterySum(progress) / maxMastery) * 100) : 0;

  // カテゴリ順に並べる
  const categories = Array.from(new Set(CHALK_CARDS.map((c) => c.category))) as CardCategory[];

  return (
    <article className="dex-screen">
      <h1 className="quiz-h1">📚 チョーク図鑑</h1>
      <p className="quiz-lead">
        よみものを読むとカードを<strong>発見</strong>、チョーク検定に正解すると<strong>習熟度（★）</strong>が上がります。
        ぜんぶ集めて、チョーク博士になろう！
      </p>

      <div className="dex-stats">
        <div className="dex-stat">
          <span className="dex-stat-num">{found} / {TOTAL_CARDS}</span>
          <span className="dex-stat-label">あつめたカード</span>
        </div>
        <div className="dex-stat">
          <span className="dex-stat-num">{masteryPct}%</span>
          <span className="dex-stat-label">習熟度コンプ</span>
        </div>
      </div>
      <div className="dex-progress-bar"><span style={{ width: `${TOTAL_CARDS ? (found / TOTAL_CARDS) * 100 : 0}%` }} /></div>

      {categories.map((cat) => (
        <section key={cat} className="dex-category">
          <h2 className="dex-category-title">{CATEGORY_LABEL[cat]}</h2>
          <div className="dex-grid">
            {CHALK_CARDS.filter((c) => c.category === cat).map((card) => {
              const cs = progress.cards[card.id];
              const discovered = cs?.discovered ?? false;
              const mastery = cs?.mastery ?? 0;
              if (!discovered) {
                return (
                  <div key={card.id} className="dex-card locked">
                    <div className="dex-card-emoji" aria-hidden="true">🔒</div>
                    <div className="dex-card-name">？？？</div>
                    <div className="dex-card-hint">よみものを読むと発見</div>
                  </div>
                );
              }
              return (
                <div key={card.id} className={`dex-card rarity-${card.rarity}`}>
                  <div className="dex-card-rarity" title={`レア度 ${card.rarity}`}>{rarityStars(card.rarity)}</div>
                  <div className="dex-card-emoji" aria-hidden="true">{card.emoji}</div>
                  <div className="dex-card-name">{card.name}</div>
                  <p className="dex-card-front">{card.front}</p>
                  <p className="dex-card-back">{card.back}</p>
                  <div className="dex-card-mastery" aria-label={`習熟度 ${mastery} / 3`}>
                    習熟 {'⭐'.repeat(mastery)}{'·'.repeat(3 - mastery)}
                  </div>
                  <a
                    className="dex-card-link"
                    href={`${BASE}/${card.relatedSectionId}/`}
                    onClick={(e) => { e.preventDefault(); navigateTo(`/${card.relatedSectionId}/`); }}
                  >
                    くわしく読む →
                  </a>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <div className="dex-cta">
        <a className="quiz-btn-primary" href={`${BASE}/quiz/`} onClick={(e) => { e.preventDefault(); navigateTo('/quiz/'); }}>
          チョーク検定で習熟度を上げる
        </a>
      </div>
      <div className="quiz-back">
        <a href={`${BASE}/`} onClick={(e) => { e.preventDefault(); navigateTo('/'); }}><ArrowLeft size={16} /> トップへ戻る</a>
      </div>
    </article>
  );
}
