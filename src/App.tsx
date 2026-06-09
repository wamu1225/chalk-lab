import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft, List, ChevronRight, Menu, X, Calendar, Volume2, Square } from 'lucide-react';
import { sections } from './data/sections';
import type { Section } from './data/sections';
import { FAQ_BY_SECTION } from './data/faqs';
import { glossary } from './data/glossary';
import { BASE, SITE_NAME, navigateTo } from './utils/nav';
import { recordSectionRead } from './utils/actions';
import { loadProgress } from './utils/progress';
import { Quiz } from './components/Quiz';
import { Badges } from './components/Badges';
import { Dex } from './components/Dex';
import { Workshop } from './components/Workshop';
import { Draw } from './components/Draw';
import { AdventureMap } from './components/AdventureMap';
import { GuessGame } from './components/GuessGame';
import { PlayHub } from './components/PlayHub';
import { Timeline } from './components/Timeline';
import { cardsForSection } from './data/chalkCards';
import { ChalkIcon } from './components/ChalkIcon';
import { SECTION_ICON } from './data/chalkIcons';
import { FIGURES } from './data/figures';
import { ToastHost } from './components/ToastHost';
import { CharaChalk } from './components/CharaChalk';
import type { MascotExpr } from './data/mascot';
import { computeXp, levelInfo } from './utils/level';
import { todaysTrivia } from './data/trivia';
import './App.css';

function ChalkLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-hidden="true">
      <rect width="64" height="64" rx="12" fill="#1f3a2e" />
      <path d="M11 49 q9 -7 19 -2 q10 5 21 -3" fill="none" stroke="#fdfdfb" strokeWidth="3.2" strokeLinecap="round" opacity="0.8" />
      <g transform="rotate(-43 32 28)">
        <rect x="26" y="9" width="13" height="37" rx="2" fill="#fdfdfb" />
        <rect x="34.5" y="9" width="4.5" height="37" rx="1.5" fill="#dcdacf" />
        <rect x="27.5" y="11" width="2.6" height="33" rx="1.3" fill="#ffffff" />
        <rect x="26" y="42" width="13" height="4" rx="1" fill="#c4c2b6" />
      </g>
      <circle cx="18" cy="53" r="1.7" fill="#fdfdfb" opacity="0.6" />
      <circle cx="24" cy="56" r="1.1" fill="#fdfdfb" opacity="0.45" />
    </svg>
  );
}

function getCurrentPath(): string {
  if (typeof window === 'undefined') return '/';
  const p = window.location.pathname;
  if (p.startsWith(BASE)) return p.slice(BASE.length) || '/';
  return p;
}

function slugify(_text: string, index: number): string {
  return `section-${index}`;
}

// ── 簡易マークダウンパーサ ──
function parseInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  const patterns: { re: RegExp; render: (m: RegExpExecArray) => ReactNode }[] = [
    {
      re: /\[([^\]]+)\]\(([^)]+)\)/,
      render: (m) => {
        const href = m[2];
        const isInternal = href.startsWith(`${BASE}/`);
        if (isInternal) {
          return (
            <a
              key={key++}
              href={href}
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', href);
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
            >
              {m[1]}
            </a>
          );
        }
        const isExternal = /^https?:\/\//.test(href);
        return (
          <a
            key={key++}
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
          >
            {m[1]}
          </a>
        );
      },
    },
    { re: /\*\*(.+?)\*\*/, render: (m) => <strong key={key++}>{m[1]}</strong> },
    { re: /`([^`]+)`/, render: (m) => <code key={key++} className="inline-code">{m[1]}</code> },
  ];

  while (remaining.length > 0) {
    let earliest: { idx: number; len: number; render: ReactNode } | null = null;
    for (const p of patterns) {
      const m = p.re.exec(remaining);
      if (m && (earliest === null || m.index < earliest.idx)) {
        earliest = { idx: m.index, len: m[0].length, render: p.render(m) };
      }
    }
    if (!earliest) {
      nodes.push(remaining);
      break;
    }
    if (earliest.idx > 0) nodes.push(remaining.slice(0, earliest.idx));
    nodes.push(earliest.render);
    remaining = remaining.slice(earliest.idx + earliest.len);
  }
  return nodes;
}

function parseContent(content: string): ReactNode[] {
  const lines = content.split('\n');
  const result: ReactNode[] = [];
  let i = 0;
  let key = 0;
  let h2Index = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') { i++; continue; }

    const figMatch = /^\[\[figure:([\w-]+)\]\]$/.exec(trimmed);
    if (figMatch) {
      const fig = FIGURES[figMatch[1]];
      if (fig) {
        result.push(
          <figure key={key++} className="content-figure">
            <svg viewBox={fig.viewBox} preserveAspectRatio="xMidYMid meet" role="img" aria-label={fig.caption} dangerouslySetInnerHTML={{ __html: fig.body }} />
            <figcaption>{fig.caption}</figcaption>
          </figure>
        );
      }
      i++;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      const text = trimmed.slice(3);
      result.push(<h2 key={key++} id={slugify(text, h2Index++)} className="content-h2">{parseInline(text)}</h2>);
      i++;
      continue;
    }

    if (trimmed.startsWith('### ')) {
      const text = trimmed.slice(4);
      result.push(<h3 key={key++} className="content-h3">{parseInline(text)}</h3>);
      i++;
      continue;
    }

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }
      if (tableLines.length >= 2) {
        const rows = tableLines.map(r => r.split('|').slice(1, -1).map(c => c.trim()));
        const isSep = (r: string[]) => r.every(c => /^[-:]+$/.test(c));
        const header = rows[0];
        const data = rows.slice(1).filter(r => !isSep(r));
        result.push(
          <div key={key++} className="content-table-wrap">
            <table className="content-table">
              <thead><tr>{header.map((c, ci) => <th key={ci}>{parseInline(c)}</th>)}</tr></thead>
              <tbody>
                {data.map((row, ri) => (
                  <tr key={ri}>{row.map((c, ci) => <td key={ci}>{parseInline(c)}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        i++;
      }
      result.push(
        <ol key={key++} className="content-ol">
          {items.map((it, idx) => <li key={idx}>{parseInline(it)}</li>)}
        </ol>
      );
      continue;
    }

    if (trimmed.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      result.push(
        <ul key={key++} className="content-ul">
          {items.map((it, idx) => <li key={idx}>{parseInline(it)}</li>)}
        </ul>
      );
      continue;
    }

    if (trimmed.startsWith('💡 ')) {
      result.push(<p key={key++} className="callout callout-tip">{parseInline(trimmed.slice(2).trim())}</p>);
      i++; continue;
    }
    if (trimmed.startsWith('⚠️ ')) {
      result.push(<p key={key++} className="callout callout-warning">{parseInline(trimmed.slice(2).trim())}</p>);
      i++; continue;
    }
    if (trimmed.startsWith('📖 ')) {
      result.push(<p key={key++} className="callout callout-info">{parseInline(trimmed.slice(2).trim())}</p>);
      i++; continue;
    }
    if (trimmed.startsWith('✅ ')) {
      result.push(<p key={key++} className="callout callout-success">{parseInline(trimmed.slice(2).trim())}</p>);
      i++; continue;
    }

    result.push(<p key={key++} className="content-p">{parseInline(trimmed)}</p>);
    i++;
  }

  return result;
}

function Header() {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a
          href={`${BASE}/`}
          className="site-brand"
          onClick={(e) => { e.preventDefault(); navigateTo('/'); setNavOpen(false); }}
        >
          <span className="brand-chalk" aria-hidden="true"><ChalkLogo size={26} /></span>
          <span>{SITE_NAME}</span>
        </a>
        <button
          className="nav-toggle"
          aria-label={navOpen ? 'メニューを閉じる' : 'メニューを開く'}
          onClick={() => setNavOpen(!navOpen)}
        >
          {navOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <nav className={`site-nav ${navOpen ? 'open' : ''}`} aria-label="メインナビゲーション">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`${BASE}/${s.id}/`}
              onClick={(e) => { e.preventDefault(); navigateTo(`/${s.id}/`); setNavOpen(false); }}
            >
              <ChalkIcon motif={SECTION_ICON[s.id]} size={20} className="nav-emoji" />
              <span>{s.shortTitle}</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Home() {
  const [greet, setGreet] = useState<{ expr: MascotExpr; msg: string; cta: boolean }>({ expr: 'smile', msg: 'はじめまして！ぼく「チョーくん」。まずは1つ、よみものを読んでみてね。', cta: true });
  useEffect(() => {
    document.title = `${SITE_NAME} | チョークの科学・歴史・トリビアを楽しく学ぶ`;
    const p = loadProgress();
    const lv = levelInfo(computeXp(p)).level;
    if (p.visitedSections.length === 0) {
      setGreet({ expr: 'smile', msg: 'はじめまして！ぼく「チョーくん」。まずは1つ、よみものを読んでみてね。', cta: true });
    } else if (lv >= 5) {
      setGreet({ expr: 'celebrate', msg: 'きみはもう一人前のチョーク博士だね！ほんとにすごい！', cta: false });
    } else {
      setGreet({ expr: 'cheer', msg: 'その調子！図鑑・工房・検定で、もっとチョーク博士に近づこう！', cta: false });
    }
  }, []);
  return (
    <>
      <div className="hero">
        <div className="hero-emoji" aria-hidden="true"><ChalkLogo size={76} /></div>
        <h1>{SITE_NAME}</h1>
        <p>
          黒板のチョークから、伝説の羽衣チョーク、白い崖の「白亜」、クライミング用まで。<br />
          チョークの成分・歴史・トリビアを、読んで・クイズで遊んで、楽しく学べるサイトです。
        </p>
      </div>

      <div className="mascot-greet">
        <CharaChalk expr={greet.expr} size={64} className="mascot-fig" />
        <div className="mascot-bubble">
          {greet.msg}
          {greet.cta && (
            <a
              className="mascot-cta"
              href={`${BASE}/${sections[0].id}/`}
              onClick={(e) => { e.preventDefault(); navigateTo(`/${sections[0].id}/`); }}
            >「{sections[0].shortTitle}」から読む →</a>
          )}
        </div>
      </div>

      <div className="play-banner">
        <div className="play-banner-text">
          <h2>🎮 読んで・解いて・集めよう</h2>
          <p>よみものを読むと<strong>チョーク図鑑</strong>のカードを発見。チョーク検定に正解すると習熟度が上がり、バッジも集まります。</p>
        </div>
        <div className="play-banner-btns">
          <a href={`${BASE}/map/`} className="play-btn" onClick={(e) => { e.preventDefault(); navigateTo('/map/'); }}>🗺️ 旅のマップ</a>
          <a href={`${BASE}/dex/`} className="play-btn" onClick={(e) => { e.preventDefault(); navigateTo('/dex/'); }}>📚 チョーク図鑑</a>
          <a href={`${BASE}/quiz/`} className="play-btn" onClick={(e) => { e.preventDefault(); navigateTo('/quiz/'); }}>📝 チョーク検定</a>
          <a href={`${BASE}/play/`} className="play-btn play-btn-ghost" onClick={(e) => { e.preventDefault(); navigateTo('/play/'); }}>🎮 ぜんぶのあそび →</a>
        </div>
      </div>

      {(() => {
        const t = todaysTrivia();
        const sec = sections.find((s) => s.id === t.sectionId);
        return (
          <a
            className="trivia-box"
            href={`${BASE}/${t.sectionId}/`}
            onClick={(e) => { e.preventDefault(); navigateTo(`/${t.sectionId}/`); }}
          >
            <span className="trivia-label">💡 きょうのチョーク豆知識</span>
            <span className="trivia-text">{t.text}</span>
            {sec && <span className="trivia-more">「{sec.shortTitle}」で読む →</span>}
          </a>
        );
      })()}

      <h2 className="home-section-title">よみもの一覧</h2>
      <div className="section-grid">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`${BASE}/${s.id}/`}
            className="section-card"
            onClick={(e) => { e.preventDefault(); navigateTo(`/${s.id}/`); }}
          >
            <ChalkIcon motif={SECTION_ICON[s.id]} size={64} className="section-card-emoji" />
            <h2 className="section-card-title">{s.shortTitle}</h2>
            <p className="section-card-desc">{s.description}</p>
            <span className="section-card-cta">読む →</span>
          </a>
        ))}
      </div>

      <div className="home-trust">
        <h3>このサイトについて</h3>
        <ul>
          <li><strong>遊びながら学べる</strong>：解説を読んだあと、クイズやバッジ集めで知識を確かめられます（順次追加中）。</li>
          <li><strong>やさしい言葉で</strong>：専門用語はその場で説明し、はじめての人にも分かるようにしています。</li>
          <li><strong>確かな情報を</strong>：成分や歴史などは、確認できる事実をもとにまとめています。</li>
        </ul>
      </div>
    </>
  );
}

function TOC({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <nav className="toc">
      <div className="toc-title"><List size={16} /> 目次</div>
      <ol className="toc-list">
        {items.map((it, idx) => (
          <li key={it}>
            <a href={`#${slugify(it, idx)}`}>{it}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function Breadcrumb({ currentTitle }: { currentTitle: string }) {
  return (
    <nav className="breadcrumb" aria-label="パンくずリスト">
      <a href={`${BASE}/`} onClick={(e) => { e.preventDefault(); navigateTo('/'); }}>{SITE_NAME}</a>
      <ChevronRight size={14} className="breadcrumb-sep" aria-hidden="true" />
      <span className="breadcrumb-current">{currentTitle}</span>
    </nav>
  );
}

function formatDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${m[1]}年${parseInt(m[2], 10)}月${parseInt(m[3], 10)}日`;
}

function RelatedSections({ currentId }: { currentId: string }) {
  const related = sections.filter((s) => s.id !== currentId);
  return (
    <aside className="related-sections" aria-label="関連記事">
      <h3>📚 ほかのよみものも読む</h3>
      <div className="related-grid">
        {related.map((s) => (
          <a
            key={s.id}
            href={`${BASE}/${s.id}/`}
            className="related-card"
            onClick={(e) => { e.preventDefault(); navigateTo(`/${s.id}/`); }}
          >
            <ChalkIcon motif={SECTION_ICON[s.id]} size={32} className="related-emoji" />
            <span className="related-title">{s.shortTitle}</span>
          </a>
        ))}
      </div>
    </aside>
  );
}

function FAQBlock({ sectionId }: { sectionId: string }) {
  const faqs = FAQ_BY_SECTION[sectionId];
  if (!faqs || faqs.length === 0) return null;
  return (
    <section className="faq-block" aria-label="よくある質問">
      <h3>❓ よくある質問</h3>
      {faqs.map((qa, i) => (
        <details key={i} className="faq-item">
          <summary>{qa.question}</summary>
          <p>{qa.answer}</p>
        </details>
      ))}
    </section>
  );
}

function DiscoveredCards({ sectionId, show }: { sectionId: string; show: boolean }) {
  const cards = cardsForSection(sectionId);
  if (!show || cards.length === 0) return null;
  return (
    <aside className="discovered-cards" aria-label="このページで発見したカード">
      <h3>🃏 このページで発見した図鑑カード</h3>
      <div className="discovered-grid">
        {cards.map((c) => (
          <div key={c.id} className={`discovered-card rarity-${c.rarity}`}>
            <ChalkIcon motif={c.id} size={30} className="discovered-emoji" />
            <span className="discovered-name">{c.name}</span>
          </div>
        ))}
      </div>
      <a
        href={`${BASE}/dex/`}
        className="discovered-link"
        onClick={(e) => { e.preventDefault(); navigateTo('/dex/'); }}
      >
        チョーク図鑑を見る →
      </a>
    </aside>
  );
}

function References({ items }: { items?: { label: string; url: string }[] }) {
  if (!items || items.length === 0) return null;
  return (
    <aside className="references" aria-label="参考">
      <h3>📚 参考</h3>
      <ul>
        {items.map((r) => (
          <li key={r.url}>
            <a href={r.url} target="_blank" rel="noopener noreferrer">{r.label}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// 記事を読み上げ用の素テキストに変換（マークダウン記法・図トークン・表を除去）
function toSpeakable(section: Section): string {
  const src = (section.lead ? section.lead + '\n' : '') + section.content;
  const out = src.split('\n').map((line) => {
    let t = line.trim();
    if (!t) return '';
    if (/^\[\[figure:/.test(t)) return '';
    if (/^\|.*\|$/.test(t)) return ''; // 表は読み上げ対象外
    t = t.replace(/^#{2,3}\s*/, '');
    t = t.replace(/^\d+\.\s*/, '');
    t = t.replace(/^-\s*/, '');
    t = t.replace(/^(?:[\u{1F300}-\u{1FAFF}☀-➿←-⇿️]\s*)+/u, '');
    t = t.replace(/\*\*(.+?)\*\*/g, '$1');
    t = t.replace(/`([^`]+)`/g, '$1');
    t = t.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    return t;
  }).filter(Boolean);
  return `${section.title}。 ${out.join('。 ')}`.replace(/。+/g, '。');
}

function SectionPage({ section }: { section: Section }) {
  const endRef = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [ttsAvailable, setTtsAvailable] = useState(false);
  const [ttsOn, setTtsOn] = useState(false);

  useEffect(() => {
    setTtsAvailable(typeof window !== 'undefined' && 'speechSynthesis' in window);
  }, []);

  // セクション切替・離脱で読み上げを止める
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [section.id]);

  const toggleSpeak = () => {
    const synth = window.speechSynthesis;
    if (ttsOn) { synth.cancel(); setTtsOn(false); return; }
    synth.cancel();
    const u = new SpeechSynthesisUtterance(toSpeakable(section));
    u.lang = 'ja-JP';
    u.onend = () => setTtsOn(false);
    u.onerror = () => setTtsOn(false);
    synth.speak(u);
    setTtsOn(true);
  };

  useEffect(() => {
    document.title = `${section.title} | ${SITE_NAME}`;
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      requestAnimationFrame(() => {
        const el = document.getElementById(decodeURIComponent(hash.slice(1)));
        if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
        else window.scrollTo(0, 0);
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [section.id, section.title]);

  // 本文を最後まで読み進めたら、カードを「発見」する（読了報酬）。
  // 開いた瞬間ではなく、本文末尾が見えたタイミングで1回だけ発火。
  useEffect(() => {
    // 再訪（この記事のカードを発見済み）なら最初から発見ブロックを表示
    const p = loadProgress();
    const secCards = cardsForSection(section.id);
    setRevealed(secCards.length > 0 && secCards.every((c) => p.cards[c.id]?.discovered));

    const el = endRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      // 観測できない環境では従来どおり訪問時に記録（フォールバック）
      recordSectionRead(section.id);
      setRevealed(true);
      return;
    }
    let done = false;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !done) {
          done = true;
          recordSectionRead(section.id);
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [section.id]);

  return (
    <>
      <Breadcrumb currentTitle={section.shortTitle} />
      <article className="section-page">
        <header className="article-header">
          <ChalkIcon motif={SECTION_ICON[section.id]} size={64} className="article-emoji" />
          <h1>{section.title}</h1>
          <div className="article-meta">
            <span className="article-meta-item"><Calendar size={14} /> 最終更新: {formatDate(section.updatedAt)}</span>
          </div>
          {ttsAvailable && (
            <button className={`tts-btn ${ttsOn ? 'on' : ''}`} onClick={toggleSpeak} aria-pressed={ttsOn}>
              {ttsOn ? <><Square size={15} /> 読み上げを止める</> : <><Volume2 size={15} /> 読み上げ</>}
            </button>
          )}
        </header>
        {section.lead && (
          <p className="lead">{section.lead}</p>
        )}
        {section.kidSummary && (
          <div className="kid-summary">
            <span className="kid-summary-label">やさしい まとめ</span>
            <p>{section.kidSummary}</p>
          </div>
        )}
        <TOC items={section.toc} />
        <div className="section-content">
          {parseContent(section.content)}
        </div>
        <div ref={endRef} aria-hidden="true" />
        <DiscoveredCards sectionId={section.id} show={revealed} />
        <FAQBlock sectionId={section.id} />
        <References items={section.references} />
        <RelatedSections currentId={section.id} />
        <div className="section-footer">
          <a
            href={`${BASE}/`}
            className="back-link"
            onClick={(e) => { e.preventDefault(); navigateTo('/'); }}
          >
            <ArrowLeft size={16} /> トップへ戻る
          </a>
        </div>
      </article>
    </>
  );
}

function NotFound() {
  return (
    <div className="section-page">
      <h1>ページが見つかりません</h1>
      <p>お探しのページは存在しないか、移動した可能性があります。</p>
      <a href={`${BASE}/`} onClick={(e) => { e.preventDefault(); navigateTo('/'); }}>トップへ戻る</a>
    </div>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <a href={`${BASE}/map/`} onClick={(e) => { e.preventDefault(); navigateTo('/map/'); }}>旅のマップ</a>
        <a href={`${BASE}/dex/`} onClick={(e) => { e.preventDefault(); navigateTo('/dex/'); }}>チョーク図鑑</a>
        <a href={`${BASE}/workshop/`} onClick={(e) => { e.preventDefault(); navigateTo('/workshop/'); }}>チョーク工房</a>
        <a href={`${BASE}/draw/`} onClick={(e) => { e.preventDefault(); navigateTo('/draw/'); }}>黒板キャンバス</a>
        <a href={`${BASE}/quiz/`} onClick={(e) => { e.preventDefault(); navigateTo('/quiz/'); }}>チョーク検定</a>
        <a href={`${BASE}/guess/`} onClick={(e) => { e.preventDefault(); navigateTo('/guess/'); }}>絵当て</a>
        <a href={`${BASE}/timeline/`} onClick={(e) => { e.preventDefault(); navigateTo('/timeline/'); }}>誕生の旅</a>
        <a href={`${BASE}/badges/`} onClick={(e) => { e.preventDefault(); navigateTo('/badges/'); }}>バッジ</a>
        <a href={`${BASE}/glossary/`} onClick={(e) => { e.preventDefault(); navigateTo('/glossary/'); }}>用語集</a>
        <a href={`${BASE}/about/`} onClick={(e) => { e.preventDefault(); navigateTo('/about/'); }}>サイトについて</a>
        <a href={`${BASE}/privacy/`} onClick={(e) => { e.preventDefault(); navigateTo('/privacy/'); }}>プライバシーポリシー</a>
        <a href="https://study-apps.com/">study-apps.com</a>
      </div>
      <div style={{ marginTop: 8 }}>
        本サイトは一般的な情報を、家庭・教育の読者向けに分かりやすくまとめたものです。
      </div>
    </footer>
  );
}

const ABOUT_CONTENT = `「${SITE_NAME}」は、身近なのに意外と知らない「チョーク」について、楽しく学べることを目指した解説サイトです。チョークの成分や書けるしくみ、種類、作り方、歴史（伝説の羽衣チョークなど）、白亜と白亜紀の関係、スポーツ用や裁縫用のチョークまで、はばひろく紹介しています。

読むだけでなく、クイズやバッジ集めなどの“遊んで学べる”しかけも順次そろえていきます。

## 編集・制作方針

本サイトのコンテンツは、一般に公開されている情報や資料を参照しつつ、運営者が内容を再構成し、はじめての読者にも分かりやすい形で独自に解説しています。他サイトの文章をそのまま転載することはありません。成分・歴史などの記述は、確認できる事実をもとにまとめるよう努めており、誤りや古くなった情報に気づいた場合は、お問い合わせを受けて随時見直し・修正します。

## 運営者について

個人で運営しています。広告収入はサイトの維持費にあてています。

## お問い合わせ

ご質問・誤りのご指摘は[こちらのGoogleフォーム](https://forms.gle/ccMv7oKwz6ysDHBe6)からお願いします。

## 免責事項

本サイトの情報は可能な限り正確を期していますが、その完全性・正確性を保証するものではありません。健康に関わる内容については一般的な情報提供であり、専門的な助言の代わりにはなりません。気になる症状がある場合は医師などの専門家にご相談ください。`;

const PRIVACY_CONTENT = `## アクセス解析

本サイトでは、サイトの利用状況を把握するために Google Analytics を使用しています。Google Analytics はクッキー（Cookie）を利用して匿名のトラフィックデータを収集します。収集される情報は匿名で、個人を特定するものではありません。

## 広告について

本サイトでは Google AdSense などの第三者配信の広告サービスを利用することがあります。広告配信事業者は、ユーザーの興味に応じた広告を表示するためにクッキーを使用することがあります。クッキーの使用を望まない場合は、Google の広告設定から無効にできます。

## 免責事項

本サイトの情報の利用により生じた損害について、運営者は一切の責任を負いません。

## お問い合わせ

本ポリシーに関するお問い合わせは[Googleフォーム](https://forms.gle/ccMv7oKwz6ysDHBe6)からお願いします。`;

function Glossary() {
  useEffect(() => {
    document.title = `用語集 | ${SITE_NAME}`;
    window.scrollTo(0, 0);
  }, []);
  const sorted = [...glossary].sort((a, b) =>
    (a.reading || a.term).localeCompare(b.reading || b.term, 'ja')
  );
  return (
    <>
      <Breadcrumb currentTitle="用語集" />
      <article className="section-page">
        <header className="article-header">
          <div className="article-emoji" aria-hidden="true">📖</div>
          <h1>チョーク用語集</h1>
        </header>
        <p className="lead">
          本サイトに登場する用語をまとめました。炭酸カルシウム、石膏、白亜、円石藻など、チョークの理解に役立ててください。
        </p>
        <dl className="glossary-list">
          {sorted.map((g) => (
            <div key={g.term} className="glossary-entry">
              <dt>
                <span className="glossary-term">{g.term}</span>
                {g.reading && g.reading !== g.term && (
                  <span className="glossary-reading">（{g.reading}）</span>
                )}
              </dt>
              <dd>
                <p>{g.description}</p>
                {g.relatedSectionId && (() => {
                  const related = sections.find((s) => s.id === g.relatedSectionId);
                  if (!related) return null;
                  return (
                    <a
                      href={`${BASE}/${related.id}/`}
                      className="glossary-related"
                      onClick={(e) => { e.preventDefault(); navigateTo(`/${related.id}/`); }}
                    >
                      関連ページ：{related.shortTitle} →
                    </a>
                  );
                })()}
              </dd>
            </div>
          ))}
        </dl>
      </article>
    </>
  );
}

function About() {
  useEffect(() => { document.title = `サイトについて | ${SITE_NAME}`; window.scrollTo(0, 0); }, []);
  return (
    <>
      <Breadcrumb currentTitle="サイトについて" />
      <article className="section-page">
        <h1>サイトについて</h1>
        <div className="section-content">{parseContent(ABOUT_CONTENT)}</div>
      </article>
    </>
  );
}

function Privacy() {
  useEffect(() => { document.title = `プライバシーポリシー | ${SITE_NAME}`; window.scrollTo(0, 0); }, []);
  return (
    <>
      <Breadcrumb currentTitle="プライバシーポリシー" />
      <article className="section-page">
        <h1>プライバシーポリシー</h1>
        <div className="section-content">{parseContent(PRIVACY_CONTENT)}</div>
      </article>
    </>
  );
}

export default function App() {
  const [path, setPath] = useState<string>(getCurrentPath());

  useEffect(() => {
    const handler = () => setPath(getCurrentPath());
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const normalized = path.replace(/\/$/, '') || '/';

  let content: ReactNode;
  if (normalized === '/' || normalized === '') {
    content = <Home />;
  } else if (normalized === '/about') {
    content = <About />;
  } else if (normalized === '/privacy') {
    content = <Privacy />;
  } else if (normalized === '/glossary') {
    content = <Glossary />;
  } else if (normalized === '/quiz') {
    content = <Quiz />;
  } else if (normalized === '/badges') {
    content = <Badges />;
  } else if (normalized === '/dex') {
    content = <Dex />;
  } else if (normalized === '/workshop') {
    content = <Workshop />;
  } else if (normalized === '/draw') {
    content = <Draw />;
  } else if (normalized === '/map') {
    content = <AdventureMap />;
  } else if (normalized === '/guess') {
    content = <GuessGame />;
  } else if (normalized === '/play') {
    content = <PlayHub />;
  } else if (normalized === '/timeline') {
    content = <Timeline />;
  } else {
    const id = normalized.replace(/^\//, '');
    const section = sections.find((s) => s.id === id);
    content = section ? <SectionPage section={section} /> : <NotFound />;
  }

  return (
    <>
      <Header />
      <main className="site-shell">{content}</main>
      <Footer />
      <ToastHost />
    </>
  );
}
