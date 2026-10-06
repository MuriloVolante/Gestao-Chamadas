'use client'

import { useEffect, useRef, useState } from 'react'

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
    <main className="tv-panel flex min-h-screen flex-col overflow-hidden bg-primary text-primary-foreground">
      <section className="flex flex-1 flex-col items-center justify-center px-6 pb-12 pt-16 text-center">
        <p className="tv-kicker font-mono text-base uppercase tracking-[0.4em]">Chamado agora</p>
        {current ? (
          <>
            <h1 className={`tv-name mt-8 max-w-[92vw] text-balance text-7xl font-black uppercase leading-none tracking-tight md:text-[9rem] lg:text-[10rem] ${flash ? 'tv-name-flash' : ''}`}>
              {current.patientName}
            </h1>
            <p className="tv-department mt-8 text-4xl font-bold md:text-5xl">{current.departmentName}</p>
          </>
        ) : (
          <p className="mt-10 text-3xl opacity-60">Aguardando próxima chamada</p>
        )}
      </section>

    </main>
  )
}

