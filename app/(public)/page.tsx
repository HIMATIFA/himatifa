import {
    Navbar,
    HeroSection,
    AboutSection,
    VideoSection,
    BphSection,
    DepartmentSection,
    AgendaSection,
    NewsSection,
    FaqSection,
    Footer,
    BackToTop,
} from './_components'

export default function Page() {
    return (
        <main className="min-h-screen overflow-hidden bg-[#f4f8fc] text-[#0a192f]">
            {/* Ambient Background Blur */}
            <div className="pointer-events-none absolute left-0 top-0 -z-10 h-full w-full overflow-hidden">
                <div className="absolute left-[-10%] top-[-5%] h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[120px]" />
                <div className="absolute right-[-5%] top-[20%] h-[600px] w-[600px] rounded-full bg-cyan-300/20 blur-[150px]" />
            </div>

            <Navbar />
            <HeroSection />
            <AboutSection />
            <VideoSection />
            <BphSection />
            <DepartmentSection />
            <AgendaSection />
            <NewsSection />
            <FaqSection />
            <Footer />
            <BackToTop />
        </main>
    )
}
