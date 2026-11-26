import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Detail Pembayaran Pesanan — Ekraf Store',
    robots: {
        index: false,
        follow: false,
    },
}

export default function OrderDetailLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
