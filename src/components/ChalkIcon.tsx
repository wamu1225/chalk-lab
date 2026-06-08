import { ICON_ART, ICON_TINT } from '../data/chalkIcons';

// 内製SVGアイコン。motif id（カードid or セクションのmotif）を渡す。
export function ChalkIcon({ motif, size = 56, className }: { motif: string; size?: number; className?: string }) {
  const def = ICON_ART[motif];
  if (!def) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
      className={className}
      dangerouslySetInnerHTML={{ __html: `<rect width="64" height="64" rx="14" fill="${ICON_TINT[def.tint]}"/>${def.art}` }}
    />
  );
}
