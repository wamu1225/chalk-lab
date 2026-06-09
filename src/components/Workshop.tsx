import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BASE, SITE_NAME, navigateTo } from '../utils/nav';
import { DEFAULT_RECIPE, INGREDIENTS, SCORE_BARS, computeScores } from '../data/workshop';
import type { Recipe } from '../data/workshop';
import { loadProgress } from '../utils/progress';
import type { Progress } from '../utils/progress';
import { recordCraft } from '../utils/actions';

function formatDate(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export function Workshop() {
  const [recipe, setRecipe] = useState<Recipe>(DEFAULT_RECIPE);
  const [name, setName] = useState('');
  const [progress, setProgress] = useState<Progress>(loadProgress());
  const startSnap = useRef<Progress | null>(null);

  useEffect(() => {
    document.title = `チョーク工房 | ${SITE_NAME}`;
    window.scrollTo(0, 0);
    const p = loadProgress();
    setProgress(p);
    startSnap.current = p;
  }, []);

  const s = computeScores(recipe);

  const setVal = (key: keyof Omit<Recipe, 'coating'>, v: number) =>
    setRecipe((r) => ({ ...r, [key]: v }));

  const craft = () => {
    const finalName = name.trim() || 'マイチョーク';
    const p = recordCraft(startSnap.current ?? loadProgress(), {
      name: finalName,
      rank: s.rank,
      overall: s.overall,
      ts: Date.now(),
    });
    setProgress(p);
    startSnap.current = p;
    setName('');
  };

  return (
    <article className="workshop-screen">
      <h1 className="quiz-h1">🧪 チョーク工房</h1>
      <p className="quiz-lead">
        成分を配合して、自分だけの「マイチョーク」を作ろう。配合で<strong>書き味・折れにくさ・粉の出にくさ・発色・エコ率</strong>が変わります。
        よみもの（<a href={`${BASE}/basics/`} onClick={(e) => { e.preventDefault(); navigateTo('/basics/'); }}>基礎</a>・
        <a href={`${BASE}/making/`} onClick={(e) => { e.preventDefault(); navigateTo('/making/'); }}>作り方</a>）の知識が活きます。
      </p>

      {(() => {
        const best = progress.craftedChalks.reduce((m, c) => Math.max(m, c.overall), 0);
        const bestRank = best >= 85 ? 'S' : best >= 72 ? 'A' : best >= 55 ? 'B' : best > 0 ? 'C' : null;
        return (
          <div className="workshop-challenge">
            <span>🎯 目標：<strong>ランクA（総合72）以上</strong>のマイチョークを作ろう！バランスよく配合するのがコツ。</span>
            {bestRank && <span className="workshop-best">これまでの最高：ランク{bestRank}（総合{best}）</span>}
          </div>
        );
      })()}

      <div className="workshop-grid">
        <section className="workshop-mix" aria-label="配合">
          <h2 className="workshop-h2">配合</h2>
          {INGREDIENTS.map((ing) => (
            <div key={ing.key} className="mix-row">
              <div className="mix-head">
                <span className="mix-label">{ing.label}</span>
                <span className="mix-val">{recipe[ing.key]}</span>
              </div>
              <input
                type="range" min={0} max={100} value={recipe[ing.key]}
                onChange={(e) => setVal(ing.key, Number(e.target.value))}
                aria-label={ing.label}
              />
              <div className="mix-hint">{ing.hint}</div>
            </div>
          ))}
          <label className="mix-toggle">
            <input type="checkbox" checked={recipe.coating} onChange={(e) => setRecipe((r) => ({ ...r, coating: e.target.checked }))} />
            表面コーティング（手が汚れにくく・書き味UP）
          </label>
        </section>

        <section className="workshop-result" aria-label="判定">
          <div className="result-rank" data-rank={s.rank}>
            <span className="result-rank-label">総合</span>
            <span className="result-rank-badge">{s.rank}</span>
            <span className="result-rank-num">{s.overall}</span>
          </div>
          <div className="score-bars">
            {SCORE_BARS.map((b) => (
              <div key={b.key} className="score-row">
                <span className="score-label">{b.label}</span>
                <span className="score-track"><span className="score-fill" style={{ width: `${s[b.key]}%` }} /></span>
                <span className="score-num">{s[b.key]}</span>
              </div>
            ))}
          </div>
          <p className="result-comment">{s.comment}</p>
          <div className="craft-row">
            <input
              className="craft-name" type="text" maxLength={16} value={name}
              placeholder="チョークの名前（例：羽衣ふう）"
              onChange={(e) => setName(e.target.value)}
            />
            <button className="quiz-btn-primary" onClick={craft}>焼き上げる</button>
          </div>
        </section>
      </div>

      <section className="workshop-shelf" aria-label="マイチョーク棚">
        <h2 className="workshop-h2">マイチョーク棚（{progress.craftedChalks.length}）</h2>
        {progress.craftedChalks.length === 0 ? (
          <p className="shelf-empty">まだ何も作っていません。上で配合して「焼き上げる」を押そう。</p>
        ) : (
          <ul className="shelf-list">
            {progress.craftedChalks.map((c, i) => (
              <li key={i} className="shelf-item" data-rank={c.rank}>
                <span className="shelf-rank">{c.rank}</span>
                <span className="shelf-name">{c.name}</span>
                <span className="shelf-meta">総合{c.overall}・{formatDate(c.ts)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="quiz-back">
        <a href={`${BASE}/`} onClick={(e) => { e.preventDefault(); navigateTo('/'); }}><ArrowLeft size={16} /> トップへ戻る</a>
      </div>
    </article>
  );
}
