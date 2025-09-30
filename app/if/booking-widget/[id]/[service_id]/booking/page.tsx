'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/DatePicker";
import { ChevronLeft, ChevronRight, Plus, Minus, Clock, Euro, Wine, Users, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WidgetProvider, useWidget } from "@/contexts/WidgetContext";
import { eventsService, PublicScheduleData } from "@/services/events.service";

function BookingContent({ id, serviceId }: { id: string, serviceId: string }) {
    const { widgetData, loading, error, colorCode } = useWidget();
    const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [morningStartIndex, setMorningStartIndex] = useState(0);
  const [afternoonStartIndex, setAfternoonStartIndex] = useState(0);
  const [bookedSlots, setBookedSlots] = useState<PublicScheduleData[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation function
  const validateBooking = (): boolean => {
    const errors: string[] = [];
    
    if (!selectedDate) {
      errors.push("Veuillez sélectionner une date");
    }
    
    if (!selectedTime) {
      errors.push("Veuillez sélectionner un horaire");
    }
    
    if (adults <= 0) {
      errors.push("Le nombre d'adultes doit être d'au moins 1");
    }
    
    if (!selectedLanguage) {
      errors.push("Veuillez sélectionner une langue");
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Handle booking selection
  const handleBookingSelect = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double clicks
    
    if (!validateBooking()) {
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Set loading state
    setIsSubmitting(true);
    
    try {
      // Add a small delay for better UX (optional)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // If validation passes, navigate to confirmation using Next.js router
      const query = new URLSearchParams({
        date: selectedDate ? `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}` : '',
        selectedTime: selectedTime || '',
        adults: adults.toString(),
        children: children.toString(),
        language: selectedLanguage,
        widgetId: id,
      });
      
      router.push(`/if/booking-widget/${id}/${serviceId}/booking-confirmation?${query.toString()}`);
    } catch (error) {
      // Reset loading state if something goes wrong
      setIsSubmitting(false);
    }
  };

  // Auto-select first language when widget data is loaded
  useEffect(() => {
    if (widgetData?.service?.languagesOffered && widgetData.service.languagesOffered.length > 0 && !selectedLanguage) {
      setSelectedLanguage(widgetData.service.languagesOffered[0]);
    } else if (!widgetData?.service?.languagesOffered && !selectedLanguage) {
      // Fallback to default if no languages are provided
      setSelectedLanguage("Français");
    }
  }, [widgetData?.service?.languagesOffered, selectedLanguage]);

  // Fetch booked slots for the user on component mount
  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        setLoadingSchedule(true);
        const response = await eventsService.getPublicUserSchedule(id);
        setBookedSlots(response.data);
      } catch (error) {
        console.error('Failed to fetch booked slots:', error);
        // Continue without booked slots data - don't block the user
        setBookedSlots([]);
      } finally {
        setLoadingSchedule(false);
      }
    };

    if (id) {
      fetchBookedSlots();
    }
  }, [id]);

  // Auto-select today's date if available and has time slots
  useEffect(() => {
    if (widgetData?.availability && bookedSlots && !loadingSchedule && !selectedDate) {
      const today = new Date();
      if (isDateAvailable(today)) {
        const availableSlots = getAvailableTimeSlots(today);
        if (availableSlots.morning.length > 0 || availableSlots.afternoon.length > 0) {
          setSelectedDate(today);
        }
      }
    }
  }, [widgetData, bookedSlots, loadingSchedule, selectedDate]);

  // Reset selected time when date changes
  useEffect(() => {
    setSelectedTime(null);
    setMorningStartIndex(0);
    setAfternoonStartIndex(0);
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: colorCode }}></div>
          <p className="text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-600">Erreur</h1>
          <p className="text-lg text-gray-600 mb-8">{error}</p>
        </div>
      </div>
    );
  }

  // Check if a time slot has passed for today
  const isTimeSlotPast = (date: Date, time: string): boolean => {
    const now = new Date();
    const isToday = date.getDate() === now.getDate() && 
                   date.getMonth() === now.getMonth() && 
                   date.getFullYear() === now.getFullYear();
    
    if (!isToday) return false; // Only check for today
    
    const [hours, minutes] = time.split(':').map(Number);
    const slotTime = new Date(now);
    slotTime.setHours(hours, minutes, 0, 0);
    
    // Add a small buffer (5 minutes) to prevent booking slots that are about to start
    const bufferTime = new Date(now.getTime() + 5 * 60 * 1000);
    
    return slotTime <= bufferTime;
  };

  // Check if a time slot conflicts with existing bookings considering service duration
  const isTimeSlotConflicting = (date: Date, time: string): boolean => {
    if (!bookedSlots.length) return false;
    
    const dateString = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    const serviceDuration = widgetData?.service?.timeOfServiceInMinutes || 60;
    
    const [requestHours, requestMinutes] = time.split(':').map(Number);
    const requestStartTime = requestHours * 60 + requestMinutes; // Convert to minutes
    const requestEndTime = requestStartTime + serviceDuration;
    
    return bookedSlots.some(slot => {
      const slotDate = new Date(slot.eventDate);
      const slotDateString = `${slotDate.getFullYear()}-${(slotDate.getMonth() + 1).toString().padStart(2, '0')}-${slotDate.getDate().toString().padStart(2, '0')}`;
      
      // Only check slots on the same date
      if (slotDateString !== dateString) return false;
      
      const [slotHours, slotMinutes] = slot.eventTime.split(':').map(Number);
      const slotStartTime = slotHours * 60 + slotMinutes; // Convert to minutes
      const slotEndTime = slotStartTime + serviceDuration;
      
      // Two time ranges overlap if: start1 < end2 AND start2 < end1
      return (requestStartTime < slotEndTime) && (slotStartTime < requestEndTime);
    });
  };

  // Get available time slots for the selected date
  const getAvailableTimeSlots = (date: Date | null) => {
    if (!date || !widgetData?.availability?.weeklyAvailability) {
      return { morning: [], afternoon: [] };
    }

    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[date.getDay()];
    const dayAvailability = widgetData.availability.weeklyAvailability[dayName];

    if (!dayAvailability?.isAvailable || !dayAvailability.timeSlots?.length) {
      return { morning: [], afternoon: [] };
    }

    const morningSlots: string[] = [];
    const afternoonSlots: string[] = [];

    dayAvailability.timeSlots.forEach((slot: { startTime: string; endTime: string }) => {
      const startTime = slot.startTime;
      const endTime = slot.endTime;
      
      // Generate time slots within the available range based on service duration
      const duration = widgetData.service?.timeOfServiceInMinutes || 60;
      const slotDuration = widgetData.availability?.defaultSlotDuration || 30;
      
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;
      
      // Only create a slot if the service can fit entirely within the time window
      if (startMinutes + duration <= endMinutes) {
        // Generate slots with the specified slot duration, but ensure service fits
        for (let currentMinutes = startMinutes; currentMinutes + duration <= endMinutes; currentMinutes += slotDuration) {
          const hours = Math.floor(currentMinutes / 60);
          const minutes = currentMinutes % 60;
          const timeSlot = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
          
          // Skip if time slot has passed (for today) or conflicts with existing bookings
          if (!isTimeSlotPast(date, timeSlot) && !isTimeSlotConflicting(date, timeSlot)) {
            if (hours < 12) {
              morningSlots.push(timeSlot);
            } else {
              afternoonSlots.push(timeSlot);
            }
          }
        }
      }
    });

    return { morning: morningSlots, afternoon: afternoonSlots };
  };

  const availableSlots = getAvailableTimeSlots(selectedDate);
  const allMorningTimes = availableSlots.morning;
  const allAfternoonTimes = availableSlots.afternoon;
  
  const visibleSlotsCount = 4;
  const morningTimes = allMorningTimes.slice(morningStartIndex, morningStartIndex + visibleSlotsCount);
  const afternoonTimes = allAfternoonTimes.slice(afternoonStartIndex, afternoonStartIndex + visibleSlotsCount);

  // Check if a date has any available time slots (excluding booked ones)
  const isDateAvailable = (date: Date) => {
    if (!widgetData?.availability?.weeklyAvailability) return false;
    
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayName = dayNames[date.getDay()];
    const dayAvailability = widgetData.availability.weeklyAvailability[dayName];
    
    if (!dayAvailability?.isAvailable || !dayAvailability.timeSlots?.length) {
      return false;
    }

    // Check if there are any available (non-booked) time slots for this date
    const availableSlots = getAvailableTimeSlots(date);
    return availableSlots.morning.length > 0 || availableSlots.afternoon.length > 0;
  };

  const handleAdultsChange = (increment: boolean) => {
    if (increment) {
      setAdults(prev => prev + 1);
    } else if (adults > 0) {
      setAdults(prev => prev - 1);
    }
  };

  const handleChildrenChange = (increment: boolean) => {
    if (increment) {
      setChildren(prev => prev + 1);
    } else if (children > 0) {
      setChildren(prev => prev - 1);
    }
  };

  const handleMorningPrevious = () => {
    if (morningStartIndex > 0) {
      setMorningStartIndex(prev => Math.max(0, prev - 1));
    }
  };

  const handleMorningNext = () => {
    if (morningStartIndex + visibleSlotsCount < allMorningTimes.length) {
      setMorningStartIndex(prev => Math.min(allMorningTimes.length - visibleSlotsCount, prev + 1));
    }
  };

  const handleAfternoonPrevious = () => {
    if (afternoonStartIndex > 0) {
      setAfternoonStartIndex(prev => Math.max(0, prev - 1));
    }
  };

  const handleAfternoonNext = () => {
    if (afternoonStartIndex + visibleSlotsCount < allAfternoonTimes.length) {
      setAfternoonStartIndex(prev => Math.min(allAfternoonTimes.length - visibleSlotsCount, prev + 1));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center mb-6 lg:mb-8">
          <Link href={`/if/booking-widget/${id}/${serviceId}/reservation`} className="flex items-center text-muted-foreground hover:opacity-75" style={{ color: colorCode }}>
            <ChevronLeft className="w-5 h-5 mr-1" />
            Retour
          </Link>
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold mb-8 lg:mb-12 text-center" style={{ color: colorCode }}>
          {widgetData?.service?.name || 'Visite libre & dégustation des cuvées Tradition'}
        </h1>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-red-800 font-medium mb-2">Veuillez corriger les erreurs suivantes :</h3>
            <ul className="text-red-700 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Calendar */}
        <div className="mb-6">
          {loadingSchedule ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 mx-auto mb-2" style={{ borderColor: colorCode }}></div>
                <p className="text-sm text-gray-600">Chargement des créneaux disponibles...</p>
              </div>
            </div>
          ) : (
            <DatePicker 
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              isDateAvailable={isDateAvailable}
              colorCode={colorCode}
            />
          )}
        </div>

        {/* Horaires */}
        <div className="mb-8 mt-4">
          <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: colorCode }}>Horaires</h2>
          
          {!selectedDate ? (
            <div className="text-center text-gray-500 py-8">
              Veuillez sélectionner une date pour voir les créneaux disponibles
            </div>
          ) : allMorningTimes.length === 0 && allAfternoonTimes.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p className="mb-2">Aucun créneau disponible pour cette date.</p>
              <p className="text-sm">
                {selectedDate && selectedDate.toDateString() === new Date().toDateString() 
                  ? "Les créneaux passés ne sont plus disponibles aujourd'hui."
                  : "Tous les créneaux sont déjà réservés."}
              </p>
              <p className="text-sm mt-1">Veuillez choisir une autre date.</p>
            </div>
          ) : (
            <>
              {/* Matin */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-center">Matin</h3>
            {allMorningTimes.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                Aucun créneau disponible le matin
              </div>
            ) : (
              <div className="flex justify-center gap-3 mb-6">
                <button
                  onClick={handleMorningPrevious}
                  disabled={morningStartIndex === 0}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full bg-gray-100",
                    morningStartIndex === 0 
                      ? "text-gray-300 cursor-not-allowed" 
                      : "text-muted-foreground hover:opacity-75 cursor-pointer hover:bg-gray-200"
                  )}
                  style={morningStartIndex === 0 ? {} : { color: colorCode }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {morningTimes.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    onClick={() => setSelectedTime(selectedTime === time ? null : time)}
                    className={cn(
                      "px-6 py-3 text-base min-w-[80px]",
                      selectedTime === time 
                        ? "text-white hover:opacity-90" 
                        : "hover:bg-gray-100"
                    )}
                    style={selectedTime === time ? { backgroundColor: colorCode } : {}}
                  >
                    {time}
                  </Button>
                ))}
                <button
                  onClick={handleMorningNext}
                  disabled={morningStartIndex + visibleSlotsCount >= allMorningTimes.length}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full bg-gray-100",
                    morningStartIndex + visibleSlotsCount >= allMorningTimes.length
                      ? "text-gray-300 cursor-not-allowed" 
                      : "text-muted-foreground hover:opacity-75 cursor-pointer hover:bg-gray-200"
                  )}
                  style={morningStartIndex + visibleSlotsCount >= allMorningTimes.length ? {} : { color: colorCode }}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Après-midi */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-center">Après-midi</h3>
            {allAfternoonTimes.length === 0 ? (
              <div className="text-center text-gray-500 py-4">
                Aucun créneau disponible l'après-midi
              </div>
            ) : (
              <div className="flex justify-center gap-3">
                <button
                  onClick={handleAfternoonPrevious}
                  disabled={afternoonStartIndex === 0}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full bg-gray-100",
                    afternoonStartIndex === 0 
                      ? "text-gray-300 cursor-not-allowed" 
                      : "text-muted-foreground hover:opacity-75 cursor-pointer hover:bg-gray-200"
                  )}
                  style={afternoonStartIndex === 0 ? {} : { color: colorCode }}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {afternoonTimes.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    onClick={() => setSelectedTime(selectedTime === time ? null : time)}
                    className={cn(
                      "px-6 py-3 text-base min-w-[80px]",
                      selectedTime === time 
                        ? "text-white hover:opacity-90" 
                        : "hover:bg-gray-100"
                    )}
                    style={selectedTime === time ? { backgroundColor: colorCode } : {}}
                  >
                    {time}
                  </Button>
                ))}
                <button
                  onClick={handleAfternoonNext}
                  disabled={afternoonStartIndex + visibleSlotsCount >= allAfternoonTimes.length}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full bg-gray-100",
                    afternoonStartIndex + visibleSlotsCount >= allAfternoonTimes.length
                      ? "text-gray-300 cursor-not-allowed" 
                      : "text-muted-foreground hover:opacity-75 cursor-pointer hover:bg-gray-200"
                  )}
                  style={afternoonStartIndex + visibleSlotsCount >= allAfternoonTimes.length ? {} : { color: colorCode }}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
          </>
          )}

          {/* Informations sur l'expérience */}
          <div className="flex justify-center gap-8 mb-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: colorCode }} />
              <span>{widgetData?.service?.timeOfServiceInMinutes || 60} min</span>
            </div>
            <div className="flex items-center gap-2">
              <Euro className="w-5 h-5" style={{ color: colorCode }} />
              <span>{widgetData?.service?.pricePerPerson || 5} € / personne</span>
            </div>
            <div className="flex items-center gap-2">
              <Wine className="w-5 h-5" style={{ color: colorCode }} />
              <span>{widgetData?.service?.numberOfWinesTasted || 5} vins</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" style={{ color: colorCode }} />
              <span>1 à {widgetData?.service?.numberOfPeople || 10} personnes</span>
            </div>
          </div>
        </div>

        {/* Participants */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: colorCode }}>Participants</h2>
          
          <div className="space-y-6 max-w-md mx-auto">
            {/* Adultes */}
            <div className="flex items-center justify-between">
              <span className="font-medium text-lg">Adultes</span>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full"
                  onClick={() => handleAdultsChange(false)}
                  disabled={adults <= 0}
                >
                  <Minus className="w-5 h-5" />
                </Button>
                <span className="w-10 text-center font-medium text-lg">{adults}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full"
                  onClick={() => handleAdultsChange(true)}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Enfants */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-lg">Enfants</span>
                <div className="text-base text-muted-foreground">-18 ans</div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full"
                  onClick={() => handleChildrenChange(false)}
                  disabled={children <= 0}
                >
                  <Minus className="w-5 h-5" />
                </Button>
                <span className="w-10 text-center font-medium text-lg">{children}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 rounded-full"
                  onClick={() => handleChildrenChange(true)}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Langues */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: colorCode }}>Langues</h2>
          <div className="flex justify-center gap-4">
            {widgetData?.service?.languagesOffered?.map((language, index) => (
              <Button
                key={index}
                variant={selectedLanguage === language ? "default" : "outline"}
                onClick={() => setSelectedLanguage(language)}
                className={cn(
                  "px-8 py-3 text-base",
                  selectedLanguage === language 
                    ? "text-white hover:opacity-90" 
                    : "hover:bg-gray-100"
                )}
                style={selectedLanguage === language ? { backgroundColor: colorCode } : {}}
              >
                {language}
              </Button>
            )) || (
              <>
                <Button
                  variant={selectedLanguage === "Français" ? "default" : "outline"}
                  onClick={() => setSelectedLanguage("Français")}
                  className={cn(
                    "px-8 py-3 text-base",
                    selectedLanguage === "Français" 
                      ? "text-white hover:opacity-90" 
                      : "hover:bg-gray-100"
                  )}
                  style={selectedLanguage === "Français" ? { backgroundColor: colorCode } : {}}
                >
                  Français
                </Button>
                <Button
                  variant={selectedLanguage === "English" ? "default" : "outline"}
                  onClick={() => setSelectedLanguage("English")}
                  className={cn(
                    "px-8 py-3 text-base",
                    selectedLanguage === "English" 
                      ? "text-white hover:opacity-90" 
                      : "hover:bg-gray-100"
                  )}
                  style={selectedLanguage === "English" ? { backgroundColor: colorCode } : {}}
                >
                  English
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Button Sélectionner */}
        <div className="flex justify-center">
          <Button 
            onClick={handleBookingSelect}
            disabled={isSubmitting}
            className={cn(
              "text-white px-12 py-4 text-xl font-semibold",
              isSubmitting 
                ? "opacity-70 cursor-not-allowed" 
                : "hover:opacity-90"
            )}
            style={{ backgroundColor: colorCode }}
            size="lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Traitement...
              </>
            ) : (
              "Sélectionner"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage({ params }: { params: Promise<{ id: string, service_id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string, service_id: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A7E53] mx-auto mb-4"></div>
          <p className="text-lg">Chargement...</p>
        </div>
      </div>
    );
  }

  const { id, service_id } = resolvedParams;

  return (
    <WidgetProvider userId={id} serviceId={service_id}>
      <BookingContent id={id} serviceId={service_id} />
    </WidgetProvider>
  );
}