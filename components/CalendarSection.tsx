'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Menu, Plus, CalendarIcon } from "lucide-react";
import { useState } from "react";
import { fr } from "date-fns/locale";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, getDay, startOfWeek, endOfWeek } from "date-fns";
import { ReservationDetailsModal } from "./ReservationDetailsModal";
import { AddServiceModal } from "./AddServiceModal";
import { cn } from "@/lib/utils";

export const CalendarSection = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 6)); // July 2025
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);

  // Événements par jour 
  // 1er mardi (1er juillet): 0 réservations
  // 1er jeudi (3 juillet): 1 réservation  
  // 1er samedi (5 juillet): 3 réservations
  // Tous les dimanches (6, 13, 20, 27): 0 réservations
  const allEvents = {
    // 1 juillet = 1er mardi du mois - VIDE
    2: [ // Mercredi - 2 réservations
      {
        id: 2,
        time: "14:30",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Oui",
        customerName: "Marie BERNARD",
        customerPhone: "+ 33 6 23 45 67 89",
        customerEmail: "marie.bernard@gmail.com"
      },
      {
        id: 3,
        time: "16:30",
        people: 4,
        activity: "Atelier vins & fromages",
        language: "FR",
        comments: "Aucun",
        customerName: "Sophie ROUSSEAU",
        customerPhone: "+ 33 6 87 65 43 21",
        customerEmail: "sophie.rousseau@gmail.com"
      }
    ],
    3: [ // 3 juillet = 1er jeudi du mois - 1 réservation
      {
        id: 4,
        time: "10:30",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Nous serons accompagnés de notre petit chien.",
        customerName: "Juliette MARTIN",
        customerPhone: "+ 33 6 18 45 67 89",
        customerEmail: "juliettemartin@gmail.com"
      }
    ],
    4: [ // Vendredi - 3 réservations
      {
        id: 5,
        time: "10:00",
        people: 2,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun",
        customerName: "Claire DUBOIS",
        customerPhone: "+ 33 6 78 90 12 34",
        customerEmail: "claire.dubois@gmail.com"
      },
      {
        id: 6,
        time: "14:00",
        people: 6,
        activity: "Atelier vins & fromage",
        language: "EN",
        comments: "Aucun",
        customerName: "Paul DURAND",
        customerPhone: "+ 33 6 34 56 78 90",
        customerEmail: "paul.durand@gmail.com"
      },
      {
        id: 7,
        time: "16:30",
        people: 3,
        activity: "Visite de cave et dégustation",
        language: "EN",
        comments: "Allergie aux noix",
        customerName: "Emma WILSON",
        customerPhone: "+ 33 6 56 78 90 12",
        customerEmail: "emma.wilson@gmail.com"
      }
    ],
    5: [ // 5 juillet = 1er samedi du mois - 3 réservations
      {
        id: 8,
        time: "10:00",
        people: 2,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun",
        customerName: "Pierre MOREAU",
        customerPhone: "+ 33 6 45 67 89 01",
        customerEmail: "pierre.moreau@gmail.com"
      },
      {
        id: 9,
        time: "14:00",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "EN",
        comments: "Aucun",
        customerName: "John SMITH",
        customerPhone: "+ 33 6 89 01 23 45",
        customerEmail: "john.smith@gmail.com"
      },
      {
        id: 10,
        time: "16:30",
        people: 3,
        activity: "Atelier vins & fromages",
        language: "FR",
        comments: "Aucun",
        customerName: "Thomas PETIT",
        customerPhone: "+ 33 6 67 89 01 23",
        customerEmail: "thomas.petit@gmail.com"
      }
    ],
    // 6 juillet = Dimanche - VIDE
    7: [
      {
        id: 11,
        time: "11:30",
        people: 3,
        activity: "Dégustation de vins",
        language: "EN",
        comments: "Aucun",
        customerName: "Anne GARCIA",
        customerPhone: "+ 33 6 90 12 34 56",
        customerEmail: "anne.garcia@gmail.com"
      }
    ],
    8: [
      {
        id: 10,
        time: "14:00",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Aucun",
        customerName: "Thomas PETIT",
        customerPhone: "+ 33 6 67 89 01 23",
        customerEmail: "thomas.petit@gmail.com"
      }
    ],
    9: [ // Mercredi - 2 réservations
      {
        id: 11,
        time: "11:00",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Végétarien",
        customerName: "Anne GARCIA",
        customerPhone: "+ 33 6 90 12 34 56",
        customerEmail: "anne.garcia@gmail.com"
      },
      {
        id: 12,
        time: "15:30",
        people: 5,
        activity: "Atelier vins & fromages",
        language: "EN",
        comments: "Aucun",
        customerName: "Marc ROUX",
        customerPhone: "+ 33 6 01 23 45 67",
        customerEmail: "marc.roux@gmail.com"
      }
    ],
    10: [
      {
        id: 13,
        time: "10:00",
        people: 2,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun",
        customerName: "Sarah BROWN",
        customerPhone: "+ 33 6 12 34 56 78",
        customerEmail: "sarah.brown@gmail.com"
      }
    ],
    11: [ // Vendredi - 3 réservations
      {
        id: 14,
        time: "09:30",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "EN",
        comments: "Aucun",
        customerName: "Lucas SIMON",
        customerPhone: "+ 33 6 23 45 67 89",
        customerEmail: "lucas.simon@gmail.com"
      },
      {
        id: 15,
        time: "14:30",
        people: 2,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Première visite",
        customerName: "Julie BLANC",
        customerPhone: "+ 33 6 34 56 78 90",
        customerEmail: "julie.blanc@gmail.com"
      },
      {
        id: 16,
        time: "16:30",
        people: 5,
        activity: "Atelier vins & fromages",
        language: "FR",
        comments: "Aucun",
        customerName: "David JONES",
        customerPhone: "+ 33 6 45 67 89 01",
        customerEmail: "david.jones@gmail.com"
      }
    ],
    12: [
      {
        id: 17,
        time: "11:00",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun",
        customerName: "Léa MARTINEZ",
        customerPhone: "+ 33 6 56 78 90 12",
        customerEmail: "lea.martinez@gmail.com"
      }
    ],
    // 13 juillet = Dimanche - VIDE
    14: [
      {
        id: 18,
        time: "15:00",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun",
        customerName: "Antoine MICHEL",
        customerPhone: "+ 33 6 67 89 01 23",
        customerEmail: "antoine.michel@gmail.com"
      }
    ],
    15: [
      {
        id: 19,
        time: "11:00",
        people: 6,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Aucun",
        customerName: "Lisa DAVIS",
        customerPhone: "+ 33 6 78 90 12 34",
        customerEmail: "lisa.davis@gmail.com"
      }
    ],
    16: [ // Mercredi - 2 réservations
      {
        id: 20,
        time: "10:30",
        people: 2,
        activity: "Dégustation de vins",
        language: "EN",
        comments: "Aucun",
        customerName: "Nicolas LEROY",
        customerPhone: "+ 33 6 89 01 23 45",
        customerEmail: "nicolas.leroy@gmail.com"
      },
      {
        id: 21,
        time: "14:30",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Groupe d'étudiants",
        customerName: "Rachel GREEN",
        customerPhone: "+ 33 6 90 12 34 56",
        customerEmail: "rachel.green@gmail.com"
      }
    ],
    17: [
      {
        id: 22,
        time: "10:30",
        people: 4,
        activity: "Atelier vins & fromages",
        language: "FR",
        comments: "Aucun",
        customerName: "Mathieu BONNET",
        customerPhone: "+ 33 6 01 23 45 67",
        customerEmail: "mathieu.bonnet@gmail.com"
      }
    ],
    18: [ // Vendredi - 3 réservations
      {
        id: 23,
        time: "09:00",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun",
        customerName: "Jean DUPUIS",
        customerPhone: "+ 33 6 12 34 56 78",
        customerEmail: "jean.dupuis@gmail.com"
      },
      {
        id: 24,
        time: "11:30",
        people: 2,
        activity: "Visite de cave et dégustation",
        language: "EN",
        comments: "Lune de miel",
        customerName: "Marie LEFEVRE",
        customerPhone: "+ 33 6 23 45 67 89",
        customerEmail: "marie.lefevre@gmail.com"
      },
      {
        id: 25,
        time: "16:00",
        people: 5,
        activity: "Atelier vins & fromages",
        language: "FR",
        comments: "Aucun",
        customerName: "Sophie LAMBERT",
        customerPhone: "+ 33 6 34 56 78 90",
        customerEmail: "sophie.lambert@gmail.com"
      }
    ],
    19: [
      {
        id: 26,
        time: "16:00",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun",
        customerName: "Julien MOREAU",
        customerPhone: "+ 33 6 45 67 89 01",
        customerEmail: "julien.moreau@gmail.com"
      }
    ],
    // 20 juillet = Dimanche - VIDE
    21: [
      {
        id: 27,
        time: "14:00",
        people: 4,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun",
        customerName: "Paul BERNARD",
        customerPhone: "+ 33 6 56 78 90 12",
        customerEmail: "paul.bernard@gmail.com"
      }
    ],
    22: [
      {
        id: 28,
        time: "11:30",
        people: 4,
        activity: "Dégustation de vins",
        language: "EN",
        comments: "Aucun",
        customerName: "Pierre ROUSSEAU",
        customerPhone: "+ 33 6 67 89 01 23",
        customerEmail: "pierre.rousseau@gmail.com"
      }
    ],
    23: [ // Mercredi - 2 réservations
      {
        id: 29,
        time: "10:00",
        people: 3,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Aucun",
        customerName: "Juliette DURAND",
        customerPhone: "+ 33 6 78 90 12 34",
        customerEmail: "juliette.durand@gmail.com"
      },
      {
        id: 30,
        time: "15:30",
        people: 5,
        activity: "Atelier vins & fromages",
        language: "EN",
        comments: "Anniversaire",
        customerName: "Emma PETIT",
        customerPhone: "+ 33 6 89 01 23 45",
        customerEmail: "emma.petit@gmail.com"
      }
    ],
    24: [
      {
        id: 31,
        time: "11:00",
        people: 2,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun",
        customerName: "Thomas DUBOIS",
        customerPhone: "+ 33 6 90 12 34 56",
        customerEmail: "thomas.dubois@gmail.com"
      }
    ],
    25: [ // Vendredi - 3 réservations
      {
        id: 32,
        time: "10:00",
        people: 2,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun",
        customerName: "Claire GARCIA",
        customerPhone: "+ 33 6 01 23 45 67",
        customerEmail: "claire.garcia@gmail.com"
      },
      {
        id: 33,
        time: "14:00",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "EN",
        comments: "Aucun",
        customerName: "John ROUX",
        customerPhone: "+ 33 6 12 34 56 78",
        customerEmail: "john.roux@gmail.com"
      },
      {
        id: 34,
        time: "16:30",
        people: 6,
        activity: "Atelier vins & fromages",
        language: "FR",
        comments: "Entreprise",
        customerName: "Anne BROWN",
        customerPhone: "+ 33 6 23 45 67 89",
        customerEmail: "anne.brown@gmail.com"
      }
    ],
    26: [
      {
        id: 35,
        time: "14:00",
        people: 6,
        activity: "Atelier vins & fromages",
        language: "EN",
        comments: "Aucun",
        customerName: "Marc SIMON",
        customerPhone: "+ 33 6 34 56 78 90",
        customerEmail: "marc.simon@gmail.com"
      }
    ],
    // 27 juillet = Dimanche - VIDE
    28: [
      {
        id: 36,
        time: "11:00",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun",
        customerName: "Sarah BLANC",
        customerPhone: "+ 33 6 45 67 89 01",
        customerEmail: "sarah.blanc@gmail.com"
      }
    ],
    29: [
      {
        id: 37,
        time: "16:30",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "EN",
        comments: "Aucun",
        customerName: "Lucas JONES",
        customerPhone: "+ 33 6 56 78 90 12",
        customerEmail: "lucas.jones@gmail.com"
      }
    ],
    30: [ // Mercredi - 2 réservations
      {
        id: 38,
        time: "11:30",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun",
        customerName: "Julie MARTINEZ",
        customerPhone: "+ 33 6 67 89 01 23",
        customerEmail: "julie.martinez@gmail.com"
      },
      {
        id: 39,
        time: "15:00",
        people: 2,
        activity: "Visite de cave et dégustation",
        language: "EN",
        comments: "Aucun",
        customerName: "David MICHEL",
        customerPhone: "+ 33 6 78 90 12 34",
        customerEmail: "david.michel@gmail.com"
      }
    ],
    31: [
      {
        id: 40,
        time: "15:00",
        people: 2,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun",
        customerName: "Léa DAVIS",
        customerPhone: "+ 33 6 89 01 23 45",
        customerEmail: "lea.davis@gmail.com"
      }
    ]
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setCurrentMonth(selectedDate);
      setDate(selectedDate);
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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReservation(null);
  };

  return (
    <Card className="mb-6 lg:mb-8">
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl">Calendrier</CardTitle>
      </CardHeader>
      <CardContent>
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
            // RÈGLE : Aucune réservation le dimanche
            let rawEvents = [];
            if (isCurrentMonth) {
              if (day.getMonth() === 9) { // Octobre - données spécifiques avec modifications
                const octoberEvents = {
                  1: [
                    {
                      id: 41,
                      time: "11:00",
                      people: 3,
                      activity: "Dégustation de vins",
                      language: "FR",
                      comments: "Aucun",
                      customerName: "Pierre DURAND",
                      customerPhone: "+ 33 6 12 34 56 78",
                      customerEmail: "pierre.durand@gmail.com"
                    },
                    {
                      id: 42,
                      time: "15:30",
                      people: 4,
                      activity: "Atelier vins & fromages",
                      language: "EN",
                      comments: "Aucun",
                      customerName: "Sarah JOHNSON",
                      customerPhone: "+ 33 6 87 65 43 21",
                      customerEmail: "sarah.johnson@gmail.com"
                    }
                  ],
                  2: [
                    {
                      id: 43,
                      time: "14:00",
                      people: 2,
                      activity: "Visite de cave et dégustation",
                      language: "FR",
                      comments: "Aucun",
                      customerName: "Michel BERNARD",
                      customerPhone: "+ 33 6 23 45 67 89",
                      customerEmail: "michel.bernard@gmail.com"
                    }
                  ],
                  3: [
                    {
                      id: 44,
                      time: "09:30",
                      people: 4,
                      activity: "Dégustation de vins",
                      language: "FR",
                      comments: "Aucun",
                      customerName: "Lucie MARTIN",
                      customerPhone: "+ 33 6 34 56 78 90",
                      customerEmail: "lucie.martin@gmail.com"
                    },
                    {
                      id: 45,
                      time: "11:30",
                      people: 6,
                      activity: "Visite de cave et dégustation",
                      language: "EN",
                      comments: "Aucun",
                      customerName: "Thomas WILSON",
                      customerPhone: "+ 33 6 45 67 89 01",
                      customerEmail: "thomas.wilson@gmail.com"
                    },
                    {
                      id: 46,
                      time: "16:00",
                      people: 3,
                      activity: "Atelier vins & fromages",
                      language: "FR",
                      comments: "Aucun",
                      customerName: "Emma ROUSSEAU",
                      customerPhone: "+ 33 6 56 78 90 12",
                      customerEmail: "emma.rousseau@gmail.com"
                    }
                  ],
                  7: [
                    {
                      id: 50,
                      time: "10:30",
                      people: 4,
                      activity: "Visite de cave et dégustation",
                      language: "FR",
                      comments: "Aucun",
                      customerName: "Marc LEFEBVRE",
                      customerPhone: "+ 33 6 67 89 01 23",
                      customerEmail: "marc.lefebvre@gmail.com"
                    },
                    {
                      id: 51,
                      time: "14:30",
                      people: 2,
                      activity: "Dégustation de vins",
                      language: "EN",
                      comments: "Aucun",
                      customerName: "Lisa BROWN",
                      customerPhone: "+ 33 6 78 90 12 34",
                      customerEmail: "lisa.brown@gmail.com"
                    }
                  ],
                  9: [
                    {
                      id: 54,
                      time: "14:00",
                      people: 4,
                      activity: "Visite de cave et dégustation",
                      language: "FR",
                      comments: "Aucun",
                      customerName: "Julie SIMON",
                      customerPhone: "+ 33 6 90 12 34 56",
                      customerEmail: "julie.simon@gmail.com"
                    }
                  ],
                  11: [
                    {
                      id: 57,
                      time: "10:00",
                      people: 2,
                      activity: "Dégustation de vins",
                      language: "FR",
                      comments: "Aucun",
                      customerName: "Pierre GARCIA",
                      customerPhone: "+ 33 6 01 23 45 67",
                      customerEmail: "pierre.garcia@gmail.com"
                    },
                    {
                      id: 58,
                      time: "14:00",
                      people: 4,
                      activity: "Visite de cave et dégustation",
                      language: "FR",
                      comments: "Aucun",
                      customerName: "Marie ROUX",
                      customerPhone: "+ 33 6 12 34 56 78",
                      customerEmail: "marie.roux@gmail.com"
                    },
                    {
                      id: 59,
                      time: "16:30",
                      people: 6,
                      activity: "Atelier vins & fromages",
                      language: "FR",
                      comments: "Aucun",
                      customerName: "Thomas BLANC",
                      customerPhone: "+ 33 6 23 45 67 89",
                      customerEmail: "thomas.blanc@gmail.com"
                    }
                  ],
                  15: [
                    {
                      id: 59,
                      time: "11:00",
                      people: 6,
                      activity: "Visite de cave et dégustation",
                      language: "FR",
                      comments: "Aucun",
                      customerName: "Claire DUPONT",
                      customerPhone: "+ 33 6 34 56 78 90",
                      customerEmail: "claire.dupont@gmail.com"
                    },
                    {
                      id: 60,
                      time: "16:00",
                      people: 2,
                      activity: "Dégustation de vins",
                      language: "EN",
                      comments: "Aucun",
                      customerName: "Paul MARTIN",
                      customerPhone: "+ 33 6 45 67 89 01",
                      customerEmail: "paul.martin@gmail.com"
                    }
                  ],
                  17: [
                    {
                      id: 64,
                      time: "09:00",
                      people: 3,
                      activity: "Dégustation de vins",
                      language: "FR",
                      comments: "Aucun",
                      customerName: "Jean DURAND",
                      customerPhone: "+ 33 6 67 89 01 23",
                      customerEmail: "jean.durand@gmail.com"
                    },
                    {
                      id: 65,
                      time: "11:30",
                      people: 2,
                      activity: "Visite de cave et dégustation",
                      language: "EN",
                      comments: "Lune de miel",
                      customerName: "Emily WILSON",
                      customerPhone: "+ 33 6 78 90 12 34",
                      customerEmail: "emily.wilson@gmail.com"
                    },
                    {
                      id: 66,
                      time: "16:00",
                      people: 5,
                      activity: "Atelier vins & fromages",
                      language: "FR",
                      comments: "Aucun",
                      customerName: "Michel ROUSSEAU",
                      customerPhone: "+ 33 6 89 01 23 45",
                      customerEmail: "michel.rousseau@gmail.com"
                    },
                    {
                      id: 67,
                      time: "13:30",
                      people: 4,
                      activity: "Visite de cave et dégustation",
                      language: "FR",
                      comments: "Aucun",
                      customerName: "Anne LEFEBVRE",
                      customerPhone: "+ 33 6 90 12 34 56",
                      customerEmail: "anne.lefebvre@gmail.com"
                    },
                    {
                      id: 68,
                      time: "15:00",
                      people: 3,
                      activity: "Dégustation de vins",
                      language: "EN",
                      comments: "Aucun",
                      customerName: "David GARCIA",
                      customerPhone: "+ 33 6 01 23 45 67",
                      customerEmail: "david.garcia@gmail.com"
                     }
                   ],
                   20: [
                     {
                       id: 69,
                       time: "15:30",
                       people: 4,
                       activity: "Visite de cave et dégustation",
                       language: "FR",
                       comments: "Aucun",
                       customerName: "Lucas MARTIN",
                       customerPhone: "+ 33 6 12 34 56 78",
                       customerEmail: "lucas.martin@gmail.com"
                     }
                   ],
                    23: [
                      {
                        id: 72,
                        time: "14:30",
                        people: 3,
                        activity: "Dégustation de vins",
                        language: "EN",
                        comments: "Aucun",
                        customerName: "John BROWN",
                        customerPhone: "+ 33 6 34 56 78 90",
                        customerEmail: "john.brown@gmail.com"
                      },
                      {
                        id: 73,
                        time: "16:00",
                        people: 4,
                        activity: "Dégustation de vins",
                        language: "FR",
                        comments: "Aucun",
                        customerName: "Sophie WILSON",
                        customerPhone: "+ 33 6 45 67 89 01",
                        customerEmail: "sophie.wilson@gmail.com"
                      }
                    ],
                   25: [
                     {
                       id: 77,
                       time: "14:00",
                       people: 6,
                       activity: "Atelier vins & fromages",
                       language: "EN",
                       comments: "Aucun",
                       customerName: "Paul GARCIA",
                       customerPhone: "+ 33 6 56 78 90 12",
                       customerEmail: "paul.garcia@gmail.com"
                     },
                     {
                       id: 78,
                       time: "16:30",
                       people: 3,
                       activity: "Dégustation de vins",
                       language: "FR",
                       comments: "Aucun",
                       customerName: "Marie ROUX",
                       customerPhone: "+ 33 6 67 89 01 23",
                       customerEmail: "marie.roux@gmail.com"
                     },
                     {
                       id: 79,
                       time: "11:00",
                       people: 2,
                       activity: "Visite de cave et dégustation",
                       language: "FR",
                       comments: "Aucun",
                       customerName: "Thomas SIMON",
                       customerPhone: "+ 33 6 78 90 12 34",
                       customerEmail: "thomas.simon@gmail.com"
                     },
                     {
                       id: 80,
                       time: "15:30",
                       people: 4,
                       activity: "Dégustation de vins",
                       language: "EN",
                       comments: "Aucun",
                       customerName: "Emma LEFEBVRE",
                       customerPhone: "+ 33 6 89 01 23 45",
                       customerEmail: "emma.lefebvre@gmail.com"
                      }
                    ],
                    28: [
                      {
                        id: 77,
                        time: "11:00",
                        people: 3,
                        activity: "Dégustation de vins",
                        language: "FR",
                        comments: "Aucun",
                        customerName: "Marie DUBOIS",
                        customerPhone: "+ 33 6 01 23 45 67",
                        customerEmail: "marie.dubois@gmail.com"
                      },
                      {
                        id: 83,
                        time: "15:30",
                        people: 4,
                        activity: "Dégustation de vins",
                        language: "FR",
                        comments: "Aucun",
                        customerName: "Pierre MARTIN",
                        customerPhone: "+ 33 6 12 34 56 78",
                        customerEmail: "pierre.martin@gmail.com"
                      }
                    ]
                 };
                rawEvents = octoberEvents[dayNumber as keyof typeof octoberEvents] || [];
              } else { // Tous les autres mois utilisent les données par défaut
                rawEvents = allEvents[dayNumber as keyof typeof allEvents] || [];
              }
            }
            const dayEvents = isSunday(day) ? [] : rawEvents;
            
            return (
              <div 
                key={index} 
                className={`border h-[80px] lg:h-[100px] p-1 overflow-hidden ${
                  !isCurrentMonth ? 'opacity-30 bg-muted' : ''
                }`}
              >
                <div className={`font-medium mb-1 text-xs ${!isCurrentMonth ? 'text-muted-foreground' : ''}`}>
                  {dayNumber}
                </div>
                <div className="space-y-0.5 h-[60px] lg:h-[80px] overflow-hidden">
                  {dayEvents.slice(0, window.innerWidth < 1024 ? 2 : 3).map((reservation, eventIndex) => (
                    <div
                      key={eventIndex}
                      className="text-[7px] lg:text-[8px] leading-tight p-0.5 rounded text-white cursor-pointer hover:opacity-80 transition-opacity truncate"
                      style={{ backgroundColor: '#3A7B59' }}
                      onClick={() => handleEventClick(reservation, day)}
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
            onClick={() => setIsAddServiceModalOpen(true)}
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
      />
      
      <AddServiceModal 
        isOpen={isAddServiceModalOpen}
        onClose={() => setIsAddServiceModalOpen(false)}
      />
    </Card>
  );
};