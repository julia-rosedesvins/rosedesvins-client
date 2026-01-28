"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Home, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import LandingPageLayout from "@/components/LandingPageLayout";
import { useEffect, useState, use } from "react";
import { regionService, type Domain, type Region } from "@/services/region.service";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues
const RegionMap = dynamic(() => import('@/components/RegionMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-200 flex items-center justify-center">Chargement de la carte...</div>
});

const LoireValley = ({ params }: { params: Promise<{ name: string }> }) => {
    const router = useRouter();
    const resolvedParams = use(params);
    const [region, setRegion] = useState<Region | null>(null);
    const [domains, setDomains] = useState<Domain[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const limit = 5;

    useEffect(() => {
        const fetchRegionData = async () => {
            try {
                setIsLoading(true);
                const response = await regionService.getRegionByName(resolvedParams.name, currentPage, limit);
                setRegion(response.region);
                setDomains(response.domains);
                setTotalPages(response.totalPages);
            } catch (error: any) {
                console.error('Error fetching region data:', error);
                toast.error('Erreur lors du chargement des données');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRegionData();
    }, [resolvedParams.name, currentPage]);

    const filters = [
        { name: "Date", active: true },
        { name: "Visiteurs", active: false },
        { name: "Prix", active: false },
        { name: "Langues", active: false },
        { name: "Expériences", active: false },
    ];

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of listings
        document.querySelector('.overflow-y-auto')?.scrollTo(0, 0);
    };

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
                        <span>{region?.denom || resolvedParams.name}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-6xl mx-auto px-4 pb-12">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                        {region?.denom || resolvedParams.name} : sur la route des vins<br />
                        et des châteaux
                    </h1>
                    <p className="text-lg md:text-xl max-w-4xl leading-relaxed">
                        Au cœur d'un patrimoine exceptionnel, découvrez la diversité des terroirs
                        de {region?.denom || resolvedParams.name} et échangez avec des vignerons passionnés. Entre caves
                        troglodytiques, châteaux et paysages inscrits à l'UNESCO, vivez des expériences
                        œnotouristiques inoubliables dans la région de {region?.denom || resolvedParams.name}.
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
                    {region && (
                        <RegionMap
                            centerLat={(region.min_lat + region.max_lat) / 2}
                            centerLon={(region.min_lon + region.max_lon) / 2}
                            domains={domains}
                        />
                    )}
                </div>

                {/* Winemaker Listings - 40% - scrollable */}
                <div className="lg:w-[40%] bg-muted/30 p-6 overflow-y-auto">
                    {isLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} className="bg-background rounded-lg shadow-sm overflow-hidden">
                                    <Skeleton className="w-full h-40" />
                                    <div className="p-4 space-y-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <Skeleton className="h-6 w-3/4" />
                                            <Skeleton className="h-9 w-24" />
                                        </div>
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-4 w-20" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-3 w-full" />
                                            <Skeleton className="h-3 w-full" />
                                            <Skeleton className="h-3 w-3/4" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {domains.map((domain, index) => {
                                const CardWrapper = domain.producer === 'non-client' && domain.siteUrl
                                    ? ({ children }: { children: React.ReactNode }) => (
                                        <a
                                            href={domain.siteUrl!}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block hover:shadow-lg transition-shadow cursor-pointer"
                                        >
                                            {children}
                                        </a>
                                    )
                                    : domain.producer === 'client'
                                    ? ({ children }: { children: React.ReactNode }) => (
                                        <Link href={`/experience/${region?.denom}/${domain.domainId}`} className="block hover:shadow-lg transition-shadow cursor-pointer">
                                            {children}
                                        </Link>
                                    )
                                    : ({ children }: { children: React.ReactNode }) => (
                                        <div className="block hover:shadow-lg transition-shadow">
                                            {children}
                                        </div>
                                    );

                                return (
                                    <CardWrapper key={index}>
                                        <div className="bg-background rounded-lg shadow-sm overflow-hidden">
                                            {domain.domainProfilePictureUrl && (
                                                <img
                                                    src={domain.domainProfilePictureUrl}
                                                    alt={domain.domainName}
                                                    className="w-full h-40 object-cover"
                                                />
                                            )}
                                            <div className="p-4">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h3 className="text-lg font-bold text-primary">
                                                        {domain.domainName}
                                                    </h3>
                                                    {domain.producer === 'client' && (
                                                        <Button
                                                            size="sm"
                                                            className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            Réserver
                                                        </Button>
                                                    )}
                                                </div>
                                                {domain.location && (
                                                    <p className="text-muted-foreground text-sm mb-2">{domain.location}</p>
                                                )}
                                                {domain.domainPrice !== null && (
                                                    <div className="flex items-center mb-3">
                                                        <Euro className="w-4 h-4 mr-1 text-muted-foreground" />
                                                        <span className="text-muted-foreground">{domain.domainPrice}</span>
                                                    </div>
                                                )}
                                                <p className="text-foreground/80 text-sm leading-relaxed line-clamp-3">
                                                    {domain.domainDescription}
                                                </p>
                                            </div>
                                        </div>
                                    </CardWrapper>
                                );
                            })}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 pt-4 flex-wrap">
                                    {/* Previous Button */}
                                    <Button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        variant="outline"
                                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Précédent
                                    </Button>

                                    {/* First Page */}
                                    {currentPage > 3 && (
                                        <>
                                            <Button
                                                onClick={() => handlePageChange(1)}
                                                variant="outline"
                                                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-lg font-semibold"
                                            >
                                                1
                                            </Button>
                                            {currentPage > 4 && (
                                                <span className="px-2 text-muted-foreground">...</span>
                                            )}
                                        </>
                                    )}

                                    {/* Page Numbers Around Current Page */}
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(page => {
                                            return page === currentPage ||
                                                   page === currentPage - 1 ||
                                                   page === currentPage - 2 ||
                                                   page === currentPage + 1 ||
                                                   page === currentPage + 2;
                                        })
                                        .map((page) => (
                                            <Button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                variant={currentPage === page ? "default" : "outline"}
                                                className={currentPage === page 
                                                    ? "bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-semibold"
                                                    : "border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-lg font-semibold"
                                                }
                                            >
                                                {page}
                                            </Button>
                                        ))}

                                    {/* Last Page */}
                                    {currentPage < totalPages - 2 && (
                                        <>
                                            {currentPage < totalPages - 3 && (
                                                <span className="px-2 text-muted-foreground">...</span>
                                            )}
                                            <Button
                                                onClick={() => handlePageChange(totalPages)}
                                                variant="outline"
                                                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-lg font-semibold"
                                            >
                                                {totalPages}
                                            </Button>
                                        </>
                                    )}

                                    {/* Next Button */}
                                    <Button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        variant="outline"
                                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Suivant
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </LandingPageLayout>
    );
};

export default LoireValley;