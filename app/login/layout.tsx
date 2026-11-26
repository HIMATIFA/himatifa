import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Login Internal SIM',
    description: 'Portal login internal pengurus HIMATIFA UMSURA.',
    robots: {
        index: false,
        follow: false,
    },
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
