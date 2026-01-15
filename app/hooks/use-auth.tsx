'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react"
import { useAuthStore } from "@/app/store/auth-store"

export function useAuth() {

  const router = useRouter();
  const auth = useAuthStore();

  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])


  useEffect(() => {
    if (!auth.user && hydrated) {
        router.push('/login');
    }

  }, [auth,hydrated, router]);

  return {
    ...auth,
    hydrated,
  }
}