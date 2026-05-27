'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase-client';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';
import { User, Package, LogOut, ChevronRight } from 'lucide-react';

interface Order {
  id: string;
  totalCents: number;
  status: string;
  createdAt: string;
  lineItems: { name: string; quantity: number; priceCents: number }[];
}

const STATUS_STYLES: Record<string, string> = {
  paid: 'bg-lime/10 text-lime',
  processing: 'bg-gold/10 text-gold',
  shipped: 'bg-coral/10 text-coral',
  delivered: 'bg-lime/20 text-lime',
  refunded: 'bg-smoke text-mist',
};

export default function AccountPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/signin?next=/account');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user?.email) return;
    const fetch = async () => {
      try {
        const db = getFirebaseDb();
        const snap = await getDocs(query(collection(db, 'orders'), where('customer.email', '==', user.email), orderBy('createdAt', 'desc')));
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order));
      } finally {
        setOrdersLoading(false);
      }
    };
    fetch();
  }, [user?.email]);

  if (loading || !user || !profile) {
    return (
      <div className='min-h-screen bg-forest flex items-center justify-center'>
        <div className='w-8 h-8 rounded-full border-2 border-lime border-t-transparent animate-spin' />
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className='min-h-screen bg-forest'>
      <div className='max-w-4xl mx-auto px-4 md:px-8 py-12 animate-fade-in-up'>
        {/* Header */}
        <div className='mb-10'>
          <p className='text-xs font-bold tracking-[0.3em] uppercase text-gold mb-2'>My Account</p>
          <h1 className='font-display text-5xl md:text-6xl text-cream'>Profile</h1>
        </div>

        <div className='grid gap-6 md:grid-cols-3'>
          {/* Profile card */}
          <div className='md:col-span-1'>
            <div className='bg-canopy border border-smoke rounded-xl p-6'>
              <div className='flex items-center gap-4 mb-6'>
                <div className='w-14 h-14 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center flex-shrink-0'>
                  <User size={24} className='text-lime' />
                </div>
                <div className='min-w-0'>
                  <p className='text-cream font-semibold truncate'>{profile.displayName || 'No name set'}</p>
                  <p className='text-mist text-xs truncate'>{profile.email}</p>
                </div>
              </div>

              <dl className='space-y-3 text-sm mb-6'>
                <div>
                  <dt className='text-[10px] font-bold tracking-widest uppercase text-mist mb-1'>Display Name</dt>
                  <dd className='text-cream'>{profile.displayName || '—'}</dd>
                </div>
                <div>
                  <dt className='text-[10px] font-bold tracking-widest uppercase text-mist mb-1'>Email</dt>
                  <dd className='text-cream break-all'>{profile.email}</dd>
                </div>
                <div>
                  <dt className='text-[10px] font-bold tracking-widest uppercase text-mist mb-1'>Account Type</dt>
                  <dd>
                    <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full ${profile.role === 'admin' ? 'bg-gold/10 text-gold' : 'bg-smoke text-mist'}`}>
                      {profile.role}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className='text-[10px] font-bold tracking-widest uppercase text-mist mb-1'>Member Since</dt>
                  <dd className='text-cream'>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '—'}</dd>
                </div>
              </dl>

              <div className='space-y-2'>
                {profile.role === 'admin' && (
                  <Link
                    href='/admin'
                    className='flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-gold/10 border border-gold/30 text-gold text-sm font-medium hover:bg-gold/20 transition-colors'
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className='flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-grove border border-smoke text-mist text-sm font-medium hover:text-coral hover:border-coral/30 hover:bg-coral/10 transition-colors'
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Order history */}
          <div className='md:col-span-2'>
            <div className='bg-canopy border border-smoke rounded-xl overflow-hidden'>
              <div className='px-6 py-5 border-b border-smoke flex items-center gap-3'>
                <Package size={18} className='text-lime' />
                <h2 className='text-cream font-semibold'>Order History</h2>
                <span className='ml-auto text-xs text-mist'>
                  {orders.length} order{orders.length !== 1 ? 's' : ''}
                </span>
              </div>

              {ordersLoading ? (
                <div className='p-6 space-y-3'>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className='h-20 bg-smoke rounded-lg animate-pulse' />
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className='p-12 text-center'>
                  <Package size={32} className='text-mist mx-auto mb-3' />
                  <p className='text-mist text-sm mb-4'>You haven&apos;t placed any orders yet.</p>
                  <Link href='/shop' className='inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-lime text-forest text-sm font-bold tracking-wide hover:bg-lime/90 transition-colors'>
                    Shop Now
                    <ChevronRight size={14} />
                  </Link>
                </div>
              ) : (
                <ul className='divide-y divide-smoke'>
                  {orders.map((order) => (
                    <li key={order.id} className='px-6 py-5 hover:bg-grove transition-colors'>
                      <div className='flex items-start justify-between gap-4 mb-3'>
                        <div>
                          <p className='text-cream font-medium text-sm font-mono'>#{order.id.slice(-8).toUpperCase()}</p>
                          <p className='text-mist text-xs mt-0.5'>
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                          </p>
                        </div>
                        <div className='text-right flex-shrink-0'>
                          <p className='text-cream font-semibold text-sm'>{formatPrice(order.totalCents)}</p>
                          <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full mt-1 inline-block ${STATUS_STYLES[order.status] ?? 'bg-smoke text-mist'}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      {order.lineItems?.length > 0 && (
                        <ul className='space-y-1'>
                          {order.lineItems.slice(0, 3).map((item, i) => (
                            <li key={i} className='text-xs text-mist'>
                              {item.quantity}× {item.name}
                            </li>
                          ))}
                          {order.lineItems.length > 3 && (
                            <li className='text-xs text-mist'>
                              +{order.lineItems.length - 3} more item{order.lineItems.length - 3 !== 1 ? 's' : ''}
                            </li>
                          )}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
