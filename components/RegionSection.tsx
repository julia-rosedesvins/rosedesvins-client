import Link from "next/link";
import RegionCard from "./RegionCard";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
const RegionsSection = () => {
  const regions = [
    { title: "Vallée de la Loire", image: "/assets/loire-valley-new.jpg", href: "/regions/loire-valley" },
    { title: "Bordeaux", image: "/assets/bordeaux-new.jpg" },
    { title: "Champagne", image: "/assets/champagne-new.jpg" },
    { title: "Bourgogne", image: "/assets/bourgogne.jpg" },
    { title: "Languedoc Roussillon", image: "/assets/languedoc-roussillon.jpg" },
    { title: "Vallée du Rhône", image: "/assets/vallee-rhone.jpg" },
    { title: "Provence", image: "/assets/provence.jpg" },
    { title: "Alsace", image: "/assets/alsace.jpg" },
    { title: "Corse", image: "/assets/corse.jpg" },
    { title: "Sud-Ouest", image: "/assets/sud-ouest.jpg" },
    { title: "Beaujolais", image: "/assets/beaujolais.jpg" },
    { title: "Jura", image: "/assets/jura.jpg" },
  ];

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
                <CarouselItem key={region.title} className="pl-8 md:pl-12 basis-1/1 md:basis-1/4">
                  <RegionCard 
                    title={region.title}
                    image={region.image}
                    href={region.href}
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