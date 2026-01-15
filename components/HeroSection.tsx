'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const HeroSection = () => {
    return (
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
                    Laissez-vous guider à la découverte
                    <br />
                    des domaines viticoles.
                </h1>

                <p className="text-base md:text-lg mb-6 max-w-2xl mx-auto opacity-95">
                    Partez à la découverte des vins qui vous ressemblent et réserver
                    une expérience œnotouristique en quelques clics.
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto relative">
                    <Input
                        placeholder="Rechercher un domaine, une région, une expérience"
                        className="pl-6 pr-16 py-6 text-lg bg-white text-wine-text border-0 rounded-full shadow-lg"
                    />
                    <Button
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-10 w-10 p-0 bg-[#318160] hover:bg-[#1D6346] shadow-md flex items-center justify-center"
                    >
                        <Search className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default HeroSection