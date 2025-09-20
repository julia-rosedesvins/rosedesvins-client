"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, ChevronLeft, ChevronRight, Users, UserCheck, Clock, UserX, Loader2 } from "lucide-react"
import DashboardLayout from "@/components/admin/DashboardLayout"
import { useAdmin } from '@/contexts/AdminContext'
import { adminService, AdminUser, PaginatedUsersResponse, UserActionRequest } from '@/services/admin.service'
import toast from 'react-hot-toast'

type TabType = 'pending' | 'approved' | 'rejected'

export default function AdminClients() {
    const { admin, isLoading } = useAdmin();
    const [activeTab, setActiveTab] = useState<TabType>('pending');
    const [pendingUsers, setPendingUsers] = useState<AdminUser[]>([]);
    const [approvedUsers, setApprovedUsers] = useState<AdminUser[]>([]);
    const [rejectedUsers, setRejectedUsers] = useState<AdminUser[]>([]);
    const [pendingPagination, setPendingPagination] = useState<any>(null);
    const [approvedPagination, setApprovedPagination] = useState<any>(null);
    const [rejectedPagination, setRejectedPagination] = useState<any>(null);
    const [loadingPending, setLoadingPending] = useState(false);
    const [loadingApproved, setLoadingApproved] = useState(false);
    const [loadingRejected, setLoadingRejected] = useState(false);
    const [actionLoading, setActionLoading] = useState<{[key: string]: 'approve' | 'reject' | null}>({});
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPendingUsers = async (page: number = 1, limit: number = 10) => {
        setLoadingPending(true);
        try {
            const response = await adminService.getPendingApprovalUsers({ page, limit });
            setPendingUsers(response.data);
            setPendingPagination(response.pagination);
        } catch (error: any) {
            console.error('Error fetching pending users:', error);
            toast.error('Erreur lors du chargement des demandes en attente');
        } finally {
            setLoadingPending(false);
        }
    };

    const fetchApprovedUsers = async (page: number = 1, limit: number = 10) => {
        setLoadingApproved(true);
        try {
            const response = await adminService.getApprovedUsers({ page, limit });
            setApprovedUsers(response.data);
            setApprovedPagination(response.pagination);
        } catch (error: any) {
            console.error('Error fetching approved users:', error);
            toast.error('Erreur lors du chargement des utilisateurs approuvés');
        } finally {
            setLoadingApproved(false);
        }
    };

    const fetchRejectedUsers = async (page: number = 1, limit: number = 10) => {
        setLoadingRejected(true);
        try {
            const response = await adminService.getRejectedUsers({ page, limit });
            setRejectedUsers(response.data);
            setRejectedPagination(response.pagination);
        } catch (error: any) {
            console.error('Error fetching rejected users:', error);
            toast.error('Erreur lors du chargement des utilisateurs rejetés');
        } finally {
            setLoadingRejected(false);
        }
    };

    const handleUserAction = async (userId: string, action: 'approve' | 'reject') => {
        // Set loading state for this specific user and action
        setActionLoading(prev => ({ ...prev, [userId]: action }));
        
        try {
            const request: UserActionRequest = { userId, action };
            const response = await adminService.performUserAction(request);
            
            if (response.success) {
                toast.success(response.message);
                
                // Refresh all lists to reflect the changes
                fetchPendingUsers();
                fetchApprovedUsers();
                fetchRejectedUsers();
            } else {
                toast.error(response.message || 'Erreur lors de l\'action utilisateur');
            }
        } catch (error: any) {
            console.error('Error performing user action:', error);
            toast.error(error.message || 'Erreur lors de l\'action utilisateur');
        } finally {
            // Clear loading state for this user
            setActionLoading(prev => ({ ...prev, [userId]: null }));
        }
    };

    useEffect(() => {
        fetchPendingUsers();
        fetchApprovedUsers();
        fetchRejectedUsers();
    }, []);

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

    const handlePageChange = (type: TabType, page: number) => {
        if (type === 'pending') {
            fetchPendingUsers(page);
        } else if (type === 'approved') {
            fetchApprovedUsers(page);
        } else {
            fetchRejectedUsers(page);
        }
    };

    const filteredPendingUsers = pendingUsers.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.domainName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredApprovedUsers = approvedUsers.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.domainName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredRejectedUsers = rejectedUsers.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.domainName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentUsers = activeTab === 'pending' ? filteredPendingUsers : 
                        activeTab === 'approved' ? filteredApprovedUsers : filteredRejectedUsers;
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
                    {Math.min(currentPagination.currentPage * currentPagination.limit, currentPagination.totalUsers)} sur{' '}
                    {currentPagination.totalUsers} résultats
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

    const renderUserTable = () => (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Nom complet</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Nom du domaine</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user) => (
                        <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4">
                                <div className="font-medium text-gray-900">
                                    {user.firstName} {user.lastName}
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <div className="text-gray-600">{user.email}</div>
                            </td>
                            <td className="py-4 px-4">
                                <div className="text-gray-600">{user.domainName}</div>
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex justify-center space-x-2">
                                    {user.accountStatus === 'pending_approval' ? (
                                        <>
                                            <Button 
                                                size="sm"
                                                className="bg-[#3A7B59] hover:bg-[#2d5f43] text-white"
                                                onClick={() => handleUserAction(user._id, 'approve')}
                                                disabled={actionLoading[user._id] !== undefined && actionLoading[user._id] !== null}
                                            >
                                                {actionLoading[user._id] === 'approve' ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Traitement...
                                                    </>
                                                ) : (
                                                    'Approuver'
                                                )}
                                            </Button>
                                            <Button 
                                                size="sm"
                                                variant="outline"
                                                className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                                                onClick={() => handleUserAction(user._id, 'reject')}
                                                disabled={actionLoading[user._id] !== undefined && actionLoading[user._id] !== null}
                                            >
                                                {actionLoading[user._id] === 'reject' ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                        Traitement...
                                                    </>
                                                ) : (
                                                    'Rejeter'
                                                )}
                                            </Button>
                                        </>
                                    ) : user.accountStatus === 'rejected' ? (
                                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                            Rejeté
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                            {user.accountStatus === 'approved' ? 'Approuvé' : 'Actif'}
                                        </Badge>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <DashboardLayout title="Gestion des Clients">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">Gestion des Clients</h1>
                <p className="text-muted-foreground">Gérez les demandes d'inscription et les utilisateurs approuvés</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Demandes en attente</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {pendingPagination?.totalUsers || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Nouvelles demandes à traiter
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Utilisateurs approuvés</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {approvedPagination?.totalUsers || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Clients actifs et approuvés
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Utilisateurs rejetés</CardTitle>
                        <UserX className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {rejectedPagination?.totalUsers || 0}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Demandes rejetées
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
                                className={activeTab === 'pending' ? 'bg-[#3A7B59] hover:bg-[#2d5f43]' : ''}
                            >
                                <Clock className="w-4 h-4 mr-2" />
                                En attente ({pendingPagination?.totalUsers || 0})
                            </Button>
                            <Button
                                variant={activeTab === 'approved' ? 'default' : 'outline'}
                                onClick={() => setActiveTab('approved')}
                                className={activeTab === 'approved' ? 'bg-[#3A7B59] hover:bg-[#2d5f43]' : ''}
                            >
                                <UserCheck className="w-4 h-4 mr-2" />
                                Approuvés ({approvedPagination?.totalUsers || 0})
                            </Button>
                            <Button
                                variant={activeTab === 'rejected' ? 'default' : 'outline'}
                                onClick={() => setActiveTab('rejected')}
                                className={activeTab === 'rejected' ? 'bg-[#3A7B59] hover:bg-[#2d5f43]' : ''}
                            >
                                <UserX className="w-4 h-4 mr-2" />
                                Rejetés ({rejectedPagination?.totalUsers || 0})
                            </Button>
                        </div>
                        
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Rechercher par nom, email, domaine..."
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
                            <div className="w-8 h-8 border-2 border-[#3A7B59] border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-3 text-gray-600">Chargement...</span>
                        </div>
                    ) : currentUsers.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {searchTerm ? 'Aucun résultat trouvé' : 'Aucun utilisateur'}
                            </h3>
                            <p className="text-gray-600">
                                {searchTerm 
                                    ? 'Essayez de modifier vos critères de recherche' 
                                    : activeTab === 'pending' 
                                        ? 'Aucune demande en attente pour le moment'
                                        : activeTab === 'approved'
                                            ? 'Aucun utilisateur approuvé pour le moment'
                                            : 'Aucun utilisateur rejeté pour le moment'
                                }
                            </p>
                        </div>
                    ) : (
                        renderUserTable()
                    )}
                    
                    {!searchTerm && renderPagination()}
                </CardContent>
            </Card>
        </DashboardLayout>
    )
}
