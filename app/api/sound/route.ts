import { NextResponse } from 'next/server'
import { eq } from 'drizzle-orm'
import { db, ready } from '@/lib/db'
import { callSound } from '@/lib/schema'
import { normalizeSound } from '@/lib/sound'

export const dynamic = 'force-dynamic'

export async function GET() {
  await ready
  const [row] = await db.select().from(callSound).where(eq(callSound.id, 1))
  return NextResponse.json(normalizeSound(row?.config))
}

export async function PUT(request: Request) {
  await ready
  const config = normalizeSound(await request.json())
  await db.insert(callSound).values({ id: 1, config, updatedAt: new Date() }).onConflictDoUpdate({ target: callSound.id, set: { config, updatedAt: new Date() } })
  return NextResponse.json(config)
}
