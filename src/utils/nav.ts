export const BASE = '/chalk-lab';
export const SITE_NAME = 'チョークラボ';

export function navigateTo(path: string) {
  const full = BASE + (path.startsWith('/') ? path : '/' + path);
  window.history.pushState({}, '', full);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
