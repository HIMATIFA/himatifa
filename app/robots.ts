import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin/',
                '/adminekraf/',
                '/bendum/',
                '/sekum/',
                '/login',
                '/ekrafstore/cart',
                '/ekrafstore/checkout',
                '/ekrafstore/orders/',
            ],
        },
        sitemap: 'https://himatifa.or.id/sitemap.xml',
    }
}
