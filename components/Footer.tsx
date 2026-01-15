import { Instagram } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm opacity-90">
              Copyright © {new Date().getFullYear()} Rose des Vins
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="hover:opacity-80 transition-opacity">
              <Instagram className="h-5 w-5" />
            </a>
            <Link href="/blog" className="hover:opacity-80 transition-opacity">Blog</Link>
            <Link href="/faqs" className="hover:opacity-80 transition-opacity">FAQ</Link>
            <Link href="/contact" className="hover:opacity-80 transition-opacity">Contact</Link>
            <Link href="/legal-notices" className="hover:opacity-80 transition-opacity">Mentions légales</Link>
            <Link href="/privacy-policy" className="hover:opacity-80 transition-opacity">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
