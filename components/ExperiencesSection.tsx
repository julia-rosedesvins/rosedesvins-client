'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import RegionCard from "./RegionCard";
import { Skeleton } from "@/components/ui/skeleton";
import { domainProfileService, PublicService } from "@/services/domain-profile.service";

const ExperiencesSection = () => {
  const [services, setServices] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await domainProfileService.getAllPublicServices(1, 8);
        setServices(response.data.services);
      } catch (err: any) {
        console.error('Error fetching services:', err);
        setError(err.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/experience">
            <h2 className="text-2xl md:text-3xl font-bold text-[#318160] mb-4 text-left hover:text-[#1D6346] transition-colors cursor-pointer">
              Explorer les vignobles, vivez des expériences œnotouristiques inoubliables.
            </h2>
          </Link>
          <p className="text-lg text-[#7B947F] max-w-4xl text-left">
            Rencontre avec un vigneron, exploration des chais, promenade au cœur des vignes ou initiation à 
            l'œnologie... découvrez autrement le patrimoine viticole et les routes des vins françaises.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative px-16">
          {loading ? (
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
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Aucun service disponible pour le moment.</p>
            </div>
          ) : (
            <Carousel 
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-7xl mx-auto"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {services.map((service) => (
                  <CarouselItem key={service.serviceId} className="pl-2 md:pl-4 md:basis-1/3">
                    <RegionCard 
                      title={service.serviceName}
                      image={service.serviceBannerUrl || "/assets/default-service.jpg"}
                      href={`/reservation/${service.domain.userId}/${service.serviceId}`}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="bg-white border border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white shadow-md -left-12" />
              <CarouselNext className="bg-white border border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white shadow-md -right-12" />
            </Carousel>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link href="/experiences">
            <Button className="bg-[#318160] hover:bg-[#1D6346] text-white px-8 py-3 rounded-lg font-semibold">
              Voir tout
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ExperiencesSection;