import * as fs from 'fs';
import * as path from 'path';
import { sections } from '../src/data/sections.ts';
import { FAQ_BY_SECTION } from '../src/data/faqs.ts';
import { glossary } from '../src/data/glossary.ts';
import { CHALK_CARDS, CATEGORY_LABEL, TOTAL_CARDS } from '../src/data/chalkCards.ts';
import { iconSvg, SECTION_ICON } from '../src/data/chalkIcons.ts';
import { figureSvg } from '../src/data/figures.ts';
import { TIMELINE } from '../src/data/timeline.ts';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const INDEX_HTML_PATH = path.join(DIST_DIR, 'index.html');
const BASE_URL = 'https://study-apps.com/chalk-lab';
const SITE_NAME = 'チョークラボ';
const BOARD = '#1f3a2e';
const ACCENT = '#e0a82e';
const FONT = "'Hiragino Kaku Gothic ProN','Hiragino Sans','Yu Gothic',Meiryo,sans-serif";

console.log('--- chalk-lab SSG Pre-rendering ---');

if (!fs.existsSync(INDEX_HTML_PATH)) {
  console.error('Error: dist/index.html not found. Run "npm run build" first.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function slugifyAscii(_text: string, index: number): string {
  return `section-${index}`;
}

function parseInlineToHtml(text: string): string {
  let result = '';
  let remaining = text;
  const patterns: { re: RegExp; render: (m: RegExpExecArray) => string }[] = [
    {
      re: /\[([^\]]+)\]\(([^)]+)\)/,
      render: (m) => {
        const label = escapeHtml(m[1]);
        const href = m[2];
        const isExternal = /^https?:\/\//.test(href);
        const attrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${escapeHtml(href)}"${attrs} style="color:${BOARD};font-weight:600">${label}</a>`;
      },
    },
    { re: /\*\*(.+?)\*\*/, render: (m) => `<strong>${escapeHtml(m[1])}</strong>` },
    { re: /`([^`]+)`/, render: (m) => `<code class="inline-code">${escapeHtml(m[1])}</code>` },
  ];
  while (remaining.length > 0) {
    let earliest: { idx: number; len: number; html: string } | null = null;
    for (const p of patterns) {
      const m = p.re.exec(remaining);
      if (m && (earliest === null || m.index < earliest.idx)) {
        earliest = { idx: m.index, len: m[0].length, html: p.render(m) };
      }
    }
    if (!earliest) { result += escapeHtml(remaining); break; }
    if (earliest.idx > 0) result += escapeHtml(remaining.slice(0, earliest.idx));
    result += earliest.html;
    remaining = remaining.slice(earliest.idx + earliest.len);
  }
  return result;
}

function markdownToHtml(content: string): string {
  const lines = content.split('\n');
  const out: string[] = [];
  let i = 0;
  let h2Index = 0;
  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (trimmed === '') { i++; continue; }
    const figM = /^\[\[figure:([\w-]+)\]\]$/.exec(trimmed);
    if (figM) { out.push(figureSvg(figM[1])); i++; continue; }
    if (trimmed.startsWith('## ')) {
      const text = trimmed.slice(3);
      out.push(`<h2 id="${slugifyAscii(text, h2Index++)}" class="content-h2" style="font-size:1.3rem;color:${BOARD};padding:0 0 6px;border-bottom:2px solid #e3e0d6;margin:32px 0 14px">${parseInlineToHtml(text)}</h2>`);
      i++; continue;
    }
    if (trimmed.startsWith('### ')) {
      out.push(`<h3 class="content-h3" style="font-size:1.1rem;margin:24px 0 10px">${parseInlineToHtml(trimmed.slice(4))}</h3>`);
      i++; continue;
    }
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
        tableLines.push(lines[i].trim()); i++;
      }
      if (tableLines.length >= 2) {
        const rows = tableLines.map((r) => r.split('|').slice(1, -1).map((c) => c.trim()));
        const isSep = (r: string[]) => r.every((c) => /^[-:]+$/.test(c));
        const header = rows[0];
        const data = rows.slice(1).filter((r) => !isSep(r));
        const headerHtml = header.map((c) => `<th style="border:1px solid #e3e0d6;padding:9px 12px;background:${BOARD};color:#fff">${parseInlineToHtml(c)}</th>`).join('');
        const bodyHtml = data.map((row) => `<tr>${row.map((c) => `<td style="border:1px solid #e3e0d6;padding:9px 12px">${parseInlineToHtml(c)}</td>`).join('')}</tr>`).join('');
        out.push(`<div style="overflow-x:auto;margin:0 0 20px"><table style="border-collapse:collapse;width:100%;font-size:0.94rem"><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`);
      }
      continue;
    }
    if (/^\d+\.\s/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) { items.push(lines[i].trim().replace(/^\d+\.\s/, '')); i++; }
      out.push(`<ol style="padding-left:1.4em;margin:0 0 16px">${items.map((it) => `<li>${parseInlineToHtml(it)}</li>`).join('')}</ol>`);
      continue;
    }
    if (trimmed.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) { items.push(lines[i].trim().slice(2)); i++; }
      out.push(`<ul style="padding-left:1.4em;margin:0 0 16px">${items.map((it) => `<li>${parseInlineToHtml(it)}</li>`).join('')}</ul>`);
      continue;
    }
    if (trimmed.startsWith('💡 ')) { out.push(`<p style="background:#f6f4ef;border:1px solid #e3e0d6;border-left:4px solid ${ACCENT};border-radius:10px;padding:12px 16px;margin:0 0 18px">${parseInlineToHtml(trimmed.slice(2).trim())}</p>`); i++; continue; }
    if (trimmed.startsWith('⚠️ ')) { out.push(`<p style="background:#f6f4ef;border:1px solid #e3e0d6;border-left:4px solid #d9534f;border-radius:10px;padding:12px 16px;margin:0 0 18px">${parseInlineToHtml(trimmed.slice(2).trim())}</p>`); i++; continue; }
    if (trimmed.startsWith('📖 ')) { out.push(`<p style="background:#f6f4ef;border:1px solid #e3e0d6;border-left:4px solid #5b8def;border-radius:10px;padding:12px 16px;margin:0 0 18px">${parseInlineToHtml(trimmed.slice(2).trim())}</p>`); i++; continue; }
    if (trimmed.startsWith('✅ ')) { out.push(`<p style="background:#f6f4ef;border:1px solid #e3e0d6;border-left:4px solid #3a9d5d;border-radius:10px;padding:12px 16px;margin:0 0 18px">${parseInlineToHtml(trimmed.slice(2).trim())}</p>`); i++; continue; }
    if (trimmed === '---') { out.push('<hr>'); i++; continue; }
    out.push(`<p style="margin:0 0 16px">${parseInlineToHtml(trimmed)}</p>`);
    i++;
  }
  return out.join('\n');
}

function buildTocHtml(toc: string[]): string {
  if (!toc.length) return '';
  const items = toc.map((it, idx) => `<li><a href="#${slugifyAscii(it, idx)}" style="color:#4b5b51;text-decoration:none">${escapeHtml(it)}</a></li>`).join('');
  return `<nav style="background:#fff;border:1px solid #e3e0d6;border-left:4px solid ${ACCENT};border-radius:14px;padding:14px 18px;margin:0 0 28px"><div style="font-weight:700;color:${BOARD};margin-bottom:6px">目次</div><ol style="margin:0;padding-left:1.4em">${items}</ol></nav>`;
}

function formatDateJa(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${m[1]}年${parseInt(m[2], 10)}月${parseInt(m[3], 10)}日`;
}

// ── ルート index.html ──
const sectionListHtml = sections
  .map((s) => `<li style="margin-bottom:14px"><a href="/chalk-lab/${s.id}/" style="color:${BOARD};font-weight:600;text-decoration:none">${escapeHtml(s.shortTitle)}</a><br><span style="color:#555;font-size:0.9rem">${escapeHtml(s.description)}</span></li>`)
  .join('\n');

const rootStaticContent = `<article id="static-fallback" style="font-family:${FONT};line-height:1.8;max-width:920px;margin:0 auto;padding:24px 16px">
  <h1 style="font-size:1.9rem;font-weight:700;border-bottom:3px solid ${ACCENT};padding-bottom:10px;margin-bottom:16px;color:${BOARD}">チョークラボ</h1>
  <p style="color:#444;margin-bottom:24px">黒板のチョークから、伝説の羽衣チョーク、白い崖の「白亜」、クライミング用まで。チョークの成分・歴史・トリビアを、読んで・クイズで遊んで、楽しく学べるサイトです。</p>
  <h2 style="font-size:1.3rem;font-weight:700;margin-bottom:12px;color:${BOARD}">よみもの一覧</h2>
  <ul style="list-style:none;padding:0">
${sectionListHtml}
  </ul>
  <nav style="margin-top:32px;border-top:1px solid #ddd;padding-top:16px;display:flex;gap:16px;flex-wrap:wrap">
    <a href="/chalk-lab/glossary/" style="color:${BOARD}">用語集</a>
    <a href="/chalk-lab/about/" style="color:${BOARD}">サイトについて</a>
    <a href="/chalk-lab/privacy/" style="color:${BOARD}">プライバシーポリシー</a>
  </nav>
</article>`;

const homeJsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: `${BASE_URL}/`,
  description: 'チョークの成分・種類・歴史・トリビアを、クイズやバッジ集めで楽しく学べる解説サイト。',
  inLanguage: 'ja',
});

let rootIndexHtml = templateHtml.replace('<div id="root"></div>', `<div id="root">${rootStaticContent}</div>`);
rootIndexHtml = rootIndexHtml.replace('</head>', `<script type="application/ld+json">${homeJsonLd}</script>\n  </head>`);
fs.writeFileSync(INDEX_HTML_PATH, rootIndexHtml);

const subDirTemplateHtml = templateHtml
  .replace(/href="\.\/assets\//g, 'href="../assets/')
  .replace(/src="\.\/assets\//g, 'src="../assets/')
  .replace(/href="\.\/favicon.svg"/g, 'href="../favicon.svg"');

let generatedCount = 0;

function buildFaqHtml(sectionId: string): string {
  const faqs = FAQ_BY_SECTION[sectionId];
  if (!faqs || faqs.length === 0) return '';
  const items = faqs
    .map((qa) => `<details style="background:#f7f6f1;border:1px solid #e3e0d6;border-radius:8px;margin-bottom:8px;padding:12px 16px"><summary style="cursor:pointer;font-weight:700;color:#233028">Q. ${escapeHtml(qa.question)}</summary><p style="margin:10px 0 0;color:#4b5b51;line-height:1.85">A. ${escapeHtml(qa.answer)}</p></details>`)
    .join('');
  return `<section style="margin:40px 0;padding:22px;background:#fff;border:1px solid #e3e0d6;border-radius:14px"><h3 style="margin:0 0 14px;color:${BOARD};font-size:1.05rem">❓ よくある質問</h3>${items}</section>`;
}

function buildSectionFallback(s: (typeof sections)[number]): string {
  const tocHtml = buildTocHtml(s.toc);
  const contentHtml = markdownToHtml(s.content);
  const faqHtml = buildFaqHtml(s.id);
  const refsHtml = (s.references && s.references.length)
    ? `<aside style="margin:32px 0;padding:16px 18px;background:#f7f6f1;border:1px solid #e3e0d6;border-radius:14px"><h3 style="margin:0 0 10px;font-size:1rem;color:${BOARD}">📚 参考</h3><ul style="margin:0;padding-left:1.2em">${s.references.map((r) => `<li style="margin-bottom:6px"><a href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer" style="color:${BOARD}">${escapeHtml(r.label)}</a></li>`).join('')}</ul></aside>`
    : '';
  const leadHtml = s.lead ? `<p style="color:#233028;font-size:1.08rem;line-height:1.9;margin:14px 0 22px">${escapeHtml(s.lead)}</p>` : '';
  const kidHtml = s.kidSummary ? `<div style="background:#fff9ec;border:1px solid #f4c64a;border-radius:14px;padding:14px 18px;margin:0 0 24px"><span style="display:inline-block;background:${ACCENT};color:#3a2c06;font-weight:800;font-size:0.78rem;border-radius:999px;padding:3px 12px;margin-bottom:8px">やさしい まとめ</span><p style="margin:0;color:#233028;line-height:1.85">${escapeHtml(s.kidSummary)}</p></div>` : '';
  return `<article style="font-family:${FONT};line-height:1.85;max-width:920px;margin:0 auto;padding:24px 16px;color:#233028">
  <nav style="font-size:0.85rem;color:#6b7280;margin:0 0 16px"><a href="/chalk-lab/" style="color:${BOARD};text-decoration:none">${SITE_NAME}</a> <span style="color:#9ca3af">›</span> <span style="color:#4b5563;font-weight:600">${escapeHtml(s.shortTitle)}</span></nav>
  <header style="margin-bottom:20px">
    <div style="line-height:1;margin-bottom:8px">${iconSvg(SECTION_ICON[s.id], 60)}</div>
    <h1 style="font-size:1.7rem;color:${BOARD};border-bottom:3px solid ${ACCENT};padding-bottom:10px;margin:0 0 8px">${escapeHtml(s.title)}</h1>
    <div style="font-size:0.85rem;color:#8a9690;margin-top:10px">最終更新: ${formatDateJa(s.updatedAt)}</div>
  </header>
  ${leadHtml}
  ${kidHtml}
  ${tocHtml}
  <div class="section-content">
${contentHtml}
  </div>
  ${faqHtml}
  ${refsHtml}
  <p style="margin-top:32px"><a href="/chalk-lab/" style="color:${BOARD}">← トップへ戻る</a></p>
</article>`;
}

function applyMeta(html: string, title: string, description: string, url: string, ogType: string): string {
  return html
    .replace(/<title>.*?<\/title>/, `<title>${title} | ${SITE_NAME}</title>`)
    .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${description}"`)
    .replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${title}"`)
    .replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${description}"`)
    .replace(/<meta property="og:type" content="[^"]*"/, `<meta property="og:type" content="${ogType}"`)
    .replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${url}"`)
    .replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${url}"`)
    .replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${title}"`)
    .replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${description}"`);
}

function writeSectionPage(s: (typeof sections)[number]) {
  const dir = path.join(DIST_DIR, s.id);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  let html = applyMeta(subDirTemplateHtml, s.title, s.description, `${BASE_URL}/${s.id}/`, 'article')
    .replace('<div id="root"></div>', `<div id="root">${buildSectionFallback(s)}</div>`);

  const articleJsonLd = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Article',
    headline: s.title, description: s.description, url: `${BASE_URL}/${s.id}/`, inLanguage: 'ja',
    datePublished: s.updatedAt, dateModified: s.updatedAt,
    author: { '@type': 'Organization', name: 'study-apps.com' },
    publisher: { '@type': 'Organization', name: 'study-apps.com', url: 'https://study-apps.com/' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/${s.id}/` },
  });
  const breadcrumbJsonLd = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: s.shortTitle, item: `${BASE_URL}/${s.id}/` },
    ],
  });
  const extraJsonLd: string[] = [];
  const faqList = FAQ_BY_SECTION[s.id];
  if (faqList && faqList.length) {
    const faqJsonLd = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faqList.map((qa) => ({ '@type': 'Question', name: qa.question, acceptedAnswer: { '@type': 'Answer', text: qa.answer } })),
    });
    extraJsonLd.push(`<script type="application/ld+json">${faqJsonLd}</script>`);
  }
  html = html.replace('</head>', `<script type="application/ld+json">${articleJsonLd}</script>\n  <script type="application/ld+json">${breadcrumbJsonLd}</script>\n  ${extraJsonLd.join('\n  ')}\n  </head>`);
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  generatedCount++;
}

for (const s of sections) writeSectionPage(s);

function writeStaticPage(id: string, title: string, description: string, bodyHtml: string) {
  const dir = path.join(DIST_DIR, id);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const fallback = `<article style="font-family:${FONT};line-height:1.85;max-width:920px;margin:0 auto;padding:24px 16px;color:#233028">
  <nav style="font-size:0.85rem;color:#6b7280;margin:0 0 16px"><a href="/chalk-lab/" style="color:${BOARD};text-decoration:none">${SITE_NAME}</a> <span style="color:#9ca3af">›</span> <span style="color:#4b5563;font-weight:600">${escapeHtml(title)}</span></nav>
  <h1 style="font-size:1.7rem;color:${BOARD};border-bottom:3px solid ${ACCENT};padding-bottom:10px">${escapeHtml(title)}</h1>
  ${bodyHtml}
  <p style="margin-top:32px"><a href="/chalk-lab/" style="color:${BOARD}">← トップへ戻る</a></p>
</article>`;
  const pageJsonLd = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url: `${BASE_URL}/${id}/`, inLanguage: 'ja',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${BASE_URL}/` },
  });
  const breadcrumbJsonLd = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: title, item: `${BASE_URL}/${id}/` },
    ],
  });
  let html = applyMeta(subDirTemplateHtml, title, description, `${BASE_URL}/${id}/`, 'website')
    .replace('<div id="root"></div>', `<div id="root">${fallback}</div>`);
  html = html.replace('</head>', `<script type="application/ld+json">${pageJsonLd}</script>\n  <script type="application/ld+json">${breadcrumbJsonLd}</script>\n  </head>`);
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  generatedCount++;
}

// 用語集
const glossarySorted = [...glossary].sort((a, b) => (a.reading || a.term).localeCompare(b.reading || b.term, 'ja'));
const glossaryHtml = glossarySorted.map((g) => {
  const related = g.relatedSectionId ? sections.find((s) => s.id === g.relatedSectionId) : null;
  const relatedLink = related ? `<a href="/chalk-lab/${related.id}/" style="display:inline-block;font-size:0.88rem;color:${BOARD};margin-top:4px">関連ページ：${escapeHtml(related.shortTitle)} →</a>` : '';
  const readingSpan = g.reading && g.reading !== g.term ? `<span style="color:#8a9690;font-size:0.9rem;font-weight:400">（${escapeHtml(g.reading)}）</span>` : '';
  return `<div style="border-bottom:1px solid #e3e0d6;padding:18px 0"><dt style="font-weight:700;color:${BOARD};font-size:1.08rem;margin-bottom:6px"><span style="margin-right:4px">${escapeHtml(g.term)}</span>${readingSpan}</dt><dd style="margin:0"><p style="margin:0 0 6px;line-height:1.85">${escapeHtml(g.description)}</p>${relatedLink}</dd></div>`;
}).join('');

writeStaticPage('glossary', 'チョーク用語集', 'チョークに関する用語（炭酸カルシウム、石膏、白亜、円石藻、羽衣チョークなど）の解説。',
  `<p style="color:#4b5b51;font-size:1.05rem;margin:16px 0 24px">本サイトに登場する用語をまとめました。炭酸カルシウム、石膏、白亜、円石藻など、チョークの理解に役立ててください。</p><dl style="margin:0;padding:0">${glossaryHtml}</dl>`);

writeStaticPage('about', 'サイトについて', 'チョークラボについて。サイトの目的・編集方針・運営者・お問い合わせ・免責事項。',
  `<p>「${SITE_NAME}」は、身近なのに意外と知らない「チョーク」について、楽しく学べることを目指した解説サイトです。チョークの成分や書けるしくみ、種類、作り方、歴史、白亜と白亜紀の関係、スポーツ用や裁縫用のチョークまで、はばひろく紹介しています。読むだけでなく、クイズやバッジ集めなどの遊んで学べるしかけも順次そろえていきます。</p>
  <h2 class="content-h2" style="font-size:1.3rem;color:${BOARD};padding:0 0 6px;border-bottom:2px solid #e3e0d6;margin:32px 0 14px">編集・制作方針</h2><p>本サイトのコンテンツは、一般に公開されている情報や資料を参照しつつ、運営者が内容を再構成し、はじめての読者にも分かりやすい形で独自に解説しています。他サイトの文章をそのまま転載することはありません。成分・歴史などの記述は、確認できる事実をもとにまとめるよう努めており、誤りや古くなった情報に気づいた場合は、お問い合わせを受けて随時見直し・修正します。</p>
  <h2 class="content-h2" style="font-size:1.3rem;color:${BOARD};padding:0 0 6px;border-bottom:2px solid #e3e0d6;margin:32px 0 14px">運営者について</h2><p>個人で運営しています。広告収入はサイトの維持費にあてています。</p>
  <h2 class="content-h2" style="font-size:1.3rem;color:${BOARD};padding:0 0 6px;border-bottom:2px solid #e3e0d6;margin:32px 0 14px">お問い合わせ</h2><p>ご質問・誤りのご指摘は<a href="https://forms.gle/ccMv7oKwz6ysDHBe6" target="_blank" rel="noopener noreferrer" style="color:${BOARD}">こちらのGoogleフォーム</a>からお願いします。</p>
  <h2 class="content-h2" style="font-size:1.3rem;color:${BOARD};padding:0 0 6px;border-bottom:2px solid #e3e0d6;margin:32px 0 14px">免責事項</h2><p>本サイトの情報は可能な限り正確を期していますが、その完全性・正確性を保証するものではありません。健康に関わる内容については一般的な情報提供であり、専門的な助言の代わりにはなりません。気になる症状がある場合は医師などの専門家にご相談ください。</p>`);

writeStaticPage('privacy', 'プライバシーポリシー', 'チョークラボのプライバシーポリシー。Cookie・アクセス解析・広告の使用について。',
  `<h2 class="content-h2" style="font-size:1.3rem;color:${BOARD};padding:0 0 6px;border-bottom:2px solid #e3e0d6;margin:32px 0 14px">アクセス解析</h2><p>本サイトでは Google Analytics を使用しています。Cookie を利用して匿名のトラフィックデータを収集します。収集される情報は匿名で、個人を特定するものではありません。</p>
  <h2 class="content-h2" style="font-size:1.3rem;color:${BOARD};padding:0 0 6px;border-bottom:2px solid #e3e0d6;margin:32px 0 14px">広告について</h2><p>本サイトでは Google AdSense などの第三者配信の広告サービスを利用することがあります。広告配信事業者は、ユーザーの興味に応じた広告を表示するために Cookie を使用することがあります。Cookie の使用を望まない場合は、Google の広告設定から無効にできます。</p>
  <h2 class="content-h2" style="font-size:1.3rem;color:${BOARD};padding:0 0 6px;border-bottom:2px solid #e3e0d6;margin:32px 0 14px">免責事項</h2><p>本サイトの情報の利用により生じた損害について、運営者は一切の責任を負いません。</p>`);

writeStaticPage('quiz', 'チョーク検定（クイズ）', 'チョークの科学・歴史・トリビアから、全30問の中より毎回ランダムに10問を出題するクイズ。読んだ知識を力だめしできます。',
  `<p style="color:#4b5b51;font-size:1.05rem;margin:16px 0 24px">全30問の中から、毎回ランダムに10問を出題。8問以上の正解で合格です。選択肢の並びも毎回シャッフルされ、連続正解すると記録がのびます。さらに「今日の検定」は全員おなじ10問で、毎日挑戦すると連続記録（デイリーストリーク）がのびます。よみものを読んでから挑戦すると解きやすくなります。</p>
  <p>このページはブラウザ上で、その場で答え合わせができるクイズです。出題テーマには、チョークが黒板に書けるしくみ、炭酸カルシウムと石膏のちがい、白亜と白亜紀の関係、伝説の羽衣チョーク（チョーク黙示録や韓国セジョンモールへの継承）、クライミング用チョークの役割、ホタテ貝殻の再利用などが含まれます。各問には難易度（★）が付き、正解すると解説と関連するよみものへのリンクが表示され、図鑑カードの習熟度も上がります。</p>
  <p><a href="/chalk-lab/" style="color:${BOARD};font-weight:600">トップのよみもの一覧</a>から各テーマを読んでから挑戦するのがおすすめです。バッジは<a href="/chalk-lab/badges/" style="color:${BOARD};font-weight:600">こちら</a>。</p>`);

writeStaticPage('badges', 'ステータス＆バッジ', 'よみものを読み、チョーク検定に挑戦し、図鑑を集めると経験値（XP）がたまり「チョーク博士」へレベルアップ。バッジの一覧と達成度を確認できます。',
  `<p style="color:#4b5b51;font-size:1.05rem;margin:16px 0 24px">読む・解く・集めるすべてが経験値（XP）になり、「チョーク みならい」から「チョーク博士」「チョーク王」へとレベルが上がります。よみものを読んだり、チョーク検定に挑戦したりすると、バッジもあつまります。達成度を、このページで確認できます。</p>
  <p>「チョークの入口」「チョーク見習い」「チョーク博士」（よみもの読破）、「はじめての検定」「検定合格」「チョークマスター」（クイズの成績）、「図鑑コンプリート」「レアハンター」（チョーク図鑑の収集）など、読む・解く・集めるを楽しめるよう用意しています。進み具合はお使いの端末に保存され、次に開いたときも引き継がれます。</p>
  <p><a href="/chalk-lab/dex/" style="color:${BOARD};font-weight:600">チョーク図鑑を見る</a> ／ <a href="/chalk-lab/quiz/" style="color:${BOARD};font-weight:600">チョーク検定に挑戦する</a> ／ <a href="/chalk-lab/" style="color:${BOARD};font-weight:600">よみもの一覧へ</a></p>`);

// チョーク図鑑（カタログとして全カードを静的出力＝SEO/クロール用）
const dexByCategory = Array.from(new Set(CHALK_CARDS.map((c) => c.category)));
const dexCatalogHtml = dexByCategory.map((cat) => {
  const cards = CHALK_CARDS.filter((c) => c.category === cat).map((c) => {
    const rarity = '★'.repeat(c.rarity) + '☆'.repeat(3 - c.rarity);
    return `<div style="border:1px solid #e3e0d6;border-radius:14px;padding:16px 14px;background:#fff${c.rarity === 3 ? ';box-shadow:0 0 12px rgba(224,168,46,0.3);border-color:' + ACCENT : ''}">
      <div style="font-size:0.85rem;color:${ACCENT};letter-spacing:1px">${rarity}</div>
      <div style="line-height:1">${iconSvg(c.id, 56)}</div>
      <div style="font-weight:800;color:#233028;margin:6px 0">${escapeHtml(c.name)}</div>
      <p style="font-size:0.85rem;color:#233028;margin:0 0 8px;line-height:1.6">${escapeHtml(c.front)}</p>
      <p style="font-size:0.8rem;color:#4b5b51;margin:0 0 8px;line-height:1.65">${escapeHtml(c.back)}</p>
      <a href="/chalk-lab/${c.relatedSectionId}/" style="font-size:0.82rem;color:${BOARD};font-weight:600">くわしく読む →</a>
    </div>`;
  }).join('');
  return `<h2 class="content-h2" style="font-size:1.05rem;color:${BOARD};padding:0 0 6px;border-bottom:2px solid #e3e0d6;margin:28px 0 14px">${CATEGORY_LABEL[cat]}</h2>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px">${cards}</div>`;
}).join('');

writeStaticPage('dex', 'チョーク図鑑', `チョークの種類・成分・トリビアを集める全${TOTAL_CARDS}種のカード図鑑。よみものを読むと発見、チョーク検定の正解で習熟度が上がります。`,
  `<p style="color:#4b5b51;font-size:1.05rem;margin:16px 0 24px">よみものを読むとカードを発見、チョーク検定に正解すると習熟度（★）が上がる、全${TOTAL_CARDS}種のチョーク図鑑です。白墨や色チョークから、伝説の羽衣チョーク、白亜・円石藻、クライミングやビリヤード用まで、はばひろく収録しています。</p>
  ${dexCatalogHtml}
  <p style="margin-top:28px"><a href="/chalk-lab/quiz/" style="color:${BOARD};font-weight:600">チョーク検定で習熟度を上げる</a> ／ <a href="/chalk-lab/" style="color:${BOARD};font-weight:600">よみもの一覧へ</a></p>`);

writeStaticPage('workshop', 'チョーク工房（配合ミニゲーム）', 'チョークの成分を配合して、書き味・折れにくさ・粉の出にくさ・発色・エコ率を判定。自分だけの「マイチョーク」を作って集められる、学んで遊べるミニゲーム。',
  `<p style="color:#4b5b51;font-size:1.05rem;margin:16px 0 24px">炭酸カルシウム・石膏・ホタテ貝殻・顔料の配合や表面コーティングを変えると、チョークの性能（書き味・折れにくさ・粉の出にくさ・発色・エコ率）が変わります。よみもの（<a href="/chalk-lab/basics/" style="color:${BOARD};font-weight:600">基礎</a>・<a href="/chalk-lab/making/" style="color:${BOARD};font-weight:600">作り方</a>）で学んだことを、配合シミュレーターで試せます。</p>
  <p>炭酸カルシウムは折れにくく粉が舞いにくい土台、石膏はやわらかく書きやすい一方で粉が舞いやすい、ホタテ貝殻はエコだが入れすぎると硬くなりすぎる——といった性質を、実際にスライダーを動かして体感できます。作った「マイチョーク」は端末に保存され、ランク（S/A/B/C）とともに棚に並びます。</p>
  <p><a href="/chalk-lab/" style="color:${BOARD};font-weight:600">トップへ戻る</a></p>`);

writeStaticPage('draw', '黒板キャンバス（チョークで書く体験）', '画面の黒板に、チョークみたいな“かすれ”た線を描ける体験。白＋赤青黄緑のチョークを選んで書き、黒板消しで消せます。スマホ・タブレットのタッチにも対応。',
  `<p style="color:#4b5b51;font-size:1.05rem;margin:16px 0 24px">画面の黒板を、指やマウスでなぞると、チョークのような“かすれ”た線が描けます。白・赤・青・黄・緑のチョークを選んだり、黒板消しで消したり、全部消したりできます。スマホ・タブレットでも遊べます。</p>
  <p>「チョークで書く」しくみ——やわらかいチョークがこすれて粉になり、黒板の細かなデコボコにひっかかって残る——を、実際に手を動かして体感できる全年齢向けのページです。書き味のことは <a href="/chalk-lab/basics/" style="color:${BOARD};font-weight:600">チョークの基礎</a> でくわしく紹介しています。</p>
  <p><a href="/chalk-lab/" style="color:${BOARD};font-weight:600">トップへ戻る</a></p>`);

const mapStaticList = sections
  .map((s, i) => `<li style="margin-bottom:12px"><a href="/chalk-lab/${s.id}/" style="color:${BOARD};font-weight:600;text-decoration:none">${i + 1}. ${escapeHtml(s.shortTitle)}</a> — <span style="color:#555;font-size:0.9rem">${escapeHtml(s.description)}</span></li>`)
  .join('\n');
writeStaticPage('map', 'チョークの旅マップ', 'よみもの8本を“旅のマップ”としてめぐり、読んだ地点にスタンプを集めて全踏破をめざす、全年齢向けの学習導線。',
  `<p style="color:#4b5b51;font-size:1.05rem;margin:16px 0 24px">よみものをめぐる旅のマップです。1〜8の地点を順に読み進めて、ぜんぶ踏破するとチョーク博士。どの地点からでも読めます。</p>
  <ol style="padding-left:1.2em">${mapStaticList}</ol>
  <p style="margin-top:20px"><a href="/chalk-lab/" style="color:${BOARD};font-weight:600">トップへ戻る</a></p>`);

writeStaticPage('guess', 'チョーク絵当て（図鑑カードクイズ）', '集めた図鑑カードの絵を見て名前を当てる、全年齢向けの絵当てクイズ。正解するとそのカードの習熟度が上がります。',
  `<p style="color:#4b5b51;font-size:1.05rem;margin:16px 0 24px">図鑑カードの絵（アイコン）を見て、正しい名前を当てるゲームです。字が読めなくても、絵で楽しめます。正解すると、そのカードの習熟度（★）が上がります。図鑑カードが2枚あればあそべます。よみものを1つ読めば、すぐに挑戦できます。</p>
  <p>白墨・色チョーク・ダストレス・羽衣チョーク・円石藻・クライミング用など、集めたカードがそのまま出題されます。<a href="/chalk-lab/dex/" style="color:${BOARD};font-weight:600">チョーク図鑑</a>でカードを集めてから挑戦しましょう。</p>
  <p><a href="/chalk-lab/" style="color:${BOARD};font-weight:600">トップへ戻る</a></p>`);

writeStaticPage('play', 'あそぶ｜チョークラボの遊び一覧', 'チョークラボの遊び（旅マップ・図鑑・工房・黒板キャンバス・検定・絵当て・ステータス）をまとめた、あそびのハブページ。',
  `<p style="color:#4b5b51;font-size:1.05rem;margin:16px 0 24px">読んで・解いて・集めて・作って・描いて。チョークラボの遊びがぜんぶここに。</p>
  <ul style="list-style:none;padding:0">
    <li style="margin-bottom:12px"><a href="/chalk-lab/map/" style="color:${BOARD};font-weight:600">旅のマップ</a> — よみものを順にめぐって全踏破をめざそう。</li>
    <li style="margin-bottom:12px"><a href="/chalk-lab/dex/" style="color:${BOARD};font-weight:600">チョーク図鑑</a> — 読んで集めるカード28種。</li>
    <li style="margin-bottom:12px"><a href="/chalk-lab/workshop/" style="color:${BOARD};font-weight:600">チョーク工房</a> — 成分を配合して自分だけのチョークを作ろう。</li>
    <li style="margin-bottom:12px"><a href="/chalk-lab/draw/" style="color:${BOARD};font-weight:600">黒板キャンバス</a> — チョークで黒板にお絵かき。</li>
    <li style="margin-bottom:12px"><a href="/chalk-lab/quiz/" style="color:${BOARD};font-weight:600">チョーク検定</a> — 全30問からランダム10問。今日の検定も。</li>
    <li style="margin-bottom:12px"><a href="/chalk-lab/guess/" style="color:${BOARD};font-weight:600">チョーク絵当て</a> — カードの絵を見て名前を当てよう。</li>
    <li style="margin-bottom:12px"><a href="/chalk-lab/badges/" style="color:${BOARD};font-weight:600">ステータス＆バッジ</a> — レベル・XP・バッジを確認。</li>
  </ul>
  <p><a href="/chalk-lab/" style="color:${BOARD};font-weight:600">トップへ戻る</a></p>`);

const timelineHtml = TIMELINE
  .map((s) => `<div style="margin:0 0 26px"><div style="max-width:360px"><svg viewBox="0 0 300 170" style="width:100%;height:auto;border-radius:14px;box-shadow:0 6px 20px rgba(31,58,46,0.1)">${s.svg}</svg></div><h2 class="content-h2" style="font-size:1.1rem;color:${BOARD};margin:12px 0 6px">${escapeHtml(s.title)}</h2><p style="margin:0;color:#233028;line-height:1.85">${escapeHtml(s.body)}</p></div>`)
  .join('');
writeStaticPage('timeline', 'チョーク誕生の旅（白亜紀タイムライン）', '毎日のチョークが、円石藻→海底に堆積→白亜→白亜紀→黒板のチョーク、と何千万年もかけて生まれた物語を5ステップでたどる体験。',
  `<p style="color:#4b5b51;font-size:1.05rem;margin:16px 0 24px">毎日のチョークは、何千万年も前の小さなプランクトン「円石藻」からできました。誕生のながれを①〜⑤でたどってみましょう。</p>
  ${timelineHtml}
  <p style="margin-top:8px"><a href="/chalk-lab/geology/" style="color:${BOARD};font-weight:600">白亜と白亜紀をくわしく読む</a> ／ <a href="/chalk-lab/" style="color:${BOARD};font-weight:600">トップへ戻る</a></p>`);

console.log(`✓ Generated ${generatedCount} static pages`);

// sitemap.xml
const sitemapToday = new Date().toISOString().split('T')[0];
const sitemapEntries = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/play/', changefreq: 'monthly', priority: '0.8' },
  { path: '/timeline/', changefreq: 'monthly', priority: '0.7' },
  ...sections.map((s) => ({ path: `/${s.id}/`, changefreq: 'monthly', priority: '0.9' })),
  { path: '/map/', changefreq: 'monthly', priority: '0.7' },
  { path: '/dex/', changefreq: 'monthly', priority: '0.8' },
  { path: '/workshop/', changefreq: 'monthly', priority: '0.7' },
  { path: '/draw/', changefreq: 'monthly', priority: '0.7' },
  { path: '/quiz/', changefreq: 'monthly', priority: '0.8' },
  { path: '/guess/', changefreq: 'monthly', priority: '0.7' },
  { path: '/badges/', changefreq: 'monthly', priority: '0.5' },
  { path: '/glossary/', changefreq: 'monthly', priority: '0.6' },
  { path: '/about/', changefreq: 'yearly', priority: '0.3' },
  { path: '/privacy/', changefreq: 'yearly', priority: '0.3' },
];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map((e) => `  <url>
    <loc>${BASE_URL}${e.path}</loc>
    <lastmod>${sitemapToday}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml);
console.log(`✓ sitemap.xml generated (${sitemapEntries.length} URLs)`);
console.log('--- Done ---');
