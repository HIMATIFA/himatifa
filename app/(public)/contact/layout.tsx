import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Kontak & Sekretariat',
    description:
        'Hubungi pengurus HIMATIFA Universitas Muhammadiyah Surabaya untuk kerja sama, kemitraan, delegasi, atau informasi seputar program studi Teknik Informatika.',
    alternates: {
        canonical: '/contact',
    },
    openGraph: {
        title: 'Kontak & Sekretariat | HIMATIFA UMSURA',
        description:
            'Informasi kontak resmi, media sosial, dan alamat sekretariat HIMATIFA Universitas Muhammadiyah Surabaya.',
        url: 'https://himatifa.or.id/contact',
        siteName: 'HIMATIFA UMSURA',
        images: [
            {
                url: '/himatifabg.png',
                width: 1200,
                height: 630,
                alt: 'Kontak HIMATIFA UMSURA',
            },
        ],
        locale: 'id_ID',
        type: 'website',
    },
}

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Kontak & Sekretariat HIMATIFA UMSURA',
    description:
        'Informasi kontak resmi, media sosial, dan alamat sekretariat HIMATIFA Universitas Muhammadiyah Surabaya.',
    url: 'https://himatifa.or.id/contact',
    isPartOf: {
        '@type': 'WebSite',
        name: 'HIMATIFA UMSURA',
        url: 'https://himatifa.or.id',
    },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
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
