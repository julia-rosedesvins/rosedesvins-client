'use client'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { regionService } from "@/services/region.service"
import toast from "react-hot-toast"

const HeroSection = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const router = useRouter()

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
                className="relative min-h-[350px] flex items-center justify-center bg-cover"
                style={{
                    backgroundImage: `url('/assets/hero.jpg')`,
                    backgroundPosition: 'center 60%'
                }}
            >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#318160]/50 to-[#318160]/40"></div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight max-w-3xl mx-auto">
                    <span className="md:whitespace-nowrap">Laissez-vous guider à la découverte</span>
                    <br />
                    des domaines viticoles.
                </h1>

                <p className="text-base md:text-lg mb-6 max-w-2xl mx-auto opacity-95">
                    Partez à la découverte des vins qui vous ressemblent et réserver
                    une expérience œnotouristique en quelques clics.
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
                    <Input
                        placeholder="Rechercher un domaine, une région, une expérience"
                        className="pl-6 pr-16 py-6 text-lg bg-white text-gray-900 border-0 rounded-full shadow-lg placeholder:text-gray-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        disabled={isSearching}
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
            </div>
        </section>
        </>
    )
}

export default HeroSection