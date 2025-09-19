import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export const AgendaSection = () => {
  return (
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
        >
          Connecter mon agenda
        </Button>
      </CardContent>
    </Card>
  );
};