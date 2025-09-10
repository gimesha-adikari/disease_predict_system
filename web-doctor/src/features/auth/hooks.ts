'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { setAuth } from './api';

export function useAuthGuard() {
    const router = useRouter();
    useEffect(() => {
        const t = localStorage.getItem('accessToken');
        if (!t) router.replace('/login');
        else setAuth(t);
    }, [router]);
}
