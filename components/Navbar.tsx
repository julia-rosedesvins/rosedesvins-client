"use client"

import { Instagram, Linkedin, Menu, X, LogIn, User, Search, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { regionService } from "@/services/region.service"
import toast from "react-hot-toast"

// Navigation data structure
const navLinks = [
  // { href: "#contact", label: "Contact", isSpecial: true },
  { href: "/", label: "Espace domaines viticoles" },
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
      const result = await regionService.unifiedSearch(searchQuery)

      if (result.data.suggestedRoute) {
        router.push(result.data.suggestedRoute)
        setSearchQuery("") // Clear search after navigation
        setMobileMenuOpen(false) // Close mobile menu
      } else {
        toast.error("Aucun résultat trouvé")
      }
    } catch (error: any) {
      console.error("Search error:", error)
      toast.error("Erreur lors de la recherche")
    } finally {
      setIsSearching(false)
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
            <span>Se connecter</span>
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
            {/* <p className="text-sm" style={{ color: "#8BB5A3" }}>
              La technologie au service de l’œnotourisme
            </p> */}
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-3">
          {/* Search Bar - Show on all pages except home */}
          {showSearchBar && (
            <form onSubmit={handleSearch} className="relative">
              <Input
                placeholder="Rechercher..."
                className="pl-4 pr-10 py-2 text-sm bg-white text-gray-900 border-0 rounded-full shadow-lg placeholder:text-gray-500 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isSearching}
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
              <form onSubmit={handleSearch} className="relative">
                <Input
                  placeholder="Rechercher un domaine, une région, une expérience"
                  className="pl-6 pr-16 py-5 text-base bg-white text-gray-900 border-0 rounded-full shadow-lg placeholder:text-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  disabled={isSearching}
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
  )
}
