"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingPageLayout from "@/components/LandingPageLayout";

const Regions = () => {
    const router = useRouter();
    const regions = [
        { name: "Vallée de la Loire", image: "/assets/loire-valley-new.jpg", slug: "loire-valley" },
        { name: "Bordeaux", image: "/assets/bordeaux-new.jpg", slug: "bordeaux" },
        { name: "Champagne", image: "/assets/champagne-new.jpg", slug: "champagne" },
        { name: "Bourgogne", image: "/assets/bourgogne.jpg", slug: "bourgogne" },
        { name: "Languedoc-Roussillon", image: "/assets/languedoc-roussillon.jpg", slug: "languedoc-roussillon" },
        { name: "Vallée du Rhône", image: "/assets/vallee-rhone.jpg", slug: "vallee-rhone" },
        { name: "Provence", image: "/assets/provence.jpg", slug: "provence" },
        { name: "Corse", image: "/assets/corse.jpg", slug: "corse" },
        { name: "Sud-Ouest", image: "/assets/sud-ouest.jpg", slug: "sud-ouest" },
        { name: "Beaujolais", image: "/assets/beaujolais.jpg", slug: "beaujolais" },
        { name: "Alsace", image: "/assets/alsace.jpg", slug: "alsace" },
        { name: "Lorraine", image: "/assets/lorraine.png", slug: "lorraine" },
        { name: "Jura", image: "/assets/jura.jpg", slug: "jura" },
        { name: "Île-de-France", image: "/assets/ile-de-france.jpg", slug: "ile-de-france" },
        { name: "Savoie", image: "/assets/savoie.jpg", slug: "savoie" },
    ];

    return (
        <LandingPageLayout>

            {/* Hero Section */}
            <section
                className="relative bg-cover text-white min-h-[300px]"
                style={{
                    backgroundImage: `linear-gradient(rgba(59, 130, 91, 0.7), rgba(59, 130, 91, 0.5)), url(/assets/chablis-vignoble-bourgogne.jpg)`,
                    backgroundPosition: 'center 0%',
                    transform: 'scaleX(-1)'
                }}
            >
                {/* Back Button */}
                <div
                    className="max-w-6xl mx-auto px-4 pt-4"
                    style={{ transform: 'scaleX(-1)' }}
                >
                    <Button
                        onClick={() => router.back()}
                        variant="outline"
                        className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour
                    </Button>
                </div>

                {/* Content */}
                <div
                    className="max-w-6xl mx-auto px-4 pb-12 pt-8 flex items-center min-h-[250px]"
                    style={{ transform: 'scaleX(-1)' }}
                >
                    <div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                            Un voyage au cœur des régions viticoles.
                        </h1>
                        <p className="text-lg md:text-xl max-w-3xl leading-relaxed">
                            Au fil des routes des vins, ce sont les vignerons eux-mêmes qui vous ouvrent leurs portes.
                            Entre paysages, patrimoine et passion partagée, découvrez la richesse et la diversité des
                            vignobles français.
                        </p>
                    </div>
                </div>
            </section>

            {/* Regions Grid */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#318160] mb-12 text-center">
                        Les régions viticoles françaises
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
                        {regions.map((region) => (
                            <div key={region.name} className="flex flex-col items-center text-center">
                                {region.slug ? (
                                    <Link href={`/regions/${region.slug}`} className="flex flex-col items-center text-center hover:transform hover:scale-105 transition-transform">
                                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 shadow-lg">
                                            <img
                                                src={region.image}
                                                alt={region.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h3 className="text-[#318160] font-semibold text-lg hover:text-[#1D6346]">
                                            {region.name}
                                        </h3>
                                    </Link>
                                ) : (
                                    <>
                                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 shadow-lg">
                                            <img
                                                src={region.image}
                                                alt={region.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <h3 className="text-[#318160] font-semibold text-lg">
                                            {region.name}
                                        </h3>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* CTA Button */}
                    <div className="text-center mt-16">
                        <Button className="bg-[#318160] hover:bg-[#1D6346] text-white px-8 py-3 rounded-lg font-semibold">
                            Voir tous les domaines
                        </Button>
                    </div>
                </div>
            </section>
        </LandingPageLayout>
    );
};

export default Regions;