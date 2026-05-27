'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase-client';
import { Settings, Save } from 'lucide-react';

interface StoreConfig {
  storeName: string;
  contactEmail: string;
  freeShippingThresholdCents: number;
}

const DEFAULTS: StoreConfig = {
  storeName: 'Caribbean Cannabis Collective',
  contactEmail: '',
  freeShippingThresholdCents: 10000,
};

export default function AdminSettingsPage() {
  const [config, setConfig] = useState<StoreConfig>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const db = getFirebaseDb();
        const snap = await getDoc(doc(db, 'config', 'store'));
        if (snap.exists()) {
          setConfig({ ...DEFAULTS, ...(snap.data() as Partial<StoreConfig>) });
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const db = getFirebaseDb();
      await setDoc(doc(db, 'config', 'store'), config, { merge: true });
      setSaveMsg('Settings saved.');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch {
      setError('Failed to save settings. Check your permissions.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = <K extends keyof StoreConfig>(key: K, value: StoreConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div>
      <div className='mb-8 flex items-center gap-3'>
        <Settings size={24} className='text-lime' />
        <div>
          <h1 className='font-display text-4xl text-cream'>Store Settings</h1>
          <p className='text-mist text-sm mt-1'>
            General configuration stored in Firestore <span className='font-mono text-xs'>config/store</span>
          </p>
        </div>
      </div>

      {loading ? (
        <div className='space-y-4 max-w-xl'>
          {[...Array(3)].map((_, i) => (
            <div key={i} className='h-16 bg-canopy border border-smoke rounded-xl animate-pulse' />
          ))}
        </div>
      ) : (
        <form onSubmit={handleSave} className='max-w-xl space-y-6'>
          {/* Store Name */}
          <div className='bg-canopy border border-smoke rounded-xl p-6'>
            <h2 className='text-cream font-semibold text-sm mb-4'>General</h2>
            <div className='space-y-4'>
              <div>
                <label htmlFor='storeName' className='block text-[10px] font-bold tracking-widest uppercase text-mist mb-2'>
                  Store Name
                </label>
                <input
                  id='storeName'
                  type='text'
                  value={config.storeName}
                  onChange={(e) => updateField('storeName', e.target.value)}
                  className='w-full px-4 py-2.5 rounded-lg bg-grove border border-smoke text-cream text-sm focus:outline-none focus:border-lime transition-colors'
                  placeholder='Caribbean Cannabis Collective'
                />
              </div>

              <div>
                <label htmlFor='contactEmail' className='block text-[10px] font-bold tracking-widest uppercase text-mist mb-2'>
                  Contact Email
                </label>
                <input
                  id='contactEmail'
                  type='email'
                  value={config.contactEmail}
                  onChange={(e) => updateField('contactEmail', e.target.value)}
                  className='w-full px-4 py-2.5 rounded-lg bg-grove border border-smoke text-cream text-sm focus:outline-none focus:border-lime transition-colors'
                  placeholder='hello@example.com'
                />
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className='bg-canopy border border-smoke rounded-xl p-6'>
            <h2 className='text-cream font-semibold text-sm mb-1'>Shipping</h2>
            <p className='text-mist text-xs mb-4'>Orders above this threshold qualify for free shipping (where applicable).</p>
            <div>
              <label htmlFor='freeShipping' className='block text-[10px] font-bold tracking-widest uppercase text-mist mb-2'>
                Free Shipping Threshold
              </label>
              <div className='relative'>
                <span className='absolute left-4 top-1/2 -translate-y-1/2 text-mist text-sm select-none'>$</span>
                <input
                  id='freeShipping'
                  type='number'
                  min={0}
                  step={1}
                  value={(config.freeShippingThresholdCents / 100).toFixed(2)}
                  onChange={(e) => {
                    const dollars = parseFloat(e.target.value);
                    if (!isNaN(dollars) && dollars >= 0) {
                      updateField('freeShippingThresholdCents', Math.round(dollars * 100));
                    }
                  }}
                  className='w-full pl-8 pr-4 py-2.5 rounded-lg bg-grove border border-smoke text-cream text-sm focus:outline-none focus:border-lime transition-colors'
                  placeholder='100.00'
                />
              </div>
              <p className='text-mist text-[10px] mt-2'>
                Stored as cents: <span className='text-ivory font-mono'>{config.freeShippingThresholdCents}</span>
              </p>
            </div>
          </div>

          {/* Feedback */}
          {saveMsg && <p className='text-xs text-lime bg-lime/10 border border-lime/20 rounded-lg px-4 py-3'>{saveMsg}</p>}
          {error && <p className='text-xs text-coral bg-coral/10 border border-coral/20 rounded-lg px-4 py-3'>{error}</p>}

          {/* Save */}
          <button
            type='submit'
            disabled={saving}
            className='flex items-center gap-2 px-6 py-3 rounded-lg bg-lime text-forest text-sm font-bold tracking-wide hover:bg-lime/90 transition-colors disabled:opacity-60'
          >
            <Save size={15} />
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </form>
      )}
    </div>
  );
}
