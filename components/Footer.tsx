import { Instagram } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <p className="text-sm opacity-90">
              Copyright © {new Date().getFullYear()} Rose des Vins
            </p>
          </div>
          
          <div className="grid grid-cols-3 sm:flex sm:flex-row items-center gap-4 sm:gap-6 text-sm justify-center">
            <a href="https://www.instagram.com/rose_des_vins/" className="hover:opacity-80 transition-opacity flex justify-center">
              <Instagram className="h-5 w-5" />
            </a>
            {/* <Link href="/blog" className="hover:opacity-80 transition-opacity text-center">Blog</Link> */}
            <Link href="/faqs" className="hover:opacity-80 transition-opacity text-center">FAQ</Link>
            <Link href="/contact" className="hover:opacity-80 transition-opacity text-center">Contact</Link>
            <Link href="/legal-notices" className="hover:opacity-80 transition-opacity text-center sm:whitespace-nowrap">Mentions légales</Link>
            <Link href="/privacy-policy" className="hover:opacity-80 transition-opacity text-center sm:whitespace-nowrap">Politique de confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
