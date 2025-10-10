import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { X, Wine, Users, Clock, Euro, Upload, Image as ImageIcon } from "lucide-react";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (serviceData: any, serviceBanner?: File | null) => void;
}

export const AddServiceModal = ({ isOpen, onClose, onSave }: AddServiceModalProps) => {
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

  const [serviceBanner, setServiceBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, banner: "La taille du fichier ne doit pas dépasser 5MB" }));
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, banner: "Format non supporté. Utilisez JPG, PNG ou WebP" }));
        return;
      }

      setServiceBanner(file);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.banner;
        return newErrors;
      });

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBanner = () => {
    setServiceBanner(null);
    setBannerPreview(null);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.banner;
      return newErrors;
    });
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom de la prestation est requis";
    } else if (formData.nom.trim().length < 5) {
      newErrors.nom = "Le nom de la prestation doit contenir au moins 5 caractères";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "La description est requise";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "La description doit contenir au moins 20 caractères";
    }
    if (!formData.nombrePersonnes || parseInt(formData.nombrePersonnes) < 1) {
      newErrors.nombrePersonnes = "Veuillez indiquer un nombre valide";
    }
    if (!formData.prix || parseFloat(formData.prix) < 0) {
      newErrors.prix = "Veuillez indiquer un prix valide";
    }
    if (!formData.temps || parseInt(formData.temps) < 1) {
      newErrors.temps = "Veuillez indiquer une durée valide";
    }
    if (!formData.vinsDesgustes || parseInt(formData.vinsDesgustes) < 0) {
      newErrors.vinsDesgustes = "Veuillez indiquer un nombre valide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    if (!validateForm()) {
      return;
    }

    // Transform form data to match the expected format
    const selectedLanguages = Object.entries(formData.langues)
      .filter(([_, selected]) => selected)
      .map(([langue, _]) => langue === 'francais' ? 'French' : 
                           langue === 'anglais' ? 'English' :
                           langue === 'allemand' ? 'German' :
                           langue === 'espagnol' ? 'Spanish' : langue);
    
    if (formData.langues.autre && formData.autreLangue.trim()) {
      selectedLanguages.push(formData.autreLangue.trim());
    }

    const serviceData = {
      serviceName: formData.nom,
      serviceDescription: formData.description,
      numberOfPeople: parseInt(formData.nombrePersonnes) || 1,
      pricePerPerson: parseFloat(formData.prix) || 0,
      timeOfServiceInMinutes: parseInt(formData.temps) || 30,
      numberOfWinesTasted: parseInt(formData.vinsDesgustes) || 0,
      languagesOffered: selectedLanguages,
      isActive: true
    };
    
    console.log("Service data:", serviceData);
    console.log("Service banner:", serviceBanner);
    
    if (onSave) {
      onSave(serviceData, serviceBanner);
    }    // Reset form and errors
    setFormData({
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
    setServiceBanner(null);
    setBannerPreview(null);
    setErrors({});
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-6xl h-[95vh] max-h-[95vh] overflow-hidden flex flex-col rounded-xl shadow-2xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fixed">
        {/* Enhanced Header */}
        <DialogHeader className="relative text-white p-4 sm:p-6 -mx-6 -mt-6 mb-4 sm:mb-6 rounded-t-xl bg-gradient-to-r from-[#3A7B59] to-[#2d5a43] shrink-0">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <Wine className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
            <DialogTitle className="text-lg sm:text-xl font-semibold text-center">
              Ajouter une prestation œnotouristique
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-2">
          <div className="space-y-6 sm:space-y-8 w-full max-w-full">
            {/* Service Name */}
            <div className="space-y-2 w-full">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Wine size={14} className="sm:w-4 sm:h-4 shrink-0" />
                Nom de la prestation *
              </Label>
              <Input
                value={formData.nom}
                onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                placeholder="ex: Visite libre et dégustation de vins"
                className={`w-full text-sm sm:text-base border-2 focus:border-[#3A7B59] rounded-lg h-11 sm:h-auto ${errors.nom ? 'border-red-300 focus:border-red-500' : ''}`}
              />
              {errors.nom && <p className="text-red-500 text-xs sm:text-sm">{errors.nom}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2 w-full">
              <Label className="text-sm font-semibold text-gray-700">Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Décrivez votre prestation œnotouristique en détail..."
                rows={3}
                className={`w-full text-sm sm:text-base border-2 focus:border-[#3A7B59] rounded-lg resize-none ${errors.description ? 'border-red-300 focus:border-red-500' : ''}`}
              />
              {errors.description && <p className="text-red-500 text-xs sm:text-sm">{errors.description}</p>}
            </div>

            {/* Service Banner Upload */}
            <div className="space-y-2 w-full">
              <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ImageIcon size={14} className="sm:w-4 sm:h-4 shrink-0" />
                Image de la prestation
              </Label>
              
              {!bannerPreview ? (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`w-full p-6 border-2 border-dashed rounded-lg text-center transition-colors hover:border-[#3A7B59] hover:bg-gray-50 ${errors.banner ? 'border-red-300' : 'border-gray-300'}`}>
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Cliquez pour ajouter une image de votre prestation
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG ou WebP (max. 5MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={bannerPreview}
                      alt="Aperçu de la bannière"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeBanner}
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {serviceBanner?.name}
                  </p>
                </div>
              )}
              
              {errors.banner && <p className="text-red-500 text-xs sm:text-sm">{errors.banner}</p>}
            </div>

            {/* Grid Layout for Numbers - Stack on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
              {/* Number of People */}
              <div className="space-y-2 w-full min-w-0">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users size={14} className="sm:w-4 sm:h-4 shrink-0" />
                  Nombre de personnes *
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.nombrePersonnes}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombrePersonnes: e.target.value }))}
                  placeholder="ex: 10"
                  className={`w-full text-sm sm:text-base border-2 focus:border-[#3A7B59] rounded-lg h-11 sm:h-auto ${errors.nombrePersonnes ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {errors.nombrePersonnes && <p className="text-red-500 text-xs sm:text-sm">{errors.nombrePersonnes}</p>}
              </div>

              {/* Price */}
              <div className="space-y-2 w-full min-w-0">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Euro size={14} className="sm:w-4 sm:h-4 shrink-0" />
                  Prix par personne *
                </Label>
                <div className="relative w-full">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.prix}
                    onChange={(e) => setFormData(prev => ({ ...prev, prix: e.target.value }))}
                    placeholder="ex: 15.00"
                    className={`w-full text-sm sm:text-base border-2 focus:border-[#3A7B59] rounded-lg pr-10 sm:pr-12 h-11 sm:h-auto ${errors.prix ? 'border-red-300 focus:border-red-500' : ''}`}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">€</span>
                </div>
                {errors.prix && <p className="text-red-500 text-xs sm:text-sm">{errors.prix}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
              {/* Duration */}
              <div className="space-y-2 w-full min-w-0">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Clock size={14} className="sm:w-4 sm:h-4 shrink-0" />
                  Durée (minutes) *
                </Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.temps}
                  onChange={(e) => setFormData(prev => ({ ...prev, temps: e.target.value }))}
                  placeholder="ex: 60"
                  className={`w-full text-sm sm:text-base border-2 focus:border-[#3A7B59] rounded-lg h-11 sm:h-auto ${errors.temps ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {errors.temps && <p className="text-red-500 text-xs sm:text-sm">{errors.temps}</p>}
              </div>

              {/* Number of Wines */}
              <div className="space-y-2 w-full min-w-0">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Wine size={14} className="sm:w-4 sm:h-4 shrink-0" />
                  Vins dégustés *
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.vinsDesgustes}
                  onChange={(e) => setFormData(prev => ({ ...prev, vinsDesgustes: e.target.value }))}
                  placeholder="ex: 5"
                  className={`w-full text-sm sm:text-base border-2 focus:border-[#3A7B59] rounded-lg h-11 sm:h-auto ${errors.vinsDesgustes ? 'border-red-300 focus:border-red-500' : ''}`}
                />
                {errors.vinsDesgustes && <p className="text-red-500 text-xs sm:text-sm">{errors.vinsDesgustes}</p>}
              </div>
            </div>

            {/* Languages Section */}
            <div className="space-y-3 sm:space-y-4 w-full">
              <Label className="text-sm font-semibold text-gray-700">Langues proposées</Label>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border-2 border-gray-200 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4 w-full">
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <Checkbox
                      id="francais"
                      checked={formData.langues.francais}
                      onCheckedChange={(checked) => handleLangueChange('francais', checked as boolean)}
                      className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59] w-4 h-4 sm:w-5 sm:h-5 shrink-0"
                    />
                    <Label htmlFor="francais" className="text-sm sm:text-base font-medium cursor-pointer truncate">Français</Label>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <Checkbox
                      id="anglais"
                      checked={formData.langues.anglais}
                      onCheckedChange={(checked) => handleLangueChange('anglais', checked as boolean)}
                      className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59] w-4 h-4 sm:w-5 sm:h-5 shrink-0"
                    />
                    <Label htmlFor="anglais" className="text-sm sm:text-base font-medium cursor-pointer truncate">Anglais</Label>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <Checkbox
                      id="allemand"
                      checked={formData.langues.allemand}
                      onCheckedChange={(checked) => handleLangueChange('allemand', checked as boolean)}
                      className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59] w-4 h-4 sm:w-5 sm:h-5 shrink-0"
                    />
                    <Label htmlFor="allemand" className="text-sm sm:text-base font-medium cursor-pointer truncate">Allemand</Label>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <Checkbox
                      id="espagnol"
                      checked={formData.langues.espagnol}
                      onCheckedChange={(checked) => handleLangueChange('espagnol', checked as boolean)}
                      className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59] w-4 h-4 sm:w-5 sm:h-5 shrink-0"
                    />
                    <Label htmlFor="espagnol" className="text-sm sm:text-base font-medium cursor-pointer truncate">Espagnol</Label>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 sm:space-y-3 pt-2 border-t border-gray-300 w-full">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Checkbox
                      id="autre"
                      checked={formData.langues.autre}
                      onCheckedChange={(checked) => handleLangueChange('autre', checked as boolean)}
                      className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59] w-4 h-4 sm:w-5 sm:h-5 shrink-0"
                    />
                    <Label htmlFor="autre" className="text-sm sm:text-base font-medium cursor-pointer">Autre :</Label>
                  </div>
                  <div className="w-full pl-6 sm:pl-8">
                    <Input
                      value={formData.autreLangue}
                      onChange={(e) => setFormData(prev => ({ ...prev, autreLangue: e.target.value }))}
                      disabled={!formData.langues.autre}
                      placeholder="Précisez la langue"
                      className="w-full text-sm sm:text-base border-2 focus:border-[#3A7B59] rounded-lg disabled:opacity-50 h-10 sm:h-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer - Mobile optimized */}
        <div className="shrink-0 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 px-6 pb-6 border-t border-gray-200 -mx-6 -mb-6">
          <Button 
            onClick={onClose} 
            variant="outline"
            className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 border-2 border-gray-300 hover:bg-gray-50 font-medium text-sm sm:text-base"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 bg-gradient-to-r from-[#3A7B59] to-[#2d5a43] hover:from-[#2d5a43] hover:to-[#1e3d2b] text-white font-medium shadow-lg text-sm sm:text-base"
          >
            Ajouter la prestation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};