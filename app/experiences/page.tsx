'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LandingPageLayout from "@/components/LandingPageLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { domainProfileService, PublicService } from "@/services/domain-profile.service";
import { adminExperienceCategoriesService, ExperienceCategory } from "@/services/admin-experience-categories.service";

function ExperiencesContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q');
  
  const [services, setServices] = useState<PublicService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const limit = 12;

  // Filter states
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [selectedExperiences, setSelectedExperiences] = useState<string[]>([]);
  const [experienceCategories, setExperienceCategories] = useState<ExperienceCategory[]>([]);

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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await domainProfileService.getAllPublicServices(
          page, 
          limit,
          selectedExperiences.length > 0 ? selectedExperiences : undefined
        );
        let filteredServices = response.data.services;
        
        // Filter by search query if provided
        if (searchQuery) {
          filteredServices = filteredServices.filter(service =>
            service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.serviceDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.domain.domainName?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        
        setServices(filteredServices);
        setTotalPages(response.data.pagination.totalPages);
        setHasMore(page < response.data.pagination.totalPages);
      } catch (err: any) {
        console.error('Error fetching services:', err);
        setError(err.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [page, searchQuery, selectedExperiences, selectedExperiences]);

  const toggleFilter = (filterName: string) => {
    setExpandedFilter(expandedFilter === filterName ? null : filterName);
  };

  const toggleExperience = (categoryId: string) => {
    setSelectedExperiences(prev => 
      prev.includes(categoryId) ? prev.filter(e => e !== categoryId) : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedExperiences([]);
    setExpandedFilter(null);
    setPage(1);
  };

  const hasActiveFilters = selectedExperiences.length > 0;

  // Reset to page 1 when filters change
  useEffect(() => {
    if (hasActiveFilters) {
      setPage(1);
    }
  }, [selectedExperiences]);

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

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
    return (
        <>
                  {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center text-white py-20"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.4)), url(/assets/wine-cellar.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-3xl">
            Des expériences façonnées par la passion des vignerons.
          </h1>
          <p className="text-lg md:text-xl max-w-4xl leading-relaxed">
            Visites de cave, dégustations, cours d'œnologie, balades à vélo, pique-nique 
            dans les vignes... : découvrez le vin directement auprès de ceux qui le créent 
            et vivez des moments authentiques. Chaque activité est une rencontre avec 
            un vigneron passionné et une façon unique de découvrir son univers.
          </p>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {searchQuery && (
            <div className="mb-8 text-center">
              <p className="text-lg text-gray-600">
                Résultats de recherche pour : <span className="font-semibold text-[#318160]">&quot;{searchQuery}&quot;</span>
              </p>
            </div>
          )}
          
          <h2 className="text-3xl md:text-4xl font-bold text-[#318160] text-center mb-8">
            Les activités œnotouristiques
          </h2>

          {/* Filter Section */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {/* Experience Type Filter */}
              <div className="relative filter-dropdown-container">
                <Button
                  variant={selectedExperiences.length > 0 ? "default" : "outline"}
                  className={`rounded-full ${
                    selectedExperiences.length > 0
                      ? "bg-[#318160] hover:bg-[#1D6346] text-white"
                      : "border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => toggleFilter('experience')}
                >
                  Type d&apos;expérience
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
                  className="rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={clearFilters}
                >
                  Effacer les filtres
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="text-center">
                  <Skeleton className="h-6 w-48 mx-auto mb-6" />
                  <Skeleton className="w-64 h-64 mx-auto rounded-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 text-lg">{error}</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-lg">Aucun service disponible pour le moment.</p>
            </div>
          ) : (
            <>
              {/* Activities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
                {services.map((service) => (
                  <Link 
                    key={service.serviceId} 
                    href={`/reservation/${service.domain.userId}/${service.serviceId}`}
                    className="text-center block hover:opacity-80 transition-opacity"
                  >
                    <h3 className="text-xl font-semibold text-[#318160] mb-6">
                      {service.serviceName}
                    </h3>
                    <div className="relative w-64 h-64 mx-auto mb-4">
                      <img
                        src={service.serviceBannerUrl || "/assets/default-service.jpg"}
                        alt={service.serviceName}
                        className="w-full h-full object-cover rounded-full border-4 border-[#318160]/20 shadow-lg"
                      />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mb-8">
                  <Button 
                    onClick={handlePrevPage}
                    disabled={page === 1}
                    className="bg-[#318160] hover:bg-[#1D6346] text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Précédent
                  </Button>
                  <span className="text-gray-700">
                    Page {page} sur {totalPages}
                  </span>
                  <Button 
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                    className="bg-[#318160] hover:bg-[#1D6346] text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Call to Action */}
          {hasMore && (
            <div className="text-center">
              <Button 
                onClick={handleLoadMore}
                className="bg-[#318160] hover:bg-[#1D6346] text-white px-8 py-3 rounded-lg font-semibold text-lg"
              >
                Voir plus de services
              </Button>
            </div>
          )}
        </div>
      </section>
        </>
    )
}

export default function Page() {
    return (
        <LandingPageLayout>
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-gray-600">Chargement...</p>
                </div>
            }>
                <ExperiencesContent />
            </Suspense>
        </LandingPageLayout>
    );
}