'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, getDocs, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase-client';
import { cfImageUrl } from '@/lib/cloudflare-images';
import { formatPrice } from '@/lib/utils';
import { Plus, Pencil, Trash2, ImageOff } from 'lucide-react';
import { revalidateProductsCache } from '@/app/actions/products';

interface ProductDoc {
  id: string;
  name: string;
  category: string;
  priceCents: number;
  salePriceCents?: number;
  images: string[];
  variants: { inventory: number }[];
  featured?: boolean;
  active: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const db = getFirebaseDb();
      const snap = await getDocs(query(collection(db, 'products'), orderBy('name')));
      setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ProductDoc));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const db = getFirebaseDb();
      await deleteDoc(doc(db, 'products', id));
      // Bust the product cache so the shop reflects the deletion immediately
      await revalidateProductsCache();
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const totalInventory = (variants: { inventory: number }[]) => variants?.reduce((s, v) => s + (v.inventory ?? 0), 0) ?? 0;

  return (
    <div>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='font-display text-4xl text-cream'>Products</h1>
          <p className='text-mist text-sm mt-1'>
            {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link href='/admin/products/new' className='flex items-center gap-2 px-4 py-2.5 bg-lime text-forest text-sm font-bold tracking-widest uppercase rounded-lg hover:bg-lime/90 transition-colors'>
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <div className='bg-canopy border border-smoke rounded-xl overflow-hidden'>
        {loading ? (
          <div className='p-8 space-y-4'>
            {[...Array(5)].map((_, i) => (
              <div key={i} className='h-16 bg-smoke rounded animate-pulse' />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className='p-12 text-center'>
            <p className='text-mist text-sm mb-4'>No products yet.</p>
            <Link href='/admin/products/new' className='inline-flex items-center gap-2 px-4 py-2 bg-lime text-forest text-sm font-bold rounded-lg hover:bg-lime/90 transition-colors'>
              <Plus size={14} />
              Add your first product
            </Link>
          </div>
        ) : (
          <table className='w-full text-sm'>
            <thead className='border-b border-smoke'>
              <tr>
                {['Product', 'Category', 'Price', 'Inventory', 'Status', 'Actions'].map((h) => (
                  <th key={h} className='px-5 py-3 text-left text-[10px] font-bold tracking-widest uppercase text-mist'>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className='divide-y divide-smoke'>
              {products.map((p) => {
                const imgSrc = p.images?.[0] ? cfImageUrl(p.images[0], 'admin') : null;
                const inv = totalInventory(p.variants);
                return (
                  <tr key={p.id} className='hover:bg-grove transition-colors'>
                    {/* Product */}
                    <td className='px-5 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-md bg-smoke overflow-hidden flex-shrink-0 flex items-center justify-center'>
                          {imgSrc ? <Image src={imgSrc} alt={p.name} width={40} height={40} className='object-cover w-full h-full' /> : <ImageOff size={14} className='text-mist' />}
                        </div>
                        <p className='font-medium text-cream'>{p.name}</p>
                      </div>
                    </td>
                    {/* Category */}
                    <td className='px-5 py-4 text-mist capitalize'>{p.category}</td>
                    {/* Price */}
                    <td className='px-5 py-4 text-cream'>
                      {p.salePriceCents ? (
                        <span>
                          <span className='text-coral'>{formatPrice(p.salePriceCents)}</span> <span className='line-through text-mist text-xs'>{formatPrice(p.priceCents)}</span>
                        </span>
                      ) : (
                        formatPrice(p.priceCents)
                      )}
                    </td>
                    {/* Inventory */}
                    <td className='px-5 py-4'>
                      <span className={`text-xs font-bold ${inv === 0 ? 'text-coral' : inv < 5 ? 'text-gold' : 'text-lime'}`}>{inv} units</span>
                    </td>
                    {/* Status */}
                    <td className='px-5 py-4'>
                      <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-full ${p.active ? 'bg-lime/10 text-lime' : 'bg-smoke text-mist'}`}>
                        {p.active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className='px-5 py-4'>
                      <div className='flex items-center gap-2'>
                        <Link href={`/admin/products/${p.id}/edit`} className='p-1.5 rounded text-mist hover:text-lime hover:bg-lime/10 transition-colors' title='Edit'>
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          disabled={deleting === p.id}
                          className='p-1.5 rounded text-mist hover:text-coral hover:bg-coral/10 transition-colors disabled:opacity-50'
                          title='Delete'
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
