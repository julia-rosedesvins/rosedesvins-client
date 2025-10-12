'use client';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, Wine, Euro, Users, MapPin } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { WidgetProvider, useWidget } from "@/contexts/WidgetContext";

function ReservationContent({ id, serviceId }: { id: string, serviceId: string }) {
    const { widgetData, loading, error, colorCode } = useWidget();
    const [showFullText, setShowFullText] = useState(false);
    
    const fullText = widgetData?.service?.description || "";
    const truncatedText = fullText.length > 200 ? fullText.substring(0, 200) + "..." : fullText;

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: colorCode }}></div>
                    <p className="text-lg">Chargement...</p>
                </div>
            </div>
        );
    }

    // Don't show error screen - continue with normal flow but calendar will be disabled

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: colorCode }}>
                        Réserver son expérience
                    </h1>
                </div>

                {/* Main Content Card */}
                <Card className="overflow-hidden shadow-lg bg-card">
                    {/* Hero Image */}
                    {widgetData?.domainProfile?.domainProfilePictureUrl && (
                        <div className="relative h-64 md:h-80 overflow-hidden">
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${widgetData.domainProfile.domainProfilePictureUrl}`}
                                alt="Cave troglodyte avec dégustation de vins"
                                className="w-full h-full object-cover"
                                loading="eager"
                            />
                            {/* <div className="absolute inset-0 bg-black bg-opacity-20 z-10"></div> */}
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6 md:p-8">
                        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: colorCode }}>
                            {widgetData?.service?.name || 'Visite libre & dégustation des cuvées Tradition'}
                        </h2>

                        <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                            {showFullText ? fullText : truncatedText}
                        </p>

                        {fullText.length > 150 && (
                            <div className="mb-6">
                                <button
                                    onClick={() => setShowFullText(!showFullText)}
                                    className="hover:opacity-75 font-medium"
                                    style={{ color: colorCode }}
                                >
                                    {showFullText ? "Voir moins ▲" : "En savoir plus ▼"}
                                </button>
                            </div>
                        )}

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                                <Clock className="w-6 h-6 flex-shrink-0" style={{ color: colorCode }} />
                                <span className="font-medium text-sm md:text-base whitespace-nowrap overflow-hidden text-ellipsis">
                                    {widgetData?.service?.timeOfServiceInMinutes || 60} min
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                                <Wine className="w-6 h-6 flex-shrink-0" style={{ color: colorCode }} />
                                <span className="font-medium text-sm md:text-base whitespace-nowrap overflow-hidden text-ellipsis">
                                    {widgetData?.service?.numberOfWinesTasted || 5} vins
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                                <Euro className="w-6 h-6 flex-shrink-0" style={{ color: colorCode }} />
                                <span className="font-medium text-sm md:text-base whitespace-nowrap overflow-hidden text-ellipsis">
                                    {widgetData?.service?.pricePerPerson || 5} € / personnes
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground min-w-0">
                                <Users className="w-6 h-6 flex-shrink-0" style={{ color: colorCode }} />
                                <span className="font-medium text-sm md:text-base whitespace-nowrap overflow-hidden text-ellipsis">
                                    {widgetData?.service?.numberOfPeople || '2-10'} personnes
                                </span>
                            </div>
                        </div>

                        {/* Languages */}
                        <div className="flex items-center justify-center gap-8 mb-10">
                            {widgetData?.service?.languagesOffered?.map((language, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <span className="text-4xl">
                                        {language.toLowerCase() === 'français' || language.toLowerCase() === 'french' ? '🇫🇷' : 
                                         language.toLowerCase() === 'anglais' || language.toLowerCase() === 'english' ? '🇬🇧' : 
                                         language.toLowerCase() === 'español' || language.toLowerCase() === 'spanish' ? '🇪🇸' : 
                                         language.toLowerCase() === 'deutsch' || language.toLowerCase() === 'german' ? '🇩🇪' : '🌐'}
                                    </span>
                                    <span className="text-muted-foreground text-xl font-medium">{language}</span>
                                </div>
                            )) || (
                                <>
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl">🇫🇷</span>
                                        <span className="text-muted-foreground text-xl font-medium">Français</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl">🇬🇧</span>
                                        <span className="text-muted-foreground text-xl font-medium">Anglais</span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Reserve Button */}
                        <div className="text-center">
                            <Link href={`/if/booking-widget/${id}/${serviceId}/booking`}>
                                <Button
                                    size="lg"
                                    className="hover:opacity-90 text-white px-12 py-3 text-lg font-semibold rounded-md transition-colors"
                                    style={{ backgroundColor: colorCode }}
                                >
                                    Réserver
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default function ReservationPage({ params }: { params: Promise<{ id: string, service_id: string }> }) {
    const [resolvedParams, setResolvedParams] = useState<{ id: string, service_id: string } | null>(null);

    useEffect(() => {
        params.then(setResolvedParams);
    }, [params]);

    if (!resolvedParams) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A7E53] mx-auto mb-4"></div>
                    <p className="text-lg">Chargement...</p>
                </div>
            </div>
        );
    }

    const { id, service_id } = resolvedParams;

    return (
        <WidgetProvider userId={id} serviceId={service_id}>
            <ReservationContent id={id} serviceId={service_id} />
        </WidgetProvider>
    );
}
