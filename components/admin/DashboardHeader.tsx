import { Button } from "@/components/ui/button"
import { Menu, Bell } from "lucide-react"

interface DashboardHeaderProps {
  title: string
  onMenuClick: () => void
}

export default function DashboardHeader({ title, onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="lg:hidden mr-2" 
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        </Button>
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ backgroundColor: "#3A7B59" }}
          >
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">Administrateur</p>
          </div>
        </div>
      </div>
    </header>
  )
}
