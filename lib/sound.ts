export type Instrument = 'bipe' | 'sino' | 'suave'
export type SoundConfig = { instrument: Instrument; volume: number; steps: number[][] }

export const NOTES = [
  { name: 'Lá', freq: 880 },
  { name: 'Sol', freq: 783.99 },
  { name: 'Mi', freq: 659.25 },
  { name: 'Ré', freq: 587.33 },
  { name: 'Dó', freq: 523.25 },
]
export const STEPS = 5
export const MAX_PER_STEP = 2
export const STEP_MS = 180
export const INSTRUMENTS: Instrument[] = ['bipe', 'sino', 'suave']
export const DEFAULT_SOUND: SoundConfig = { instrument: 'bipe', volume: 60, steps: [[0], [0], [0], [], []] }

export function normalizeSound(value: unknown): SoundConfig {
  const v = (value ?? {}) as Partial<SoundConfig>
  const instrument = INSTRUMENTS.includes(v.instrument as Instrument) ? (v.instrument as Instrument) : DEFAULT_SOUND.instrument
  const volume = Number.isFinite(v.volume) ? Math.min(100, Math.max(0, Math.round(v.volume as number))) : DEFAULT_SOUND.volume
  const steps = Array.from({ length: STEPS }, (_, i) => {
    const col = Array.isArray(v.steps?.[i]) ? v.steps[i] : []
    return [...new Set(col.filter(n => Number.isInteger(n) && n >= 0 && n < NOTES.length))].slice(0, MAX_PER_STEP)
  })
  return Array.isArray(v.steps) ? { instrument, volume, steps } : { ...DEFAULT_SOUND, instrument, volume }
}

let ctx: AudioContext | null = null
function audio() {
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function voice(ac: AudioContext, out: AudioNode, instrument: Instrument, freq: number, t: number) {
  const g = ac.createGain()
  g.connect(out)
  g.gain.setValueAtTime(0, t)
  const osc = (type: OscillatorType, f: number, end: number, target: AudioNode = g) => {
    const o = ac.createOscillator()
    o.type = type
    o.frequency.value = f
    o.connect(target)
    o.start(t)
    o.stop(end)
  }
  if (instrument === 'bipe') {
    const filter = ac.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 2400
    filter.connect(g)
    g.gain.linearRampToValueAtTime(0.45, t + 0.005)
    g.gain.setValueAtTime(0.45, t + 0.09)
    g.gain.linearRampToValueAtTime(0, t + 0.12)
    osc('square', freq, t + 0.13, filter)
  } else if (instrument === 'sino') {
    const h = ac.createGain()
    h.gain.value = 0.3
    h.connect(g)
    g.gain.linearRampToValueAtTime(0.8, t + 0.005)
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.3)
    osc('sine', freq, t + 1.3)
    osc('sine', freq * 2.01, t + 1.3, h)
  } else {
    g.gain.linearRampToValueAtTime(0.7, t + 0.04)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.55)
    osc('triangle', freq, t + 0.55)
  }
}

export function playSound(config: SoundConfig, onStep?: (step: number | null) => void) {
  const last = config.steps.reduce((acc, col, i) => (col.length ? i : acc), -1)
  if (last < 0) return 0
  try {
    const ac = audio()
    const master = ac.createGain()
    master.gain.value = (config.volume / 100) ** 2 * 0.6
    master.connect(ac.destination)
    const start = ac.currentTime + 0.05
    config.steps.slice(0, last + 1).forEach((col, i) => col.forEach(n => voice(ac, master, config.instrument, NOTES[n].freq, start + (i * STEP_MS) / 1000)))
  } catch {
    return 0
  }
  if (onStep) {
    for (let i = 0; i <= last; i++) setTimeout(() => onStep(i), 50 + i * STEP_MS)
    setTimeout(() => onStep(null), 50 + (last + 1) * STEP_MS)
  }
  return (last + 1) * STEP_MS
}
