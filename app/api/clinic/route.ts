import { NextResponse } from 'next/server'
import { and, asc, desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { departments, patientCalls } from '@/lib/schema'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [departmentRows, callRows] = await Promise.all([
    db.select().from(departments).orderBy(asc(departments.name)),
    db.select().from(patientCalls).orderBy(desc(patientCalls.calledAt)).limit(100),
  ])
  return NextResponse.json({ departments: departmentRows, calls: callRows })
}

export async function POST(request: Request) {
  const body = await request.json()
  const patientName = String(body.patientName ?? '').trim()
  const departmentName = String(body.departmentName ?? '').trim()
  if (!patientName || !departmentName) return NextResponse.json({ error: 'Preencha o nome e o setor.' }, { status: 400 })
  const [call] = await db.insert(patientCalls).values({ patientName, departmentName, calledAt: new Date() }).returning()
  await db.delete(patientCalls).where(eq(patientCalls.id, call.id - 100))
  return NextResponse.json(call, { status: 201 })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const id = Number(body.id)
  const name = String(body.name ?? '').trim()
  if (!id || !name) return NextResponse.json({ error: 'Setor inválido.' }, { status: 400 })
  const [department] = await db.update(departments).set({ name }).where(eq(departments.id, id)).returning()
  return NextResponse.json(department)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const name = String(body.name ?? '').trim()
  if (!name) return NextResponse.json({ error: 'Informe o nome do setor.' }, { status: 400 })
  const [department] = await db.insert(departments).values({ name, createdAt: new Date() }).returning()
  return NextResponse.json(department, { status: 201 })
}

export async function DELETE(request: Request) {
  const id = Number(new URL(request.url).searchParams.get('id'))
  if (!id) return NextResponse.json({ error: 'Setor inválido.' }, { status: 400 })
  await db.delete(departments).where(eq(departments.id, id))
  return NextResponse.json({ ok: true })
}
