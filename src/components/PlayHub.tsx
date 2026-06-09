import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BASE, SITE_NAME, navigateTo } from '../utils/nav';
import { LevelBanner } from './LevelBanner';

const MODES: { path: string; emoji: string; title: string; desc: string }[] = [
  { path: '/map/', emoji: '🗺️', title: '旅のマップ', desc: 'よみものを順にめぐって全踏破をめざそう。' },
  { path: '/dex/', emoji: '📚', title: 'チョーク図鑑', desc: '読んで集めるカード28種。発見して習熟度を上げよう。' },
  { path: '/workshop/', emoji: '🧪', title: 'チョーク工房', desc: '成分を配合して、自分だけのチョークを作ろう。' },
  { path: '/draw/', emoji: '🖍️', title: '黒板キャンバス', desc: 'チョークで黒板にお絵かき。色・消す・保存ができる。' },
  { path: '/quiz/', emoji: '📝', title: 'チョーク検定', desc: '全30問からランダム10問。毎日の「今日の検定」も。' },
  { path: '/guess/', emoji: '🎨', title: 'チョーク絵当て', desc: 'カードの絵を見て名前を当てよう。字が読めなくてもOK。' },
  { path: '/timeline/', emoji: '⏳', title: 'チョーク誕生の旅', desc: '円石藻→白亜→白亜紀→チョーク。5ステップでたどる物語。' },
  { path: '/badges/', emoji: '🏆', title: 'ステータス＆バッジ', desc: 'レベル・XP・バッジ・コンプ率を確認しよう。' },
];

export function PlayHub() {
  useEffect(() => {
    document.title = `あそぶ | ${SITE_NAME}`;
    window.scrollTo(0, 0);
  }, []);

  return (
    <article className="hub-screen">
      <h1 className="quiz-h1">🎮 あそぶ</h1>
      <p className="quiz-lead">読んで・解いて・集めて・作って・描いて。チョークラボの遊びがぜんぶここに。</p>
      <LevelBanner />

      <div className="hub-grid">
        {MODES.map((m) => (
          <a
            key={m.path}
            className="hub-card"
            href={`${BASE}${m.path}`}
            onClick={(e) => { e.preventDefault(); navigateTo(m.path); }}
          >
            <span className="hub-emoji" aria-hidden="true">{m.emoji}</span>
            <span className="hub-card-body">
              <span className="hub-card-title">{m.title}</span>
              <span className="hub-card-desc">{m.desc}</span>
            </span>
          </a>
        ))}
      </div>

      <div className="quiz-back">
        <a href={`${BASE}/`} onClick={(e) => { e.preventDefault(); navigateTo('/'); }}><ArrowLeft size={16} /> トップへ戻る</a>
      </div>
    </article>
  );
}
