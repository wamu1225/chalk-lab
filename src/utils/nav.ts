export const BASE = '/chalk-lab';
export { SITE_NAME } from '../data/static-pages';

export function navigateTo(path: string) {
  const full = BASE + (path.startsWith('/') ? path : '/' + path);
  window.history.pushState({}, '', full);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
