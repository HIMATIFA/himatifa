import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Showcase Karya Mahasiswa',
    description:
        'Galeri inovasi teknologi, aplikasi web, mobile, AI, dan IoT karya mahasiswa Program Studi Teknik Informatika Universitas Muhammadiyah Surabaya.',
    alternates: {
        canonical: '/showcase',
    },
    openGraph: {
        title: 'Showcase Karya Mahasiswa | HIMATIFA UMSURA',
        description:
            'Eksplorasi portofolio aplikasi, solusi IoT, dan karya inovatif mahasiswa Teknik Informatika UMSURA.',
        url: 'https://himatifa.or.id/showcase',
        siteName: 'HIMATIFA UMSURA',
        images: [
            {
                url: '/himatifabg.png',
                width: 1200,
                height: 630,
                alt: 'Showcase Karya Mahasiswa HIMATIFA UMSURA',
            },
        ],
        locale: 'id_ID',
        type: 'website',
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Showcase Karya Mahasiswa HIMATIFA UMSURA',
    description:
        'Galeri inovasi teknologi, aplikasi web, mobile, AI, dan IoT karya mahasiswa Program Studi Teknik Informatika UMSURA.',
    url: 'https://himatifa.or.id/showcase',
    isPartOf: {
        '@type': 'WebSite',
        name: 'HIMATIFA UMSURA',
        url: 'https://himatifa.or.id',
    },
}

export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
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
