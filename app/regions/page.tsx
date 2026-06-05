"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import LandingPageLayout from "@/components/LandingPageLayout";
import { regionService, Region } from "@/services/region.service";
import heroImg from "/public/assets/chablis-vignoble-bourgogne.webp";

function RegionsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('q');
    
    const [regions, setRegions] = useState<Region[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);
    const [totalRegions, setTotalRegions] = useState(0);

    useEffect(() => {
        const fetchRegions = async () => {
            try {
                setLoading(true);
                const limit = showAll ? 1000 : 15; // Load all or just 15
                const response = await regionService.getAllRegions({ page: 1, limit, isParent: true });
                
                let filteredRegions = response.data;
                
                // Filter by search query if provided
                if (searchQuery) {
                    filteredRegions = filteredRegions.filter(region =>
                        region.denom.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                }
                
                setRegions(filteredRegions);
                setTotalRegions(searchQuery ? filteredRegions.length : response.total);
            } catch (err: any) {
                console.error('Error fetching regions:', err);
                setError(err.message || 'Failed to load regions');
            } finally {
                setLoading(false);
            }
        };

        fetchRegions();
    }, [showAll, searchQuery]);

    const handleViewAll = () => {
        setShowAll(true);
    };

    return (
        <>
            {/* Hero Section */}
            <section className="relative text-white min-h-[300px]" style={{ transform: 'scaleX(-1)' }}>
                {/* Background image */}
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src={heroImg}
                        alt=""
                        fill
                        priority
                        quality={85}
                        placeholder="blur"
                        className="object-cover object-[center_0%]"
                        sizes="100vw"
                    />
                    {/* Green gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[rgba(59,130,91,0.7)] to-[rgba(59,130,91,0.5)]" />
                </div>
                {/* Back Button */}
                <div
                    className="relative z-10 max-w-6xl mx-auto px-4 pt-4"
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
                    className="relative z-10 max-w-6xl mx-auto px-4 pb-12 pt-8 flex items-center min-h-[250px]"
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
                    {searchQuery && (
                        <div className="mb-8 text-center">
                            <p className="text-lg text-gray-600">
                                Résultats de recherche pour : <span className="font-semibold text-[#318160]">&quot;{searchQuery}&quot;</span>
                            </p>
                        </div>
                    )}
                    
                    <h2 className="text-2xl md:text-3xl font-bold text-[#318160] mb-12 text-center">
                        Les régions viticoles françaises
                    </h2>

                    {loading ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
                            {Array.from({ length: 15 }).map((_, index) => (
                                <div key={index} className="flex flex-col items-center text-center animate-pulse">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 mb-4"></div>
                                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <p className="text-lg text-red-600">{error}</p>
                        </div>
                    ) : regions.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-lg text-gray-600">
                                {searchQuery ? `Aucune région trouvée pour "${searchQuery}"` : 'Aucune région disponible'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
                                {regions.map((region) => (
                                    <div key={region._id} className="flex flex-col items-center text-center">
                                        <Link 
                                            href={`/region/${encodeURIComponent(region.denom)}`} 
                                            className="flex flex-col items-center text-center hover:transform hover:scale-105 transition-transform"
                                        >
                                            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-4 shadow-lg">
                                                <Image
                                                    src={region.thumbnailUrl || "/assets/loire-valley-new.jpg"}
                                                    alt={region.denom}
                                                    fill
                                                    sizes="(max-width: 768px) 128px, 160px"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <h3 className="text-[#318160] font-semibold text-lg hover:text-[#1D6346]">
                                                {region.denom}
                                            </h3>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <div className="text-center mt-16">
                                {!showAll && totalRegions > 15 && (
                                    <Button 
                                        onClick={handleViewAll}
                                        className="bg-[#318160] hover:bg-[#1D6346] text-white px-8 py-3 rounded-lg font-semibold"
                                    >
                                        Voir tous les domaines ({totalRegions})
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </section>
        </>
    );
}

export default function Regions() {
    return (
        <LandingPageLayout>
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-600">Chargement...</p>
                </div>
            }>
                <RegionsContent />
            </Suspense>
        </LandingPageLayout>
    );
}