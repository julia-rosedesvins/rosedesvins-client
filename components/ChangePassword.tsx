"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock } from "lucide-react";
import { userService } from "@/services/user.service";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface ChangePasswordProps {
  user: any;
  onPasswordChanged: () => void;
}

export default function ChangePassword({ user, onPasswordChanged }: ChangePasswordProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Tous les champs sont requis");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    if (newPassword.length < 8) {
      setError("Le nouveau mot de passe doit contenir au moins 8 caractères");
      return;
    }

    // Check password strength
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChar = /[@$!%*?&]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      setError("Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial");
      return;
    }

    setIsLoading(true);

    try {
      console.log('Sending password change request with:', {
        currentPassword: currentPassword ? '***' : 'undefined',
        newPassword: newPassword ? '***' : 'undefined'
      });

      const response = await userService.changePassword({
        currentPassword,
        newPassword
      });

      console.log('Change password response:', response);

      if (response.success) {
        toast.success("Mot de passe changé avec succès");
        onPasswordChanged();
      } else {
        setError(response.message || "Erreur lors du changement de mot de passe");
      }
    } catch (error: any) {
      console.error('Change password error:', error);
      console.error('Error details:', {
        message: error?.message,
        response: error?.response,
        responseData: error?.response?.data,
        status: error?.response?.status
      });
      
      // Handle different types of errors
      if (error?.response?.data) {
        const errorData = error.response.data;
        if (errorData.errors && Array.isArray(errorData.errors)) {
          // Validation errors
          const errorMessages = errorData.errors.map((err: any) => err.message).join(', ');
          setError(errorMessages);
        } else if (errorData.message) {
          // Single error message
          setError(errorData.message);
        } else {
          setError("Erreur lors du changement de mot de passe");
        }
      } else if (error?.message) {
        setError(error.message);
      } else {
        setError("Erreur lors du changement de mot de passe");
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
            <Image
              src="/assets/logo.png"
              alt="Rose des Vins"
              width={80}
              height={80}
              className="lg:w-20 lg:h-20 w-16 h-16 object-contain"
              priority
            />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1">Rose des Vins</h1>
          <p className="text-sm lg:text-base text-gray-600">Changement de mot de passe requis</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900">
              Modifier votre mot de passe
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Bonjour {user?.firstName}, vous devez changer votre mot de passe pour continuer.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                  Mot de passe actuel
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pl-10 pr-10 h-11"
                    placeholder="Entrez votre mot de passe actuel"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                  Nouveau mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10 h-11"
                    placeholder="Entrez votre nouveau mot de passe"
                    disabled={isLoading}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Le mot de passe doit contenir au moins 8 caractères avec majuscule, minuscule, chiffre et caractère spécial
                </p>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                  Confirmer le nouveau mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-11"
                    placeholder="Confirmez votre nouveau mot de passe"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-white font-medium"
                style={{ backgroundColor: '#3A7B59' }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Changement en cours...
                  </div>
                ) : (
                  "Changer le mot de passe"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Ce changement est obligatoire pour la sécurité de votre compte
          </p>
        </div>
      </div>
    </div>
  );
}
