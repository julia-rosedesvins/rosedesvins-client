"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import RegionCard from "./RegionCard";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import { regionService, Region } from "@/services/region.service";

const RegionsSection = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();

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
        <div className="relative px-4 md:px-20">
          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full max-w-7xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-12 items-center">
              {regions.map((region) => (
                <CarouselItem key={region._id} className="pl-2 md:pl-12 basis-full md:basis-1/3">
                  <RegionCard 
                    title={region.denom}
                    image={region.thumbnailUrl || "/assets/loire-valley-new.jpg"}
                    href={`/region/${encodeURIComponent(region.denom)}`}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Desktop arrows - side positioned */}
            <CarouselPrevious className="hidden md:flex bg-white border border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white shadow-md md:-left-16" />
            <CarouselNext className="hidden md:flex bg-white border border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white shadow-md md:-right-16" />
          </Carousel>
          
          {/* Mobile arrows - centered below */}
          <div className="flex md:hidden justify-center gap-4 mt-4">
            <button 
              onClick={() => api?.scrollPrev()}
              className="bg-white border border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white shadow-md rounded-full p-2 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </button>
            <button 
              onClick={() => api?.scrollNext()}
              className="bg-white border border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white shadow-md rounded-full p-2 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </button>
          </div>
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