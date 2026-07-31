"use client"

import UserDashboardLayout from "@/components/userDashboard/UserDashboardLayout";
import BookingsByMonthChart from "@/components/userDashboard/BookingsByMonthChart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, Wine, CreditCard, Loader2, CheckCircle2, Clock, XCircle, RefreshCw, AlertCircle, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { userService, DashboardAnalytics, DashboardPeriod } from "@/services/user.service";
import { getVendorTransactions, TransactionStatus } from "@/services/stripe-checkout.service";
import { BookingSourceFilterProvider, useBookingSourceFilter } from "@/components/userDashboard/BookingSourceFilterContext";
import { BookingSourceFilterDropdown } from "@/components/userDashboard/BookingSourceFilterDropdown";
import toast from "react-hot-toast";

type UiPeriod = "cette-semaine" | "ce-mois" | "cette-annee";

const UI_TO_API_PERIOD: Record<UiPeriod, DashboardPeriod> = {
    "cette-semaine": "week",
    "ce-mois": "month",
    "cette-annee": "year",
};

const PERIOD_LABELS: Record<UiPeriod, { reservationsTitle: string; periodLabel: string }> = {
    "cette-semaine": {
        reservationsTitle: "Réservations cette semaine",
        periodLabel: "Cette semaine",
    },
    "ce-mois": {
        reservationsTitle: "Réservations ce mois",
        periodLabel: "Ce mois-ci",
    },
    "cette-annee": {
        reservationsTitle: "Réservations cette année",
        periodLabel: "Cette année",
    },
};

export default function UserDashboard() {
    return (
        <BookingSourceFilterProvider>
            <UserDashboardContent />
        </BookingSourceFilterProvider>
    );
}

function UserDashboardContent() {
    const [selectedPeriod, setSelectedPeriod] = useState<UiPeriod>("ce-mois");
    const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<TransactionStatus[]>([]);
    const [txLoading, setTxLoading] = useState(true);
    const { selectedSources } = useBookingSourceFilter();

    const loadAnalytics = useCallback(async (uiPeriod: UiPeriod, bookingSources: string[]) => {
        const apiPeriod = UI_TO_API_PERIOD[uiPeriod];
        try {
            setIsLoading(true);
            const response = await userService.getDashboardAnalytics(apiPeriod, bookingSources);
            setAnalytics(response.data);
        } catch (error: unknown) {
            console.error('Error loading analytics:', error);
            toast.error('Erreur lors du chargement des statistiques');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadTransactions = async () => {
        try {
            setTxLoading(true);
            const data = await getVendorTransactions();
            setTransactions(data);
        } catch (error: unknown) {
            console.error('Error loading transactions:', error);
        } finally {
            setTxLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics(selectedPeriod, selectedSources);
    }, [selectedPeriod, selectedSources, loadAnalytics]);

    useEffect(() => {
        loadTransactions();
    }, []);

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

    const periodLabels = PERIOD_LABELS[selectedPeriod];
    const reservationsCount = analytics?.reservations ?? analytics?.reservationsThisMonth ?? 0;

    return (
        <UserDashboardLayout title="Tableau de bord">
            <div className="mb-6 lg:mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
                        <p className="text-sm lg:text-base text-gray-600">Vue d'ensemble de votre activité œnotouristique.</p>
                    </div>

                    <div className="flex flex-row flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-600 shrink-0">Période :</span>
                        <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as UiPeriod)}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="cette-semaine">Cette semaine</SelectItem>
                                <SelectItem value="ce-mois">Ce mois</SelectItem>
                                <SelectItem value="cette-annee">Cette année</SelectItem>
                            </SelectContent>
                        </Select>
                        <BookingSourceFilterDropdown />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">{periodLabels.reservationsTitle}</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                reservationsCount.toString()
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{periodLabels.periodLabel}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Nombre de visiteurs</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                analytics?.visitors?.toString() || "0"
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{periodLabels.periodLabel}</p>
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
                        <CardTitle className="text-xs sm:text-sm font-medium">Chiffre d'affaires</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold">
                            {isLoading ? (
                                <Loader2 className="h-6 w-6 animate-spin" />
                            ) : (
                                analytics ? `${analytics.turnover.toFixed(2)}€` : "0€"
                            )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{periodLabels.periodLabel}</p>
                    </CardContent>
                </Card>
            </div>

            <BookingsByMonthChart
                data={analytics?.bookingChart ?? analytics?.bookingsByMonth ?? []}
                period={UI_TO_API_PERIOD[selectedPeriod]}
                isLoading={isLoading}
            />

            <div className="flex flex-col gap-4 lg:gap-6">
                {/* Upcoming bookings — full width */}
                <Card className="w-full overflow-hidden">
                    <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b bg-[#318160]/[0.04]">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#318160]/10 text-[#318160]">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg lg:text-xl">Prochaines réservations</CardTitle>
                                <CardDescription className="text-sm">
                                    Vos prochains visiteurs
                                    {!isLoading && analytics?.nextReservations?.length
                                        ? ` · ${analytics.nextReservations.length} à venir`
                                        : ''}
                                </CardDescription>
                            </div>
                        </div>
                        <Link href="/dashboard/reservations">
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-[#318160] text-[#318160] hover:bg-[#318160] hover:text-white"
                            >
                                Voir le calendrier
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-[#318160]" />
                            </div>
                        ) : analytics?.nextReservations && analytics.nextReservations.length > 0 ? (
                            <ul className="divide-y divide-gray-100">
                                {analytics.nextReservations.map((reservation, index) => (
                                    <li
                                        key={`${reservation.bookingDate}-${reservation.bookingTime}-${index}`}
                                        className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-gray-50/80 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6"
                                    >
                                        <div className="flex min-w-0 flex-1 items-start gap-3">
                                            <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-[#318160] text-white">
                                                <span className="text-[10px] font-medium uppercase leading-none opacity-90">
                                                    {new Date(reservation.bookingDate).toLocaleDateString('fr-FR', { month: 'short' })}
                                                </span>
                                                <span className="text-lg font-bold leading-none">
                                                    {new Date(reservation.bookingDate).getDate()}
                                                </span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-semibold text-gray-900">
                                                    {reservation.eventName}
                                                </p>
                                                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:text-sm">
                                                    <span className="inline-flex items-center gap-1">
                                                        <Users className="h-3.5 w-3.5" />
                                                        {formatParticipants(reservation.participantsAdults, reservation.participantsEnfants)}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1 truncate">
                                                        <Mail className="h-3.5 w-3.5 shrink-0" />
                                                        {reservation.customerEmail}
                                                    </span>
                                                    {reservation.phoneNo && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <Phone className="h-3.5 w-3.5" />
                                                            {reservation.phoneNo}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 items-center gap-2 sm:flex-col sm:items-end">
                                            <Badge className="bg-[#318160]/10 text-[#318160] hover:bg-[#318160]/15 border-0">
                                                <Clock className="mr-1 h-3 w-3" />
                                                {reservation.bookingTime}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground sm:text-right">
                                                {new Date(reservation.bookingDate).toLocaleDateString('fr-FR', {
                                                    weekday: 'long',
                                                    day: 'numeric',
                                                    month: 'long',
                                                })}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center px-4 py-12 text-center text-muted-foreground">
                                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                    <Calendar className="h-7 w-7 opacity-50" />
                                </div>
                                <p className="font-medium text-gray-700">Aucune réservation à venir</p>
                                <p className="mt-1 max-w-sm text-sm">
                                    Les prochaines réservations de vos visiteurs apparaîtront ici.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Stripe transactions — full width, below upcoming */}
                <Card className="w-full overflow-hidden">
                    <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b bg-[#318160]/[0.04]">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#318160]/10 text-[#318160]">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                                <CardTitle className="text-lg lg:text-xl">Transactions Stripe</CardTitle>
                                <CardDescription className="text-sm">
                                    Paiements en ligne reçus
                                    {!txLoading && transactions.length
                                        ? ` · ${transactions.length} transaction${transactions.length > 1 ? 's' : ''}`
                                        : ''}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {txLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-[#318160]" />
                            </div>
                        ) : transactions.length > 0 ? (
                            <ul className="divide-y divide-gray-100">
                                {transactions.map((tx) => {
                                    const cfg = txStatusConfig[tx.status] ?? txStatusConfig.pending;
                                    return (
                                        <li
                                            key={tx._id}
                                            className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-gray-50/80 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6"
                                        >
                                            <div className="flex min-w-0 flex-1 items-start gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#318160]">
                                                    <CreditCard className="h-5 w-5" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate font-semibold text-gray-900">
                                                        {tx.cardholderName || tx.customerEmail || 'Client'}
                                                    </p>
                                                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:text-sm">
                                                        <span>{tx.serviceName || 'Réservation'}</span>
                                                        {tx.cardLast4 && (
                                                            <span className="font-mono tracking-wider">
                                                                •••• {tx.cardLast4}
                                                            </span>
                                                        )}
                                                        <span>
                                                            {new Date(tx.createdAt).toLocaleDateString('fr-FR', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
                                                <span className="text-base font-bold text-gray-900 tabular-nums">
                                                    {(tx.amount / 100).toFixed(2)} €
                                                </span>
                                                <Badge variant={cfg.variant} className="flex items-center gap-1 text-xs">
                                                    {cfg.icon}
                                                    {cfg.label}
                                                </Badge>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center px-4 py-12 text-center text-muted-foreground">
                                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                                    <CreditCard className="h-7 w-7 opacity-50" />
                                </div>
                                <p className="font-medium text-gray-700">Aucune transaction Stripe</p>
                                <p className="mt-1 max-w-sm text-sm">
                                    Les paiements en ligne de vos visiteurs apparaîtront ici.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </UserDashboardLayout>
    );
}
