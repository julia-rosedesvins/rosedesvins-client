"use client";

import { useEffect, useState } from "react";
import LandingPageLayout from "@/components/LandingPageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userService, type ContactFormData } from "@/services/user.service";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    domainName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (window.location.hash === "#contact") {
      setTimeout(() => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, []);

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "Le prénom doit contenir au moins 2 caractères";
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.firstName)) {
      newErrors.firstName = "Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le Nom de famille est requis";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Le Nom de famille contenir au moins 2 caractères";
    } else if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.lastName)) {
      newErrors.lastName = "Le Nom de famille peut contenir que des lettres, espaces, tirets et apostrophes";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (!formData.domainName.trim()) {
      newErrors.domainName = "Le nom du domaine est requis";
    } else if (formData.domainName.trim().length < 2) {
      newErrors.domainName = "Le nom du domaine doit contenir au moins 2 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
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
        toast.success("Votre demande a été envoyée avec succès ! Nous vous contacterons bientôt.");
        setFormData({ firstName: "", lastName: "", email: "", domainName: "" });
        setErrors({});
      }
    } catch (error: any) {
      console.error("Contact form submission error:", error);

      if (error.errors && Array.isArray(error.errors)) {
        const backendErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.field && err.message) {
            backendErrors[err.field] = err.message;
          }
        });
        setErrors(backendErrors);
        const firstErrorField = Object.keys(backendErrors)[0];
        if (firstErrorField) {
          document.getElementById(firstErrorField)?.focus();
        }
      } else if (error.message) {
        setErrors({ submit: error.message });
      } else {
        setErrors({ submit: "Une erreur est survenue lors de l'envoi. Veuillez réessayer." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LandingPageLayout>
      <div className="min-h-screen flex flex-col">
        <section className="max-w-3xl mx-auto px-4 py-16 flex-1" id="contact">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4" style={{ color: "#3A7B59" }}>
            Contactez-nous
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Laissez-nous vos coordonnées et le nom de votre domaine. Nous reviendrons vers vous rapidement.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
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
                className={`w-full ${errors.firstName ? "border-red-500 focus:border-red-500" : ""}`}
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="Votre prénom"
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Nom de famille *</label>
              <Input
                id="lastName"
                className={`w-full ${errors.lastName ? "border-red-500 focus:border-red-500" : ""}`}
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
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
              className={`w-full ${errors.email ? "border-red-500 focus:border-red-500" : ""}`}
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
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
              className={`w-full ${errors.domainName ? "border-red-500 focus:border-red-500" : ""}`}
              value={formData.domainName}
              onChange={(e) => handleInputChange("domainName", e.target.value)}
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
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Envoi en cours...
                </span>
              ) : (
                "Envoyer"
              )}
            </Button>
          </div>
        </form>
        </section>
      </div>
    </LandingPageLayout>
  );
}
