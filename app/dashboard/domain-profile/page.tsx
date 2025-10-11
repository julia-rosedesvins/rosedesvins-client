'use client'

import UserDashboardLayout from "@/components/userDashboard/UserDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image, Camera, Plus, Edit, Trash2, Loader2, Code } from "lucide-react";
import { AddServiceModal } from "@/components/AddServiceModal";
import { EditServiceModal } from "@/components/EditServiceModal";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { userService, DomainProfile, DomainService } from "@/services/user.service";
import toast from "react-hot-toast";

export default function UserDomainProfile() {
    const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
    const [selectedPrestation, setSelectedPrestation] = useState<string | null>(null);
    const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
    const [editingPrestation, setEditingPrestation] = useState<any>(null);
    const [domainProfile, setDomainProfile] = useState<DomainProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        domainName: '',
        domainDescription: '',
        domainType: '',
        domainTag: '',
        domainColor: '#3A7B59'
    });
    const [domainProfilePicture, setDomainProfilePicture] = useState<File | null>(null);
    const [domainLogo, setDomainLogo] = useState<File | null>(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [services, setServices] = useState<DomainService[]>([]);

    // Load domain profile data on mount
    useEffect(() => {
        loadDomainProfile();
    }, []);

    const loadDomainProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Load domain profile data
            const profileResponse = await userService.getDomainProfile();
            if (profileResponse.data) {
                setDomainProfile(profileResponse.data);
                setFormData({
                    domainName: profileResponse.data.userId.domainName || '',
                    domainDescription: profileResponse.data.domainDescription || '',
                    domainType: profileResponse.data.domainType || '',
                    domainTag: profileResponse.data.domainTag || '',
                    domainColor: profileResponse.data.colorCode || '#3A7B59'
                });

                // Set existing image previews if available
                if (profileResponse.data.domainProfilePictureUrl) {
                    setProfilePicturePreview(`${process.env.NEXT_PUBLIC_API_BASE_URL}${profileResponse.data.domainProfilePictureUrl}`);
                }
                if (profileResponse.data.domainLogoUrl) {
                    setLogoPreview(`${process.env.NEXT_PUBLIC_API_BASE_URL}${profileResponse.data.domainLogoUrl}`);
                }
            }

            // Load services separately
            const servicesResponse = await userService.getServices();
            setServices(servicesResponse.data || []);

        } catch (error: any) {
            console.error('Error loading domain profile:', error);
            if (error.statusCode !== 404) {
                setError('Failed to load domain profile');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFileChange = (field: 'domainProfilePicture' | 'domainLogo', file: File | null) => {
        if (field === 'domainProfilePicture') {
            setDomainProfilePicture(file);
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setProfilePicturePreview(e.target?.result as string);
                };
                reader.readAsDataURL(file);
                toast.success(`Nouvelle photo sélectionnée: ${file.name}`);
            } else {
                setProfilePicturePreview(null);
            }
        } else {
            setDomainLogo(file);
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setLogoPreview(e.target?.result as string);
                };
                reader.readAsDataURL(file);
                toast.success(`Nouveau logo sélectionné: ${file.name}`);
            } else {
                setLogoPreview(null);
            }
        }
    };

    const handleSubmit = async () => {
        try {
            setIsSaving(true);
            setError(null);

            const files = {
                ...(domainProfilePicture && { domainProfilePicture }),
                ...(domainLogo && { domainLogo })
            };

            const response = await userService.createOrUpdateDomainProfile(
                formData, // Only send form data, services are managed separately
                Object.keys(files).length > 0 ? files : undefined
            );

            setDomainProfile(response.data.domainProfile);

            // Clear file inputs but keep previews updated with new URLs
            setDomainProfilePicture(null);
            setDomainLogo(null);

            // Update previews with new URLs if uploaded
            if (response.data.domainProfile.domainProfilePictureUrl) {
                setProfilePicturePreview(`${process.env.NEXT_PUBLIC_API_BASE_URL}${response.data.domainProfile.domainProfilePictureUrl}`);
            }
            if (response.data.domainProfile.domainLogoUrl) {
                setLogoPreview(`${process.env.NEXT_PUBLIC_API_BASE_URL}${response.data.domainProfile.domainLogoUrl}`);
            }

            // Clear HTML file inputs
            const profileInput = document.getElementById('photo-profil') as HTMLInputElement;
            const logoInput = document.getElementById('logo-domaine') as HTMLInputElement;
            if (profileInput) profileInput.value = '';
            if (logoInput) logoInput.value = '';

            // Show success message
            toast.success(response.message);
        } catch (error: any) {
            console.error('Error saving domain profile:', error);
            setError(error?.message || 'Failed to save domain profile');
            toast.error(error?.message || 'Failed to save domain profile');
        } finally {
            setIsSaving(false);
        }
    };

    const prestations = services.map((service, index) => ({
        id: index + 1,
        name: service.serviceName,
        description: service.serviceDescription,
        price: `${service.pricePerPerson}€`,
        duration: `${Math.floor(service.timeOfServiceInMinutes / 60)}h${service.timeOfServiceInMinutes % 60 > 0 ? (service.timeOfServiceInMinutes % 60) + 'min' : ''}`,
        active: service.isActive,
        serviceBannerUrl: service.serviceBannerUrl
    }));

    const handleEditPrestation = (prestation: any) => {
        const serviceIndex = prestation.id - 1;
        const service = services[serviceIndex];

        // Map languages from service data to UI format
        const languagesState = {
            francais: false,
            anglais: false,
            allemand: false,
            espagnol: false,
            autre: false
        };

        let otherLanguage = "";

        if (service.languagesOffered) {
            service.languagesOffered.forEach((lang: string) => {
                switch (lang.toLowerCase()) {
                    case 'french':
                        languagesState.francais = true;
                        break;
                    case 'english':
                        languagesState.anglais = true;
                        break;
                    case 'german':
                        languagesState.allemand = true;
                        break;
                    case 'spanish':
                        languagesState.espagnol = true;
                        break;
                    default:
                        languagesState.autre = true;
                        otherLanguage = lang;
                        break;
                }
            });
        }

        // Create enhanced prestation object with all needed data
        const enhancedPrestation = {
            ...prestation,
            originalIndex: serviceIndex,
            numberOfPeople: service.numberOfPeople,
            winesTasted: service.numberOfWinesTasted.toString(),
            languages: languagesState,
            otherLanguage: otherLanguage
        };

        setEditingPrestation(enhancedPrestation);
        setIsEditServiceModalOpen(true);
    };

    const handleAddService = async (newService: any, serviceBanner?: File | null) => {
        try {
            // The modal already sends data in the correct format, so use it directly
            const service: DomainService = {
                _id: newService._id || '',
                serviceName: newService.serviceName || '',
                serviceDescription: newService.serviceDescription || '',
                numberOfPeople: newService.numberOfPeople || '1',
                pricePerPerson: newService.pricePerPerson || 0,
                timeOfServiceInMinutes: newService.timeOfServiceInMinutes || 60,
                numberOfWinesTasted: newService.numberOfWinesTasted || 0,
                languagesOffered: newService.languagesOffered || ['French'],
                isActive: newService.isActive !== undefined ? newService.isActive : true
            };

            const response = await userService.addService(service, serviceBanner || undefined);

            // Reload services to get updated list
            const servicesResponse = await userService.getServices();
            setServices(servicesResponse.data || []);

            setIsAddServiceModalOpen(false);
            toast.success('Service added successfully!');
        } catch (error: any) {
            console.error('Error adding service:', error);
            toast.error(error.message || 'Failed to add service');
        }
    };

    const handleSavePrestation = async (updatedService: any, serviceBanner?: File | null) => {
        try {
            if (updatedService.originalIndex !== undefined) {
                const updateData = {
                    serviceName: updatedService.serviceName || '',
                    serviceDescription: updatedService.serviceDescription || '',
                    numberOfPeople: updatedService.numberOfPeople || '1',
                    pricePerPerson: updatedService.pricePerPerson || 0,
                    timeOfServiceInMinutes: updatedService.timeOfServiceInMinutes || 60,
                    numberOfWinesTasted: updatedService.numberOfWinesTasted || 0,
                    languagesOffered: updatedService.languagesOffered || ['French'],
                    isActive: updatedService.isActive !== undefined ? updatedService.isActive : true
                };

                await userService.updateService(updatedService.originalIndex, updateData, serviceBanner || undefined);

                // Reload services to get updated list
                const servicesResponse = await userService.getServices();
                setServices(servicesResponse.data || []);

                toast.success('Service updated successfully!');
            }
        } catch (error: any) {
            console.error('Error updating service:', error);
            toast.error(error.message || 'Failed to update service');
        }
    };

    const handleToggleActive = async (prestationId: number) => {
        try {
            const serviceIndex = prestationId - 1;
            await userService.toggleServiceActive(serviceIndex);

            // Reload services to get updated list
            const servicesResponse = await userService.getServices();
            setServices(servicesResponse.data || []);
            toast.success('Service status updated successfully!');
        } catch (error: any) {
            console.error('Error toggling service status:', error);
            toast.error(error.message || 'Failed to update service status');
        }
    };

    const handleDeleteService = async (serviceIndex: number) => {
        try {
            await userService.deleteService(serviceIndex);

            // Reload services to get updated list
            const servicesResponse = await userService.getServices();
            setServices(servicesResponse.data || []);

            toast.success('Service deleted successfully!');
        } catch (error: any) {
            console.error('Error deleting service:', error);
            toast.error(error.message || 'Failed to delete service');
        }
    };

    const handleCopyIframeCode = async (prestationId: number) => {
        try {
            const serviceIndex = prestationId - 1;
            const service = services[serviceIndex];

            if (!service || !domainProfile?.userId?._id) {
                toast.error('Informations du service manquantes');
                return;
            }

            // Get the current hostname or use localhost as fallback
            const hostname = window.location.hostname === 'localhost'
                ? 'http://localhost:3000'
                : `${window.location.protocol}//${window.location.host}`;

            const userId = domainProfile.userId._id;
            const serviceId = service._id; // Use service._id if available, otherwise fallback to index

            const iframeCode = `
            <div style="width: 100%; margin: 0 auto; position: relative; overflow: hidden; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <iframe src="${hostname}/if/booking-widget/${userId}/${serviceId}/reservation"
            style="width: 100%; height: 800px; border: none; display: block; background: white;"
            frameborder="0"
            scrolling="auto"
            allowfullscreen
            ></iframe>
            </div>
            `;

            await navigator.clipboard.writeText(iframeCode);
            toast.success('Code iframe copié dans le presse-papiers !');
        } catch (error) {
            console.error('Error copying iframe code:', error);
            toast.error('Erreur lors de la copie du code iframe');
        }
    };
    return (
        <UserDashboardLayout title="Profil Domaine">
            <div className="mx-auto space-y-4 lg:space-y-6">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">Profil du domaine</h1>
                    <p className="text-sm lg:text-base text-muted-foreground">Gérez les informations liées à votre profil.</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="ml-2">Chargement du profil...</span>
                    </div>
                ) : (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg lg:text-xl">Informations générales</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                                        {error}
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="nom-domaine" className="text-sm font-medium">Nom du domaine</Label>
                                    <Input
                                        id="nom-domaine"
                                        placeholder="Ex: Château de la Rose"
                                        value={formData.domainName}
                                        onChange={(e) => handleInputChange('domainName', e.target.value)}
                                        className="mt-1"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Décrivez votre domaine viticole..."
                                        value={formData.domainDescription}
                                        onChange={(e) => handleInputChange('domainDescription', e.target.value)}
                                        rows={4}
                                        className="mt-1"
                                        disabled={isLoading}
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
                                            {(profilePicturePreview || (domainProfile?.domainProfilePictureUrl && !domainProfilePicture)) ? (
                                                <div className="relative">
                                                    <img
                                                        src={profilePicturePreview || `http://localhost:5001${domainProfile?.domainProfilePictureUrl}`}
                                                        alt="Profile preview"
                                                        className="w-32 h-32 object-cover rounded-lg mx-auto mb-2"
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            // Trigger file input to select new image
                                                            const input = document.getElementById('photo-profil') as HTMLInputElement;
                                                            if (input) input.click();
                                                        }}
                                                        className="mt-2"
                                                    >
                                                        <Camera className="h-4 w-4 mr-2" />
                                                        Changer la photo
                                                    </Button>
                                                    <p className="text-xs text-gray-600 mt-2">
                                                        {domainProfilePicture ? (
                                                            <span className="text-orange-600 font-medium">
                                                                ⚠️ Nouveau: {domainProfilePicture.name} (non sauvegardé)
                                                            </span>
                                                        ) : 'Photo actuelle'}
                                                    </p>
                                                </div>
                                            ) : (
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
                                            )}
                                            <input
                                                id="photo-profil"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] || null;
                                                    handleFileChange('domainProfilePicture', file);
                                                }}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    {/* Logo du domaine */}
                                    <div className="space-y-4">
                                        <Label htmlFor="logo-domaine" className="text-sm font-medium">Logo du domaine</Label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 lg:p-6 text-center hover:border-gray-400 transition-colors">
                                            {(logoPreview || (domainProfile?.domainLogoUrl && !domainLogo)) ? (
                                                <div className="relative">
                                                    <img
                                                        src={logoPreview || `http://localhost:5001${domainProfile?.domainLogoUrl}`}
                                                        alt="Logo preview"
                                                        className="w-32 h-32 object-cover rounded-lg mx-auto mb-2"
                                                    />
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            // Trigger file input to select new logo
                                                            const input = document.getElementById('logo-domaine') as HTMLInputElement;
                                                            if (input) input.click();
                                                        }}
                                                        className="mt-2"
                                                    >
                                                        <Image className="h-4 w-4 mr-2" />
                                                        Changer le logo
                                                    </Button>
                                                    <p className="text-xs text-gray-600 mt-2">
                                                        {domainLogo ? (
                                                            <span className="text-orange-600 font-medium">
                                                                ⚠️ Nouveau: {domainLogo.name} (non sauvegardé)
                                                            </span>
                                                        ) : 'Logo actuel'}
                                                    </p>
                                                </div>
                                            ) : (
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
                                            )}
                                            <input
                                                id="logo-domaine"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] || null;
                                                    handleFileChange('domainLogo', file);
                                                }}
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section Couleurs */}
                                <div className="border-t pt-4 lg:pt-6">
                                    <div className="space-y-4">
                                        <h3 className="text-base lg:text-lg font-semibold">Couleurs</h3>
                                        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                                            {/* <div className="flex-shrink-0 mx-auto sm:mx-0">
                                        <div 
                                            className="w-16 h-16 lg:w-20 lg:h-20 rounded-full border-4 border-gray-200 relative overflow-hidden"
                                            style={{ backgroundColor: formData.domainColor }}
                                        >
                                            <div className="absolute inset-2 bg-white rounded-full border-2 border-gray-300 opacity-20"></div>
                                        </div>
                                    </div> */}
                                            <div className="flex-1 relative">
                                                <Label htmlFor="color-picker" className="text-sm font-medium">Code couleur</Label>
                                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-1">
                                                    <div className="relative flex-shrink-0 order-2 sm:order-1">
                                                        <input
                                                            type="color"
                                                            value={formData.domainColor}
                                                            onChange={(e) => handleInputChange('domainColor', e.target.value)}
                                                            className="w-10 h-10 border-0 rounded cursor-pointer absolute inset-0 opacity-0"
                                                            disabled={isLoading}
                                                            style={{
                                                                zIndex: 10
                                                            }}
                                                        />
                                                        <div
                                                            className="w-10 h-10 border border-gray-300 rounded cursor-pointer flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
                                                            style={{ backgroundColor: formData.domainColor }}
                                                            onClick={() => {
                                                                const colorInput = document.querySelector('input[type="color"]') as HTMLInputElement;
                                                                if (colorInput) {
                                                                    colorInput.click();
                                                                }
                                                            }}
                                                        >
                                                            <div className="w-6 h-6 rounded border border-white/20 bg-white/10"></div>
                                                        </div>
                                                    </div>
                                                    <Input
                                                        id="color-picker"
                                                        type="text"
                                                        value={formData.domainColor}
                                                        onChange={(e) => handleInputChange('domainColor', e.target.value)}
                                                        className="font-mono flex-1 order-1 sm:order-2"
                                                        placeholder="#3A7B59"
                                                        disabled={isLoading}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">Cliquez sur le carré coloré ou tapez directement le code hexadécimal</p>
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
                                                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 text-xs sm:text-sm p-1 sm:p-2" onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCopyIframeCode(prestation.id);
                                                        }}>
                                                            <Code className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                                                            <span className="hidden sm:inline">Code</span>
                                                        </Button>
                                                        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                                            <Switch
                                                                checked={prestation.active}
                                                                onCheckedChange={() => handleToggleActive(prestation.id)}
                                                            />
                                                            <span className="text-xs sm:text-sm text-gray-600">Activer</span>
                                                        </div>
                                                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 text-xs sm:text-sm p-1 sm:p-2" onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (confirm('Are you sure you want to delete this service?')) {
                                                                handleDeleteService(prestation.id - 1);
                                                            }
                                                        }}>
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
                                onClick={handleSubmit}
                                disabled={isLoading || isSaving}
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Enregistrement...
                                    </>
                                ) : (
                                    'Enregistrer les modifications'
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </div>

            <AddServiceModal
                isOpen={isAddServiceModalOpen}
                onClose={() => setIsAddServiceModalOpen(false)}
                onSave={handleAddService}
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