"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Home, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingPageLayout from "@/components/LandingPageLayout";

const LoireValley = ({ params }: { params: { name: string } }) => {
    const router = useRouter();

    const filters = [
        { name: "Date", active: true },
        { name: "Visiteurs", active: false },
        { name: "Prix", active: false },
        { name: "Langues", active: false },
        { name: "Expériences", active: false },
    ];

    const domaines = [
        {
            id: 1,
            name: "Domaine Bourillon d'Orléans",
            location: "Vouvray",
            price: "10 €",
            image: "/assets/bourillon-orleans.jpg",
            description: "Le domaine Bourillon-Orléans cultive depuis trois générations le Chenin sur un terroir argilo-siliceux. Producteur de Vouvray de caractère, il possède aussi des caves troglodytiques du XVe siècle.",
            buttonText: "Réserver"
        },
        {
            id: 2,
            name: "Famille Denis",
            location: "Cléré-sur-Layon",
            price: "Gratuit",
            image: "/assets/famille-denis-new.jpg",
            description: "Domaine familial du Haut-Layon depuis quatre générations, certifié HVE, la Famille Denis produit des Anjou, Coteaux du Layon et IGP de caractère, et accueille les visiteurs pour des dégustations et visites guidées.",
            buttonText: "Réserver"
        },
        {
            id: 3,
            name: "Domaine Pierre Sourdais",
            location: "Cravant-les-Côteaux",
            price: "10 €",
            image: "/assets/pierre-sourdais.jpg",
            description: "Domaine familial de Chinon, le Domaine Pierre Sourdais cultives en agriculture biologique. Les dégustations se font dans les célèbres caves Tuffau, reflet d'un savoir-faire transmis de génération en génération.",
            buttonText: "Voir Site"
        }
    ];

    return (
        <LandingPageLayout>

            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center text-white min-h-[400px]"
                style={{
                    backgroundImage: `linear-gradient(rgba(59, 130, 91, 0.7), rgba(59, 130, 91, 0.5)), url(/assets/loire-valley-new-bg.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
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
                        <Home className="w-4 h-4 mr-2" />
                        <Link href="/regions" className="hover:text-white transition-colors">
                            <span>France</span>
                        </Link>
                        <span className="mx-2">&gt;</span>
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>Vallée de la Loire</span>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-6xl mx-auto px-4 pb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                        Val de Loire : sur la route des vins<br />
                        et des châteaux
                    </h1>
                    <p className="text-lg md:text-xl max-w-4xl leading-relaxed">
                        Au cœur d'un patrimoine exceptionnel, découvrez la diversité des terroirs
                        ligériens et échangez avec des vignerons passionnés. Entre caves
                        troglodytiques, châteaux et paysages inscrits à l'UNESCO, vivez des expériences
                        œnotouristiques inoubliables.
                    </p>
                </div>
            </section>

            <section className="bg-background py-4 px-4 border-b sticky top-0 z-20">
                <div className="flex flex-wrap gap-3">
                    {filters.map((filter) => (
                        <Button
                            key={filter.name}
                            variant={filter.active ? "default" : "outline"}
                            className={`rounded-full ${filter.active
                                    ? "bg-primary text-primary-foreground"
                                    : "border-border text-foreground hover:bg-muted"
                                }`}
                        >
                            {filter.name}
                        </Button>
                    ))}
                </div>
            </section>

            {/* Split Layout: Map + Listings - fills remaining viewport */}
            <section className="flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 60px)' }}>
                {/* Interactive Map - 60% */}
                <div className="lg:w-[60%] h-[400px] lg:h-full lg:sticky lg:top-[60px]">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d687904.5851611486!2d-0.2728760499999999!3d47.2780468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47fcd3e8b3e0e3d5%3A0x40d37521e0d9c30!2sLoire%20Valley!5e0!3m2!1sen!2sfr!4v1704672000000!5m2!1sen!2sfr"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Carte de la Vallée de la Loire"
                    />
                </div>

                {/* Winemaker Listings - 40% - scrollable */}
                <div className="lg:w-[40%] bg-muted/30 p-6 overflow-y-auto">
                    <div className="space-y-4">
                        {domaines.map((domaine) => (
                            <Link
                                key={domaine.id}
                                href={domaine.id === 1 ? "/regions/loire-valley/bourillon-orleans" : "#"}
                                className="block hover:shadow-lg transition-shadow"
                            >
                                <div className="bg-background rounded-lg shadow-sm overflow-hidden">
                                    <img
                                        src={domaine.image}
                                        alt={domaine.name}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="text-lg font-bold text-primary">
                                                {domaine.name}
                                            </h3>
                                            <Button
                                                size="sm"
                                                className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
                                                onClick={(e) => e.preventDefault()}
                                            >
                                                {domaine.buttonText}
                                            </Button>
                                        </div>
                                        <p className="text-muted-foreground text-sm mb-2">{domaine.location}</p>
                                        <div className="flex items-center mb-3">
                                            <Euro className="w-4 h-4 mr-1 text-muted-foreground" />
                                            <span className="text-foreground text-sm">{domaine.price}</span>
                                        </div>
                                        <p className="text-foreground/80 text-sm leading-relaxed line-clamp-3">
                                            {domaine.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-2 pt-4">
                            <Button
                                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold"
                                disabled
                            >
                                1
                            </Button>
                            <Link href="/regions/loire-valley/page-2">
                                <Button
                                    variant="outline"
                                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-lg font-semibold"
                                >
                                    2
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </LandingPageLayout>
    );
};

export default LoireValley;