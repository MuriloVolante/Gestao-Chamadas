import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter_Tight, Sora } from 'next/font/google'
import './globals.css'

const interTight = Inter_Tight({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body', display: 'swap' })
const sora = Sora({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-sora', display: 'swap' })

export const metadata: Metadata = {
  title: 'Central de Chamadas | Clínica Central',
  description: 'Sistema compartilhado de chamadas para atendimento médico.',
  icons: { icon: '/icon.svg' },
}
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#F4F4F3' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${interTight.variable} ${sora.variable}`}>
      <body>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
