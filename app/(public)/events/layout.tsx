import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Agenda Kegiatan',
    description:
        'Jadwal agenda kegiatan, seminar teknologi, workshop, bootcamp, dan program kerja resmi HIMATIFA Universitas Muhammadiyah Surabaya.',
    alternates: {
        canonical: '/events',
    },
    openGraph: {
        title: 'Agenda Kegiatan | HIMATIFA UMSURA',
        description:
            'Kalender kegiatan, seminar, dan program kerja resmi Himpunan Mahasiswa Teknik Informatika UMSURA.',
        url: 'https://himatifa.or.id/events',
        siteName: 'HIMATIFA UMSURA',
        images: [
            {
                url: '/himatifabg.png',
                width: 1200,
                height: 630,
                alt: 'Agenda Kegiatan HIMATIFA UMSURA',
            },
        ],
        locale: 'id_ID',
        type: 'website',
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Agenda Kegiatan HIMATIFA UMSURA',
    description:
        'Jadwal agenda kegiatan, seminar teknologi, workshop, bootcamp, dan program kerja resmi HIMATIFA UMSURA.',
    url: 'https://himatifa.or.id/events',
    isPartOf: {
        '@type': 'WebSite',
        name: 'HIMATIFA UMSURA',
        url: 'https://himatifa.or.id',
    },
}

export default function EventsLayout({ children }: { children: React.ReactNode }) {
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
