'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, getDoc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase-client';
import { formatPrice } from '@/lib/utils';
import { ArrowLeft, Package, MapPin, User, Clock, ChevronDown } from 'lucide-react';

interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
}

interface LineItem {
  name: string;
  quantity: number;
  amountTotal: number;
  priceCents?: number;
}

interface StatusEvent {
  status: string;
  timestamp: string;
  note?: string;
}

interface Order {
  id: string;
  stripeSessionId: string;
  status: string;
  paymentStatus: string;
  customer: { name: string; email: string };
  shippingAddress: ShippingAddress | null;
  shippingZone: string;
  shippingOptionId?: string;
  lineItems: LineItem[];
  subtotalCents: number;
  totalCents: number;
  currency: string;
  createdAt: string;
  statusHistory?: StatusEvent[];
}

const ORDER_STATUSES = ['paid', 'processing', 'shipped', 'delivered', 'refunded'];

const STATUS_STYLES: Record<string, string> = {
  paid: 'bg-lime/10 text-lime border-lime/20',
  processing: 'bg-gold/10 text-gold border-gold/20',
  shipped: 'bg-coral/10 text-coral border-coral/20',
  delivered: 'bg-lime/20 text-lime border-lime/30',
  refunded: 'bg-smoke text-mist border-smoke',
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const db = getFirebaseDb();
        const snap = await getDoc(doc(db, 'orders', id as string));
        if (!snap.exists()) {
          setNotFound(true);
        } else {
          setOrder({ id: snap.id, ...snap.data() } as Order);
        }
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order || newStatus === order.status) return;
    setSaving(true);
    try {
      const db = getFirebaseDb();
      const historyEntry: StatusEvent = { status: newStatus, timestamp: new Date().toISOString() };
      await updateDoc(doc(db, 'orders', id as string), {
        status: newStatus,
        statusHistory: arrayUnion(historyEntry),
      });
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              statusHistory: [...(prev.statusHistory ?? []), historyEntry],
            }
          : prev,
      );
      setSaveMsg(`Status updated to "${newStatus}"`);
      setTimeout(() => setSaveMsg(''), 3000);
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

  if (notFound || !order) {
    return (
      <div className='text-center py-24'>
        <Package size={40} className='text-mist mx-auto mb-4' />
        <p className='text-cream text-lg font-semibold mb-2'>Order not found</p>
        <Link href='/admin/orders' className='text-lime text-sm hover:underline'>
          ← Back to orders
        </Link>
      </div>
    );
  }

  const subtotal = order.subtotalCents ?? order.lineItems.reduce((s, li) => s + li.amountTotal, 0);
  const shipping = order.totalCents - subtotal;

  return (
    <div>
      {/* Back link + header */}
      <div className='mb-8'>
        <Link href='/admin/orders' className='inline-flex items-center gap-1.5 text-mist hover:text-cream text-sm transition-colors mb-5'>
          <ArrowLeft size={14} />
          All Orders
        </Link>
        <div className='flex flex-wrap items-center gap-4'>
          <div>
            <h1 className='font-display text-4xl text-cream'>Order Detail</h1>
            <p className='font-mono text-sm text-lime mt-1'>#{order.id.slice(-12).toUpperCase()}</p>
          </div>
          <div className='ml-auto flex items-center gap-3'>
            {saveMsg && <span className='text-xs text-lime'>{saveMsg}</span>}
            <div className='relative'>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={saving}
                className={`appearance-none pr-8 pl-3 py-2 rounded-lg text-xs font-bold tracking-widest uppercase border cursor-pointer focus:outline-none focus:ring-1 focus:ring-lime disabled:opacity-60 ${STATUS_STYLES[order.status] ?? 'bg-smoke text-mist border-smoke'}`}
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s} className='bg-forest text-cream text-xs normal-case tracking-normal font-normal'>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown size={12} className='absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60' />
            </div>
          </div>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Left column — line items + totals */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Line items */}
          <div className='bg-canopy border border-smoke rounded-xl overflow-hidden'>
            <div className='px-6 py-4 border-b border-smoke flex items-center gap-2'>
              <Package size={16} className='text-lime' />
              <h2 className='text-cream font-semibold text-sm'>Line Items</h2>
            </div>
            <table className='w-full text-sm'>
              <thead className='border-b border-smoke'>
                <tr>
                  {['Product', 'Qty', 'Unit', 'Total'].map((h) => (
                    <th key={h} className='px-6 py-3 text-left text-[10px] font-bold tracking-widest uppercase text-mist last:text-right'>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className='divide-y divide-smoke'>
                {order.lineItems.map((item, i) => {
                  const unit = item.priceCents ?? (item.quantity > 0 ? Math.round(item.amountTotal / item.quantity) : item.amountTotal);
                  return (
                    <tr key={i}>
                      <td className='px-6 py-4 text-cream'>{item.name}</td>
                      <td className='px-6 py-4 text-mist'>{item.quantity}</td>
                      <td className='px-6 py-4 text-mist'>{formatPrice(unit)}</td>
                      <td className='px-6 py-4 text-cream text-right'>{formatPrice(item.amountTotal)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Totals */}
            <div className='px-6 py-4 border-t border-smoke space-y-2'>
              <div className='flex justify-between text-sm text-mist'>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {shipping > 0 && (
                <div className='flex justify-between text-sm text-mist'>
                  <span>Shipping</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
              )}
              <div className='flex justify-between text-sm font-semibold text-cream border-t border-smoke pt-2'>
                <span>Total</span>
                <span className='text-gold'>{formatPrice(order.totalCents)}</span>
              </div>
            </div>
          </div>

          {/* Status history */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className='bg-canopy border border-smoke rounded-xl overflow-hidden'>
              <div className='px-6 py-4 border-b border-smoke flex items-center gap-2'>
                <Clock size={16} className='text-lime' />
                <h2 className='text-cream font-semibold text-sm'>Status History</h2>
              </div>
              <ul className='divide-y divide-smoke'>
                {[...order.statusHistory].reverse().map((event, i) => (
                  <li key={i} className='px-6 py-4 flex items-center gap-4'>
                    <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full border ${STATUS_STYLES[event.status] ?? 'bg-smoke text-mist border-smoke'}`}>
                      {event.status}
                    </span>
                    <span className='text-mist text-xs'>{new Date(event.timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    {event.note && <span className='text-mist text-xs italic'>{event.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right column — customer + shipping */}
        <div className='space-y-6'>
          {/* Customer */}
          <div className='bg-canopy border border-smoke rounded-xl overflow-hidden'>
            <div className='px-6 py-4 border-b border-smoke flex items-center gap-2'>
              <User size={16} className='text-lime' />
              <h2 className='text-cream font-semibold text-sm'>Customer</h2>
            </div>
            <div className='px-6 py-4 space-y-3 text-sm'>
              <div>
                <p className='text-[10px] font-bold tracking-widest uppercase text-mist mb-1'>Name</p>
                <p className='text-cream'>{order.customer?.name || '—'}</p>
              </div>
              <div>
                <p className='text-[10px] font-bold tracking-widest uppercase text-mist mb-1'>Email</p>
                <a href={`mailto:${order.customer?.email}`} className='text-lime hover:underline break-all'>
                  {order.customer?.email || '—'}
                </a>
              </div>
              <div>
                <p className='text-[10px] font-bold tracking-widest uppercase text-mist mb-1'>Payment</p>
                <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full ${order.paymentStatus === 'paid' ? 'bg-lime/10 text-lime' : 'bg-smoke text-mist'}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div>
                <p className='text-[10px] font-bold tracking-widest uppercase text-mist mb-1'>Ordered</p>
                <p className='text-cream'>{order.createdAt ? new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}</p>
              </div>
              {order.stripeSessionId && (
                <div>
                  <p className='text-[10px] font-bold tracking-widest uppercase text-mist mb-1'>Stripe Session</p>
                  <p className='font-mono text-xs text-mist break-all'>{order.stripeSessionId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Shipping address */}
          <div className='bg-canopy border border-smoke rounded-xl overflow-hidden'>
            <div className='px-6 py-4 border-b border-smoke flex items-center gap-2'>
              <MapPin size={16} className='text-lime' />
              <h2 className='text-cream font-semibold text-sm'>Shipping</h2>
              <span className={`ml-auto text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${order.shippingZone === 'US' ? 'bg-smoke text-ivory' : 'bg-grove text-lime'}`}>
                {order.shippingZone}
              </span>
            </div>
            <div className='px-6 py-4 text-sm text-cream'>
              {order.shippingAddress ? (
                <address className='not-italic space-y-1'>
                  <p>{order.shippingAddress.line1}</p>
                  {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                  <p>
                    {[order.shippingAddress.city, order.shippingAddress.state].filter(Boolean).join(', ')}
                    {order.shippingAddress.postalCode ? ` ${order.shippingAddress.postalCode}` : ''}
                  </p>
                  <p className='text-mist'>{order.shippingAddress.country}</p>
                </address>
              ) : (
                <p className='text-mist text-xs'>No shipping address recorded.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
