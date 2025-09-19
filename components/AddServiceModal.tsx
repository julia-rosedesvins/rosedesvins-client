import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddServiceModal = ({ isOpen, onClose }: AddServiceModalProps) => {
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    nombrePersonnes: "",
    prix: "",
    temps: "",
    vinsDesgustes: "",
    langues: {
      francais: true,
      anglais: false,
      allemand: false,
      espagnol: false,
      autre: false
    },
    autreLangue: ""
  });

  const handleLangueChange = (langue: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      langues: {
        ...prev.langues,
        [langue]: checked
      }
    }));
  };

  const handleSubmit = () => {
    // Logic to handle form submission
    console.log("Form data:", formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs sm:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <DialogHeader className="text-white p-3 lg:p-4 -m-6 mb-4 lg:mb-6 rounded-t-lg" style={{ backgroundColor: '#3A7B59' }}>
          <DialogTitle className="text-center text-base lg:text-lg">
            Ajouter une prestation œnotouristique
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 lg:space-y-6 p-1">
          {/* Nom de la prestation */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Label className="w-full sm:w-48 font-semibold sm:text-right text-sm lg:text-base">Nom de la prestation</Label>
            <Input
              value={formData.nom}
              onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
              placeholder="Visite libre et dégustation de vins"
              className="flex-1 text-sm lg:text-base"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
            <Label className="w-full sm:w-48 font-semibold sm:text-right sm:pt-2 text-sm lg:text-base">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Une expérience unique avec la visite libre de notre cave troglodytique sculptée, suivie d'une dégustation commentée de 5 vins dans notre caveau à l'ambiance feutrée, éclairé à la bougie."
              rows={3}
              className="flex-1 text-sm lg:text-base"
            />
          </div>

          {/* Nombre de personnes */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Label className="w-full sm:w-48 font-semibold sm:text-right text-sm lg:text-base">Nombre de personnes</Label>
            <Input
              value={formData.nombrePersonnes}
              onChange={(e) => setFormData(prev => ({ ...prev, nombrePersonnes: e.target.value }))}
              placeholder="1-10"
              className="w-full sm:w-20 text-sm lg:text-base"
            />
          </div>

          {/* Prix et Temps */}
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Label className="w-full sm:w-48 font-semibold sm:text-right text-sm lg:text-base">Prix / pers.</Label>
              <Input
                value={formData.prix}
                onChange={(e) => setFormData(prev => ({ ...prev, prix: e.target.value }))}
                placeholder="5 euros"
                className="w-full sm:w-32 text-sm lg:text-base"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Label className="font-semibold text-sm lg:text-base">Temps de la prestation (en minutes)</Label>
              <Input
                value={formData.temps}
                onChange={(e) => setFormData(prev => ({ ...prev, temps: e.target.value }))}
                placeholder="60"
                className="w-full sm:w-20 text-sm lg:text-base"
              />
            </div>
          </div>

          {/* Vins dégustés */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Label className="w-full sm:w-48 font-semibold sm:text-right text-sm lg:text-base">
              Nombre de vins dégustés
            </Label>
            <Input
              value={formData.vinsDesgustes}
              onChange={(e) => setFormData(prev => ({ ...prev, vinsDesgustes: e.target.value }))}
              placeholder="5"
              className="w-full sm:w-20 text-sm lg:text-base"
            />
          </div>

          {/* Langues proposées */}
          <div className="flex flex-col sm:flex-row sm:items-start space-y-2 sm:space-y-0 sm:space-x-4">
            <Label className="w-full sm:w-48 font-semibold sm:text-right sm:pt-2 text-sm lg:text-base">Langues proposées</Label>
            <div className="flex-1 space-y-3">
              <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-3 lg:gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="francais"
                    checked={formData.langues.francais}
                    onCheckedChange={(checked) => handleLangueChange('francais', checked as boolean)}
                  />
                  <Label htmlFor="francais" className="text-sm lg:text-base">Français</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anglais"
                    checked={formData.langues.anglais}
                    onCheckedChange={(checked) => handleLangueChange('anglais', checked as boolean)}
                  />
                  <Label htmlFor="anglais" className="text-sm lg:text-base">Anglais</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="allemand"
                    checked={formData.langues.allemand}
                    onCheckedChange={(checked) => handleLangueChange('allemand', checked as boolean)}
                  />
                  <Label htmlFor="allemand" className="text-sm lg:text-base">Allemand</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="espagnol"
                    checked={formData.langues.espagnol}
                    onCheckedChange={(checked) => handleLangueChange('espagnol', checked as boolean)}
                  />
                  <Label htmlFor="espagnol" className="text-sm lg:text-base">Espagnol</Label>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Checkbox
                  id="autre"
                  checked={formData.langues.autre}
                  onCheckedChange={(checked) => handleLangueChange('autre', checked as boolean)}
                />
                <Label htmlFor="autre" className="text-sm lg:text-base">Autre :</Label>
                <Input
                  value={formData.autreLangue}
                  onChange={(e) => setFormData(prev => ({ ...prev, autreLangue: e.target.value }))}
                  disabled={!formData.langues.autre}
                  className="w-full sm:w-32 text-sm lg:text-base"
                />
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4 lg:pt-6">
            <Button 
              onClick={handleSubmit} 
              className="text-white hover:opacity-90 px-6 lg:px-8 text-sm lg:text-base order-2 sm:order-1"
              style={{ backgroundColor: '#3A7B59' }}
            >
              Ajouter
            </Button>
            <Button 
              onClick={onClose} 
              className="bg-gray-400 text-white hover:bg-gray-500 px-6 lg:px-8 text-sm lg:text-base order-1 sm:order-2"
            >
              Supprimer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};