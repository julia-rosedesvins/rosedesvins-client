"use client"

import UserDashboardLayout from "@/components/userDashboard/UserDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, Wine, CreditCard } from "lucide-react";
import { useState } from "react";

export default function UserDashboard() {
    const [selectedPeriod, setSelectedPeriod] = useState("ce-mois");

    const getPeriodData = () => {
        switch (selectedPeriod) {
            case "cette-semaine":
                return {
                    reservations: { title: "Réservations cette semaine", value: "8", change: "+25% par rapport à la semaine dernière" },
                    visiteurs: { title: "Nombre de visiteurs", value: "32", period: "Cette semaine" },
                    chiffre: { title: "Chiffre d'affaires", value: "445€", period: "Cette semaine" }
                };
            case "cette-annee":
                return {
                    reservations: { title: "Réservations cette année", value: "287", change: "+18% par rapport à l'année dernière" },
                    visiteurs: { title: "Nombre de visiteurs", value: "1 247", period: "Cette année" },
                    chiffre: { title: "Chiffre d'affaires", value: "14 225€", period: "Cette année" }
                };
            default: // ce-mois
                return {
                    reservations: { title: "Réservations ce mois", value: "24", change: "+12% par rapport au mois dernier" },
                    visiteurs: { title: "Nombre de visiteurs", value: "142", period: "Ce mois-ci" },
                    chiffre: { title: "Chiffre d'affaires", value: "1 225€", period: "Ce mois-ci" }
                };
        }
    };

    const periodData = getPeriodData();
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
                        <div className="text-xl sm:text-2xl font-bold">{periodData.reservations.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">{periodData.reservations.change}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">{periodData.visiteurs.title}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">{periodData.visiteurs.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">{periodData.visiteurs.period}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Taux de conversion</CardTitle>
                        <Wine className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">68%</div>
                        <p className="text-xs text-muted-foreground mt-1">Visiteurs → Réservations</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">{periodData.chiffre.title}</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">{periodData.chiffre.value}</div>
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
                        <div className="space-y-3 lg:space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-2">
                                <div className="flex-1">
                                    <p className="font-medium text-sm lg:text-base">Bruno Mercier</p>
                                    <p className="text-xs lg:text-sm text-muted-foreground">Atelier vins et fromages - 4 personnes</p>
                                </div>
                                <p className="text-xs lg:text-sm font-medium text-right sm:text-left">Demain 14h00</p>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-2">
                                <div className="flex-1">
                                    <p className="font-medium text-sm lg:text-base">Groupe Entreprise</p>
                                    <p className="text-xs lg:text-sm text-muted-foreground">Visite + dégustation - 12 personnes</p>
                                </div>
                                <p className="text-xs lg:text-sm font-medium text-right sm:text-left">Samedi 10h00</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </UserDashboardLayout>
    );
}