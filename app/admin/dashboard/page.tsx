"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, Calendar, CalendarX, MessageSquare } from "lucide-react"
import DashboardLayout from "@/components/admin/DashboardLayout"
import { useAdmin } from '@/contexts/AdminContext'
import { adminService, AdminAnalyticsData } from '@/services/admin.service'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
    const { admin, isLoading } = useAdmin();
    const [analyticsData, setAnalyticsData] = useState<AdminAnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await adminService.getAdminAnalytics();
            if (response.success) {
                setAnalyticsData(response.data);
            } else {
                toast.error('Erreur lors du chargement des données analytiques');
            }
        } catch (error: any) {
            console.error('Error fetching admin analytics:', error);
            toast.error('Erreur lors du chargement des données analytiques');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (admin) {
            fetchAnalytics();
        }
    }, [admin]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-[#3A7B59] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, return null (AdminContext will handle redirect)
    if (!admin) {
        return null;
    }

    const dashboardCards = [
        {
            title: "Utilisateurs Actifs",
            value: analyticsData?.totalActiveUsers?.toString() || "0",
            icon: UserCheck,
            description: "Utilisateurs approuvés",
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Utilisateurs en Attente",
            value: analyticsData?.totalPendingUsers?.toString() || "0",
            icon: Users,
            description: "En attente d'approbation",
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
        {
            title: "Utilisateurs Rejetés",
            value: analyticsData?.totalRejectedUsers?.toString() || "0",
            icon: UserX,
            description: "Demandes rejetées",
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
        {
            title: "Abonnements Actifs",
            value: analyticsData?.totalActiveSubscriptions?.toString() || "0",
            icon: Calendar,
            description: "Abonnements en cours",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Abonnements Expirés",
            value: analyticsData?.totalExpiredSubscriptions?.toString() || "0",
            icon: CalendarX,
            description: "Abonnements expirés",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
        {
            title: "Tickets de Support",
            value: analyticsData?.totalOpenSupportTickets?.toString() || "0",
            icon: MessageSquare,
            description: "Tickets ouverts",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
    ]

    return (
        <DashboardLayout title="Tableau de bord">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">Bienvenue {admin.firstName} {admin.lastName}</h1>
                <p className="text-muted-foreground">Aperçu des statistiques administratives</p>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-2 border-[#3A7B59] border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-3 text-gray-600">Chargement des données...</span>
                </div>
            ) : (
                /* Analytics Cards */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboardCards.map((card, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow duration-200">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-card-foreground">{card.title}</CardTitle>
                                <div className={`p-2 rounded-full ${card.bgColor}`}>
                                    <card.icon className={`h-4 w-4 ${card.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary mb-1">{card.value}</div>
                                <p className="text-xs text-muted-foreground">{card.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </DashboardLayout>
    )
}
