"use client"

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Search, ChevronLeft, ChevronRight, Mail, UserCheck, Clock, UserX, Loader2, CheckCircle, XCircle, Pencil, Trash2, LogIn } from "lucide-react"
import DashboardLayout from "@/components/admin/DashboardLayout"
import { useAdmin } from '@/contexts/AdminContext'
import { newsletterService, NewsletterSubscription } from '@/services/newsletter.service'
import { adminService, AdminUser } from '@/services/admin.service'
import toast from 'react-hot-toast'

type TabType = 'pending' | 'approved' | 'rejected'

export default function AdminClients() {
    const { admin, isLoading } = useAdmin();
    const [activeTab, setActiveTab] = useState<TabType>('pending');
    const [pendingSubs, setPendingSubs] = useState<NewsletterSubscription[]>([]);
    const [approvedUsers, setApprovedUsers] = useState<AdminUser[]>([]);
    const [rejectedSubs, setRejectedSubs] = useState<NewsletterSubscription[]>([]);
    const [pendingPagination, setPendingPagination] = useState<any>(null);
    const [approvedPagination, setApprovedPagination] = useState<any>(null);
    const [rejectedPagination, setRejectedPagination] = useState<any>(null);
    const [loadingPending, setLoadingPending] = useState(false);
    const [loadingApproved, setLoadingApproved] = useState(false);
    const [loadingRejected, setLoadingRejected] = useState(false);
    const [actionLoading, setActionLoading] = useState<{[key: string]: 'approve' | 'reject' | null}>({});
    const [searchTerm, setSearchTerm] = useState('');
    
    // Edit modal state
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        domainName: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    
    // Delete modal state
    const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Quick login state
    const [quickLoginLoading, setQuickLoginLoading] = useState<string | null>(null);

    const handleQuickLogin = async (user: AdminUser) => {
        setQuickLoginLoading(user._id);
        try {
            await adminService.quickLoginAsUser(user.email);
            toast.success(`Connexion rapide en tant que ${user.firstName} ${user.lastName}`);
            window.open('/dashboard', '_blank');
        } catch (error: any) {
            toast.error(error.message || 'Erreur lors de la connexion rapide');
        } finally {
            setQuickLoginLoading(null);
        }
    };
    
    // Approve modal state
    const [approvingSubscription, setApprovingSubscription] = useState<NewsletterSubscription | null>(null);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [approveForm, setApproveForm] = useState({
        firstName: '',
        lastName: '',
        domainName: ''
    });
    const [isApproving, setIsApproving] = useState(false);

    // Reject modal state
    const [rejectingSubscription, setRejectingSubscription] = useState<NewsletterSubscription | null>(null);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [isRejecting, setIsRejecting] = useState(false);

    const handleApproveClick = (subscription: NewsletterSubscription) => {
        setApprovingSubscription(subscription);
        setApproveForm({
            firstName: '',
            lastName: '',
            domainName: ''
        });
        setIsApproveModalOpen(true);
    };

    const handleRejectClick = (subscription: NewsletterSubscription) => {
        setRejectingSubscription(subscription);
        setRejectionReason('');
        setIsRejectModalOpen(true);
    };

    const handleEditClick = (user: AdminUser) => {
        setEditingUser(user);
        setEditForm({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            domainName: user.domainName || ''
        });
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (user: AdminUser) => {
        setDeletingUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingUser) return;
        setIsDeleting(true);
        try {
            await adminService.deleteUser(deletingUser._id);
            toast.success('Compte et abonnement supprimés avec succès');
            setIsDeleteModalOpen(false);
            setDeletingUser(null);
            fetchApprovedUsers();
        } catch (error: any) {
            toast.error(error.message || 'Erreur lors de la suppression');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!editingUser) return;
        
        setIsSaving(true);
        try {
            const response = await adminService.updateUser(editingUser._id, editForm);
            if (response.success) {
                toast.success('Utilisateur mis à jour avec succès');
                setIsEditModalOpen(false);
                // Refresh approved users list
                fetchApprovedUsers();
            } else {
                toast.error(response.message || 'Erreur lors de la mise à jour');
            }
        } catch (error: any) {
            console.error('Error updating user:', error);
            toast.error(error.message || 'Erreur lors de la mise à jour');
        } finally {
            setIsSaving(false);
        }
    };

    const handleApproveSubmit = async () => {
        if (!approvingSubscription) return;
        
        if (!approveForm.firstName || !approveForm.lastName || !approveForm.domainName) {
            toast.error('Veuillez remplir tous les champs');
            return;
        }

        setIsApproving(true);
        try {
            const response = await newsletterService.approveAndCreateUser({
                subscriptionId: approvingSubscription._id,
                ...approveForm
            });
            
            if (response.success) {
                toast.success('Souscription approuvée et compte créé avec succès');
                setIsApproveModalOpen(false);
                // Refresh lists
                fetchPendingSubscriptions();
                fetchApprovedUsers();
            }
        } catch (error: any) {
            console.error('Error approving subscription:', error);
            toast.error(error.message || 'Erreur lors de l\'approbation');
        } finally {
            setIsApproving(false);
        }
    };

    const handleRejectSubmit = async () => {
        if (!rejectingSubscription) return;

        setIsRejecting(true);
        try {
            const response = await newsletterService.rejectSubscription({
                subscriptionId: rejectingSubscription._id,
                rejectionReason: rejectionReason || undefined
            });
            
            if (response.success) {
                toast.success('Souscription rejetée');
                setIsRejectModalOpen(false);
                // Refresh lists
                fetchPendingSubscriptions();
                fetchRejectedSubscriptions();
            }
        } catch (error: any) {
            console.error('Error rejecting subscription:', error);
            toast.error(error.message || 'Erreur lors du rejet');
        } finally {
            setIsRejecting(false);
        }
    };

    const fetchPendingSubscriptions = async (page: number = 1, limit: number = 10) => {
        setLoadingPending(true);
        try {
            const response = await newsletterService.getPendingSubscriptions(page, limit);
            console.log('Newsletter service response:', JSON.stringify(response, null, 2));
            setPendingSubs(response.data || []);
            setPendingPagination(response.pagination || null);
        } catch (error: any) {
            console.error('Error fetching pending subscriptions:', error);
            toast.error(error.message || 'Erreur lors du chargement des souscriptions en attente');
        } finally {
            setLoadingPending(false);
        }
    };

    const fetchApprovedUsers = async (page: number = 1, limit: number = 10, search: string = '') => {
        setLoadingApproved(true);
        try {
            const response = await adminService.getApprovedUsers({ page, limit, search });
            console.log('Approved users response:', JSON.stringify(response, null, 2));
            setApprovedUsers(response.data || []);
            setApprovedPagination(response.pagination || null);
        } catch (error: any) {
            console.error('Error fetching approved users:', error);
            toast.error(error.message || 'Erreur lors du chargement des utilisateurs approuvés');
        } finally {
            setLoadingApproved(false);
        }
    };

    const fetchRejectedSubscriptions = async (page: number = 1, limit: number = 10) => {
        setLoadingRejected(true);
        try {
            const response = await newsletterService.getRejectedSubscriptions(page, limit);
            setRejectedSubs(response.data || []);
            setRejectedPagination(response.pagination || null);
        } catch (error: any) {
            console.error('Error fetching rejected subscriptions:', error);
            toast.error('Erreur lors du chargement des souscriptions rejetées');
        } finally {
            setLoadingRejected(false);
        }
    };

    useEffect(() => {
        fetchPendingSubscriptions();
        fetchApprovedUsers();
        fetchRejectedSubscriptions();
    }, []);

    // Debounced server-side search for approved users
    useEffect(() => {
        const timer = setTimeout(() => {
            if (activeTab === 'approved') {
                fetchApprovedUsers(1, 10, searchTerm);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm, activeTab]);

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

    if (!admin) {
        return null;
    }

    const handlePageChange = (type: TabType, page: number) => {
        if (type === 'pending') {
            fetchPendingSubscriptions(page);
        } else if (type === 'approved') {
            fetchApprovedUsers(page);
        } else {
            fetchRejectedSubscriptions(page);
        }
    };

    const filteredPendingSubs = (pendingSubs || []).filter(sub =>
        sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredApprovedUsers = approvedUsers || [];

    const filteredRejectedSubs = (rejectedSubs || []).filter(sub =>
        sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentData = activeTab === 'pending' ? filteredPendingSubs : 
                        activeTab === 'approved' ? filteredApprovedUsers : filteredRejectedSubs;
    const currentPagination = activeTab === 'pending' ? pendingPagination : 
                             activeTab === 'approved' ? approvedPagination : rejectedPagination;
    const currentLoading = activeTab === 'pending' ? loadingPending : 
                          activeTab === 'approved' ? loadingApproved : loadingRejected;

    const renderPagination = () => {
        if (!currentPagination) return null;

        return (
            <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                    Affichage de {((currentPagination.currentPage - 1) * currentPagination.limit) + 1} à{' '}
                    {Math.min(currentPagination.currentPage * currentPagination.limit, currentPagination.totalUsers || currentPagination.totalSubscriptions)} sur{' '}
                    {currentPagination.totalUsers || currentPagination.totalSubscriptions} résultats
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(activeTab, currentPagination.currentPage - 1)}
                        disabled={!currentPagination.hasPrevPage || currentLoading}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Précédent
                    </Button>
                    <span className="text-sm text-gray-600">
                        Page {currentPagination.currentPage} sur {currentPagination.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(activeTab, currentPagination.currentPage + 1)}
                        disabled={!currentPagination.hasNextPage || currentLoading}
                    >
                        Suivant
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        );
    };

    const renderTable = () => (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                        {activeTab === 'approved' && (
                            <>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Prénom</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Nom</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Domaine</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Date de création</th>
                                <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
                            </>
                        )}
                        {activeTab !== 'approved' && (
                            <th className="text-left py-3 px-4 font-medium text-gray-900">Date de soumission</th>
                        )}
                        {activeTab === 'rejected' && (
                            <>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Date de rejet</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Raison</th>
                            </>
                        )}
                        {activeTab === 'pending' && (
                            <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {activeTab === 'approved' ? (
                        (currentData as AdminUser[]).map((user) => (
                            <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="font-medium text-gray-900">{user.email}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-gray-600">{user.firstName}</td>
                                <td className="py-3 px-4 text-gray-600">{user.lastName}</td>
                                <td className="py-3 px-4 text-gray-600">{user.domainName || '-'}</td>
                                <td className="py-3 px-4 text-gray-600">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    }) : '-'}
                                </td>
                                <td className="py-3 px-4">
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-green-700 border-green-300 hover:bg-green-50"
                                            onClick={() => handleQuickLogin(user)}
                                            disabled={quickLoginLoading === user._id}
                                        >
                                            {quickLoginLoading === user._id ? (
                                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                            ) : (
                                                <LogIn className="h-4 w-4 mr-1" />
                                            )}
                                            Connexion rapide
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleEditClick(user)}
                                        >
                                            <Pencil className="h-4 w-4 mr-1" />
                                            Modifier
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDeleteClick(user)}
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Supprimer
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        (currentData as NewsletterSubscription[]).map((sub) => (
                            <tr key={sub._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="font-medium text-gray-900">{sub.email}</span>
                                    </div>
                                </td>
                                <td className="py-3 px-4 text-gray-600">
                                    {new Date(sub.createdAt).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </td>
                                {activeTab === 'rejected' && (
                                    <>
                                        <td className="py-3 px-4 text-gray-600">
                                            {sub.rejectedAt ? new Date(sub.rejectedAt).toLocaleDateString('fr-FR', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            }) : '-'}
                                        </td>
                                        <td className="py-3 px-4 text-gray-600">
                                            {sub.rejectionReason || '-'}
                                        </td>
                                    </>
                                )}
                                {activeTab === 'pending' && (
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleApproveClick(sub)}
                                                disabled={actionLoading[sub._id] === 'approve'}
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                {actionLoading[sub._id] === 'approve' ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        Approuver
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleRejectClick(sub)}
                                                disabled={actionLoading[sub._id] === 'reject'}
                                            >
                                                {actionLoading[sub._id] === 'reject' ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <XCircle className="h-4 w-4 mr-1" />
                                                        Rejeter
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );

    return (
        <DashboardLayout title="Gestion des Clients">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">Gestion des Inscriptions</h1>
                <p className="text-muted-foreground">Gérez les souscriptions newsletter et créez les comptes utilisateurs</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Souscriptions en attente</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {pendingPagination?.totalSubscriptions || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Nouvelles souscriptions à traiter
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Souscriptions approuvées</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {approvedPagination?.totalUsers || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Comptes créés avec succès
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Souscriptions rejetées</CardTitle>
                        <UserX className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {rejectedPagination?.totalSubscriptions || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Souscriptions refusées
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Tabs */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                        <div className="flex space-x-1">
                            <Button
                                variant={activeTab === 'pending' ? 'default' : 'outline'}
                                onClick={() => setActiveTab('pending')}
                                className={activeTab === 'pending' ? 'bg-[#3A7B59] text-white' : ''}
                            >
                                <Clock className="h-4 w-4 mr-2" />
                                En attente ({pendingPagination?.totalSubscriptions || 0})
                            </Button>
                            <Button
                                variant={activeTab === 'approved' ? 'default' : 'outline'}
                                onClick={() => setActiveTab('approved')}
                                className={activeTab === 'approved' ? 'bg-[#3A7B59] text-white' : ''}
                            >
                                <UserCheck className="h-4 w-4 mr-2" />
                                Approuvées ({approvedPagination?.totalUsers || 0})
                            </Button>
                            <Button
                                variant={activeTab === 'rejected' ? 'default' : 'outline'}
                                onClick={() => setActiveTab('rejected')}
                                className={activeTab === 'rejected' ? 'bg-[#3A7B59] text-white' : ''}
                            >
                                <UserX className="h-4 w-4 mr-2" />
                                Rejetées ({rejectedPagination?.totalSubscriptions || 0})
                            </Button>
                        </div>
                        
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Rechercher par email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                
                <CardContent>
                    {currentLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-[#3A7B59]" />
                        </div>
                    ) : currentData.length === 0 ? (
                        <div className="text-center py-12">
                            <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {searchTerm
                                    ? 'Aucun résultat trouvé'
                                    : activeTab === 'pending'
                                    ? 'Aucune souscription en attente'
                                    : activeTab === 'approved'
                                    ? 'Aucun utilisateur approuvé'
                                    : 'Aucune souscription rejetée'
                                }
                            </h3>
                            <p className="text-gray-600">
                                {searchTerm
                                    ? 'Essayez avec un autre terme de recherche'
                                    : activeTab === 'approved'
                                    ? 'Les utilisateurs approuvés apparaîtront ici'
                                    : 'Les nouvelles souscriptions apparaîtront ici'}
                            </p>
                        </div>
                    ) : (
                        renderTable()
                    )}
                    
                    {!searchTerm && renderPagination()}
                </CardContent>
            </Card>

            {/* Approve Modal */}
            <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Approuver et créer le compte</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input value={approvingSubscription?.email || ''} disabled />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="firstName">Prénom *</Label>
                            <Input
                                id="firstName"
                                value={approveForm.firstName}
                                onChange={(e) => setApproveForm({ ...approveForm, firstName: e.target.value })}
                                placeholder="Prénom"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastName">Nom de famille *</Label>
                            <Input
                                id="lastName"
                                value={approveForm.lastName}
                                onChange={(e) => setApproveForm({ ...approveForm, lastName: e.target.value })}
                                placeholder="Nom de famille"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="domainName">Nom du domaine *</Label>
                            <Input
                                id="domainName"
                                value={approveForm.domainName}
                                onChange={(e) => setApproveForm({ ...approveForm, domainName: e.target.value })}
                                placeholder="Nom du domaine"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsApproveModalOpen(false)}
                            disabled={isApproving}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleApproveSubmit}
                            disabled={isApproving}
                            className="bg-[#3A7B59] hover:bg-[#2d5f46]"
                        >
                            {isApproving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Création en cours...
                                </>
                            ) : (
                                'Approuver et créer le compte'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Modal */}
            <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Rejeter la souscription</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input value={rejectingSubscription?.email || ''} disabled />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="rejectionReason">Raison du rejet (optionnel)</Label>
                            <textarea
                                id="rejectionReason"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Raison du rejet..."
                                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsRejectModalOpen(false)}
                            disabled={isRejecting}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRejectSubmit}
                            disabled={isRejecting}
                        >
                            {isRejecting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Rejet en cours...
                                </>
                            ) : (
                                'Rejeter'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit User Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Modifier l'utilisateur</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-firstName">Prénom</Label>
                            <Input
                                id="edit-firstName"
                                value={editForm.firstName}
                                onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-lastName">Nom de famille</Label>
                            <Input
                                id="edit-lastName"
                                value={editForm.lastName}
                                onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-domainName">Nom du domaine</Label>
                            <Input
                                id="edit-domainName"
                                value={editForm.domainName}
                                onChange={(e) => setEditForm({ ...editForm, domainName: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsEditModalOpen(false)}
                            disabled={isSaving}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={handleSaveEdit}
                            disabled={isSaving}
                            className="bg-[#3A7B59] hover:bg-[#2d5f46]"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enregistrement...
                                </>
                            ) : (
                                'Enregistrer'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Supprimer le compte</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-sm text-gray-700">
                            Êtes-vous sûr de vouloir supprimer définitivement le compte de{' '}
                            <span className="font-semibold">{deletingUser?.firstName} {deletingUser?.lastName}</span>{' '}
                            (<span className="font-semibold">{deletingUser?.email}</span>) ?
                        </p>
                        <p className="text-sm text-red-600 mt-2">
                            Cette action est irréversible. Le compte et l'abonnement associé seront définitivement supprimés.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteModalOpen(false)}
                            disabled={isDeleting}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteConfirm}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Suppression...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Supprimer définitivement
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    )
}
