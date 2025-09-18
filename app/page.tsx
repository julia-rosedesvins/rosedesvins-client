"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Calendar, Clock, Users } from "lucide-react"
import LandingPageLayout from "@/components/LandingPageLayout"
import { useEffect } from "react"

export default function HomePage() {
  useEffect(() => {
    // Check if URL has #contact hash and scroll to it
    if (window.location.hash === '#contact') {
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
      }, 100) // Small delay to ensure the page is rendered
    }
  }, [])

  return (
    <LandingPageLayout>
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Automatisez vos réservations.
              <br />
              Gagnez du temps. Restez
              <br />
              disponible pour l'essentiel.
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Un système de réservation simple qui permet de gérer automatiquement les visites et dégustations sans
              effort, grâce à un calendrier interactif directement intégré à votre site internet et synchronisé avec
              votre agenda.
            </p>
            <Button className="text-white px-6 py-3 hover:opacity-90" style={{ backgroundColor: "#3A7B59" }}>
              Essayer gratuitement
            </Button>
          </div>
          <div className="relative">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="grid grid-cols-7 gap-2 mt-6">
                  {Array.from({ length: 35 }, (_, i) => (
                    <div
                      key={i}
                      className={`h-8 rounded ${i === 15 || i === 22 ? "" : "bg-gray-100"}`}
                      style={i === 15 || i === 22 ? { backgroundColor: "#3A7B59" } : {}}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Simplifiez la gestion de vos visites et dégustations
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Dites adieu aux aller-retours sur votre messagerie et à la gestion compliquée des réservations. Définissez
              vos créneaux, et le reste se gère automatiquement : efficacité pour vous, autonomie pour vos visiteurs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#C8E6D0" }}
                >
                  <Users className="w-8 h-8" style={{ color: "#3A7B59" }} />
                </div>
                <h4 className="font-semibold text-lg mb-3">
                  Augmenter le nombre
                  <br />
                  de réservations
                </h4>
                <p className="text-gray-600 text-sm">
                  Calendrier intégré sur le site de
                  <br />
                  domaine viticole
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#C8E6D0" }}
                >
                  <Clock className="w-8 h-8" style={{ color: "#3A7B59" }} />
                </div>
                <h4 className="font-semibold text-lg mb-3">Limiter les no shows</h4>
                <p className="text-gray-600 text-sm">
                  Confirmations immédiates et
                  <br />
                  e-mails de rappel automatiques
                  <br />
                  pour vous et vos visiteurs
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "#C8E6D0" }}
                >
                  <Calendar className="w-8 h-8" style={{ color: "#3A7B59" }} />
                </div>
                <h4 className="font-semibold text-lg mb-3">
                  Gagner du temps dans
                  <br />
                  la gestion des demandes
                </h4>
                <p className="text-gray-600 text-sm">
                  Calendrier synchronisé en temps
                  <br />
                  réel avec votre agenda
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button className="text-white px-6 py-3 hover:opacity-90" style={{ backgroundColor: "#3A7B59" }}>
              Réserver une démo
            </Button>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Intégration à votre site en quelques clics</h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <img
                src="/assets/group-platforms.jpg"
                alt="Integration platforms"
                className="max-w-full h-auto rounded-lg"
              />
            </div>

            <div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Notre système de réservation s'intègre facilement avec les principales plateformes de création de sites
                web. Que vous utilisiez WordPress, Wix, ou d'autres solutions, l'installation est simple et rapide.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                En quelques clics, ajoutez un calendrier de réservation interactif directement sur votre site internet.
                Vos visiteurs pourront réserver leurs visites et dégustations en toute autonomie, 24h/24 et 7j/7.
              </p>
              <Button className="text-white px-6 py-3 hover:opacity-90" style={{ backgroundColor: "#3A7B59" }}>
                Voir les intégrations
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Une tarification simple et transparente</h3>
            <p className="text-gray-600">
              Pas de commission, pas de frais cachés, pas d'intermédiaire : votre gagnez la main sur vos réservations.
            </p>
          </div>

          <div className="rounded-lg p-8 text-center" style={{ backgroundColor: "#E8F5EC" }}>
            <div
              className="inline-block text-white px-4 py-2 rounded-full text-sm mb-6"
              style={{ backgroundColor: "#3A7B59" }}
            >
              Essai gratuit de 30 jours
            </div>

            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Abonnement annuel - 29 € / mois</h4>
            </div>

            <div className="space-y-4 text-left max-w-md mx-auto">
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#3A7B59" }} />
                <span className="text-gray-700">
                  Gestion automatisée des réservations directement sur le site du domaine
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#3A7B59" }} />
                <span className="text-gray-700">Calendriers synchronisés</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#3A7B59" }} />
                <span className="text-gray-700">
                  Notifications automatiques de mail de confirmation, de rappel... 1 jour de demande et le visiteur
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#3A7B59" }} />
                <span className="text-gray-700">Comptes utilisateurs illimités</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#3A7B59" }} />
                <span className="text-gray-700">Un accompagnement 7/7</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#3A7B59" }} />
                <span className="text-gray-700">3 langues disponibles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-16">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4" style={{ color: "#3A7B59" }}>
              Formulaire de contact
            </h3>
          </div>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                <Input className="w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <Input className="w-full" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
              <Input type="email" className="w-full" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom du domaine *</label>
              <Input className="w-full" />
            </div>

            <div className="text-center">
              <Button
                type="submit"
                className="text-white px-8 py-3 hover:opacity-90"
                style={{ backgroundColor: "#3A7B59" }}
              >
                Envoyer
              </Button>
            </div>
          </form>
        </div>
      </section>

    </LandingPageLayout>
  )
}
