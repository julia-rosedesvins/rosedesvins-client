"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import RegionCard from "./RegionCard";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { regionService, Region } from "@/services/region.service";

const RegionsSection = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        const response = await regionService.getAllRegions({ page: 1, limit: 20, isParent: true });
        setRegions(response.data);
      } catch (err: any) {
        console.error('Error fetching regions:', err);
        setError(err.message || 'Failed to load regions');
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  if (loading) {
    return (
      <section className="py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#318160] mb-4 text-left">
              Un voyage au cœur des régions viticoles.
            </h2>
            <p className="text-lg text-[#7B947F] max-w-4xl text-left">
              Chaque terroir est une invitation à la rencontre : échangez avec des vignerons passionnés, 
              découvrez leurs traditions et laissez-vous guider à travers des paysages et savoir-faire uniques.
            </p>
          </div>

          {/* Skeleton Loading */}
          <div className="relative px-16">
            <div className="w-full max-w-7xl mx-auto">
              <div className="flex gap-8 md:gap-12 overflow-hidden">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex-shrink-0 w-full md:w-1/4">
                    <div className="relative rounded-xl overflow-hidden shadow-lg animate-pulse">
                      <div className="bg-gray-300 h-64 w-full"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="h-6 bg-gray-400 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#318160] mb-4 text-left">
              Un voyage au cœur des régions viticoles.
            </h2>
            <p className="text-lg text-red-600 max-w-4xl text-left">
              {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/regions" className="hover:text-[#1D6346] transition-colors">
            <h2 className="text-2xl md:text-3xl font-bold text-[#318160] mb-4 text-left">
              Un voyage au cœur des régions viticoles.
            </h2>
          </Link>
          <p className="text-lg text-[#7B947F] max-w-4xl text-left">
            Chaque terroir est une invitation à la rencontre : échangez avec des vignerons passionnés, 
            découvrez leurs traditions et laissez-vous guider à travers des paysages et savoir-faire uniques.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative px-20">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-7xl mx-auto"
          >
            <CarouselContent className="-ml-8 md:-ml-12 items-center">
              {regions.map((region) => (
                <CarouselItem key={region._id} className="pl-8 md:pl-12 basis-1/1 md:basis-1/3">
                  <RegionCard 
                    title={region.denom}
                    image={region.thumbnailUrl || "/assets/loire-valley-new.jpg"}
                    href={`/region/${encodeURIComponent(region.denom)}`}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white border border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white shadow-md -left-16" />
            <CarouselNext className="bg-white border border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white shadow-md -right-16" />
          </Carousel>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link href="/regions">
            <Button className="bg-[#318160] hover:bg-[#1D6346] text-white px-8 py-3 rounded-lg font-semibold">
              Voir tout
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RegionsSection;