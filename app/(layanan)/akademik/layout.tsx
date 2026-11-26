import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Layanan Akademik',
    description:
        'Pusat informasi akademik mahasiswa Teknik Informatika UMSURA: panduan KRS, Kerja Praktik (KP), Tugas Akhir / Skripsi, dan administrasi surat.',
    alternates: {
        canonical: '/akademik',
    },
    openGraph: {
        title: 'Layanan Akademik | HIMATIFA UMSURA',
        description:
            'Akses cepat panduan KRS, Kerja Praktik, Tugas Akhir, dan administrasi surat mahasiswa S1 Informatika UMSURA.',
        url: 'https://himatifa.or.id/akademik',
        siteName: 'HIMATIFA UMSURA',
        images: [
            {
                url: '/himatifabg.png',
                width: 1200,
                height: 630,
                alt: 'Layanan Akademik HIMATIFA UMSURA',
            },
        ],
        locale: 'id_ID',
        type: 'website',
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Layanan Akademik HIMATIFA UMSURA',
    description:
        'Pusat informasi akademik mahasiswa Teknik Informatika UMSURA: panduan KRS, Kerja Praktik (KP), Tugas Akhir / Skripsi, dan administrasi surat.',
    url: 'https://himatifa.or.id/akademik',
    isPartOf: {
        '@type': 'WebSite',
        name: 'HIMATIFA UMSURA',
        url: 'https://himatifa.or.id',
    },
}

export default function AkademikLayout({ children }: { children: React.ReactNode }) {
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
