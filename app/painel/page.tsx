'use client'

import { useEffect, useRef, useState } from 'react'
import { LiveDot } from '@/components/ui/live-dot'

type Call = { id: number; patientName: string; departmentName: string; calledAt: string }

export default function PainelPage() {
  const [current, setCurrent] = useState<Call | null>(null)
  const [flash, setFlash] = useState(false)
  const previous = useRef<number | null>(null)

  async function load() {
    const res = await fetch('/api/clinic', { cache: 'no-store' })
    const data = await res.json()
    if (data.calls[0] && data.calls[0].id !== previous.current) {
      previous.current = data.calls[0].id
      setCurrent(data.calls[0])
      setFlash(true)
      window.setTimeout(() => setFlash(false), 900)
      beep()
    }
  }

  useEffect(() => {
    load()
    const timer = setInterval(load, 2500)
    return () => clearInterval(timer)
  }, [])

  function beep() {
    try {
      const ctx = new AudioContext()
      ;[0, 180, 360].forEach((delay) => {
        const oscillator = ctx.createOscillator()
        const gain = ctx.createGain()
        const start = ctx.currentTime + delay / 1000
        oscillator.frequency.value = 880
        gain.gain.setValueAtTime(0.18, start)
        oscillator.connect(gain)
        gain.connect(ctx.destination)
        oscillator.start(start)
        oscillator.stop(start + 0.1)
      })
    } catch {}
  }

  return (
    <main className="theme-dark tv-panel relative flex min-h-screen flex-col overflow-hidden text-foreground">
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="section-label flex items-center gap-3 text-base! tracking-[0.3em]!">
          <LiveDot className="size-2.5" /> Chamado agora
        </p>
        {current ? (
          <div key={current.id} className={flash ? 'animate-view-in' : ''}>
            <h1 className="mt-10 max-w-[92vw] font-display text-7xl leading-[1.02] font-bold tracking-[-0.03em] text-balance uppercase md:text-[8.5rem] lg:text-[9.5rem]">
              {current.patientName}
            </h1>
            <p className="mt-10 inline-flex items-center gap-4 rounded-2xl border border-primary/35 bg-primary/8 px-8 py-4 font-display text-4xl font-semibold text-brand md:text-5xl">
              {current.departmentName}
            </p>
          </div>
        ) : (
          <p className="mt-10 font-display text-3xl font-semibold text-muted-foreground">Aguardando próxima chamada</p>
        )}
      </section>
    </main>
  )
}
