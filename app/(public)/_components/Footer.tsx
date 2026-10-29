'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Mail, Phone, Copyright } from 'lucide-react'
import { navLinks, socials } from '../../data'

export function Footer() {
    return (
        <footer id="footer" className="relative bg-[#0a0f1d] border-t border-slate-800/80 px-4 sm:px-6 pt-16 pb-8 text-white lg:px-8 lg:pt-20">
            <div className="relative mx-auto max-w-7xl">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-4 lg:pr-4">
                        <Link href="/" className="group inline-flex items-center gap-3 font-bold">
                            <div className="grid size-10 place-items-center rounded-xl border border-slate-800 bg-slate-900 p-1.5 transition-colors group-hover:border-blue-500/50">
                                <Image
                                    src="/himatifa1.png"
                                    alt="Logo HIMATIFA UMSURA"
                                    width={28}
                                    height={28}
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-lg font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                                HIMATIFA UMSURA
                            </span>
                        </Link>

                        <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-400 font-normal max-w-sm">
                            Himpunan Mahasiswa Teknik Informatika Universitas Muhammadiyah Surabaya. Bertumbuh, berkolaborasi, dan menghadirkan dampak positif berkelanjutan.
                        </p>

                        <div className="mt-6 flex items-center gap-2.5">
                            {socials.map(({ label, href, icon: Icon }) => (
                                <Link
                                    key={label}
                                    aria-label={`${label} HIMATIFA`}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="grid size-9 place-items-center rounded-xl border border-slate-800 bg-slate-900/80 text-slate-400 transition-all duration-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white active:scale-[0.96]"
                                >
                                    <Icon className="size-4" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h3 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                            Navigasi
                        </h3>
                        <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium text-slate-400">
                            {navLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.path}
                                        className="inline-block transition-colors hover:text-white"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <h3 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                            Layanan Mahasiswa
                        </h3>
                        <ul className="flex flex-col gap-2.5 text-xs sm:text-sm font-medium text-slate-400">
                            <li>
                                <Link href="/akademik" className="inline-block transition-colors hover:text-white">
                                    Layanan Akademik
                                </Link>
                            </li>
                            <li>
                                <Link href="/aspirasi" className="inline-block transition-colors hover:text-white">
                                    Suara Mahasiswa (Aspirasi)
                                </Link>
                            </li>
                            <li>
                                <Link href="/showcase" className="inline-block transition-colors hover:text-white">
                                    Showcase Karya Mahasiswa
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <h3 className="mb-4 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                            Sekretariat
                        </h3>
                        <ul className="flex flex-col gap-3.5 text-xs sm:text-sm text-slate-400 font-normal">
                            <li className="flex items-start gap-3">
                                <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-slate-800 bg-slate-900 text-blue-400 mt-0.5">
                                    <MapPin className="size-4" />
                                </div>
                                <span className="leading-relaxed">
                                    Gedung G Lt. 3, Universitas Muhammadiyah Surabaya<br />
                                    Jl. Sutorejo No.59, Surabaya 60113
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-slate-800 bg-slate-900 text-blue-400">
                                    <Mail className="size-4" />
                                </div>
                                <a href="mailto:himatifa@um-surabaya.ac.id" className="transition-colors hover:text-white">
                                    himatifa@um-surabaya.ac.id
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="grid size-8 shrink-0 place-items-center rounded-lg border border-slate-800 bg-slate-900 text-blue-400">
                                    <Phone className="size-4" />
                                </div>
                                <a href="tel:+6281234567890" className="transition-colors hover:text-white">
                                    +62 812 3456 7890
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80 pt-6 text-xs text-slate-500 font-medium">
                    <p className="flex items-center gap-1.5">
                        <Copyright className="size-3.5 shrink-0" />
                        <span>{new Date().getFullYear()} HIMATIFA UMSURA. Hak Cipta Dilindungi.</span>
                    </p>
                    <p className="uppercase tracking-wider font-semibold text-[10px] text-slate-400">
                        Dikembangkan oleh Departemen Medkominfo
                    </p>
                </div>
            </div>
        </footer>
    )
}