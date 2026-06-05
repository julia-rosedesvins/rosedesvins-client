"use client"

import UserDashboardLayout from "@/components/userDashboard/UserDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, Wine, CreditCard, Loader2, CheckCircle2, Clock, XCircle, RefreshCw, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { userService, DashboardAnalytics } from "@/services/user.service";
import { getVendorTransactions, TransactionStatus } from "@/services/stripe-checkout.service";
import toast from "react-hot-toast";

export default function UserDashboard() {
    const [selectedPeriod, setSelectedPeriod] = useState("ce-mois");
    const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<TransactionStatus[]>([]);
    const [txLoading, setTxLoading] = useState(true);

    useEffect(() => {
        loadAnalytics();
        loadTransactions();
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

    const loadTransactions = async () => {
        try {
            setTxLoading(true);
            const data = await getVendorTransactions();
            setTransactions(data);
        } catch (error: any) {
            console.error('Error loading transactions:', error);
        } finally {
            setTxLoading(false);
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

    const txStatusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: React.ReactNode }> = {
        completed: { label: 'Payé',     variant: 'default',     icon: <CheckCircle2 className="w-3 h-3" /> },
        pending:   { label: 'En attente', variant: 'secondary', icon: <Clock className="w-3 h-3" /> },
        failed:    { label: 'Échoué',   variant: 'destructive', icon: <XCircle className="w-3 h-3" /> },
        expired:   { label: 'Expiré',   variant: 'outline',     icon: <AlertCircle className="w-3 h-3" /> },
        refunded:  { label: 'Remboursé', variant: 'secondary',  icon: <RefreshCw className="w-3 h-3" /> },
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
                        <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
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
                        <Users className="h-4 w-4 text-muted-foreground shrink-0" />
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
                        <Wine className="h-4 w-4 text-muted-foreground shrink-0" />
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
                        <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
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

                {/* Stripe Transactions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Transactions Stripe
                        </CardTitle>
                        <CardDescription className="text-sm">Paiements en ligne reçus</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {txLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : transactions.length > 0 ? (
                            <div className="space-y-3">
                                {transactions.map((tx) => {
                                    const cfg = txStatusConfig[tx.status] ?? txStatusConfig.pending;
                                    return (
                                        <div key={tx._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-2">
                                            <div className="flex-1 min-w-0">
                                                {/* Cardholder name or email */}
                                                <p className="font-medium text-sm truncate">
                                                    {tx.cardholderName || tx.customerEmail || '—'}
                                                </p>
                                                {/* Service + card last 4 */}
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {tx.serviceName || 'Réservation'}
                                                    {tx.cardLast4 && (
                                                        <span className="ml-2 font-mono tracking-wider">•••• {tx.cardLast4}</span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-muted-foreground">{formatDate(tx.createdAt)}</p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className="text-sm font-semibold">
                                                    {(tx.amount / 100).toFixed(2)} €
                                                </span>
                                                <Badge variant={cfg.variant} className="flex items-center gap-1 text-xs">
                                                    {cfg.icon}
                                                    {cfg.label}
                                                </Badge>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <CreditCard className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Aucune transaction Stripe</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </UserDashboardLayout>
    );
}