import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, Users, Grape, Globe, Phone, Mail } from "lucide-react";

interface Reservation {
  id: number | string;
  time: string;
  people: number | string;
  activity: string;
  language: string;
  comments: string;
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
}

export const ReservationDetailsModal = ({ reservation, isOpen, onClose }: ReservationDetailsModalProps) => {
  if (!reservation) return null;

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
                <span className="text-sm lg:text-base">{reservation.date || "23 / 07 / 2025"} - {reservation.time}</span>
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
          {(reservation.comments && reservation.comments !== "Aucun") && (
            <div>
              <h3 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Information complémentaire :</h3>
              <p className="text-muted-foreground text-sm lg:text-base">
                {reservation.comments}
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

          {/* Bouton d'annulation */}
          <div className="flex justify-center sm:justify-end">
            <Button 
              className="text-white hover:opacity-90 w-full sm:w-auto text-sm lg:text-base px-4 lg:px-6 py-2"
              style={{ backgroundColor: '#3A7B59' }}
            >
              Annuler la réservation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};