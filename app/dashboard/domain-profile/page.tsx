'use client'

import UserDashboardLayout from "@/components/userDashboard/UserDashboardLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image, Camera, Plus, Edit, Trash2, Loader2, Code, CalendarIcon, X } from "lucide-react";
import { AddServiceModal } from "@/components/AddServiceModal";
import { EditServiceModal } from "@/components/EditServiceModal";
import { PrestationScheduleConfig } from "@/components/PrestationScheduleConfig";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { userService, DomainProfile, DomainService } from "@/services/user.service";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

// Extended interface for enhanced booking features
interface EnhancedDomainService extends DomainService {
    id?: number;
    active?: boolean;
    periodActive?: boolean;
    selectedDates?: Date[];
    hasChanges?: boolean;
    originalBookingSettings?: {
        bookingRestrictionActive: boolean;
        bookingRestrictionTime: string;
        multipleBookings: boolean;
        hasCustomAvailability: boolean;
        dateAvailability: any[];
    };
}

export default function UserDomainProfile() {
    const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
    const [selectedPrestation, setSelectedPrestation] = useState<string | null>(null);
    const [isEditServiceModalOpen, setIsEditServiceModalOpen] = useState(false);
    const [editingPrestation, setEditingPrestation] = useState<any>(null);
    const [domainProfile, setDomainProfile] = useState<DomainProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // New state variables for enhanced functionality
    const [lastClickedDate, setLastClickedDate] = useState<{ [key: string]: Date | null }>({});
    const [isShiftPressed, setIsShiftPressed] = useState(false);
    const [serviceSchedules, setServiceSchedules] = useState<{ [serviceId: string]: any }>({});
    const [savingServices, setSavingServices] = useState<{ [serviceId: string]: boolean }>({});

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
    const [services, setServices] = useState<EnhancedDomainService[]>([]);

    // Load domain profile data on mount
    useEffect(() => {
        loadDomainProfile();
    }, []);

    // Keyboard event handler for Shift key detection
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Shift') setIsShiftPressed(true);
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === 'Shift') setIsShiftPressed(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
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

            // Load services separately and initialize original settings
            const servicesResponse = await userService.getServices();
            const servicesWithOriginalSettings = (servicesResponse.data || []).map((service: DomainService) => {
                // Determine if API already has custom availability
                const availability = service.dateAvailability as any;
                console.log(`Service "${service.serviceName}" API availability:`, JSON.stringify(availability, null, 2));
                const hasAvailability = Array.isArray(availability)
                    ? availability.length > 0
                    : availability && typeof availability === 'object'
                        ? Object.keys(availability).length > 0
                        : false;

                // Auto-select dates from API availability
                let selectedDates: Date[] = [];
                if (Array.isArray(availability)) {
                    selectedDates = availability
                        .filter((a: any) => a?.date && !isNaN(new Date(a.date).getTime()))
                        .map((a: any) => new Date(a.date));
                } else if (availability && typeof availability === 'object') {
                    selectedDates = Object.keys(availability)
                        .filter((d) => d && !isNaN(new Date(d).getTime()))
                        .map((d) => new Date(d));
                }

                const computedHasCustom = service.hasCustomAvailability ?? hasAvailability;

                return {
                    ...service,
                    // Ensure UI has dates preselected so Calendar and Schedule render
                    selectedDates,
                    // Ensure the toggle reflects API data
                    hasCustomAvailability: computedHasCustom,
                    hasChanges: false,
                    originalBookingSettings: {
                        bookingRestrictionActive: service.bookingRestrictionActive ?? false,
                        bookingRestrictionTime: service.bookingRestrictionTime ?? "24h",
                        multipleBookings: service.multipleBookings ?? false,
                        hasCustomAvailability: computedHasCustom,
                        dateAvailability: service.dateAvailability ?? []
                    }
                } as EnhancedDomainService;
            });
            setServices(servicesWithOriginalSettings as EnhancedDomainService[]);

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

    // Track changes in booking settings
    const updateServiceBookingSettings = (serviceId: string, field: keyof EnhancedDomainService, value: any) => {
        // Skip change detection for selectedDates as it's not a booking setting
        if (field === 'selectedDates') {
            updateSelectedDates(serviceId, value);
            return;
        }

        setServices(prevServices => 
            prevServices.map(service => {
                if (service._id === serviceId) {
                    const originalSettings = service.originalBookingSettings || {
                        bookingRestrictionActive: service.bookingRestrictionActive ?? false,
                        bookingRestrictionTime: service.bookingRestrictionTime ?? "24h",
                        multipleBookings: service.multipleBookings ?? false,
                        hasCustomAvailability: service.hasCustomAvailability ?? false,
                        dateAvailability: service.dateAvailability ?? []
                    };

                    const updatedService = {
                        ...service,
                        [field]: value,
                        originalBookingSettings: originalSettings
                    };

                    // Check if any changes were made
                    const currentDateAvailability = updatedService.dateAvailability || {};
                    const originalDateAvailability = originalSettings.dateAvailability || {};
                    
                    const hasChanges = (
                        updatedService.bookingRestrictionActive !== originalSettings.bookingRestrictionActive ||
                        updatedService.bookingRestrictionTime !== originalSettings.bookingRestrictionTime ||
                        updatedService.multipleBookings !== originalSettings.multipleBookings ||
                        updatedService.hasCustomAvailability !== originalSettings.hasCustomAvailability ||
                        JSON.stringify(currentDateAvailability) !== JSON.stringify(originalDateAvailability)
                    );

                    updatedService.hasChanges = hasChanges;
                    return updatedService;
                }
                return service;
            })
        );
    };

    // Update selected dates without triggering change detection for booking settings
    const updateSelectedDates = (serviceId: string, selectedDates: Date[]) => {
        setServices(prevServices => 
            prevServices.map(service => {
                if (service._id === serviceId) {
                    return {
                        ...service,
                        selectedDates: selectedDates
                    };
                }
                return service;
            })
        );
    };

    // Save service booking settings
    const saveServiceBookingSettings = async (service: EnhancedDomainService) => {
        console.log('saveServiceBookingSettings called for service:', service._id, service.serviceName);
        if (!service.hasChanges || savingServices[service._id!]) return;

        setSavingServices(prev => ({ ...prev, [service._id!]: true }));

        try {
            // Convert day-based schedules to actual date-based availability for API
            let dateAvailability = [];
            if (service.dateAvailability && service.selectedDates) {
                if (Array.isArray(service.dateAvailability)) {
                    // Already in correct format, just ensure dates are strings
                    dateAvailability = service.dateAvailability.map((item: any) => ({
                        ...item,
                        date: item.date instanceof Date ? item.date.toISOString().split('T')[0] : item.date
                    }));
                } else if (typeof service.dateAvailability === 'object') {
                    // Convert day-based schedules to date-based schedules
                    const daySchedules = service.dateAvailability;
                    dateAvailability = [];
                    
                    // Map each selected date to its corresponding day schedule
                    service.selectedDates.forEach((date: Date) => {
                        const dayName = format(date, "EEEE", { locale: fr });
                        const daySchedule = daySchedules[dayName] as any;
                        
                        if (daySchedule) {
                            dateAvailability.push({
                                date: date.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
                                enabled: daySchedule.enabled ?? true,
                                morningEnabled: daySchedule.morningEnabled ?? false,
                                morningFrom: daySchedule.morningFrom ?? "09:00",
                                morningTo: daySchedule.morningTo ?? "12:00",
                                afternoonEnabled: daySchedule.afternoonEnabled ?? false,
                                afternoonFrom: daySchedule.afternoonFrom ?? "14:00",
                                afternoonTo: daySchedule.afternoonTo ?? "18:00"
                            });
                        }
                    });
                }
            }

            const bookingSettings = {
                bookingRestrictionActive: service.bookingRestrictionActive ?? false,
                bookingRestrictionTime: service.bookingRestrictionTime ?? "24h",
                multipleBookings: service.multipleBookings ?? false,
                hasCustomAvailability: service.hasCustomAvailability ?? false,
                dateAvailability
            };

            console.log('Sending booking settings to API:', bookingSettings);

            await userService.updateServiceBookingSettings(service._id!, bookingSettings);
            
            // Update the original settings and clear changes flag
            setServices(prevServices =>
                prevServices.map(s => {
                    if (s._id === service._id) {
                        return {
                            ...s,
                            hasChanges: false,
                            originalBookingSettings: {
                                bookingRestrictionActive: s.bookingRestrictionActive ?? false,
                                bookingRestrictionTime: s.bookingRestrictionTime ?? "24h",
                                multipleBookings: s.multipleBookings ?? false,
                                hasCustomAvailability: s.hasCustomAvailability ?? false,
                                dateAvailability: s.dateAvailability ?? []
                            }
                        };
                    }
                    return s;
                })
            );

            toast.success(`Booking settings saved for ${service.serviceName}`);
        } catch (error) {
            console.error('Error saving booking settings:', error);
            toast.error(`Failed to save booking settings for ${service.serviceName}`);
        } finally {
            setSavingServices(prev => ({ ...prev, [service._id!]: false }));
        }
    };

        const prestations = services.map((service, index) => {
        // Extract dates from dateAvailability if selectedDates is not set
        let selectedDates = service.selectedDates || [];
        

        
        if ((!selectedDates || selectedDates.length === 0) && service.dateAvailability) {
            if (Array.isArray(service.dateAvailability)) {
                selectedDates = service.dateAvailability
                    .filter((avail: any) => avail.date && !isNaN(new Date(avail.date).getTime()))
                    .map((avail: any) => new Date(avail.date));
            } else if (typeof service.dateAvailability === 'object') {
                // Handle object format: convert keys to dates
                selectedDates = Object.keys(service.dateAvailability)
                    .filter(dateKey => dateKey && !isNaN(new Date(dateKey).getTime()))
                    .map(dateKey => new Date(dateKey));
            }
        }

        return {
            id: service._id,
            name: service.serviceName,
            description: service.serviceDescription,
            price: `${service.pricePerPerson}€`,
            duration: `${Math.floor(service.timeOfServiceInMinutes / 60)}h${service.timeOfServiceInMinutes % 60 > 0 ? (service.timeOfServiceInMinutes % 60) + 'min' : ''}`,
            active: service.isActive,
            serviceBannerUrl: service.serviceBannerUrl,
            // New properties for enhanced functionality
            periodActive: service.hasCustomAvailability || selectedDates.length > 0,
            hasCustomAvailability: service.hasCustomAvailability || false,
            multipleBookings: service.multipleBookings || false,
            bookingRestrictionActive: service.bookingRestrictionActive || false,
            bookingRestrictionTime: service.bookingRestrictionTime || "24h",
            selectedDates: selectedDates
        };
    });

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

    const handleToggleActive = async (prestationId: string) => {
        try {
            const serviceIndex = services.findIndex(s => s._id === prestationId);
            if (serviceIndex === -1) return;
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

    const handleCopyIframeCode = async (prestationId: string) => {
        try {
            const service = services.find(s => s._id === prestationId);

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

    // New handlers for enhanced functionality
    const handleTogglePeriod = (prestationId: string) => {
        const service = services.find(s => s._id === prestationId);
        if (service) {
            updateServiceBookingSettings(prestationId, 'hasCustomAvailability', !service.hasCustomAvailability);
        }
    };

    const handleToggleMultipleBookings = (prestationId: string) => {
        const service = services.find(s => s._id === prestationId);
        if (service) {
            updateServiceBookingSettings(prestationId, 'multipleBookings', !service.multipleBookings);
        }
    };

    const handleToggleBookingRestriction = (prestationId: string) => {
        const service = services.find(s => s._id === prestationId);
        if (service) {
            updateServiceBookingSettings(prestationId, 'bookingRestrictionActive', !service.bookingRestrictionActive);
        }
    };

    const handleBookingRestrictionTimeChange = (prestationId: string, time: string) => {
        updateServiceBookingSettings(prestationId, 'bookingRestrictionTime', time);
    };

    const handleDateSelect = (prestationId: string, date: Date, e: React.MouseEvent) => {
        const service = services.find(s => s._id === prestationId);
        if (!service) return;

        const existingDates = service.selectedDates || [];
        let newDates: Date[];

        if (e.shiftKey && lastClickedDate[prestationId]) {
            // Range selection
            const startDate = lastClickedDate[prestationId]!;
            const endDate = date;
            const range: Date[] = [];
            for (let d = new Date(Math.min(startDate.getTime(), endDate.getTime()));
                d <= new Date(Math.max(startDate.getTime(), endDate.getTime()));
                d.setDate(d.getDate() + 1)) {
                range.push(new Date(d));
            }

            // Check if we're removing (if all dates in range are selected) or adding
            const isRemoving = existingDates.some((d: Date) =>
                range.some(rangeDate => rangeDate.toDateString() === d.toDateString())
            );

            if (isRemoving) {
                // Remove all dates in range
                newDates = existingDates.filter((d: Date) =>
                    !range.some(rangeDate => rangeDate.toDateString() === d.toDateString())
                );
            } else {
                // Add all dates in range that aren't already selected
                newDates = [...existingDates, ...range.filter(rangeDate =>
                    !existingDates.some((d: Date) => d.toDateString() === rangeDate.toDateString())
                )];
            }

            setServices(prevServices =>
                prevServices.map(s =>
                    s._id === prestationId
                        ? { ...s, selectedDates: newDates }
                        : s
                )
            );
        } else {
            // Single date selection
            const dateExists = existingDates.some((d: Date) => d.toDateString() === date.toDateString());
            newDates = dateExists
                ? existingDates.filter((d: Date) => d.toDateString() !== date.toDateString())
                : [...existingDates, date];

            setServices(prevServices =>
                prevServices.map(s =>
                    s._id === prestationId
                        ? { ...s, selectedDates: newDates }
                        : s
                )
            );
        }

        setLastClickedDate(prev => ({ ...prev, [prestationId]: date }));
    };

    const handleRemoveDate = (prestationId: string, dateToRemove: Date) => {
        setServices(prevServices =>
            prevServices.map(service =>
                service._id === prestationId
                    ? {
                        ...service,
                        selectedDates: service.selectedDates?.filter(
                            date => date.getTime() !== dateToRemove.getTime()
                        ) || []
                    }
                    : service
            )
        );
        toast.success('Date supprimée');
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
                                                <div key={prestation.id} className="border rounded-lg bg-white">
                                                    <div
                                                        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 cursor-pointer transition-colors ${selectedPrestation === prestation.id.toString()
                                                            ? 'bg-green-50'
                                                            : 'hover:bg-gray-50'
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
                                                            {/* Save Button - Show when changes are detected */}
                                                            {services.find(s => s._id === prestation.id)?.hasChanges && (
                                                                <Button 
                                                                    size="sm" 
                                                                    className="text-white text-xs sm:text-sm p-1 sm:p-2"
                                                                    style={{ backgroundColor: '#3A7B59' }}
                                                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d5f43'}
                                                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3A7B59'}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        console.log('Save button clicked for prestation:', prestation.id, prestation.name);
                                                                        const service = services.find(s => s._id === prestation.id);
                                                                        console.log('Found service:', service?._id, service?.serviceName);
                                                                        if (service) {
                                                                            saveServiceBookingSettings(service);
                                                                        }
                                                                    }}
                                                                    disabled={savingServices[prestation.id]}
                                                                >
                                                                    {savingServices[prestation.id] ? (
                                                                        <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                                                                    ) : (
                                                                        <span className="hidden sm:inline">Sauvegarder</span>
                                                                    )}
                                                                </Button>
                                                            )}
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
                                                                    const serviceIndex = services.findIndex(s => s._id === prestation.id);
                                                                    if (serviceIndex !== -1) {
                                                                        handleDeleteService(serviceIndex);
                                                                    }
                                                                }
                                                            }}>
                                                                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                                                                <span className="hidden sm:inline">Supprimer</span>
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* NEW: Enhanced Settings Section */}
                                                    <div className="p-3 border-t border-gray-100" onClick={(e) => e.stopPropagation()}>
                                                        <div className="space-y-3 mb-3">
                                                            {/* Booking Restrictions */}
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium text-gray-700">Restrictions de réservations</span>
                                                                <div className="flex items-center space-x-2">
                                                                    <Switch
                                                                        checked={prestation.bookingRestrictionActive}
                                                                        onCheckedChange={() => handleToggleBookingRestriction(prestation.id)}
                                                                    />
                                                                    <span className="text-sm text-gray-600">Activer</span>
                                                                </div>
                                                            </div>
                                                            {prestation.bookingRestrictionActive && (
                                                                <div className="ml-4 mt-2">
                                                                    <Select
                                                                        value={prestation.bookingRestrictionTime}
                                                                        onValueChange={(value) => handleBookingRestrictionTimeChange(prestation.id, value)}
                                                                    >
                                                                        <SelectTrigger className="w-[180px]">
                                                                            <SelectValue placeholder="Sélectionner" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="24h">24h</SelectItem>
                                                                            <SelectItem value="48h">48h</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            )}
                                                            
                                                            {/* Multiple Bookings */}
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium text-gray-700">Réservations multiples par créneau</span>
                                                                <div className="flex items-center space-x-2">
                                                                    <Switch
                                                                        checked={prestation.multipleBookings}
                                                                        onCheckedChange={() => handleToggleMultipleBookings(prestation.id)}
                                                                    />
                                                                    <span className="text-sm text-gray-600">Activer</span>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Period Availability */}
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium text-gray-700">Période de disponibilité</span>
                                                                <div className="flex items-center space-x-2">
                                                                    <Switch
                                                                        checked={services.find(s => s._id === prestation.id)?.hasCustomAvailability || false}
                                                                        onCheckedChange={() => handleTogglePeriod(prestation.id)}
                                                                    />
                                                                    <span className="text-sm text-gray-600">Activer</span>
                                                                </div>
                                                            </div>
                                                        </div>


                                                        
                                                        {/* NEW: Date Selection Section */}
                                                        {services.find(s => s._id === prestation.id)?.hasCustomAvailability && (
                                                            <div className="space-y-3">
                                                                <div className="space-y-2">
                                                                    <Label className="text-xs text-gray-600">
                                                                        Sélectionnez les dates disponibles
                                                                    </Label>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        Cliquez pour sélectionner des dates individuelles. Maintenez Shift et cliquez pour sélectionner une plage.
                                                                    </p>
                                                                    <Popover>
                                                                        <PopoverTrigger asChild>
                                                                            <Button
                                                                                variant="outline"
                                                                                className={cn(
                                                                                    "w-full justify-start text-left font-normal",
                                                                                    !prestation.selectedDates.length && "text-muted-foreground"
                                                                                )}
                                                                            >
                                                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                                                {prestation.selectedDates.length > 0 
                                                                                    ? `${prestation.selectedDates.length} date${prestation.selectedDates.length > 1 ? 's' : ''} sélectionnée${prestation.selectedDates.length > 1 ? 's' : ''}`
                                                                                    : <span>Sélectionner des dates</span>
                                                                                }
                                                                            </Button>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-auto p-0" align="start">
                                                                            <Calendar
                                                                                mode="multiple"
                                                                                selected={prestation.selectedDates}
                                                                                onSelect={(dates) => {
                                                                                    if (dates) {
                                                                                        const selectedDates = Array.isArray(dates) ? dates : [dates];
                                                                                        updateSelectedDates(prestation.id, selectedDates);
                                                                                    }
                                                                                }}
                                                                                initialFocus
                                                                                className="pointer-events-auto"
                                                                            />
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </div>
                                                                {prestation.selectedDates.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto">
                                                                        {prestation.selectedDates
                                                                            .sort((a, b) => a.getTime() - b.getTime())
                                                                            .slice(0, 10)
                                                                            .map((date, idx) => (
                                                                                <span 
                                                                                    key={idx} 
                                                                                    className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded group hover:bg-green-200 transition-colors"
                                                                                >
                                                                                    {format(date, "dd/MM/yy", { locale: fr })}
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.stopPropagation();
                                                                                            handleRemoveDate(prestation.id, date);
                                                                                        }}
                                                                                        className="hover:bg-green-300 rounded-full p-0.5 transition-colors"
                                                                                        aria-label="Supprimer cette date"
                                                                                    >
                                                                                        <X className="h-3 w-3" />
                                                                                    </button>
                                                                                </span>
                                                                            ))}
                                                                        {prestation.selectedDates.length > 10 && (
                                                                            <span className="text-xs text-muted-foreground px-2 py-1">
                                                                                +{prestation.selectedDates.length - 10} autres
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                
                                                                {prestation.selectedDates.length > 0 && (
                                                                    <div className="border-t pt-4 mt-4">
                                                                        <PrestationScheduleConfig 
                                                                            selectedDates={prestation.selectedDates}
                                                                            existingAvailability={(() => {
                                                                                const service = services.find(s => s._id === prestation.id);
                                                                                const availability = service?.dateAvailability || [];

                                                                                if (Array.isArray(availability)) {
                                                                                    // Validate array items have valid dates
                                                                                    return availability.filter(item => 
                                                                                        item && item.date && !isNaN(new Date(item.date).getTime())
                                                                                    );
                                                                                }
                                                                                if (availability && typeof availability === 'object') {
                                                                                    return Object.entries(availability)
                                                                                        .filter(([date, config]) => date && !isNaN(new Date(date).getTime()))
                                                                                        .map(([date, config]) => ({ 
                                                                                            date, 
                                                                                            ...(config && typeof config === 'object' ? config as any : {})
                                                                                        }));
                                                                                }
                                                                                return [];
                                                                            })()}
                                                                            onChange={(schedules) => {
                                                                                // Update service with new schedule data
                                                                                updateServiceBookingSettings(prestation.id, 'dateAvailability', schedules);
                                                                                // Only update hasCustomAvailability if there are actual enabled schedules
                                                                                const hasEnabledSchedules = Object.values(schedules).some((schedule: any) => 
                                                                                    schedule.enabled && (schedule.morningEnabled || schedule.afternoonEnabled)
                                                                                );
                                                                                if (hasEnabledSchedules) {
                                                                                    updateServiceBookingSettings(prestation.id, 'hasCustomAvailability', true);
                                                                                }
                                                                            }}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
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