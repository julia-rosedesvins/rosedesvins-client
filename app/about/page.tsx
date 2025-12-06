"use client"

import Image from "next/image"
import LandingPageLayout from "@/components/LandingPageLayout"

export default function AboutPage() {
  return (
    <LandingPageLayout>
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Page Title */}
        <div className="text-center mb-20">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Une équipe qui aime le vin et ceux qui le font vivre
          </h1>
        </div>

        {/* Team Members */}
        <div className="space-y-24">
          {/* Julia Chevalier */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="order-2 lg:order-1">
              <div className="flex flex-col items-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <Image
                    src="/assets/julia.jpeg"
                    alt="Julia Chevalier"
                    fill
                    className="rounded-2xl object-cover shadow-lg"
                  />
                </div>
                <div className="text-center mt-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Julia Chevalier</h3>
                  <p style={{ color: "#3A7B59" }} className="font-semibold text-lg">
                    Co-fondatrice et Directrice Générale
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="space-y-6 text-gray-600 text-base md:text-lg leading-relaxed">
                <p>
                  Diplômée WSET 2 et forte d'une expérience à l'interprofession des Vins de Loire, Julia met sa passion
                  du vin au service des domaines viticoles.
                </p>
                <p>
                  Après dix ans à Paris et Londres où elle a fait ses armes en communication et relations presse, elle a
                  à cœur d'accompagner les vignobles dans la valorisation de leur patrimoine.
                </p>
                <p>
                  Passionnée d'œnotourisme, ses voyages se transforment toujours en découverte de vignobles et de caves
                  locales.
                </p>
              </div>
            </div>
          </div>

          {/* Felix Kerr */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div className="order-1">
              <div className="space-y-6 text-gray-600 text-base md:text-lg leading-relaxed">
                <p>
                  Diplômé WSET 3 et possédant 10 ans d'expérience en marketing digital et CRM, Felix a travaillé dans le
                  vin chez Liv-ex, une marketplace internationale des vins fins et hauts de gamme, et chez Vintage
                  Cellar.
                </p>
                <p>
                  Il met son expertise au service des domaines pour créer des solutions numériques performantes.
                  Trilingue français, anglais et allemand, il combine technique et passion du vin pour offrir une
                  expérience optimale aux visiteurs.
                </p>
              </div>
            </div>
            <div className="order-2">
              <div className="flex flex-col items-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                  <Image
                    src="/assets/Felix.png"
                    alt="Felix Kerr"
                    fill
                    className="rounded-2xl object-cover shadow-lg"
                  />
                </div>
                <div className="text-center mt-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Felix Kerr</h3>
                  <p style={{ color: "#3A7B59" }} className="font-semibold text-lg">
                    Co-fondateur et Directeur Technique
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </LandingPageLayout>
  )
}
