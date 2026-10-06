export const initSql = `
CREATE TABLE IF NOT EXISTS medical_departments (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS patient_calls (
  id SERIAL PRIMARY KEY,
  patient_name TEXT NOT NULL,
  department_name TEXT NOT NULL,
  called_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO medical_departments (name, created_at)
SELECT unnest(ARRAY['Cardiologia', 'Enfermagem', 'Fisioterapia']), now()
WHERE NOT EXISTS (SELECT 1 FROM medical_departments);

CREATE TABLE IF NOT EXISTS call_sound (
  id INTEGER PRIMARY KEY,
  config JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
`
