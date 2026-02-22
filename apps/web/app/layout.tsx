import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display, Syne, Space_Mono } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/contexts/ToastContext'
import './globals.css'

const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
})

const playfair = Playfair_Display({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
})

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  display: 'swap',
})

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Guia do Coração | Portal Místico de Autoconhecimento',
  description: 'Descubra os mistérios do universo com horóscopo personalizado, tarot e orientação espiritual baseada em IA.',
}

export const viewport: Viewport = {
  themeColor: '#0f172a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable} ${syne.variable} ${spaceMono.variable} scroll-smooth`}>
      <body className="antialiased font-body bg-midnight-900 text-magenta-50 min-h-screen">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
