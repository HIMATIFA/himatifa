import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://himatifa.or.id'
    const lastModified = new Date()

    const publicRoutes: Array<{
        path: string
        changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
        priority: number
    }> = [
        { path: '', changeFrequency: 'weekly', priority: 1.0 },
        { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
        { path: '/departement', changeFrequency: 'monthly', priority: 0.8 },
        { path: '/events', changeFrequency: 'weekly', priority: 0.9 },
        { path: '/news', changeFrequency: 'weekly', priority: 0.9 },
        { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
        { path: '/akademik', changeFrequency: 'monthly', priority: 0.8 },
        { path: '/aspirasi', changeFrequency: 'monthly', priority: 0.7 },
        { path: '/showcase', changeFrequency: 'weekly', priority: 0.8 },
        { path: '/ekrafstore', changeFrequency: 'weekly', priority: 0.8 },
    ]

    return publicRoutes.map((route) => ({
        url: `${baseUrl}${route.path}`,
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }))
}
