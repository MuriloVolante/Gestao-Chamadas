export function Mark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden className={className}>
      <path d="M34.2 14.4A14 14 0 1 0 34.2 33.6" stroke="var(--mark)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="5" fill="#2396B4" />
      <circle cx="39" cy="24" r="2.6" fill="#2396B4" fillOpacity="0.55" />
    </svg>
  )
}
