"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, CalendarDays, CalendarCheck, CalendarClock, User, Lock } from "lucide-react";
import { useState } from "react";

export const AgendaSection = () => {
  const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false);
  const [isOrangeLoginOpen, setIsOrangeLoginOpen] = useState(false);
  const [orangeCredentials, setOrangeCredentials] = useState({
    username: "",
    password: ""
  });

  const handleCalendarConnect = (calendarType: string) => {
    if (calendarType === 'Orange') {
      setIsCalendarDialogOpen(false);
      setIsOrangeLoginOpen(true);
    } else {
      console.log(`Connecting to ${calendarType} calendar`);
      // Here you would implement the actual calendar connection logic
      setIsCalendarDialogOpen(false);
    }
  };

  const handleOrangeLogin = () => {
    console.log('Orange login:', orangeCredentials);
    // Here you would implement the actual Orange calendar connection logic
    setOrangeCredentials({ username: "", password: "" });
    setIsOrangeLoginOpen(false);
  };

  return (
    <>
      <Card className="mb-6 lg:mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-lg lg:text-xl">
            <Calendar className="h-4 w-4 lg:h-5 lg:w-5" />
            <span>Agenda</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 lg:space-y-6">
          <p className="text-muted-foreground text-sm lg:text-base">
            Connectez votre agenda personnel (Google Agenda, Outlook, etc.) pour synchroniser automatiquement vos disponibilités et éviter les doublons de réservation.
          </p>
          <Button 
            className="text-white hover:opacity-90 w-full sm:w-auto text-sm lg:text-base px-4 lg:px-6 py-3 lg:py-2"
            style={{ backgroundColor: '#3A7B59' }}
            onClick={() => setIsCalendarDialogOpen(true)}
          >
            Connecter mon agenda
          </Button>
        </CardContent>
      </Card>

      {/* Calendar Connection Dialog */}
      <Dialog open={isCalendarDialogOpen} onOpenChange={setIsCalendarDialogOpen}>
        <DialogContent className="w-[95vw] max-w-md h-auto overflow-hidden flex flex-col rounded-xl shadow-2xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fixed">
          {/* Enhanced Header */}
          <DialogHeader className="relative text-white p-4 sm:p-6 -mx-6 -mt-6 mb-4 sm:mb-6 rounded-t-xl bg-gradient-to-r from-[#3A7B59] to-[#2d5a43] shrink-0">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
              <DialogTitle className="text-lg sm:text-xl font-semibold text-center">
                Connecter votre agenda
              </DialogTitle>
            </div>
          </DialogHeader>

          {/* Calendar Options */}
          <div className="flex-1 px-6 py-2">
            <div className="space-y-4 w-full">
              <p className="text-sm text-gray-600 text-center mb-6">
                Choisissez votre fournisseur de calendrier pour synchroniser vos disponibilités
              </p>

              {/* Orange Calendar */}
              <Button
                onClick={() => handleCalendarConnect('Orange')}
                variant="outline"
                className="w-full flex items-center justify-start p-4 h-auto border-2 border-gray-200 hover:border-[#3A7B59] hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5 text-orange-600" />
                  </div>
                  <span className="font-medium text-gray-700">Calendrier Orange</span>
                </div>
              </Button>

              {/* OVH Calendar */}
              <Button
                onClick={() => handleCalendarConnect('OVH')}
                variant="outline"
                className="w-full flex items-center justify-start p-4 h-auto border-2 border-gray-200 hover:border-[#3A7B59] hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
                    <CalendarCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-700">Calendrier OVH</span>
                </div>
              </Button>

              {/* Microsoft Calendar */}
              <Button
                onClick={() => handleCalendarConnect('Microsoft')}
                variant="outline"
                className="w-full flex items-center justify-start p-4 h-auto border-2 border-gray-200 hover:border-[#3A7B59] hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
                    <CalendarClock className="w-5 h-5 text-blue-700" />
                  </div>
                  <span className="font-medium text-gray-700">Calendrier Microsoft</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 flex justify-center pt-4 sm:pt-6 px-6 pb-6 border-t border-gray-200 -mx-6 -mb-6">
            <Button 
              onClick={() => setIsCalendarDialogOpen(false)}
              variant="outline"
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 border-2 border-gray-300 hover:bg-gray-50 font-medium text-sm sm:text-base"
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Orange Login Modal */}
      <Dialog open={isOrangeLoginOpen} onOpenChange={setIsOrangeLoginOpen}>
        <DialogContent className="w-[95vw] max-w-md h-auto overflow-hidden flex flex-col rounded-xl shadow-2xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fixed">
          {/* Enhanced Header */}
          <DialogHeader className="relative text-white p-4 sm:p-6 -mx-6 -mt-6 mb-4 sm:mb-6 rounded-t-xl bg-gradient-to-r from-orange-500 to-orange-600 shrink-0">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
              <DialogTitle className="text-lg sm:text-xl font-semibold text-center">
                Connexion Orange Calendar
              </DialogTitle>
            </div>
          </DialogHeader>

          {/* Login Form */}
          <div className="flex-1 px-6 py-2">
            <div className="space-y-6 w-full">
              <p className="text-sm text-gray-600 text-center mb-6">
                Connectez-vous à votre compte Orange pour synchroniser votre calendrier
              </p>

              {/* Username Field */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User size={14} className="shrink-0" />
                  Nom d'utilisateur *
                </Label>
                <Input
                  type="text"
                  value={orangeCredentials.username}
                  onChange={(e) => setOrangeCredentials(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="Votre nom d'utilisateur Orange"
                  className="w-full text-sm sm:text-base border-2 focus:border-orange-500 rounded-lg h-11 sm:h-auto"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock size={14} className="shrink-0" />
                  Mot de passe *
                </Label>
                <Input
                  type="password"
                  value={orangeCredentials.password}
                  onChange={(e) => setOrangeCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Votre mot de passe Orange"
                  className="w-full text-sm sm:text-base border-2 focus:border-orange-500 rounded-lg h-11 sm:h-auto"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 px-6 pb-6 border-t border-gray-200 -mx-6 -mb-6">
            <Button 
              onClick={() => setIsOrangeLoginOpen(false)}
              variant="outline"
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 border-2 border-gray-300 hover:bg-gray-50 font-medium text-sm sm:text-base"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleOrangeLogin}
              disabled={!orangeCredentials.username || !orangeCredentials.password}
              className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium shadow-lg text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Connecter
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};