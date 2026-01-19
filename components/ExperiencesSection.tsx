import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import RegionCard from "./RegionCard";

const ExperiencesSection = () => {
  const experiences = [
    { title: "Visites de cave", image: "/assets/cave-visite.jpg", href: "/experience/cave-visits" },
    { title: "Atelier d'œnologie", image: "/assets/atelier-oenologie.jpg" },
    { title: "Vélo & trottinette dans les vignes", image: "/assets/velo-vignes.jpg" },
    { title: "Dégustations de vin", image: "/assets/degustation-vin.jpg" },
    { title: "Accords mets et vins", image: "/assets/food-wine.jpg" },
    { title: "Pique-nique dans les vignes", image: "/assets/pique-nique-vignes.jpg" },
    { title: "Yoga dans les vignes", image: "/assets/yoga-vignes.jpeg" },
    { title: "Vol en montgolfière au dessus des vignes", image: "/assets/vol-montgolfiere-vignes.png" },
    { title: "Murder Mystery", image: "/assets/murder-mystery.png" },
    { title: "Escape game dans une cave", image: "/assets/gift-escape-game-cave.jpg" },
  ];

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
          <Carousel 
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-7xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {experiences.map((experience) => (
                <CarouselItem key={experience.title} className="pl-2 md:pl-4 md:basis-1/4">
                  <RegionCard 
                    title={experience.title}
                    image={experience.image}
                    href={experience.href}
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