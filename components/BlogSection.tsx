"use client"

import Link from "next/link"
import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import type { BlogPostSummary } from "@/lib/wordpress/types"

interface BlogSectionProps {
  posts: BlogPostSummary[]
}

const BlogSection = ({ posts }: BlogSectionProps) => {
  if (posts.length === 0) {
    return null
  }

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#318160] mb-4 text-center">
            Blog
          </h2>
        </div>

        <div className="relative px-16">
          <Carousel
            opts={{
              align: "start",
              loop: posts.length > 1,
            }}
            className="w-full max-w-7xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {posts.map((post) => (
                <CarouselItem key={post.id} className="pl-2 md:pl-4 md:basis-1/3">
                  <Link href={`/blog/${post.slug}`} className="group block">
                    <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4 shadow-sm">
                      <Image
                        src={post.featuredImageUrl}
                        alt={post.title}
                        fill
                        className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                    </div>
                    <h3 className="text-center font-semibold text-[#264035] group-hover:text-[#1D6346] transition-colors">
                      {post.title}
                    </h3>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            {posts.length > 1 && (
              <>
                <CarouselPrevious className="bg-white border border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white shadow-md -left-12" />
                <CarouselNext className="bg-white border border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white shadow-md -right-12" />
              </>
            )}
          </Carousel>
        </div>

        <div className="text-center mt-8">
          <Link href="/blog">
            <Button className="bg-[#318160] hover:bg-[#1D6346] text-white px-8 py-3 rounded-lg font-semibold">
              Voir tout
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BlogSection
