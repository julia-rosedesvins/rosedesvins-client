'use client';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Wine, Euro, Users, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ReservationPage({ params }: { params: Promise<{ id: string, service_id: string }> }) {
    const [id, setId] = useState<string>('');
    const [serviceId, setServiceId] = useState<string>('');
    const [showFullText, setShowFullText] = useState(false);
    
    useEffect(() => {
        params.then(({ id, service_id }) => {
            setId(id);
            setServiceId(service_id);
        });
    }, [params]);
    
    const fullText = "Une expérience unique avec la visite libre de notre cave troglodytique sculptée, suivie d'une dégustation commentée de 5 vins dans notre caveau à l'ambiance feutré, éclairé à la bougie.";
    const truncatedText = "Une expérience unique avec la visite libre de notre cave troglodytique sculptée, suivie d'une dégustation commentée...";

    if (!id) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#3A7E53' }}>
                        Réserver son expérience
                    </h1>
                </div>

                {/* Main Content Card */}
                <Card className="overflow-hidden shadow-lg bg-card">
                    {/* Hero Image */}
                    <div className="relative h-64 md:h-80 overflow-hidden">
                        <Image
                            src="/assets/wine-cellar.jpg"
                            alt="Cave troglodyte avec dégustation de vins"
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* <div className="absolute inset-0 bg-black bg-opacity-20 z-10"></div> */}
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: '#3A7E53' }}>
                            Visite libre & dégustation des cuvées Tradition
                        </h2>

                        <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                            {showFullText ? fullText : truncatedText}
                        </p>

                        <div className="mb-6">
                            <button
                                onClick={() => setShowFullText(!showFullText)}
                                className="hover:opacity-75 font-medium"
                                style={{ color: '#3A7E53' }}
                            >
                                {showFullText ? "Voir moins ▲" : "En savoir plus ▼"}
                            </button>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Clock className="w-8 h-8" style={{ color: '#3A7E53' }} />
                                <span className="font-medium text-xl">60 min</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Wine className="w-8 h-8" style={{ color: '#3A7E53' }} />
                                <span className="font-medium text-xl">5 vins</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Euro className="w-8 h-8" style={{ color: '#3A7E53' }} />
                                <span className="font-medium text-xl">5 € / personne</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Users className="w-8 h-8" style={{ color: '#3A7E53' }} />
                                <span className="font-medium text-xl">2-10 personne</span>
                            </div>
                        </div>

                        {/* Languages */}
                        <div className="flex items-center justify-center gap-8 mb-10">
                            <div className="flex items-center gap-3">
                                <span className="text-4xl">🇫🇷</span>
                                <span className="text-muted-foreground text-xl font-medium">Français</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-4xl">🇬🇧</span>
                                <span className="text-muted-foreground text-xl font-medium">English</span>
                            </div>
                        </div>

                        {/* Reserve Button */}
                        <div className="text-center">
                            <Link href={`/if/booking-widget/${id}/${serviceId}/booking`}>
                                <Button
                                    size="lg"
                                    className="hover:opacity-90 text-white px-12 py-3 text-lg font-semibold rounded-md transition-colors"
                                    style={{ backgroundColor: '#3A7E53' }}
                                >
                                    Réserver
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
