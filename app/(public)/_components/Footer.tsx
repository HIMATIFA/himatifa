import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Mail, Phone, Copyright } from 'lucide-react'
import { navLinks, SOCIALS } from './data'

export function Footer() {
    return (
        <footer id="footer" className="relative bg-[#071426] px-6 pb-8 pt-20 text-white lg:px-10">
            <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[700px] -translate-x-1/2 rounded-full bg-[#2563eb]/10 blur-[100px]" />

            <div className="relative mx-auto max-w-7xl">
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-4 lg:pr-6">
                        <Link href="/" className="group flex w-fit items-center gap-3 font-black tracking-tight">
                            <span className="grid size-12 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10 transition-all duration-300 group-hover:bg-[#2563eb]/20 group-hover:ring-blue-500/50">
                                <Image
                                    src="/himatifa1.png"
                                    alt="Logo HIMATIFA UMSurabaya"
                                    width={32}
                                    height={32}
                                    className="object-contain transition-transform duration-500 group-hover:scale-110"
                                />
                            </span>
                            <span className="text-xl tracking-wide text-white transition-colors group-hover:text-blue-400">
                                HIMATIFA
                            </span>
                        </Link>
                        <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-blue-100/60">
                            Himpunan Mahasiswa Teknik Informatika Universitas Muhammadiyah Surabaya. Bertumbuh, berkolaborasi, dan memberikan dampak.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            {SOCIALS.map(({ label, href, icon: Icon }) => (
                                <Link
                                    key={label}
                                    aria-label={`${label} HIMATIFA`}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="grid size-11 place-items-center rounded-xl bg-white/5 text-slate-300 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:bg-[#2563eb] hover:text-white hover:ring-blue-500/40 hover:shadow-lg hover:shadow-blue-600/20"
                                >
                                    <Icon className="size-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="mb-6 text-xs font-black uppercase tracking-[.25em] text-white/90">Tautan</h3>
                        <ul className="flex flex-col gap-3.5 text-[14.5px] font-medium text-blue-100/60">
                            {navLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.path}
                                        className="group inline-flex items-center gap-2 transition-colors hover:text-white"
                                    >
                                        <span className="h-px w-0 bg-blue-500 transition-all duration-300 group-hover:w-4" />
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <h3 className="mb-6 text-xs font-black uppercase tracking-[.25em] text-white/90">Layanan</h3>
                        <ul className="flex flex-col gap-3.5 text-[14.5px] font-medium text-blue-100/60">
                            <li>
                                <Link href="/akademik" className="group inline-flex items-center gap-2 transition-colors hover:text-white">
                                    <span className="h-px w-0 bg-blue-500 transition-all duration-300 group-hover:w-4" />
                                    Layanan Akademik
                                </Link>
                            </li>
                            <li>
                                <Link href="/aspirasi" className="group inline-flex items-center gap-2 transition-colors hover:text-white">
                                    <span className="h-px w-0 bg-blue-500 transition-all duration-300 group-hover:w-4" />
                                    Suara Mahasiswa
                                </Link>
                            </li>
                            <li>
                                <Link href="/showcase" className="group inline-flex items-center gap-2 transition-colors hover:text-white">
                                    <span className="h-px w-0 bg-blue-500 transition-all duration-300 group-hover:w-4" />
                                    Karya Mahasiswa
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <h3 className="mb-6 text-xs font-black uppercase tracking-[.25em] text-white/90">Hubungi Kami</h3>
                        <ul className="flex flex-col gap-5 text-sm text-blue-100/60">
                            <li className="group flex items-start gap-4 transition-colors hover:text-white">
                                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10 transition-colors group-hover:bg-[#2563eb]/20 group-hover:ring-blue-500/50">
                                    <MapPin className="size-4 text-blue-400" />
                                </span>
                                <span className="text-[13px] leading-relaxed">
                                    Gedung G Lt. 3, Universitas Muhammadiyah Surabaya<br />
                                    Jl. Sutorejo No.59, Surabaya, Jawa Timur 60113
                                </span>
                            </li>
                            <li className="group flex items-center gap-4 transition-colors hover:text-white">
                                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10 transition-colors group-hover:bg-[#2563eb]/20 group-hover:ring-blue-500/50">
                                    <Mail className="size-4 text-blue-400" />
                                </span>
                                <a href="mailto:himatifa@um-surabaya.ac.id" className="hover:text-blue-300 transition-colors">
                                    himatifa@um-surabaya.ac.id
                                </a>
                            </li>
                            <li className="group flex items-center gap-4 transition-colors hover:text-white">
                                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/5 ring-1 ring-white/10 transition-colors group-hover:bg-[#2563eb]/20 group-hover:ring-blue-500/50">
                                    <Phone className="size-4 text-blue-400" />
                                </span>
                                <a href="tel:+6281234567890" className="tracking-wider hover:text-blue-300 transition-colors">
                                    +62 812 3456 7890
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
                    <p className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        <Copyright className="size-3.5" /> {new Date().getFullYear()} HIMATIFA UMSURA. Seluruh hak cipta dilindungi.
                    </p>
                    <p className="text-xs font-medium text-slate-400">
                        CREATED by MEDKOMINFO
                    </p>
                </div>
            </div>
        </footer>
    )
}
