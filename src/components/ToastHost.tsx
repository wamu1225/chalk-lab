import { useEffect, useState } from 'react';
import { subscribeToasts } from '../utils/toast';
import type { Toast } from '../utils/toast';
import { getCard } from '../data/chalkCards';
import { ChalkIcon } from './ChalkIcon';
import { BASE, navigateTo } from '../utils/nav';

export function ToastHost() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return subscribeToasts((t) => {
      setToasts((cur) => [...cur, t]);
      setTimeout(() => setToasts((cur) => cur.filter((x) => x.id !== t.id)), 6000);
    });
  }, []);

  const dismiss = (id: number) => setToasts((cur) => cur.filter((x) => x.id !== id));

  if (toasts.length === 0) return null;
  return (
    <div className="toast-host">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.accent ? 'accent' : ''}`} role="status">
          <button className="toast-close" aria-label="閉じる" onClick={() => dismiss(t.id)}>×</button>
          <div className="toast-title">{t.emoji ? `${t.emoji} ` : ''}{t.title}</div>
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
