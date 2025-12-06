'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Clock, Users, Grape, Globe, MessageCircle, Download, CalendarIcon, Loader2, AlertCircle, RefreshCw, Edit2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { ReservationDetailsModal } from "./ReservationDetailsModal";
import { cn } from "@/lib/utils";
import { eventsService, EventData } from "@/services/events.service";
import toast from "react-hot-toast";
import { useDate } from "@/contexts/DateContext";
import { bookingService } from "@/services/booking.service";
import { EditBookingModal } from "./EditBookingModal";

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
  additionalNotes?: string;
}

export const ReservationsList = () => {
  const { selectedDate: currentDate, setSelectedDate: setCurrentDate } = useDate();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [selectedEventData, setSelectedEventData] = useState<EventData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBookingData, setEditingBookingData] = useState<any>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsService.getUserEvents();
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load reservations');
      toast.error('Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Transform EventData to Reservation format
  const transformEventToReservation = (event: EventData, index: number): Reservation => {
    const eventDateTime = new Date(`${event.eventDate}T${event.eventTime}`);
    
    // Get actual participant count from booking
    const totalPeople = event.bookingId ? 
      (event.bookingId.participantsAdults || 0) + (event.bookingId.participantsEnfants || 0) : 
      1;
    
    // Get actual language from booking, with fallback
    const getLanguageDisplay = (language: string | undefined) => {
      if (!language) return 'Non spécifié';
      
      // Handle different language formats
      switch (language.toLowerCase()) {
        case 'french':
        case 'français':
        case 'fr':
          return 'Français';
        case 'english':
        case 'anglais':
        case 'en':
          return 'English';
        case 'german':
        case 'allemand':
        case 'de':
          return 'Allemand';
        case 'spanish':
        case 'espagnol':
        case 'es':
          return 'Espagnol';
        default:
          return language; // Return as-is if not recognized
      }
    };
    
    return {
      id: index + 1, // Use index as numeric ID
      time: event.eventTime,
      people: totalPeople,
      activity: event.eventName,
      language: getLanguageDisplay(event.bookingId?.selectedLanguage),
      comments: event.bookingId?.additionalNotes || event.eventDescription || 'Aucun commentaire',
      serviceName: event.serviceInfo?.name || null,
      date: event.eventDate,
      customerName: event.bookingId ? 
        `${event.bookingId.userContactFirstname} ${event.bookingId.userContactLastname}` : 
        'Événement',
      customerPhone: event.bookingId?.phoneNo || 'Non disponible',
      customerEmail: event.bookingId?.customerEmail || 'Non disponible',
      eventType: event.eventType,
      eventStatus: event.eventStatus,
      additionalNotes: event.bookingId?.additionalNotes || undefined
    };
  };

  // Function to check if it's a Sunday (day 0)
  const isSunday = (date: Date) => date.getDay() === 0;

  // Filter events for the current date
  const reservations = events
    .filter(event => {
      const eventDate = new Date(event.eventDate);
      return eventDate.toDateString() === currentDate.toDateString();
    })
    .map((event, index) => transformEventToReservation(event, index));

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).replace(/\//g, ' / ');
  };

  const handleReservationClick = (reservation: any) => {
    setSelectedReservation(reservation);
    
    // Find the corresponding event data
    const eventData = events.find(event => {
      const eventDate = new Date(event.eventDate).toDateString();
      const reservationDate = currentDate.toDateString();
      return eventDate === reservationDate && event.eventTime === reservation.time;
    });
    
    setSelectedEventData(eventData || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReservation(null);
    setSelectedEventData(null);
  };

  const handleEditReservation = (reservation: Reservation) => {
    // Find the corresponding event with booking data
    const eventData = events.find(event => {
      const eventDate = new Date(event.eventDate).toDateString();
      const reservationDate = currentDate.toDateString();
      return eventDate === reservationDate && 
             event.eventTime === reservation.time &&
             event.bookingId;
    });

    if (eventData?.bookingId) {
      setEditingBookingData(eventData.bookingId);
      setIsEditModalOpen(true);
    } else {
      toast.error('Cannot edit this reservation: Booking data not available');
    }
  };

  const handleDeleteReservation = async (bookingId: string) => {
    try {
      const result = await bookingService.deleteBooking(bookingId);
      
      if (result.success) {
        toast.success(result.message || 'Reservation deleted successfully');
        // Refresh events list
        await fetchEvents();
      } else {
        toast.error(result.message || 'Failed to delete reservation');
      }
    } catch (error: any) {
      console.error('Error deleting reservation:', error);
      toast.error(error.message || 'Failed to delete reservation');
    }
  };

  const handleEditSuccess = async () => {
    // Refresh events list after successful edit
    await fetchEvents();
    toast.success('Reservation updated successfully');
  };

  // Helper function to check if a reservation can be edited/deleted
  const getBookingData = (reservation: any) => {
    const eventData = events.find(event => {
      const eventDate = new Date(event.eventDate).toDateString();
      const reservationDate = currentDate.toDateString();
      return eventDate === reservationDate && 
             event.eventTime === reservation.time &&
             event.eventType === 'booking' &&
             event.bookingId;
    });
    return eventData;
  };

  // Quick edit handler
  const handleQuickEdit = (reservation: any) => {
    const eventData = getBookingData(reservation);
    if (eventData?.bookingId) {
      setEditingBookingData(eventData.bookingId);
      setIsEditModalOpen(true);
    } else {
      toast.error('Cannot edit this reservation: Booking data not available');
    }
  };

  // Quick delete handler
  const handleQuickDelete = async (reservation: any) => {
    const eventData = getBookingData(reservation);
    if (!eventData?.bookingId?._id) {
      toast.error('Cannot delete this reservation: Booking data not available');
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
      return;
    }

    try {
      const result = await bookingService.deleteBooking(eventData.bookingId._id);
      if (result.success) {
        toast.success('Reservation deleted successfully');
        await fetchEvents();
      } else {
        toast.error(result.message || 'Failed to delete reservation');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete reservation');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg lg:text-xl">Réservations</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchEvents}
            disabled={loading}
            className="h-8 px-3"
          >
            <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="p-3 lg:p-4 rounded-lg mb-4 lg:mb-6" style={{ backgroundColor: '#3A7B59' }}>
          <div className="flex items-center justify-center space-x-2 lg:space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={goToPreviousDay}
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-3 w-3 lg:h-4 lg:w-4" />
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "bg-white px-3 lg:px-6 py-2 rounded text-center min-w-[120px] lg:min-w-[150px] font-medium justify-center text-sm lg:text-base"
                  )}
                  style={{ color: '#3A7B59' }}
                >
                  <CalendarIcon className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden sm:inline">{formatDate(currentDate)}</span>
                  <span className="sm:hidden">{currentDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={handleDateSelect}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={goToNextDay}
              className="text-white hover:bg-white/20"
            >
              <ChevronRight className="h-3 w-3 lg:h-4 lg:w-4" />
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-6 lg:py-8">
            <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-500" />
            <p className="text-gray-500 mt-2">Loading reservations...</p>
          </div>
        ) : error ? (
          <div className="text-center py-6 lg:py-8 text-red-500">
            <AlertCircle className="h-6 w-6 mx-auto mb-2" />
            <p className="text-base lg:text-lg">{error}</p>
            <Button 
              variant="outline" 
              className="mt-2"
              onClick={fetchEvents}
              disabled={loading}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
              Retry
            </Button>
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-6 lg:py-8 text-gray-500">
            <p className="text-base lg:text-lg">Aucune réservation pour cette date</p>
            {isSunday(currentDate) && (
              <p className="text-sm mt-2">Les dimanches sont fermés</p>
            )}
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            {/* Mobile view - Card layout */}
            <div className="block lg:hidden space-y-3">
              {reservations.map((reservation) => (
                <div key={reservation.id} className="border rounded-lg p-4 bg-white hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold text-lg">{reservation.time}</span>
                    </div>
                    <div className="flex gap-2">
                      {getBookingData(reservation) && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs px-2 py-1 border-blue-500 text-blue-500 hover:bg-blue-50"
                            onClick={() => handleQuickEdit(reservation)}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs px-2 py-1 border-red-500 text-red-500 hover:bg-red-50"
                            onClick={() => handleQuickDelete(reservation)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                      <Button 
                        size="sm" 
                        className="text-white hover:opacity-90 text-xs px-3 py-1"
                        style={{ backgroundColor: '#3A7B59' }}
                        onClick={() => handleReservationClick(reservation)}
                      >
                        Détails
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-3 w-3 text-gray-500" />
                      <span>{reservation.people} pers.</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-3 w-3 text-gray-500" />
                      <span className="font-medium">{reservation.language}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-start space-x-2">
                      <Grape className="h-3 w-3 text-gray-500 mt-0.5" />
                      <span className="text-sm">{reservation.activity}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MessageCircle className="h-3 w-3 text-gray-500 mt-0.5" />
                      <span className="text-sm text-gray-600 line-clamp-2">
                        {reservation.comments && reservation.comments.length > 50 
                          ? `${reservation.comments.substring(0, 50)}...` 
                          : reservation.comments || 'Aucun commentaire'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop view - Table layout */}
            <Table className="hidden lg:table">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="text-center font-semibold text-sm px-4 py-3">
                    <div className="flex flex-col items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Heure</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-semibold text-sm px-4 py-3">
                    <div className="flex flex-col items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>Personnes</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-semibold text-sm px-4 py-3">
                    <div className="flex flex-col items-center gap-1">
                      <Grape className="h-4 w-4" />
                      <span>Activité</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-semibold text-sm px-4 py-3">
                    <div className="flex flex-col items-center gap-1">
                      <Globe className="h-4 w-4" />
                      <span>Langue</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-semibold text-sm px-4 py-3">
                    <div className="flex flex-col items-center gap-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>Commentaires</span>
                    </div>
                  </TableHead>
                  <TableHead className="text-center font-semibold text-sm px-4 py-3">
                    <span>Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id} className="hover:bg-gray-50">
                    <TableCell className="text-center font-semibold text-base px-4 py-4">
                      {reservation.time}
                    </TableCell>
                    <TableCell className="text-center text-base px-4 py-4">
                      {reservation.people}
                    </TableCell>
                    <TableCell className="text-center text-sm px-4 py-4">
                      <div className="max-w-[200px] mx-auto">
                        {reservation.serviceName}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium text-base px-4 py-4">
                      {reservation.language}
                    </TableCell>
                    <TableCell className="text-center text-sm px-4 py-4">
                      <div className="max-w-[150px] mx-auto truncate" title={reservation.comments}>
                        {reservation.comments && reservation.comments.length > 30 
                          ? `${reservation.comments.substring(0, 30)}...` 
                          : reservation.comments || '-'}
                      </div>
                    </TableCell>
                    <TableCell className="text-center px-4 py-4">
                      <div className="flex justify-center gap-2">
                        {getBookingData(reservation) && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="px-3 py-2 border-blue-500 text-blue-500 hover:bg-blue-50"
                              onClick={() => handleQuickEdit(reservation)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="px-3 py-2 border-red-500 text-red-500 hover:bg-red-50"
                              onClick={() => handleQuickDelete(reservation)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button 
                          size="sm" 
                          className="text-white hover:opacity-90 px-4 py-2"
                          style={{ backgroundColor: '#3A7B59' }}
                          onClick={() => handleReservationClick(reservation)}
                        >
                          Détails
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* <div className="flex justify-end mt-4 lg:mt-6">
          <Button 
            variant="outline" 
            className="text-sm lg:text-base px-3 lg:px-4 py-2 border-2 hover:bg-opacity-5"
            style={{ color: '#3A7B59', borderColor: '#3A7B59', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3A7B59';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#3A7B59';
            }}
          >
            <Download className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Télécharger</span>
            <span className="sm:hidden">PDF</span>
          </Button>
        </div> */}
      </CardContent>
      
      <ReservationDetailsModal 
        reservation={selectedReservation}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onEdit={handleEditReservation}
        onDelete={handleDeleteReservation}
        eventData={selectedEventData ? {
          _id: selectedEventData._id,
          bookingId: selectedEventData.bookingId,
          eventType: selectedEventData.eventType
        } : undefined}
      />
      
      <EditBookingModal
        bookingData={editingBookingData}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingBookingData(null);
        }}
        onSuccess={handleEditSuccess}
      />
    </Card>
  );
};