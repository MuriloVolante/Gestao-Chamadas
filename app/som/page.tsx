'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Bell, Check, Eraser, Play, Radio, RotateCcw, Volume2, VolumeX, Waves } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { DEFAULT_SOUND, Instrument, MAX_PER_STEP, NOTES, normalizeSound, playSound, SoundConfig, STEPS } from '@/lib/sound'
import { cn } from '@/lib/utils'

const OPTIONS: { id: Instrument; name: string; description: string; icon: React.ReactNode }[] = [
  { id: 'bipe', name: 'Bipe', description: 'Curto e direto, como um aviso.', icon: <Radio /> },
  { id: 'sino', name: 'Sino', description: 'Brilhante e prolongado.', icon: <Bell /> },
  { id: 'suave', name: 'Suave', description: 'Macio, chama sem assustar.', icon: <Waves /> },
]

const TONES: Record<Instrument, string> = { bipe: '#96D737', sino: '#2396B4', suave: '#FFC800' }
const tone = (i: Instrument) => ({ '--tone': TONES[i] }) as React.CSSProperties

export default function SomPage() {
  const [config, setConfig] = useState<SoundConfig>(DEFAULT_SOUND)
  const [saved, setSaved] = useState<string | null>(null)
  const [step, setStep] = useState<number | null>(null)
  const [blocked, setBlocked] = useState<number | null>(null)
  const [status, setStatus] = useState('')

  useEffect(() => { fetch('/api/sound', { cache: 'no-store' }).then(r => r.json()).then(c => { const n = normalizeSound(c); setConfig(n); setSaved(JSON.stringify(n)) }) }, [])

  const dirty = saved !== null && saved !== JSON.stringify(config)
  const empty = config.steps.every(c => !c.length)
  const update = (patch: Partial<SoundConfig>) => setConfig(c => ({ ...c, ...patch }))

  function chooseInstrument(instrument: Instrument) {
    const next = { ...config, instrument }
    setConfig(next)
    playSound(empty ? { ...next, steps: [[4], [2], [0]] } : next)
  }

  function toggle(col: number, note: number) {
    const current = config.steps[col]
    if (current.includes(note)) return update({ steps: config.steps.map((c, i) => (i === col ? c.filter(n => n !== note) : c)) })
    if (current.length >= MAX_PER_STEP) { setBlocked(col); setTimeout(() => setBlocked(null), 1600); return }
    update({ steps: config.steps.map((c, i) => (i === col ? [...c, note] : c)) })
    playSound({ ...config, steps: [[note]] })
  }

  async function save() {
    const res = await fetch('/api/sound', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) })
    const n = normalizeSound(await res.json())
    setConfig(n)
    setSaved(JSON.stringify(n))
    setStatus('Som salvo. A TV já vai usar este toque.')
    setTimeout(() => setStatus(''), 3000)
  }

  return (
    <main className="theme-dark flex min-h-screen flex-col" style={tone(config.instrument)}>
      <header className="sticky top-0 z-10 border-b border-border bg-sidebar/94 backdrop-blur-md">
        <div className="mx-auto flex h-[66px] max-w-3xl items-center justify-between px-4 sm:px-6">
          <a href="/" className={buttonVariants({ variant: 'ghost', className: '-ml-3' })}><ArrowLeft /> Voltar</a>
          <Logo />
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl flex-1 animate-view-in space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <div>
          <p className="section-label">Configuração</p>
          <h1 className="mt-1.5 font-display text-2xl font-semibold sm:text-[28px]">Som da chamada</h1>
          <p className="mt-2 text-[15px] text-muted-foreground">Monte o toque que a TV faz quando alguém é chamado.</p>
        </div>

        <Card>
          <CardHeader label="Passo 1" title="Escolha o toque" description="Clique para ouvir." />
          <div className="grid gap-2 sm:grid-cols-3">
            {OPTIONS.map(o => {
              const active = config.instrument === o.id
              return (
                <button key={o.id} type="button" aria-pressed={active} onClick={() => chooseInstrument(o.id)} style={tone(o.id)} className={cn('flex items-center gap-3 rounded-lg border p-4 text-left transition-[background-color,border-color,transform] duration-200 ease-spring active:scale-[.975]', active ? 'border-(--tone) bg-[color-mix(in_srgb,var(--tone)_12%,transparent)]' : 'border-input bg-field hover:border-tertiary')}>
                  <span className={cn('grid size-10 shrink-0 place-items-center rounded-lg [&_svg]:size-5', active ? 'bg-(--tone) text-primary-foreground' : 'bg-secondary text-muted-foreground')}>{o.icon}</span>
                  <span className="grid gap-0.5">
                    <span className="font-medium">{o.name}</span>
                    <span className="text-[13px] text-muted-foreground">{o.description}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </Card>

        <Card>
          <CardHeader
            label="Passo 2"
            title="Monte a melodia"
            description="Clique nos quadrados. A música toca da esquerda para a direita; quanto mais alto, mais agudo."
            action={<Button variant="ghost" size="sm" onClick={() => update({ steps: config.steps.map(() => []) })} disabled={empty}><Eraser /> Limpar</Button>}
          />
          <div className="overflow-x-auto">
            <div className="grid min-w-[320px] gap-1.5" style={{ gridTemplateColumns: `2.75rem repeat(${STEPS}, minmax(0, 1fr))` }}>
              <span />
              {config.steps.map((_, col) => (
                <span key={col} className={cn('pb-1 text-center text-[12px] tabular-nums transition-colors', step === col ? 'font-semibold text-(--tone)' : 'text-tertiary')}>{col + 1}</span>
              ))}
              {NOTES.map((note, row) => (
                <div key={note.name} className="contents">
                  <span className="flex items-center text-[13px] font-medium text-muted-foreground">{note.name}</span>
                  {config.steps.map((notes, col) => {
                    const on = notes.includes(row)
                    return (
                      <button
                        key={col}
                        type="button"
                        aria-pressed={on}
                        aria-label={`${note.name}, momento ${col + 1}`}
                        onClick={() => toggle(col, row)}
                        className={cn(
                          'h-11 rounded-md border transition-[background-color,border-color,box-shadow,transform] duration-200 ease-spring active:scale-[.93]',
                          on ? 'border-(--tone) bg-(--tone) shadow-[0_0_12px_color-mix(in_srgb,var(--tone)_55%,transparent)]' : 'border-transparent bg-secondary hover:border-tertiary',
                          step === col && (on ? 'scale-110' : 'bg-[#454545]'),
                          blocked === col && 'animate-shake border-warning',
                        )}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
          <p className={cn('mt-4 text-[13px] transition-colors', blocked !== null ? 'text-warning' : 'text-tertiary')}>
            {blocked !== null ? `A coluna ${blocked + 1} já tem ${MAX_PER_STEP} notas. Tire uma antes de colocar outra.` : `Até ${MAX_PER_STEP} notas por coluna.`}
          </p>
        </Card>

        <Card>
          <CardHeader label="Passo 3" title="Volume" />
          <div className="flex items-center gap-4">
            <VolumeX className="size-5 shrink-0 text-muted-foreground" />
            <input type="range" min={0} max={100} step={5} value={config.volume} onChange={e => update({ volume: Number(e.target.value) })} aria-label="Volume" className="range flex-1" style={{ '--value': `${config.volume}%` } as React.CSSProperties} />
            <Volume2 className="size-5 shrink-0 text-muted-foreground" />
            <span className="w-12 text-right font-display text-lg font-semibold tabular-nums">{config.volume}%</span>
          </div>
        </Card>
      </div>

      <div className="sticky bottom-0 z-10 border-t border-border bg-sidebar/94 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-2 px-4 py-3 sm:px-6">
          <Button variant="outline" size="lg" onClick={() => playSound(config, setStep)} disabled={empty || step !== null}><Play /> {step !== null ? 'Tocando…' : 'Testar som'}</Button>
          <Button variant="ghost" size="lg" onClick={() => setConfig(DEFAULT_SOUND)}><RotateCcw /> Restaurar padrão</Button>
          <span role="status" className={cn('ml-auto text-[13px]', status ? 'text-brand' : 'text-tertiary')}>{status || (dirty ? 'Alterações não salvas' : '')}</span>
          <Button size="lg" onClick={save} disabled={!dirty}><Check /> Salvar</Button>
        </div>
      </div>
    </main>
  )
}
