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
              <p className="text-xl text-gray-600 leading-relaxed font-light mb-4">
                La présente politique de confidentialité a pour objectif d'informer les utilisateurs du site Rose des Vins (www.rosedesvins.co) sur la collecte, l'utilisation et la protection de leurs données personnelles.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed font-light">
                Rose des Vins est une application permettant aux utilisateurs de configurer un widget de réservation intégrable sur leur site web, afin de recevoir des réservations pour des expériences paramétrées dans leur espace administrateur. Le widget de réservation est installé via iframe, et des rappels peuvent être envoyés par Rose des Vins.
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
                  <p><span className="font-medium">Siège social :</span> 30, rue de la Scellerie, 37000 TOURS – France</p>
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
              <p className="text-gray-700 mb-4">Nous pouvons collecter les données suivantes :</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <ul className="space-y-2 text-gray-700">
                  <li>• Nom, prénom</li>
                  <li>• Adresse e-mail</li>
                  <li>• Numéro de téléphone</li>
                  <li>• Données de navigation (cookies, statistiques de visite)</li>
                </ul>
              </div>
              
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Intégrations Google Calendar et Outlook Calendar</h3>
                <p className="text-gray-700 mb-4">
                  Dans le cadre de nos intégrations avec Google Calendar et Outlook Calendar, et avec l'autorisation explicite de l'utilisateur, nous collectons et/ou accédons aux données suivantes via des permissions de lecture et d'écriture :
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
                  <ul className="space-y-2 text-gray-700">
                    <li>• Disponibilités du calendrier</li>
                    <li>• Heures et dates de début et de fin des événements</li>
                    <li>• Titres et détails des événements</li>
                    <li>• Adresse e-mail du compte connecté</li>
                    <li>• Nom et prénom associés au compte</li>
                  </ul>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <p className="text-gray-700">
                    <span className="font-semibold">Notre synchronisation s'effectue toutes les heures.</span> Nous analysons les événements présents jusqu'à <span className="font-semibold">3 mois dans le futur</span>. Par exemple, en janvier, les données collectées peuvent inclure des événements jusqu'à fin mars, mais pas au-delà.
                  </p>
                </div>
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
                  3. Finalités du traitement
                </h2>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-700 mb-4">Les données collectées via le site Rose des Vins sont utilisées pour :</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <ul className="space-y-2 text-gray-700">
                  <li>• Répondre aux demandes de contact</li>
                  <li>• Permettre la gestion des réservations</li>
                  <li>• Améliorer la navigation et l'expérience utilisateur</li>
                  <li>• Réaliser des statistiques anonymes de fréquentation</li>
                </ul>
              </div>
              
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Intégrations Google Calendar et Outlook Calendar</h3>
                <p className="text-gray-700 mb-4">Les données issues des calendriers connectés sont utilisées pour :</p>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <ul className="space-y-3 text-gray-700">
                    <li>• <span className="font-semibold">Afficher des disponibilités en temps réel</span> dans l'outil de réservation, afin d'éviter les doubles réservations lorsque l'utilisateur n'est pas disponible</li>
                    <li>• <span className="font-semibold">Créer automatiquement des événements</span> dans le calendrier connecté pour chaque réservation effectuée via le widget, donnant ainsi à l'utilisateur une visibilité centralisée sur ses futures réservations</li>
                  </ul>
                </div>
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
              <p className="text-gray-700 mb-4">Le traitement de vos données repose sur :</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="space-y-2 text-gray-700">
                  <li>• Le consentement de l'utilisateur (formulaires, connexion aux calendriers, cookies)</li>
                  <li>• L'exécution d'un contrat ou d'un service demandé par l'utilisateur</li>
                  <li>• L'intérêt légitime du responsable du traitement (sécurité, statistiques, amélioration du service)</li>
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
                  5. Durée de conservation des données
                </h2>
              </div>
            </div>
            <div className="p-8">
              <p className="text-gray-700 mb-6">
                Les données personnelles collectées via le site sont conservées pour une durée maximale d'<span className="font-semibold">un (1) an</span> à compter du dernier contact ou de la dernière interaction, sauf obligation légale contraire.
              </p>
              
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Intégrations Google Calendar et Outlook Calendar</h3>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <ul className="space-y-3 text-gray-700">
                    <li>• Les données issues des calendriers ne sont conservées que <span className="font-semibold">tant qu'elles sont nécessaires au fonctionnement du widget</span></li>
                    <li>• Les métadonnées relatives à des événements passés sont supprimées dans un délai maximum de <span className="font-semibold">30 jours après la date de l'événement</span></li>
                  </ul>
                </div>
              </div>
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
              <div className="space-y-4 text-gray-700 mb-6">
                <p>Les données personnelles ne sont jamais revendues.</p>
                <p>Elles ne peuvent être transmises qu'à des prestataires techniques (hébergeur, outil d'analyse) dans le cadre strict de l'exécution de leur mission et jamais pour d'autres finalités.</p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Intégrations Google Calendar et Outlook Calendar</h3>
                <p className="text-gray-700 mb-4">Les données issues des calendriers :</p>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <ul className="space-y-2 text-gray-700">
                    <li>• <span className="font-semibold">ne sont pas vendues</span></li>
                    <li>• <span className="font-semibold">ne sont pas utilisées à des fins publicitaires</span></li>
                    <li>• <span className="font-semibold">ne sont pas partagées avec des tiers</span> sauf pour fournir le service décrit ci-dessus</li>
                    <li>• <span className="font-semibold">sont utilisées uniquement</span> dans le cadre des fonctionnalités de synchronisation et d'affichage des disponibilités</li>
                  </ul>
                </div>
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
                  <li>• Droit à la portabilité des données</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p><span className="font-medium">Pour exercer vos droits :</span> <a href="mailto:julia@rosedesvins.co" className="font-medium hover:underline transition-all duration-200" style={{ color: "#3A7B59" }}>julia@rosedesvins.co</a></p>
              </div>
              
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Intégrations Google Calendar et Outlook Calendar</h3>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="space-y-4 text-gray-700">
                    <p>
                      <span className="font-semibold">Déconnexion du calendrier :</span> L'utilisateur peut à tout moment déconnecter son calendrier dans son espace administrateur, via l'onglet « <span className="font-semibold">Paramètres</span> » en cliquant sur « <span className="font-semibold">Déconnecter</span> ».
                    </p>
                    <p>
                      Cette action entraîne la <span className="font-semibold">suppression immédiate</span> de l'ensemble des métadonnées collectées.
                    </p>
                    <p>
                      Pour demander la suppression des données tout en conservant la connexion du calendrier, l'utilisateur peut contacter l'administrateur à <a href="mailto:julia@rosedesvins.co" className="font-semibold hover:underline" style={{ color: "#3A7B59" }}>julia@rosedesvins.co</a>. La suppression sera effectuée dans un délai de <span className="font-semibold">14 jours ouvrés</span>.
                    </p>
                  </div>
                </div>
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
              <p className="text-gray-700 mb-4">Le site Rose des Vins utilise des cookies afin de :</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <ul className="space-y-2 text-gray-700">
                  <li>• Assurer le bon fonctionnement du site</li>
                  <li>• Mesurer l'audience et améliorer l'expérience utilisateur (ex. Google Analytics)</li>
                </ul>
              </div>
              <p className="text-gray-700">Vous pouvez gérer vos préférences via le bandeau de consentement ou configurer votre navigateur pour bloquer les cookies.</p>
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
              <p className="text-gray-700">Nous mettons en œuvre des mesures techniques et organisationnelles destinées à protéger vos données contre toute perte, altération, divulgation ou accès non autorisé.</p>
            </div>
          </div>

          {/* Section 10 - Utilisation des données Google */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-8 py-6 border-b border-blue-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  10. Utilisation des données des utilisateurs Google
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <p className="text-gray-700 font-semibold mb-4">
                  Notre utilisation et notre transfert des informations reçues des API Google respectent la <span className="text-blue-700">Google API Services User Data Policy</span>, y compris ses exigences en matière de <span className="text-blue-700">Limited Use</span>.
                </p>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p className="font-semibold text-gray-900">Nous utilisons les données Google Calendar uniquement pour :</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    <li>• Afficher les disponibilités du calendrier connecté</li>
                    <li>• Créer des événements correspondant aux réservations effectuées par l'utilisateur</li>
                  </ul>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-gray-900">
                    Nous <span className="text-amber-800">n'utilisons pas</span> les données Google à des fins publicitaires et nous <span className="text-amber-800">ne les transférons pas</span> à des tiers.
                  </p>
                </div>
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
