'use client'

import { useEffect, useState } from 'react'
import { Building2, Check, History, MonitorPlay, Pencil, Plus, Send, Trash2 } from 'lucide-react'
import { Logo } from '@/components/brand/logo'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LiveDot } from '@/components/ui/live-dot'
import { Select } from '@/components/ui/select'

type Department = { id: number; name: string }
type Call = { id: number; patientName: string; departmentName: string; calledAt: string }

const formatTime = (date: string) => new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(date))

export default function AtendimentoPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [calls, setCalls] = useState<Call[]>([])
  const [patientName, setPatientName] = useState('')
  const [departmentName, setDepartmentName] = useState('')
  const [newDepartment, setNewDepartment] = useState('')
  const [editing, setEditing] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [message, setMessage] = useState('')

  async function load() { const res = await fetch('/api/clinic', { cache: 'no-store' }); const data = await res.json(); setDepartments(data.departments); setCalls(data.calls); if (!departmentName && data.departments[0]) setDepartmentName(data.departments[0].name) }
  useEffect(() => { load(); const timer = setInterval(load, 4000); return () => clearInterval(timer) }, [])
  async function callPatient(e: React.FormEvent) { e.preventDefault(); if (!patientName.trim() || !departmentName) return; await fetch('/api/clinic', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patientName, departmentName }) }); setPatientName(''); setMessage('Chamada disparada para o painel.'); load(); setTimeout(() => setMessage(''), 2500) }
  async function addDepartment(e: React.FormEvent) { e.preventDefault(); if (!newDepartment.trim()) return; await fetch('/api/clinic', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newDepartment }) }); setNewDepartment(''); load() }
  async function saveDepartment(id: number) { await fetch('/api/clinic', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, name: editingName }) }); setEditing(null); load() }
  async function removeDepartment(id: number) { if (confirm('Excluir este setor?')) { await fetch(`/api/clinic?id=${id}`, { method: 'DELETE' }); load() } }

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-border bg-sidebar/94 backdrop-blur-md">
        <div className="mx-auto flex h-[66px] max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <a href="/painel" target="_blank" className={buttonVariants({ variant: 'outline' })}>
            <MonitorPlay /> <span className="hidden sm:inline">Abrir painel da TV</span>
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-7xl animate-view-in space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <div>
          <p className="section-label">Atendimento</p>
          <h1 className="mt-1.5 font-display text-2xl font-semibold sm:text-[28px]">Central de chamadas</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <CardHeader label="Nova chamada" title="Chamar paciente" description="A chamada aparece imediatamente no painel da TV." icon={<Send />} />
            <form onSubmit={callPatient} className="grid gap-4">
              <Label>
                Nome do paciente
                <Input autoFocus value={patientName} onChange={e => setPatientName(e.target.value)} placeholder="Digite o nome completo" className="h-11 text-[15px]" />
              </Label>
              <Label>
                Setor médico
                <Select value={departmentName} onChange={e => setDepartmentName(e.target.value)} className="h-11 text-[15px]">
                  <option value="">Selecione o setor</option>
                  {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </Select>
              </Label>
              <Button type="submit" size="lg" className="mt-1 w-full">
                <Send /> Disparar chamada
              </Button>
              {message && (
                <p role="status" className="flex animate-rise-in items-center justify-center gap-2 rounded-lg border border-primary/35 bg-primary/8 px-4 py-2.5 text-sm font-medium text-primary">
                  <Check /> {message}
                </p>
              )}
            </form>
          </Card>

          <Card>
            <CardHeader label="Ao vivo" title="Últimas chamadas" action={<LiveDot className="mt-1" />} />
            <ul className="grid gap-2">
              {calls.slice(0, 5).map((call, i) => (
                <li key={call.id} style={{ '--i': i } as React.CSSProperties} className="stagger flex items-center justify-between gap-3 rounded-lg bg-background px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{call.patientName}</p>
                    <p className="truncate text-[13px] text-muted-foreground">{call.departmentName}</p>
                  </div>
                  <span className="text-[12.5px] text-tertiary tabular-nums">{formatTime(call.calledAt)}</span>
                </li>
              ))}
              {!calls.length && <li className="py-8 text-center text-sm text-muted-foreground">Nenhuma chamada ainda.</li>}
            </ul>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card>
            <CardHeader label="Configuração" title="Setores médicos" description="Gerencie os destinos disponíveis" icon={<Building2 />} />
            <form onSubmit={addDepartment} className="mb-4 flex gap-2">
              <Input value={newDepartment} onChange={e => setNewDepartment(e.target.value)} placeholder="Novo setor" />
              <Button type="submit" variant="secondary" size="icon" aria-label="Adicionar setor"><Plus /></Button>
            </form>
            <ul className="grid gap-1">
              {departments.map(d => (
                <li key={d.id} className="group flex h-11 items-center gap-1 rounded-lg px-3 transition-colors duration-200 hover:bg-secondary">
                  {editing === d.id
                    ? <Input autoFocus value={editingName} onChange={e => setEditingName(e.target.value)} onKeyDown={e => e.key === 'Enter' && saveDepartment(d.id)} className="h-8 -ml-2" />
                    : <span className="flex-1 truncate text-sm font-medium">{d.name}</span>}
                  {editing === d.id
                    ? <Button variant="ghost" size="sm" onClick={() => saveDepartment(d.id)} className="text-primary hover:text-primary">Salvar</Button>
                    : <Button variant="ghost" size="icon-sm" onClick={() => { setEditing(d.id); setEditingName(d.name) }} aria-label={`Editar ${d.name}`}><Pencil /></Button>}
                  <Button variant="ghost" size="icon-sm" onClick={() => removeDepartment(d.id)} aria-label={`Excluir ${d.name}`} className="hover:bg-destructive/15 hover:text-destructive"><Trash2 /></Button>
                </li>
              ))}
              {!departments.length && <li className="py-6 text-center text-sm text-muted-foreground">Nenhum setor cadastrado.</li>}
            </ul>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader label="Registro compartilhado" title="Histórico de chamadas" description="Últimos 100 registros armazenados no Neon" icon={<History />} />
            <div className="-mx-5 max-h-80 overflow-auto sm:-mx-6">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-card text-xs text-muted-foreground">
                  <tr className="h-11 border-b border-border">
                    <th className="px-5 font-medium sm:px-6">Paciente</th>
                    <th className="px-2 font-medium">Setor</th>
                    <th className="px-5 text-right font-medium sm:px-6">Horário</th>
                  </tr>
                </thead>
                <tbody>
                  {calls.map(c => (
                    <tr key={c.id} className="border-b border-[rgb(70_70_70/.5)] transition-colors duration-200 last:border-0 hover:bg-secondary">
                      <td className="px-5 py-3 font-medium sm:px-6">{c.patientName}</td>
                      <td className="px-2 py-3 text-muted-foreground">{c.departmentName}</td>
                      <td className="px-5 py-3 text-right text-tertiary tabular-nums sm:px-6">{formatTime(c.calledAt)}</td>
                    </tr>
                  ))}
                  {!calls.length && <tr><td colSpan={3} className="py-8 text-center text-muted-foreground">Sem registros.</td></tr>}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
