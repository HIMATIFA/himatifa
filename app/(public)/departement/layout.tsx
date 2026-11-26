import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Struktur & Departemen',
    description:
        'Daftar lengkap departemen dan jajaran pengurus Himpunan Mahasiswa Teknik Informatika (HIMATIFA) UMSURA: PSDM, RnD, Medkominfo, Hublu, dan Ekraf.',
    alternates: {
        canonical: '/departement',
    },
    openGraph: {
        title: 'Struktur & Departemen | HIMATIFA UMSURA',
        description:
            'Struktur organisasi dan program kerja tiap departemen HIMATIFA Universitas Muhammadiyah Surabaya.',
        url: 'https://himatifa.or.id/departement',
        siteName: 'HIMATIFA UMSURA',
        images: [
            {
                url: '/himatifabg.png',
                width: 1200,
                height: 630,
                alt: 'Departemen HIMATIFA UMSURA',
            },
        ],
        locale: 'id_ID',
        type: 'website',
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Struktur & Departemen HIMATIFA UMSURA',
    description:
        'Daftar lengkap departemen dan jajaran pengurus Himpunan Mahasiswa Teknik Informatika (HIMATIFA) UMSURA.',
    url: 'https://himatifa.or.id/departement',
    isPartOf: {
        '@type': 'WebSite',
        name: 'HIMATIFA UMSURA',
        url: 'https://himatifa.or.id',
    },
}

export default function DepartementLayout({ children }: { children: React.ReactNode }) {
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
