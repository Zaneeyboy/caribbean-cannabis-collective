'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, doc, updateDoc, limit, startAfter, type QueryDocumentSnapshot, type QueryConstraint } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase-client';
import { formatPrice } from '@/lib/utils';
import { Search, ChevronRight, Package } from 'lucide-react';

interface Order {
  id: string;
  customer: { name: string; email: string };
  totalCents: number;
  status: string;
  shippingZone: string;
  createdAt: string;
  lineItems: { name: string; quantity: number }[];
}

const STATUSES = ['all', 'paid', 'processing', 'shipped', 'delivered', 'refunded'];
const PAGE_SIZE = 20;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const loadOrders = async (reset = true) => {
    setLoading(true);
    try {
      const db = getFirebaseDb();
      const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(PAGE_SIZE)];
      if (!reset && lastDoc) constraints.push(startAfter(lastDoc));

      const snap = await getDocs(query(collection(db, 'orders'), ...constraints));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Order);

      setOrders(reset ? data : (prev) => [...prev, ...data]);
      setLastDoc(snap.docs[snap.docs.length - 1] ?? null);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const db = getFirebaseDb();
    await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search || o.customer?.name?.toLowerCase().includes(search.toLowerCase()) || o.customer?.email?.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusColor = (s: string) =>
    ({
      paid: 'bg-lime/10 text-lime',
      processing: 'bg-gold/10 text-gold',
      shipped: 'bg-coral/10 text-coral',
      delivered: 'bg-lime/20 text-lime',
      refunded: 'bg-smoke text-mist',
    })[s] ?? 'bg-smoke text-mist';

  return (
    <div>
      <div className='mb-8'>
        <h1 className='font-display text-4xl text-cream'>Orders</h1>
        <p className='text-mist text-sm mt-1'>
          {filtered.length} order{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Filters */}
      <div className='flex flex-wrap gap-3 mb-6'>
        <div className='relative flex-1 min-w-48'>
          <Search size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-mist' />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search by name, email, order ID…'
            className='w-full pl-9 pr-4 py-2.5 rounded-lg bg-canopy border border-smoke text-cream text-sm focus:outline-none focus:border-lime transition-colors'
          />
        </div>
        <div className='flex gap-2 flex-wrap'>
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors ${
                statusFilter === s ? 'bg-lime text-forest' : 'bg-canopy border border-smoke text-mist hover:text-cream'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className='bg-canopy border border-smoke rounded-xl overflow-hidden'>
        {loading && orders.length === 0 ? (
          <div className='p-8 space-y-3'>
            {[...Array(6)].map((_, i) => (
              <div key={i} className='h-14 bg-smoke rounded animate-pulse' />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className='p-12 text-center'>
            <Package size={32} className='text-mist mx-auto mb-3' />
            <p className='text-mist text-sm'>No orders match your filters.</p>
          </div>
        ) : (
          <>
            <table className='w-full text-sm'>
              <thead className='border-b border-smoke'>
                <tr>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Zone', 'Status', 'Actions'].map((h) => (
                    <th key={h} className='px-5 py-3 text-left text-[10px] font-bold tracking-widest uppercase text-mist'>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-smoke'>
                {filtered.map((order) => (
                  <tr key={order.id} className='hover:bg-grove transition-colors'>
                    <td className='px-5 py-4'>
                      <span className='font-mono text-xs text-lime'>{order.id.slice(-8).toUpperCase()}</span>
                    </td>
                    <td className='px-5 py-4'>
                      <p className='text-cream font-medium text-sm'>{order.customer?.name || '—'}</p>
                      <p className='text-mist text-xs'>{order.customer?.email}</p>
                    </td>
                    <td className='px-5 py-4 text-mist text-xs'>
                      {order.lineItems?.length ?? 0} item{(order.lineItems?.length ?? 0) !== 1 ? 's' : ''}
                    </td>
                    <td className='px-5 py-4 text-gold font-medium'>{formatPrice(order.totalCents)}</td>
                    <td className='px-5 py-4'>
                      <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full ${order.shippingZone === 'US' ? 'bg-smoke text-ivory' : 'bg-grove text-lime'}`}>
                        {order.shippingZone}
                      </span>
                    </td>
                    <td className='px-5 py-4'>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full border-0 cursor-pointer ${statusColor(order.status)}`}
                      >
                        {['paid', 'processing', 'shipped', 'delivered', 'refunded'].map((s) => (
                          <option key={s} value={s} className='bg-forest text-cream text-xs normal-case tracking-normal font-normal'>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className='px-5 py-4'>
                      <Link href={`/admin/orders/${order.id}`} className='text-mist hover:text-lime transition-colors'>
                        <ChevronRight size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {hasMore && (
              <div className='p-4 text-center border-t border-smoke'>
                <button onClick={() => loadOrders(false)} disabled={loading} className='text-xs text-lime hover:underline disabled:opacity-50'>
                  {loading ? 'Loading…' : 'Load more'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
