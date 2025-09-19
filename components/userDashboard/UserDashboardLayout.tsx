"use client"

import { ReactNode, useEffect, useState } from "react"
import { Header } from "./Header"
import { Navigation } from "./Navigation"

interface UserDashboardLayoutProps {
  children: ReactNode
  title?: string
}

export default function UserDashboardLayout({ children, title }: UserDashboardLayoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 sm:px-6 py-4" style={{ backgroundColor: '#3A7B59', color: 'white' }}>
          <div className="container mx-auto">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 bg-white/20 rounded"></div>
              <h1 className="text-lg font-semibold">Rose des Vins</h1>
            </div>
          </div>
        </div>
        <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Component */}
      <Header />
      
      {/* Navigation Component */}
      <Navigation />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        {children}
      </main>
    </div>
  )
}
