import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BASE, SITE_NAME, navigateTo } from '../utils/nav';
import { CHALK_CARDS, CATEGORY_LABEL, TOTAL_CARDS } from '../data/chalkCards';
import type { CardCategory } from '../data/chalkCards';
import { loadProgress, discoveredCount, masterySum } from '../utils/progress';
import { ChalkIcon } from './ChalkIcon';

function rarityStars(n: number): string {
  return '★'.repeat(n) + '☆'.repeat(3 - n);
}

export function Dex() {
  const [progress, setProgress] = useState(loadProgress());
  const [filter, setFilter] = useState<CardCategory | 'all'>('all');
  const [onlyFound, setOnlyFound] = useState(false);

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
      <h1 className="quiz-h1"><ChalkIcon motif="play-dex" size={28} className="h1-icon" />チョーク図鑑</h1>
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
          <span className="dex-stat-label">習熟MAX</span>
        </div>
      </div>
      <div className="dex-progress-bar"><span style={{ width: `${TOTAL_CARDS ? (found / TOTAL_CARDS) * 100 : 0}%` }} /></div>

      {found <= 1 && (
        <a
          className="dex-guide"
          href={`${BASE}/map/`}
          onClick={(e) => { e.preventDefault(); navigateTo('/map/'); }}
        >
          <strong>{found === 1 ? 'さいしょの1枚をプレゼント！' : 'まだカードがありません。'}</strong>
          よみものを最後まで読むと、ここにカードが集まります。まずは「旅のマップ」から読んでみよう！
        </a>
      )}

      <div className="dex-filters" role="group" aria-label="図鑑の絞り込み">
        <button className={`dex-chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>すべて</button>
        {categories.map((cat) => (
          <button key={cat} className={`dex-chip ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
            {CATEGORY_LABEL[cat]}
          </button>
        ))}
        <button
          className={`dex-chip dex-chip-toggle ${onlyFound ? 'active' : ''}`}
          onClick={() => setOnlyFound((v) => !v)}
          aria-pressed={onlyFound}
        >
          {onlyFound ? '☑' : '☐'} 発見済みのみ
        </button>
      </div>

      {(() => {
        const visibleCats = filter === 'all' ? categories : [filter];
        const rendered = visibleCats
          .map((cat) => {
            const cards = CHALK_CARDS.filter(
              (c) => c.category === cat && (!onlyFound || (progress.cards[c.id]?.discovered ?? false))
            );
            if (cards.length === 0) return null;
            return (
              <section key={cat} className="dex-category">
                <h2 className="dex-category-title">{CATEGORY_LABEL[cat]}</h2>
                <div className="dex-grid">
                  {cards.map((card) => {
                    const cs = progress.cards[card.id];
                    const discovered = cs?.discovered ?? false;
                    const mastery = cs?.mastery ?? 0;
                    if (!discovered) {
                      return (
                        <div key={card.id} className="dex-card locked">
                          <div className="dex-locked-tile" aria-hidden="true">?</div>
                          <div className="dex-card-name">？？？</div>
                        </div>
                      );
                    }
                    return (
                      <div key={card.id} className={`dex-card rarity-${card.rarity}`}>
                        <div className="dex-card-rarity" title={`レア度 ${card.rarity}`}>{rarityStars(card.rarity)}</div>
                        <ChalkIcon motif={card.id} size={60} className="dex-card-art" />
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
            );
          })
          .filter(Boolean);
        if (rendered.length === 0) {
          return (
            <p className="dex-empty">
              {onlyFound ? 'まだ発見したカードがありません。よみものを最後まで読むと発見できます。' : '該当するカードがありません。'}
            </p>
          );
        }
        return rendered;
      })()}

      <div className="dex-cta">
        <a className="quiz-btn-primary" href={`${BASE}/guess/`} onClick={(e) => { e.preventDefault(); navigateTo('/guess/'); }}>
          集めたカードで絵当てクイズ
        </a>
        <a className="quiz-btn-ghost" href={`${BASE}/quiz/`} onClick={(e) => { e.preventDefault(); navigateTo('/quiz/'); }}>
          チョーク検定で習熟度を上げる
        </a>
      </div>
      <div className="quiz-back">
        <a href={`${BASE}/`} onClick={(e) => { e.preventDefault(); navigateTo('/'); }}><ArrowLeft size={16} /> トップへ戻る</a>
      </div>
    </article>
  );
}
