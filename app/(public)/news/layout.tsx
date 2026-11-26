import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Berita & Artikel',
    description:
        'Kumpulan berita terbaru, artikel teknologi, liputan kegiatan, dan prestasi mahasiswa Teknik Informatika Universitas Muhammadiyah Surabaya.',
    alternates: {
        canonical: '/news',
    },
    openGraph: {
        title: 'Berita & Artikel | HIMATIFA UMSURA',
        description:
            'Berita terbaru, liputan kegiatan, dan informasi prestasi mahasiswa Teknik Informatika UMSURA.',
        url: 'https://himatifa.or.id/news',
        siteName: 'HIMATIFA UMSURA',
        images: [
            {
                url: '/himatifabg.png',
                width: 1200,
                height: 630,
                alt: 'Berita HIMATIFA UMSURA',
            },
        ],
        locale: 'id_ID',
        type: 'website',
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Berita & Artikel HIMATIFA UMSURA',
    description:
        'Kumpulan berita terbaru, artikel teknologi, liputan kegiatan, dan prestasi mahasiswa Teknik Informatika UMSURA.',
    url: 'https://himatifa.or.id/news',
    isPartOf: {
        '@type': 'WebSite',
        name: 'HIMATIFA UMSURA',
        url: 'https://himatifa.or.id',
    },
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    )
}
