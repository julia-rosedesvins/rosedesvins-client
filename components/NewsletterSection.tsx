'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Mail, Loader2 } from "lucide-react";
import { newsletterService } from "@/services/newsletter.service";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Veuillez entrer votre adresse email");
      return;
    }

    try {
      setIsSubmitting(true);
      let response: any = null;
      try {
        response = await newsletterService.subscribe(email);
      } catch {
        toast.error("Erreur réseau. Veuillez réessayer.");
        return;
      }
      if (response?.success) {
        toast.success("Merci pour votre inscription !");
        setEmail("");
      } else {
        toast.error("Cet email est déjà inscrit ou une erreur est survenue.");
      }
    } catch {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-8 px-4 bg-gradient-to-br from-[#3181600d]/5 to-[#3181600d]/5">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-[#d1e0da] rounded-lg p-8 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-4 text-[#318160]">
              Laissez-vous guider.
            </h2>
            <p className="text-[#264035]">
              Recevez par mail nos suggestions de domaines, d'expériences et d'escapades viticoles.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7B947F]" size={20} />
              <Input
                type="email"
                placeholder="Votre adresse e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="pl-10"
              />
            </div>
            <Button 
              type="submit" 
              size="lg" 
              disabled={isSubmitting}
              className="bg-[#318160] hover:bg-[#1D6346] text-white disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                "S'abonner"
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
