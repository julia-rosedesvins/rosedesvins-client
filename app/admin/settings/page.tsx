"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Settings, Lock } from "lucide-react"
import DashboardLayout from "@/components/admin/DashboardLayout"
import { useAdmin } from '@/contexts/AdminContext'
import { adminService, AdminChangePasswordRequest } from '@/services/admin.service'
import toast from 'react-hot-toast'

export default function AdminSettings() {
    const { admin, isLoading } = useAdmin();
    const [isMounted, setIsMounted] = useState(false);
    
    // Password change states
    const [passwordData, setPasswordData] = useState<AdminChangePasswordRequest>({
        currentPassword: '',
        newPassword: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });

    // Ensure component is mounted on client side
    useEffect(() => {
        setIsMounted(true);
    }, []);

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

    const handlePasswordChange = async () => {
        // Validation
        if (!passwordData.currentPassword.trim()) {
            toast.error('Le mot de passe actuel est requis');
            return;
        }
        
        if (!passwordData.newPassword.trim()) {
            toast.error('Le nouveau mot de passe est requis');
            return;
        }
        
        if (passwordData.newPassword.length < 8) {
            toast.error('Le nouveau mot de passe doit contenir au moins 8 caractères');
            return;
        }
        
        if (passwordData.newPassword !== confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas');
            return;
        }

        try {
            setIsChangingPassword(true);
            
            const response = await adminService.changePassword(passwordData);
            
            if (response.success) {
                toast.success('Mot de passe modifié avec succès');
                // Reset form
                setPasswordData({ currentPassword: '', newPassword: '' });
                setConfirmPassword('');
                setShowPasswords({ current: false, new: false, confirm: false });
            } else {
                toast.error(response.message || 'Erreur lors de la modification du mot de passe');
            }
        } catch (error: any) {
            console.error('Error changing password:', error);
            if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
                const errorMessages = error.response.data.errors.map((err: any) => err.message).join(', ');
                toast.error(errorMessages);
            } else if (error?.message) {
                toast.error(error.message);
            } else {
                toast.error('Erreur lors de la modification du mot de passe');
            }
        } finally {
            setIsChangingPassword(false);
        }
    };

    const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <DashboardLayout title="Paramètres">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Profile Information Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                        <div className="flex items-center space-x-2">
                            <Settings className="h-5 w-5 text-[#3A7B59]" />
                            <CardTitle className="text-xl font-semibold">
                                Informations du profil
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                    Prénom
                                </Label>
                                <Input
                                    value={admin.firstName}
                                    disabled
                                    className="bg-gray-50 cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                    Nom
                                </Label>
                                <Input
                                    value={admin.lastName}
                                    disabled
                                    className="bg-gray-50 cursor-not-allowed"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Email
                            </Label>
                            <Input
                                value={admin.email}
                                disabled
                                className="bg-gray-50 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Rôle
                            </Label>
                            <Input
                                value="Administrateur"
                                disabled
                                className="bg-gray-50 cursor-not-allowed"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Change Password Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center space-x-2">
                            <Lock className="h-5 w-5 text-[#3A7B59]" />
                            <CardTitle className="text-xl font-semibold">
                                Modifier le mot de passe
                            </CardTitle>
                        </div>
                        <Button 
                            onClick={handlePasswordChange}
                            disabled={isChangingPassword}
                            className="px-6 text-white hover:opacity-90"
                            style={{ backgroundColor: '#3A7B59' }}
                        >
                            {isChangingPassword ? 'Modification...' : 'Modifier'}
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Mot de passe actuel *
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showPasswords.current ? "text" : "password"}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                                    className="pr-10"
                                    placeholder="Entrez votre mot de passe actuel"
                                    disabled={isChangingPassword}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => togglePasswordVisibility('current')}
                                    disabled={isChangingPassword}
                                >
                                    {showPasswords.current ? (
                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Nouveau mot de passe *
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showPasswords.new ? "text" : "password"}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                                    className="pr-10"
                                    placeholder="Entrez votre nouveau mot de passe"
                                    disabled={isChangingPassword}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => togglePasswordVisibility('new')}
                                    disabled={isChangingPassword}
                                >
                                    {showPasswords.new ? (
                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Confirm New Password */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Confirmer le nouveau mot de passe *
                            </Label>
                            <div className="relative">
                                <Input
                                    type={showPasswords.confirm ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pr-10"
                                    placeholder="Confirmez votre nouveau mot de passe"
                                    disabled={isChangingPassword}
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    disabled={isChangingPassword}
                                >
                                    {showPasswords.confirm ? (
                                        <EyeOff className="h-4 w-4 text-gray-500" />
                                    ) : (
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="text-sm text-blue-800 font-medium mb-2">Exigences du mot de passe :</p>
                            <ul className="text-xs text-blue-700 space-y-1">
                                <li>• Au moins 8 caractères</li>
                                <li>• Doit être différent de votre mot de passe actuel</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
