import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft, List, ChevronRight, Menu, X, Calendar } from 'lucide-react';
import { sections } from './data/sections';
import type { Section } from './data/sections';
import { FAQ_BY_SECTION } from './data/faqs';
import { glossary } from './data/glossary';
import { BASE, SITE_NAME, navigateTo } from './utils/nav';
import { markSectionVisited } from './utils/progress';
import { Quiz } from './components/Quiz';
import { Badges } from './components/Badges';
import { Dex } from './components/Dex';
import { cardsForSection } from './data/chalkCards';
import './App.css';

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
          <span className="brand-chalk" aria-hidden="true">🖍️</span>
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
              <span className="nav-emoji">{s.emoji}</span>
              <span>{s.shortTitle}</span>
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function Home() {
  useEffect(() => { document.title = `${SITE_NAME} | チョークの科学・歴史・トリビアを楽しく学ぶ`; }, []);
  return (
    <>
      <div className="hero">
        <div className="hero-emoji" aria-hidden="true">🖍️</div>
        <h1>{SITE_NAME}</h1>
        <p>
          黒板のチョークから、伝説の羽衣チョーク、白い崖の「白亜」、クライミング用まで。<br />
          チョークの成分・歴史・トリビアを、読んで・クイズで遊んで、楽しく学べるサイトです。
        </p>
      </div>

      <div className="play-banner">
        <div className="play-banner-text">
          <h2>🎮 読んで・解いて・集めよう</h2>
          <p>よみものを読むと<strong>チョーク図鑑</strong>のカードを発見。チョーク検定に正解すると習熟度が上がり、バッジも集まります。</p>
        </div>
        <div className="play-banner-btns">
          <a href={`${BASE}/dex/`} className="play-btn" onClick={(e) => { e.preventDefault(); navigateTo('/dex/'); }}>📚 チョーク図鑑</a>
          <a href={`${BASE}/quiz/`} className="play-btn" onClick={(e) => { e.preventDefault(); navigateTo('/quiz/'); }}>📝 チョーク検定</a>
          <a href={`${BASE}/badges/`} className="play-btn play-btn-ghost" onClick={(e) => { e.preventDefault(); navigateTo('/badges/'); }}>🏆 バッジ</a>
        </div>
      </div>

      <h2 className="home-section-title">よみもの一覧</h2>
      <div className="section-grid">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`${BASE}/${s.id}/`}
            className="section-card"
            onClick={(e) => { e.preventDefault(); navigateTo(`/${s.id}/`); }}
          >
            <div className="section-card-emoji" aria-hidden="true">{s.emoji}</div>
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
            <span className="related-emoji" aria-hidden="true">{s.emoji}</span>
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

function DiscoveredCards({ sectionId }: { sectionId: string }) {
  const cards = cardsForSection(sectionId);
  if (cards.length === 0) return null;
  return (
    <aside className="discovered-cards" aria-label="このページで発見したカード">
      <h3>🃏 このページで発見した図鑑カード</h3>
      <div className="discovered-grid">
        {cards.map((c) => (
          <div key={c.id} className={`discovered-card rarity-${c.rarity}`}>
            <span className="discovered-emoji" aria-hidden="true">{c.emoji}</span>
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

function SectionPage({ section }: { section: Section }) {
  useEffect(() => {
    document.title = `${section.title} | ${SITE_NAME}`;
    markSectionVisited(section.id);
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

  return (
    <>
      <Breadcrumb currentTitle={section.shortTitle} />
      <article className="section-page">
        <header className="article-header">
          <div className="article-emoji" aria-hidden="true">{section.emoji}</div>
          <h1>{section.title}</h1>
          <div className="article-meta">
            <span className="article-meta-item"><Calendar size={14} /> 最終更新: {formatDate(section.updatedAt)}</span>
          </div>
        </header>
        {section.lead && (
          <p className="lead">{section.lead}</p>
        )}
        <TOC items={section.toc} />
        <div className="section-content">
          {parseContent(section.content)}
        </div>
        <DiscoveredCards sectionId={section.id} />
        <FAQBlock sectionId={section.id} />
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
        <a href={`${BASE}/dex/`} onClick={(e) => { e.preventDefault(); navigateTo('/dex/'); }}>チョーク図鑑</a>
        <a href={`${BASE}/quiz/`} onClick={(e) => { e.preventDefault(); navigateTo('/quiz/'); }}>チョーク検定</a>
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
    </>
  );
}
