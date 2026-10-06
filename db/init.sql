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

INSERT INTO medical_departments (name) VALUES ('Cardiologia'), ('Enfermagem'), ('Fisioterapia')
ON CONFLICT (name) DO NOTHING;
