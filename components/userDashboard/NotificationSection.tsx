'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const NotificationSection = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg lg:text-xl">Préférences de notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 lg:space-y-6">
        <p className="text-muted-foreground text-sm lg:text-base">
          Les notifications seront automatiquement envoyées par e-mail à la personne ayant effectué la réservation, ainsi qu'à vous-même.
        </p>
        
        <div className="space-y-6 lg:space-y-8">
          <div className="space-y-3 lg:space-y-4">
            <Label className="text-sm lg:text-base font-medium">Combien de temps avant le début de la réservation pour le client ?</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div className="flex items-center space-x-2 p-2 lg:p-0">
                <Checkbox id="client-1hour" />
                <Label htmlFor="client-1hour" className="text-sm lg:text-base">1 heure</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 lg:p-0">
                <Checkbox id="client-2hours" />
                <Label htmlFor="client-2hours" className="text-sm lg:text-base">2 heures</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 lg:p-0">
                <Checkbox id="client-veille" defaultChecked />
                <Label htmlFor="client-veille" className="text-sm lg:text-base">La veille</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 lg:p-0">
                <Checkbox id="client-jamais" />
                <Label htmlFor="client-jamais" className="text-sm lg:text-base">Jamais</Label>
              </div>
            </div>
          </div>

          <div className="space-y-3 lg:space-y-4">
            <Label className="text-sm lg:text-base font-medium">Combien de temps avant le début de la réservation pour vous ?</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div className="flex items-center space-x-2 p-2 lg:p-0">
                <Checkbox id="owner-1hour" />
                <Label htmlFor="owner-1hour" className="text-sm lg:text-base">1 heure</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 lg:p-0">
                <Checkbox id="owner-2hours" />
                <Label htmlFor="owner-2hours" className="text-sm lg:text-base">2 heures</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 lg:p-0">
                <Checkbox id="owner-veille" defaultChecked />
                <Label htmlFor="owner-veille" className="text-sm lg:text-base">La veille</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 lg:p-0">
                <Checkbox id="owner-jamais" />
                <Label htmlFor="owner-jamais" className="text-sm lg:text-base">Jamais</Label>
              </div>
            </div>
          </div>

          <div className="space-y-3 lg:space-y-4">
            <Label className="text-sm lg:text-base font-medium">Jusqu'à quel moment un client peut-il réserver avant le début d'une visite ?</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
              <div className="flex items-center space-x-2 p-2 lg:p-0">
                <Checkbox id="reservation-1hour" />
                <Label htmlFor="reservation-1hour" className="text-sm lg:text-base">1 heure</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 lg:p-0">
                <Checkbox id="reservation-2hours" />
                <Label htmlFor="reservation-2hours" className="text-sm lg:text-base">2 heures</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 lg:p-0">
                <Checkbox id="reservation-veille" />
                <Label htmlFor="reservation-veille" className="text-sm lg:text-base">La veille</Label>
              </div>
              <div className="flex items-center space-x-2 p-2 lg:p-0">
                <Checkbox id="reservation-derniere" defaultChecked />
                <Label htmlFor="reservation-derniere" className="text-sm lg:text-base">Dernière minute</Label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};