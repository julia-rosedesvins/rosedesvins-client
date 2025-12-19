'use client';
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

import { userService } from "@/services/user.service";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();
    const params = useParams();
    const token = params.token as string;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!password || !confirmPassword) {
            toast.error("Veuillez remplir tous les champs");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Les mots de passe ne correspondent pas");
            return;
        }

        if (password.length < 8) {
            toast.error("Le mot de passe doit contenir au moins 8 caractères");
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const response = await userService.resetPassword({ 
                token, 
                newPassword: password 
            });

            setIsSuccess(true);
            toast.success(response.message || "Mot de passe réinitialisé avec succès");
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (error: any) {
            toast.error(error.message || "Une erreur est survenue");
        } finally {
            setIsSubmitting(false);
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
                        Nouveau mot de passe
                    </p>
                </div>

                {/* Form Card */}
                <Card className="shadow-xl border-0">
                    <CardHeader className="space-y-1 pb-4 lg:pb-6">
                        <CardTitle className="text-lg lg:text-xl font-bold text-center text-gray-900">
                            Réinitialisation
                        </CardTitle>
                        <p className="text-xs lg:text-sm text-gray-600 text-center">
                            Choisissez votre nouveau mot de passe
                        </p>
                    </CardHeader>
                    <CardContent>
                        {isSuccess ? (
                            <div className="text-center space-y-4">
                                <div className="bg-green-50 text-green-800 p-4 rounded-lg text-sm">
                                    Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion.
                                </div>
                                <Button
                                    className="w-full"
                                    style={{ backgroundColor: '#3A7B59' }}
                                    onClick={() => router.push('/login')}
                                >
                                    Se connecter maintenant
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                                {/* Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-xs lg:text-sm font-medium">
                                        Nouveau mot de passe
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Minimum 8 caractères"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10 pr-10 h-10 lg:h-11 text-xs lg:text-sm border-gray-300 focus:ring-2 focus:ring-opacity-50"
                                            style={{ 
                                                '--tw-ring-color': '#3A7B59'
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
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-xs lg:text-sm font-medium">
                                        Confirmer le mot de passe
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Confirmez votre mot de passe"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="pl-10 h-10 lg:h-11 text-xs lg:text-sm border-gray-300 focus:ring-2 focus:ring-opacity-50"
                                            style={{ 
                                                '--tw-ring-color': '#3A7B59'
                                            } as React.CSSProperties}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-10 lg:h-11 text-white font-medium text-xs lg:text-sm hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: '#3A7B59' }}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Réinitialisation...</span>
                                        </div>
                                    ) : (
                                        "Réinitialiser le mot de passe"
                                    )}
                                </Button>

                                {/* Back to Login */}
                                <div className="text-center">
                                    <Link 
                                        href="/login" 
                                        className="inline-flex items-center text-xs lg:text-sm text-gray-600 hover:text-gray-900 hover:underline"
                                    >
                                        <ArrowLeft className="h-3 w-3 mr-1" />
                                        Annuler
                                    </Link>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
