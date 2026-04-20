import type { Metadata } from 'next'
import { Outfit, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import CustomCursor from '@/components/CustomCursor'
import './globals.css'

const outfit = Outfit({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-outfit',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://sharfanusrath.site'),
  title: 'Developer Portfolio | Full Stack Developer',
  description: 'Explore my portfolio showcasing projects, skills, and experience. B.Tech graduate from CMR College of Engineering.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`scroll-smooth ${playfair.variable} ${outfit.variable}`}>
      <body className={`${outfit.className} min-h-screen bg-[#f5f3ee] text-[#282828] selection:bg-[#ed6094]/30 selection:text-white transition-colors duration-300`}>
        <CustomCursor />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
