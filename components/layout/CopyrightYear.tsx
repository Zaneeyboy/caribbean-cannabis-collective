'use client';

import { useState, useEffect } from 'react';

/** Renders the current 4-digit year.
 *  Uses useEffect so new Date() only runs post-hydration, never during
 *  static prerendering or SSR (Next.js 16 prerender-current-time rule). */
export default function CopyrightYear() {
  const [year, setYear] = useState(2025);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return <>{year}</>;
}
