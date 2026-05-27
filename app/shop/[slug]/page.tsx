import { getProductBySlug } from '@/lib/products-server';
import { notFound } from 'next/navigation';
import ProductDetail from './_client';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
