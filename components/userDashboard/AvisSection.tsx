"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { contactDetailsService } from "@/services/contactDetails.service";

export const AvisSection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [googleReviewUrl, setGoogleReviewUrl] = useState("");

  useEffect(() => {
    loadGoogleReviewUrl();
  }, []);

  const loadGoogleReviewUrl = async () => {
    setIsLoading(true);
    try {
      const response = await contactDetailsService.getContactDetails();
      setGoogleReviewUrl(response.data?.googleReviewUrl || "");
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to load Google review URL:", error);
      toast.error("Erreur lors du chargement du lien Google avis");
    } finally {
      setIsLoading(false);
    }
  };

  const saveGoogleReviewUrl = async () => {
    setIsSaving(true);
    try {
      const trimmed = googleReviewUrl.trim();
      await contactDetailsService.updateContactDetails({
        googleReviewUrl: trimmed || null,
      });
      setGoogleReviewUrl(trimmed);
      toast.success("Lien Google avis sauvegardé avec succès");
      setHasChanges(false);
    } catch (error: any) {
      console.error("Failed to save Google review URL:", error);
      toast.error(error?.message || "Erreur lors de la sauvegarde");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="mt-5 relative shadow-sm border-0 bg-white ring-1 ring-gray-200 hover:ring-gray-300 transition-all duration-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl lg:text-2xl font-semibold text-gray-900">Avis</CardTitle>
        <p className="text-gray-600 text-sm lg:text-base leading-relaxed mt-1">
          Ajoutez le lien vers votre page d&apos;avis Google. Un e-mail de demande d&apos;avis sera envoyé aux clients un jour après leur expérience.
        </p>
      </CardHeader>
      <CardContent className="pt-2 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#3A7B59]" />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="googleReviewUrl" className="text-sm font-medium text-gray-700">
                Lien Google avis
              </Label>
              <Input
                id="googleReviewUrl"
                type="url"
                placeholder="https://g.page/r/..."
                value={googleReviewUrl}
                onChange={(e) => {
                  setGoogleReviewUrl(e.target.value);
                  setHasChanges(true);
                }}
                className="w-full"
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={saveGoogleReviewUrl}
                disabled={!hasChanges || isSaving}
                className="bg-[#3A7B59] hover:bg-[#2d5f44] text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
