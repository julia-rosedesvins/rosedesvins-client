import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-6 sm:space-y-8 md:space-y-0 md:flex-row md:justify-between md:items-center">
          {/* Copyright Section */}
          <div className="text-center md:text-left">
            <p className="text-sm sm:text-base text-gray-600 font-medium">
              Copyright © {new Date().getFullYear()} Rose des Vins
            </p>
          </div>
          
          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-4 sm:gap-6 lg:gap-8">
            <Link 
              href="/faqs" 
              className="text-sm sm:text-base text-gray-600 hover:text-gray-900 hover:underline transition-all duration-200 py-2 px-1"
            >
              FAQ
            </Link>
            <Link 
              href="/legal-notices" 
              className="text-sm sm:text-base text-gray-600 hover:text-gray-900 hover:underline transition-all duration-200 py-2 px-1 text-center"
            >
              Mentions légales
            </Link>
            <Link 
              href="/privacy-policy" 
              className="text-sm sm:text-base text-gray-600 hover:text-gray-900 hover:underline transition-all duration-200 py-2 px-1 text-center"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
        
      </div>
    </footer>
  )
}
