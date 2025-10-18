"use client"

import LandingPageLayout from "@/components/LandingPageLayout"
import { Shield, Building, User, Server, Copyright, UserCheck, Cookie, Users } from "lucide-react"

export default function LegalNoticesPage() {
  return (
    <LandingPageLayout>
      {/* Hero Section with Professional Background */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-5"></div>
        <div className="relative max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8" style={{ backgroundColor: "#E8F5EC" }}>
              <Shield className="w-10 h-10" style={{ color: "#3A7B59" }} />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Mentions légales
            </h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-600 leading-relaxed font-light">
                Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004 pour la Confiance dans l'Économie Numérique (LCEN), 
                il est précisé aux utilisateurs du site Rose des Vins l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Content with Professional Cards */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid gap-8">
          
          {/* Section 1 - Éditeur du site */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <Building className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  1. Éditeur du site
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-lg text-gray-900 mb-2">Rose des Vins SAS</p>
                  <div className="space-y-2">
                    <p><span className="font-medium">Siège social :</span> Société immatriculée au RCS de Tours sous le numéro 992 709 675</p>
                    <p><span className="font-medium">SIRET :</span> 992 709 675 00019</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 - Responsable de publication */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <User className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  2. Responsable de publication
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-lg text-gray-900 mb-2">Julia Chevalier</p>
                <p><span className="font-medium">E-mail :</span> <a href="mailto:julia@rosedesvins.co" className="font-medium hover:underline transition-all duration-200" style={{ color: "#3A7B59" }}>julia@rosedesvins.co</a></p>
              </div>
            </div>
          </div>

          {/* Section 3 - Hébergeur du site */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <Server className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  3. Hébergeur du site
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-2">Le site rosedesvins.co est hébergé par : <span className="font-semibold">SiteGround</span></p>
                <p><span className="font-medium">Adresse :</span> Calle de Prim 19, 28004 Madrid, Espagne</p>
              </div>
            </div>
          </div>

          {/* Section 4 - Propriété intellectuelle */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <Copyright className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  4. Propriété intellectuelle
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>L'ensemble des éléments (textes, images, graphismes, logo, icônes, etc.) présents sur le site Rose des Vins sont la propriété exclusive de Rose des Vins, sauf mention contraire.</p>
                <p>Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.</p>
              </div>
            </div>
          </div>

          {/* Section 5 - Données personnelles */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <UserCheck className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  5. Données personnelles
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>Les informations collectées via le site sont destinées exclusivement à un usage interne. Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi "Informatique et Libertés", vous disposez d'un droit d'accès, de rectification, d'opposition et de suppression de vos données personnelles.</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p><span className="font-medium">Pour exercer ce droit :</span> <a href="mailto:julia@rosedesvins.co" className="font-medium hover:underline transition-all duration-200" style={{ color: "#3A7B59" }}>julia@rosedesvins.co</a></p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6 - Cookies */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <Cookie className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  6. Cookies
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>Le site Rose des Vins peut utiliser des cookies afin d'améliorer l'expérience utilisateur et réaliser des statistiques de visite.</p>
                <p>L'utilisateur a la possibilité de paramétrer son navigateur pour refuser les cookies.</p>
                <p>Les mentions légales sont également valables pour les profils de médias sociaux suivants : LinkedIn et Instagram.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Professional Contact Section */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="w-16 h-16 rounded-full mx-auto mb-6" style={{ backgroundColor: "#E8F5EC" }}>
              <div className="w-full h-full rounded-full flex items-center justify-center">
                <Users className="w-8 h-8" style={{ color: "#3A7B59" }} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Questions sur ces mentions légales ?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour toute information complémentaire concernant ces mentions légales.
            </p>
            <a 
              href="mailto:julia@rosedesvins.co"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white rounded-xl hover:transform hover:scale-105 transition-all duration-200 shadow-lg"
              style={{ backgroundColor: "#3A7B59" }}
            >
              Nous contacter
            </a>
          </div>
        </div>
      </section>

    </LandingPageLayout>
  )
}
