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
// ... existing metadata
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
