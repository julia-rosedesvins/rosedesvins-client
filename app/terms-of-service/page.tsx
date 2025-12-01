"use client"

import LandingPageLayout from "@/components/LandingPageLayout"
import { FileText, Users, Gavel, CreditCard, AlertTriangle, Ban, Shield, RefreshCw, Mail, Calendar } from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <LandingPageLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-5"></div>
        <div className="relative max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8" style={{ backgroundColor: "#E8F5EC" }}>
              <FileText className="w-10 h-10" style={{ color: "#3A7B59" }} />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Conditions générales d'utilisation
            </h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-600 leading-relaxed font-light mb-4">
                Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Rose des Vins, accessible à l'adresse www.rosedesvins.co.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed font-light">
                En utilisant notre service, vous acceptez sans réserve les présentes conditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid gap-8">

          {/* Section 1 - Présentation du service */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <FileText className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  1. Présentation du service
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <p>
                  <span className="font-semibold">Rose des Vins</span> est une plateforme SaaS (Software as a Service) permettant aux professionnels du vin et de l'œnotourisme de :
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    <li>• Créer et personnaliser un widget de réservation intégrable sur leur site web</li>
                    <li>• Gérer leurs disponibilités et leurs offres d'expériences œnotouristiques</li>
                    <li>• Recevoir et gérer des réservations en ligne</li>
                    <li>• Synchroniser leurs calendriers (Google Calendar, Outlook Calendar)</li>
                    <li>• Envoyer des notifications automatiques à leurs clients</li>
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-gray-900 mb-2">Éditeur du service :</p>
                  <div className="space-y-1 text-gray-700">
                    <p><span className="font-medium">Rose des Vins SAS</span></p>
                    <p>30, rue de la Scellerie, 37000 TOURS – France</p>
                    <p>E-mail : <a href="mailto:julia@rosedesvins.co" className="font-medium hover:underline" style={{ color: "#3A7B59" }}>julia@rosedesvins.co</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 - Acceptation des CGU */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <Gavel className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  2. Acceptation des CGU
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <p>
                  L'accès et l'utilisation de la plateforme Rose des Vins impliquent l'acceptation pleine et entière des présentes CGU.
                </p>
                <p>
                  L'utilisateur reconnaît avoir pris connaissance des présentes conditions et s'engage à les respecter.
                </p>
                <p>
                  Rose des Vins se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés de toute modification par e-mail ou via une notification sur la plateforme.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 - Inscription et compte utilisateur */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <Users className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  3. Inscription et compte utilisateur
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <p className="font-semibold text-gray-900">3.1. Création de compte</p>
                <p>
                  Pour utiliser Rose des Vins, l'utilisateur doit créer un compte en fournissant des informations exactes et à jour (nom, prénom, adresse e-mail, numéro de téléphone).
                </p>
                
                <p className="font-semibold text-gray-900 mt-6">3.2. Identifiants</p>
                <p>
                  L'utilisateur est responsable de la confidentialité de ses identifiants de connexion. Toute utilisation du compte est réputée avoir été effectuée par le titulaire du compte.
                </p>
                
                <p className="font-semibold text-gray-900 mt-6">3.3. Exactitude des informations</p>
                <p>
                  L'utilisateur s'engage à fournir des informations exactes et à les mettre à jour en cas de modification.
                </p>
                
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-gray-900">
                    En cas d'utilisation frauduleuse ou non autorisée de votre compte, vous devez immédiatement en informer Rose des Vins.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4 - Abonnement et tarification */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <CreditCard className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  4. Abonnement et tarification
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <p className="font-semibold text-gray-900">4.1. Offres et tarifs</p>
                <p>
                  Rose des Vins propose différentes formules d'abonnement (gratuit, payant). Les tarifs en vigueur sont consultables sur le site www.rosedesvins.co.
                </p>
                
                <p className="font-semibold text-gray-900 mt-6">4.2. Modalités de paiement</p>
                <p>
                  Les paiements s'effectuent par carte bancaire ou tout autre moyen de paiement proposé sur la plateforme. Les abonnements sont renouvelables automatiquement sauf résiliation.
                </p>
                
                <p className="font-semibold text-gray-900 mt-6">4.3. Modification des tarifs</p>
                <p>
                  Rose des Vins se réserve le droit de modifier ses tarifs à tout moment. Les utilisateurs seront informés au moins 30 jours avant l'entrée en vigueur de toute modification tarifaire.
                </p>
                
                <p className="font-semibold text-gray-900 mt-6">4.4. Résiliation</p>
                <p>
                  L'utilisateur peut résilier son abonnement à tout moment depuis son espace administrateur. La résiliation prendra effet à la fin de la période d'abonnement en cours.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5 - Intégrations calendrier */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-8 py-6 border-b border-blue-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white">
                  <Calendar className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  5. Intégrations Google Calendar et Outlook Calendar
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <p className="font-semibold text-gray-900">5.1. Autorisation d'accès</p>
                <p>
                  En connectant votre calendrier Google ou Outlook, vous autorisez Rose des Vins à :
                </p>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <ul className="space-y-2">
                    <li>• <span className="font-semibold">Lire</span> vos disponibilités et événements calendrier</li>
                    <li>• <span className="font-semibold">Créer</span> automatiquement des événements pour les réservations effectuées via le widget</li>
                    <li>• <span className="font-semibold">Synchroniser</span> les données toutes les heures pour maintenir les disponibilités à jour</li>
                  </ul>
                </div>
                
                <p className="font-semibold text-gray-900 mt-6">5.2. Portée de la synchronisation</p>
                <p>
                  Rose des Vins synchronise uniquement les événements présents jusqu'à <span className="font-semibold">3 mois dans le futur</span> à partir de la date actuelle.
                </p>
                
                <p className="font-semibold text-gray-900 mt-6">5.3. Utilisation limitée</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-semibold mb-2">
                    Conformément à la Google API Services User Data Policy :
                  </p>
                  <ul className="space-y-2">
                    <li>• Les données de votre calendrier sont utilisées <span className="font-semibold">uniquement</span> pour afficher vos disponibilités et créer des événements de réservation</li>
                    <li>• Vos données <span className="font-semibold">ne sont jamais vendues</span> à des tiers</li>
                    <li>• Vos données <span className="font-semibold">ne sont jamais utilisées</span> à des fins publicitaires</li>
                    <li>• Vos données <span className="font-semibold">ne sont pas partagées</span> avec d'autres services</li>
                  </ul>
                </div>
                
                <p className="font-semibold text-gray-900 mt-6">5.4. Déconnexion</p>
                <p>
                  Vous pouvez déconnecter votre calendrier à tout moment depuis l'onglet « Paramètres » de votre espace administrateur. Cette action entraîne la suppression immédiate de toutes les données collectées.
                </p>
                
                <p className="font-semibold text-gray-900 mt-6">5.5. Révocation des autorisations</p>
                <p>
                  Vous pouvez également révoquer les autorisations d'accès directement depuis :
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-2">
                    <li>• <span className="font-semibold">Google :</span> <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "#3A7B59" }}>https://myaccount.google.com/permissions</a></li>
                    <li>• <span className="font-semibold">Microsoft :</span> <a href="https://account.microsoft.com/privacy/app-access" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "#3A7B59" }}>https://account.microsoft.com/privacy/app-access</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6 - Obligations de l'utilisateur */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <AlertTriangle className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  6. Obligations de l'utilisateur
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <p>L'utilisateur s'engage à :</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-3">
                    <li>• Utiliser le service dans le respect des lois et règlements en vigueur</li>
                    <li>• Ne pas utiliser le service à des fins illégales, frauduleuses ou nuisibles</li>
                    <li>• Fournir des informations exactes concernant ses offres et disponibilités</li>
                    <li>• Honorer les réservations effectuées via le widget</li>
                    <li>• Ne pas tenter de contourner les mesures de sécurité de la plateforme</li>
                    <li>• Ne pas utiliser le service pour envoyer du spam ou du contenu inapproprié</li>
                    <li>• Respecter les droits de propriété intellectuelle de Rose des Vins</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-red-900">
                    Toute violation de ces obligations peut entraîner la suspension ou la résiliation immédiate du compte, sans préavis ni remboursement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7 - Responsabilité */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <Shield className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  7. Responsabilité et garanties
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <p className="font-semibold text-gray-900">7.1. Service "en l'état"</p>
                <p>
                  Rose des Vins s'efforce de fournir un service de qualité, mais ne garantit pas que le service sera exempt d'erreurs, d'interruptions ou de bugs.
                </p>
                
                <p className="font-semibold text-gray-900 mt-6">7.2. Disponibilité</p>
                <p>
                  Rose des Vins ne peut être tenu responsable des interruptions temporaires du service dues à des opérations de maintenance, des mises à jour ou des cas de force majeure.
                </p>
                
                <p className="font-semibold text-gray-900 mt-6">7.3. Contenu utilisateur</p>
                <p>
                  L'utilisateur est seul responsable du contenu qu'il publie sur la plateforme (descriptions, photos, tarifs). Rose des Vins ne peut être tenu responsable du contenu publié par les utilisateurs.
                </p>
                
                <p className="font-semibold text-gray-900 mt-6">7.4. Relations avec les clients finaux</p>
                <p>
                  Rose des Vins fournit uniquement un outil de réservation. Les relations contractuelles entre l'utilisateur et ses clients finaux relèvent de la seule responsabilité de l'utilisateur.
                </p>
                
                <p className="font-semibold text-gray-900 mt-6">7.5. Limitation de responsabilité</p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p>
                    En aucun cas Rose des Vins ne pourra être tenu responsable des dommages indirects, accessoires, spéciaux ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser le service.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 8 - Propriété intellectuelle */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <Ban className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  8. Propriété intellectuelle
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <p>
                  Tous les éléments de la plateforme Rose des Vins (logo, charte graphique, code source, design, textes) sont la propriété exclusive de Rose des Vins SAS et sont protégés par les lois sur la propriété intellectuelle.
                </p>
                <p>
                  Toute reproduction, représentation, modification ou exploitation non autorisée est interdite et constitue une contrefaçon.
                </p>
                <p>
                  L'utilisateur conserve la propriété intellectuelle du contenu qu'il crée sur la plateforme, mais accorde à Rose des Vins une licence d'utilisation nécessaire au fonctionnement du service.
                </p>
              </div>
            </div>
          </div>

          {/* Section 9 - Protection des données */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <Shield className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  9. Protection des données personnelles
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <p>
                  Le traitement des données personnelles est régi par notre <a href="/privacy-policy" className="font-semibold hover:underline" style={{ color: "#3A7B59" }}>Politique de confidentialité</a>, conforme au RGPD.
                </p>
                <p>
                  L'utilisateur dispose d'un droit d'accès, de rectification, d'opposition et de suppression de ses données personnelles, qu'il peut exercer en contactant <a href="mailto:julia@rosedesvins.co" className="font-semibold hover:underline" style={{ color: "#3A7B59" }}>julia@rosedesvins.co</a>.
                </p>
              </div>
            </div>
          </div>

          {/* Section 10 - Modification des CGU */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <RefreshCw className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  10. Modification des CGU
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <p>
                  Rose des Vins se réserve le droit de modifier les présentes CGU à tout moment.
                </p>
                <p>
                  Les utilisateurs seront informés de toute modification significative par e-mail ou via une notification sur la plateforme au moins <span className="font-semibold">30 jours avant</span> l'entrée en vigueur des nouvelles conditions.
                </p>
                <p>
                  L'utilisation continue du service après l'entrée en vigueur des nouvelles CGU vaut acceptation de celles-ci.
                </p>
              </div>
            </div>
          </div>

          {/* Section 11 - Résiliation */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <Ban className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  11. Résiliation
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <p className="font-semibold text-gray-900">11.1. Résiliation par l'utilisateur</p>
                <p>
                  L'utilisateur peut résilier son compte à tout moment depuis son espace administrateur. La résiliation prendra effet à la fin de la période d'abonnement en cours.
                </p>
                
                <p className="font-semibold text-gray-900 mt-6">11.2. Résiliation par Rose des Vins</p>
                <p>
                  Rose des Vins se réserve le droit de suspendre ou de résilier immédiatement un compte en cas de :
                </p>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <ul className="space-y-2">
                    <li>• Violation des présentes CGU</li>
                    <li>• Utilisation frauduleuse du service</li>
                    <li>• Défaut de paiement</li>
                    <li>• Activité illégale ou nuisible</li>
                  </ul>
                </div>
                
                <p className="font-semibold text-gray-900 mt-6">11.3. Conséquences de la résiliation</p>
                <p>
                  En cas de résiliation, l'utilisateur perd l'accès à son compte et à toutes les données associées. Rose des Vins se réserve le droit de supprimer définitivement les données après un délai de 30 jours.
                </p>
              </div>
            </div>
          </div>

          {/* Section 12 - Droit applicable */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <Gavel className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  12. Droit applicable et juridiction
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <p>
                  Les présentes CGU sont soumises au droit français.
                </p>
                <p>
                  En cas de litige, les parties s'efforceront de trouver une solution amiable. À défaut, le litige sera porté devant les tribunaux compétents du ressort de Tours, France.
                </p>
              </div>
            </div>
          </div>

          {/* Section 13 - Contact */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#E8F5EC" }}>
                  <Mail className="w-6 h-6" style={{ color: "#3A7B59" }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  13. Contact
                </h2>
              </div>
            </div>
            <div className="p-8">
              <div className="space-y-4 text-gray-700">
                <p>
                  Pour toute question concernant les présentes CGU, vous pouvez nous contacter :
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <p><span className="font-medium">Par e-mail :</span> <a href="mailto:julia@rosedesvins.co" className="font-semibold hover:underline" style={{ color: "#3A7B59" }}>julia@rosedesvins.co</a></p>
                    <p><span className="font-medium">Par courrier :</span> Rose des Vins SAS, 30 rue de la Scellerie, 37000 TOURS, France</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Date de mise à jour */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Dernière mise à jour : 1er décembre 2025
          </p>
        </div>
      </section>

      {/* Professional Contact Section */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="w-16 h-16 rounded-full mx-auto mb-6" style={{ backgroundColor: "#E8F5EC" }}>
              <div className="w-full h-full rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8" style={{ color: "#3A7B59" }} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Questions sur nos conditions d'utilisation ?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Notre équipe est à votre disposition pour répondre à toutes vos questions.
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
