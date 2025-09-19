'use client'

import UserDashboardLayout from "@/components/userDashboard/UserDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneSelector } from "@/components/PhoneSelector";
import { useState } from "react";

export default function UserMyAccount() {
    const [formData, setFormData] = useState({
        nom: "Dupont",
        prenom: "Martin",
        email: "martin.dupont@gmail.com",
        telephone: "06 18 98 67 54",
        nomDomaine: "Dupont & Fils",
        adresse: "30, rue de Chinon",
        codePostal: "37210",
        ville: "Vouvray",
        siteWeb: "domainedupontetfils.fr"
    });

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    return (
        <UserDashboardLayout title="Mon compte">
            <Card className="mb-6 lg:mb-8">
                <CardHeader>
                    <CardTitle className="text-xl lg:text-2xl font-semibold leading-none tracking-tight">
                        Mes coordonnées
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Nom */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <Label className="font-medium sm:min-w-[140px] sm:text-right text-sm">
                            Nom
                        </Label>
                        <Input
                            value={formData.nom}
                            onChange={(e) => handleInputChange('nom', e.target.value)}
                            className="flex-1"
                        />
                    </div>

                    {/* Prénom */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <Label className="font-medium sm:min-w-[140px] sm:text-right text-sm">
                            Prénom
                        </Label>
                        <Input
                            value={formData.prenom}
                            onChange={(e) => handleInputChange('prenom', e.target.value)}
                            className="flex-1"
                        />
                    </div>

                    {/* E-mail */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <Label className="font-medium sm:min-w-[140px] sm:text-right text-sm">
                            E-mail
                        </Label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="flex-1"
                        />
                    </div>

                    {/* Téléphone */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <Label className="font-medium sm:min-w-[140px] sm:text-right text-sm">
                            Téléphone
                        </Label>
                        <PhoneSelector
                            value={formData.telephone}
                            onChange={(value) => handleInputChange('telephone', value)}
                            className="flex-1"
                        />
                    </div>

                    {/* Nom du domaine */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <Label className="font-medium sm:min-w-[140px] sm:text-right text-sm">
                            Nom du domaine
                        </Label>
                        <Input
                            value={formData.nomDomaine}
                            onChange={(e) => handleInputChange('nomDomaine', e.target.value)}
                            className="flex-1"
                        />
                    </div>

                    {/* Adresse */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <Label className="font-medium sm:min-w-[140px] sm:text-right text-sm">
                            Adresse
                        </Label>
                        <Input
                            value={formData.adresse}
                            onChange={(e) => handleInputChange('adresse', e.target.value)}
                            className="flex-1"
                        />
                    </div>

                    {/* Code postal et Ville */}
                    <div className="space-y-4 sm:space-y-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                            <Label className="font-medium sm:min-w-[140px] sm:text-right text-sm">
                                Code postal
                            </Label>
                            <Input
                                value={formData.codePostal}
                                onChange={(e) => handleInputChange('codePostal', e.target.value)}
                                className="w-full sm:w-32"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 sm:ml-[156px]">
                            <Label className="font-medium text-sm sm:ml-8">
                                Ville
                            </Label>
                            <Input
                                value={formData.ville}
                                onChange={(e) => handleInputChange('ville', e.target.value)}
                                className="flex-1"
                            />
                        </div>
                    </div>

                    {/* Site web */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <Label className="font-medium sm:min-w-[140px] sm:text-right text-sm">
                            Site web
                        </Label>
                        <Input
                            value={formData.siteWeb}
                            onChange={(e) => handleInputChange('siteWeb', e.target.value)}
                            className="flex-1"
                        />
                    </div>

                    {/* Bouton Enregistrer */}
                    <div className="flex justify-end pt-4">
                        <Button 
                            className="w-full sm:w-auto px-8 text-white hover:opacity-90"
                            style={{ backgroundColor: '#3A7B59' }}
                        >
                            Enregistrer
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Modifier le mot de passe */}
            <div className="mb-6 lg:mb-8">
                <Button
                    variant="link"
                    className="p-0 h-auto font-medium text-base lg:text-lg hover:opacity-80"
                    style={{ color: '#3A7B59' }}
                >
                    Modifier le mot de passe
                </Button>
            </div>

            {/* Mon abonnement */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl lg:text-2xl font-semibold leading-none tracking-tight">
                        Mon abonnement
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground mb-6 text-sm lg:text-base">
                        Votre contrat annuel a démarré le 25/05/2025. N'hésitez pas à nous contacter si besoin d'en discuter.
                    </p>

                    <div className="flex justify-end">
                        <Button
                            variant="link"
                            className="p-0 h-auto font-medium text-sm lg:text-base hover:opacity-80"
                            style={{ color: '#3A7B59' }}
                        >
                            Résilier mon abonnement
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </UserDashboardLayout>
    );
}