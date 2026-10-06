import { mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { drizzle } from 'drizzle-orm/node-postgres'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { departments, patientCalls } from './schema'

const schema = { departments, patientCalls }
type Db = NodePgDatabase<typeof schema>

const globalForDb = globalThis as unknown as { db?: Db; ready?: Promise<unknown> }

function create(): { db: Db; ready: Promise<unknown> } {
  if (process.env.DATABASE_URL) return { db: drizzle(new Pool({ connectionString: process.env.DATABASE_URL }), { schema }), ready: Promise.resolve() }
  const { PGlite } = require('@electric-sql/pglite')
  const { drizzle: drizzleLite } = require('drizzle-orm/pglite')
  const dir = join(process.cwd(), '.data', 'pglite')
  mkdirSync(dir, { recursive: true })
  const client = new PGlite(dir)
  return { db: drizzleLite(client, { schema }), ready: client.exec(readFileSync(join(process.cwd(), 'db', 'init.sql'), 'utf8')) }
}

if (!globalForDb.db) Object.assign(globalForDb, create())
export const db = globalForDb.db!
export const ready = globalForDb.ready!
