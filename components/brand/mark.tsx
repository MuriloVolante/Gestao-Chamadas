'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Mark({ size = 28, className, animate = false }: { size?: number; className?: string; animate?: boolean }) {
  const [playing, setPlaying] = useState(false)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden
      data-playing={playing || undefined}
      onMouseEnter={animate ? () => setPlaying(true) : undefined}
      onAnimationEnd={e => e.animationName === 'mark-spin' && setPlaying(false)}
      className={cn('mark overflow-visible', className)}
    >
      <g className="mark-ring">
        <path d="M34.2 14.4A14 14 0 1 0 34.2 33.6" pathLength={100} className="mark-arc" stroke="var(--mark)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="39" cy="24" r="2.6" fill="#2396B4" fillOpacity="0.55" />
      </g>
      <circle cx="24" cy="24" r="5" fill="#2396B4" className="mark-core" />
    </svg>
  )
}
