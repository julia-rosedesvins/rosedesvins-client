'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";

import { userService } from "@/services/user.service";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email) {
            toast.error("Veuillez entrer votre adresse email");
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const response = await userService.forgotPassword({ email });
            setIsSuccess(true);
            toast.success(response.message || "Email envoyé avec succès");
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
                        Réinitialisation du mot de passe
                    </p>
                </div>

                {/* Form Card */}
                <Card className="shadow-xl border-0">
                    <CardHeader className="space-y-1 pb-4 lg:pb-6">
                        <CardTitle className="text-lg lg:text-xl font-bold text-center text-gray-900">
                            Mot de passe oublié ?
                        </CardTitle>
                        <p className="text-xs lg:text-sm text-gray-600 text-center">
                            Entrez votre email pour recevoir un lien de réinitialisation
                        </p>
                    </CardHeader>
                    <CardContent>
                        {isSuccess ? (
                            <div className="text-center space-y-4">
                                <div className="bg-green-50 text-green-800 p-4 rounded-lg text-sm">
                                    Si un compte existe avec cet email, vous recevrez un lien de réinitialisation dans quelques instants.
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => router.push('/login')}
                                >
                                    Retour à la connexion
                                </Button>
                            </div>
                        ) : (
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
                                            <span>Envoi en cours...</span>
                                        </div>
                                    ) : (
                                        "Envoyer le lien"
                                    )}
                                </Button>

                                {/* Back to Login */}
                                <div className="text-center">
                                    <Link 
                                        href="/login" 
                                        className="inline-flex items-center text-xs lg:text-sm text-gray-600 hover:text-gray-900 hover:underline"
                                    >
                                        <ArrowLeft className="h-3 w-3 mr-1" />
                                        Retour à la connexion
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
