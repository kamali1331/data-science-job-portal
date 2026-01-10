import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.100),white)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.900),black)] opacity-50" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent mb-6 drop-shadow-sm">
                    Your Gateway to <br /> Data Science Careers
                </h1>
                <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
                    Explore jobs, curated learning resources, and expert mentorship designed specifically for data analysts and AI aspirants.
                </p>
                <div className="flex justify-center gap-4">
                    <Link href="#resources" className="px-8 py-3 rounded-full bg-primary text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-primary/25 hover:scale-105">
                        Explore Resources
                    </Link>
                    <Link href="#jobs" className="px-8 py-3 rounded-full bg-white dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-700 font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all hover:scale-105">
                        Find Jobs
                    </Link>
                </div>
            </div>
        </section>
    );
}
