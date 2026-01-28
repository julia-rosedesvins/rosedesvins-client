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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
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
                  <CarouselItem key={service.serviceId} className="pl-2 md:pl-4 md:basis-1/4">
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