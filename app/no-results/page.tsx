'use client'

import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Search, Home, MapPin, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import LandingPageLayout from "@/components/LandingPageLayout"

export default function NoResultsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const query = searchParams.get('q') || ''

    return (
        <LandingPageLayout>
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-16">
                <div className="max-w-2xl mx-auto text-center">
                    {/* Icon */}
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-[#318160]/10 rounded-full blur-3xl"></div>
                            <div className="relative bg-[#318160]/5 rounded-full p-8">
                                <Search className="h-24 w-24 text-[#318160]" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Aucun résultat trouvé
                    </h1>

                    {/* Search Query */}
                    {query && (
                        <p className="text-xl text-gray-600 mb-8">
                            Aucun résultat pour <span className="font-semibold text-[#318160]">"{query}"</span>
                        </p>
                    )}

                    {/* Message */}
                    <p className="text-lg text-gray-600 mb-12 max-w-xl mx-auto">
                        Nous n'avons trouvé aucun domaine, région ou expérience correspondant à votre recherche. 
                        Essayez avec des mots-clés différents ou explorez nos suggestions ci-dessous.
                    </p>

                    {/* Suggestions */}
                    <div className="bg-gray-50 rounded-2xl p-8 mb-12">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Suggestions :
                        </h2>
                        <ul className="text-left text-gray-700 space-y-3 max-w-md mx-auto">
                            <li className="flex items-start gap-3">
                                <span className="text-[#318160] mt-1">•</span>
                                <span>Vérifiez l'orthographe de vos mots-clés</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#318160] mt-1">•</span>
                                <span>Essayez des termes plus généraux</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#318160] mt-1">•</span>
                                <span>Recherchez par région (ex: Bordeaux, Loire, Bourgogne)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-[#318160] mt-1">•</span>
                                <span>Explorez les expériences disponibles dans nos régions</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                            size="lg"
                            className="w-full sm:w-auto border-[#318160] text-[#318160] hover:bg-[#318160] hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Retour
                        </Button>
                        
                        <Link href="/regions" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                className="w-full bg-[#318160] hover:bg-[#1D6346] text-white"
                            >
                                <MapPin className="w-5 h-5 mr-2" />
                                Explorer les régions
                            </Button>
                        </Link>
                        
                        <Link href="/" className="w-full sm:w-auto">
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full border-gray-300 hover:bg-gray-50"
                            >
                                <Home className="w-5 h-5 mr-2" />
                                Page d'accueil
                            </Button>
                        </Link>
                    </div>

                    {/* Popular Regions */}
                    <div className="mt-16 pt-12 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">
                            Régions populaires :
                        </h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {['Bordeaux', 'Bourgogne', 'Champagne', 'Loire', 'Alsace', 'Rhône'].map((region) => (
                                <Link
                                    key={region}
                                    href={`/regions?q=${encodeURIComponent(region)}`}
                                    className="px-6 py-3 bg-white border-2 border-gray-200 hover:border-[#318160] hover:text-[#318160] rounded-full text-gray-700 font-medium transition-all hover:shadow-md"
                                >
                                    {region}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </LandingPageLayout>
    )
}
