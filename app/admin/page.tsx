'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Lock, Mail, Shield, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { adminService, ApiError } from "@/services/admin.service";
import { useAdmin } from "@/contexts/AdminContext";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>("");
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const router = useRouter();
    const { login, isAuthenticated } = useAdmin();

    // If already authenticated, this will be handled by AdminContext
    // but we can show loading state
    if (isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-[#3A7B59] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Redirection vers le tableau de bord...</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setValidationErrors({});
        
        try {
            const response = await adminService.login({
                email,
                password
            });

            if (response.success) {
                // Update admin context
                login(response.data.user);
                // Success! Redirect to admin dashboard (handled by context)
                router.push('/admin/dashboard');
            }
        } catch (err) {
            const apiError = err as ApiError;
            
            if (apiError.errors && apiError.errors.length > 0) {
                // Handle validation errors
                const errors: Record<string, string> = {};
                apiError.errors.forEach(error => {
                    errors[error.field] = error.message;
                });
                setValidationErrors(errors);
            } else {
                // Handle general errors
                setError(apiError.message || 'Une erreur est survenue lors de la connexion');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand Section */}
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
                    <p className="text-xs lg:text-sm text-gray-600">
                        Administration - Espace sécurisé
                    </p>
                </div>

                {/* Login Form Card */}
                <Card className="shadow-xl border-0">
                    <CardHeader className="space-y-1 pb-4 lg:pb-6">
                        <CardTitle className="text-lg lg:text-xl font-bold text-center text-gray-900 flex items-center justify-center space-x-2">
                            <Shield className="h-5 w-5" style={{ color: '#3A7B59' }} />
                            <span>Administration</span>
                        </CardTitle>
                        <p className="text-xs lg:text-sm text-gray-600 text-center">
                            Accédez au panneau d'administration
                        </p>
                    </CardHeader>
                    <CardContent>
                        {/* General Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                                <div className="flex items-center space-x-2">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <span className="text-sm text-red-800">{error}</span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs lg:text-sm font-medium">
                                    Adresse email admin
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@rosedesvins.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`pl-10 h-10 lg:h-11 text-xs lg:text-sm border-gray-300 focus:ring-2 focus:ring-opacity-50 ${
                                            validationErrors.email ? 'border-red-300 focus:ring-red-500' : ''
                                        }`}
                                        style={{ 
                                            '--tw-ring-color': validationErrors.email ? '#ef4444' : '#3A7B59'
                                        } as React.CSSProperties}
                                        required
                                    />
                                </div>
                                {validationErrors.email && (
                                    <p className="text-xs text-red-600 mt-1">{validationErrors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-xs lg:text-sm font-medium">
                                    Mot de passe admin
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Mot de passe sécurisé"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`pl-10 pr-10 h-10 lg:h-11 text-xs lg:text-sm border-gray-300 focus:ring-2 focus:ring-opacity-50 ${
                                            validationErrors.password ? 'border-red-300 focus:ring-red-500' : ''
                                        }`}
                                        style={{ 
                                            '--tw-ring-color': validationErrors.password ? '#ef4444' : '#3A7B59'
                                        } as React.CSSProperties}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {validationErrors.password && (
                                    <p className="text-xs text-red-600 mt-1">{validationErrors.password}</p>
                                )}
                            </div>

                            {/* Forgot Password Link */}
                            <div className="flex justify-end">
                                <Link 
                                    href="/admin/forgot-password" 
                                    className="text-xs lg:text-sm hover:underline"
                                    style={{ color: '#3A7B59' }}
                                >
                                    Accès oublié ?
                                </Link>
                            </div>

                            {/* Login Button */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-10 lg:h-11 text-white font-medium text-xs lg:text-sm hover:opacity-90 transition-opacity"
                                style={{ backgroundColor: '#3A7B59' }}
                            >
                                {isLoading ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Connexion...</span>
                                    </div>
                                ) : (
                                    "Accéder à l'administration"
                                )}
                            </Button>
                        </form>

                        <Separator className="my-4 lg:my-6" />

                        {/* Security Notice */}
                        <div className="text-center">
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                                <div className="flex items-center justify-center space-x-2 mb-1">
                                    <Shield className="h-4 w-4 text-orange-600" />
                                    <span className="text-xs font-medium text-orange-800">Zone sécurisée</span>
                                </div>
                                <p className="text-xs text-orange-700">
                                    Cet espace est réservé aux administrateurs autorisés. Toutes les connexions sont surveillées.
                                </p>
                            </div>
                            
                            <p className="text-xs text-gray-500">
                                En vous connectant, vous acceptez la{" "}
                                <Link 
                                    href="/admin/security-policy" 
                                    className="hover:underline"
                                    style={{ color: '#3A7B59' }}
                                >
                                    politique de sécurité
                                </Link>
                                {" "}de l'administration.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Support Link */}
                <div className="text-center mt-4 lg:mt-6">
                    <p className="text-xs lg:text-sm text-gray-600">
                        Support technique admin :{" "}
                        <Link 
                            href="/admin/support" 
                            className="font-medium hover:underline"
                            style={{ color: '#3A7B59' }}
                        >
                            Assistance prioritaire
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
