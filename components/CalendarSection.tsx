'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Menu, Plus, CalendarIcon } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { fr } from "date-fns/locale";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, getDay, startOfWeek, endOfWeek, parseISO } from "date-fns";
import { ReservationDetailsModal } from "./ReservationDetailsModal";
import { AddBookingModal } from "./AddBookingModal";
import { EditBookingModal } from "./EditBookingModal";
import { cn } from "@/lib/utils";
import { eventsService, EventData } from "@/services/events.service";
import { bookingService } from "@/services/booking.service";
import { useDate } from "@/contexts/DateContext";
import toast from "react-hot-toast";

export const CalendarSection = () => {
  const { selectedDate, setSelectedDate } = useDate();
  const [date, setDate] = useState<Date | undefined>(selectedDate);
  const [currentMonth, setCurrentMonth] = useState(selectedDate); // Current month
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [selectedEventData, setSelectedEventData] = useState<EventData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddBookingModalOpen, setIsAddBookingModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBookingData, setEditingBookingData] = useState<any>(null);
  const [events, setEvents] = useState<EventData[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  // Fetch events function
  const fetchEvents = async () => {
    try {
      setEventsLoading(true);
      setEventsError(null);
      const response = await eventsService.getUserEvents();
      setEvents(response.data);
    } catch (error: any) {
      console.error('Failed to fetch events:', error);
      setEventsError(error.message || 'Failed to load events');
    } finally {
      setEventsLoading(false);
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Get color for event type
  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'booking':
        return '#3A7B59'; // Green for bookings
      case 'personal':
        return '#2563eb'; // Blue for personal events
      case 'external':
        return '#7c3aed'; // Purple for external calendar events
      case 'blocked':
        return '#dc2626'; // Red for blocked time
      default:
        return '#6b7280'; // Gray for unknown
    }
  };

  // Convert API events to calendar format
  const convertEventsToCalendarFormat = (apiEvents: EventData[]) => {
    const eventsByDay: { [key: number]: any[] } = {};
    
    console.log('Converting events for month:', currentMonth.getMonth(), 'year:', currentMonth.getFullYear());
    console.log('All API events:', apiEvents);
    
    apiEvents.forEach(event => {
      const eventDate = parseISO(event.eventDate);
      console.log('Event date:', eventDate, 'Event month:', eventDate.getMonth(), 'Event year:', eventDate.getFullYear());
      
      // Only include events for the current month being displayed
      if (eventDate.getMonth() === currentMonth.getMonth() && 
          eventDate.getFullYear() === currentMonth.getFullYear()) {
        
        const dayNumber = eventDate.getDate();
        
        // Convert event to the format expected by the calendar
        const calendarEvent = {
          id: event._id,
          time: event.eventTime,
          people: event.bookingId ? 
            (event.bookingId.participantsAdults + event.bookingId.participantsEnfants) : 
            'N/A',
          activity: event.eventName,
          language: event.bookingId?.selectedLanguage || 'FR',
          comments: event.bookingId?.additionalNotes || event.eventDescription || 'Aucun',
          serviceName: event.serviceInfo?.name || null,
          customerName: event.bookingId ? 
            `${event.bookingId.userContactFirstname} ${event.bookingId.userContactLastname}` : 
            'Événement',
          customerPhone: event.bookingId?.phoneNo || 'Non disponible',
          customerEmail: event.bookingId?.customerEmail || 'Non disponible',
          participantsAdults: event.bookingId?.participantsAdults || 1,
          participantsChildren: event.bookingId?.participantsEnfants || 0,
          eventType: event.eventType,
          eventStatus: event.eventStatus,
          isAllDay: event.isAllDay,
          bookingId: event.bookingId?._id,
          originalEvent: event, // Keep reference to original event data
          backgroundColor: getEventColor(event.eventType) // Add color based on type
        };

        if (!eventsByDay[dayNumber]) {
          eventsByDay[dayNumber] = [];
        }
        eventsByDay[dayNumber].push(calendarEvent);
      }
    });

    return eventsByDay;
  };

  // Function to refresh events
  const refreshEvents = async () => {
    try {
      setEventsLoading(true);
      setEventsError(null);
      const response = await eventsService.getUserEvents();
      setEvents(response.data);
    } catch (error: any) {
      console.error('Failed to refresh events:', error);
      setEventsError(error.message || 'Failed to refresh events');
    } finally {
      setEventsLoading(false);
    }
  };

  // Get events formatted for calendar display - recalculate when events or currentMonth changes
  const allEvents = useMemo(() => {
    return convertEventsToCalendarFormat(events);
  }, [events, currentMonth]);

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (newSelectedDate: Date | undefined) => {
    if (newSelectedDate) {
      setCurrentMonth(newSelectedDate);
      setDate(newSelectedDate);
      setSelectedDate(newSelectedDate); // Update shared context
    }
  };

  // Calculer les jours du calendrier
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Lundi = 1
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  // Fonction pour vérifier si c'est un dimanche (jour 0)
  const isSunday = (date: Date) => date.getDay() === 0;

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };

  const handleEventClick = (reservation: any, day: Date) => {
    // Ajouter la date formatée à la réservation
    const reservationWithDate = {
      ...reservation,
      date: `${day.getDate().toString().padStart(2, '0')} / ${(day.getMonth() + 1).toString().padStart(2, '0')} / ${day.getFullYear()}`
    };
    setSelectedReservation(reservationWithDate);
    
    // Find the corresponding event data for edit/delete functionality
    const eventData = events.find(event => {
      const eventDate = new Date(event.eventDate);
      return eventDate.toDateString() === day.toDateString() && 
             event.eventTime === reservation.time &&
             event._id === reservation.id;
    });
    
    setSelectedEventData(eventData || null);
    setIsModalOpen(true);
  };

  const handleDayClick = (day: Date) => {
    if (day.getMonth() === currentMonth.getMonth()) {
      setSelectedDate(day); // Update shared context when clicking on a day
      setDate(day);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReservation(null);
    setSelectedEventData(null);
  };

  const handleEditReservation = (reservation: any) => {
    // Find the corresponding event with booking data
    const eventData = events.find(event => {
      return event._id === reservation.id && event.bookingId;
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

  return (
    <Card className="mb-6 lg:mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg lg:text-xl">Calendrier</CardTitle>
          {!eventsLoading && !eventsError && (
            <div className="text-sm text-gray-500">
              {Object.values(allEvents).flat().length} événement{Object.values(allEvents).flat().length !== 1 ? 's' : ''} ce mois
            </div>
          )}
        </div>
        {/* Event Type Legend */}
        <div className="flex flex-wrap gap-3 mt-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#3A7B59' }}></div>
            <span>Réservations</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#2563eb' }}></div>
            <span>Personnel</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#7c3aed' }}></div>
            <span>Externe</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#dc2626' }}></div>
            <span>Bloqué</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Loading State */}
        {eventsLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Chargement des événements...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {eventsError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm">
              Erreur lors du chargement des événements: {eventsError}
            </p>
            <button 
              onClick={refreshEvents} 
              className="text-red-600 underline text-sm mt-1 hover:text-red-800"
              disabled={eventsLoading}
            >
              {eventsLoading ? 'Chargement...' : 'Réessayer'}
            </button>
          </div>
        )}

        <div className="p-3 lg:p-4 rounded-lg mb-4 lg:mb-6" style={{ backgroundColor: '#3A7B59' }}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 sm:gap-0">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={goToPreviousMonth}
                className="text-white hover:bg-white/20"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "bg-white px-3 lg:px-4 py-2 rounded text-center min-w-[120px] lg:min-w-[150px] font-medium capitalize justify-center text-sm lg:text-base",
                      !date && "text-muted-foreground"
                    )}
                    style={{ color: '#3A7B59' }}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3 lg:h-4 lg:w-4" />
                    {formatMonth(currentMonth)}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={goToNextMonth}
                className="text-white hover:bg-white/20"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 lg:gap-2 mb-4">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
            <div key={day} className="p-2 lg:p-3 text-center font-medium text-muted-foreground text-xs lg:text-sm">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 lg:gap-2 mb-6">
          {calendarDays.map((day, index) => {
            const dayNumber = day.getDate();
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            // Get events for this day from API data
            let rawEvents = [];
            if (isCurrentMonth) {
              rawEvents = allEvents[dayNumber as keyof typeof allEvents] || [];
            }
            const dayEvents = isSunday(day) ? [] : rawEvents;
            
            return (
              <div 
                key={index} 
                className={`border h-[80px] lg:h-[100px] p-1 overflow-hidden cursor-pointer hover:bg-gray-50 transition-colors ${
                  !isCurrentMonth ? 'opacity-30 bg-muted' : ''
                } ${
                  isCurrentMonth && day.toDateString() === selectedDate.toDateString() ? 'ring-2 ring-green-500 bg-green-50' : ''
                }`}
                onClick={() => handleDayClick(day)}
              >
                <div className={`font-medium mb-1 text-xs ${!isCurrentMonth ? 'text-muted-foreground' : ''}`}>
                  {dayNumber}
                </div>
                <div className="space-y-0.5 h-[60px] lg:h-[80px] overflow-hidden">
                  {dayEvents.slice(0, window.innerWidth < 1024 ? 2 : 3).map((reservation, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="text-[7px] lg:text-[8px] leading-tight p-0.5 rounded text-white cursor-pointer hover:opacity-80 transition-opacity truncate"
                      style={{ backgroundColor: reservation.backgroundColor || '#3A7B59' }}
                      onClick={() => handleEventClick(reservation, day)}
                      title={`${reservation.eventType || 'booking'} - ${reservation.activity}`}
                    >
                      <div className="truncate font-medium">{reservation.activity}</div>
                      <div className="text-[6px] lg:text-[7px] opacity-75 truncate">{reservation.time}</div>
                    </div>
                  ))}
                  {dayEvents.length > (window.innerWidth < 1024 ? 2 : 3) && (
                    <div className="text-[6px] lg:text-[7px] text-gray-500 font-medium">
                      +{dayEvents.length - (window.innerWidth < 1024 ? 2 : 3)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <Button 
            className="text-white hover:opacity-90 text-sm lg:text-base px-4 lg:px-6 py-2"
            style={{ backgroundColor: '#3A7B59' }}
            onClick={() => setIsAddBookingModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une réservation
          </Button>
        </div>
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
      
      <AddBookingModal 
        isOpen={isAddBookingModalOpen}
        onClose={() => setIsAddBookingModalOpen(false)}
        onBookingCreated={() => {
          // Refresh events when a new booking is created
          const fetchEvents = async () => {
            try {
              setEventsLoading(true);
              setEventsError(null);
              const response = await eventsService.getUserEvents();
              setEvents(response.data);
            } catch (error: any) {
              console.error('Failed to fetch events:', error);
              setEventsError(error.message || 'Failed to load events');
            } finally {
              setEventsLoading(false);
            }
          };
          fetchEvents();
        }}
      />
    </Card>
  );
};