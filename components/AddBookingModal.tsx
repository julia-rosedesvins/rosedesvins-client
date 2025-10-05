'use client'

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Wine, Users, Clock, Mail, Phone, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { bookingService, CreateBookingRequest } from "@/services/booking.service";
import { userService, DomainService } from "@/services/user.service";
import { useUser } from "@/contexts/UserContext";
import toast from "react-hot-toast";

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated?: () => void;
}

export const AddBookingModal = ({ isOpen, onClose, onBookingCreated }: AddBookingModalProps) => {
  const { user } = useUser();
  const [services, setServices] = useState<DomainService[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    serviceId: "",
    bookingDate: undefined as Date | undefined,
    bookingTime: "",
    participantsAdults: 1,
    participantsEnfants: 0,
    selectedLanguage: "",
    userContactFirstname: "",
    userContactLastname: "",
    customerEmail: "",
    phoneNo: "",
    additionalNotes: ""
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Load services when modal opens
  useEffect(() => {
    if (isOpen) {
      loadServices();
    }
  }, [isOpen]);

  const loadServices = async () => {
    try {
      setServicesLoading(true);
      const response = await userService.getServices();
      setServices(response.data || []);
    } catch (error: any) {
      console.error('Failed to load services:', error);
      toast.error('Failed to load services');
    } finally {
      setServicesLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      serviceId: "",
      bookingDate: undefined,
      bookingTime: "",
      participantsAdults: 1,
      participantsEnfants: 0,
      selectedLanguage: "",
      userContactFirstname: "",
      userContactLastname: "",
      customerEmail: "",
      phoneNo: "",
      additionalNotes: ""
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.serviceId) {
      newErrors.serviceId = "Veuillez sélectionner un service";
    }

    if (!formData.bookingDate) {
      newErrors.bookingDate = "Veuillez sélectionner une date";
    }

    if (!formData.bookingTime) {
      newErrors.bookingTime = "Veuillez sélectionner une heure";
    }

    if (formData.participantsAdults < 1) {
      newErrors.participantsAdults = "Au moins un adulte est requis";
    }

    if (formData.participantsEnfants < 0) {
      newErrors.participantsEnfants = "Le nombre d'enfants ne peut pas être négatif";
    }

    if (!formData.selectedLanguage) {
      newErrors.selectedLanguage = "Veuillez sélectionner une langue";
    }

    if (!formData.userContactFirstname.trim()) {
      newErrors.userContactFirstname = "Le prénom est requis";
    }

    if (!formData.userContactLastname.trim()) {
      newErrors.userContactLastname = "Le nom est requis";
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = "Format d'email invalide";
    }

    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = "Le numéro de téléphone est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      if (!user?._id) {
        toast.error('Vous devez être connecté pour créer une réservation');
        return;
      }

      const bookingData: CreateBookingRequest = {
        userId: user._id,
        serviceId: formData.serviceId,
        bookingDate: formData.bookingDate!.toISOString(),
        bookingTime: formData.bookingTime,
        participantsAdults: formData.participantsAdults,
        participantsEnfants: formData.participantsEnfants,
        selectedLanguage: formData.selectedLanguage,
        userContactFirstname: formData.userContactFirstname,
        userContactLastname: formData.userContactLastname,
        customerEmail: formData.customerEmail,
        phoneNo: formData.phoneNo,
        additionalNotes: formData.additionalNotes || undefined,
        paymentMethod: {
          method: 'cash_on_onsite'
        }
      };

      await bookingService.createBooking(bookingData);
      
      toast.success('Réservation créée avec succès!');
      resetForm();
      onClose();
      onBookingCreated?.();
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast.error(error.message || 'Erreur lors de la création de la réservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const selectedService = services.find(service => service._id === formData.serviceId);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-4xl h-[95vh] max-h-[95vh] overflow-hidden flex flex-col rounded-xl shadow-2xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fixed">
        {/* Enhanced Header */}
        <DialogHeader className="relative text-white p-4 sm:p-6 -mx-6 -mt-6 mb-4 sm:mb-6 rounded-t-xl bg-gradient-to-r from-[#3A7B59] to-[#2d5a43] shrink-0">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <Wine className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
            <DialogTitle className="text-lg sm:text-xl font-semibold text-center">
              Ajouter une nouvelle réservation
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-2">
          <div className="space-y-6 sm:space-y-8 w-full max-w-full">
            {/* Service Selection */}
            <div className="space-y-2 w-full">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Wine size={14} className="sm:w-4 sm:h-4 shrink-0" />
                Service *
              </Label>
              <Select
                value={formData.serviceId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, serviceId: value }))}
              >
                <SelectTrigger className={`w-full text-sm sm:text-base border-2 focus:border-[#3A7B59] rounded-lg h-11 sm:h-auto ${errors.serviceId ? 'border-red-300 focus:border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionner un service" />
                </SelectTrigger>
                <SelectContent>
                  {servicesLoading ? (
                    <SelectItem value="loading" disabled>Chargement...</SelectItem>
                  ) : services.length === 0 ? (
                    <SelectItem value="no-services" disabled>Aucun service disponible</SelectItem>
                  ) : (
                    services.map((service) => (
                      <SelectItem key={service._id} value={service._id}>
                        {service.serviceName} - {service.pricePerPerson}€/pers
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {errors.serviceId && <p className="text-red-500 text-xs sm:text-sm">{errors.serviceId}</p>}
            </div>

            {/* Date Selection */}
            <div className="space-y-2 w-full">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <CalendarIcon size={14} className="sm:w-4 sm:h-4 shrink-0" />
                Date de réservation *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal text-sm sm:text-base border-2 focus:border-[#3A7B59] rounded-lg h-11 sm:h-auto",
                      !formData.bookingDate && "text-muted-foreground",
                      errors.bookingDate && "border-red-300"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.bookingDate ? (
                      format(formData.bookingDate, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.bookingDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, bookingDate: date }))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
              {errors.bookingDate && <p className="text-red-500 text-xs sm:text-sm">{errors.bookingDate}</p>}
            </div>

            {/* Time Selection */}
            <div className="space-y-2 w-full">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Clock size={14} className="sm:w-4 sm:h-4 shrink-0" />
                Heure *
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.bookingTime}
                onChange={(e) => setFormData(prev => ({ ...prev, bookingTime: e.target.value }))}
                className={`w-full text-sm sm:text-base border-2 focus:border-[#3A7B59] rounded-lg h-11 sm:h-auto ${errors.bookingTime ? 'border-red-300 focus:border-red-500' : ''}`}
              />
              {errors.bookingTime && <p className="text-red-500 text-xs sm:text-sm">{errors.bookingTime}</p>}
            </div>

            {/* Participants */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
              <div className="space-y-2 w-full min-w-0">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users size={14} className="sm:w-4 sm:h-4 shrink-0" />
                  Adultes *
                </Label>
                <Input
                  id="adults"
                  type="number"
                  min="1"
                  value={formData.participantsAdults}
                  onChange={(e) => setFormData(prev => ({ ...prev, participantsAdults: parseInt(e.target.value) || 1 }))}
                  className={`w-full text-sm sm:text-base border-2 focus:border-[#3A7B59] rounded-lg h-11 sm:h-auto ${errors.participantsAdults ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {errors.participantsAdults && <p className="text-red-500 text-xs sm:text-sm">{errors.participantsAdults}</p>}
              </div>
              <div className="space-y-2 w-full min-w-0">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users size={14} className="sm:w-4 sm:h-4 shrink-0" />
                  Enfants
                </Label>
                <Input
                  id="children"
                  type="number"
                  min="0"
                  value={formData.participantsEnfants}
                  onChange={(e) => setFormData(prev => ({ ...prev, participantsEnfants: parseInt(e.target.value) || 0 }))}
                  className={`w-full text-sm sm:text-base border-2 focus:border-[#3A7B59] rounded-lg h-11 sm:h-auto ${errors.participantsEnfants ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {errors.participantsEnfants && <p className="text-red-500 text-xs sm:text-sm">{errors.participantsEnfants}</p>}
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-2 w-full">
              <Label className="text-sm font-semibold text-gray-700">Langue souhaitée *</Label>
              <Select
                value={formData.selectedLanguage}
                onValueChange={(value) => setFormData(prev => ({ ...prev, selectedLanguage: value }))}
              >
                <SelectTrigger className={`w-full text-sm sm:text-base border-2 focus:border-[#3A7B59] rounded-lg h-11 sm:h-auto ${errors.selectedLanguage ? 'border-red-300 focus:border-red-500' : ''}`}>
                  <SelectValue placeholder="Sélectionner une langue" />
                </SelectTrigger>
                <SelectContent>
                  {selectedService?.languagesOffered.map((language) => (
                    <SelectItem key={language} value={language}>
                      {language}
                    </SelectItem>
                  )) || (
                    <>
                      <SelectItem value="French">Français</SelectItem>
                      <SelectItem value="English">Anglais</SelectItem>
                      <SelectItem value="German">Allemand</SelectItem>
                      <SelectItem value="Spanish">Espagnol</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              {errors.selectedLanguage && <p className="text-red-500 text-xs sm:text-sm">{errors.selectedLanguage}</p>}
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
              <div className="space-y-2 w-full min-w-0">
                <Label className="text-sm font-semibold text-gray-700">Prénom *</Label>
                <Input
                  id="firstName"
                  value={formData.userContactFirstname}
                  onChange={(e) => setFormData(prev => ({ ...prev, userContactFirstname: e.target.value }))}
                  placeholder="Prénom du contact"
                  className={`w-full text-sm sm:text-base border-2 focus:border-[#3A7B59] rounded-lg h-11 sm:h-auto ${errors.userContactFirstname ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {errors.userContactFirstname && <p className="text-red-500 text-xs sm:text-sm">{errors.userContactFirstname}</p>}
              </div>
              <div className="space-y-2 w-full min-w-0">
                <Label className="text-sm font-semibold text-gray-700">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.userContactLastname}
                  onChange={(e) => setFormData(prev => ({ ...prev, userContactLastname: e.target.value }))}
                  placeholder="Nom du contact"
                  className={`w-full text-sm sm:text-base border-2 focus:border-[#3A7B59] rounded-lg h-11 sm:h-auto ${errors.userContactLastname ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {errors.userContactLastname && <p className="text-red-500 text-xs sm:text-sm">{errors.userContactLastname}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
              <div className="space-y-2 w-full min-w-0">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail size={14} className="sm:w-4 sm:h-4 shrink-0" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                  placeholder="contact@example.com"
                  className={`w-full text-sm sm:text-base border-2 focus:border-[#3A7B59] rounded-lg h-11 sm:h-auto ${errors.customerEmail ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {errors.customerEmail && <p className="text-red-500 text-xs sm:text-sm">{errors.customerEmail}</p>}
              </div>
              <div className="space-y-2 w-full min-w-0">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Phone size={14} className="sm:w-4 sm:h-4 shrink-0" />
                  Téléphone *
                </Label>
                <Input
                  id="phone"
                  value={formData.phoneNo}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNo: e.target.value }))}
                  placeholder="+33 1 23 45 67 89"
                  className={`w-full text-sm sm:text-base border-2 focus:border-[#3A7B59] rounded-lg h-11 sm:h-auto ${errors.phoneNo ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {errors.phoneNo && <p className="text-red-500 text-xs sm:text-sm">{errors.phoneNo}</p>}
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-2 w-full">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <MessageSquare size={14} className="sm:w-4 sm:h-4 shrink-0" />
                Notes supplémentaires
              </Label>
              <Textarea
                id="notes"
                value={formData.additionalNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
                placeholder="Demandes spéciales, allergies, etc."
                rows={3}
                className="w-full text-sm sm:text-base border-2 focus:border-[#3A7B59] rounded-lg resize-none"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Footer - Mobile optimized */}
        <div className="shrink-0 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 px-6 pb-6 border-t border-gray-200 -mx-6 -mb-6">
          <Button 
            onClick={handleClose} 
            variant="outline"
            className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 border-2 border-gray-300 hover:bg-gray-50 font-medium text-sm sm:text-base"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 bg-gradient-to-r from-[#3A7B59] to-[#2d5a43] hover:from-[#2d5a43] hover:to-[#1e3d2b] text-white font-medium shadow-lg text-sm sm:text-base"
          >
            {isSubmitting ? "En cours..." : "Créer la réservation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};