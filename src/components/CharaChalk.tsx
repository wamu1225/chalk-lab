import { mascotInner } from '../data/mascot';
import type { MascotExpr } from '../data/mascot';

export function CharaChalk({ expr = 'normal', size = 72, className }: { expr?: MascotExpr; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={Math.round((size * 78) / 64)}
      viewBox="0 0 64 78"
      role="img"
      aria-hidden="true"
      className={className}
      dangerouslySetInnerHTML={{ __html: mascotInner(expr) }}
    />
  );
}
