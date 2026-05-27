'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb, getFirebaseAuth } from '@/lib/firebase-client';
import { cfImageUrl } from '@/lib/cloudflare-images';
import { slugify } from '@/lib/utils';
import { Plus, X, Upload, Loader2 } from 'lucide-react';
import { revalidateProductsCache } from '@/app/actions/products';

export interface VariantInput {
  id: string;
  size?: string;
  color?: string;
  colorHex?: string;
  sku?: string;
  inventory: number;
}

export interface ProductInput {
  id?: string; // present when editing
  name: string;
  slug: string;
  category: string;
  description: string;
  priceCents: number;
  salePriceCents?: number;
  images: string[]; // Cloudflare image IDs or placeholder URLs
  variants: VariantInput[];
  featured: boolean;
  active: boolean;
  tags: string[];
}

const CATEGORIES = ['apparel', 'headwear', 'drinkware', 'accessories'];

interface Props {
  initialData?: Partial<ProductInput>;
}

export default function ProductForm({ initialData }: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProductInput>({
    name: '',
    slug: '',
    category: 'apparel',
    description: '',
    priceCents: 0,
    salePriceCents: undefined,
    images: [],
    variants: [],
    featured: false,
    active: true,
    tags: [],
    ...initialData,
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [tagInput, setTagInput] = useState('');

  const isEditing = !!initialData?.id;

  // ── Field helpers ────────────────────────────────────────────────
  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: isEditing ? prev.slug : slugify(name),
    }));
  };

  // ── Image upload ─────────────────────────────────────────────────
  const MAX_IMAGES = 3;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const remaining = MAX_IMAGES - form.images.length;
    if (remaining <= 0) {
      setError(`Maximum ${MAX_IMAGES} images per product.`);
      return;
    }
    const toUpload = files.slice(0, remaining);

    setUploading(true);
    setError('');
    try {
      const auth = getFirebaseAuth();
      const idToken = await auth.currentUser?.getIdToken();
      if (!idToken) throw new Error('Not authenticated');

      for (const file of toUpload) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', 'ccc/products');
        const res = await fetch('/api/admin/upload-image', {
          method: 'POST',
          headers: { Authorization: `Bearer ${idToken}` },
          body: fd,
        });
        if (!res.ok) throw new Error(await res.text());
        const { imageId } = (await res.json()) as { imageId: string };
        setForm((prev) => ({ ...prev, images: [...prev.images, imageId] }));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (idx: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  // ── Variants ─────────────────────────────────────────────────────
  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { id: crypto.randomUUID(), inventory: 10 }],
    }));
  };

  const updateVariant = (idx: number, patch: Partial<VariantInput>) => {
    setForm((prev) => {
      const variants = [...prev.variants];
      variants[idx] = { ...variants[idx], ...patch };
      return { ...prev, variants };
    });
  };

  const removeVariant = (idx: number) => {
    setForm((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== idx) }));
  };

  // ── Tags ─────────────────────────────────────────────────────────
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag)) {
      set('tags', [...form.tags, tag]);
    }
    setTagInput('');
  };

  // ── Save ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name) {
      setError('Product name is required.');
      return;
    }
    if (!form.slug) {
      setError('Slug is required.');
      return;
    }
    if (form.priceCents <= 0) {
      setError('Price must be greater than 0.');
      return;
    }
    if (form.variants.length === 0) {
      setError('Add at least one variant.');
      return;
    }

    setSaving(true);
    try {
      const db = getFirebaseDb();
      const data = {
        ...form,
        updatedAt: serverTimestamp(),
        ...(isEditing ? {} : { createdAt: serverTimestamp() }),
      };

      if (isEditing && initialData?.id) {
        await setDoc(doc(db, 'products', initialData.id), data, { merge: true });
      } else {
        await addDoc(collection(db, 'products'), data);
      }

      // Bust the product cache so the shop reflects changes immediately
      await revalidateProductsCache();

      router.push('/admin/products');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-8 max-w-3xl'>
      {error && <p className='text-xs text-coral bg-coral/10 border border-coral/20 rounded-lg px-4 py-3'>{error}</p>}

      {/* Basic info */}
      <section className='bg-canopy border border-smoke rounded-xl p-6 space-y-5'>
        <h2 className='text-sm font-bold text-cream tracking-wide'>Basic Information</h2>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div>
            <label className='block text-xs font-bold tracking-widest uppercase text-gold mb-1.5'>Product Name *</label>
            <input
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className='w-full px-3 py-2.5 rounded-lg bg-grove border border-smoke text-cream text-sm focus:outline-none focus:border-lime transition-colors'
              placeholder='e.g. Farmers Helping Farmers Tee'
            />
          </div>
          <div>
            <label className='block text-xs font-bold tracking-widest uppercase text-gold mb-1.5'>Slug *</label>
            <input
              value={form.slug}
              onChange={(e) => set('slug', e.target.value)}
              required
              className='w-full px-3 py-2.5 rounded-lg bg-grove border border-smoke text-cream text-sm font-mono focus:outline-none focus:border-lime transition-colors'
              placeholder='auto-generated-from-name'
            />
          </div>
        </div>

        <div>
          <label className='block text-xs font-bold tracking-widest uppercase text-gold mb-1.5'>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={4}
            className='w-full px-3 py-2.5 rounded-lg bg-grove border border-smoke text-cream text-sm focus:outline-none focus:border-lime transition-colors resize-none'
            placeholder='Describe the product...'
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
          <div>
            <label className='block text-xs font-bold tracking-widest uppercase text-gold mb-1.5'>Category *</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className='w-full px-3 py-2.5 rounded-lg bg-grove border border-smoke text-cream text-sm focus:outline-none focus:border-lime transition-colors'
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-xs font-bold tracking-widest uppercase text-gold mb-1.5'>Price (USD) *</label>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-mist text-sm'>$</span>
              <input
                type='number'
                min='0'
                step='0.01'
                value={(form.priceCents / 100).toFixed(2)}
                onChange={(e) => set('priceCents', Math.round(parseFloat(e.target.value || '0') * 100))}
                className='w-full pl-7 pr-3 py-2.5 rounded-lg bg-grove border border-smoke text-cream text-sm focus:outline-none focus:border-lime transition-colors'
                placeholder='0.00'
              />
            </div>
          </div>
          <div>
            <label className='block text-xs font-bold tracking-widest uppercase text-gold mb-1.5'>Sale Price (optional)</label>
            <div className='relative'>
              <span className='absolute left-3 top-1/2 -translate-y-1/2 text-mist text-sm'>$</span>
              <input
                type='number'
                min='0'
                step='0.01'
                value={form.salePriceCents ? (form.salePriceCents / 100).toFixed(2) : ''}
                onChange={(e) => set('salePriceCents', e.target.value ? Math.round(parseFloat(e.target.value) * 100) : undefined)}
                className='w-full pl-7 pr-3 py-2.5 rounded-lg bg-grove border border-smoke text-cream text-sm focus:outline-none focus:border-lime transition-colors'
                placeholder='Leave blank to disable'
              />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className='flex gap-6'>
          {[
            { key: 'active' as const, label: 'Active (visible in store)' },
            { key: 'featured' as const, label: 'Featured on homepage' },
          ].map(({ key, label }) => (
            <label key={key} className='flex items-center gap-2 cursor-pointer'>
              <button
                type='button'
                role='switch'
                aria-checked={form[key] as boolean}
                onClick={() => set(key, !form[key])}
                className={`w-9 h-5 rounded-full transition-colors ${(form[key] as boolean) ? 'bg-lime' : 'bg-smoke'} relative`}
              >
                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-forest transition-transform ${(form[key] as boolean) ? 'translate-x-4' : ''}`} />
              </button>
              <span className='text-xs text-mist'>{label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Images */}
      <section className='bg-canopy border border-smoke rounded-xl p-6 space-y-4'>
        <h2 className='text-sm font-bold text-cream tracking-wide'>Images</h2>
        <p className='text-xs text-mist'>Uploads go directly to Cloudflare Images. First image is the primary product image.</p>

        <div className='grid grid-cols-3 sm:grid-cols-5 gap-3'>
          {form.images.map((imgId, i) => {
            const url = cfImageUrl(imgId, 'thumbnail');
            return (
              <div key={i} className='relative aspect-square rounded-lg overflow-hidden bg-smoke group'>
                <Image src={url} alt={`Product image ${i + 1}`} fill className='object-cover' />
                <button
                  type='button'
                  onClick={() => removeImage(i)}
                  className='absolute top-1 right-1 w-5 h-5 bg-coral rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                >
                  <X size={10} className='text-cream' />
                </button>
                {i === 0 && <span className='absolute bottom-1 left-1 text-[8px] bg-lime text-forest font-bold px-1 rounded'>MAIN</span>}
              </div>
            );
          })}

          {/* Upload button — hidden when at max */}
          {form.images.length < MAX_IMAGES && (
            <button
              type='button'
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className='aspect-square rounded-lg border-2 border-dashed border-smoke hover:border-lime text-mist hover:text-lime transition-colors flex flex-col items-center justify-center gap-1 disabled:opacity-50'
            >
              {uploading ? <Loader2 size={18} className='animate-spin' /> : <Upload size={18} />}
              <span className='text-[10px]'>{uploading ? 'Uploading…' : 'Add'}</span>
            </button>
          )}
        </div>
        <p className='text-[10px] text-mist mt-1'>
          {form.images.length}/{MAX_IMAGES} images — first image is the main display image.
        </p>

        <input ref={fileInputRef} type='file' accept='image/*' multiple className='hidden' onChange={handleFileChange} />
      </section>

      {/* Variants */}
      <section className='bg-canopy border border-smoke rounded-xl p-6 space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-sm font-bold text-cream tracking-wide'>Variants</h2>
          <button type='button' onClick={addVariant} className='flex items-center gap-1.5 text-xs text-lime hover:underline'>
            <Plus size={14} />
            Add Variant
          </button>
        </div>

        {form.variants.length === 0 ? (
          <p className='text-xs text-mist italic'>No variants. Add at least one (e.g. size S, colour Black).</p>
        ) : (
          <div className='space-y-3'>
            {/* Header */}
            <div className='grid grid-cols-6 gap-2 text-[10px] font-bold tracking-widest uppercase text-mist'>
              <span>Size</span>
              <span>Colour</span>
              <span>Hex</span>
              <span>SKU</span>
              <span>Inventory</span>
              <span />
            </div>
            {form.variants.map((v, i) => (
              <div key={v.id} className='grid grid-cols-6 gap-2 items-center'>
                <input
                  value={v.size ?? ''}
                  onChange={(e) => updateVariant(i, { size: e.target.value })}
                  placeholder='e.g. M'
                  className='px-2 py-1.5 rounded bg-grove border border-smoke text-cream text-xs focus:outline-none focus:border-lime'
                />
                <input
                  value={v.color ?? ''}
                  onChange={(e) => updateVariant(i, { color: e.target.value })}
                  placeholder='Black'
                  className='px-2 py-1.5 rounded bg-grove border border-smoke text-cream text-xs focus:outline-none focus:border-lime'
                />
                <input
                  value={v.colorHex ?? ''}
                  onChange={(e) => updateVariant(i, { colorHex: e.target.value })}
                  placeholder='#000'
                  className='px-2 py-1.5 rounded bg-grove border border-smoke text-cream text-xs font-mono focus:outline-none focus:border-lime'
                />
                <input
                  value={v.sku ?? ''}
                  onChange={(e) => updateVariant(i, { sku: e.target.value })}
                  placeholder='SKU-001'
                  className='px-2 py-1.5 rounded bg-grove border border-smoke text-cream text-xs font-mono focus:outline-none focus:border-lime'
                />
                <input
                  type='number'
                  min='0'
                  value={v.inventory}
                  onChange={(e) => updateVariant(i, { inventory: parseInt(e.target.value) || 0 })}
                  className='px-2 py-1.5 rounded bg-grove border border-smoke text-cream text-xs focus:outline-none focus:border-lime'
                />
                <button type='button' onClick={() => removeVariant(i)} className='p-1 text-mist hover:text-coral transition-colors justify-self-center'>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tags */}
      <section className='bg-canopy border border-smoke rounded-xl p-6 space-y-4'>
        <h2 className='text-sm font-bold text-cream tracking-wide'>Tags</h2>
        <div className='flex gap-2'>
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder='Enter a tag and press Enter'
            className='flex-1 px-3 py-2 rounded-lg bg-grove border border-smoke text-cream text-sm focus:outline-none focus:border-lime transition-colors'
          />
          <button type='button' onClick={addTag} className='px-3 py-2 bg-grove border border-smoke rounded-lg text-mist hover:text-lime hover:border-lime transition-colors'>
            <Plus size={14} />
          </button>
        </div>
        {form.tags.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {form.tags.map((tag) => (
              <span key={tag} className='flex items-center gap-1 px-2.5 py-1 rounded-full bg-smoke text-xs text-mist'>
                {tag}
                <button
                  type='button'
                  onClick={() =>
                    set(
                      'tags',
                      form.tags.filter((t) => t !== tag),
                    )
                  }
                >
                  <X size={10} />
                </button>
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Actions */}
      <div className='flex gap-4'>
        <button
          type='submit'
          disabled={saving}
          className='flex items-center gap-2 px-6 py-3 bg-lime text-forest font-bold text-sm tracking-widest uppercase rounded-lg hover:bg-lime/90 disabled:opacity-50 transition-colors'
        >
          {saving && <Loader2 size={14} className='animate-spin' />}
          {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Product'}
        </button>
        <button type='button' onClick={() => router.back()} className='px-6 py-3 border border-smoke text-mist text-sm font-medium rounded-lg hover:border-ivory hover:text-ivory transition-colors'>
          Cancel
        </button>
      </div>
    </form>
  );
}
