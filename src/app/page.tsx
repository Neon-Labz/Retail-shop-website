import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';

const HeroSlider = dynamic(() => import('@/features/home/components/HeroSlider').then(m => ({ default: m.HeroSlider })));
const PromotionalGrid = dynamic(() => import('@/features/home/components/PromotionalGrid').then(m => ({ default: m.PromotionalGrid })));
const FeaturedCollection = dynamic(() => import('@/features/home/components/FeaturedCollection').then(m => ({ default: m.FeaturedCollection })));
const LimitedTimeOffer = dynamic(() => import('@/features/home/components/LimitedTimeOffer').then(m => ({ default: m.LimitedTimeOffer })));
const ShopByCategories = dynamic(() => import('@/features/home/components/ShopByCategories').then(m => ({ default: m.ShopByCategories })));
const ShopTheLook = dynamic(() => import('@/features/home/components/ShopTheLook').then(m => ({ default: m.ShopTheLook })));
const FeaturedSlider = dynamic(() => import('@/features/home/components/FeaturedSlider').then(m => ({ default: m.FeaturedSlider })));
const TabContentSection = dynamic(() => import('@/features/home/components/TabContentSection').then(m => ({ default: m.TabContentSection })));
const BannerList = dynamic(() => import('@/features/home/components/BannerList').then(m => ({ default: m.BannerList })));
const TestimonialSection = dynamic(() => import('@/features/home/components/TestimonialSection').then(m => ({ default: m.TestimonialSection })));
const LatestBlog = dynamic(() => import('@/features/home/components/LatestBlog').then(m => ({ default: m.LatestBlog })));
const InstagramFeed = dynamic(() => import('@/features/home/components/InstagramFeed').then(m => ({ default: m.InstagramFeed })));

import { Marquee } from '@/components/shared/Marquee';
import { TrustBadges } from '@/components/shared/TrustBadges';

export const metadata: Metadata = {
  title: `${SITE_NAME} — Premium Fashion Store`,
  description: SITE_DESCRIPTION,
};

export default function HomePage() {
  return (
    <div className="home-sections">
      <HeroSlider />
      <PromotionalGrid />
      <FeaturedCollection />
      <LimitedTimeOffer />
      <ShopByCategories />
      <ShopTheLook />
      <FeaturedSlider />
      <TabContentSection />
      <Marquee text="Welcome to store" />
      <BannerList />
      <div className="fashion-home-testimonial">
        <TestimonialSection />
      </div>
      <LatestBlog />
      <InstagramFeed />
      <TrustBadges />
      <style>{`
        .home-sections {
          padding-bottom: 80px;
        }
        .home-sections > * + * {
          margin-top: 80px;
        }
      `}</style>
    </div>
  );
}
