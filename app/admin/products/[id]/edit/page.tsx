'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase-client';
import ProductForm, { type ProductInput } from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: Props) {
  const [product, setProduct] = useState<ProductInput | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { id } = await params;
      try {
        const db = getFirebaseDb();
        const snap = await getDoc(doc(db, 'products', id));
        if (!snap.exists()) {
          setNotFoundError(true);
          return;
        }
        setProduct({ id: snap.id, ...snap.data() } as ProductInput);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params]);

  if (notFoundError) notFound();

  return (
    <div>
      <div className='mb-8'>
        <h1 className='font-display text-4xl text-cream'>Edit Product</h1>
        <p className='text-mist text-sm mt-1'>{product?.name ?? 'Loading…'}</p>
      </div>
      {loading ? (
        <div className='space-y-4'>
          {[...Array(4)].map((_, i) => (
            <div key={i} className='h-32 bg-smoke rounded-xl animate-pulse' />
          ))}
        </div>
      ) : product ? (
        <ProductForm initialData={product} />
      ) : null}
    </div>
  );
}
