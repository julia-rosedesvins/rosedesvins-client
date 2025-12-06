import { ReactNode } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"
import CookieConsent from "./CookieConsent"

interface LandingPageLayoutProps {
  children: ReactNode
  className?: string
}

export default function LandingPageLayout({ children, className = "bg-gray-50" }: LandingPageLayoutProps) {
  return (
    <div className={`min-h-screen ${className}`}>
      <Navbar />
      {children}
      <Footer />
      <CookieConsent />
    </div>
  )
}
