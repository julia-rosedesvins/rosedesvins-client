"use client"

import BlogSection from "@/components/BlogSection"
import ExperiencesSection from "@/components/ExperiencesSection"
import GiftCardSection from "@/components/GiftCardSection"
import HeroSection from "@/components/HeroSection"
import LandingPageLayout from "@/components/LandingPageLayout"
import NewsletterSection from "@/components/NewsletterSection"
import RegionSection from "@/components/RegionSection"
import type { BlogPostSummary } from "@/lib/wordpress/types"

interface HomePageClientProps {
  blogPosts: BlogPostSummary[]
}

export default function HomePageClient({ blogPosts }: HomePageClientProps) {
  return (
    <LandingPageLayout>
      <HeroSection />
      <RegionSection />
      <ExperiencesSection />
      {/* <GiftCardSection /> */}
      <BlogSection posts={blogPosts} />
      <NewsletterSection />
    </LandingPageLayout>
  )
}
