"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Home, Euro, ChevronDown, Locate, Map, List, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import LandingPageLayout from "@/components/LandingPageLayout";
import { useEffect, useState, use, useRef } from "react";
import { regionService, type Domain, type Region } from "@/services/region.service";
import { adminExperienceCategoriesService, ExperienceCategory } from "@/services/admin-experience-categories.service";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";
import { DatePicker } from "@/components/DatePicker";
import type { RegionMapRef } from "@/components/RegionMap";

// Dynamically import the map component to avoid SSR issues
const RegionMap = dynamic(() => import('@/components/RegionMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-200 flex items-center justify-center">Chargement de la carte...</div>
});

const LoireValley = ({ params }: { params: Promise<{ name: string }> }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('q');
    const resolvedParams = use(params);
    const [region, setRegion] = useState<Region | null>(null);
    const [domains, setDomains] = useState<Domain[]>([]); // Paginated domains for list view
    const [allMapDomains, setAllMapDomains] = useState<Domain[]>([]); // All domains for map view
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const mapRef = useRef<RegionMapRef>(null);
    const limit = 5;

    // Mobile view states
    const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
    const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
    const [isAroundMeActive, setIsAroundMeActive] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);

    // Filter states
    const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [priceRange, setPriceRange] = useState<number>(0);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
    const [experienceCategories, setExperienceCategories] = useState<ExperienceCategory[]>([]);

    const languages = ['Français', 'English', 'Deutsch', 'Español', 'Italiano'];
    const priceOptions = [0, 5, 10, 15, 20];

    // Fetch experience categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const activeCategories = await adminExperienceCategoriesService.getActiveCategories();
                setExperienceCategories(activeCategories);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    // Fetch all domains for map (with filters)
    useEffect(() => {
        const fetchAllMapDomains = async () => {
            try {
                // Build filter params
                const filters: any = {};
                if (selectedDate) {
                    filters.date = selectedDate.toISOString();
                }
                if (priceRange > 0) {
                    if (priceRange === 20) {
                        filters.minPrice = 20;
                    } else {
                        filters.maxPrice = priceRange;
                    }
                }
                if (selectedLanguages.length > 0) {
                    filters.languages = selectedLanguages;
                }
                if (selectedExperiences.length > 0) {
                    filters.categories = selectedExperiences;
                }
                
                // Fetch all domains for map with high limit
                const mapResponse = await regionService.getRegionByName(
                    resolvedParams.name, 
                    1, 
                    1000, // High limit to get all domains
                    searchQuery || undefined,
                    Object.keys(filters).length > 0 ? filters : undefined
                );
                setAllMapDomains(mapResponse.domains);
            } catch (error: any) {
                console.error('Error fetching map domains:', error);
            }
        };

        fetchAllMapDomains();
    }, [resolvedParams.name, searchQuery, selectedDate, priceRange, selectedLanguages, selectedExperiences]);

    // Fetch paginated domains for list view
    useEffect(() => {
        const fetchRegionData = async () => {
            try {
                setIsLoading(true);
                setIsMapLoaded(false);
                
                // Build filter params
                const filters: any = {};
                if (selectedDate) {
                    filters.date = selectedDate.toISOString();
                }
                if (priceRange > 0) {
                    // If priceRange is 20, it means "20€+" (minimum price)
                    // Otherwise, it means "up to X€" (maximum price)
                    if (priceRange === 20) {
                        filters.minPrice = 20;
                    } else {
                        filters.maxPrice = priceRange;
                    }
                }
                if (selectedLanguages.length > 0) {
                    filters.languages = selectedLanguages;
                }
                if (selectedExperiences.length > 0) {
                    filters.categories = selectedExperiences;
                }
                
                const response = await regionService.getRegionByName(
                    resolvedParams.name, 
                    currentPage, 
                    limit,
                    searchQuery || undefined,
                    Object.keys(filters).length > 0 ? filters : undefined
                );
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
    }, [resolvedParams.name, currentPage, searchQuery, selectedDate, priceRange, selectedLanguages, selectedExperiences]);

    const toggleFilter = (filterName: string) => {
        setExpandedFilter(expandedFilter === filterName ? null : filterName);
    };

    const toggleLanguage = (language: string) => {
        setSelectedLanguages(prev => 
            prev.includes(language) ? prev.filter(l => l !== language) : [...prev, language]
        );
    };

    const toggleExperience = (categoryId: string) => {
        setSelectedExperiences(prev => 
            prev.includes(categoryId) ? prev.filter(e => e !== categoryId) : [...prev, categoryId]
        );
    };

    const clearFilters = () => {
        setSelectedDate(null);
        setPriceRange(0);
        setSelectedLanguages([]);
        setSelectedExperiences([]);
        setExpandedFilter(null);
        setCurrentPage(1); // Reset to first page when clearing filters
    };

    const hasActiveFilters = selectedDate !== null || priceRange > 0 || selectedLanguages.length > 0 || selectedExperiences.length > 0;

    // Reset to page 1 when filters change
    useEffect(() => {
        if (hasActiveFilters) {
            setCurrentPage(1);
        }
    }, [selectedDate, priceRange, selectedLanguages, selectedExperiences]);

    // Close filter dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.filter-dropdown-container')) {
                setExpandedFilter(null);
            }
        };

        if (expandedFilter) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [expandedFilter]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of listings
        document.querySelector('.overflow-y-auto')?.scrollTo(0, 0);
    };

    const handleLocateDomain = (domainId: string | null) => {
        if (mapRef.current && domainId) {
            mapRef.current.focusOnDomain(domainId);
        }
    };

    const handleAroundMe = () => {
        if (isAroundMeActive) {
            // Turn off "Around me"
            setIsAroundMeActive(false);
            setUserLocation(null);
            return;
        }

        // Get user's location
        if (!navigator.geolocation) {
            toast.error('La géolocalisation n\'est pas supportée par votre navigateur');
            return;
        }

        setIsGettingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lon: longitude });
                setIsAroundMeActive(true);
                setIsGettingLocation(false);
                toast.success('Localisation activée');
            },
            (error) => {
                setIsGettingLocation(false);
                console.error('Geolocation error:', error);
                toast.error('Impossible d\'obtenir votre localisation');
            }
        );
    };

    // Calculate distance between two coordinates (Haversine formula)
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    // Filter domains based on user location for both map and list
    const filteredMapDomains = isAroundMeActive && userLocation
        ? allMapDomains
            .map(domain => ({
                ...domain,
                distance: domain.latitude && domain.longitude
                    ? calculateDistance(userLocation.lat, userLocation.lon, domain.latitude, domain.longitude)
                    : Infinity
            }))
            .filter(domain => domain.distance <= 50) // Within 50km
            .sort((a, b) => a.distance - b.distance)
        : allMapDomains;

    const filteredListDomains = isAroundMeActive && userLocation
        ? domains
            .map(domain => ({
                ...domain,
                distance: domain.latitude && domain.longitude
                    ? calculateDistance(userLocation.lat, userLocation.lon, domain.latitude, domain.longitude)
                    : Infinity
            }))
            .filter(domain => domain.distance <= 50) // Within 50km
            .sort((a, b) => a.distance - b.distance)
        : domains;

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
                    {searchQuery && (
                        <div className="mb-4">
                            <p className="text-white/90 text-lg">
                                Résultats de recherche pour : <span className="font-semibold">&quot;{searchQuery}&quot;</span>
                            </p>
                        </div>
                    )}
                    
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

            <section className="bg-background py-4 px-4 border-b sticky top-[60px] z-20 shadow-sm">
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-3">
                        {/* Date Filter - Quand? */}
                        <div className="relative filter-dropdown-container">
                            <Button
                                variant={selectedDate !== null ? "default" : "outline"}
                                className={`rounded-full ${
                                    selectedDate !== null
                                        ? "bg-primary text-primary-foreground"
                                        : "border-border text-foreground hover:bg-muted"
                                }`}
                                onClick={() => toggleFilter('date')}
                            >
                                {selectedDate ? selectedDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }) : 'Quand ?'}
                                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${
                                    expandedFilter === 'date' ? 'rotate-180' : ''
                                }`} />
                            </Button>
                            {expandedFilter === 'date' && (
                                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-30 w-[340px] sm:w-[380px]">
                                    <DatePicker
                                        selectedDate={selectedDate}
                                        onDateSelect={setSelectedDate}
                                        colorCode="#3A7E53"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Price Filter - Prix */}
                        <div className="relative filter-dropdown-container">
                            <Button
                                variant={priceRange > 0 ? "default" : "outline"}
                                className={`rounded-full ${
                                    priceRange > 0
                                        ? "bg-primary text-primary-foreground"
                                        : "border-border text-foreground hover:bg-muted"
                                }`}
                                onClick={() => toggleFilter('price')}
                            >
                                Prix
                                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${
                                    expandedFilter === 'price' ? 'rotate-180' : ''
                                }`} />
                            </Button>
                            {expandedFilter === 'price' && (
                                <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-30 min-w-[250px]">
                                    <p className="text-sm font-semibold mb-3 text-gray-700">Prix maximum (€)</p>
                                    <div className="space-y-2">
                                        {priceOptions.map((price) => (
                                            <div key={price} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`price-${price}`}
                                                    checked={priceRange === price}
                                                    onCheckedChange={() => setPriceRange(price)}
                                                />
                                                <label
                                                    htmlFor={`price-${price}`}
                                                    className="text-sm cursor-pointer select-none"
                                                >
                                                    {price === 0 ? 'Tous les prix' : price === 20 ? '20€+' : `Jusqu'à ${price}€`}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Languages Filter - Langues */}
                        <div className="relative filter-dropdown-container">
                            <Button
                                variant={selectedLanguages.length > 0 ? "default" : "outline"}
                                className={`rounded-full ${
                                    selectedLanguages.length > 0
                                        ? "bg-primary text-primary-foreground"
                                        : "border-border text-foreground hover:bg-muted"
                                }`}
                                onClick={() => toggleFilter('languages')}
                            >
                                Langues
                                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${
                                    expandedFilter === 'languages' ? 'rotate-180' : ''
                                }`} />
                            </Button>
                            {expandedFilter === 'languages' && (
                                <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-30 min-w-[250px]">
                                    <p className="text-sm font-semibold mb-3 text-gray-700">Langues disponibles</p>
                                    <div className="space-y-2">
                                        {languages.map((language) => (
                                            <div key={language} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`lang-${language}`}
                                                    checked={selectedLanguages.includes(language)}
                                                    onCheckedChange={() => toggleLanguage(language)}
                                                />
                                                <label
                                                    htmlFor={`lang-${language}`}
                                                    className="text-sm cursor-pointer select-none"
                                                >
                                                    {language}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Experience Type Filter - Expérience */}
                        <div className="relative filter-dropdown-container">
                            <Button
                                variant={selectedExperiences.length > 0 ? "default" : "outline"}
                                className={`rounded-full ${
                                    selectedExperiences.length > 0
                                        ? "bg-primary text-primary-foreground"
                                        : "border-border text-foreground hover:bg-muted"
                                }`}
                                onClick={() => toggleFilter('experience')}
                            >
                                Expérience
                                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${
                                    expandedFilter === 'experience' ? 'rotate-180' : ''
                                }`} />
                            </Button>
                            {expandedFilter === 'experience' && (
                                <div className="absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-30 min-w-[250px]">
                                    <p className="text-sm font-semibold mb-3 text-gray-700">Type d&apos;expérience</p>
                                    <div className="space-y-2">
                                        {experienceCategories.map((category) => (
                                            <div key={category._id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`exp-${category._id}`}
                                                    checked={selectedExperiences.includes(category._id)}
                                                    onCheckedChange={() => toggleExperience(category._id)}
                                                />
                                                <label
                                                    htmlFor={`exp-${category._id}`}
                                                    className="text-sm cursor-pointer select-none"
                                                >
                                                    {category.category_name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Clear Filters Button */}
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted"
                                onClick={clearFilters}
                            >
                                Effacer les filtres
                            </Button>
                        )}
                    </div>
                </div>
            </section>

            {/* Split Layout: Map + Listings - fills remaining viewport */}
            <section className="flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 140px)' }}>
                {/* Interactive Map - 60% */}
                <div className={`${mobileView === 'map' ? 'block' : 'hidden'} md:block lg:w-[60%] h-[600px] lg:h-full lg:sticky lg:top-[140px] relative z-10`}>
                    {!isMapLoaded && (
                        <div className="absolute inset-0 bg-white z-20 flex items-center justify-center">
                            <div className="text-center">
                                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#318160] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                                    <span className="sr-only">Chargement...</span>
                                </div>
                                <p className="mt-4 text-[#318160] font-medium">Chargement de la carte...</p>
                            </div>
                        </div>
                    )}
                    {region && (
                        <RegionMap
                            ref={mapRef}
                            centerLat={userLocation?.lat || (region.min_lat + region.max_lat) / 2}
                            centerLon={userLocation?.lon || (region.min_lon + region.max_lon) / 2}
                            domains={isAroundMeActive ? filteredMapDomains : allMapDomains}
                            onMapLoad={() => setIsMapLoaded(true)}
                        />
                    )}
                </div>

                {/* Winemaker Listings - 40% - scrollable */}
                <div className={`${mobileView === 'list' ? 'block' : 'hidden'} md:block lg:w-[40%] bg-muted/30 p-6 overflow-y-auto pb-24 md:pb-6`}>
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
                            {filteredListDomains.map((domain, index) => {
                                return (
                                    <div key={index} className="bg-background rounded-lg shadow-sm overflow-hidden">
                                        {(domain.mainImage || domain.domainProfilePictureUrl) && (
                                            <img
                                                src={domain.mainImage || domain.domainProfilePictureUrl || ''}
                                                alt={domain.domainName}
                                                className="w-full h-40 object-cover"
                                            />
                                        )}
                                        <div className="p-4">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="text-lg font-bold text-primary">
                                                    {domain.domainName}
                                                </h3>
                                                {domain.domainId && (
                                                    <Link href={`/experience/${region?.denom}/${domain.domainId}`}>
                                                        <Button
                                                            size="sm"
                                                            className="bg-primary hover:bg-primary/90 text-white shrink-0"
                                                        >
                                                            Voir le site
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                            {domain.category && (
                                                <p className="text-muted-foreground text-sm mb-2">{domain.category}</p>
                                            )}
                                            {domain.domainPrice !== null && (
                                                <div className="flex items-center mb-3">
                                                    <Euro className="w-4 h-4 mr-1 text-muted-foreground" />
                                                    <span className="text-muted-foreground">{domain.domainPrice}</span>
                                                </div>
                                            )}
                                            <p className="text-foreground/80 text-sm leading-relaxed line-clamp-3 mb-3">
                                                {domain.domainDescription}
                                            </p>
                                            {domain.latitude && domain.longitude && (
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            // On mobile, switch to map view
                                                            setMobileView('map');
                                                            // Small delay to ensure map is rendered before focusing
                                                            setTimeout(() => {
                                                                handleLocateDomain(domain.domainId);
                                                            }, 100);
                                                        }}
                                                        className="text-primary hover:underline text-sm flex items-center gap-1"
                                                    >
                                                        <Locate className="w-3 h-3" />
                                                        Localiser
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
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

                {/* Mobile Floating Controls */}
                <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-3 bg-white rounded-full shadow-lg px-4 py-3 border border-gray-200">
                    {/* Map/List Toggle */}
                    <Button
                        variant={mobileView === 'map' ? "default" : "ghost"}
                        size="sm"
                        className={`rounded-full ${
                            mobileView === 'map'
                                ? "bg-primary text-white"
                                : "text-foreground hover:bg-muted"
                        }`}
                        onClick={() => setMobileView(mobileView === 'map' ? 'list' : 'map')}
                    >
                        {mobileView === 'map' ? (
                            <>
                                <List className="w-4 h-4 mr-2" />
                                Liste
                            </>
                        ) : (
                            <>
                                <Map className="w-4 h-4 mr-2" />
                                Carte
                            </>
                        )}
                    </Button>

                    {/* Divider */}
                    <div className="h-8 w-px bg-gray-300"></div>

                    {/* Around Me Button */}
                    <Button
                        variant={isAroundMeActive ? "default" : "ghost"}
                        size="sm"
                        className={`rounded-full ${
                            isAroundMeActive
                                ? "bg-primary text-white"
                                : "text-foreground hover:bg-muted"
                        }`}
                        onClick={handleAroundMe}
                        disabled={isGettingLocation}
                    >
                        {isGettingLocation ? (
                            <>
                                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                                Localisation...
                            </>
                        ) : (
                            <>
                                <Navigation className="w-4 h-4 mr-2" />
                                Autour de moi
                            </>
                        )}
                    </Button>
                </div>
            </section>
        </LandingPageLayout>
    );
};

export default LoireValley;