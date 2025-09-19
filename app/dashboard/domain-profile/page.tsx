'use client'

import UserDashboardLayout from "@/components/userDashboard/UserDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image, Camera, Plus, Edit, Trash2 } from "lucide-react";
import { AddServiceModal } from "@/components/AddServiceModal";
import { EditServiceModal } from "@/components/EditServiceModal";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function UserDomainProfile() {
    const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
    const [selectedPrestation, setSelectedPrestation] = useState<string | null>(null);
    const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
    const [editingPrestation, setEditingPrestation] = useState<any>(null);

    const [prestations, setPrestations] = useState([
        { id: 1, name: "Dégustation de vins", description: "Découvrez nos vins d'exception dans un cadre authentique", price: "25€", duration: "1h30", active: true },
        { id: 2, name: "Visite libre de cave et dégustation de vins", description: "Explorez notre cave historique et dégustez nos meilleurs crus", price: "35€", duration: "2h", active: true },
        { id: 3, name: "Atelier vins et fromages", description: "Association parfaite entre nos fromages locaux et nos vins", price: "45€", duration: "2h30", active: false },
        { id: 4, name: "Pique-nique dans les vignes", description: "Profitez d'un déjeuner champêtre au cœur de nos vignobles", price: "35€", duration: "2h", active: true }
    ]);

    const handleEditPrestation = (prestation: any) => {
        setEditingPrestation(prestation);
        setIsEditServiceModalOpen(true);
    };

    const handleSavePrestation = (updatedPrestation: any) => {
        // Logic pour sauvegarder la prestation modifiée
        console.log("Prestation mise à jour:", updatedPrestation);
    };

    const handleToggleActive = (prestationId: number) => {
        setPrestations(prevPrestations =>
            prevPrestations.map(prestation =>
                prestation.id === prestationId
                    ? { ...prestation, active: !prestation.active }
                    : prestation
            )
        );
    };
    return (
        <UserDashboardLayout title="Profil Domaine">
            <div className="mx-auto space-y-4 lg:space-y-6">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Profil du domaine</h1>
                    <p className="text-sm lg:text-base text-muted-foreground">Gérez les informations liées à votre profil.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg lg:text-xl">Informations générales</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="nom-domaine" className="text-sm font-medium">Nom du domaine</Label>
                            <Input
                                id="nom-domaine"
                                placeholder="Ex: Château de la Rose"
                                defaultValue="Dupont & Fils"
                                className="mt-1"
                            />
                        </div>

                        <div>
                            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Décrivez votre domaine viticole..."
                                defaultValue="Situé près de Tours, au cœur de l'appellation Vouvray, notre domaine familial, transmis depuis quatre générations, est engagé dans l'agriculture biologique. Nous vous accueillons dans une authentique cave troglodytique creusée dans le tuffeau, pierre emblématique de la région, pour des dégustations, visites et ateliers vins et fromages. L'occasion de découvrir notre savoir-faire traditionnel et de partager avec vous notre passion du vin."
                                rows={4}
                                className="mt-1"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg lg:text-xl">Personnalisation du profil</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 lg:space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                            {/* Photo de profil */}
                            <div className="space-y-4">
                                <Label htmlFor="photo-profil" className="text-sm font-medium">Photo de profil du domaine</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 lg:p-6 text-center hover:border-gray-400 transition-colors">
                                    <div className="flex flex-col items-center space-y-2">
                                        <Camera className="h-10 w-10 lg:h-12 lg:w-12 text-gray-400" />
                                        <div className="text-sm text-gray-600">
                                            <label htmlFor="photo-profil" className="cursor-pointer hover:opacity-80" style={{ color: '#3A7B59' }}>
                                                Cliquez pour uploader
                                            </label>
                                            <p className="text-xs mt-1">ou glissez-déposez votre image ici</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG jusqu'à 5MB</p>
                                    </div>
                                    <input
                                        id="photo-profil"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {/* Logo du domaine */}
                            <div className="space-y-4">
                                <Label htmlFor="logo-domaine" className="text-sm font-medium">Logo du domaine</Label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 lg:p-6 text-center hover:border-gray-400 transition-colors">
                                    <div className="flex flex-col items-center space-y-2">
                                        <Image className="h-10 w-10 lg:h-12 lg:w-12 text-gray-400" />
                                        <div className="text-sm text-gray-600">
                                            <label htmlFor="logo-domaine" className="cursor-pointer hover:opacity-80" style={{ color: '#3A7B59' }}>
                                                Cliquez pour uploader
                                            </label>
                                            <p className="text-xs mt-1">ou glissez-déposez votre logo ici</p>
                                        </div>
                                        <p className="text-xs text-gray-500">PNG, JPG, SVG jusqu'à 5MB</p>
                                    </div>
                                    <input
                                        id="logo-domaine"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section Couleurs */}
                        <div className="border-t pt-4 lg:pt-6">
                            <div className="space-y-4">
                                <h3 className="text-base lg:text-lg font-semibold">Couleurs</h3>
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                                        <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-4 border-gray-200 relative overflow-hidden">
                                            <div className="w-full h-full bg-gradient-to-r from-red-500 to-purple-500 via-blue-500 relative">
                                                <div className="absolute inset-2 bg-white rounded-full border-2 border-gray-300"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <Label htmlFor="color-picker" className="text-sm font-medium">Code couleur</Label>
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-1">
                                            <Input
                                                id="color-picker"
                                                type="text"
                                                defaultValue="#000000"
                                                className="font-mono flex-1"
                                                placeholder="#000000"
                                            />
                                            <input
                                                type="color"
                                                defaultValue="#000000"
                                                className="w-full sm:w-12 h-10 border border-gray-300 rounded cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section Prestations œnotouristiques */}
                        <div className="border-t pt-4 lg:pt-6">
                            <h3 className="text-base lg:text-lg font-semibold mb-4">Mes prestations œnotouristiques</h3>
                            <div className={`grid gap-4 lg:gap-6 ${selectedPrestation ? 'xl:grid-cols-2' : 'grid-cols-1'}`}>
                                {/* Liste des prestations */}
                                <div className="space-y-3">
                                    {prestations.map((prestation) => (
                                        <div
                                            key={prestation.id}
                                            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg cursor-pointer transition-colors ${selectedPrestation === prestation.id.toString()
                                                ? 'bg-green-50'
                                                : 'border-gray-200 bg-white hover:bg-gray-50'
                                                }`}
                                            style={
                                                selectedPrestation === prestation.id.toString()
                                                    ? { borderColor: '#3A7B59' }
                                                    : {}
                                            }
                                            onClick={() => setSelectedPrestation(
                                                selectedPrestation === prestation.id.toString() ? null : prestation.id.toString()
                                            )}
                                        >
                                            <span className="text-gray-700 font-medium mb-2 sm:mb-0">{prestation.name}</span>
                                            <div className="flex flex-wrap items-center gap-2 sm:space-x-3">
                                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 text-xs sm:text-sm p-1 sm:p-2" onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditPrestation(prestation);
                                                }}>
                                                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                                                    <span className="hidden sm:inline">Editer</span>
                                                </Button>
                                                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                                    <Switch
                                                        checked={prestation.active}
                                                        onCheckedChange={() => handleToggleActive(prestation.id)}
                                                    />
                                                    <span className="text-xs sm:text-sm text-gray-600">Activer</span>
                                                </div>
                                                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 text-xs sm:text-sm p-1 sm:p-2" onClick={(e) => e.stopPropagation()}>
                                                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                                                    <span className="hidden sm:inline">Supprimer</span>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Bouton Ajouter */}
                                    <div className="flex justify-end mt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsAddServiceModalOpen(true)}
                                            className="text-sm hover:bg-green-50"
                                            style={{ color: '#3A7B59', borderColor: '#3A7B59' }}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            <span className="hidden sm:inline">Ajouter une prestation</span>
                                            <span className="sm:hidden">Ajouter</span>
                                        </Button>
                                    </div>
                                </div>

                                {/* Preview de la prestation sélectionnée */}
                                {selectedPrestation && (
                                    <div className="border border-gray-200 rounded-lg p-4 lg:p-6 bg-white">
                                        <h4 className="text-base lg:text-lg font-semibold mb-4">Aperçu de la prestation</h4>
                                        {(() => {
                                            const prestation = prestations.find(p => p.id.toString() === selectedPrestation);
                                            if (!prestation) return null;
                                            return (
                                                <div className="space-y-4">
                                                    <div>
                                                        <h5 className="font-medium text-gray-900 text-sm lg:text-base">{prestation.name}</h5>
                                                        <p className="text-xs lg:text-sm text-gray-600 mt-1">{prestation.description}</p>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-4 border-t border-gray-100 gap-2">
                                                        <span className="text-lg font-semibold" style={{ color: '#3A7B59' }}>{prestation.price}</span>
                                                        <span className="text-xs lg:text-sm text-gray-500">Durée: {prestation.duration}</span>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button 
                        className="w-full sm:w-auto px-6 lg:px-8 text-white hover:opacity-90"
                        style={{ backgroundColor: '#3A7B59' }}
                    >
                        Enregistrer les modifications
                    </Button>
                </div>
            </div>

            <AddServiceModal
                isOpen={isAddServiceModalOpen}
                onClose={() => setIsAddServiceModalOpen(false)}
            />

            <EditServiceModal
                isOpen={isEditServiceModalOpen}
                onClose={() => setIsEditServiceModalOpen(false)}
                prestation={editingPrestation}
                onSave={handleSavePrestation}
            />
        </UserDashboardLayout>
    )
}