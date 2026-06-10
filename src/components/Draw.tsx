import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { ArrowLeft, Eraser, Trash2, Download } from 'lucide-react';
import { BASE, SITE_NAME, navigateTo } from '../utils/nav';
import { ChalkIcon } from './ChalkIcon';

const BOARD = '#1f3a2e';
const COLORS = [
  { id: 'white', label: '白', color: '#fdfdfb' },
  { id: 'red', label: '赤', color: '#ff6b6b' },
  { id: 'blue', label: '青', color: '#6db3ff' },
  { id: 'yellow', label: '黄', color: '#ffe066' },
  { id: 'green', label: '緑', color: '#7be0a0' },
];

type Pt = { x: number; y: number };

export function Draw() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawing = useRef(false);
  const last = useRef<Pt | null>(null);
  const [tool, setTool] = useState<string>('white'); // color id or 'eraser'
  const toolRef = useRef(tool);
  toolRef.current = tool;

  const paintBoard = () => {
    const c = canvasRef.current;
    const ctx = ctxRef.current;
    if (!c || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    ctx.fillStyle = BOARD;
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.restore();
  };

  useEffect(() => {
    document.title = `黒板キャンバス | ${SITE_NAME}`;
    window.scrollTo(0, 0);
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = c.getBoundingClientRect();
    const w = Math.max(280, Math.round(rect.width));
    const h = Math.round(w * 0.62);
    c.width = w * dpr;
    c.height = h * dpr;
    c.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    paintBoard();
  }, []);

  const getPos = (e: ReactPointerEvent<HTMLCanvasElement>): Pt => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const drawSeg = (a: Pt, b: Pt) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const t = toolRef.current;
    if (t === 'eraser') {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = BOARD;
      ctx.lineWidth = 28;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
      return;
    }
    const color = COLORS.find((c) => c.id === t)?.color ?? '#fdfdfb';
    const size = 5;
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const steps = Math.max(1, Math.floor(dist / 2));
    ctx.fillStyle = color;
    for (let i = 0; i <= steps; i++) {
      const tt = i / steps;
      const x = a.x + (b.x - a.x) * tt;
      const y = a.y + (b.y - a.y) * tt;
      for (let j = 0; j < 7; j++) {
        const ang = Math.random() * Math.PI * 2;
        const rr = Math.random() * size;
        ctx.globalAlpha = 0.12 + Math.random() * 0.33;
        ctx.fillRect(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr, 1.3, 1.3);
      }
    }
    ctx.globalAlpha = 1;
  };

  const down = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drawing.current = true;
    const p = getPos(e);
    last.current = p;
    drawSeg(p, p);
  };
  const move = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    e.preventDefault();
    const p = getPos(e);
    if (last.current) drawSeg(last.current, p);
    last.current = p;
  };
  const up = () => {
    drawing.current = false;
    last.current = null;
  };

  const save = () => {
    const c = canvasRef.current;
    if (!c) return;
    try {
      const a = document.createElement('a');
      a.href = c.toDataURL('image/png');
      a.download = 'chalk-lab-board.png';
      a.click();
    } catch {
      // ignore（セキュリティ制限などで保存不可の場合）
    }
  };

  return (
    <article className="draw-screen">
      <h1 className="quiz-h1"><ChalkIcon motif="play-draw" size={28} className="h1-icon" />黒板キャンバス</h1>
      <p className="quiz-lead">
        黒板にチョークで書いてみよう。指やマウスでなぞると、チョークみたいな“かすれ”た線が描けます。
        色をかえたり、黒板消しで消したりできます。
      </p>

      <div className="draw-toolbar" role="toolbar" aria-label="チョークの色と道具">
        {COLORS.map((c) => (
          <button
            key={c.id}
            className={`draw-swatch ${tool === c.id ? 'active' : ''}`}
            style={{ background: c.color }}
            aria-label={`${c.label}チョーク`}
            aria-pressed={tool === c.id}
            onClick={() => setTool(c.id)}
          />
        ))}
        <button className={`draw-tool ${tool === 'eraser' ? 'active' : ''}`} aria-pressed={tool === 'eraser'} onClick={() => setTool('eraser')}>
          <Eraser size={16} /> 消す
        </button>
        <button className="draw-tool" onClick={paintBoard}>
          <Trash2 size={16} /> 全部消す
        </button>
        <button className="draw-tool" onClick={save}>
          <Download size={16} /> 保存
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="draw-canvas"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={up}
      />

      <p className="draw-hint">💡 ヒント：ゆっくりなぞると濃く、すばやく動かすとかすれます。本物のチョークみたいですね。</p>

      <div className="quiz-back">
        <a href={`${BASE}/`} onClick={(e) => { e.preventDefault(); navigateTo('/'); }}><ArrowLeft size={16} /> トップへ戻る</a>
      </div>
    </article>
  );
}
