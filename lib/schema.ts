import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

export const departments = pgTable('medical_departments', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
})

export const patientCalls = pgTable('patient_calls', {
  id: serial('id').primaryKey(),
  patientName: text('patient_name').notNull(),
  departmentName: text('department_name').notNull(),
  calledAt: timestamp('called_at', { withTimezone: true }).notNull(),
})

export type Department = typeof departments.$inferSelect
export type PatientCall = typeof patientCalls.$inferSelect
