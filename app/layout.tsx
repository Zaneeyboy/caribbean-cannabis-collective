import type { Metadata } from 'next';
import { Bebas_Neue, Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import { AuthProvider } from '@/contexts/AuthContext';
import Providers from '@/components/Providers';
import { Toaster } from 'sonner';
import { Suspense } from 'react';

const bebas = Bebas_Neue({
  variable: '--font-bebas',
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Caribbean Cannabis Collective — Farmers Helping Farmers',
  description: 'Official merchandise store for the Caribbean Cannabis Collective. Shop apparel, headwear, and accessories. Shipping to the US and Caribbean.',
  keywords: ['Caribbean Cannabis Collective', 'cannabis merchandise', 'Caribbean clothing', 'cannabis apparel', 'Farmers Helping Farmers'],
  openGraph: {
    title: 'Caribbean Cannabis Collective',
    description: 'Farmers Helping Farmers. Shop official CCC merchandise.',
    siteName: 'Caribbean Cannabis Collective',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${bebas.variable} ${playfair.variable} ${inter.variable} h-full`}>
      <body className='min-h-full flex flex-col bg-forest text-cream antialiased'>
        <Suspense fallback={null}>
          <AuthProvider>
            <Providers>
              <Navbar />
              <main className='flex-1'>{children}</main>
              <Footer />
              <CartDrawer />
              <Toaster
                position='bottom-right'
                toastOptions={{
                  style: {
                    background: '#142414',
                    border: '1px solid #3d3830',
                    color: '#f4efe4',
                    fontFamily: 'var(--font-inter)',
                    fontSize: '14px',
                  },
                }}
              />
            </Providers>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
