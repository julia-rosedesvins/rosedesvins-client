"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Calendar, Clock, Users } from "lucide-react"
import LandingPageLayout from "@/components/LandingPageLayout"
import { useEffect, useState } from "react"
import { userService, ContactFormData } from "@/services/user.service"
import toast, { Toaster } from 'react-hot-toast'

export default function HomePage() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    domainName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Check if URL has #contact hash and scroll to it
    if (window.location.hash === '#contact') {
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
      }, 100) // Small delay to ensure the page is rendered
    }
  }, [])

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'Le prénom doit contenir au moins 2 caractères';
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.firstName)) {
      newErrors.firstName = 'Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le Nom de famille est requis';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Le Nom de famille contenir au moins 2 caractères';
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.lastName)) {
      newErrors.lastName = 'Le Nom de famille peut contenir que des lettres, espaces, tirets et apostrophes';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.domainName.trim()) {
      newErrors.domainName = 'Le nom du domaine est requis';
    } else if (formData.domainName.trim().length < 2) {
      newErrors.domainName = 'Le nom du domaine doit contenir au moins 2 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await userService.submitContactForm(formData);
      
      if (response.success) {
        toast.success('Votre demande a été envoyée avec succès ! Nous vous contacterons bientôt.');
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          domainName: '',
        });
        setErrors({});
      }
    } catch (error: any) {
      console.error('Contact form submission error:', error);
      
      if (error.errors && Array.isArray(error.errors)) {
        // Handle validation errors from backend
        const backendErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.field && err.message) {
            backendErrors[err.field] = err.message;
          }
        });
        setErrors(backendErrors);
        toast.error('Veuillez corriger les erreurs dans le formulaire');
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Une erreur est survenue lors de l\'envoi. Veuillez réessayer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {/* Video Container with Professional Styling */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Video Header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-600">
                      Démonstration - Système de réservation Rose des Vins
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                    DEMO
                  </div>
                </div>
              </div>
              
              {/* Video Content */}
              <div className="relative aspect-video bg-black">
                {/* Loading Placeholder */}
                <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-sm">Chargement de la vidéo...</p>
                  </div>
                </div>
                
                {/* Iframe */}
                <iframe
                  src="https://drive.google.com/file/d/1qk9D1CUH6Mj2tryhv_bL2Qmibncg2pSg/preview"
                  className="absolute inset-0 w-full h-full border-0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  title="Démonstration du système de réservation Rose des Vins"
                  loading="lazy"
                  onLoad={(e) => {
                    // Hide loading indicator when video loads
                    const loadingDiv = e.currentTarget.previousElementSibling as HTMLElement;
                    if (loadingDiv) loadingDiv.style.display = 'none';
                  }}
                ></iframe>
              </div>
              
              {/* Video Footer */}
              <div className="bg-white px-4 sm:px-6 py-3 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="text-gray-600 text-xs sm:text-sm font-medium">
                    🎥 Automatisez vos réservations
                  </div>
                  <div className="flex items-center space-x-3 sm:space-x-4 text-gray-500">
                    <span className="flex items-center space-x-1 text-xs sm:text-sm">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>2 min</span>
                    </span>
                    <span className="flex items-center space-x-1 text-xs sm:text-sm">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Vignerons</span>
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 opacity-10 rounded-full blur-xl"></div>
              <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 opacity-10 rounded-full blur-xl"></div>
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                <Input 
                  className={`w-full ${errors.firstName ? 'border-red-500 focus:border-red-500' : ''}`}
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Votre prénom"
                  disabled={isSubmitting}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de famille *
                </label>
                <Input 
                  className={`w-full ${errors.lastName ? 'border-red-500 focus:border-red-500' : ''}`}
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Votre nom de famille"
                  disabled={isSubmitting}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
              <Input 
                type="email" 
                className={`w-full ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="votre.email@exemple.com"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom du domaine *</label>
              <Input 
                className={`w-full ${errors.domainName ? 'border-red-500 focus:border-red-500' : ''}`}
                value={formData.domainName}
                onChange={(e) => handleInputChange('domainName', e.target.value)}
                placeholder="Nom de votre domaine viticole"
                disabled={isSubmitting}
              />
              {errors.domainName && (
                <p className="text-red-500 text-sm mt-1">{errors.domainName}</p>
              )}
            </div>

            <div className="text-center">
              <Button
                type="submit"
                className="text-white px-8 py-3 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#3A7B59" }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Envoi en cours...
                  </span>
                ) : (
                  'Envoyer'
                )}
              </Button>
            </div>
          </form>
        </div>
      </section>

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#3A7B59',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />

    </LandingPageLayout>
  )
}
