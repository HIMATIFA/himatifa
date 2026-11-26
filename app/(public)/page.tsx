import type { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
    title: {
        absolute: 'HIMATIFA UMSURA — Website Resmi Himpunan Mahasiswa Informatika',
    },
    description:
        'Website resmi Himpunan Mahasiswa Teknik Informatika (HIMATIFA) Universitas Muhammadiyah Surabaya. Informasi profil, departemen, agenda kegiatan, berita, dan layanan mahasiswa.',
    alternates: {
        canonical: '/',
    },
    openGraph: {
        title: 'HIMATIFA UMSURA — Website Resmi Himpunan Mahasiswa Informatika',
        description:
            'Wadah kolaborasi mahasiswa Informatika Universitas Muhammadiyah Surabaya untuk mengasah kompetensi teknis dan berdaya saing global.',
        url: 'https://himatifa.or.id',
        siteName: 'HIMATIFA UMSURA',
        images: [
            {
                url: '/himatifabg.png',
                width: 1200,
                height: 630,
                alt: 'HIMATIFA UMSURA',
            },
        ],
        locale: 'id_ID',
        type: 'website',
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'Organization',
            name: 'HIMATIFA UMSURA',
            alternateName: 'Himpunan Mahasiswa Teknik Informatika Universitas Muhammadiyah Surabaya',
            url: 'https://himatifa.or.id',
            logo: 'https://himatifa.or.id/himatifabg.png',
            address: {
                '@type': 'PostalAddress',
                streetAddress: 'Jl. Sutorejo No. 59, Gedung G Lt. 3',
                addressLocality: 'Surabaya',
                addressRegion: 'Jawa Timur',
                postalCode: '60113',
                addressCountry: 'ID',
            },
        },
        {
            '@type': 'WebSite',
            name: 'HIMATIFA UMSURA',
            url: 'https://himatifa.or.id',
        },
    ],
}

export default function HomePage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <HomeClient />
        </>
    )
}
