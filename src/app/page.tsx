import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { SITE_NAME } from '@/lib/constants';

/* ── Former Fashion Home Components (Commented out as requested, preserved without deletion) ──
const HeroSlider = dynamic(() => import('@/features/home/components/HeroSlider').then(m => ({ default: m.HeroSlider })));
const PromotionalGrid = dynamic(() => import('@/features/home/components/PromotionalGrid').then(m => ({ default: m.PromotionalGrid })));
const FeaturedCollection = dynamic(() => import('@/features/home/components/FeaturedCollection').then(m => ({ default: m.FeaturedCollection })));
const LimitedTimeOffer = dynamic(() => import('@/features/home/components/LimitedTimeOffer').then(m => ({ default: m.LimitedTimeOffer })));
const ShopByCategories = dynamic(() => import('@/features/home/components/ShopByCategories').then(m => ({ default: m.ShopByCategories })));
const ShopTheLook = dynamic(() => import('@/features/home/components/ShopTheLook').then(m => ({ default: m.ShopTheLook })));
const FeaturedSlider = dynamic(() => import('@/features/home/components/FeaturedSlider').then(m => ({ default: m.FeaturedSlider })));
const TabContentSection = dynamic(() => import('@/features/home/components/TabContentSection').then(m => ({ default: m.TabContentSection })));
const BannerList = dynamic(() => import('@/features/home/components/BannerList').then(m => ({ default: m.BannerList })));
const LatestBlog = dynamic(() => import('@/features/home/components/LatestBlog').then(m => ({ default: m.LatestBlog })));
const InstagramFeed = dynamic(() => import('@/features/home/components/InstagramFeed').then(m => ({ default: m.InstagramFeed })));
import { Marquee } from '@/components/shared/Marquee';
import { TrustBadges } from '@/components/shared/TrustBadges';
── */

/* ── Active POD Storefront Components on Main Home Page ── */
const PodHero = dynamic(() => import('@/features/pod/components/PodHero').then(m => ({ default: m.PodHero })));
const PodTopCategories = dynamic(() => import('@/features/pod/components/PodTopCategories').then(m => ({ default: m.PodTopCategories })));
const PodPromoGrid = dynamic(() => import('@/features/pod/components/PodPromoGrid').then(m => ({ default: m.PodPromoGrid })));
const PodFeaturedProducts = dynamic(() => import('@/features/pod/components/PodFeaturedProducts').then(m => ({ default: m.PodFeaturedProducts })));
const PodDealBanner = dynamic(() => import('@/features/pod/components/PodDealBanner').then(m => ({ default: m.PodDealBanner })));
const PodNewArrivals = dynamic(() => import('@/features/pod/components/PodNewArrivals').then(m => ({ default: m.PodNewArrivals })));
const PodTrendingSection = dynamic(() => import('@/features/pod/components/PodTrendingSection').then(m => ({ default: m.PodTrendingSection })));
const PodRandomRecommendations = dynamic(() => import('@/features/pod/components/PodRandomRecommendations').then(m => ({ default: m.PodRandomRecommendations })));
const PodRecentlyViewed = dynamic(() => import('@/features/pod/components/PodRecentlyViewed').then(m => ({ default: m.PodRecentlyViewed })));
const PodMarquee = dynamic(() => import('@/features/pod/components/PodMarquee').then(m => ({ default: m.PodMarquee })));
const PodBannerList = dynamic(() => import('@/features/pod/components/PodBannerList').then(m => ({ default: m.PodBannerList })));
const TestimonialSection = dynamic(() => import('@/features/home/components/TestimonialSection').then(m => ({ default: m.TestimonialSection })));
const PodInstagram = dynamic(() => import('@/features/pod/components/PodInstagram').then(m => ({ default: m.PodInstagram })));
const PodTrustBadges = dynamic(() => import('@/features/pod/components/PodTrustBadges').then(m => ({ default: m.PodTrustBadges })));

export const metadata: Metadata = {
  title: `${SITE_NAME} — Custom POD Store`,
  description: 'Custom print-on-demand gear — personalize apparel, drinkware, bags, and decor made just for you.',
};

export default function HomePage() {
  return (
    <div className="pod-home-sections">
      {/* ── Active POD Storefront Sections ── */}
      <PodHero />
      <PodTopCategories />
      <PodPromoGrid />
      <PodFeaturedProducts />
      <PodDealBanner />
      <PodNewArrivals />
      <PodTrendingSection />
      <PodRandomRecommendations />
      <PodRecentlyViewed />
      <PodMarquee />
      <PodBannerList />
      <div className="pod-home-testimonial">
        <TestimonialSection heading="Customers Feedback" backgroundColor="transparent" sectionPadding="0" />
      </div>
      <PodInstagram />
      {/* <PodTrustBadges /> (Removed as requested) */}

      {/* ── Former Fashion Home Sections (Commented out as requested, preserved without deletion) ──
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
      </div>
      ── */}

      <style>{`
        .pod-home-sections {
          padding-bottom: 80px;
        }
        .pod-home-sections > * + * {
          margin-top: 80px;
        }
        @media (max-width: 749px) {
          .pod-home-sections > * + * { margin-top: 56px; }
        }

        .pod-home-testimonial .ts-card {
          box-shadow:
            0 20px 40px -14px rgba(15, 23, 42, 0.1),
            0 8px 16px -6px rgba(15, 23, 42, 0.06),
            0 -10px 24px -12px rgba(15, 23, 42, 0.07) !important;
        }
        .pod-home-testimonial .swiper {
          overflow: hidden !important;
          padding-block: 56px !important;
          margin-block: -56px !important;
          padding-inline: 18px !important;
          margin-inline: -18px !important;
          width: calc(100% + 36px) !important;
        }
      `}</style>
    </div>
  );
}
