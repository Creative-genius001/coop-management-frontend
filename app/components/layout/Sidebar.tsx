'use client'

import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  HandCoins,
  ArrowUpCircle,
  Landmark,
  BookOpen,
  User,
  Users,
  LogOut,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/app/store/auth-store';
import Link from 'next/link';
import { toast } from 'sonner';

const memberNavItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/loans', icon: HandCoins, label: 'Loans' },
  { to: '/ledger', icon: BookOpen, label: 'Ledger' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const adminNavItems = [
  { to: '/admin/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/members', icon: Users, label: 'Members' },
  { to: '/admin/loans', icon: HandCoins, label: 'Loans' },
  { to: '/admin/contributions', icon: Wallet, label: 'Contributions' },
  { to: '/admin/withdrawals', icon: ArrowUpCircle, label: 'Withdrawals' },
  { to: '/admin/ledger', icon: BookOpen, label: 'Ledger' },
];

export default function Sidebar() {
  const { user, logout } = useAuthStore();

  console.log({ user, firstname: user?.firstname });
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = user?.role === 'admin';
  const navItems = isAdmin ? adminNavItems : memberNavItems;

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
      
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || 'Logout failed');
      }

      let isUserLoggedOut;

      try {
        isUserLoggedOut  = await res.json();
      } catch {
        throw new Error('Invalid server response');
      }
      
      if (!isUserLoggedOut) {
        throw new Error('Logout was not successful');
      }
    } catch (error) {
      console.error('[Logout Error]', error)

      toast.error(
        error instanceof Error ? error.message : 'Something went wrong'
      );
    } finally {
      logout();
      router.push('/auth/login');
    }    
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">CoopFlow</h1>
            <p className="text-xs text-sidebar-muted capitalize">{user?.role} Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            href={to}
            className={cn('sidebar-link', pathname === to && 'sidebar-link-active')}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* User info & logout */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-medium text-sidebar-foreground">
              {`${user?.firstname.charAt(0)} ${user?.lastname.charAt(0)}`}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.firstname} {user?.lastname}
            </p>
            <p className="text-xs text-sidebar-muted truncate">{user?.memberId}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-sidebar-muted hover:text-destructive"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
