"use client"

import LandingPageLayout from "@/components/LandingPageLayout"
import { Shield, Building, Database, Target, Scale, Clock, Share, UserX, Cookie, Lock } from "lucide-react"

export default function PrivacyPolicyPage() {
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
              Politique de confidentialité
            </h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-600 leading-relaxed font-light">
                La présente politique de confidentialité a pour objectif d'informer les utilisateurs du site Rose des Vins (www.rosedesvins.co) sur la collecte, l'utilisation et la protection de leurs données personnelles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Content with Professional Cards */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid gap-8">
          
          {/* Section 1 - Responsable du traitement */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <Building className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  1. Responsable du traitement
                </h2>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-700 mb-4">Le responsable du traitement des données est :</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-lg text-gray-900 mb-2">Rose des Vins SAS</p>
                <div className="space-y-2">
                  <p><span className="font-medium">Siège social :</span> 30, rue de la scellerie 37000 TOURS</p>
                  <p><span className="font-medium">E-mail :</span> <a href="mailto:julia@rosedesvins.co" className="font-medium hover:underline transition-all duration-200" style={{ color: "#3A7B59" }}>julia@rosedesvins.co</a></p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 - Données collectées */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <Database className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  2. Données collectées
                </h2>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-700 mb-4">Nous pouvons être amenés à collecter les données suivantes :</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2 text-gray-700">
                  <li>• Nom, prénom</li>
                  <li>• Adresse e-mail</li>
                  <li>• Téléphone</li>
                  <li>• Données de navigation (cookies, statistiques de visite)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3 - Finalité de la collecte */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <Target className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  3. Finalité de la collecte
                </h2>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-700 mb-4">Les données personnelles collectées via le site Rose des Vins sont utilisées pour :</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2 text-gray-700">
                  <li>• Répondre aux demandes de contact</li>
                  <li>• Permettre la gestion des réservations</li>
                  <li>• Améliorer la navigation et l'expérience utilisateur</li>
                  <li>• Réaliser des statistiques anonymes de fréquentation</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4 - Base légale du traitement */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <Scale className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  4. Base légale du traitement
                </h2>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-700 mb-4">Le traitement des données est fondé sur :</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2 text-gray-700">
                  <li>• Le consentement de l'utilisateur (formulaire, cookies)</li>
                  <li>• L'exécution d'un contrat ou d'une prestation</li>
                  <li>• L'intérêt légitime de l'éditeur (suivi de fréquentation, sécurité du site)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 5 - Conservation des données */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <Clock className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  5. Conservation des données
                </h2>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-700">Les données sont conservées pour une durée maximale de 3 ans à compter du dernier contact ou de la dernière interaction avec le site, sauf obligation légale contraire.</p>
            </div>
          </div>

          {/* Section 6 - Partage des données */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <Share className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  6. Partage des données
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <p>Les données ne sont en aucun cas revendues à des tiers.</p>
                <p>Elles peuvent être transmises uniquement à des prestataires techniques (hébergeur, outils de statistiques) dans le cadre strict de leur mission.</p>
              </div>
            </div>
          </div>

          {/* Section 7 - Vos droits */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <UserX className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  7. Vos droits
                </h2>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-700 mb-4">Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <ul className="space-y-2 text-gray-700">
                  <li>• Droit d'accès</li>
                  <li>• Droit de rectification</li>
                  <li>• Droit d'opposition</li>
                  <li>• Droit à l'effacement</li>
                  <li>• Droit à la portabilité de vos données</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p><span className="font-medium">Pour exercer vos droits :</span> <a href="mailto:julia@rosedesvins.co" className="font-medium hover:underline transition-all duration-200" style={{ color: "#3A7B59" }}>julia@rosedesvins.co</a></p>
              </div>
            </div>
          </div>

          {/* Section 8 - Cookies */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <Cookie className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  8. Cookies
                </h2>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-700 mb-4">Le site Rose des Vins utilise des cookies :</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <ul className="space-y-2 text-gray-700">
                  <li>• <span className="font-medium">Cookies de fonctionnement :</span> nécessaires au bon fonctionnement du site</li>
                  <li>• <span className="font-medium">Cookies analytiques :</span> pour mesurer l'audience et améliorer le site (ex. Google Analytics)</li>
                </ul>
              </div>
              <p className="text-gray-700">L'utilisateur peut accepter ou refuser les cookies lors de sa navigation via le bandeau prévu à cet effet, ou configurer son navigateur pour bloquer les cookies.</p>
            </div>
          </div>

          {/* Section 9 - Sécurité des données */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <Lock className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  9. Sécurité des données
                </h2>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-700">Nous mettons en œuvre toutes les mesures techniques et organisationnelles nécessaires pour protéger vos données contre la perte, l'altération, la divulgation ou l'accès non autorisé.</p>
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
                <Shield className="w-8 h-8" style={{ color: "#3A7B59" }} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Questions sur notre politique de confidentialité ?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour toute question concernant la protection de vos données personnelles.
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
