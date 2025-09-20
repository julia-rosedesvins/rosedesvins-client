"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { navigationItems } from "./Navigation";
import { useUser } from "@/contexts/UserContext";

export const Header = () => {
  const router = useRouter();
  const { user, logout } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState({
    code: 'FR',
    flag: '🇫🇷',
    name: 'Français'
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const languages = [
    { code: 'FR', flag: '🇫🇷', name: 'Français' },
    { code: 'EN', flag: '🇬🇧', name: 'English' },
    { code: 'ES', flag: '🇪🇸', name: 'Español' },
    { code: 'DE', flag: '🇩🇪', name: 'Deutsch' },
    { code: 'IT', flag: '🇮🇹', name: 'Italiano' }
  ];

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
  };

  if (!mounted) {
    return (
      <header className="px-4 sm:px-6 py-4" style={{ backgroundColor: '#3A7B59', color: 'white' }}>
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Image 
                  src="/assets/logo.png" 
                  alt="Rose des Vins Logo" 
                  width={48}
                  height={48}
                  className="h-12 w-auto cursor-pointer"
                />
              </Link>
              <div className="hidden sm:block">
                <Link href="/">
                  <h1 className="text-lg sm:text-xl font-semibold cursor-pointer hover:opacity-80">Rose des Vins</h1>
                </Link>
                <p className="text-xs sm:text-sm opacity-90">La technologie au service de l'œnotourisme</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <span>Loading...</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="px-4 sm:px-6 py-4" style={{ backgroundColor: '#3A7B59', color: 'white' }}>
      <div className="container mx-auto">
        {/* Desktop Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/">
              <Image 
                src="/assets/logo.png" 
                alt="Rose des Vins Logo" 
                width={48}
                height={48}
                className="h-12 w-auto cursor-pointer"
              />
            </Link>
            <div className="hidden sm:block">
              <Link href="/">
                <h1 className="text-lg sm:text-xl font-semibold cursor-pointer hover:opacity-80">Rose des Vins</h1>
              </Link>
              <p className="text-xs sm:text-sm opacity-90">La technologie au service de l'œnotourisme</p>
            </div>
            <div className="sm:hidden">
              <Link href="/">
                <h1 className="text-lg font-semibold cursor-pointer hover:opacity-80">Rose des Vins</h1>
              </Link>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer hover:bg-white/10 rounded-lg px-2 py-1 transition-colors" style={{ color: 'white' }}>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold">D&F</span>
                  </div>
                  <span className="text-sm">Domaine Dupont & Fils</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-background border border-border shadow-lg z-50"
              >
                {navigationItems.map((route) => (
                  <DropdownMenuItem
                    key={route.href}
                    onClick={() => handleNavigation(route.href)}
                    className="flex items-center gap-3 cursor-pointer hover:bg-accent"
                  >
                    <route.icon className="h-4 w-4" />
                    <span className="font-medium">{route.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="ghost" 
              className="hover:bg-white/10 flex items-center gap-2"
              style={{ color: 'white' }}
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-white/10 flex items-center gap-2"
                  style={{ color: 'white' }}
                >
                  <span className="text-lg">{selectedLanguage.flag}</span>
                  <span>{selectedLanguage.code}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-background border border-border shadow-lg z-50"
              >
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => setSelectedLanguage(language)}
                    className="flex items-center gap-3 cursor-pointer hover:bg-accent"
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className="font-medium">{language.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-white/10 flex items-center gap-1"
                  style={{ color: 'white' }}
                >
                  <span className="text-sm">{selectedLanguage.flag}</span>
                  <span className="text-xs">{selectedLanguage.code}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-background border border-border shadow-lg z-50"
              >
                {languages.map((language) => (
                  <DropdownMenuItem
                    key={language.code}
                    onClick={() => setSelectedLanguage(language)}
                    className="flex items-center gap-3 cursor-pointer hover:bg-accent"
                  >
                    <span className="text-lg">{language.flag}</span>
                    <span className="font-medium">{language.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-white/10 p-2"
              style={{ color: 'white' }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/20">
            <div className="flex flex-col space-y-2 mt-4">
              <div className="flex items-center space-x-2 px-2 py-2 rounded-lg bg-white/10">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold">D&F</span>
                </div>
                <span className="text-sm">Domaine Dupont & Fils</span>
              </div>
              
              {navigationItems.map((route) => (
                <Button
                  key={route.href}
                  variant="ghost"
                  className="justify-start hover:bg-white/10 text-left flex items-center gap-3"
                  style={{ color: 'white' }}
                  onClick={() => handleNavigation(route.href)}
                >
                  <route.icon className="h-4 w-4" />
                  {route.name}
                </Button>
              ))}
              
              <Button 
                variant="ghost" 
                className="justify-start hover:bg-white/10 text-left flex items-center gap-3"
                style={{ color: 'white' }}
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};