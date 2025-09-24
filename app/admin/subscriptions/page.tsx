"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ChevronLeft, ChevronRight, Calendar, Users, Plus, Loader2, Edit, Trash2 } from "lucide-react"
import DashboardLayout from "@/components/admin/DashboardLayout"
import { useAdmin } from '@/contexts/AdminContext'
import { adminService, AdminUser } from '@/services/admin.service'
import { subscriptionService, Subscription, CreateOrUpdateSubscriptionRequest } from '@/services/subscription.service'
import toast from 'react-hot-toast'

export default function AdminSubscriptions() {
    const { admin, isLoading } = useAdmin();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [pagination, setPagination] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: '',
        notes: ''
    });
    const [updateFormData, setUpdateFormData] = useState({
        startDate: '',
        endDate: '',
        notes: '',
        isActive: true
    });

    const fetchSubscriptions = async (page: number = 1, limit: number = 10) => {
        setLoading(true);
        try {
            const query: any = { page, limit };
            if (statusFilter !== 'all') {
                query.status = statusFilter;
            }

            const response = await subscriptionService.getAllSubscriptions(query);
            setSubscriptions(response.data.subscriptions);
            setPagination(response.data);
        } catch (error: any) {
            console.error('Error fetching subscriptions:', error);
            toast.error('Erreur lors du chargement des abonnements');
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await adminService.getApprovedUsers({ page: 1, limit: 50 });
            setUsers(response.data);
        } catch (error: any) {
            console.error('Error fetching users:', error);
            toast.error('Erreur lors du chargement des utilisateurs');
        } finally {
            setLoadingUsers(false);
        }
    };

    const handleCreateSubscription = async () => {
        if (!selectedUser || !formData.startDate || !formData.endDate) {
            toast.error('Veuillez remplir tous les champs obligatoires');
            return;
        }

        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            toast.error('La date de fin doit être postérieure à la date de début');
            return;
        }

        setCreateLoading(true);
        try {
            const subscriptionData: CreateOrUpdateSubscriptionRequest = {
                userId: selectedUser,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: new Date(formData.endDate).toISOString(),
                notes: formData.notes || undefined
            };

            const response = await subscriptionService.createOrUpdateSubscription(subscriptionData);
            
            toast.success(response.data.isNew 
                ? 'Abonnement créé avec succès' 
                : 'Abonnement mis à jour avec succès'
            );
            
            setIsCreateModalOpen(false);
            setSelectedUser('');
            setFormData({ startDate: '', endDate: '', notes: '' });
            fetchSubscriptions();
        } catch (error: any) {
            console.error('Error creating subscription:', error);
            if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
                const errorMessages = error.response.data.errors.map((err: any) => err.message).join(', ');
                toast.error(errorMessages);
            } else if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Erreur lors de la création de l\'abonnement');
            }
        } finally {
            setCreateLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const isSubscriptionActive = (subscription: Subscription) => {
        const now = new Date();
        const startDate = new Date(subscription.startDate);
        const endDate = new Date(subscription.endDate);
        return subscription.isActive && now >= startDate && now <= endDate;
    };

    const getStatusBadge = (subscription: Subscription) => {
        const now = new Date();
        const startDate = new Date(subscription.startDate);
        const endDate = new Date(subscription.endDate);
        
        if (!subscription.isActive) {
            return <Badge variant="destructive">Inactif</Badge>;
        }
        
        if (now < startDate) {
            return <Badge variant="secondary">À venir</Badge>;
        } else if (now > endDate) {
            return <Badge variant="destructive">Expiré</Badge>;
        } else {
            return <Badge variant="default" className="bg-green-500">Actif</Badge>;
        }
    };

    const getValidityStatus = (subscription: Subscription) => {
        const now = new Date();
        const startDate = new Date(subscription.startDate);
        const endDate = new Date(subscription.endDate);
        
        if (!subscription.isActive) {
            return { status: 'inactive', text: 'Abonnement inactif', color: 'text-red-600' };
        }
        
        if (now < startDate) {
            const daysUntilStart = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            return { 
                status: 'upcoming', 
                text: `Commence dans ${daysUntilStart} jour${daysUntilStart > 1 ? 's' : ''}`, 
                color: 'text-blue-600' 
            };
        } else if (now > endDate) {
            const daysExpired = Math.ceil((now.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
            return { 
                status: 'expired', 
                text: `Expiré depuis ${daysExpired} jour${daysExpired > 1 ? 's' : ''}`, 
                color: 'text-red-600' 
            };
        } else {
            const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            if (daysRemaining <= 7) {
                return { 
                    status: 'expiring', 
                    text: `Expire dans ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''}`, 
                    color: 'text-orange-600' 
                };
            } else {
                return { 
                    status: 'active', 
                    text: `${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} restant${daysRemaining > 1 ? 's' : ''}`, 
                    color: 'text-green-600' 
                };
            }
        }
    };

    const openUpdateModal = (subscription: Subscription) => {
        setSelectedSubscription(subscription);
        setUpdateFormData({
            startDate: new Date(subscription.startDate).toISOString().split('T')[0],
            endDate: new Date(subscription.endDate).toISOString().split('T')[0],
            notes: subscription.notes || '',
            isActive: subscription.isActive
        });
        setIsUpdateModalOpen(true);
    };

    const handleUpdateSubscription = async () => {
        if (!selectedSubscription || !updateFormData.startDate || !updateFormData.endDate) {
            toast.error('Veuillez remplir tous les champs obligatoires');
            return;
        }

        if (new Date(updateFormData.endDate) <= new Date(updateFormData.startDate)) {
            toast.error('La date de fin doit être postérieure à la date de début');
            return;
        }

        setUpdateLoading(true);
        try {
            const subscriptionData: CreateOrUpdateSubscriptionRequest = {
                userId: selectedSubscription.userId._id,
                startDate: new Date(updateFormData.startDate).toISOString(),
                endDate: new Date(updateFormData.endDate).toISOString(),
                notes: updateFormData.notes || undefined,
                isActive: updateFormData.isActive
            };

            const response = await subscriptionService.createOrUpdateSubscription(subscriptionData);
            
            toast.success('Abonnement mis à jour avec succès');
            
            setIsUpdateModalOpen(false);
            setSelectedSubscription(null);
            setUpdateFormData({ startDate: '', endDate: '', notes: '', isActive: true });
            fetchSubscriptions();
        } catch (error: any) {
            console.error('Error updating subscription:', error);
            if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
                const errorMessages = error.response.data.errors.map((err: any) => err.message).join(', ');
                toast.error(errorMessages);
            } else if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Erreur lors de la mise à jour de l\'abonnement');
            }
        } finally {
            setUpdateLoading(false);
        }
    };

    const filteredSubscriptions = subscriptions.filter(subscription => {
        const searchMatch = subscription.userId.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           subscription.userId.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           subscription.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           subscription.userId.domainName?.toLowerCase().includes(searchTerm.toLowerCase());
        
        return searchMatch;
    });

    useEffect(() => {
        fetchSubscriptions();
    }, [statusFilter]);

    useEffect(() => {
        if (isCreateModalOpen) {
            fetchUsers();
        }
    }, [isCreateModalOpen]);

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gestion des Abonnements</h1>
                        <p className="text-muted-foreground">Gérez les abonnements des utilisateurs</p>
                    </div>
                    
                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button style={{ backgroundColor: '#3A7B59' }} className="hover:opacity-90">
                                <Plus className="h-4 w-4 mr-2" />
                                Nouvel Abonnement
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Créer un Nouvel Abonnement</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="user">Utilisateur *</Label>
                                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un utilisateur" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {loadingUsers ? (
                                                <div className="flex justify-center p-4">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                </div>
                                            ) : (
                                                users.map(user => (
                                                    <SelectItem key={user._id} value={user._id}>
                                                        {user.firstName} {user.lastName} ({user.email})
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <div>
                                    <Label htmlFor="startDate">Date de début *</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="endDate">Date de fin *</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="notes">Notes</Label>
                                    <Input
                                        id="notes"
                                        placeholder="Notes optionnelles..."
                                        value={formData.notes}
                                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                    />
                                </div>
                                
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        disabled={createLoading}
                                    >
                                        Annuler
                                    </Button>
                                    <Button onClick={handleCreateSubscription} disabled={createLoading} style={{ backgroundColor: '#3A7B59' }} className="hover:opacity-90">
                                        {createLoading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Création...
                                            </>
                                        ) : (
                                            'Créer'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Update Subscription Modal */}
                <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Modifier l'Abonnement</DialogTitle>
                        </DialogHeader>
                        {selectedSubscription && (
                            <div className="space-y-4">
                                {/* User Info (Read-only) */}
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="font-medium">
                                        {selectedSubscription.userId.firstName} {selectedSubscription.userId.lastName}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {selectedSubscription.userId.email}
                                    </div>
                                    {selectedSubscription.userId.domainName && (
                                        <div className="text-sm text-muted-foreground">
                                            {selectedSubscription.userId.domainName}
                                        </div>
                                    )}
                                </div>
                                
                                <div>
                                    <Label htmlFor="update-start-date">Date de début *</Label>
                                    <Input
                                        id="update-start-date"
                                        type="date"
                                        value={updateFormData.startDate}
                                        onChange={(e) => setUpdateFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="update-end-date">Date de fin *</Label>
                                    <Input
                                        id="update-end-date"
                                        type="date"
                                        value={updateFormData.endDate}
                                        onChange={(e) => setUpdateFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                    />
                                </div>
                                
                                <div>
                                    <Label htmlFor="update-notes">Notes</Label>
                                    <Input
                                        id="update-notes"
                                        placeholder="Notes optionnelles..."
                                        value={updateFormData.notes}
                                        onChange={(e) => setUpdateFormData(prev => ({ ...prev, notes: e.target.value }))}
                                    />
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="update-is-active"
                                        type="checkbox"
                                        checked={updateFormData.isActive}
                                        onChange={(e) => setUpdateFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                        className="rounded"
                                    />
                                    <Label htmlFor="update-is-active">Abonnement actif</Label>
                                </div>
                                
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsUpdateModalOpen(false)}
                                        disabled={updateLoading}
                                    >
                                        Annuler
                                    </Button>
                                    <Button onClick={handleUpdateSubscription} disabled={updateLoading} style={{ backgroundColor: '#3A7B59' }} className="hover:opacity-90">
                                        {updateLoading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Mise à jour...
                                            </>
                                        ) : (
                                            'Mettre à jour'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Rechercher par nom, email ou domaine..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="lg:w-48">
                                <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filtrer par statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les statuts</SelectItem>
                                        <SelectItem value="active">Actifs</SelectItem>
                                        <SelectItem value="inactive">Inactifs</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Subscriptions List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Abonnements
                            {pagination && (
                                <span className="text-sm font-normal text-muted-foreground">
                                    ({pagination.total} au total)
                                </span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : filteredSubscriptions.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                Aucun abonnement trouvé
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredSubscriptions.map((subscription) => (
                                    <div key={subscription._id} className="border rounded-lg p-4 space-y-3">
                                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-2">
                                            <div className="flex-1">
                                                <div className="font-medium">
                                                    {subscription.userId.firstName} {subscription.userId.lastName}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {subscription.userId.email}
                                                </div>
                                                {subscription.userId.domainName && (
                                                    <div className="text-sm text-muted-foreground">
                                                        {subscription.userId.domainName}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(subscription)}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openUpdateModal(subscription)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        {/* Validity Status */}
                                        <div className="text-sm">
                                            <span className={`font-medium ${getValidityStatus(subscription).color}`}>
                                                {getValidityStatus(subscription).text}
                                            </span>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium">Début:</span> {formatDate(subscription.startDate)}
                                            </div>
                                            <div>
                                                <span className="font-medium">Fin:</span> {formatDate(subscription.endDate)}
                                            </div>
                                            <div>
                                                <span className="font-medium">Créé par:</span> {subscription.adminId.firstName} {subscription.adminId.lastName}
                                            </div>
                                            <div>
                                                <span className="font-medium">Statut:</span> 
                                                <span className={subscription.isActive ? 'text-green-600' : 'text-red-600'}>
                                                    {subscription.isActive ? ' Actif' : ' Inactif'}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {subscription.notes && (
                                            <div className="text-sm">
                                                <span className="font-medium">Notes:</span> {subscription.notes}
                                            </div>
                                        )}
                                        
                                        {subscription.cancelledById && (
                                            <div className="text-sm text-red-600">
                                                <span className="font-medium">Annulé par:</span> {subscription.cancelledById.firstName} {subscription.cancelledById.lastName} 
                                                le {formatDate(subscription.cancelledAt!)}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6">
                                <div className="text-sm text-muted-foreground">
                                    Page {pagination.page} sur {pagination.totalPages} 
                                    ({pagination.total} éléments au total)
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fetchSubscriptions(pagination.page - 1)}
                                        disabled={pagination.page <= 1 || loading}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => fetchSubscriptions(pagination.page + 1)}
                                        disabled={pagination.page >= pagination.totalPages || loading}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
