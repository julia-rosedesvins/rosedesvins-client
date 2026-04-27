'use client'
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2, MapPin, Wine, Building2 } from "lucide-react"
import { regionService } from "@/services/region.service"
import { citiesService } from "@/services/cities.service"
import toast from "react-hot-toast"

const HeroSection = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [suggestions, setSuggestions] = useState<any[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState(-1)
    const searchRef = useRef<HTMLDivElement>(null)
    const debounceTimer = useRef<NodeJS.Timeout | null>(null)
    const router = useRouter()

    // Fetch suggestions when search query changes
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current)
        }

        if (searchQuery.trim().length < 2) {
            setSuggestions([])
            setShowSuggestions(false)
            return
        }

        debounceTimer.current = setTimeout(async () => {
            try {
                setIsLoadingSuggestions(true)
                
                // Fetch both backend results and cities in parallel
                const [backendResult, citiesResult] = await Promise.all([
                    regionService.unifiedSearch(searchQuery),
                    citiesService.searchCities(searchQuery)
                ])
                
                const allSuggestions: any[] = []
                const seenCities = new Set<string>()
                const searchLower = searchQuery.toLowerCase()
                
                // Process cities from our backend
                if (citiesResult.success && citiesResult.data && citiesResult.data.length > 0) {
                    citiesResult.data.slice(0, 3).forEach((city: any) => {
                        if (!seenCities.has(city.nom_standard.toLowerCase())) {
                            seenCities.add(city.nom_standard.toLowerCase())
                            allSuggestions.push({
                                type: 'city',
                                name: city.nom_standard,
                                description: 'France',
                                icon: MapPin,
                                route: `/region/${encodeURIComponent(city.nom_standard)}`
                            })
                        }
                    })
                }
                
                // Add regions
                if (backendResult.data.regions && backendResult.data.regions.length > 0) {
                    backendResult.data.regions.slice(0, 2).forEach(region => {
                        allSuggestions.push({
                            type: 'region',
                            name: region.denom,
                            icon: MapPin,
                            route: `/region/${encodeURIComponent(region.denom)}`
                        })
                    })
                }
                
                // Add domains
                if (backendResult.data.domains && backendResult.data.domains.length > 0) {
                    backendResult.data.domains.slice(0, 2).forEach(domain => {
                        const regionName = domain.location?.region || domain.domainName || 'domaine'
                        const route = domain.domainId
                            ? `/experience/${encodeURIComponent(regionName)}/${domain.domainId}`
                            : '/regions'
                        allSuggestions.push({
                            type: 'domain',
                            name: domain.domainName,
                            description: domain.location?.city || '',
                            icon: Building2,
                            route: route,
                            domainId: domain.domainId
                        })
                    })
                }
                
                // Add services
                if (backendResult.data.services && backendResult.data.services.length > 0) {
                    backendResult.data.services.slice(0, 2).forEach(service => {
                        const route = service.domain?.domainId 
                            ? `/experience/${service.domain.domainId}`
                            : '/experiences'
                        allSuggestions.push({
                            type: 'service',
                            name: service.serviceName,
                            description: `${service.domain.domainName} - ${service.pricePerPerson}€`,
                            icon: Wine,
                            route: route
                        })
                    })
                }
                
                // Add static experiences
                if (backendResult.data.staticExperiences && backendResult.data.staticExperiences.length > 0) {
                    backendResult.data.staticExperiences.slice(0, 1).forEach(exp => {
                        const route = exp.website || '#'
                        allSuggestions.push({
                            type: 'experience',
                            name: exp.name,
                            description: exp.category || '',
                            icon: Wine,
                            route: route
                        })
                    })
                }
                
                setSuggestions(allSuggestions.slice(0, 8))
                setShowSuggestions(allSuggestions.length > 0)
            } catch (error) {
                console.error('Error fetching suggestions:', error)
            } finally {
                setIsLoadingSuggestions(false)
            }
        }, 300)

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current)
            }
        }
    }, [searchQuery])

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!searchQuery.trim()) {
            toast.error("Veuillez entrer un terme de recherche")
            return
        }

        try {
            setIsSearching(true)
            const startTime = Date.now()
            const result = await regionService.unifiedSearch(searchQuery)

            // Ensure minimum loading time of 800ms for better UX
            const elapsed = Date.now() - startTime
            const minLoadingTime = 800
            if (elapsed < minLoadingTime) {
                await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsed))
            }

            if (result.data.suggestedRoute) {
                router.push(result.data.suggestedRoute)
            } else {
                router.push(`/no-results?q=${encodeURIComponent(searchQuery)}`)
            }
        } catch (error: any) {
            console.error("Search error:", error)
            toast.error("Erreur lors de la recherche")
        } finally {
            setIsSearching(false)
        }
    }

    const handleSuggestionClick = async (suggestion: any) => {
        setSearchQuery(suggestion.name)
        setShowSuggestions(false)

        // For domain suggestions, navigate directly to the experience page
        if (suggestion.type === 'domain' && suggestion.route) {
            setIsSearching(true)
            await new Promise(resolve => setTimeout(resolve, 400))
            router.push(suggestion.route)
            setSearchQuery("")
            setIsSearching(false)
            return
        }
        
        // Perform search with the full suggestion name to get proper routing
        try {
            setIsSearching(true)
            const startTime = Date.now()
            const result = await regionService.unifiedSearch(suggestion.name)

            // Ensure minimum loading time of 800ms for better UX
            const elapsed = Date.now() - startTime
            const minLoadingTime = 800
            if (elapsed < minLoadingTime) {
                await new Promise(resolve => setTimeout(resolve, minLoadingTime - elapsed))
            }

            if (result.data.suggestedRoute) {
                router.push(result.data.suggestedRoute)
            } else {
                router.push(`/no-results?q=${encodeURIComponent(suggestion.name)}`)
            }
        } catch (error: any) {
            console.error("Search error:", error)
            toast.error("Erreur lors de la recherche")
        } finally {
            setIsSearching(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!showSuggestions || suggestions.length === 0) return

        if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSelectedIndex(prev => 
                prev < suggestions.length - 1 ? prev + 1 : prev
            )
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault()
            handleSuggestionClick(suggestions[selectedIndex])
        } else if (e.key === 'Escape') {
            setShowSuggestions(false)
            setSelectedIndex(-1)
        }
    }

    return (
        <>
            {/* Search Loading Overlay */}
            {isSearching && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center">
                    <div className="bg-white rounded-full p-6 shadow-2xl">
                        <Loader2 className="h-12 w-12 animate-spin text-[#318160]" />
                    </div>
                </div>
            )}

            <section
                className="relative min-h-[350px] flex items-center justify-center overflow-hidden"
            >
            {/* Hero background — priority-loaded, auto WebP/AVIF */}
            <Image
                src="/assets/hero.webp"
                alt=""
                fill
                priority
                quality={85}
                sizes="100vw"
                placeholder="blur"
                blurDataURL="data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAQCdASoIAAgAAUAmJZQCdAEO/gHOAAD++Knv3n7f////////7f////////7f////////7f////////7f////////wAA"
                className="object-cover object-[center_60%]"
                aria-hidden
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#318160]/50 to-[#318160]/40"></div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight max-w-3xl mx-auto">
                    Partez à la découverte des domaines viticoles
                </h1>

                <p className="text-base md:text-lg mb-6 max-w-2xl mx-auto opacity-95">
                    Découvrez les domaines et réservez une expérience œnotouristique en quelques clics.
                </p>

                {/* Search Bar */}
                <div ref={searchRef} className="max-w-2xl mx-auto relative">
                    <form onSubmit={handleSearch} className="relative">
                        <Input
                            placeholder="Rechercher un domaine, une région, une expérience"
                            className="pl-6 pr-16 py-6 text-lg bg-white text-gray-900 border-0 rounded-full shadow-lg placeholder:text-gray-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                            disabled={isSearching}
                            autoComplete="off"
                        />
                        <Button
                            type="submit"
                            size="sm"
                            disabled={isSearching}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 p-0 bg-[#318160] hover:bg-[#1D6346] shadow-md flex items-center justify-center disabled:opacity-50"
                        >
                            {isSearching ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Search className="h-4 w-4" />
                            )}
                        </Button>
                    </form>

                    {/* Autocomplete Dropdown */}
                    {showSuggestions && (suggestions.length > 0 || isLoadingSuggestions) && (
                        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                            {isLoadingSuggestions ? (
                                <div className="p-4 text-center text-gray-500">
                                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                </div>
                            ) : (
                                <>
                                    {suggestions.map((suggestion, index) => {
                                        const Icon = suggestion.icon
                                        return (
                                            <button
                                                key={`${suggestion.type}-${index}`}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                                                    index === selectedIndex ? 'bg-gray-100' : ''
                                                }`}
                                            >
                                                <Icon className="h-5 w-5 text-[#318160] flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-gray-900 font-medium truncate">{suggestion.name}</p>
                                                    {suggestion.description && (
                                                        <p className="text-sm text-gray-500 truncate">{suggestion.description}</p>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-400 capitalize flex-shrink-0">
                                                    {suggestion.type === 'city' ? 'Région' :
                                                        suggestion.type === 'region' ? 'Région' :
                                                            suggestion.type === 'domain' ? 'Domaine' :
                                                                suggestion.type === 'service' ? 'Expérience' : 'Expérience'}
                                                </span>
                                            </button>
                                        )
                                    })}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
            </section>
        </>
    )
}

export default HeroSection