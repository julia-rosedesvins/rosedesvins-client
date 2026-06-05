"use client"

import { Instagram, Linkedin, Menu, X, LogIn, User, Search, Loader2, MapPin, Wine, Building2 } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { regionService } from "@/services/region.service"
import { citiesService } from "@/services/cities.service"
import toast from "react-hot-toast"

// Navigation data structure
const navLinks = [
  // { href: "#contact", label: "Contact", isSpecial: true },
  // { href: "/", label: "Espace domaines viticoles" },
  { href: "/about", label: "À propos" },
  // { href: "#blog", label: "Blog" },
  // { href: "/faqs", label: "FAQ" },
]

const socialLinks = [
  { href: "https://www.instagram.com/rose_des_vins/", icon: Instagram, label: "Instagram" },
  { href: "https://www.linkedin.com/company/rose-des-vins/", icon: Linkedin, label: "LinkedIn" },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  // Simple in-memory cache: query → { data, timestamp }
  const cacheRef = useRef<Map<string, { data: any[]; ts: number }>>(new Map())
  const CACHE_TTL = 60_000 // 60 seconds
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is logged in
  useEffect(() => {
    setMounted(true)
    
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token')
      setIsLoggedIn(!!token)
    }
    
    checkLoginStatus()
    
    // Listen for storage changes (e.g., when user logs in/out in another tab)
    window.addEventListener('storage', checkLoginStatus)
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus)
    }
  }, [])

  // Fetch suggestions when search query changes
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    if (searchQuery.trim().length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceTimer.current = setTimeout(async () => {
      const key = searchQuery.trim().toLowerCase()

      // Serve from cache if fresh
      const cached = cacheRef.current.get(key)
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        setSuggestions(cached.data)
        setShowSuggestions(cached.data.length > 0)
        return
      }

      // Cancel previous in-flight request
      if (abortControllerRef.current) abortControllerRef.current.abort()
      abortControllerRef.current = new AbortController()
      const { signal } = abortControllerRef.current

      try {
        setIsLoadingSuggestions(true)
        
        const [backendResult, citiesResult] = await Promise.all([
          regionService.unifiedSearch(searchQuery, signal),
          citiesService.searchCities(searchQuery, signal)
        ])

        if (signal.aborted) return
        
        const allSuggestions: any[] = []
        const seenCities = new Set<string>()
        
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
        
        const finalSuggestions = allSuggestions.slice(0, 8)
        // Store in cache
        cacheRef.current.set(key, { data: finalSuggestions, ts: Date.now() })
        setSuggestions(finalSuggestions)
        setShowSuggestions(finalSuggestions.length > 0)
      } catch (error: any) {
        if (error?.name === 'AbortError' || error?.code === 'ERR_CANCELED') return
        console.error('Error fetching suggestions:', error)
      } finally {
        if (!signal.aborted) setIsLoadingSuggestions(false)
      }
    }, 300)

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [searchQuery])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node) &&
          mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (pathname === '/') {
      // If on home page, just scroll to contact
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      // If on other page, navigate to home page with contact hash
      router.push('/#contact')
    }
  }

  const handleNavClick = (href: string, isSpecial?: boolean) => (e: React.MouseEvent) => {
    if (isSpecial) {
      handleContactClick(e)
    }
  }

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
        setSearchQuery("") // Clear search after navigation
        setMobileMenuOpen(false) // Close mobile menu
      } else {
        router.push(`/no-results?q=${encodeURIComponent(searchQuery)}`)
        setSearchQuery("") // Clear search after navigation
        setMobileMenuOpen(false) // Close mobile menu
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
    setMobileMenuOpen(false)

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
        setSearchQuery("") // Clear search after navigation
      } else {
        router.push(`/no-results?q=${encodeURIComponent(suggestion.name)}`)
        setSearchQuery("") // Clear search after navigation
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

  // Check if we should show the search bar (not on home page)
  const showSearchBar = pathname !== '/'

  // Reusable Navigation Component
  const NavigationLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={
            isMobile
              ? "text-sm hover:opacity-80"
              : "bg-white text-[#318160] px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors shadow-sm"
          }
          style={isMobile ? { color: "white" } : {}}
          onClick={handleNavClick(link.href, false)}
        >
          {link.label}
        </Link>
      ))}
      
      {/* Login/Account Access Link */}
      <Link
        href={mounted && isLoggedIn ? "/dashboard" : "/login"}
        className={
          isMobile
            ? "text-sm hover:opacity-80 flex items-center gap-2"
            : "bg-white text-[#318160] px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors shadow-sm flex items-center gap-2"
        }
        style={isMobile ? { color: "white" } : {}}
      >
        {mounted && isLoggedIn ? (
          <>
            <User className="w-4 h-4" />
            <span>Espace Domaines</span>
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            {/* <span>Se connecter</span> */}
            <span>Espace domaines viticoles</span>
          </>
        )}
      </Link>
      
      {/* {!isMobile && (
        <div className="flex gap-4">
          {socialLinks.map((social) => {
            const IconComponent = social.icon
            return (
              <Link
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                <IconComponent className="w-4 h-4 hover:opacity-80 cursor-pointer" />
              </Link>
            )
          })}
        </div>
      )} */}
    </>
  )

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

      <header className="sticky top-0 z-50 text-white px-4 py-3" style={{ backgroundColor: "#318160" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <img
              src="/assets/logo.png"
              alt="Rose des Vins Logo"
              className="h-10 w-10 rounded-full cursor-pointer"
            />
          </Link>
          <div className="sm:block">
            <Link href="/">
              <h1 className="text-white font-serif text-2xl tracking-wider font-medium">
                ROSE DES VINS
              </h1>
            </Link>
            {mounted && (
              <p className="text-sm" style={{ color: "#8BB5A3" }}>
                La technologie au service des domaines viticoles
              </p>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-3">
          {/* Search Bar - Show on all pages except home */}
          {showSearchBar && (
            <div ref={searchRef} className="relative">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  placeholder="Rechercher..."
                  className="pl-4 pr-10 py-2 text-sm bg-white text-gray-900 border-0 rounded-full shadow-lg placeholder:text-gray-500 w-64"
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
                  className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-7 w-7 p-0 bg-[#318160] hover:bg-[#1D6346] shadow-md flex items-center justify-center disabled:opacity-50"
                >
                  {isSearching ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Search className="h-3 w-3" />
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
          )}
          <NavigationLinks />
        </nav>

        {/* Mobile Menu Button */}
        <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 pb-4 border-t border-white/20">
          <nav className="flex flex-col gap-4 pt-4">
            {/* Mobile Search Bar */}
            {showSearchBar && (
              <div ref={mobileSearchRef} className="relative">
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    placeholder="Rechercher un domaine, une région, une expérience"
                    className="pl-6 pr-16 py-5 text-base bg-white text-gray-900 border-0 rounded-full shadow-lg placeholder:text-gray-500"
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
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-9 w-9 p-0 bg-[#318160] hover:bg-[#1D6346] shadow-md flex items-center justify-center disabled:opacity-50"
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
            )}
            <div className="flex flex-col gap-4" onClick={() => setMobileMenuOpen(false)}>
              <NavigationLinks isMobile />
            </div>
            {/* <div className="flex gap-4 pt-2">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <Link
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-4 h-4 hover:opacity-80 cursor-pointer" />
                  </Link>
                )
              })}
            </div> */}
          </nav>
        </div>
      )}
    </header>
    </>
  )
}
