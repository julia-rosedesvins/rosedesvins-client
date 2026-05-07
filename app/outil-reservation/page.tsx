"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Calendar, Clock, Users } from "lucide-react"
import LandingPageLayout from "@/components/LandingPageLayout"
import { useEffect, useState } from "react"
import { userService, ContactFormData } from "@/services/user.service"
import toast from 'react-hot-toast'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel"
import axios from "axios"

export default function OldHomePage() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    domainName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [outilItems, setOutilItems] = useState<{ _id: string; title: string; thumbnail: string }[]>([]);
  const [outilApi, setOutilApi] = useState<CarouselApi>();

  useEffect(() => {
    const fetchOutil = async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
        const res = await axios.get(`${base}/v1/outil`);
        if (res.data?.success) setOutilItems(res.data.data);
      } catch {}
    };
    fetchOutil();
  }, []);

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
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.focus();
      }
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
        
        // Scroll to first error field
        const firstErrorField = Object.keys(backendErrors)[0];
        if (firstErrorField) {
          document.getElementById(firstErrorField)?.focus();
        }
      } else if (error.message) {
        // Show general error inline
        setErrors({ submit: error.message });
      } else {
        setErrors({ submit: 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.' });
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
            <Button 
              className="text-white px-6 py-3 hover:opacity-90" 
              style={{ backgroundColor: "#3A7B59" }}
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Essayer gratuitement
            </Button>
          </div>
          <div className="relative">
            {/* Video Container with Professional Styling - Optimized for video content */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 w-full max-w-3xl mx-auto">
              
              {/* Video Content - Custom height to match video aspect ratio */}
              <div className="relative w-full h-[380px] md:h-[500px] lg:h-[560px] bg-black">
                {/* Video Element */}
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                >
                  <source 
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/v1/web/video/hero-section`} 
                    type="video/mp4" 
                  />
                  <p className="text-white text-center p-4">
                    Votre navigateur ne supporte pas la lecture de vidéos HTML5.
                  </p>
                </video>
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
              vos créneaux, connectez votre agenda et le reste se gère automatiquement : efficacité pour vous, autonomie pour vos clients.
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
                  Augmentez le nombre
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
                <h4 className="font-semibold text-lg mb-3">Limitez les no shows</h4>
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
                  Gagnez du temps et gardez la main sur vos disponibilités
                </h4>
                <p className="text-gray-600 text-sm">
                  Outil synchronisé avec votre agenda & calendriers personnalisables par expérience
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button 
            className="text-white px-6 py-3 hover:opacity-90" 
            style={{ backgroundColor: "#3A7B59" }}
            onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Réserver une démo
            </Button>
          </div>
        </div>
      </section>

      {/* Outil Carousel Section */}
      {outilItems.length > 0 && (
        <section className="py-12 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-[#318160] mb-4">
                Notre outil de réservation en action
              </h2>
            </div>
            <div className="relative px-4 md:px-20">
              <Carousel
                setApi={setOutilApi}
                opts={{ align: "center", loop: true }}
                className="w-full max-w-7xl mx-auto"
              >
                <CarouselContent className="-ml-2 md:-ml-12 items-center">
                  {outilItems.map((item) => (
                    <CarouselItem key={item._id} className="pl-2 md:pl-12 basis-full md:basis-1/3">
                      <a
                        href={item.title}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center group cursor-pointer"
                      >
                        <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full overflow-hidden mb-4 shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
                          <img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      </a>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex bg-white border border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white shadow-md md:-left-16" />
                <CarouselNext className="hidden md:flex bg-white border border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white shadow-md md:-right-16" />
              </Carousel>
              {/* Mobile arrows */}
              <div className="flex md:hidden justify-center gap-4 mt-4">
                <button
                  onClick={() => outilApi?.scrollPrev()}
                  className="bg-white border border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white shadow-md rounded-full p-2 transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </button>
                <button
                  onClick={() => outilApi?.scrollNext()}
                  className="bg-white border border-[#318160] text-[#318160] hover:bg-[#1D6346] hover:text-white shadow-md rounded-full p-2 transition-colors"
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.1584 3.13508C6.35985 2.94621 6.67627 2.95642 6.86514 3.15788L10.6151 7.15788C10.7954 7.3502 10.7954 7.64949 10.6151 7.84182L6.86514 11.8418C6.67627 12.0433 6.35985 12.0535 6.1584 11.8646C5.95694 11.6757 5.94673 11.3593 6.1356 11.1579L9.565 7.49985L6.1356 3.84182C5.94673 3.64036 5.95694 3.32394 6.1584 3.13508Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

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
              {/* <Button className="text-white px-6 py-3 hover:opacity-90" style={{ backgroundColor: "#3A7B59" }}>
                Voir les intégrations
              </Button> */}
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
              Pas de commission, pas de frais cachés : votre gagnez la main sur vos réservations.
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
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Abonnement annuel - 29 € / mois (HT)</h4>
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
                <span className="text-gray-700">Outil synchronisé avec votre agenda</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#3A7B59" }} />
                <span className="text-gray-700">Calendriers personnalisables par expérience</span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#3A7B59" }} />
                <span className="text-gray-700">
                  E-mails de confirmation et de rappel automatiques et personnalisables
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#3A7B59" }} />
                <span className="text-gray-700">Un accompagnement 7/7</span>
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
            {/* General error message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                <p className="text-sm font-medium">{errors.submit}</p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                <Input
                  id="firstName"
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
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de famille *
                </label>
                <Input
                  id="lastName"
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
              <Input
                id="email"
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
              <label htmlFor="domainName" className="block text-sm font-medium text-gray-700 mb-2">Nom du domaine *</label>
              <Input
                id="domainName"
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

    </LandingPageLayout>
  )
}
