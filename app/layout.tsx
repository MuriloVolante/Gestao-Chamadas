import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = { title: 'Central de Chamadas | Clínica Central', description: 'Sistema compartilhado de chamadas para atendimento médico.' }
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#243b64' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR" className="bg-background"><body className="antialiased">{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
