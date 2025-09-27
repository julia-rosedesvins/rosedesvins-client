'use client';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/DatePicker";
import { ChevronLeft, ChevronRight, Plus, Minus, Clock, Euro, Wine, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { WidgetProvider, useWidget } from "@/contexts/WidgetContext";

function BookingContent({ id, serviceId }: { id: string, serviceId: string }) {
    const { widgetData, loading, error, colorCode } = useWidget();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("Français");
  const [morningStartIndex, setMorningStartIndex] = useState(0);
  const [afternoonStartIndex, setAfternoonStartIndex] = useState(0);

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
  }  // Generate time slots
  const generateTimeSlots = (startHour: number, endHour: number) => {
    const slots = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      if (hour < endHour || (hour === endHour && startHour === 13)) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
      }
      if (hour < endHour) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  const allMorningTimes = generateTimeSlots(9, 13);
  const allAfternoonTimes = generateTimeSlots(13, 20);
  
  const visibleSlotsCount = 4;
  const morningTimes = allMorningTimes.slice(morningStartIndex, morningStartIndex + visibleSlotsCount);
  const afternoonTimes = allAfternoonTimes.slice(afternoonStartIndex, afternoonStartIndex + visibleSlotsCount);

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

        {/* Calendar */}
        <div className="mb-6">
          <DatePicker 
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>

        {/* Horaires */}
        <div className="mb-8 mt-4">
          <h2 className="text-2xl font-semibold mb-6 text-center" style={{ color: colorCode }}>Horaires</h2>
          
          {/* Matin */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-center">Matin</h3>
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
          </div>

          {/* Après-midi */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 text-center">Après-midi</h3>
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
          </div>

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
          <Link
            href={{
              pathname: `/if/booking-widget/${id}/${serviceId}/booking-confirmation`,
              query: {
                date: selectedDate?.toISOString(),
                selectedTime: selectedTime,
                adults: adults.toString(),
                children: children.toString(),
                language: selectedLanguage,
                widgetId: id,
              }
            }}
          >
            <Button 
              className="hover:opacity-90 text-white px-12 py-4 text-xl font-semibold"
              style={{ backgroundColor: colorCode }}
              size="lg"
            >
              Sélectionner
            </Button>
          </Link>
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