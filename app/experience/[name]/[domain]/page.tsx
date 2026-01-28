"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Home, Euro, Clock, Users, Languages, Heart, Accessibility, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LandingPageLayout from "@/components/LandingPageLayout";
import { domainProfileService, DomainProfile, DomainLocation } from "@/services/domain-profile.service";
import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues
const DomainMap = dynamic(() => import('@/components/DomainMap'), {
    ssr: false,
    loading: () => <div className="w-full h-96 bg-gray-200 flex items-center justify-center rounded-lg">Chargement de la carte...</div>
});

const ExperienceDomain = ({ params }: { params: Promise<{ name: string; domain: string }> }) => {
    const router = useRouter();
    const unwrappedParams = React.use(params);
    const [domainProfile, setDomainProfile] = useState<DomainProfile | null>(null);
    const [location, setLocation] = useState<DomainLocation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDomainProfile = async () => {
            try {
                setLoading(true);
                const response = await domainProfileService.getPublicDomainProfile(unwrappedParams.domain);
                setDomainProfile(response.data.domainProfile);
                setLocation(response.data.location);
            } catch (error: any) {
                console.error('Error fetching domain profile:', error);
            } finally {
                setLoading(false);
            }
        };

        if (unwrappedParams.domain) {
            fetchDomainProfile();
        }
    }, [unwrappedParams.domain]);

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

    if (loading) {
        return (
            <LandingPageLayout>
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <Skeleton className="h-12 w-3/4 mb-4" />
                    <Skeleton className="h-6 w-1/2 mb-8" />
                    <Skeleton className="h-64 w-full mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-96 w-full" />
                        ))}
                    </div>
                </div>
            </LandingPageLayout>
        );
    }

    if (!domainProfile) {
        return (
            <LandingPageLayout>
                <div className="max-w-6xl mx-auto px-4 py-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Domaine non trouvé</h1>
                    <Button onClick={() => router.back()}>Retour</Button>
                </div>
            </LandingPageLayout>
        );
    }

    return (
        <LandingPageLayout>
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center text-white min-h-[400px]"
                style={{
                    backgroundImage: domainProfile.domainProfilePictureUrl 
                        ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url(${domainProfile.domainProfilePictureUrl})`
                        : `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.3)), url(/assets/bourillon-orleans-entrance.webp)`,
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
                        <Link href={`/region/${unwrappedParams.name}`} className="hover:text-white transition-colors">
                            <span>{decodeURIComponent(unwrappedParams.name)}</span>
                        </Link>
                        {location?.city && (
                            <>
                                <span className="mx-2">&gt;</span>
                                <MapPin className="w-4 h-4 mr-2" />
                                <span>{location.city}</span>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Title Section */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                        {domainProfile.domainName}
                    </h1>
                    <p className="text-lg text-gray-600">
                        {decodeURIComponent(unwrappedParams.name)}
                        {location?.city && ` > ${location.city}`}
                    </p>
                </div>

                {/* About Section */}
                {domainProfile.domainDescription && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">À propos du domaine</h2>
                        <p className="text-gray-700 leading-relaxed">
                            {domainProfile.domainDescription}
                        </p>
                    </section>
                )}

                {/* Experiences Section */}
                {domainProfile.services && domainProfile.services.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-8">Les expériences à découvrir</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {domainProfile.services
                                .filter(service => service.isActive)
                                .map((service) => (
                                    <div key={service._id} className="bg-white rounded-lg shadow-sm border overflow-hidden flex flex-col">
                                        {service.serviceBannerUrl && (
                                            <img
                                                src={service.serviceBannerUrl}
                                                alt={service.name}
                                                className="w-full h-48 object-cover"
                                            />
                                        )}
                                        <div className="p-5 flex flex-col flex-1">
                                            <h3 className="text-lg font-bold text-primary mb-3">
                                                {service.name}
                                            </h3>

                                            <div className="grid grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <Euro className="w-4 h-4 mr-1 text-primary" />
                                                    <span>{service.pricePerPerson} €</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className="w-4 h-4 mr-1 text-primary">🍷</span>
                                                    <span>{service.numberOfWinesTasted} vins</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="w-4 h-4 mr-1 text-primary" />
                                                    <span>{service.timeOfServiceInMinutes} minutes</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Users className="w-4 h-4 mr-1 text-primary" />
                                                    <span>{service.numberOfPeople}</span>
                                                </div>
                                            </div>

                                            {service.languagesOffered && service.languagesOffered.length > 0 && (
                                                <div className="flex items-center gap-3 mb-3 flex-wrap">
                                                    {service.languagesOffered.map((lang, idx) => (
                                                        <div key={idx} className="flex items-center text-xs text-gray-600">
                                                            <Languages className="w-3 h-3 mr-1" />
                                                            <span>{lang}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <p className="text-gray-700 text-sm leading-relaxed mb-4 flex-1">
                                                {service.description}
                                            </p>

                                            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                                                Réserver
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </section>
                )}

                {/* Location Section */}
                {location && location.domainLatitude && location.domainLongitude && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Localisation</h2>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <DomainMap
                                latitude={location.domainLatitude}
                                longitude={location.domainLongitude}
                                domainName={domainProfile.domainName}
                                address={location.address || undefined}
                                city={location.city || undefined}
                                codePostal={location.codePostal || undefined}
                            />
                        </div>
                    </section>
                )}

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
                        onClick={() => router.push(`/region/${unwrappedParams.name}`)}
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