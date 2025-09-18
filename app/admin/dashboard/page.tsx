"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Wine, TrendingUp } from "lucide-react"
import DashboardLayout from "@/components/admin/DashboardLayout"

export default function AdminDashboard() {
    const dashboardCards = [
        {
            title: "Réservations Totales",
            value: "247",
            change: "+12%",
            changeType: "positive" as const,
            icon: Calendar,
            description: "Ce mois",
        },
        {
            title: "Visiteurs Actifs",
            value: "89",
            change: "+5%",
            changeType: "positive" as const,
            icon: Users,
            description: "En ligne maintenant",
        },
        {
            title: "Dégustations",
            value: "156",
            change: "+8%",
            changeType: "positive" as const,
            icon: Wine,
            description: "Cette semaine",
        },
        {
            title: "Revenus",
            value: "€12,450",
            change: "+15%",
            changeType: "positive" as const,
            icon: TrendingUp,
            description: "Ce mois",
        },
    ]

    return (
        <DashboardLayout title="Tableau de bord">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">Bienvenue sur votre tableau de bord</h1>
                <p className="text-muted-foreground">Voici un aperçu de votre activité récente</p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardCards.map((card, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-card-foreground">{card.title}</CardTitle>
                            <card.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary mb-1">{card.value}</div>
                            <div className="flex items-center space-x-2">
                                <Badge
                                    variant="secondary"
                                    className="text-white font-medium"
                                    style={{ backgroundColor: "#3A7B59" }}
                                >
                                    {card.change}
                                </Badge>
                                <p className="text-xs text-muted-foreground">{card.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-card-foreground">Activité récente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-card-foreground">Nouvelle réservation</p>
                                    <p className="text-xs text-muted-foreground">Marie Dubois - Dégustation premium</p>
                                </div>
                                <span className="text-xs text-muted-foreground">Il y a 5 min</span>
                            </div>
                            <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-card-foreground">Paiement reçu</p>
                                    <p className="text-xs text-muted-foreground">€85.00 - Réservation #247</p>
                                </div>
                                <span className="text-xs text-muted-foreground">Il y a 12 min</span>
                            </div>
                            <div className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                                <div className="w-2 h-2 bg-chart-4 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-card-foreground">Nouveau message</p>
                                    <p className="text-xs text-muted-foreground">Question sur les horaires de visite</p>
                                </div>
                                <span className="text-xs text-muted-foreground">Il y a 1h</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
