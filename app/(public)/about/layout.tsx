import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Profil & Sejarah',
    description:
        'Mengenal lebih dekat profil, visi, misi, filosofi logo, dan sejarah Himpunan Mahasiswa Teknik Informatika (HIMATIFA) Universitas Muhammadiyah Surabaya.',
    alternates: {
        canonical: '/about',
    },
    openGraph: {
        title: 'Profil & Sejarah | HIMATIFA UMSURA',
        description:
            'Profil, visi, misi, dan sejarah Himpunan Mahasiswa Teknik Informatika Universitas Muhammadiyah Surabaya.',
        url: 'https://himatifa.or.id/about',
        siteName: 'HIMATIFA UMSURA',
        images: [
            {
                url: '/himatifabg.png',
                width: 1200,
                height: 630,
                alt: 'Profil HIMATIFA UMSURA',
            },
        ],
        locale: 'id_ID',
        type: 'website',
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Profil & Sejarah HIMATIFA UMSURA',
    description:
        'Profil, visi, misi, filosofi logo, dan sejarah Himpunan Mahasiswa Teknik Informatika (HIMATIFA) Universitas Muhammadiyah Surabaya.',
    url: 'https://himatifa.or.id/about',
    isPartOf: {
        '@type': 'WebSite',
        name: 'HIMATIFA UMSURA',
        url: 'https://himatifa.or.id',
    },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
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
