"use client"

import BlogSection from "@/components/BlogSection"
import ExperiencesSection from "@/components/ExperiencesSection"
import GiftCardSection from "@/components/GiftCardSection"
import HeroSection from "@/components/HeroSection"
import LandingPageLayout from "@/components/LandingPageLayout"
import NewsletterSection from "@/components/NewsletterSection"
import RegionSection from "@/components/RegionSection"



export default function HomePage() {


  return (
    <LandingPageLayout>
      <HeroSection />
      <RegionSection />
      <ExperiencesSection />
      <GiftCardSection />
      <BlogSection />
      <NewsletterSection />
    </LandingPageLayout>
  )
}
