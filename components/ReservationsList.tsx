'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Clock, Users, Grape, Globe, MessageCircle, Download, CalendarIcon } from "lucide-react";
import { useState } from "react";
import { ReservationDetailsModal } from "./ReservationDetailsModal";
import { cn } from "@/lib/utils";

export const ReservationsList = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1)); // July 1, 2025
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        comments: "Oui"
      },
      {
        id: 3,
        time: "16:30",
        people: 4,
        activity: "Atelier vins & fromages",
        language: "FR",
        comments: "Aucun"
      }
    ],
    3: [ // 3 juillet = 1er jeudi du mois - 1 réservation
      {
        id: 4,
        time: "10:30",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Nous serons accompagnés de notre petit chien."
      }
    ],
    4: [ // Vendredi - 3 réservations
      {
        id: 5,
        time: "10:00",
        people: 2,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 6,
        time: "14:00",
        people: 6,
        activity: "Atelier vins & fromage",
        language: "EN",
        comments: "Aucun"
      },
      {
        id: 7,
        time: "16:30",
        people: 3,
        activity: "Visite de cave et dégustation",
        language: "EN",
        comments: "Allergie aux noix"
      }
    ],
    5: [ // 5 juillet = 1er samedi du mois - 3 réservations
      {
        id: 8,
        time: "10:00",
        people: 2,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 9,
        time: "14:00",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "EN",
        comments: "Aucun"
      },
      {
        id: 10,
        time: "16:30",
        people: 3,
        activity: "Atelier vins & fromages",
        language: "FR",
        comments: "Aucun"
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
        comments: "Aucun"
      }
    ],
    8: [
      {
        id: 10,
        time: "14:00",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Aucun"
      }
    ],
    9: [ // Mercredi - 2 réservations
      {
        id: 11,
        time: "11:00",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Végétarien"
      },
      {
        id: 12,
        time: "15:30",
        people: 5,
        activity: "Atelier vins & fromages",
        language: "EN",
        comments: "Aucun"
      }
    ],
    10: [
      {
        id: 13,
        time: "10:00",
        people: 2,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      }
    ],
    11: [ // Vendredi - 3 réservations
      {
        id: 14,
        time: "09:30",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "EN",
        comments: "Aucun"
      },
      {
        id: 15,
        time: "14:30",
        people: 2,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Première visite"
      },
      {
        id: 16,
        time: "16:30",
        people: 5,
        activity: "Atelier vins & fromages",
        language: "FR",
        comments: "Aucun"
      }
    ],
    12: [
      {
        id: 17,
        time: "11:00",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
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
        comments: "Aucun"
      }
    ],
    15: [
      {
        id: 19,
        time: "11:00",
        people: 6,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Aucun"
      }
    ],
    16: [ // Mercredi - 2 réservations
      {
        id: 20,
        time: "10:30",
        people: 2,
        activity: "Dégustation de vins",
        language: "EN",
        comments: "Aucun"
      },
      {
        id: 21,
        time: "14:30",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Groupe d'étudiants"
      }
    ],
    17: [
      {
        id: 22,
        time: "10:30",
        people: 4,
        activity: "Atelier vins & fromages",
        language: "FR",
        comments: "Aucun"
      }
    ],
    18: [ // Vendredi - 3 réservations
      {
        id: 23,
        time: "09:00",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 24,
        time: "11:30",
        people: 2,
        activity: "Visite de cave et dégustation",
        language: "EN",
        comments: "Lune de miel"
      },
      {
        id: 25,
        time: "16:00",
        people: 5,
        activity: "Atelier vins & fromages",
        language: "FR",
        comments: "Aucun"
      }
    ],
    19: [
      {
        id: 26,
        time: "16:00",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
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
        comments: "Aucun"
      }
    ],
    22: [
      {
        id: 28,
        time: "11:30",
        people: 4,
        activity: "Dégustation de vins",
        language: "EN",
        comments: "Aucun"
      }
    ],
    23: [ // Mercredi - 2 réservations
      {
        id: 29,
        time: "10:00",
        people: 3,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 30,
        time: "15:30",
        people: 5,
        activity: "Atelier vins & fromages",
        language: "EN",
        comments: "Anniversaire"
      }
    ],
    24: [
      {
        id: 31,
        time: "11:00",
        people: 2,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      }
    ],
    25: [ // Vendredi - 3 réservations
      {
        id: 32,
        time: "10:00",
        people: 2,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 33,
        time: "14:00",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "EN",
        comments: "Aucun"
      },
      {
        id: 34,
        time: "16:30",
        people: 6,
        activity: "Atelier vins & fromages",
        language: "FR",
        comments: "Entreprise"
      }
    ],
    26: [
      {
        id: 35,
        time: "14:00",
        people: 6,
        activity: "Atelier vins & fromages",
        language: "EN",
        comments: "Aucun"
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
        comments: "Aucun"
      }
    ],
    29: [
      {
        id: 37,
        time: "16:30",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "EN",
        comments: "Aucun"
      }
    ],
    30: [ // Mercredi - 2 réservations
      {
        id: 38,
        time: "11:30",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 39,
        time: "15:00",
        people: 2,
        activity: "Visite de cave et dégustation",
        language: "EN",
        comments: "Aucun"
      }
    ],
    31: [
      {
        id: 40,
        time: "15:00",
        people: 2,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      }
    ]
  };

  // Données pour octobre 2025
  const octoberEvents = {
    // 1 octobre = Mercredi - 2 réservations
    1: [
      {
        id: 41,
        time: "11:00",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 42,
        time: "15:30",
        people: 4,
        activity: "Atelier vins & fromages",
        language: "EN",
        comments: "Aucun"
      }
    ],
    // 2 octobre = Premier jeudi - 1 réservation (supprimé 1 réservation)
    2: [
      {
        id: 43,
        time: "14:00",
        people: 2,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Aucun"
      }
    ],
    // 3 octobre = Vendredi - 3 réservations
    3: [
      {
        id: 44,
        time: "09:30",
        people: 4,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 45,
        time: "14:30",
        people: 3,
        activity: "Visite de cave et dégustation",
        language: "EN",
        comments: "Aucun"
      },
      {
        id: 46,
        time: "16:30",
        people: 5,
        activity: "Atelier vins & fromages",
        language: "FR",
        comments: "Aucun"
      }
    ],
    // 4 octobre = Samedi - 2 réservations
    4: [
      {
        id: 47,
        time: "11:00",
        people: 2,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 48,
        time: "16:00",
        people: 6,
        activity: "Atelier vins & fromages",
        language: "EN",
        comments: "Aucun"
      }
    ],
    // 6 octobre = Lundi - 1 réservation
    6: [
      {
        id: 49,
        time: "15:00",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      }
    ],
    // 7 octobre = Mardi - 2 réservations
    7: [
      {
        id: 50,
        time: "10:30",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 51,
        time: "14:30",
        people: 2,
        activity: "Dégustation de vins",
        language: "EN",
        comments: "Aucun"
      }
    ],
    // 8 octobre = Mercredi - 1 réservation
    8: [
      {
        id: 53,
        time: "11:30",
        people: 3,
        activity: "Atelier vins & fromages",
        language: "FR",
        comments: "Aucun"
      }
    ],
    // 9 octobre = Jeudi - 1 réservation
    9: [
      {
        id: 54,
        time: "14:00",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Aucun"
      }
    ],
    // 10 octobre = Vendredi - 2 réservations
    10: [
      {
        id: 55,
        time: "10:00",
        people: 2,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 56,
        time: "16:30",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "EN",
        comments: "Aucun"
      }
    ],
    // 11 octobre = Samedi - 3 réservations
    11: [
      {
        id: 57,
        time: "10:00",
        people: 2,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 58,
        time: "14:00",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 59,
        time: "16:30",
        people: 6,
        activity: "Atelier vins & fromages",
        language: "FR",
        comments: "Aucun"
      }
    ],
    // 14 octobre = Mardi - 1 réservation
    14: [
      {
        id: 58,
        time: "15:00",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      }
    ],
    // 15 octobre = Mercredi - 2 réservations
    15: [
      {
        id: 59,
        time: "11:00",
        people: 6,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 60,
        time: "16:00",
        people: 2,
        activity: "Dégustation de vins",
        language: "EN",
        comments: "Aucun"
      }
    ],
    // 16 octobre = Jeudi - 2 réservations
    16: [
      {
        id: 62,
        time: "10:30",
        people: 2,
        activity: "Dégustation de vins",
        language: "EN",
        comments: "Aucun"
      },
      {
        id: 63,
        time: "14:30",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Groupe d'étudiants"
      }
    ],
    // 17 octobre = Vendredi - 5 réservations
    17: [
      {
        id: 64,
        time: "09:00",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 65,
        time: "11:30",
        people: 2,
        activity: "Visite de cave et dégustation",
        language: "EN",
        comments: "Lune de miel"
      },
      {
        id: 66,
        time: "16:00",
        people: 5,
        activity: "Atelier vins & fromages",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 67,
        time: "13:30",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 68,
        time: "15:00",
        people: 3,
        activity: "Dégustation de vins",
        language: "EN",
        comments: "Aucun"
      }
    ],
    // 18 octobre = Samedi - 2 réservations
    18: [
      {
        id: 66,
        time: "11:00",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 67,
        time: "15:30",
        people: 4,
        activity: "Atelier vins & fromages",
        language: "EN",
        comments: "Aucun"
      }
    ],
    // 20 octobre = Lundi - 1 réservation
    20: [
      {
        id: 69,
        time: "15:30",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Aucun"
      }
    ],
    // 21 octobre = Mardi - 1 réservation
    21: [
      {
        id: 68,
        time: "14:00",
        people: 4,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      }
    ],
    // 22 octobre = Mercredi - 2 réservations
    22: [
      {
        id: 69,
        time: "10:00",
        people: 3,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 70,
        time: "15:30",
        people: 5,
        activity: "Atelier vins & fromages",
        language: "EN",
        comments: "Anniversaire"
      }
    ],
    // 23 octobre = Jeudi - 2 réservations
    23: [
      {
        id: 72,
        time: "14:30",
        people: 3,
        activity: "Dégustation de vins",
        language: "EN",
        comments: "Aucun"
      },
      {
        id: 73,
        time: "16:00",
        people: 4,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      }
    ],
    // 24 octobre = Vendredi - 3 réservations
    24: [
      {
        id: 74,
        time: "10:00",
        people: 2,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 75,
        time: "14:00",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "EN",
        comments: "Aucun"
      },
      {
        id: 76,
        time: "16:30",
        people: 6,
        activity: "Atelier vins & fromages",
        language: "FR",
        comments: "Entreprise"
      }
    ],
    // 25 octobre = Samedi - 4 réservations
    25: [
      {
        id: 77,
        time: "14:00",
        people: 6,
        activity: "Atelier vins & fromages",
        language: "EN",
        comments: "Aucun"
      },
      {
        id: 78,
        time: "16:30",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 79,
        time: "11:00",
        people: 2,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 80,
        time: "15:30",
        people: 4,
        activity: "Dégustation de vins",
        language: "EN",
        comments: "Aucun"
      }
    ],
    // 28 octobre = Mardi - 2 réservations
    28: [
      {
        id: 77,
        time: "11:00",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 83,
        time: "15:30",
        people: 4,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      }
    ],
    // 29 octobre = Mercredi - 2 réservations
    29: [
      {
        id: 78,
        time: "11:30",
        people: 3,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 79,
        time: "15:00",
        people: 2,
        activity: "Visite de cave et dégustation",
        language: "EN",
        comments: "Aucun"
      }
    ],
    // 30 octobre = Jeudi - 1 réservation
    30: [
      {
        id: 80,
        time: "15:00",
        people: 2,
        activity: "Dégustation de vins",
        language: "FR",
        comments: "Aucun"
      }
    ],
    // 31 octobre = Vendredi - 2 réservations
    31: [
      {
        id: 81,
        time: "10:30",
        people: 4,
        activity: "Visite de cave et dégustation",
        language: "FR",
        comments: "Aucun"
      },
      {
        id: 82,
        time: "16:00",
        people: 3,
        activity: "Atelier vins & fromages",
        language: "EN",
        comments: "Halloween"
      }
    ]
  };

  // Fonction pour vérifier si c'est un dimanche (jour 0)
  const isSunday = (date: Date) => date.getDay() === 0;

  // Récupérer les réservations pour le jour sélectionné
  // RÈGLE : Aucune réservation le dimanche
  let rawReservations = [];
  if (currentDate.getMonth() === 9) { // Octobre - données spécifiques
    rawReservations = octoberEvents[currentDate.getDate() as keyof typeof octoberEvents] || [];
  } else { // Tous les autres mois utilisent les données par défaut
    rawReservations = allEvents[currentDate.getDate() as keyof typeof allEvents] || [];
  }
  const reservations = isSunday(currentDate) ? [] : rawReservations;

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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReservation(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl">Réservations</CardTitle>
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

        {reservations.length === 0 ? (
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
                    <Button 
                      size="sm" 
                      className="text-white hover:opacity-90 text-xs px-3 py-1"
                      style={{ backgroundColor: '#3A7B59' }}
                      onClick={() => handleReservationClick(reservation)}
                    >
                      Détails
                    </Button>
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
                      <span className="text-sm text-gray-600">{reservation.comments}</span>
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
                        {reservation.activity}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium text-base px-4 py-4">
                      {reservation.language}
                    </TableCell>
                    <TableCell className="text-center text-sm px-4 py-4">
                      <div className="max-w-[150px] mx-auto">
                        {reservation.comments}
                      </div>
                    </TableCell>
                    <TableCell className="text-center px-4 py-4">
                      <Button 
                        size="sm" 
                        className="text-white hover:opacity-90 px-4 py-2"
                        style={{ backgroundColor: '#3A7B59' }}
                        onClick={() => handleReservationClick(reservation)}
                      >
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex justify-end mt-4 lg:mt-6">
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
        </div>
      </CardContent>
      
      <ReservationDetailsModal 
        reservation={selectedReservation}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Card>
  );
};