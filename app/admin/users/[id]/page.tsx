'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, getDocs, collection, query, where, orderBy, updateDoc } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase-client';
import { type UserProfile, type UserRole } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, User, Package, ShieldCheck, UserX } from 'lucide-react';

interface Order {
  id: string;
  totalCents: number;
  status: string;
  createdAt: string;
  lineItems: { name: string; quantity: number }[];
}

const STATUS_STYLES: Record<string, string> = {
  paid: 'bg-lime/10 text-lime',
  processing: 'bg-gold/10 text-gold',
  shipped: 'bg-coral/10 text-coral',
  delivered: 'bg-lime/20 text-lime',
  refunded: 'bg-smoke text-mist',
};

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      try {
        const db = getFirebaseDb();
        const snap = await getDoc(doc(db, 'users', id as string));
        if (!snap.exists()) {
          setNotFound(true);
        } else {
          setUser({ uid: snap.id, ...snap.data() } as UserProfile);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    if (!user?.email) return;
    const fetchOrders = async () => {
      try {
        const db = getFirebaseDb();
        const snap = await getDocs(query(collection(db, 'orders'), where('customer.email', '==', user.email), orderBy('createdAt', 'desc')));
        setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order));
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [user?.email]);

  const setRole = async (role: UserRole) => {
    if (!user || saving) return;
    setSaving(true);
    try {
      const db = getFirebaseDb();
      await updateDoc(doc(db, 'users', id as string), { role });
      setUser((prev) => (prev ? { ...prev, role } : prev));
      setActionMsg(`Role updated to "${role}".`);
      setTimeout(() => setActionMsg(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center py-24'>
        <div className='w-8 h-8 rounded-full border-2 border-lime border-t-transparent animate-spin' />
      </div>
    );
  }

  if (notFound || !user) {
    return (
      <div className='text-center py-24'>
        <User size={40} className='text-mist mx-auto mb-4' />
        <p className='text-cream text-lg font-semibold mb-2'>User not found</p>
        <Link href='/admin/users' className='text-lime text-sm hover:underline'>
          ← Back to users
        </Link>
      </div>
    );
  }

  const totalSpend = orders.reduce((s, o) => s + (o.totalCents ?? 0), 0);

  return (
    <div>
      {/* Back link + header */}
      <div className='mb-8'>
        <Link href='/admin/users' className='inline-flex items-center gap-1.5 text-mist hover:text-cream text-sm transition-colors mb-5'>
          <ArrowLeft size={14} />
          All Users
        </Link>
        <div className='flex flex-wrap items-start gap-4'>
          <div className='flex items-center gap-4'>
            <div className='w-14 h-14 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center flex-shrink-0'>
              <span className='text-lime text-xl font-bold'>{user.displayName?.[0]?.toUpperCase() ?? '?'}</span>
            </div>
            <div>
              <h1 className='font-display text-4xl text-cream leading-none'>{user.displayName || 'Unnamed User'}</h1>
              <p className='text-mist text-sm mt-1'>{user.email}</p>
            </div>
          </div>
          <span
            className={`ml-auto mt-1 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full ${user.role === 'admin' ? 'bg-gold/10 text-gold border border-gold/20' : 'bg-smoke text-mist border border-smoke'}`}
          >
            {user.role}
          </span>
        </div>
      </div>

      {actionMsg && <p className='mb-6 text-xs text-lime bg-lime/10 border border-lime/20 rounded-lg px-4 py-3'>{actionMsg}</p>}

      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Left — profile info + actions */}
        <div className='space-y-6'>
          {/* Profile */}
          <div className='bg-canopy border border-smoke rounded-xl overflow-hidden'>
            <div className='px-6 py-4 border-b border-smoke'>
              <h2 className='text-cream font-semibold text-sm'>Profile</h2>
            </div>
            <dl className='px-6 py-4 space-y-4 text-sm'>
              <div>
                <dt className='text-[10px] font-bold tracking-widest uppercase text-mist mb-1'>UID</dt>
                <dd className='font-mono text-xs text-mist break-all'>{user.uid}</dd>
              </div>
              <div>
                <dt className='text-[10px] font-bold tracking-widest uppercase text-mist mb-1'>Display Name</dt>
                <dd className='text-cream'>{user.displayName || '—'}</dd>
              </div>
              <div>
                <dt className='text-[10px] font-bold tracking-widest uppercase text-mist mb-1'>Email</dt>
                <dd className='text-cream break-all'>{user.email}</dd>
              </div>
              <div>
                <dt className='text-[10px] font-bold tracking-widest uppercase text-mist mb-1'>Role</dt>
                <dd>
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-gold/10 text-gold' : 'bg-smoke text-mist'}`}>{user.role}</span>
                </dd>
              </div>
              <div>
                <dt className='text-[10px] font-bold tracking-widest uppercase text-mist mb-1'>Joined</dt>
                <dd className='text-cream'>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</dd>
              </div>
              <div>
                <dt className='text-[10px] font-bold tracking-widest uppercase text-mist mb-1'>Total Spend</dt>
                <dd className='text-gold font-semibold'>{formatPrice(totalSpend)}</dd>
              </div>
              <div>
                <dt className='text-[10px] font-bold tracking-widest uppercase text-mist mb-1'>Orders</dt>
                <dd className='text-cream'>{orders.length}</dd>
              </div>
            </dl>
          </div>

          {/* Role actions */}
          <div className='bg-canopy border border-smoke rounded-xl overflow-hidden'>
            <div className='px-6 py-4 border-b border-smoke'>
              <h2 className='text-cream font-semibold text-sm'>Role Management</h2>
            </div>
            <div className='px-6 py-4 space-y-3'>
              {user.role !== 'admin' ? (
                <button
                  onClick={() => setRole('admin')}
                  disabled={saving}
                  className='flex items-center gap-2 w-full px-4 py-2.5 rounded-lg bg-gold/10 border border-gold/30 text-gold text-sm font-medium hover:bg-gold/20 transition-colors disabled:opacity-50'
                >
                  <ShieldCheck size={15} />
                  Promote to Admin
                </button>
              ) : (
                <button
                  onClick={() => setRole('customer')}
                  disabled={saving}
                  className='flex items-center gap-2 w-full px-4 py-2.5 rounded-lg bg-coral/10 border border-coral/30 text-coral text-sm font-medium hover:bg-coral/20 transition-colors disabled:opacity-50'
                >
                  <UserX size={15} />
                  Demote to Customer
                </button>
              )}
              <p className='text-[10px] text-mist leading-relaxed'>Role changes take effect immediately. The user will need to reload the page to see updated permissions.</p>
            </div>
          </div>
        </div>

        {/* Right — order history */}
        <div className='lg:col-span-2'>
          <div className='bg-canopy border border-smoke rounded-xl overflow-hidden'>
            <div className='px-6 py-4 border-b border-smoke flex items-center gap-2'>
              <Package size={16} className='text-lime' />
              <h2 className='text-cream font-semibold text-sm'>Order History</h2>
              <span className='ml-auto text-xs text-mist'>
                {orders.length} order{orders.length !== 1 ? 's' : ''}
              </span>
            </div>

            {ordersLoading ? (
              <div className='p-6 space-y-3'>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className='h-16 bg-smoke rounded-lg animate-pulse' />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className='p-12 text-center'>
                <Package size={32} className='text-mist mx-auto mb-3' />
                <p className='text-mist text-sm'>No orders found for this user.</p>
              </div>
            ) : (
              <table className='w-full text-sm'>
                <thead className='border-b border-smoke'>
                  <tr>
                    {['Order ID', 'Date', 'Items', 'Total', 'Status', ''].map((h) => (
                      <th key={h} className='px-5 py-3 text-left text-[10px] font-bold tracking-widest uppercase text-mist last:w-10'>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='divide-y divide-smoke'>
                  {orders.map((order) => (
                    <tr key={order.id} className='hover:bg-grove transition-colors'>
                      <td className='px-5 py-4'>
                        <span className='font-mono text-xs text-lime'>#{order.id.slice(-8).toUpperCase()}</span>
                      </td>
                      <td className='px-5 py-4 text-mist text-xs'>
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </td>
                      <td className='px-5 py-4 text-mist text-xs'>
                        {order.lineItems?.length ?? 0} item{(order.lineItems?.length ?? 0) !== 1 ? 's' : ''}
                      </td>
                      <td className='px-5 py-4 text-gold font-medium'>{formatPrice(order.totalCents)}</td>
                      <td className='px-5 py-4'>
                        <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full ${STATUS_STYLES[order.status] ?? 'bg-smoke text-mist'}`}>{order.status}</span>
                      </td>
                      <td className='px-5 py-4'>
                        <Link href={`/admin/orders/${order.id}`} className='text-mist hover:text-lime text-xs transition-colors'>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
