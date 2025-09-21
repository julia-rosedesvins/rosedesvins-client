'use client'

import UserDashboardLayout from "@/components/userDashboard/UserDashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneSelector } from "@/components/PhoneSelector";
import { useState, useEffect } from "react";
import { contactDetailsService, ContactDetails } from "@/services/contactDetails.service";
import { toast } from "react-hot-toast";

export default function UserMyAccount() {
    const [formData, setFormData] = useState({
        prenom: "",
        nom: "",
        email: "",
        telephone: "",
        nomDomaine: "",
        adresse: "",
        codePostal: "",
        ville: "",
        siteWeb: ""
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Fetch contact details on component mount
    useEffect(() => {
        const fetchContactDetails = async () => {
            try {
                setIsLoading(true);
                const response = await contactDetailsService.getContactDetails();
                
                if (response.success && response.data) {
                    const data = response.data;
                    setFormData({
                        prenom: data.firstName || "",
                        nom: data.lastName || "",
                        email: data.email || "",
                        telephone: data.phoneNumber || "",
                        nomDomaine: data.domainName || "",
                        adresse: data.address || "",
                        codePostal: data.codePostal || "",
                        ville: data.city || "",
                        siteWeb: data.siteWeb || ""
                    });
                }
            } catch (error: any) {
                console.error('Error fetching contact details:', error);
                toast.error('Erreur lors du chargement des données');
            } finally {
                setIsLoading(false);
            }
        };

        fetchContactDetails();
    }, []);

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            
            const updateData = {
                firstName: formData.prenom,
                lastName: formData.nom,
                phoneNumber: formData.telephone,
                domainName: formData.nomDomaine,
                address: formData.adresse,
                codePostal: formData.codePostal,
                city: formData.ville,
                siteWeb: formData.siteWeb
            };

            const response = await contactDetailsService.updateContactDetails(updateData);
            
            if (response.success) {
                toast.success('Données sauvegardées avec succès');
            } else {
                toast.error(response.message || 'Erreur lors de la sauvegarde');
            }
        } catch (error: any) {
            console.error('Error saving contact details:', error);
            if (error?.response?.data?.errors && Array.isArray(error.response.data.errors)) {
                const errorMessages = error.response.data.errors.map((err: any) => err.message).join(', ');
                toast.error(errorMessages);
            } else if (error?.message) {
                toast.error(error.message);
            } else {
                toast.error('Erreur lors de la sauvegarde');
            }
        } finally {
            setIsSaving(false);
        }
    };
    return (
        <UserDashboardLayout title="Mon compte">
            {isLoading ? (
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-lg">Chargement...</div>
                </div>
            ) : (
                <>
                    <Card className="mb-6 lg:mb-8">
                        <CardHeader>
                            <CardTitle className="text-xl lg:text-2xl font-semibold leading-none tracking-tight">
                                Mes coordonnées
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
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

                    {/* Nom */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <Label className="font-medium sm:min-w-[140px] sm:text-right text-sm">
                            Nom de famille *
                        </Label>
                        <Input
                            value={formData.nom}
                            onChange={(e) => handleInputChange('nom', e.target.value)}
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
                            disabled
                            className="flex-1 bg-gray-50 cursor-not-allowed"
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
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <Label className="font-medium sm:min-w-[140px] sm:text-right text-sm">
                            Code postal
                        </Label>
                        <div className="flex-1 flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <Input
                                value={formData.codePostal}
                                onChange={(e) => handleInputChange('codePostal', e.target.value)}
                                className="w-full sm:w-32"
                                placeholder="37210"
                            />
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1">
                                <Label className="font-medium text-sm sm:min-w-[50px]">
                                    Ville
                                </Label>
                                <Input
                                    value={formData.ville}
                                    onChange={(e) => handleInputChange('ville', e.target.value)}
                                    className="flex-1"
                                    placeholder="Vouvray"
                                />
                            </div>
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
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full sm:w-auto px-8 text-white hover:opacity-90"
                            style={{ backgroundColor: '#3A7B59' }}
                        >
                            {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
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
                </>
            )}
        </UserDashboardLayout>
    );
}