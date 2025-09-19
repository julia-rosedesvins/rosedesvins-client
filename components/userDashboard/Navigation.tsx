"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, User, Building2, Calendar, Settings, Phone } from "lucide-react";
import { useEffect, useState } from "react";

export const navigationItems = [
  { name: "Tableau de bord", href: "/dashboard", icon: BarChart3 },
  { name: "Mon compte", href: "/dashboard/my-account", icon: User },
  { name: "Profil du domaine", href: "/dashboard/domain-profile", icon: Building2 },
  { name: "Réservations", href: "/dashboard/reservations", icon: Calendar },
  { name: "Paramètres", href: "/", icon: Settings },
  { name: "Contact", href: "/contact", icon: Phone }
];

interface NavigationProps {
  activeTab?: string;
}

export const Navigation = ({ activeTab }: NavigationProps) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="border-b bg-white hidden lg:block">
        <div className="container mx-auto px-6">
          <div className="flex space-x-8">
            {navigationItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className="h-14 px-0 rounded-none border-b-2 hover:bg-transparent flex items-center gap-2"
                  style={{ borderColor: 'transparent', color: '#6b7280' }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    );
  }
  
  return (
    <nav className="border-b bg-white hidden lg:block">
      <div className="container mx-auto px-6">
        <div className="flex space-x-8">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || 
                           (pathname === "/" && item.name === "Paramètres");
            
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={`h-14 px-0 rounded-none border-b-2 hover:bg-transparent flex items-center gap-2`}
                  style={
                    isActive
                      ? { borderColor: '#3A7B59', color: '#3A7B59' }
                      : { borderColor: 'transparent', color: '#6b7280' }
                  }
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};