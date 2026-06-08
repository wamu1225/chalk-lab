// 軽量トースト基盤（pub/sub）。どこからでも pushToast でき、ToastHost が表示する。

export type Toast = {
  id: number;
  emoji?: string;
  title: string;
  cards?: string[];               // 図鑑カードidを並べて表示
  link?: { label: string; path: string };
  accent?: boolean;               // 強調（レベルアップ等）
};

type Listener = (t: Toast) => void;

let seq = 1;
const listeners = new Set<Listener>();

export function subscribeToasts(l: Listener): () => void {
  listeners.add(l);
  return () => { listeners.delete(l); };
}

export function pushToast(t: Omit<Toast, 'id'>): void {
  const toast: Toast = { ...t, id: seq++ };
  listeners.forEach((l) => l(toast));
}
