import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";

const BlogSection = () => {
  const articles = [
    { 
      title: "Le boom de l'oenotourisme en France : une opportunité stratégique pour les domaines viticoles", 
      image: "/assets/blog-oenotourisme-boom.png" 
    },
    { 
      title: "Quand le trop devient l'ennemi du bien : les vins médaillés", 
      image: "/assets/blog-vins-medailles.jpg" 
    },
  ];

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#318160] mb-4 text-left">
            Blog
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative px-16">
          <Carousel 
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {articles.map((article) => (
                <CarouselItem key={article.title} className="pl-2 md:pl-4 md:basis-1/3">
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-full aspect-square mb-4">
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 300px"
                      />
                    </div>
                    <h3 className="text-center font-semibold text-[#264035] group-hover:text-[#1D6346] transition-colors">
                      {article.title}
                    </h3>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white border border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white shadow-md -left-12" />
            <CarouselNext className="bg-white border border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white shadow-md -right-12" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
