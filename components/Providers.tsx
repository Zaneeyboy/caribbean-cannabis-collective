'use client';

import { useCartSync } from '@/hooks/useCartSync';

/**
 * Client-side providers wrapper — placed inside <AuthProvider> in the root layout.
 * Handles side-effects that need auth + cart context.
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  useCartSync();
  return <>{children}</>;
}
