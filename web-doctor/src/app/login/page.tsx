'use client';
import { useState } from 'react';
import { login, setAuth } from '@features/auth/api';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('doctor@example.com');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState<string | null>(null);
    const router = useRouter();

    const onLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setMsg(null);
        try {
            const { data } = await login(email, password);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            setAuth(data.accessToken);
            router.replace('/dashboard');
        } catch (e: any) {
            setMsg(e?.response?.data?.error || 'Login failed');
        } finally { setLoading(false); }
    };

    return (
        <div className="grid gap-10 lg:grid-cols-12">
            {/* Left hero */}
            <section className="hidden lg:block lg:col-span-7">
                <h1 className="text-4xl font-semibold mb-3">Welcome to Hospital Console</h1>
                <p className="opacity-80 mb-6 max-w-xl">
                    Secure access for doctors to onboard patients and review clinical signals.
                </p>
                <div className="flex gap-2 text-sm">
                    <span className="px-3 py-2 rounded-md border border-white/10 bg-white/5">RBAC</span>
                    <span className="px-3 py-2 rounded-md border border-white/10 bg-white/5">Invites</span>
                    <span className="px-3 py-2 rounded-md border border-white/10 bg-white/5">Jobs</span>
                </div>
            </section>

            {/* Right auth card */}
            <section className="lg:col-span-5">
                <form onSubmit={onLogin} className="rounded-2xl border border-white/10 bg-[#0f172a] shadow-panel p-6 max-w-md ml-auto">
                    <h2 className="text-xl font-semibold mb-2">Sign in</h2>
                    <p className="text-sm opacity-70 mb-4">Use your hospital email and password.</p>

                    {msg && (
                        <div className="p-3 rounded-md border border-red-400/40 bg-red-500/10 text-red-300 text-sm mb-3">
                            {msg}
                        </div>
                    )}

                    <label className="block text-sm mb-1">Email</label>
                    <input
                        className="w-full px-3 py-3 rounded-xl border border-white/10 bg-white/5 outline-none focus:ring-4 focus:ring-brand/30 focus:border-brand-600 mb-3"
                        autoFocus
                        value={email}
                        onChange={e=>setEmail(e.target.value)}
                        placeholder="you@hospital.org"
                    />

                    <label className="block text-sm mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full px-3 py-3 rounded-xl border border-white/10 bg-white/5 outline-none focus:ring-4 focus:ring-brand/30 focus:border-brand-600 mb-5"
                        value={password}
                        onChange={e=>setPassword(e.target.value)}
                        placeholder="••••••••"
                    />

                    <button
                        disabled={loading}
                        className="w-full inline-flex items-center justify-center px-4 py-3 rounded-xl font-semibold bg-brand shadow-[0_8px_20px_rgba(99,102,241,.35)] hover:shadow-[0_12px_26px_rgba(99,102,241,.48)] transition will-change-transform"
                    >
                        {loading? 'Signing in…' : 'Sign in'}
                    </button>
                </form>
            </section>
        </div>
    );
}
