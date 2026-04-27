'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { adminExperienceCategoriesService, ExperienceCategory } from "@/services/admin-experience-categories.service";

const CATEGORY_IMAGES = [
  "/assets/atelier-oenologie.webp",
  "/assets/cave-visite.webp",
  "/assets/degustation-vin.webp",
  "/assets/wine-cellar.webp",
  "/assets/velo-vignes.webp",
  "/assets/pique-nique-vignes.webp",
  "/assets/vol-montgolfiere-vignes.webp",
  "/assets/yoga-vignes.webp",
  "/assets/food-wine.webp",
  "/assets/gift-escape-game-cave.webp",
  "/assets/murder-mystery.webp",
  "/assets/cave-visits-hero.webp",
];

const ExperiencesSection = () => {
  const [categories, setCategories] = useState<ExperienceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await adminExperienceCategoriesService.getActiveCategories();
        setCategories(data);
      } catch (err: any) {
        console.error('Error fetching experience categories:', err);
        setError(err.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/experiences">
            <h2 className="text-2xl md:text-3xl font-bold text-[#318160] mb-4 text-center hover:text-[#1D6346] transition-colors cursor-pointer">
              Vivez des expériences œnotouristiques inoubliables.
            </h2>
          </Link>
          <p className="text-lg text-[#7B947F] max-w-4xl text-center mx-auto">
             À la rencontre des vignerons, des chais et des vignes, ou pour une initiation à l&apos;œnologie… vivez autrement le patrimoine viticole et les routes des vins françaises. 
          </p>
        </div>

        {/* Carousel */}
        <div className="relative px-4 md:px-16">
          {loading ? (
            <div className="flex gap-6 overflow-hidden justify-center">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 flex flex-col items-center gap-4">
                  <Skeleton className="w-64 h-64 rounded-full" />
                  <Skeleton className="h-6 w-40" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Aucune catégorie disponible pour le moment.</p>
            </div>
          ) : (
            <Carousel
              setApi={setApi}
              opts={{
                align: "center",
                loop: true,
              }}
              className="w-full max-w-7xl mx-auto"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {categories.map((category, index) => (
                  <CarouselItem key={category._id} className="pl-2 md:pl-4 basis-full md:basis-1/3">
                    <Link
                      href={`/experiences?category=${category._id}`}
                      className="flex flex-col items-center group cursor-pointer"
                    >
                      <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
                        <Image
                          src={CATEGORY_IMAGES[index % CATEGORY_IMAGES.length]}
                          alt={category.category_name}
                          fill
                          priority={index < 3}
                          sizes="(max-width: 768px) 256px, 288px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-[#264035] text-center group-hover:text-[#318160] transition-colors">
                        {category.category_name}
                      </h3>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* Desktop arrows */}
              <CarouselPrevious className="hidden md:flex bg-white border border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white shadow-md -left-12" />
              <CarouselNext className="hidden md:flex bg-white border border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white shadow-md -right-12" />
            </Carousel>
          )}

          {/* Mobile arrows */}
          {!loading && !error && categories.length > 0 && (
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
