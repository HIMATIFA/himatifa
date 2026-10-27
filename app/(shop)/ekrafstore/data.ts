import { Variants } from 'framer-motion'

export interface ProductVariant {
    name: string
    price: number
    priceLabel: string
    isPopular?: boolean
}

export interface DigitalProduct {
    category: string
    tag: 'AI Tools' | 'Streaming' | 'Creative'
    iconName: 'Bot' | 'Sparkles' | 'Film' | 'Tv' | 'Palette' | 'Scissors' | 'ImageIcon' | 'BookOpen'
    variants: ProductVariant[]
}

export interface TechService {
    id: string
    title: string
    iconName: 'MonitorSmartphone' | 'Cpu' | 'Server' | 'Wrench'
    desc: string
    stack: string[]
}

export const digitalProducts: DigitalProduct[] = [
    {
        category: 'ChatGPT',
        tag: 'AI Tools',
        iconName: 'Bot',
        variants: [
            { name: 'Private Full (1 Bln Go)', price: 52500, priceLabel: 'Rp 52.500', isPopular: true },
            { name: 'Private Full (3 Bln Go)', price: 60000, priceLabel: 'Rp 60.000' },
            { name: 'Private 24 Jam (1 Bln Plus)', price: 35500, priceLabel: 'Rp 35.500' },
            { name: 'Private 24 Jam (3 Bln Go)', price: 50000, priceLabel: 'Rp 50.000' },
        ]
    },
    {
        category: 'Gemini Plus',
        tag: 'AI Tools',
        iconName: 'Sparkles',
        variants: [
            { name: 'Bergaransi (1 Bulan)', price: 15000, priceLabel: 'Rp 15.000' },
            { name: 'Bergaransi (6 Bulan)', price: 75000, priceLabel: 'Rp 75.000', isPopular: true },
        ]
    },
    {
        category: 'Netflix Premium',
        tag: 'Streaming',
        iconName: 'Film',
        variants: [
            { name: '1 Profile 1 User (1 Hari)', price: 8000, priceLabel: 'Rp 8.000' },
            { name: '1 Profile 1 User (7 Hari)', price: 15500, priceLabel: 'Rp 15.500' },
            { name: '1 Profile 1 User (1 Bulan)', price: 30000, priceLabel: 'Rp 30.000', isPopular: true },
            { name: 'Semi Private (1 Bulan)', price: 35000, priceLabel: 'Rp 35.000' },
        ]
    },
    {
        category: 'Vidio Platinum',
        tag: 'Streaming',
        iconName: 'Tv',
        variants: [
            { name: 'Private (1 Bln Mobile)', price: 30500, priceLabel: 'Rp 30.500' },
            { name: 'Private (1 Bln All Dev)', price: 40500, priceLabel: 'Rp 40.500', isPopular: true },
            { name: 'Private TV Only (1 Thn)', price: 150000, priceLabel: 'Rp 150.000' },
        ]
    },
    {
        category: 'Canva Pro',
        tag: 'Creative',
        iconName: 'Palette',
        variants: [
            { name: 'Private & Invite (1 Bln)', price: 10000, priceLabel: 'Rp 10.000' },
            { name: 'Private & Invite (6 Bln)', price: 15000, priceLabel: 'Rp 15.000' },
            { name: 'Private & Invite (1 Thn)', price: 30000, priceLabel: 'Rp 30.000', isPopular: true },
        ]
    },
    {
        category: 'CapCut Pro',
        tag: 'Creative',
        iconName: 'Scissors',
        variants: [
            { name: 'Private (7 Hari)', price: 15500, priceLabel: 'Rp 15.500' },
            { name: 'Private (1 Bulan)', price: 35500, priceLabel: 'Rp 35.500', isPopular: true },
        ]
    },
    {
        category: 'Lightroom',
        tag: 'Creative',
        iconName: 'ImageIcon',
        variants: [
            { name: 'Sharing (1 Bulan)', price: 10000, priceLabel: 'Rp 10.000' },
            { name: 'Sharing (1 Tahun)', price: 15500, priceLabel: 'Rp 15.500', isPopular: true },
        ]
    },
    {
        category: 'Wattpad Premium+',
        tag: 'Streaming',
        iconName: 'BookOpen',
        variants: [
            { name: 'Private (1 Bulan)', price: 15500, priceLabel: 'Rp 15.500' },
            { name: 'Sharing (1 Bulan)', price: 10500, priceLabel: 'Rp 10.500' },
            { name: 'Sharing (1 Tahun)', price: 15500, priceLabel: 'Rp 15.500', isPopular: true },
        ]
    }
]

export const techServices: TechService[] = [
    {
        id: 'web-dev',
        title: 'Web & App Development',
        iconName: 'MonitorSmartphone',
        desc: 'Pengembangan platform modern yang cepat, responsif, dan scalable untuk kebutuhan bisnis, akademik, maupun startup.',
        stack: ['Next.js', 'React', 'Tailwind', 'Supabase', 'TypeScript']
    },
    {
        id: 'iot-dev',
        title: 'IoT & Embedded Systems',
        iconName: 'Cpu',
        desc: 'Rancang bangun purwarupa hardware pintar, integrasi sensor cerdas, dan sistem telemetri berbasis dashboard real-time.',
        stack: ['ESP32', 'Arduino', 'C++', 'BLE', 'Sensor']
    },
    {
        id: 'ai-ml',
        title: 'AI & Machine Learning',
        iconName: 'Server',
        desc: 'Implementasi model prediktif, analisis data tingkat lanjut, dan integrasi generative AI untuk otomasi sistem cerdas.',
        stack: ['Python', 'Gemini API', 'PyTorch', 'Vector DB']
    },
    {
        id: 'repair',
        title: 'Servis Laptop & HP',
        iconName: 'Wrench',
        desc: 'Perawatan perangkat keras, instalasi OS, pembersihan komponen, ganti pasta termal, hingga optimalisasi performa perangkat.',
        stack: ['Cleaning', 'OS Install', 'Thermal Paste', 'Troubleshooting']
    }
]

export const storeContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
}

export const storeItemVariant: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}