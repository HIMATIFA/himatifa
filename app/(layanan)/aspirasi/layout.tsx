import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Suara Mahasiswa & Aspirasi',
    description:
        'Kanal resmi aspirasi, kritik konstruktif, dan masukan mahasiswa Teknik Informatika UMSURA untuk layanan akademik dan fasilitas kampus.',
    alternates: {
        canonical: '/aspirasi',
    },
    openGraph: {
        title: 'Suara Mahasiswa & Aspirasi | HIMATIFA UMSURA',
        description:
            'Sampaikan aspirasi, saran, dan masukan mahasiswa Teknik Informatika UMSURA secara terbuka maupun anonim.',
        url: 'https://himatifa.or.id/aspirasi',
        siteName: 'HIMATIFA UMSURA',
        images: [
            {
                url: '/himatifabg.png',
                width: 1200,
                height: 630,
                alt: 'Suara Mahasiswa HIMATIFA UMSURA',
            },
        ],
        locale: 'id_ID',
        type: 'website',
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Suara Mahasiswa & Aspirasi HIMATIFA UMSURA',
    description:
        'Kanal resmi aspirasi, kritik konstruktif, dan masukan mahasiswa Teknik Informatika UMSURA.',
    url: 'https://himatifa.or.id/aspirasi',
    isPartOf: {
        '@type': 'WebSite',
        name: 'HIMATIFA UMSURA',
        url: 'https://himatifa.or.id',
    },
}

export default function AspirasiLayout({ children }: { children: React.ReactNode }) {
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
