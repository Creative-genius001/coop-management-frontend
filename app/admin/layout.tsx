'use client'

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import "../globals.css";

import Sidebar from "../components/layout/Sidebar";
import { useIsMobile } from '../hooks/use-mobile';
import { Toaster } from '../components/ui/sonner';

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    useIsMobile();

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: (failureCount, error) => {
                    if (error.message === 'UNAUTHORIZED') return false;
                    return failureCount < 3;
                }
            }
        }
    });

    return (
        <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="ml-64 min-h-screen">
            <Toaster />
            <div className="p-8 animate-fade-in">
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </div>
        </main>
        </div>
    );
}
