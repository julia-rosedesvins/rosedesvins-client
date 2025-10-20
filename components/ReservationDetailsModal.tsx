import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Users, Grape, Globe, Phone, Mail, Edit2, Trash2, Loader2 } from "lucide-react";
import { parseISO, format } from "date-fns";
import { useState } from "react";
import toast from "react-hot-toast";

interface Reservation {
  id: number | string;
  time: string;
  people: number | string;
  activity: string;
  language: string;
  comments: string;
  serviceName?: string | null;
  date?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  participantsAdults?: number;
  participantsChildren?: number;
  eventType?: string;
  eventStatus?: string;
  backgroundColor?: string;
  bookingId?: string;
}

interface ReservationDetailsModalProps {
  reservation: Reservation | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (reservation: Reservation) => void;
  onDelete?: (bookingId: string) => void;
  eventData?: {
    _id: string;
    bookingId?: {
      _id: string;
      [key: string]: any;
    } | null;
    eventType: string;
  };
}

// Helper function to format date and time properly
const formatDateTime = (dateString: string | undefined, timeString: string) => {
  let formattedDate = '';
  let formattedTime = timeString;
  
  // Format the date part
  if (dateString && dateString.includes('/')) {
    // Already formatted date from CalendarSection
    formattedDate = dateString;
  } else if (dateString && dateString.includes('T')) {
    // ISO date string, parse and format it
    try {
      const date = parseISO(dateString);
      formattedDate = format(date, 'dd / MM / yyyy');
    } catch (error) {
      console.error('Error parsing ISO date:', error);
      formattedDate = dateString;
    }
  } else if (dateString) {
    // Simple date string, try to parse it
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        formattedDate = `${date.getDate().toString().padStart(2, '0')} / ${(date.getMonth() + 1).toString().padStart(2, '0')} / ${date.getFullYear()}`;
      } else {
        formattedDate = dateString;
      }
    } catch (error) {
      console.error('Error parsing date:', error);
      formattedDate = dateString;
    }
  } else {
    formattedDate = "Date non disponible";
  }
  
  // Format the time part (ensure HH:MM format)
  if (timeString) {
    // If time is already in HH:MM format, keep it
    if (/^\d{1,2}:\d{2}$/.test(timeString)) {
      // Add leading zero if needed
      const [hours, minutes] = timeString.split(':');
      formattedTime = `${hours.padStart(2, '0')}:${minutes}`;
    } else if (/^\d{1,2}h\d{2}$/.test(timeString)) {
      // Convert from "14h30" format to "14:30"
      formattedTime = timeString.replace('h', ':');
    }
    // Otherwise keep the original time format
  }
  
  return `${formattedDate} - ${formattedTime}`;
};

export const ReservationDetailsModal = ({ 
  reservation, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete, 
  eventData 
}: ReservationDetailsModalProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  if (!reservation) return null;

  const handleDelete = async () => {
    if (!eventData?.bookingId?._id) {
      toast.error('Unable to delete: Booking ID not found');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action ne peut pas être annulée.')) {
      return;
    }

    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(eventData.bookingId._id);
      }
      onClose();
    } catch (error) {
      console.error('Error deleting reservation:', error);
      toast.error('Failed to delete reservation');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(reservation);
    }
    onClose();
  };

  const isBooking = eventData?.eventType === 'booking' && eventData?.bookingId;
  const canModify = isBooking;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs sm:max-w-lg lg:max-w-2xl p-0 overflow-hidden mx-4">
        <DialogHeader className="text-white p-4 lg:p-6 text-center" style={{ backgroundColor: reservation.backgroundColor || '#3A7B59' }}>
          <h2 className="text-lg lg:text-2xl font-semibold">
            {reservation.eventType === 'booking' ? 'Votre réservation' : 
             reservation.eventType === 'personal' ? 'Événement personnel' :
             reservation.eventType === 'external' ? 'Événement externe' :
             reservation.eventType === 'blocked' ? 'Temps bloqué' :
             'Votre réservation'}
          </h2>
        </DialogHeader>
        
        <div className="p-4 lg:p-6 space-y-6 lg:space-y-8">
          {/* Détails de la réservation */}
          <div>
            <h3 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Détails de la réservation :</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
                <span className="text-sm lg:text-base">{formatDateTime(reservation.date, reservation.time)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
                <span className="text-sm lg:text-base">
                  {reservation.participantsAdults || 1} adulte{(reservation.participantsAdults || 1) > 1 ? 's' : ''}
                  {(reservation.participantsChildren && reservation.participantsChildren > 0) ? `, ${reservation.participantsChildren} enfant${reservation.participantsChildren > 1 ? 's' : ''}` : ''}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Grape className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
                <span className="text-sm lg:text-base">{reservation.activity}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Globe className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
                <span className="text-sm lg:text-base">
                  {reservation.language === 'French' ? 'Français' : 
                   reservation.language === 'English' ? 'English' : 
                   reservation.language === 'German' ? 'Allemand' : 
                   reservation.language === 'Spanish' ? 'Espagnol' : 
                   reservation.language === 'FR' ? 'Français' : 
                   reservation.language === 'EN' ? 'English' : 
                   reservation.language || 'Non spécifié'}
                </span>
              </div>
              {reservation.eventType && (
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: reservation.backgroundColor || '#3A7B59' }}
                  ></div>
                  <span className="text-sm lg:text-base">
                    {reservation.eventType === 'booking' ? 'Réservation' : 
                     reservation.eventType === 'personal' ? 'Événement personnel' :
                     reservation.eventType === 'external' ? 'Événement externe' :
                     reservation.eventType === 'blocked' ? 'Temps bloqué' :
                     reservation.eventType}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Information complémentaire */}
          {(reservation.serviceName) && (
            <div>
              <h3 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Information complémentaire :</h3>
              <p className="text-muted-foreground text-sm lg:text-base">
                {reservation.serviceName}
              </p>
            </div>
          )}

          {/* Détails du visiteur */}
          {reservation.eventType === 'booking' && (
            <div>
              <h3 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Détails du visiteur :</h3>
              <div className="space-y-3">
                <div className="text-base lg:text-lg font-semibold">
                  {reservation.customerName || "Nom non disponible"}
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
                  <span className="text-sm lg:text-base">
                    {reservation.customerPhone || "Non disponible"}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
                  <span className="text-sm lg:text-base">
                    {reservation.customerEmail || "Non disponible"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {canModify && (
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button 
                variant="outline"
                onClick={handleEdit}
                className="flex items-center justify-center w-full sm:w-auto text-sm lg:text-base px-4 lg:px-6 py-2 border-2"
                style={{ 
                  color: '#3A7B59', 
                  borderColor: '#3A7B59'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#3A7B59';
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#3A7B59';
                }}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              
              <Button 
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center justify-center w-full sm:w-auto text-sm lg:text-base px-4 lg:px-6 py-2"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </Button>
            </div>
          )}

          {!canModify && (
            <div className="flex justify-center sm:justify-end">
              <Button 
                onClick={onClose}
                className="text-white hover:opacity-90 w-full sm:w-auto text-sm lg:text-base px-4 lg:px-6 py-2"
                style={{ backgroundColor: '#3A7B59' }}
              >
                Fermer
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};