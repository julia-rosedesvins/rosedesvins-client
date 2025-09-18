import { ReactNode } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"

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
    </div>
  )
}
