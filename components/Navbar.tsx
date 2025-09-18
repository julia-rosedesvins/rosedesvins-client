"use client"

import { Instagram, Linkedin, Menu, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

// Navigation data structure
const navLinks = [
  { href: "#contact", label: "Contact", isSpecial: true },
  { href: "/about", label: "À propos" },
  { href: "#blog", label: "Blog" },
]

const socialLinks = [
  { href: "https://www.instagram.com/rose_des_vins/", icon: Instagram, label: "Instagram" },
  { href: "https://www.linkedin.com/company/rose-des-vins/", icon: Linkedin, label: "LinkedIn" },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (pathname === '/') {
      // If on home page, just scroll to contact
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    } else {
      // If on other page, navigate to home page with contact hash
      router.push('/#contact')
    }
  }

  const handleNavClick = (href: string, isSpecial?: boolean) => (e: React.MouseEvent) => {
    if (isSpecial) {
      handleContactClick(e)
    }
  }

  // Reusable Navigation Component
  const NavigationLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-sm hover:opacity-80"
          style={{ color: "white" }}
          onClick={handleNavClick(link.href, link.isSpecial)}
        >
          {link.label}
        </Link>
      ))}
      {!isMobile && (
        <div className="flex gap-4">
          {socialLinks.map((social) => {
            const IconComponent = social.icon
            return (
              <Link
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                <IconComponent className="w-4 h-4 hover:opacity-80 cursor-pointer" />
              </Link>
            )
          })}
        </div>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-50 text-white px-4 py-3" style={{ backgroundColor: "#3A7B59" }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <img
              src="/assets/logo.png"
              alt="Rose des Vins Logo"
              className="h-12 w-auto cursor-pointer"
            />
          </Link>
          <div className="hidden sm:block">
            <Link href="/">
              <h1 className="font-semibold text-lg cursor-pointer hover:opacity-80">Rose des Vins</h1>
            </Link>
            <p className="text-sm" style={{ color: "#8BB5A3" }}>
              Un accompagnement sur-mesure de vos événements
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          <NavigationLinks />
        </nav>

        {/* Mobile Menu Button */}
        <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 pb-4 border-t border-white/20">
          <nav className="flex flex-col gap-4 pt-4">
            <div className="flex flex-col gap-4" onClick={() => setMobileMenuOpen(false)}>
              <NavigationLinks isMobile />
            </div>
            <div className="flex gap-4 pt-2">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <Link
                    key={social.href}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-4 h-4 hover:opacity-80 cursor-pointer" />
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
