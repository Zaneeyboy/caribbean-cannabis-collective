'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase-client';
import { formatPrice } from '@/lib/utils';
import { Package, ShoppingBag, Users, DollarSign, ArrowRight, TrendingUp } from 'lucide-react';

interface Stats {
  totalOrders: number;
  totalRevenueCents: number;
  totalUsers: number;
  pendingOrders: number;
}

interface RecentOrder {
  id: string;
  customer: { name: string; email: string };
  totalCents: number;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, totalRevenueCents: 0, totalUsers: 0, pendingOrders: 0 });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const db = getFirebaseDb();

        // Fetch orders
        const ordersSnap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(50)));
        const orders = ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() }) as RecentOrder & { paymentStatus: string });

        // Fetch users
        const usersSnap = await getDocs(collection(db, 'users'));

        // Fetch pending (processing)
        const pendingSnap = await getDocs(query(collection(db, 'orders'), where('status', '==', 'processing')));

        setStats({
          totalOrders: orders.length,
          totalRevenueCents: orders.reduce((s, o) => s + (o.totalCents ?? 0), 0),
          totalUsers: usersSnap.size,
          pendingOrders: pendingSnap.size,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    {
      label: 'Total Revenue',
      value: formatPrice(stats.totalRevenueCents),
      icon: DollarSign,
      color: 'text-gold',
      bg: 'bg-gold/10',
    },
    {
      label: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingBag,
      color: 'text-lime',
      bg: 'bg-lime/10',
    },
    {
      label: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'text-coral',
      bg: 'bg-coral/10',
    },
    {
      label: 'Pending Orders',
      value: stats.pendingOrders.toString(),
      icon: TrendingUp,
      color: 'text-ivory',
      bg: 'bg-ivory/10',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='font-display text-4xl text-cream'>Dashboard</h1>
        <p className='text-mist text-sm mt-1'>Welcome back — here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stat cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10'>
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className='bg-canopy border border-smoke rounded-xl p-5'>
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-4`}>
              <Icon size={18} className={color} />
            </div>
            <p className='text-xs font-bold tracking-widest uppercase text-mist mb-1'>{label}</p>
            {loading ? <div className='h-7 w-24 bg-smoke rounded animate-pulse' /> : <p className='text-2xl font-display text-cream'>{value}</p>}
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-10'>
        {[
          { href: '/admin/products/new', label: 'Add New Product', icon: Package, desc: 'Create a product listing with images, variants, and pricing' },
          { href: '/admin/orders', label: 'View All Orders', icon: ShoppingBag, desc: 'Track and manage customer orders and fulfilment status' },
          { href: '/admin/users', label: 'Manage Users', icon: Users, desc: 'View customers, manage roles, and perform user actions' },
        ].map(({ href, label, icon: Icon, desc }) => (
          <Link key={href} href={href} className='group bg-canopy border border-smoke hover:border-lime/50 rounded-xl p-5 transition-colors'>
            <Icon size={20} className='text-lime mb-3' />
            <p className='text-sm font-bold text-cream mb-1 group-hover:text-lime transition-colors'>{label}</p>
            <p className='text-xs text-mist'>{desc}</p>
            <div className='flex items-center gap-1 text-xs text-lime mt-3 opacity-0 group-hover:opacity-100 transition-opacity'>
              Go <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className='bg-canopy border border-smoke rounded-xl'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-smoke'>
          <h2 className='text-sm font-bold text-cream'>Recent Orders</h2>
          <Link href='/admin/orders' className='text-xs text-lime hover:underline'>
            View all
          </Link>
        </div>
        {loading ? (
          <div className='p-6 space-y-3'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='h-10 bg-smoke rounded animate-pulse' />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <p className='p-6 text-mist text-sm text-center'>No orders yet.</p>
        ) : (
          <div className='divide-y divide-smoke'>
            {recentOrders.map((order) => (
              <Link key={order.id} href={`/admin/orders/${order.id}`} className='flex items-center justify-between px-6 py-4 hover:bg-grove transition-colors'>
                <div>
                  <p className='text-sm text-cream font-medium'>{order.customer?.name || '—'}</p>
                  <p className='text-xs text-mist'>{order.customer?.email}</p>
                </div>
                <div className='text-right'>
                  <p className='text-sm text-gold font-medium'>{formatPrice(order.totalCents)}</p>
                  <span
                    className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                      order.status === 'paid' ? 'bg-lime/10 text-lime' : order.status === 'shipped' ? 'bg-gold/10 text-gold' : 'bg-smoke text-mist'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
