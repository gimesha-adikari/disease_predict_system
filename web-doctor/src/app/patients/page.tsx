'use client';
import { useState } from 'react';
import { invitePatient } from '@features/auth/api';

export default function PatientsPage() {
    const [email, setEmail] = useState('');
    const [result, setResult] = useState<any | null>(null);
    const [err, setErr] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const onInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); setErr(null); setResult(null);
        try {
            const { data } = await invitePatient(email);
            setResult(data);
        } catch (e: any) { setErr(e?.response?.data?.error || 'Invite failed'); }
        finally { setLoading(false); }
    };

    const copy = async (text: string) => {
        try { await navigator.clipboard.writeText(text); alert('Copied!'); } catch {}
    };

    return (
        <>
            <div className="mb-6">
                <h1 className="text-3xl font-semibold">Invite Patient</h1>
                <p className="text-sm opacity-70">Send an activation link or token to a patient’s email.</p>
            </div>

            <form onSubmit={onInvite} className="rounded-2xl border border-white/10 bg-[#0f172a] shadow-panel p-6 max-w-xl">
                <label className="block text-sm mb-1">Patient email</label>
                <input
                    className="w-full px-3 py-3 rounded-xl border border-white/10 bg-white/5 outline-none focus:ring-4 focus:ring-brand/30 focus:border-brand-600 mb-3"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    placeholder="patient@example.com"
                />
                <button disabled={loading} className="inline-flex items-center justify-center px-4 py-3 rounded-xl font-semibold bg-brand shadow-[0_8px_20px_rgba(99,102,241,.35)] hover:shadow-[0_12px_26px_rgba(99,102,241,.48)]">
                    {loading?'Inviting…':'Send invite'}
                </button>
            </form>

            {err && (
                <div className="mt-4 p-3 rounded-md border border-red-400/40 bg-red-500/10 text-red-300 text-sm max-w-xl">
                    {err}
                </div>
            )}

            {result && (
                <div className="mt-4 rounded-2xl border border-white/10 bg-[#0f172a] shadow-panel p-6 space-y-2 max-w-2xl">
                    <p className="text-sm opacity-80">Invite created.</p>
                    <p className="text-sm break-all"><strong>Token:</strong> {result.token}</p>
                    <p className="text-sm break-all"><strong>Link:</strong> {result.link}</p>
                    <p className="text-sm"><strong>Expires:</strong> {new Date(result.expiresAt).toLocaleString()}</p>
                    <div className="flex gap-2">
                        <button className="inline-flex items-center justify-center px-4 py-3 rounded-xl font-semibold bg-brand shadow-[0_8px_20px_rgba(99,102,241,.35)] hover:shadow-[0_12px_26px_rgba(99,102,241,.48)]" onClick={()=>copy(result.token)}>
                            Copy token
                        </button>
                        <a className="inline-flex items-center justify-center px-4 py-3 rounded-xl font-semibold bg-brand shadow-[0_8px_20px_rgba(99,102,241,.35)] hover:shadow-[0_12px_26px_rgba(99,102,241,.48)]" href={result.link} target="_blank">
                            Open link
                        </a>
                    </div>
                </div>
            )}
        </>
    );
}
