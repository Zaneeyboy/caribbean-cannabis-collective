import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BrandStory from '@/components/home/BrandStory';
import CollectiveCTA from '@/components/home/CollectiveCTA';
import HomeFAQ from '@/components/home/HomeFAQ';
import NewsletterSection from '@/components/home/NewsletterSection';

export default function Home() {
  return (
    <>
      <Hero />
      <BrandStory />
      <FeaturedProducts />
      <HomeFAQ />
      <NewsletterSection />
      <CollectiveCTA />
    </>
  );
}
