"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ChevronLeft, ChevronRight, MessageSquare, Clock, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"
import DashboardLayout from "@/components/admin/DashboardLayout"
import { useAdmin } from '@/contexts/AdminContext'
import { adminService, SupportTicket, UpdateTicketStatusRequest } from '@/services/admin.service'
import toast from 'react-hot-toast'

type StatusFilter = 'all' | 'pending' | 'in-progress' | 'resolved' | 'closed'

export default function AdminSupportTickets() {
    const { admin, isLoading } = useAdmin();
    const [isMounted, setIsMounted] = useState(false);
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState<{[key: string]: boolean}>({});
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
    const [expandedTicket, setExpandedTicket] = useState<string | null>(null);

    // Ensure component is mounted on client side
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const fetchTickets = async (page: number = 1, limit: number = 10) => {
        setLoading(true);
        try {
            const response = await adminService.getAllSupportTickets({ page, limit });
            if (response && response.data) {
                setTickets(Array.isArray(response.data) ? response.data : []);
                setPagination(response.pagination || null);
            } else {
                setTickets([]);
                setPagination(null);
                toast.error('Réponse invalide du serveur');
            }
        } catch (error: any) {
            console.error('Error fetching support tickets:', error);
            setTickets([]);
            setPagination(null);
            toast.error('Erreur lors du chargement des tickets de support');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (ticketId: string, newStatus: 'pending' | 'in-progress' | 'resolved' | 'closed') => {
        setStatusUpdateLoading(prev => ({ ...prev, [ticketId]: true }));
        
        try {
            const request: UpdateTicketStatusRequest = { ticketId, status: newStatus };
            const response = await adminService.updateTicketStatus(request);
            
            if (response.success) {
                toast.success(response.message);
                // Update the ticket in the local state
                setTickets(prevTickets => 
                    prevTickets.map(ticket => 
                        ticket._id === ticketId 
                            ? { ...ticket, status: newStatus, updatedAt: new Date() }
                            : ticket
                    )
                );
            } else {
                toast.error('Erreur lors de la mise à jour du statut');
            }
        } catch (error: any) {
            console.error('Error updating ticket status:', error);
            toast.error(error.message || 'Erreur lors de la mise à jour du statut');
        } finally {
            setStatusUpdateLoading(prev => ({ ...prev, [ticketId]: false }));
        }
    };

    useEffect(() => {
        if (isMounted) {
            fetchTickets();
        }
    }, [isMounted]);

    // Show loading state while checking authentication or mounting
    if (isLoading || !isMounted) {
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

    const handlePageChange = (page: number) => {
        fetchTickets(page);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return <Clock className="h-4 w-4" />;
            case 'in-progress':
                return <AlertCircle className="h-4 w-4" />;
            case 'resolved':
                return <CheckCircle className="h-4 w-4" />;
            case 'closed':
                return <XCircle className="h-4 w-4" />;
            default:
                return <MessageSquare className="h-4 w-4" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = "flex items-center space-x-1";
        switch (status) {
            case 'pending':
                return <Badge className={`${baseClasses} bg-yellow-100 text-yellow-800 hover:bg-yellow-100`}>
                    {getStatusIcon(status)} <span>En attente</span>
                </Badge>;
            case 'in-progress':
                return <Badge className={`${baseClasses} bg-blue-100 text-blue-800 hover:bg-blue-100`}>
                    {getStatusIcon(status)} <span>En cours</span>
                </Badge>;
            case 'resolved':
                return <Badge className={`${baseClasses} bg-green-100 text-green-800 hover:bg-green-100`}>
                    {getStatusIcon(status)} <span>Résolu</span>
                </Badge>;
            case 'closed':
                return <Badge className={`${baseClasses} bg-red-100 text-red-800 hover:bg-red-100`}>
                    {getStatusIcon(status)} <span>Fermé</span>
                </Badge>;
            default:
                return <Badge className={`${baseClasses} bg-gray-100 text-gray-800 hover:bg-gray-100`}>
                    {getStatusIcon(status)} <span>{status}</span>
                </Badge>;
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        if (!ticket || !ticket.userId) return false;
        
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = !searchTerm || 
                             (ticket.subject?.toLowerCase().includes(searchLower)) ||
                             (ticket.message?.toLowerCase().includes(searchLower)) ||
                             (ticket.userId.firstName?.toLowerCase().includes(searchLower)) ||
                             (ticket.userId.lastName?.toLowerCase().includes(searchLower)) ||
                             (ticket.userId.email?.toLowerCase().includes(searchLower)) ||
                             (ticket.userId.domainName?.toLowerCase().includes(searchLower));
        
        const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const getStatusCounts = () => {
        if (!Array.isArray(tickets)) {
            return {
                total: 0,
                pending: 0,
                inProgress: 0,
                resolved: 0,
                closed: 0,
            };
        }
        
        return {
            total: tickets.length,
            pending: tickets.filter(t => t?.status === 'pending').length,
            inProgress: tickets.filter(t => t?.status === 'in-progress').length,
            resolved: tickets.filter(t => t?.status === 'resolved').length,
            closed: tickets.filter(t => t?.status === 'closed').length,
        };
    };

    const statusCounts = getStatusCounts();

    const renderPagination = () => {
        if (!pagination) return null;

        return (
            <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                    Affichage de {((pagination.currentPage - 1) * 10) + 1} à{' '}
                    {Math.min(pagination.currentPage * 10, pagination.totalTickets)} sur{' '}
                    {pagination.totalTickets} tickets
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrevPage || loading}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Précédent
                    </Button>
                    <span className="text-sm text-gray-600">
                        Page {pagination.currentPage} sur {pagination.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNextPage || loading}
                    >
                        Suivant
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    };

    const formatDate = (dateString: Date | string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Date invalide';
        }
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderTicketTable = () => (
        <div className="space-y-4">
            {filteredTickets.map((ticket) => (
                <Card key={ticket._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="font-semibold text-lg text-gray-900">{ticket.subject}</h3>
                                    {getStatusBadge(ticket.status)}
                                </div>
                                
                                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                                    <span>
                                        <strong>Client:</strong> {ticket.userId.firstName} {ticket.userId.lastName}
                                    </span>
                                    <span>
                                        <strong>Email:</strong> {ticket.userId.email}
                                    </span>
                                    {ticket.userId.domainName && (
                                        <span>
                                            <strong>Domaine:</strong> {ticket.userId.domainName}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                    <span>Créé le {formatDate(ticket.createdAt)}</span>
                                    <span>Mis à jour le {formatDate(ticket.updatedAt)}</span>
                                </div>

                                <div className="mb-4">
                                    <p className={`text-gray-700 ${expandedTicket === ticket._id ? '' : 'overflow-hidden'}`} 
                                       style={expandedTicket === ticket._id ? {} : { 
                                           display: '-webkit-box',
                                           WebkitLineClamp: 2,
                                           WebkitBoxOrient: 'vertical' as any
                                       }}>
                                        {ticket.message}
                                    </p>
                                    {ticket.message.length > 150 && (
                                        <Button
                                            variant="link"
                                            size="sm"
                                            className="p-0 h-auto text-[#3A7B59] hover:text-[#2d5f43]"
                                            onClick={() => setExpandedTicket(
                                                expandedTicket === ticket._id ? null : ticket._id
                                            )}
                                        >
                                            {expandedTicket === ticket._id ? 'Voir moins' : 'Voir plus'}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="ml-6 flex flex-col space-y-2">
                                <Select
                                    value={ticket.status}
                                    onValueChange={(value) => handleStatusUpdate(ticket._id, value as any)}
                                    disabled={statusUpdateLoading[ticket._id]}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">En attente</SelectItem>
                                        <SelectItem value="in-progress">En cours</SelectItem>
                                        <SelectItem value="resolved">Résolu</SelectItem>
                                        <SelectItem value="closed">Fermé</SelectItem>
                                    </SelectContent>
                                </Select>
                                
                                {statusUpdateLoading[ticket._id] && (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="h-4 w-4 animate-spin text-[#3A7B59]" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    return (
        <DashboardLayout title="Tickets de Support">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">Tickets de Support</h1>
                <p className="text-muted-foreground">Gérez les demandes de support des clients</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{statusCounts.total}</div>
                        <p className="text-xs text-muted-foreground">Tous les tickets</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">En attente</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
                        <p className="text-xs text-muted-foreground">Nouveaux tickets</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">En cours</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{statusCounts.inProgress}</div>
                        <p className="text-xs text-muted-foreground">En traitement</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Résolus</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{statusCounts.resolved}</div>
                        <p className="text-xs text-muted-foreground">Problèmes résolus</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Fermés</CardTitle>
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{statusCounts.closed}</div>
                        <p className="text-xs text-muted-foreground">Tickets fermés</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Filtrer par statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les statuts</SelectItem>
                                    <SelectItem value="pending">En attente</SelectItem>
                                    <SelectItem value="in-progress">En cours</SelectItem>
                                    <SelectItem value="resolved">Résolus</SelectItem>
                                    <SelectItem value="closed">Fermés</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Rechercher tickets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="w-8 h-8 border-2 border-[#3A7B59] border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-3 text-gray-600">Chargement...</span>
                        </div>
                    ) : filteredTickets.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm || statusFilter !== 'all' ? 'Aucun résultat trouvé' : 'Aucun ticket de support'}
                            </h3>
                            <p className="text-gray-600">
                                {searchTerm || statusFilter !== 'all' 
                                    ? 'Essayez de modifier vos critères de recherche' 
                                    : 'Aucun ticket de support pour le moment'
                                }
                            </p>
                        </div>
                    ) : (
                        renderTicketTable()
                    )}
                    
                    {!searchTerm && statusFilter === 'all' && renderPagination()}
                </CardContent>
            </Card>
        </DashboardLayout>
    )
}
