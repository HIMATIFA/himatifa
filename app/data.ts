import { Variants } from 'framer-motion'
import { FaInstagram, FaGithub, FaYoutube } from 'react-icons/fa6'

export type DepartmentKey = 'PSDM' | 'Deplu' | 'Kepsos' | 'Ekraf' | 'Medkominfo'

export interface DepartmentDetail {
    label: string
    desc: string
    programs: string[]
}

export interface AgendaItem {
    id: number
    title: string
    desc: string
    division: string
    date: string
    month: string
    time: string
    location: string
    place?: string
    status: 'Akan Datang' | 'Selesai' | 'Berlangsung' | 'Draft'
    type: 'Event' | 'Rapat' | 'Workshop'
}

export interface NewsItem {
    id: number
    title: string
    date: string
    category: string
    summary: string
    link?: string
    image?: string
    slug: string
    author: string
    status: 'Published' | 'Draft' | 'Archived'
    views: string
}

export interface PengurusItem {
    id: number
    name: string
    nim: string
    role: string
    division: string
    period: string
    status: 'Aktif' | 'Demisioner' | 'Cuti'
    image?: string
    img?: boolean
}

export interface CategoryItem {
    id: number
    name: string
    slug: string
    type: 'Berita' | 'Agenda' | 'Umum'
    itemCount: number
    description: string
    color: string
}

export interface MediaItem {
    id: number
    name: string
    type: 'Gambar' | 'Dokumen' | 'Video'
    size: string
    date: string
    url?: string
}

export interface DashboardStat {
    title: string
    value: string
    trend: string
    isPositive: boolean
    subtext: string
}

export interface ActivityItem {
    id: number
    user: string
    role: string
    action: string
    target: string
    time: string
    avatar: string
}

export interface DiscussionItem {
    id: number
    author: string
    targetTitle: string
    content: string
    time: string
}

export const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Profil', path: '/about' },
    { name: 'Berita', path: '/news' },
    { name: 'Agenda', path: '/events' },
    { name: 'Kontak', path: '/contact' },
]

export const departments: Record<DepartmentKey, DepartmentDetail> = {
    PSDM: {
        label: 'Pengembangan Sumber Daya Mahasiswa',
        desc: 'Membangun ekosistem belajar yang inklusif melalui pengembangan kapasitas, kompetensi, dan karakter mahasiswa Informatika.',
        programs: ['Study Club', 'Mentoring Akademik', 'Upgrading']
    },
    Deplu: {
        label: 'Luar Negeri',
        desc: 'Membuka jejaring kolaborasi strategis antara HIMATIFA, organisasi mahasiswa, dan mitra profesional di luar kampus.',
        programs: ['Company Visit', 'Collaboration', 'Networking']
    },
    Kepsos: {
        label: 'Kepedulian Sosial',
        desc: 'Menghadirkan dampak positif melalui aksi sosial dan kepedulian yang berkelanjutan bagi civitas dan masyarakat.',
        programs: ['HIMATIFA Care', 'Donasi Digital', 'Volunteer']
    },
    Ekraf: {
        label: 'Ekonomi Kreatif',
        desc: 'Mengembangkan potensi wirausaha mahasiswa melalui produk kreatif, strategi bisnis, dan ruang apresiasi karya.',
        programs: ['Ekraf Store', 'Creative Class', 'Market Day']
    },
    Medkominfo: {
        label: 'Media, Komunikasi, dan Informasi',
        desc: 'Menghidupkan cerita dan identitas HIMATIFA lewat komunikasi visual yang relevan, jujur, dan berdampak.',
        programs: ['Content Lab', 'HIMATIFA TV', 'Design Sprint']
    },
}

export const people = [
    { role: 'Ketua Himpunan', name: 'Vichras Mazcheranou Hafizh', image: '/bpi/vice.png' },
    { role: 'Wakil Ketua', name: 'Andy Bagus Oesmady', image: '/bpi/andi.png' },
    { role: 'Sekretaris', name: 'Aura Rizky Inayah Fadhilah', image: '/bpi/aura.png' },
    { role: 'Bendahara', name: 'Maulidya Dliyaun Najah', image: '/bpi/mau.png' },
]

export const misi = [
    {
        title: 'Kolaborasi Lintas Minat',
        desc: 'Menghubungkan mahasiswa lintas bidang untuk proyek, riset, dan eksplorasi teknologi bersama.',
        tag: 'Sinergi & Komunitas'
    },
    {
        title: 'Kompetensi Relevan Industri',
        desc: 'Bootcamp, study club terarah, dan mentoring profesional yang adaptif terhadap tren teknologi terkini.',
        tag: 'Technical Mastery'
    },
    {
        title: 'Dampak Nyata & Berkelanjutan',
        desc: 'Program kerja inovatif dan aksi sosial yang memberi kontribusi konkret bagi civitas dan masyarakat.',
        tag: 'Sosial & Kontribusi'
    },
]

export const stats = [
    { val: 2020, label: 'Tahun Berdiri', suffix: '', isYear: true, subtext: 'Dedikasi membangun talenta' },
    { val: 5, label: 'Departemen', suffix: '', subtext: 'Fokus pilar pergerakan' },
    { val: 15, label: 'Program Kerja', suffix: '+', subtext: 'Aktif berkelanjutan' },
    { val: 500, label: 'Mahasiswa Aktif', suffix: '+', subtext: 'Komunitas solid & suportif' },
]

export const socials = [
    { label: 'Instagram', href: 'https://instagram.com/himatifa_umsurabaya', icon: FaInstagram },
    { label: 'GitHub', href: 'https://github.com/himatifa', icon: FaGithub },
    { label: 'YouTube', href: 'https://youtube.com/@himatifa', icon: FaYoutube },
]

export const faqData = [
    {
        id: 1,
        question: "Apa itu HIMATIFA UMSURA?",
        answer: "HIMATIFA (Himpunan Mahasiswa Teknik Informatika) UMSURA adalah organisasi mahasiswa yang berfokus pada pengembangan potensi akademik, non-akademik, serta penampung aspirasi seluruh mahasiswa Teknik Informatika Universitas Muhammadiyah Surabaya.",
        hasLink: false
    },
    {
        id: 2,
        question: "Bagaimana cara bergabung menjadi pengurus HIMATIFA?",
        answer: "Pendaftaran pengurus (Open Recruitment) biasanya dibuka pada awal periode kepengurusan baru. Informasi pendaftaran, persyaratan, dan alur seleksi akan diumumkan secara resmi melalui website ini dan akun Instagram HIMATIFA.",
        hasLink: false
    },
    {
        id: 3,
        question: "Apakah mahasiswa non-pengurus bisa mengikuti kegiatan HIMATIFA?",
        answer: "Tentu saja! Sebagian besar kegiatan seperti workshop, seminar teknologi, kompetisi, dan program pengabdian masyarakat terbuka untuk seluruh mahasiswa Teknik Informatika maupun umum.",
        hasLink: false
    },
    {
        id: 4,
        question: "Bagaimana cara menyalurkan keluhan atau saran terkait akademik/fasilitas?",
        answer: "Kamu bisa menyampaikannya secara langsung melalui menu 'Aspirasi' di website ini. Kamu juga dapat memilih untuk mengirimkannya secara anonim demi kenyamanan dan kerahasiaan identitas.",
        hasLink: true
    },
    {
        id: 5,
        question: "Di mana saya bisa melihat jadwal kegiatan dan berita terbaru?",
        answer: "Seluruh update kegiatan, agenda mendatang, dan berita resmi dapat kamu akses secara berkala melalui bagian 'Kabar Terbaru' di beranda atau halaman 'News'.",
        hasLink: false
    }
]

export const agenda: AgendaItem[] = [
    {
        id: 1,
        title: 'OSCAR (Orientasi Studi & Cinta Almamater) 2026',
        desc: 'Opening Student Collaboration & Achievement Recognition',
        division: 'Divisi Event',
        date: '21 Sep 2026',
        month: 'SEP',
        time: '08:00 - Selesai',
        location: 'Auditorium UMSURA',
        place: 'Auditorium UMSURA',
        status: 'Akan Datang',
        type: 'Event'
    },
    {
        id: 2,
        title: 'Study Club GitHub & Workflow',
        desc: 'Level up your workflow, one commit at a time.',
        division: 'Divisi Keilmuan',
        date: '04 Okt 2026',
        month: 'OKT',
        time: '13:00 - 15:30',
        location: 'Lab Informatika 2',
        place: 'Lab Informatika 2',
        status: 'Akan Datang',
        type: 'Workshop'
    },
    {
        id: 3,
        title: 'HIMATIFA Care (Pengabdian Masyarakat)',
        desc: 'Berbagi langkah kecil, memberi dampak yang besar.',
        division: 'Kepedulian Sosial',
        date: '18 Okt 2026',
        month: 'OKT',
        time: '07:00 - Selesai',
        location: 'Kampung Nelayan Kenjeran',
        place: 'Kampung Nelayan Kenjeran',
        status: 'Akan Datang',
        type: 'Event'
    },
    {
        id: 4,
        title: 'Rapat Evaluasi BPH Bulanan',
        desc: 'Evaluasi program kerja dan koordinasi pengurus harian.',
        division: 'Sekretaris Umum',
        date: '08 Okt 2026',
        month: 'OKT',
        time: '19:00 - 21:00',
        location: 'Google Meet',
        place: 'Google Meet',
        status: 'Selesai',
        type: 'Rapat'
    },
    {
        id: 5,
        title: 'Makrab Mahasiswa Baru Informatika',
        desc: 'Malam keakraban untuk mempererat solidaritas angkatan.',
        division: 'Divisi Humas',
        date: '25 Nov 2026',
        month: 'NOV',
        time: 'TBA',
        location: 'Villa Trawas, Mojokerto',
        place: 'Villa Trawas, Mojokerto',
        status: 'Draft',
        type: 'Event'
    }
]

export const newsData: NewsItem[] = [
    {
        id: 1,
        title: "Orientasi Studi & Cinta Almamater (OSCAR) 2026",
        date: "19 Sep 2026",
        category: "Organisasi",
        summary: "Fakultas Teknik menyelenggarakan kegiatan OSCAR 2026 sebagai pengenalan lingkungan kampus.",
        link: "https://www.kompasiana.com/himatifaumsurabaya/6ab2271434777c6eb9130687/orientasi-studi-cinta-almamater-oscar-2026",
        image: "https://assets-a2.kompasiana.com/items/album/2026/09/22/whatsapp-image-2026-09-22-at-13-48-58-6ab225e034777c689b74ed35.jpeg",
        slug: "orientasi-studi-cinta-almamater-oscar-2026",
        author: "Divisi Kominfo",
        status: "Published",
        views: "1.2k"
    },
    {
        id: 2,
        title: "Sokong Visi Literasi Digital, S1 Informatika UMSURA Gelar AI Ambassador Workshop",
        date: "13 Jul 2026",
        category: "Kegiatan",
        summary: "Mahasiswa S1 Informatika UMSURA sukses menggelar AI Ambassador Workshop di SpInS Interactional School.",
        link: "https://www.kompasiana.com/himatifaumsurabaya/6a577a9cc925c442882752e2/sokong-visi-literasi-digital-s1-informatika-umsura-gelar-ai-ambasador-workshop-di-spins-interactional-school",
        image: "https://assets-a2.kompasiana.com/items/album/2026/07/15/whatsapp-image-2026-07-14-at-19-54-41-6a577a32ed64157f6144eea2.jpeg",
        slug: "ai-ambassador-workshop-spins",
        author: "Divisi Keilmuan",
        status: "Published",
        views: "2.8k"
    },
    {
        id: 3,
        title: "Pendelegasian Kontingen KMHE 2026 Siap Berangkat",
        date: "22 Sep 2026",
        category: "Prestasi",
        summary: "Tim Kompetisi Mobil Hemat Energi siap mengharumkan nama almamater.",
        slug: "kmhe-2026-pendelegasian",
        author: "Arya Putra",
        status: "Draft",
        views: "-"
    },
    {
        id: 4,
        title: "Open Recruitment Pengurus Baru Periode 2027",
        date: "18 Sep 2026",
        category: "Info Kampus",
        summary: "Pendaftaran pengurus dibuka secara resmi bagi mahasiswa aktif Informatika.",
        slug: "oprec-pengurus-2027",
        author: "Sekretaris Umum",
        status: "Archived",
        views: "3.4k"
    }
]

export const bphMembers: PengurusItem[] = [
    {
        id: 1,
        name: 'Vichras Mazcheranou Hafizh',
        nim: '20230140001',
        role: 'Ketua Himpunan',
        division: 'BPH Inti',
        period: '2026/2027',
        status: 'Aktif',
        image: '/bpi/vice.png',
        img: true
    },
    {
        id: 2,
        name: 'Andy Bagus Oesmady',
        nim: '20230140002',
        role: 'Wakil Ketua',
        division: 'BPH Inti',
        period: '2026/2027',
        status: 'Aktif',
        image: '/bpi/andi.png',
        img: true
    },
    {
        id: 3,
        name: 'Aura Rizky Inayah Fadhilah',
        nim: '20230140024',
        role: 'Sekretaris Umum',
        division: 'BPH Inti',
        period: '2026/2027',
        status: 'Aktif',
        image: '/bpi/aura.png',
        img: true
    },
    {
        id: 4,
        name: 'Maulidya Dliyaun Najah',
        nim: '20230140025',
        role: 'Bendahara Umum',
        division: 'BPH Inti',
        period: '2026/2027',
        status: 'Aktif',
        image: '/bpi/mau.png',
        img: true
    },
    {
        id: 5,
        name: 'Budi Santoso',
        nim: '20220140105',
        role: 'Kepala Divisi',
        division: 'Divisi Keilmuan',
        period: '2025/2026',
        status: 'Demisioner',
        img: false
    },
    {
        id: 6,
        name: 'Siti Rahma',
        nim: '20240140056',
        role: 'Staff',
        division: 'Divisi Kominfo',
        period: '2026/2027',
        status: 'Aktif',
        img: false
    },
    {
        id: 7,
        name: 'Ahmad Fauzi',
        nim: '20230140088',
        role: 'Staff',
        division: 'Divisi Event',
        period: '2026/2027',
        status: 'Cuti',
        img: false
    }
]

export const categoriesData: CategoryItem[] = [
    {
        id: 1,
        name: 'Event & Acara',
        slug: 'event-acara',
        type: 'Agenda',
        itemCount: 18,
        description: 'Kegiatan seminar, workshop, dan kompetisi himpunan.',
        color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
        id: 2,
        name: 'Prestasi',
        slug: 'prestasi',
        type: 'Berita',
        itemCount: 12,
        description: 'Pencapaian dan kejuaraan mahasiswa Informatika.',
        color: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
        id: 3,
        name: 'Info Kampus',
        slug: 'info-kampus',
        type: 'Umum',
        itemCount: 25,
        description: 'Pengumuman resmi akademik dan fakultas.',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
        id: 4,
        name: 'Rapat Internal',
        slug: 'rapat-internal',
        type: 'Agenda',
        itemCount: 9,
        description: 'Agenda konsolidasi BPH dan pengurus divisi.',
        color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    {
        id: 5,
        name: 'Pers Release',
        slug: 'press-release',
        type: 'Berita',
        itemCount: 14,
        description: 'Publikasi resmi liputan kegiatan HIMATIFA.',
        color: 'bg-rose-50 text-rose-700 border-rose-200'
    }
]

export const mediaFiles: MediaItem[] = [
    { id: 1, name: 'poster-oscar-2026.jpg', type: 'Gambar', size: '2.4 MB', date: '04 Okt 2026', url: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=500&q=80' },
    { id: 2, name: 'logo-himatifa-utama.png', type: 'Gambar', size: '450 KB', date: '01 Okt 2026', url: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=500&q=80' },
    { id: 3, name: 'pedoman-organisasi-2026.pdf', type: 'Dokumen', size: '5.1 MB', date: '28 Sep 2026' },
    { id: 4, name: 'dokumentasi-makrab-maba.jpg', type: 'Gambar', size: '3.2 MB', date: '25 Sep 2026', url: 'https://images.unsplash.com/photo-1523580494112-071d192c9e1d?w=500&q=80' },
    { id: 5, name: 'teaser-pendelegasian-kmhe.mp4', type: 'Video', size: '18.5 MB', date: '20 Sep 2026' },
    { id: 6, name: 'surat-undangan-bph-inti.pdf', type: 'Dokumen', size: '800 KB', date: '15 Sep 2026' },
]

export const dashboardStats: DashboardStat[] = [
    {
        title: 'Total Artikel',
        value: '142',
        trend: '+12%',
        isPositive: true,
        subtext: 'vs bulan lalu'
    },
    {
        title: 'Total Kunjungan',
        value: '24.5K',
        trend: '+18%',
        isPositive: true,
        subtext: 'pageviews unik'
    },
    {
        title: 'Pengurus Aktif',
        value: '42',
        trend: 'BPH & Divisi',
        isPositive: true,
        subtext: 'periode 2026/2027'
    },
    {
        title: 'Menunggu Review',
        value: '12',
        trend: 'Perlu dicek',
        isPositive: false,
        subtext: 'dokumen & draft'
    }
]

export const recentActivities: ActivityItem[] = [
    {
        id: 1,
        user: 'Vichras Mazcheranou',
        role: 'Ketua Umum',
        action: 'mengunggah proposal baru',
        target: 'Proposal VIBRANUM 2026',
        time: '10 menit lalu',
        avatar: 'VM'
    },
    {
        id: 2,
        user: 'Aura Rizky',
        role: 'Sekretaris',
        action: 'menerbitkan artikel',
        target: 'Tech Talk 2026: Agentic AI',
        time: '1 jam lalu',
        avatar: 'AR'
    },
    {
        id: 3,
        user: 'Maulidya Dliyaun',
        role: 'Bendahara',
        action: 'memperbarui laporan',
        target: 'Laporan Keuangan Oktober',
        time: '3 jam lalu',
        avatar: 'MD'
    },
    {
        id: 4,
        user: 'Sistem SIM',
        role: 'Auto-Backup',
        action: 'menyelesaikan',
        target: 'Backup Database Mingguan',
        time: 'Kemarin, 23:00',
        avatar: 'SI'
    }
]

export const recentDiscussions: DiscussionItem[] = [
    {
        id: 1,
        author: 'Bima Pratama',
        targetTitle: 'Tech Talk AI 2026',
        content: 'Wah materinya sangat insightful, ditunggu event selanjutnya kak!',
        time: '20 menit lalu'
    },
    {
        id: 2,
        author: 'Rina Kartika',
        targetTitle: 'Open Recruitment Pengurus',
        content: 'Untuk formulir pendaftarannya bisa diakses di mana ya kak?',
        time: '2 jam lalu'
    }
]

export const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

export const heroContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
}

export const revealStagger: Variants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(4px)' },
    show: {
        opacity: 1, y: 0, filter: 'blur(0px)',
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
}

export const heroItem: Variants = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
}

export const reveal = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65 } }
}