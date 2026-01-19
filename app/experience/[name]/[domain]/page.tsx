"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Home, Euro, Clock, Users, Languages, Heart, Accessibility, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingPageLayout from "@/components/LandingPageLayout";

const ExperienceDomain = ({ params }: { params: { name: string; domain: string } }) => {
    const router = useRouter();

    const experiences = [
        {
            id: 1,
            title: "Visite libre + dégustation des cuvées Tradition",
            price: "10 €",
            duration: "60 minutes",
            wines: "5 vins",
            capacity: "1 à 10 personnes",
            languages: ["Français", "English"],
            description: "Une expérience unique avec la visite libre de notre cave troglodytique sculptée, suivie d'une dégustation commentée de 5 vins de nos cuvées Tradition dans notre caveau à l'ambiance feutrée, éclairé à la bougie.",
            image: "/assets/bourillon-orleans.jpg"
        },
        {
            id: 2,
            title: "Visite libre + dégustation des cuvées Premium",
            price: "10 €",
            duration: "60 minutes",
            wines: "8 vins",
            capacity: "1 à 10 personnes",
            languages: ["Français", "English"],
            description: "Une expérience unique avec la visite libre de notre cave troglodytique sculptée, suivie d'une dégustation commentée de 8 vins de nos cuvées Premium dans notre caveau à l'ambiance feutrée, éclairé à la bougie.",
            image: "/assets/bourillon-orleans.jpg"
        },
        {
            id: 3,
            title: "Dégustation accords vins & fromages",
            price: "25 - 40 €",
            duration: "60 minutes",
            wines: "5 vins",
            capacity: "1 à 10 personnes",
            languages: ["Français", "English"],
            description: "Partagez un moment unique autour de 5 fromages de caractère provenant des Halles de Tours, accompagnés de 5 vins qui révèlent toute leurs arômes.",
            image: "/assets/bourillon-orleans.jpg"
        }
    ];

    return (
        <LandingPageLayout>

            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center text-white min-h-[400px]"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url(/assets/bourillon-orleans-entrance.webp)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat'
                }}
            >
                {/* Navigation Controls */}
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
                        <Link href="/regions/loire-valley" className="hover:text-white transition-colors">
                            <span>Vallée de la Loire</span>
                        </Link>
                        <span className="mx-2">&gt;</span>
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>Rochecorbon</span>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Title Section */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                        Domaine Bourillon d'Orléans
                    </h1>
                    <p className="text-lg text-gray-600">
                        Vallée de la Loire &gt; Rochecorbon
                    </p>
                </div>

                {/* About Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">À propos du domaine</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Le domaine Bourillon-Dorléans, installé sur les coteaux de Rochecorbon, cultive depuis trois générations le Chenin
                        sur un terroir argilo-siliceux. Producteur de Vouvray de caractère, il possède aussi de superbes caves troglodytiques du XVe
                        siècle. Après avoir embarqué pour un voyage initiatique et sensoriel lors d'une visite libre de notre cave troglodytique sculptée,
                        découvrez l'univers de notre domaine familial avec une dégustation éclairée à la bougie.
                    </p>
                </section>

                {/* Experiences Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8">Les expériences à découvrir</h2>

                    <div className="space-y-8">
                        {experiences.map((experience, index) => (
                            <div key={experience.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                <div className="flex flex-col lg:flex-row">
                                    <div className="lg:w-1/4">
                                        <img
                                            src={experience.image}
                                            alt={experience.title}
                                            className={`w-full h-48 lg:h-full ${experience.id >= 2 ? 'object-contain bg-gray-50' : 'object-cover'
                                                }`}
                                        />
                                    </div>
                                    <div className="lg:w-3/4 p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-xl font-bold text-primary mb-2">
                                                {experience.title}
                                            </h3>
                                        </div>

                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <Euro className="w-4 h-4 mr-2 text-primary" />
                                                <span>{experience.price} / personne</span>
                                            </div>
                                            <div className="flex items-center">
                                                <span className="w-4 h-4 mr-2 text-primary">🍷</span>
                                                <span>{experience.wines}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-2 text-primary" />
                                                <span>{experience.duration}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Users className="w-4 h-4 mr-2 text-primary" />
                                                <span>{experience.capacity}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mb-4">
                                            {experience.languages.map((lang, idx) => (
                                                <div key={idx} className="flex items-center text-sm text-gray-600">
                                                    <Languages className="w-4 h-4 mr-1" />
                                                    <span>{lang}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                            {experience.description}
                                        </p>

                                        <div className="flex justify-end">
                                            <Button className="bg-primary hover:bg-primary-dark text-white px-6">
                                                Réserver
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Location Section */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Localisation</h2>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <img
                            src="/assets/maps-bourillon-orleans.png"
                            alt="Carte de localisation du Domaine Bourillon d'Orléans à Rochecorbon"
                            className="w-full h-auto"
                        />
                    </div>
                </section>

                {/* Practical Information */}
                <section className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Informations pratiques</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center">
                            <PawPrint className="w-6 h-6 mr-3 text-primary" />
                            <span className="text-gray-700">Animaux bienvenus</span>
                        </div>
                        <div className="flex items-center">
                            <Accessibility className="w-6 h-6 mr-3 text-primary" />
                            <span className="text-gray-700">Accessible aux fauteuils roulants</span>
                        </div>
                        <div className="flex items-center">
                            <Heart className="w-6 h-6 mr-3 text-primary" />
                            <span className="text-gray-700">Lieu romantique</span>
                        </div>
                    </div>
                </section>

                {/* Return Button */}
                <div className="flex justify-center">
                    <Button
                        onClick={() => router.push('/regions/loire-valley')}
                        className="bg-primary hover:bg-primary-dark text-white px-8 py-3 text-lg"
                    >
                        Retour aux expériences
                    </Button>
                </div>
            </div>
        </LandingPageLayout>
    );
};

export default ExperienceDomain;