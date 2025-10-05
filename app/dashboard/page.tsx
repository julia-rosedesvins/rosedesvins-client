"use client"

import UserDashboardLayout from "@/components/userDashboard/UserDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, Wine, CreditCard, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { userService, DashboardAnalytics } from "@/services/user.service";
import toast from "react-hot-toast";

export default function UserDashboard() {
    const [selectedPeriod, setSelectedPeriod] = useState("ce-mois");
    const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            setIsLoading(true);
            const response = await userService.getDashboardAnalytics();
            setAnalytics(response.data);
        } catch (error: any) {
            console.error('Error loading analytics:', error);
            toast.error('Erreur lors du chargement des statistiques');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatParticipants = (adults: number, children: number) => {
        const total = adults + children;
        if (children > 0) {
            return `${total} personnes (${adults} adultes, ${children} enfants)`;
        }
        return `${adults} personnes (adultes)`;
    };

    // For now, we're only showing current month data from the API
    // The period selector is kept for UI consistency but currently only shows "ce-mois" data
    const periodData = {
        reservations: { 
            title: "Réservations ce mois", 
            value: analytics?.reservationsThisMonth?.toString() || "0", 
            change: "Ce mois-ci" 
        },
        visiteurs: { 
            title: "Nombre de visiteurs", 
            value: analytics?.visitors?.toString() || "0", 
            period: "Ce mois-ci" 
        },
        chiffre: { 
            title: "Chiffre d'affaires", 
            value: analytics ? `${analytics.turnover.toFixed(2)}€` : "0€", 
            period: "Ce mois-ci" 
        }
    };
    return (
        <UserDashboardLayout title="Tableau de bord">
            <div className="mb-6 lg:mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
                        <p className="text-sm lg:text-base text-gray-600">Vue d'ensemble de votre activité œnotouristique.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <span className="text-sm text-gray-600">Période :</span>
                        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                            <SelectTrigger className="w-full sm:w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cette-semaine">Cette semaine</SelectItem>
                                <SelectItem value="ce-mois">Ce mois</SelectItem>
                                <SelectItem value="cette-annee">Cette année</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">{periodData.reservations.title}</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                periodData.reservations.value
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{periodData.reservations.change}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">{periodData.visiteurs.title}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                periodData.visiteurs.value
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{periodData.visiteurs.period}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Taux de conversion</CardTitle>
                        <Wine className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                `${analytics?.conversionRate?.toFixed(1) || '0'}%`
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Visiteurs → Réservations</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">{periodData.chiffre.title}</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                periodData.chiffre.value
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{periodData.chiffre.period}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg lg:text-xl">Prochaines réservations</CardTitle>
                        <CardDescription className="text-sm">Vos prochains visiteurs</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : analytics?.nextReservations && analytics.nextReservations.length > 0 ? (
                            <div className="space-y-3 lg:space-y-4">
                                {analytics.nextReservations.map((reservation, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-2">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm lg:text-base">{reservation.customerEmail}</p>
                                            <p className="text-xs lg:text-sm text-muted-foreground">
                                                {reservation.eventName} - {formatParticipants(reservation.participantsAdults, reservation.participantsEnfants)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{reservation.phoneNo}</p>
                                        </div>
                                        <p className="text-xs lg:text-sm font-medium text-right sm:text-left">
                                            {formatDate(`${reservation.bookingDate}T${reservation.bookingTime}`)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Aucune réservation à venir</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </UserDashboardLayout>
    );
}