'use client';
import UserDashboardLayout from "@/components/userDashboard/UserDashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { userService, SupportTicket, CreateSupportTicketRequest } from "@/services/user.service";
import toast from "react-hot-toast";

export default function UserContact() {
    const [formData, setFormData] = useState<CreateSupportTicketRequest>({
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [isLoadingTickets, setIsLoadingTickets] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalTickets: 0,
        hasNextPage: false,
        hasPrevPage: false,
    });

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async (page: number = 1) => {
        try {
            setIsLoadingTickets(true);
            const response = await userService.getSupportTickets(page, 10);
            setTickets(response.data);
            setPagination(response.pagination);
        } catch (error: any) {
            console.error('Error loading tickets:', error);
            toast.error('Erreur lors du chargement des tickets');
        } finally {
            setIsLoadingTickets(false);
        }
    };

    const handlePageChange = async (page: number) => {
        await loadTickets(page);
    };

    const handleInputChange = (field: keyof CreateSupportTicketRequest, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.subject.trim()) {
            toast.error('Le sujet est requis');
            return;
        }
        
        if (!formData.message.trim()) {
            toast.error('Le message est requis');
            return;
        }

        try {
            setIsSubmitting(true);
            await userService.createSupportTicket(formData);
            toast.success('Ticket de support créé avec succès');
            
            // Reset form
            setFormData({ subject: '', message: '' });
            
            // Reload tickets
            await loadTickets();
        } catch (error: any) {
            console.error('Error creating ticket:', error);
            toast.error('Erreur lors de la création du ticket');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="secondary" className="text-yellow-700 bg-yellow-100"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
            case 'in_progress':
                return <Badge variant="secondary" className="text-blue-700 bg-blue-100"><AlertCircle className="w-3 h-3 mr-1" />En cours</Badge>;
            case 'resolved':
                return <Badge variant="secondary" className="text-green-700 bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Résolu</Badge>;
            case 'closed':
                return <Badge variant="outline">Fermé</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <UserDashboardLayout title="Contact">
            <div className="mb-6 lg:mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Support</h1>
                <p className="text-sm lg:text-base text-gray-600">Créez un ticket de support et suivez vos demandes.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Formulaire de création de ticket */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg lg:text-xl">Créer un ticket de support</CardTitle>
                        <CardDescription className="text-sm lg:text-base">
                            Décrivez votre problème et nous vous aiderons rapidement.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="sujet" className="text-sm lg:text-base">Sujet *</Label>
                                <Input 
                                    id="sujet" 
                                    placeholder="Résumé de votre problème"
                                    value={formData.subject}
                                    onChange={(e) => handleInputChange('subject', e.target.value)}
                                    disabled={isSubmitting}
                                    className="h-10 lg:h-9 text-sm lg:text-base"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-sm lg:text-base">Message *</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Décrivez votre problème en détail..."
                                    value={formData.message}
                                    onChange={(e) => handleInputChange('message', e.target.value)}
                                    disabled={isSubmitting}
                                    className="min-h-[120px] lg:min-h-[100px] text-sm lg:text-base"
                                    required
                                />
                            </div>

                            <Button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full text-white hover:opacity-90 text-sm lg:text-base py-3 lg:py-2"
                                style={{ backgroundColor: '#3A7B59' }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Création en cours...
                                    </>
                                ) : (
                                    'Créer le ticket'
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Liste des tickets */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg lg:text-xl">Mes tickets de support</CardTitle>
                        <CardDescription className="text-sm lg:text-base">
                            Suivez l'état de vos demandes d'assistance.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoadingTickets ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : tickets.length > 0 ? (
                            <div className="space-y-4">
                                {tickets.map((ticket) => (
                                    <div key={ticket._id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-medium text-sm lg:text-base line-clamp-1">
                                                {ticket.subject}
                                            </h3>
                                            {getStatusBadge(ticket.status)}
                                        </div>
                                        <p className="text-xs lg:text-sm text-muted-foreground mb-2 line-clamp-2">
                                            {ticket.message}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Créé le {formatDate(ticket.createdAt)}
                                        </p>
                                    </div>
                                ))}
                                
                                {/* Pagination */}
                                {pagination.totalPages > 1 && (
                                    <div className="flex items-center justify-between pt-4 border-t">
                                        <div className="text-sm text-muted-foreground">
                                            Page {pagination.currentPage} sur {pagination.totalPages} ({pagination.totalTickets} tickets)
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                                disabled={!pagination.hasPrevPage || isLoadingTickets}
                                                className="text-xs"
                                            >
                                                <ChevronLeft className="h-4 w-4 mr-1" />
                                                Précédent
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                                disabled={!pagination.hasNextPage || isLoadingTickets}
                                                className="text-xs"
                                            >
                                                Suivant
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Aucun ticket de support pour le moment</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </UserDashboardLayout>
    );
}