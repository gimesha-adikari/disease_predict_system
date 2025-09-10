'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@features/auth/api';
import Link from 'next/link';

type Health = { ok: boolean; service: string };

export default function DashboardPage() {
    const router = useRouter();
    const [health, setHealth] = useState<Health | null>(null);
    const base = useMemo(() => process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000', []);

    useEffect(() => {
        const t = localStorage.getItem('accessToken');
        if (!t) { router.replace('/login'); return; }
        api.get(`${base}/health`).then(r => setHealth(r.data)).catch(() => setHealth(null));
    }, [router, base]);

    return (
        <>
            <div className="mb-6">
                <h1 className="text-3xl font-semibold">Doctor Dashboard</h1>
                <p className="text-sm opacity-70">Manage patients and keep an eye on system status.</p>
            </div>

            <section className="grid gap-5 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-[#0f172a] shadow-panel p-5">
                    <div className="text-sm opacity-70 mb-1">Backend health</div>
                    <div className="text-lg">
                        {health ? <span className="text-emerald-400">OK</span> : <span className="text-red-400">Unavailable</span>}
                    </div>
                    {health && <div className="text-xs opacity-60 mt-1">{health.service}</div>}
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0f172a] shadow-panel p-5">
                    <div className="text-sm opacity-70 mb-2">Quick action</div>
                    <Link href="/patients" className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl font-semibold bg-brand shadow-[0_8px_20px_rgba(99,102,241,.35)] hover:shadow-[0_12px_26px_rgba(99,102,241,.48)]">
                        Invite a patient
                    </Link>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0f172a] shadow-panel p-5">
                    <div className="text-sm opacity-70 mb-2">Sessions</div>
                    <div className="text-xs opacity-60">Access token saved locally.</div>
                </div>
            </section>

            <section className="grid gap-5 md:grid-cols-2 mt-6">
                <div className="rounded-2xl border border-white/10 bg-[#0f172a] shadow-panel p-6">
                    <h2 className="font-semibold mb-2">Recent activity</h2>
                    <div className="text-sm opacity-70">No recent events.</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#0f172a] shadow-panel p-6">
                    <h2 className="font-semibold mb-2">System notes</h2>
                    <ul className="text-sm opacity-80 list-disc pl-5 space-y-1">
                        <li>Only doctors can invite patients.</li>
                        <li>Patients activate via token and use the mobile app.</li>
                    </ul>
                </div>
            </section>
        </>
    );
}
