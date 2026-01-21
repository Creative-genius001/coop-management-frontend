'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import { useAuthStore } from './store/auth-store';

const NotFound = () => {
  const router = useRouter();
  const { user } = useAuthStore();

    useEffect(() => {
        
          if(user?.role === 'admin') {
            router.replace('/admin');
          }
          else if (user?.role === 'member') {
            router.replace('/');
          }

    }, [router, user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
      </div>
    </div>
  );
};

export default NotFound;
