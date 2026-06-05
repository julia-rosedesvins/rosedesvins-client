import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import RegionCard from "./RegionCard";

const GiftCardSection = () => {
  const giftExperiences = [
    { title: "Pique-nique dans les vignes", image: "/assets/gift-pique-nique-vignes.jpg" },
    { title: "Escape game dans une cave", image: "/assets/gift-escape-game-cave.jpg" },
    { title: "Yoga dans les vignes", image: "/assets/yoga-vignes.jpeg" },
    { title: "Murder Mystery", image: "/assets/murder-mystery.png" },
    { title: "Vol en montgolfière au dessus des vignes", image: "/assets/gift-montgolfiere-vignes.png" },
  ];

  return (
    <section className="py-8 px-4 bg-gradient-to-br from-[#318160]/5 to-[#318160]/10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <Gift className="w-16 h-16 mx-auto mb-4 text-[#318160]" />
          <h2 className="text-3xl md:text-4xl font-bold text-[#318160] mb-4">
            Idée cadeau
          </h2>
          <p className="text-lg text-[#7B947F] max-w-2xl mx-auto">
            Offrez une expérience œnotouristique unique à vos proches.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative px-16 mb-8">
          <Carousel 
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-7xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {giftExperiences.map((experience) => (
                <CarouselItem key={experience.title} className="pl-2 md:pl-4 md:basis-1/4">
                  <RegionCard 
                    title={experience.title}
                    image={experience.image}
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
          <Button className="bg-[#318160] hover:bg-[#1D6346] text-white px-8 py-3 rounded-lg font-semibold">
            Voir tout
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GiftCardSection;
