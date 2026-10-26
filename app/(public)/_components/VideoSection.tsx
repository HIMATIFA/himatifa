'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react'
import { reveal } from './data'

export function VideoSection() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const isVideoInView = useInView(videoRef, { margin: '-100px' })
    const [isPlaying, setIsPlaying] = useState(true)
    const [isMuted, setIsMuted] = useState(true)

    useEffect(() => {
        if (videoRef.current) {
            if (isVideoInView && isPlaying) {
                videoRef.current.play().catch((err: unknown) => console.log('Autoplay ditunda oleh browser:', err))
            } else {
                videoRef.current.pause()
            }
        }
    }, [isVideoInView, isPlaying])

    const togglePlay = useCallback(() => {
        if (!videoRef.current) return
        if (isPlaying) {
            videoRef.current.pause()
            setIsPlaying(false)
        } else {
            videoRef.current.play().catch(() => {})
            setIsPlaying(true)
        }
    }, [isPlaying])

    const toggleMute = useCallback(() => {
        if (!videoRef.current) return
        const next = !isMuted
        videoRef.current.muted = next
        setIsMuted(next)
    }, [isMuted])

    return (
        <section id="video-profil" className="relative mx-auto max-w-7xl px-6 pb-24 lg:px-10">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal}>
                <div className="mb-12 text-center">
                    <p className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.2em] text-[#2563eb]">
                        <Sparkles className="size-3.5" /> Mengenal Lebih Dekat
                    </p>
                    <h2 className="text-4xl font-black tracking-tight sm:text-5xl text-[#0a192f]">
                        Video Profil <br />
                        <span className="bg-gradient-to-r from-[#2563eb] to-sky-400 bg-clip-text text-transparent">
                            HIMATIFA.
                        </span>
                    </h2>
                </div>

                <div className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/80 bg-white/60 p-3 shadow-2xl shadow-blue-900/10 backdrop-blur-xl">
                    <div className="group relative aspect-video w-full overflow-hidden rounded-[1.8rem] bg-slate-900">
                        <video
                            ref={videoRef}
                            src="/oscar.mp4"
                            loop
                            playsInline
                            muted={isMuted}
                            className="size-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-40"
                        />
                        <div className="absolute bottom-5 right-5 flex gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <button
                                onClick={togglePlay}
                                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                                className="grid size-10 place-items-center rounded-full bg-white/90 text-[#0a192f] shadow-lg backdrop-blur transition-transform hover:scale-105 active:scale-95"
                            >
                                {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
                            </button>
                            <button
                                onClick={toggleMute}
                                aria-label={isMuted ? 'Nyalakan suara' : 'Matikan suara'}
                                className="grid size-10 place-items-center rounded-full bg-white/90 text-[#0a192f] shadow-lg backdrop-blur transition-transform hover:scale-105 active:scale-95"
                            >
                                {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
                            </button>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <div>
                                <h3 className="text-2xl font-bold">After Movie OSCAR 2026</h3>
                                <p className="mt-1 text-sm text-blue-100/80">Dokumenter Perjalanan S1 Informatika UMSURA</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
