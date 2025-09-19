'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate login API call
        setTimeout(() => {
            setIsLoading(false);
            // Redirect to dashboard after successful login
            router.push('/dashboard');
        }, 1500);
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
                        Connectez-vous à votre espace viticulteur
                    </p>
                </div>

                {/* Login Form Card */}
                <Card className="shadow-xl border-0">
                    <CardHeader className="space-y-1 pb-4 lg:pb-6">
                        <CardTitle className="text-lg lg:text-xl font-bold text-center text-gray-900">
                            Connexion
                        </CardTitle>
                        <p className="text-xs lg:text-sm text-gray-600 text-center">
                            Accédez à votre tableau de bord
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-xs lg:text-sm font-medium">
                                    Adresse email
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="votre.email@exemple.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-10 lg:h-11 text-xs lg:text-sm border-gray-300 focus:ring-2 focus:ring-opacity-50"
                                        style={{ 
                                            '--tw-ring-color': '#3A7B59'
                                        } as React.CSSProperties}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-xs lg:text-sm font-medium">
                                    Mot de passe
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Votre mot de passe"
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

                            {/* Forgot Password Link */}
                            <div className="flex justify-end">
                                <Link 
                                    href="/forgot-password" 
                                    className="text-xs lg:text-sm hover:underline"
                                    style={{ color: '#3A7B59' }}
                                >
                                    Mot de passe oublié ?
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
                                    "Se connecter"
                                )}
                            </Button>
                        </form>

                        <Separator className="my-4 lg:my-6" />

                        {/* Footer */}
                        <div className="text-center">
                            <p className="text-xs text-gray-500">
                                En vous connectant, vous acceptez nos{" "}
                                <Link 
                                    href="/terms" 
                                    className="hover:underline"
                                    style={{ color: '#3A7B59' }}
                                >
                                    conditions d'utilisation
                                </Link>
                                {" "}et notre{" "}
                                <Link 
                                    href="/privacy" 
                                    className="hover:underline"
                                    style={{ color: '#3A7B59' }}
                                >
                                    politique de confidentialité
                                </Link>
                                .
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Support Link */}
                <div className="text-center mt-4 lg:mt-6">
                    <p className="text-xs lg:text-sm text-gray-600">
                        Besoin d'aide ?{" "}
                        <Link 
                            href="/contact" 
                            className="font-medium hover:underline"
                            style={{ color: '#3A7B59' }}
                        >
                            Contactez le support
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}