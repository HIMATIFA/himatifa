import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Geist_Mono } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-jakarta',
    weight: ['400', '500', '600', '700', '800'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'HIMATIFA UMSURA — Inovasi Tanpa Batas',
    description: 'Himpunan Mahasiswa Teknik Informatika UMSURA (Universitas Muhammadiyah Surabaya).',
    generator: 'v0.app',
    icons: {
        icon: [
            {
                url: '/himatifabg.png',
                media: '(prefers-color-scheme: light)',
            },
            {
                url: '/himatifabg.png',
                media: '(prefers-color-scheme: dark)',
            },
            {
                url: '/himatifabg.png',
                type: 'image/svg+xml',
            },
        ],
        apple: '/himatifabg.png',
    },

    openGraph: {
        title: 'HIMATIFA UMSURA — Inovasi Tanpa Batas',
        description: 'Himpunan Mahasiswa Teknik Informatika UMSURA.',
        url: 'https://himatifa.vercel.app',
        siteName: 'HIMATIFA UMSURA',
        images: [
            {
                url: 'https://himatifa.vercel.app/himatifabg.png',
                width: 1200,
                height: 630,
                alt: 'Logo HIMATIFA UMSURA',
            },
        ],
        locale: 'id_ID',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'HIMATIFA UMSURA — Inovasi Tanpa Batas',
        description: 'Himpunan Mahasiswa Teknik Informatika UMSURA.',
        images: ['https://himatifa.vercel.app/himatifabg.png'],
    },
}

export const viewport: Viewport = {
    colorScheme: 'light dark',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: 'white' },
        { media: '(prefers-color-scheme: dark)', color: 'black' },
    ],
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="id" className={`${jakarta.variable} ${geistMono.variable} bg-[#f4f8fc]`}>
        <body className={`${jakarta.className} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
        </body>
        </html>
    )
}