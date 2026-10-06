import { mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { drizzle } from 'drizzle-orm/node-postgres'
import type { NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { initSql } from './init-sql'
import { callSound, departments, patientCalls } from './schema'

const schema = { departments, patientCalls, callSound }
type Db = NodePgDatabase<typeof schema>

const globalForDb = globalThis as unknown as { db?: Db; ready?: Promise<unknown> }

function create(): { db: Db; ready: Promise<unknown> } {
  if (process.env.DATABASE_URL) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    return { db: drizzle(pool, { schema }), ready: pool.query(initSql) }
  }
  const { PGlite } = require('@electric-sql/pglite')
  const { drizzle: drizzleLite } = require('drizzle-orm/pglite')
  const dir = join(process.cwd(), '.data', 'pglite')
  mkdirSync(dir, { recursive: true })
  const client = new PGlite(dir)
  return { db: drizzleLite(client, { schema }), ready: client.exec(initSql) }
}

if (!globalForDb.db) Object.assign(globalForDb, create())
export const db = globalForDb.db!
export const ready = globalForDb.ready!
