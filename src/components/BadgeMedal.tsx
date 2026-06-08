import { medalInner } from '../data/badgeMedals';

export function BadgeMedal({ id, earned, size = 56, className }: { id: string; earned: boolean; size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
      className={className}
      dangerouslySetInnerHTML={{ __html: medalInner(id, earned) }}
    />
  );
}
