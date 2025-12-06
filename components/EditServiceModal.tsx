import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { Wine, Users, Clock, Euro, Upload, Image as ImageIcon, X } from "lucide-react";

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
  serviceBannerUrl?: string;
}

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  prestation: Prestation | null;
  onSave: (updatedServiceData: any, serviceBanner?: File | null) => void;
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

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [serviceBanner, setServiceBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size - 800KB limit
      const maxSizeKB = 800;
      const maxSizeBytes = maxSizeKB * 1024;
      const fileSizeKB = Math.round(file.size / 1024);

      if (file.size > maxSizeBytes) {
        setErrors(prev => ({ 
          ...prev, 
          banner: `L'image est trop volumineuse (${fileSizeKB} Ko). La taille maximale autorisée est de ${maxSizeKB} Ko. Veuillez compresser votre image ou en choisir une plus légère.` 
        }));
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

  const resetForm = () => {
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
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Validate service name (min 5, max 100 characters)
    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom de la prestation est requis";
    } else if (formData.nom.trim().length < 5) {
      newErrors.nom = "Le nom doit contenir au moins 5 caractères";
    } else if (formData.nom.trim().length > 100) {
      newErrors.nom = "Le nom ne doit pas dépasser 100 caractères";
    }
    
    // Validate description (min 20, max 1000 characters)
    if (!formData.description.trim()) {
      newErrors.description = "La description est requise";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "La description doit contenir au moins 20 caractères";
    } else if (formData.description.trim().length > 1000) {
      newErrors.description = "La description ne doit pas dépasser 1000 caractères";
    }
    
    // Validate number of people (1-100)
    const nombrePersonnes = parseInt(formData.nombrePersonnes);
    if (!formData.nombrePersonnes || isNaN(nombrePersonnes) || nombrePersonnes < 1) {
      newErrors.nombrePersonnes = "Le nombre de personnes doit être au moins 1";
    } else if (nombrePersonnes > 100) {
      newErrors.nombrePersonnes = "Le nombre de personnes ne doit pas dépasser 100";
    }
    
    // Validate price (0-10000)
    const prix = parseFloat(formData.prix);
    if (!formData.prix || isNaN(prix) || prix < 0) {
      newErrors.prix = "Veuillez indiquer un prix valide (0 ou plus)";
    } else if (prix > 10000) {
      newErrors.prix = "Le prix ne doit pas dépasser 10 000";
    }
    
    // Validate time (15-1440 minutes)
    const temps = parseInt(formData.temps);
    if (!formData.temps || isNaN(temps) || temps < 15) {
      newErrors.temps = "La durée doit être d'au moins 15 minutes";
    } else if (temps > 1440) {
      newErrors.temps = "La durée ne doit pas dépasser 24 heures (1440 minutes)";
    }
    
    // Validate number of wines (0 or more)
    const vinsDesgustes = parseInt(formData.vinsDesgustes);
    if (!formData.vinsDesgustes || isNaN(vinsDesgustes) || vinsDesgustes < 0) {
      newErrors.vinsDesgustes = "Veuillez indiquer un nombre valide (0 ou plus)";
    }
    
    // Validate languages (at least one must be selected)
    const hasLanguage = Object.values(formData.langues).some(Boolean);
    if (!hasLanguage) {
      newErrors.langues = "Veuillez sélectionner au moins une langue";
    }
    
    // If "autre" is selected, validate the custom language field
    if (formData.langues.autre && (!formData.autreLangue.trim() || formData.autreLangue.trim().length < 2)) {
      newErrors.autreLangue = "Veuillez spécifier la langue (au moins 2 caractères)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (prestation) {
      // Extract numeric value from price string (remove € symbol)
      const priceValue = prestation.price.replace(/[€,\s]/g, '').replace(',', '.');
      
      // Extract total minutes from duration string (e.g., "1h30min" or "2h")
      let totalMinutes = 60; // default
      if (prestation.duration) {
        const hourMatch = prestation.duration.match(/(\d+)h/);
        const minMatch = prestation.duration.match(/(\d+)min/);
        
        const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
        const minutes = minMatch ? parseInt(minMatch[1]) : 0;
        
        totalMinutes = (hours * 60) + minutes;
      }
      const timeValue = totalMinutes.toString();
      
      // Use the full numberOfPeople value (could be a range like "10-12")
      let peopleValue = "1";
      if (prestation.numberOfPeople) {
        peopleValue = prestation.numberOfPeople.toString();
      }
      
      // Map languages from service data if available, otherwise use defaults
      let languagesState = {
        francais: true,
        anglais: false,
        allemand: false,
        espagnol: false,
        autre: false
      };
      
      // If we have languages from the actual service data (passed through originalIndex)
      if (prestation.languages) {
        languagesState = prestation.languages;
      }
      
      // Set form data with properly extracted values
      setFormData({
        nom: prestation.name || "",
        description: prestation.description || "",
        nombrePersonnes: peopleValue,
        prix: priceValue,
        temps: timeValue,
        vinsDesgustes: prestation.winesTasted || "5",
        langues: languagesState,
        autreLangue: prestation.otherLanguage || ""
      });
      
      // Set existing banner preview if available
      if (prestation.serviceBannerUrl) {
        // Construct full URL if it's a relative path
        const bannerUrl = prestation.serviceBannerUrl.startsWith('http') 
          ? prestation.serviceBannerUrl 
          : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001'}${prestation.serviceBannerUrl}`;
        setBannerPreview(bannerUrl);
        setServiceBanner(null); // Clear any file since we're showing existing URL
      } else {
        setBannerPreview(null);
        setServiceBanner(null);
      }
      
      // Clear any existing errors when loading new prestation
      setErrors({});
    } else {
      // Reset form when prestation is null (modal closed)
      resetForm();
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
    if (!validateForm()) {
      return;
    }

    if (prestation) {
      // Transform form data to match the expected API format exactly like parent component expects
      const selectedLanguages = Object.entries(formData.langues)
        .filter(([_, selected]) => selected)
        .map(([langue, _]) => {
          switch(langue) {
            case 'francais': return 'French';
            case 'anglais': return 'English';
            case 'allemand': return 'German';
            case 'espagnol': return 'Spanish';
            default: return langue;
          }
        });
      
      if (formData.langues.autre && formData.autreLangue.trim()) {
        selectedLanguages.push(formData.autreLangue.trim());
      }

      // Create the service data object with proper data types and validation
      const updatedServiceData = {
        serviceId: (prestation as any).serviceId, // Preserve the service ID for updating
        originalIndex: (prestation as any).originalIndex, // Preserve the index for updating
        serviceName: formData.nom.trim(),
        serviceDescription: formData.description.trim(),
        numberOfPeople: formData.nombrePersonnes || '1',
        pricePerPerson: Math.max(0, parseFloat(formData.prix) || 0),
        timeOfServiceInMinutes: Math.max(15, parseInt(formData.temps) || 60), // Min 15 minutes as per schema
        numberOfWinesTasted: Math.max(0, parseInt(formData.vinsDesgustes) || 0),
        languagesOffered: selectedLanguages.length > 0 ? selectedLanguages : ['French'], // Ensure at least one language
        isActive: true
      };
      
      // Validate data before sending
      if (!updatedServiceData.serviceName || updatedServiceData.serviceName.length < 2) {
        setErrors({ nom: "Le nom de la prestation doit contenir au moins 2 caractères" });
        return;
      }
      
      if (!updatedServiceData.serviceDescription || updatedServiceData.serviceDescription.length < 10) {
        setErrors({ description: "La description doit contenir au moins 10 caractères" });
        return;
      }
      
      console.log("EditServiceModal - Updated service data:", updatedServiceData);
      onSave(updatedServiceData, serviceBanner);
    }
    
    // Reset form and errors, then close
    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!prestation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-6xl h-[95vh] max-h-[95vh] overflow-hidden flex flex-col rounded-xl shadow-2xl left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fixed">
        {/* Enhanced Header */}
        <DialogHeader className="relative text-white p-4 sm:p-6 -mx-6 -mt-6 mb-4 sm:mb-6 rounded-t-xl bg-gradient-to-r from-[#3A7B59] to-[#2d5a43] shrink-0">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <Wine className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" />
            <DialogTitle className="text-lg sm:text-xl font-semibold text-center">
              Modifier une prestation œnotouristique
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
                      JPG, PNG ou WebP (max. 800 Ko)
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
                  type="text"
                  value={formData.nombrePersonnes}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombrePersonnes: e.target.value }))}
                  placeholder="ex: 10-12"
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
                      id="edit-francais"
                      checked={formData.langues.francais}
                      onCheckedChange={(checked) => handleLangueChange('francais', checked as boolean)}
                      className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59] w-4 h-4 sm:w-5 sm:h-5 shrink-0"
                    />
                    <Label htmlFor="edit-francais" className="text-sm sm:text-base font-medium cursor-pointer truncate">Français</Label>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <Checkbox
                      id="edit-anglais"
                      checked={formData.langues.anglais}
                      onCheckedChange={(checked) => handleLangueChange('anglais', checked as boolean)}
                      className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59] w-4 h-4 sm:w-5 sm:h-5 shrink-0"
                    />
                    <Label htmlFor="edit-anglais" className="text-sm sm:text-base font-medium cursor-pointer truncate">Anglais</Label>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <Checkbox
                      id="edit-allemand"
                      checked={formData.langues.allemand}
                      onCheckedChange={(checked) => handleLangueChange('allemand', checked as boolean)}
                      className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59] w-4 h-4 sm:w-5 sm:h-5 shrink-0"
                    />
                    <Label htmlFor="edit-allemand" className="text-sm sm:text-base font-medium cursor-pointer truncate">Allemand</Label>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                    <Checkbox
                      id="edit-espagnol"
                      checked={formData.langues.espagnol}
                      onCheckedChange={(checked) => handleLangueChange('espagnol', checked as boolean)}
                      className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59] w-4 h-4 sm:w-5 sm:h-5 shrink-0"
                    />
                    <Label htmlFor="edit-espagnol" className="text-sm sm:text-base font-medium cursor-pointer truncate">Espagnol</Label>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2 sm:space-y-3 pt-2 border-t border-gray-300 w-full">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Checkbox
                      id="edit-autre"
                      checked={formData.langues.autre}
                      onCheckedChange={(checked) => handleLangueChange('autre', checked as boolean)}
                      className="data-[state=checked]:bg-[#3A7B59] data-[state=checked]:border-[#3A7B59] w-4 h-4 sm:w-5 sm:h-5 shrink-0"
                    />
                    <Label htmlFor="edit-autre" className="text-sm sm:text-base font-medium cursor-pointer">Autre :</Label>
                  </div>
                  <div className="w-full pl-6 sm:pl-8">
                    <Input
                      value={formData.autreLangue}
                      onChange={(e) => setFormData(prev => ({ ...prev, autreLangue: e.target.value }))}
                      disabled={!formData.langues.autre}
                      placeholder="Précisez la langue"
                      className={`w-full text-sm sm:text-base border-2 focus:border-[#3A7B59] rounded-lg disabled:opacity-50 h-10 sm:h-auto ${errors.autreLangue ? 'border-red-300 focus:border-red-500' : ''}`}
                    />
                    {errors.autreLangue && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.autreLangue}</p>}
                  </div>
                </div>
              </div>
              {errors.langues && <p className="text-red-500 text-xs sm:text-sm">{errors.langues}</p>}
            </div>
          </div>
        </div>

        {/* Enhanced Footer - Mobile optimized */}
        <div className="shrink-0 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 px-6 pb-6 border-t border-gray-200 -mx-6 -mb-6">
          <Button 
            onClick={handleClose} 
            variant="outline"
            className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 border-2 border-gray-300 hover:bg-gray-50 font-medium text-sm sm:text-base"
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSave} 
            className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 bg-gradient-to-r from-[#3A7B59] to-[#2d5a43] hover:from-[#2d5a43] hover:to-[#1e3d2b] text-white font-medium shadow-lg text-sm sm:text-base"
          >
            Modifier la prestation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};