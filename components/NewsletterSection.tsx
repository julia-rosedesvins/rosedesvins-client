'use client";'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Mail } from "lucide-react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Merci pour votre inscription !");
      setEmail("");
    }
  };

  return (
    <section className="py-8 px-4 bg-gradient-to-br from-[#3181600d]/5 to-[#3181600d]/5">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-[#d1e0da] rounded-lg p-8 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold mb-4 text-[#318160]">
              Explorez les vignobles autrement
            </h2>
            <p className="text-[#264035]">
              Laissez-vous guider : inscrivez-vous pour recevoir des suggestions de domaines à visiter, 
              des expériences à réserver et des inspirations pour vos prochaines escapades viticoles.
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
                className="pl-10"
              />
            </div>
            <Button type="submit" size="lg" className="bg-[#318160] hover:bg-[#1D6346] text-white">
              S'abonner
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
