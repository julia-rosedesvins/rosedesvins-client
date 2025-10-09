"use client"

import LandingPageLayout from "@/components/LandingPageLayout"
import { HelpCircle, Calendar, Globe, CheckCircle, RefreshCw, Code, Mail, Gift, Layers, XCircle, Clock, DollarSign, Heart } from "lucide-react"
import { useState } from "react"

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const faqs = [
    {
      question: "Est-ce que le système de réservation Rose des Vins est compliqué à installer ?",
      answer: "Non, c'est très simple. Une fois votre compte créé, vous connectez votre agenda (Google Calendar, Outlook, etc.) et vous copiez-collez une ligne de code sur votre site. Si besoin, je peux vous accompagner gratuitement à cette étape.",
      icon: Code
    },
    {
      question: "Est-ce que Rose des Vins fonctionne avec tous les sites internet ?",
      answer: "Oui. L'outil est compatible avec tous les types de sites (WordPress, Wix, Jimdo, Shopify, site développé sur-mesure…).",
      icon: Globe
    },
    {
      question: "Comment se fait la validation des réservations ?",
      answer: "Les créneaux sont directement synchronisés avec votre agenda personnel. Si vous êtes disponible, les gens peuvent réserver. Si vous bloquez une date dans votre agenda, elle devient automatiquement indisponible. Pas besoin de valider quoi que ce soit.",
      icon: CheckCircle
    },
    {
      question: "Puis-je annuler une réservation ?",
      answer: "Vous pouvez annuler facilement depuis votre interface ou l'e-mail de confirmation reçu. Un email est automatiquement envoyé au client pour le prévenir. Vous gardez le contrôle complet.",
      icon: XCircle
    },
    {
      question: "Comment se fait la synchronisation des agendas ?",
      answer: "Nous utilisons les systèmes de synchronisation intégrés de Google et Outlook, qui sont fiables et sécurisés. Cela permet une mise à jour automatique et sans effort des agendas.",
      icon: RefreshCw
    },
    {
      question: "Comment installer l'outil de calendrier sur mon site ?",
      answer: "Le domaine viticole a juste à créer un compte, connecter son agenda (Google Calendar, Outlook ou équivalent) et insérer le code généré automatiquement. L'intégration du calendrier se fait en quelques clics avec tous les constructeurs de sites web. Notre plateforme génèrera une ligne de code qu'il faut juste copier et coller où vous souhaitez voir le calendrier apparaître sur votre site, logiquement à la place du formulaire de réservation par exemple. Nous pouvons vous accompagner sans souci. Et vous pouvez créer une page test pour voir comment cela fonctionne, sans rien changer sur votre site. L'outil a été pensé pour des domaines viticoles qui n'ont pas le temps ou l'envie de se perdre dans des solutions compliquées. Tout est clair, simple, et vous êtes accompagné à chaque étape si besoin.",
      icon: Calendar
    },
    {
      question: "Comment garantir que mon e-mail de confirmation n'arrivera pas dans les spams du visiteur ?",
      answer: "Nous mettons en place toutes les bonnes pratiques nécessaires pour que vos e-mails de confirmation arrivent bien dans la boîte de réception des visiteurs, et non dans leurs spams. Concrètement, nous utilisons des adresses d'envoi reconnues, surveillons leur réputation et veillons à ce que les messages soient clairs et fiables. Cela garantit une réception optimale des confirmations.",
      icon: Mail
    },
    {
      question: "Est-ce que les visiteurs reçoivent une confirmation ?",
      answer: "Oui. Une confirmation automatique est envoyée au client et à vous dès qu'une réservation est faite. Vous pouvez aussi activer des emails de rappel avant la visite.",
      icon: CheckCircle
    },
    {
      question: "Est-ce que je peux proposer plusieurs types de visites ou dégustations ?",
      answer: "Oui. Vous pouvez créer autant d'offres que vous voulez, avec leur propre durée, nombre de participants, langue, tarif, etc.",
      icon: Layers
    },
    {
      question: "Est-ce que je peux arrêter mon abonnement quand je veux ?",
      answer: "Oui. Si vous choisissez la formule mensuelle à 49 €, vous pouvez arrêter à tout moment. Si vous optez pour la formule à 29 €/mois, vous vous engagez sur 12 mois, mais le tarif est plus avantageux.",
      icon: Clock
    },
    {
      question: "Et si je change d'avis ?",
      answer: "Vous avez 60 jours d'essai gratuit pour tester tranquillement l'outil, sans engagement. Vous pouvez vous faire une idée sans pression.",
      icon: Heart
    },
    {
      question: "Est-ce qu'il y a une commission sur mes ventes ?",
      answer: "Non. Il n'y a aucune commission, aucun pourcentage. Ce n'est pas une plateforme de revente, vous restez 100 % indépendant.",
      icon: DollarSign
    }
  ]

  return (
    <LandingPageLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 bg-[url('/assets/pattern.svg')] opacity-5"></div>
        <div className="relative max-w-5xl mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-8" style={{ backgroundColor: "#E8F5EC" }}>
              <HelpCircle className="w-10 h-10" style={{ color: "#3A7B59" }} />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Questions Fréquentes
            </h1>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-gray-600 leading-relaxed font-light">
                Retrouvez toutes les réponses aux questions les plus courantes sur notre système de réservation pour domaines viticoles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="space-y-6">
          {faqs.map((faq, index) => {
            const IconComponent = faq.icon
            const isOpen = openFAQ === index
            
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#E8F5EC" }}>
                      <IconComponent className="w-6 h-6" style={{ color: "#3A7B59" }} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 pr-4">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'rotate-180' : ''}`} style={{ backgroundColor: "#E8F5EC" }}>
                      <svg className="w-5 h-5" style={{ color: "#3A7B59" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>
                
                <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                  <div className="px-8 pb-6">
                    <div className="ml-16 pl-4 border-l-2" style={{ borderColor: "#E8F5EC" }}>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="w-16 h-16 rounded-full mx-auto mb-6" style={{ backgroundColor: "#E8F5EC" }}>
              <div className="w-full h-full rounded-full flex items-center justify-center">
                <HelpCircle className="w-8 h-8" style={{ color: "#3A7B59" }} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Une autre question ?
            </h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Notre équipe est là pour vous accompagner et répondre à toutes vos questions personnalisées.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:julia@rosedesvins.co"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white rounded-xl hover:transform hover:scale-105 transition-all duration-200 shadow-lg"
                style={{ backgroundColor: "#3A7B59" }}
              >
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </section>

    </LandingPageLayout>
  )
}
