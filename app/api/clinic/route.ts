import { NextResponse } from 'next/server'
import { and, asc, desc, eq } from 'drizzle-orm'
import { db, ready } from '@/lib/db'
import { callSound, departments, patientCalls } from '@/lib/schema'
import { normalizeSound } from '@/lib/sound'

const COOLDOWN_MS = 5000
const cooldownLeft = (last?: { calledAt: Date }) => (last ? Math.max(0, COOLDOWN_MS - (Date.now() - new Date(last.calledAt).getTime())) : 0)

export const dynamic = 'force-dynamic'

export async function GET() {
  await ready
  const [departmentRows, callRows, [sound]] = await Promise.all([
    db.select().from(departments).orderBy(asc(departments.name)),
    db.select().from(patientCalls).orderBy(desc(patientCalls.calledAt)).limit(100),
    db.select().from(callSound).where(eq(callSound.id, 1)),
  ])
  return NextResponse.json({ departments: departmentRows, calls: callRows, sound: normalizeSound(sound?.config), cooldownMs: cooldownLeft(callRows[0]) })
}

export async function POST(request: Request) {
  await ready
  const body = await request.json()
  const patientName = String(body.patientName ?? '').trim()
  const departmentName = String(body.departmentName ?? '').trim()
  if (!patientName || !departmentName) return NextResponse.json({ error: 'Preencha o nome e o setor.' }, { status: 400 })
  const [last] = await db.select().from(patientCalls).orderBy(desc(patientCalls.calledAt)).limit(1)
  const wait = cooldownLeft(last)
  if (wait) return NextResponse.json({ error: 'Aguarde para chamar o próximo.', cooldownMs: wait }, { status: 429 })
  const [call] = await db.insert(patientCalls).values({ patientName, departmentName, calledAt: new Date() }).returning()
  await db.delete(patientCalls).where(eq(patientCalls.id, call.id - 100))
  return NextResponse.json(call, { status: 201 })
}

export async function PATCH(request: Request) {
  await ready
  const body = await request.json()
  const id = Number(body.id)
  const name = String(body.name ?? '').trim()
  if (!id || !name) return NextResponse.json({ error: 'Setor inválido.' }, { status: 400 })
  const [department] = await db.update(departments).set({ name }).where(eq(departments.id, id)).returning()
  return NextResponse.json(department)
}

export async function PUT(request: Request) {
  await ready
  const body = await request.json()
  const name = String(body.name ?? '').trim()
  if (!name) return NextResponse.json({ error: 'Informe o nome do setor.' }, { status: 400 })
  const [department] = await db.insert(departments).values({ name, createdAt: new Date() }).returning()
  return NextResponse.json(department, { status: 201 })
}

export async function DELETE(request: Request) {
  await ready
  const id = Number(new URL(request.url).searchParams.get('id'))
  if (!id) return NextResponse.json({ error: 'Setor inválido.' }, { status: 400 })
  await db.delete(departments).where(eq(departments.id, id))
  return NextResponse.json({ ok: true })
}
