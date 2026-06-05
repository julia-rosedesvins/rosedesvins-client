"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Grape, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingPageLayout from "@/components/LandingPageLayout";
import { use } from "react";

const Experience = ({ params }: { params: Promise<{ name: string }> }) => {
    const router = useRouter();
    const { name } = use(params);

    const filters = [
        { name: "Localisation", active: false },
        { name: "Date", active: true },
        { name: "Visiteurs", active: false },
        { name: "Prix", active: false },
        { name: "Langues", active: false },
    ];

    const domaines = [
        {
            id: 1,
            name: "Domaine Bourillon d'Orléans",
            location: "Vouvray",
            price: "10 €",
            image: "/assets/bourillon-orleans.jpg",
            description: "Le domaine Bourillon-Orléans cultive depuis trois générations le Chenin sur un terroir argilo-siliceux. Producteur de Vouvray de caractère, il possède aussi des caves troglodytiques du XVe siècle."
        },
        {
            id: 2,
            name: "Famille Denis",
            location: "Cléré-sur-Layon",
            price: "Gratuit",
            image: "/assets/famille-denis-new.jpg",
            description: "Domaine familial du Haut-Layon depuis quatre générations, certifié HVE, la Famille Denis produit des Anjou, Coteaux du Layon et IGP de caractère, et accueille les visiteurs pour des dégustations et visites guidées."
        },
        {
            id: 3,
            name: "Domaine Pierre Sourdais",
            location: "Cravant-les-Côteaux",
            price: "10 €",
            image: "/assets/pierre-sourdais.jpg",
            description: "Domaine familial de Chinon, le Domaine Pierre Sourdais cultives en agriculture biologique. Les dégustations se font dans les célèbres caves Tuffau, reflet d'un savoir-faire transmis de génération en génération."
        }
    ];

    return (
        <LandingPageLayout>

            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center text-white min-h-[400px]"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4)), url(/assets/cave-visits-hero.jpeg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {/* Back Button */}
                <div className="max-w-6xl mx-auto px-4 pt-4">
                    <Button
                        onClick={() => router.back()}
                        variant="outline"
                        className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour
                    </Button>
                </div>

                {/* Breadcrumb */}
                <div className="max-w-6xl mx-auto px-4 pt-6">
                    <div className="flex items-center text-white/80 text-sm mb-6">
                        <Grape className="w-4 h-4 mr-2" />
                        <Link href="/experiences" className="hover:text-white transition-colors">
                            <span>Expériences</span>
                        </Link>
                        <span className="mx-2">&gt;</span>
                        <span>Visites de cave</span>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-6xl mx-auto px-4 pb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                        Visites de cave
                    </h1>
                    <p className="text-lg md:text-xl max-w-4xl leading-relaxed">
                        Poussez les portes des domaines et découvrez leurs coulisses pour une immersion privilégiée au cœur de l'univers des vignerons. Le temps d'une visite de cave, découvrez les secrets de leur savoir-faire, explorez les chais, échangez avec ceux qui façonnent le vin et dégustez leurs cuvées. Une manière concrète et authentique de comprendre le vin et de découvrir l'univers de ceux qui le produisent.
                    </p>
                </div>
            </section>

            {/* Filters */}
            <section className="bg-white py-6 px-4 border-b">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-wrap gap-3">
                        {filters.map((filter) => (
                            <Button
                                key={filter.name}
                                variant={filter.active ? "default" : "outline"}
                                className={`rounded-full ${filter.active
                                        ? "bg-primary text-white"
                                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                    }`}
                            >
                                {filter.name}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 px-4 bg-gray-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Domaines List */}
                        <div className="lg:col-span-2 space-y-6">
                            {domaines.map((domaine) => (
                                <Link
                                    key={domaine.id}
                                    href={domaine.id === 1 ? "/experience/loire-valley/bourillon-orleans" : "#"}
                                    className="block hover:shadow-lg transition-shadow"
                                >
                                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                        <div className="flex flex-col md:flex-row">
                                            <div className="md:w-1/3">
                                                <img
                                                    src={domaine.image}
                                                    alt={domaine.name}
                                                    className="w-full h-48 md:h-full object-cover"
                                                />
                                            </div>
                                            <div className="md:w-2/3 p-6">
                                                <h3 className="text-xl font-bold text-primary mb-2">
                                                    {domaine.name}
                                                </h3>
                                                <p className="text-gray-600 mb-3">{domaine.location}</p>
                                                <div className="flex items-center mb-4">
                                                    <Euro className="w-4 h-4 mr-1 text-gray-500" />
                                                    <span className="text-gray-700">{domaine.price}</span>
                                                </div>
                                                <p className="text-gray-700 text-sm leading-relaxed">
                                                    {domaine.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}

                            {/* Pagination */}
                            <div className="flex justify-center items-center gap-2 pt-6">
                                <Button
                                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold"
                                    disabled
                                >
                                    1
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-primary text-primary hover:bg-primary hover:text-white px-4 py-2 rounded-lg font-semibold"
                                >
                                    2
                                </Button>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
                                <h3 className="text-lg font-semibold text-primary mb-4">Localisation</h3>
                                <img
                                    src="/assets/map-anjou-touraine.png"
                                    alt="Carte interactive de la région"
                                    className="w-full h-auto rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </LandingPageLayout>
    );
};

export default Experience;
