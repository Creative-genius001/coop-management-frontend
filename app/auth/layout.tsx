'use client'

import "../globals.css";

import { useIsMobile } from '../hooks/use-mobile';
import { Toaster } from '../components/ui/sonner';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    useIsMobile();


    return (
        <div className="">
            <Toaster />
            {children}
        </div>
    );
}
