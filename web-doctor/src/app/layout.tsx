import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';

export const metadata = {
    title: 'Hospital Console',
    description: 'Doctor console for invites and monitoring',
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        {/* Make the whole page a 3-row grid so the footer sits at the bottom */}
        <body className={`${inter.className} min-h-screen grid grid-rows-[auto_1fr_auto]`}>
        {/* Sticky glassy top bar (row 1) */}
        <header className="sticky top-0 z-50 backdrop-blur bg-[#0b1220]/80 border-b border-white/10">
            <div className="mx-auto max-w-[1100px] px-4 h-14 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-brand shadow-[0_0_0_6px_rgba(99,102,241,.18)]" />
                    <span className="font-semibold tracking-tight">Hospital Console</span>
                </Link>
                <nav className="flex items-center gap-1">
                    <Link href="/dashboard" className="px-3 py-2 rounded-md text-sm opacity-80 hover:opacity-100">Dashboard</Link>
                    <Link href="/patients" className="px-3 py-2 rounded-md text-sm opacity-80 hover:opacity-100">Patients</Link>
                </nav>
            </div>
        </header>

        {/* Main grows to fill available space (row 2) */}
        <main className="mx-auto max-w-[1100px] px-4 py-10 w-full">
            {children}
        </main>

        {/* Footer always at the very bottom (row 3) */}
        <footer className="py-10 opacity-70 border-t border-white/10">
            <div className="mx-auto max-w-[1100px] px-4 text-sm">
                <div className="pt-6 flex flex-wrap items-center gap-2">
                    <span>© {new Date().getFullYear()} Hospital Console</span>
                    <span className="mx-1">•</span>
                    <span>Secure patient onboarding & monitoring</span>
                </div>
            </div>
        </footer>
        </body>
        </html>
    );
}
