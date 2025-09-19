import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

interface Prestation {
  id: number;
  name: string;
  description: string;
  price: string;
  duration: string;
  numberOfPeople?: string;
  winesTasted?: string;
  languages?: {
    francais: boolean;
    anglais: boolean;
    allemand: boolean;
    espagnol: boolean;
    autre: boolean;
  };
  otherLanguage?: string;
}

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  prestation: Prestation | null;
  onSave: (updatedPrestation: Prestation) => void;
}

export const EditServiceModal = ({ isOpen, onClose, prestation, onSave }: EditServiceModalProps) => {
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

  useEffect(() => {
    if (prestation) {
      // Convertir les données de la prestation en format du formulaire
      setFormData({
        nom: prestation.name,
        description: prestation.description,
        nombrePersonnes: prestation.numberOfPeople || "2-8",
        prix: prestation.price,
        temps: prestation.duration.replace(/[^\d]/g, ''), // Extraire les chiffres
        vinsDesgustes: prestation.winesTasted || "5",
        langues: prestation.languages || {
          francais: true,
          anglais: false,
          allemand: false,
          espagnol: false,
          autre: false
        },
        autreLangue: prestation.otherLanguage || ""
      });
    }
  }, [prestation]);

  const handleLangueChange = (langue: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      langues: {
        ...prev.langues,
        [langue]: checked
      }
    }));
  };

  const handleSave = () => {
    if (prestation) {
      const updatedPrestation: Prestation = {
        ...prestation,
        name: formData.nom,
        description: formData.description,
        price: formData.prix,
        duration: `${formData.temps} min`,
        numberOfPeople: formData.nombrePersonnes,
        winesTasted: formData.vinsDesgustes,
        languages: formData.langues,
        otherLanguage: formData.autreLangue
      };
      onSave(updatedPrestation);
    }
    onClose();
  };

  const handleDelete = () => {
    // Logic pour supprimer la prestation
    console.log("Supprimer la prestation:", prestation?.id);
    onClose();
  };

  if (!prestation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-white p-4 -m-6 mb-6 rounded-t-lg" style={{ backgroundColor: '#3A7B5A' }}>
          <DialogTitle className="text-center text-lg">
            Modifier une prestation œnotouristique
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-1">
          {/* Nom de la prestation */}
          <div className="flex items-center space-x-4">
            <Label className="w-48 font-semibold text-right">Nom de la prestation</Label>
            <Input
              value={formData.nom}
              onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
              placeholder="Visite et dégustation de vins"
              className="flex-1"
            />
          </div>

          {/* Description */}
          <div className="flex items-start space-x-4">
            <Label className="w-48 font-semibold text-right pt-2">Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Une expérience unique avec la visite libre de notre cave troglodytique sculptée, suivie d'une dégustation commentée de 5 vins dans notre caveau à l'ambiance feutrée, éclairé à la bougie."
              rows={3}
              className="flex-1"
            />
          </div>

          {/* Nombre de personnes */}
          <div className="flex items-center space-x-4">
            <Label className="w-48 font-semibold text-right">Nombre de personnes</Label>
            <Input
              value={formData.nombrePersonnes}
              onChange={(e) => setFormData(prev => ({ ...prev, nombrePersonnes: e.target.value }))}
              placeholder="2-8"
              className="w-24"
            />
          </div>

          {/* Prix et Temps */}
          <div className="flex items-center space-x-4">
            <Label className="w-48 font-semibold text-right">Prix / pers.</Label>
            <Input
              value={formData.prix}
              onChange={(e) => setFormData(prev => ({ ...prev, prix: e.target.value }))}
              placeholder="5 euros"
              className="w-32"
            />
            <Label className="font-semibold ml-8">Temps de la prestation (en minutes)</Label>
            <Input
              value={formData.temps}
              onChange={(e) => setFormData(prev => ({ ...prev, temps: e.target.value }))}
              placeholder="60"
              className="w-24"
            />
          </div>

          {/* Vins dégustés */}
          <div className="flex items-center space-x-4">
            <Label className="w-48 font-semibold text-right">
              Si une dégustation de vins est inclus, nombre de vins dégustés
            </Label>
            <Input
              value={formData.vinsDesgustes}
              onChange={(e) => setFormData(prev => ({ ...prev, vinsDesgustes: e.target.value }))}
              placeholder="5"
              className="w-20"
            />
          </div>

          {/* Langues proposées */}
          <div className="flex items-start space-x-4">
            <Label className="w-48 font-semibold text-right pt-2">Langues proposées</Label>
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-francais"
                    checked={formData.langues.francais}
                    onCheckedChange={(checked) => handleLangueChange('francais', checked as boolean)}
                  />
                  <Label htmlFor="edit-francais">Français</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-anglais"
                    checked={formData.langues.anglais}
                    onCheckedChange={(checked) => handleLangueChange('anglais', checked as boolean)}
                  />
                  <Label htmlFor="edit-anglais">Anglais</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-allemand"
                    checked={formData.langues.allemand}
                    onCheckedChange={(checked) => handleLangueChange('allemand', checked as boolean)}
                  />
                  <Label htmlFor="edit-allemand">Allemand</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="edit-espagnol"
                    checked={formData.langues.espagnol}
                    onCheckedChange={(checked) => handleLangueChange('espagnol', checked as boolean)}
                  />
                  <Label htmlFor="edit-espagnol">Espagnol</Label>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-autre"
                  checked={formData.langues.autre}
                  onCheckedChange={(checked) => handleLangueChange('autre', checked as boolean)}
                />
                <Label htmlFor="edit-autre">Autre :</Label>
                <Input
                  value={formData.autreLangue}
                  onChange={(e) => setFormData(prev => ({ ...prev, autreLangue: e.target.value }))}
                  disabled={!formData.langues.autre}
                  className="w-32"
                />
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-center space-x-4 pt-6">
            <Button onClick={handleSave} className="text-white hover:opacity-90 px-8" style={{ backgroundColor: '#3A7B5A' }}>
              Ajouter
            </Button>
            <Button onClick={handleDelete} className="bg-gray-400 text-white hover:bg-gray-500 px-8">
              Supprimer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};