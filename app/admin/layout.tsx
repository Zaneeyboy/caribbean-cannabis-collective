'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, Leaf, ChevronRight } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace('/signin?next=/admin');
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className='min-h-screen bg-forest flex items-center justify-center'>
        <div className='w-8 h-8 rounded-full border-2 border-lime border-t-transparent animate-spin' />
      </div>
    );
  }

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  return (
    <div className='min-h-screen bg-forest flex'>
      {/* Sidebar */}
      <aside className='w-60 flex-shrink-0 bg-canopy border-r border-smoke flex flex-col'>
        {/* Brand */}
        <div className='px-5 py-5 border-b border-smoke'>
          <Link href='/' className='flex items-center gap-2 group'>
            <div className='w-8 h-8 rounded-md bg-lime/10 border border-lime/30 flex items-center justify-center'>
              <Leaf size={14} className='text-lime' />
            </div>
            <div>
              <p className='text-xs font-bold text-cream tracking-wide'>CCC Admin</p>
              <p className='text-[10px] text-mist'>Management Portal</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className='flex-1 px-3 py-4 space-y-1'>
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-lime/10 text-lime border border-lime/20' : 'text-mist hover:text-cream hover:bg-grove'
                }`}
              >
                <Icon size={16} />
                {label}
                {active && <ChevronRight size={14} className='ml-auto' />}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className='px-3 py-4 border-t border-smoke'>
          <button
            onClick={() => signOut().then(() => router.push('/'))}
            className='flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-mist hover:text-coral hover:bg-coral/10 transition-colors w-full'
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className='flex-1 flex flex-col min-w-0'>
        <main className='flex-1 p-8 overflow-auto'>{children}</main>
      </div>
    </div>
  );
}
