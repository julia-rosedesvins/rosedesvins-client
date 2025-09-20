import { Button } from "@/components/ui/button"
import { LogOut, Home, Calendar, Users, Wine, BarChart3, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAdmin } from "@/contexts/AdminContext"

interface SidebarItem {
  icon: any
  label: string
  active?: boolean
  href?: string
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  currentPath?: string
}

const sidebarItems: SidebarItem[] = [
  { icon: Home, label: "Tableau de bord", href: "/admin/dashboard" },
  { icon: Calendar, label: "Réservations", href: "/admin/reservations" },
  { icon: Users, label: "Clients", href: "/admin/clients" },
  { icon: Wine, label: "Dégustations", href: "/admin/degustations" },
  { icon: BarChart3, label: "Statistiques", href: "/admin/statistiques" },
  { icon: Settings, label: "Paramètres", href: "/admin/parametres" },
]

export default function DashboardSidebar({ isOpen, onClose, currentPath = "/admin/dashboard" }: SidebarProps) {
  const router = useRouter();
  const { logout } = useAdmin();

  const handleNavigation = (href: string) => {
    router.push(href);
    onClose(); // Close mobile sidebar after navigation
  };

  const handleLogout = async () => {
    try {
      await logout();
      // logout function already handles redirect to /admin
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-lg`}
        style={{ backgroundColor: "#3A7B59" }}
      >
        <Link href="/" className="flex items-center px-6 py-4 border-b border-white/20 hover:bg-white/5 transition-colors duration-200">
          <img
            src="/assets/logo.png"
            alt="Rose des Vins Logo"
            className="h-10 w-auto mr-3"
          />
          <div>
            <h1 className="text-lg font-bold text-white">Rose des Vins</h1>
            <p className="text-xs text-white/80">Administration</p>
          </div>
        </Link>

        <nav className="mt-6">
          <div className="px-3 space-y-1">
            {sidebarItems.map((item, index) => {
              const isActive = currentPath === item.href
              return (
                <Button
                  key={index}
                  variant="ghost"
                  className={`w-full justify-start text-left px-4 py-3 transition-colors duration-200 ${
                    isActive
                      ? "bg-white text-gray-900 hover:bg-white/90"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                  onClick={() => handleNavigation(item.href!)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              )
            })}
          </div>
        </nav>

        <div className="absolute bottom-6 left-3 right-3">
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-3 text-white/80 hover:bg-red-500/20 hover:text-white transition-colors duration-200"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span className="font-medium">Déconnexion</span>
          </Button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={onClose} 
        />
      )}
    </>
  )
}
