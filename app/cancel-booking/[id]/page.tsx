'use client';
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, X, Clock, Users, Calendar } from "lucide-react";
import Image from "next/image";
import { bookingService, BookingDetailsResponse } from "@/services/booking.service";

export default function CancelBookingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [bookingDetails, setBookingDetails] = useState<BookingDetailsResponse['data'] | null>(null);
    const router = useRouter();
    const params = useParams();
    
    const bookingId = params.id as string;

    // Fetch booking details on component mount
    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                setIsLoadingDetails(true);
                const response = await bookingService.getBookingDetails(bookingId);
                if (response.success && response.data) {
                    setBookingDetails(response.data);
                } else {
                    setError("Impossible de charger les détails de la réservation");
                }
            } catch (error: any) {
                setError(error.message || "Erreur lors du chargement des détails");
            } finally {
                setIsLoadingDetails(false);
            }
        };

        if (bookingId) {
            fetchBookingDetails();
        }
    }, [bookingId]);

    // Format date for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleCancel = async () => {
        setIsLoading(true);
        setError("");
        
        try {
            const response = await bookingService.cancelBookingAsGuest(bookingId);
            if (response.success) {
                setSuccess(true);
            } else {
                setError(response.message || "Une erreur est survenue lors de l'annulation");
            }
        } catch (error: any) {
            setError(error.message || "Une erreur est survenue lors de l'annulation");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoBack = () => {
        router.push('/');
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo Section */}
                    <div className="text-center mb-6 lg:mb-8">
                        <div className="flex items-center justify-center mb-3 lg:mb-4">
                            <div 
                                className="relative cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => router.push('/')}
                            >
                                <Image
                                    src="/assets/logo.png"
                                    alt="Rose des Vins"
                                    width={80}
                                    height={80}
                                    className="lg:w-20 lg:h-20 w-16 h-16 object-contain"
                                    priority
                                />
                            </div>
                        </div>
                        <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1 lg:mb-2">
                            Rose des Vins
                        </h1>
                    </div>

                    {/* Success Card */}
                    <Card className="shadow-xl border-0">
                        <CardHeader className="space-y-1 pb-4 lg:pb-6">
                            <div className="flex justify-center mb-4">
                                <CheckCircle className="h-16 w-16 text-green-500" />
                            </div>
                            <CardTitle className="text-lg lg:text-xl font-bold text-center text-gray-900">
                                Réservation annulée
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center space-y-4">
                                <p className="text-sm text-gray-600">
                                    Votre réservation a été annulée avec succès.
                                </p>
                                <p className="text-xs text-gray-500">
                                    Vous recevrez un email de confirmation sous peu.
                                </p>
                                
                                <Button
                                    onClick={handleGoBack}
                                    className="w-full h-10 lg:h-11 text-white font-medium text-sm hover:opacity-90 transition-opacity mt-6"
                                    style={{ backgroundColor: '#3A7B59' }}
                                >
                                    Retour à l'accueil
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo Section */}
                <div className="text-center mb-6 lg:mb-8">
                    <div className="flex items-center justify-center mb-3 lg:mb-4">
                        <div 
                            className="relative cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => router.push('/')}
                        >
                            <Image
                                src="/assets/logo.png"
                                alt="Rose des Vins"
                                width={80}
                                height={80}
                                className="lg:w-20 lg:h-20 w-16 h-16 object-contain"
                                priority
                            />
                        </div>
                    </div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1 lg:mb-2">
                        Rose des Vins
                    </h1>
                </div>

                {/* Cancellation Confirmation Card */}
                <Card className="shadow-xl border-0">
                    <CardHeader className="space-y-1 pb-4 lg:pb-6">
                        <div className="flex justify-center mb-4">
                            <AlertTriangle className="h-16 w-16 text-orange-500" />
                        </div>
                        <CardTitle className="text-lg lg:text-xl font-bold text-center text-gray-900">
                            Annuler la réservation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 lg:space-y-6">
                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm flex items-center">
                                    <X className="h-4 w-4 mr-2 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            {/* Confirmation Message */}
                            <div className="text-center space-y-4">
                                <p className="text-sm text-gray-700">
                                    Êtes-vous sûr de vouloir annuler votre réservation ?
                                </p>
                                
                                {/* Loading state for booking details */}
                                {isLoadingDetails ? (
                                    <div className="bg-gray-50 border rounded-lg p-4">
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                            <span className="text-sm text-gray-600">Chargement des détails...</span>
                                        </div>
                                    </div>
                                ) : bookingDetails ? (
                                    <div className="bg-gray-50 border rounded-lg p-4 text-left space-y-3">
                                        <div className="text-center">
                                            <h4 className="text-sm font-semibold text-gray-900">
                                                {bookingDetails.service.name}
                                            </h4>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 gap-3 text-xs">
                                            <div className="flex items-center space-x-2 text-gray-600">
                                                <Calendar className="h-4 w-4 flex-shrink-0" />
                                                <span>{formatDate(bookingDetails.bookingDate)}</span>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2 text-gray-600">
                                                <Clock className="h-4 w-4 flex-shrink-0" />
                                                <span>{bookingDetails.bookingTime}</span>
                                            </div>
                                            
                                            <div className="flex items-center space-x-2 text-gray-600">
                                                <Users className="h-4 w-4 flex-shrink-0" />
                                                <span>
                                                    {bookingDetails.participantsAdults} adulte(s)
                                                    {bookingDetails.participantsEnfants > 0 && 
                                                        `, ${bookingDetails.participantsEnfants} enfant(s)`
                                                    }
                                                </span>
                                            </div>
                                            
                                            <div className="text-center pt-2 border-t border-gray-200">
                                                <p className="text-gray-700 font-medium">
                                                    {bookingDetails.customerName}
                                                </p>
                                                <p className="text-gray-600">
                                                    {bookingDetails.customerEmail}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 border rounded-lg p-3">
                                        <p className="text-sm font-medium text-gray-900">
                                            Réservation #{bookingId.slice(-6)}
                                        </p>
                                    </div>
                                )}
                                
                                <p className="text-xs text-gray-500">
                                    Cette action ne peut pas être annulée.
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col space-y-3">
                                <Button
                                    onClick={handleCancel}
                                    disabled={isLoading || isLoadingDetails}
                                    variant="destructive"
                                    className="w-full h-10 lg:h-11 font-medium text-sm transition-opacity"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Annulation...</span>
                                        </div>
                                    ) : (
                                        "Oui, annuler la réservation"
                                    )}
                                </Button>
                                
                                <Button
                                    onClick={handleGoBack}
                                    variant="outline"
                                    className="w-full h-10 lg:h-11 font-medium text-sm"
                                    disabled={isLoading}
                                >
                                    Non, garder la réservation
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Support Link */}
                <div className="text-center mt-4 lg:mt-6">
                    <p className="text-xs lg:text-sm text-gray-600">
                        Besoin d'aide ?{" "}
                        <a 
                            href="mailto:support@rosedesvins.com" 
                            className="font-medium hover:underline"
                            style={{ color: '#3A7B59' }}
                        >
                            Contactez le support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
