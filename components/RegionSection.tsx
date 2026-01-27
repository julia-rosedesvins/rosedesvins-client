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
              Chargement des régions...
            </p>
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
        <div className="relative px-16">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-7xl mx-auto"
          >
            <CarouselContent className="-ml-8 md:-ml-12">
              {regions.map((region) => (
                <CarouselItem key={region._id} className="pl-8 md:pl-12 basis-1/1 md:basis-1/4">
                  <RegionCard 
                    title={region.denom}
                    image={region.thumbnailUrl || "/assets/loire-valley-new.jpg"}
                    href={`/region/${encodeURIComponent(region.denom)}`}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white border border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white shadow-md -left-12" />
            <CarouselNext className="bg-white border border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white shadow-md -right-12" />
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