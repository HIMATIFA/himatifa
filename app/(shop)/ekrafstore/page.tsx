import type { Metadata } from 'next'
import EkrafStoreClient from './EkrafStoreClient'

export const metadata: Metadata = {
    title: 'Ekraf Store — Lisensi Digital & Merchandise Resmi',
    description:
        'Toko resmi Departemen Ekonomi Kreatif HIMATIFA UMSURA. Menyediakan lisensi digital terjangkau, merchandise resmi PDH/Lanyard, dan layanan IT.',
    alternates: {
        canonical: '/ekrafstore',
    },
    openGraph: {
        title: 'Ekraf Store — Lisensi Digital & Merchandise Resmi | HIMATIFA UMSURA',
        description:
            'Akses akun premium, software kreatif, merchandise resmi HIMATIFA, serta jasa IT & servis laptop.',
        url: 'https://himatifa.or.id/ekrafstore',
        siteName: 'HIMATIFA UMSURA',
        images: [
            {
                url: '/himatifabg.png',
                width: 1200,
                height: 630,
                alt: 'Ekraf Store HIMATIFA UMSURA',
            },
        ],
        locale: 'id_ID',
        type: 'website',
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Ekraf Store HIMATIFA UMSURA',
    description:
        'Toko resmi Departemen Ekonomi Kreatif HIMATIFA UMSURA yang menyediakan lisensi digital, merchandise resmi, dan layanan teknologi.',
    url: 'https://himatifa.or.id/ekrafstore',
    parentOrganization: {
        '@type': 'Organization',
        name: 'HIMATIFA UMSURA',
        url: 'https://himatifa.or.id',
    },
}

export default function EkrafStorePage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <EkrafStoreClient />
        </>
    )
}
