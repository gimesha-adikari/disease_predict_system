'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

export default function TopNav() {
    const pathname = usePathname();
    const router = useRouter();
    const isAuthed = useMemo(() => !!globalThis?.localStorage?.getItem('accessToken'), []);

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        router.replace('/login');
    };

    const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
        const active = pathname?.startsWith(href);
        return (
            <Link
                href={href}
                className={`px-3 py-2 rounded-md text-sm ${active ? 'text-white bg-white/10' : 'opacity-80 hover:opacity-100'}`}
            >
                {children}
            </Link>
        );
    };

    return (
        <header className="topnav">
            <div className="container flex items-center justify-between h-14">
                <Link href={isAuthed ? '/dashboard' : '/login'} className="flex items-center gap-2">
                    <span className="brand-dot" />
                    <span className="font-semibold tracking-tight">Hospital Console</span>
                </Link>
                <nav className="flex items-center gap-1">
                    {isAuthed && (
                        <>
                            <NavLink href="/dashboard">Dashboard</NavLink>
                            <NavLink href="/patients">Patients</NavLink>
                            <button className="btn-secondary ml-2" onClick={logout}>Logout</button>
                        </>
                    )}
                    {!isAuthed && <NavLink href="/login">Sign in</NavLink>}
                </nav>
            </div>
        </header>
    );
}
