import { useEffect, useState } from 'react';
import { subscribeToasts } from '../utils/toast';
import type { Toast } from '../utils/toast';
import { getCard } from '../data/chalkCards';
import { ChalkIcon } from './ChalkIcon';
import { BadgeMedal } from './BadgeMedal';
import { CharaChalk } from './CharaChalk';
import { BASE, navigateTo } from '../utils/nav';

export function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return subscribeToasts((t) => {
      // 同時表示は最新3件まで（積み上がって記事を覆わないように）
      setToasts((cur) => [...cur, t].slice(-3));
      setTimeout(() => setToasts((cur) => cur.filter((x) => x.id !== t.id)), 4500);
    });
  }, []);

  const dismiss = (id: number) => setToasts((cur) => cur.filter((x) => x.id !== id));

  if (toasts.length === 0) return null;
  return (
    <div className="toast-host">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.accent ? 'accent' : ''}`} role="status">
          <button className="toast-close" aria-label="閉じる" onClick={() => dismiss(t.id)}>×</button>
          <div className="toast-title">
            {t.mascot && <CharaChalk expr={t.mascot} size={30} className="toast-mascot" />}
            {t.badgeId && <BadgeMedal id={t.badgeId} earned size={26} className="toast-medal" />}
            <span>{t.emoji && !t.badgeId && !t.mascot ? `${t.emoji} ` : ''}{t.title}</span>
          </div>
          {t.cards && t.cards.length > 0 && (
            <div className="toast-cards">
              {t.cards.map((id) => {
                const c = getCard(id);
                if (!c) return null;
                return (
                  <span key={id} className="toast-card">
                    <ChalkIcon motif={id} size={28} />
                    <span>{c.name}</span>
                  </span>
                );
              })}
            </div>
          )}
          {t.link && (
            <a href={`${BASE}${t.link.path}`} onClick={(e) => { e.preventDefault(); navigateTo(t.link!.path); }}>
              {t.link.label}
            </a>
          )}
        </div>
      ))}
    </div>
  );
}
