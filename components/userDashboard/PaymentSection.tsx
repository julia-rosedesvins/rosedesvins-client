'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Banknote, Coins } from "lucide-react";

export const PaymentSection = () => {
  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl">Moyens de paiement acceptés</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 lg:space-y-6">
        <p className="text-muted-foreground text-sm lg:text-base">
          Sélectionnez les moyens de paiement que vous acceptez sur place.
        </p>
        
        <div className="space-y-3 lg:space-y-4">
          <div className="flex items-center space-x-3 p-2 lg:p-0">
            <Checkbox id="card" defaultChecked />
            <CreditCard className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
            <Label htmlFor="card" className="text-sm lg:text-base">
              Carte bancaire
            </Label>
          </div>
          
          <div className="flex items-center space-x-3 p-2 lg:p-0">
            <Checkbox id="check" />
            <Banknote className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
            <Label htmlFor="check" className="text-sm lg:text-base">
              Chèques
            </Label>
          </div>
          
          <div className="flex items-center space-x-3 p-2 lg:p-0">
            <Checkbox id="cash" />
            <Coins className="h-4 w-4 lg:h-5 lg:w-5 text-muted-foreground" />
            <Label htmlFor="cash" className="text-sm lg:text-base">
              Espèces (paiement sur place)
            </Label>
          </div>
        </div>

        <Separator className="my-4 lg:my-6" />

        <div className="space-y-3 lg:space-y-4">
          <h3 className="text-lg lg:text-2xl font-semibold leading-none tracking-tight">Prépaiements</h3>
          <p className="text-muted-foreground text-sm lg:text-base">
            Le prépaiement permet de demander aux clients immédiatement au moment de la 
            réservation en ligne le paiement de la prestation afin de valider la réservation du 
            rendez-vous.
          </p>
          
          <Button 
            className="text-white hover:opacity-90 w-full sm:w-auto text-sm lg:text-base px-4 lg:px-6 py-2 lg:py-3"
            style={{ backgroundColor: '#3A7B59' }}
          >
            Connecter à Stripe
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};