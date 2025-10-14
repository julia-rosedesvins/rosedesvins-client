'use client'

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import toast from "react-hot-toast";
import { bookingService, UpdateBookingRequest } from "@/services/booking.service";

interface BookingData {
  _id: string;
  serviceId: string;
  bookingDate: string;
  bookingTime: string;
  participantsAdults: number;
  participantsEnfants: number;
  selectedLanguage: string;
  userContactFirstname: string;
  userContactLastname: string;
  phoneNo: string;
  customerEmail: string;
  additionalNotes?: string;
  bookingStatus: string;
}

interface EditBookingModalProps {
  bookingData: BookingData | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditBookingModal = ({ bookingData, isOpen, onClose, onSuccess }: EditBookingModalProps) => {
  const [formData, setFormData] = useState<UpdateBookingRequest>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form data when modal opens
  useEffect(() => {
    if (bookingData && isOpen) {
      setFormData({
        serviceId: bookingData.serviceId,
        bookingDate: bookingData.bookingDate,
        bookingTime: bookingData.bookingTime,
        participantsAdults: bookingData.participantsAdults,
        participantsEnfants: bookingData.participantsEnfants,
        selectedLanguage: bookingData.selectedLanguage,
        userContactFirstname: bookingData.userContactFirstname,
        userContactLastname: bookingData.userContactLastname,
        phoneNo: bookingData.phoneNo,
        customerEmail: bookingData.customerEmail,
        additionalNotes: bookingData.additionalNotes || '',
        bookingStatus: bookingData.bookingStatus as 'pending' | 'confirmed' | 'completed' | 'cancelled',
      });
      
      // Set initial date
      if (bookingData.bookingDate) {
        setSelectedDate(new Date(bookingData.bookingDate));
      }
    }
  }, [bookingData, isOpen]);

  const handleInputChange = (field: keyof UpdateBookingRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      handleInputChange('bookingDate', date.toISOString().split('T')[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData?._id) {
      toast.error('Booking ID is missing');
      return;
    }

    setIsLoading(true);
    
    try {
      // Create update payload with only changed fields
      const updatePayload: UpdateBookingRequest = {};
      
      // Compare each field and only include changed ones
      Object.entries(formData).forEach(([key, value]) => {
        const originalValue = bookingData[key as keyof BookingData];
        if (value !== undefined && value !== originalValue) {
          (updatePayload as any)[key] = value;
        }
      });

      // Ensure we have at least one field to update
      if (Object.keys(updatePayload).length === 0) {
        toast('No changes detected');
        onClose();
        return;
      }

      const result = await bookingService.updateBooking(bookingData._id, updatePayload);
      
      if (result.success) {
        toast.success(result.message || 'Booking updated successfully');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(result.message || 'Failed to update booking');
      }
    } catch (error: any) {
      console.error('Error updating booking:', error);
      toast.error(error.message || 'Failed to update booking');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({});
    setSelectedDate(undefined);
    onClose();
  };

  if (!bookingData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md sm:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Modifier la réservation
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-1">
          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date de réservation *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "dd MMMM yyyy", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Heure *</Label>
              <Input
                id="time"
                type="time"
                value={formData.bookingTime || ''}
                onChange={(e) => handleInputChange('bookingTime', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Participants */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adults">Adultes *</Label>
              <Input
                id="adults"
                type="number"
                min="0"
                max="20"
                value={formData.participantsAdults || 0}
                onChange={(e) => handleInputChange('participantsAdults', parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="children">Enfants</Label>
              <Input
                id="children"
                type="number"
                min="0"
                max="20"
                value={formData.participantsEnfants || 0}
                onChange={(e) => handleInputChange('participantsEnfants', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label htmlFor="language">Langue préférée *</Label>
            <Select
              value={formData.selectedLanguage || ''}
              onValueChange={(value) => handleInputChange('selectedLanguage', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une langue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="French">Français</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="German">Allemand</SelectItem>
                <SelectItem value="Spanish">Espagnol</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstname">Prénom *</Label>
              <Input
                id="firstname"
                value={formData.userContactFirstname || ''}
                onChange={(e) => handleInputChange('userContactFirstname', e.target.value)}
                required
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastname">Nom *</Label>
              <Input
                id="lastname"
                value={formData.userContactLastname || ''}
                onChange={(e) => handleInputChange('userContactLastname', e.target.value)}
                required
                maxLength={50}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.customerEmail || ''}
                onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                required
                maxLength={255}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phoneNo || ''}
                onChange={(e) => handleInputChange('phoneNo', e.target.value)}
                required
                maxLength={20}
              />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Statut</Label>
            <Select
              value={formData.bookingStatus || ''}
              onValueChange={(value) => handleInputChange('bookingStatus', value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmé</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes supplémentaires</Label>
            <Textarea
              id="notes"
              value={formData.additionalNotes || ''}
              onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
              placeholder="Allergies, préférences, demandes spéciales..."
              maxLength={1000}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 text-white"
              style={{ backgroundColor: '#3A7B59' }}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isLoading ? 'Modification...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};