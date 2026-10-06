const outer = [
  [20, 7, '#96D737'],
  [31.3, 13.5, '#2396B4'],
  [31.3, 26.5, '#96D737'],
  [20, 33, '#2396B4'],
  [8.7, 26.5, '#96D737'],
  [8.7, 13.5, '#2396B4'],
] as const

export function MeshMark({ size = 30, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden className={className}>
      <polygon points="20,7 31.3,13.5 31.3,26.5 20,33 8.7,26.5 8.7,13.5" stroke="#2396B4" strokeOpacity="0.55" strokeWidth="1.5" strokeLinejoin="round" />
      {outer.map(([x, y]) => <line key={`l${x}-${y}`} x1="20" y1="20" x2={x} y2={y} stroke="#96D737" strokeOpacity="0.5" strokeWidth="1.5" />)}
      {outer.map(([x, y, c]) => <circle key={`c${x}-${y}`} cx={x} cy={y} r="2.4" fill={c} />)}
      <circle cx="20" cy="20" r="4.4" fill="#96D737" stroke="#2D2D2D" strokeWidth="1.4" />
    </svg>
  )
}
