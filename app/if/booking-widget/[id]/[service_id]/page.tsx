'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WidgetProvider, useWidget } from "@/contexts/WidgetContext";
import { useEffect, useState } from "react";

function BookingWidgetContent({ id, serviceId }: { id: string; serviceId: string }) {
    const { widgetData, loading, error, colorCode } = useWidget();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#E8D6C9]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: colorCode }}></div>
                    <p className="text-lg">Chargement...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#E8D6C9]">
                <div className="text-center">
                    <h1 className="mb-4 text-2xl font-bold text-red-600">Erreur</h1>
                    <p className="text-lg text-gray-600 mb-8">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#E8D6C9]">
            <div className="text-center">
                <h1 className="mb-4 text-4xl font-bold" style={{ color: colorCode }}>
                    {widgetData?.service?.name || 'Expériences Vinicoles'}
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                    {widgetData?.service?.description || 'Découvrez nos caves et dégustations authentiques'}
                </p>
                <Link href={`/if/booking-widget/${id}/${serviceId}/reservation`}>
                    <Button 
                        size="lg" 
                        className="text-white px-8 py-3 text-lg hover:opacity-90"
                        style={{ 
                            backgroundColor: colorCode,
                            borderColor: colorCode
                        }}
                    >
                        Voir nos expériences
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default function BookingWidgetPage(
    { params }: { params: Promise<{ id: string, service_id: string }> }
) {
    const [resolvedParams, setResolvedParams] = useState<{ id: string, service_id: string } | null>(null);

    useEffect(() => {
        params.then(setResolvedParams);
    }, [params]);

    if (!resolvedParams) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#E8D6C9]">
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
            <BookingWidgetContent id={id} serviceId={service_id} />
        </WidgetProvider>
    );
}
