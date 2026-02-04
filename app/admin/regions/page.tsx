"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  MapPin, 
  Plus, 
  Pencil, 
  Trash2, 
  Image as ImageIcon,
  Upload,
  X,
  Loader2
} from "lucide-react"
import DashboardLayout from "@/components/admin/DashboardLayout"
import { useAdmin } from '@/contexts/AdminContext'
import { adminRegionsService, Region, CreateRegionData, UpdateRegionData } from '@/services/admin-regions.service'
import toast from 'react-hot-toast'
import { Checkbox } from "@/components/ui/checkbox"

export default function AdminRegionsPage() {
  const { admin, isLoading } = useAdmin();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateRegionData | UpdateRegionData>({
    denom: '',
    min_lat: 0,
    min_lon: 0,
    max_lat: 0,
    max_lon: 0,
    isParent: false,
    parent: ''
  });

  // File upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);

  const fetchRegions = async () => {
    try {
      setLoading(true);
      const response = await adminRegionsService.getAllRegions(page, limit);
      setRegions(response.data);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error: any) {
      console.error('Error fetching regions:', error);
      toast.error('Erreur lors du chargement des régions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) {
      fetchRegions();
    }
  }, [admin, page]);

  const handleCreate = async () => {
    try {
      await adminRegionsService.createRegion(formData as CreateRegionData);
      toast.success('Région créée avec succès');
      setIsCreateModalOpen(false);
      resetForm();
      fetchRegions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const handleEdit = async () => {
    if (!selectedRegion) return;
    try {
      // First, upload thumbnail if a new file is selected
      if (selectedFile) {
        try {
          await adminRegionsService.uploadThumbnail(selectedRegion._id, selectedFile);
        } catch (error: any) {
          toast.error('Erreur lors du téléchargement de la miniature');
          return;
        }
      }

      // Then update region data
      await adminRegionsService.updateRegion(selectedRegion._id, formData as UpdateRegionData);
      toast.success('Région mise à jour avec succès');
      setIsEditModalOpen(false);
      resetForm();
      fetchRegions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async () => {
    if (!selectedRegion) return;
    try {
      await adminRegionsService.deleteRegion(selectedRegion._id);
      toast.success('Région supprimée avec succès');
      setIsDeleteModalOpen(false);
      setSelectedRegion(null);
      fetchRegions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadThumbnail = async (regionId: string) => {
    if (!selectedFile) return;
    
    try {
      setUploadingThumbnail(true);
      await adminRegionsService.uploadThumbnail(regionId, selectedFile);
      toast.success('Miniature téléchargée avec succès');
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchRegions();
    } catch (error: any) {
      toast.error('Erreur lors du téléchargement de la miniature');
    } finally {
      setUploadingThumbnail(false);
    }
  };

  const handleDeleteThumbnail = async (regionId: string) => {
    try {
      await adminRegionsService.deleteThumbnail(regionId);
      toast.success('Miniature supprimée avec succès');
      fetchRegions();
    } catch (error: any) {
      toast.error('Erreur lors de la suppression de la miniature');
    }
  };

  const openEditModal = (region: Region) => {
    setSelectedRegion(region);
    setFormData({
      denom: region.denom,
      min_lat: region.min_lat,
      min_lon: region.min_lon,
      max_lat: region.max_lat,
      max_lon: region.max_lon,
      isParent: region.isParent,
      parent: region.parent || ''
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (region: Region) => {
    setSelectedRegion(region);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      denom: '',
      min_lat: 0,
      min_lon: 0,
      max_lat: 0,
      max_lon: 0,
      isParent: false,
      parent: ''
    });
    setSelectedRegion(null);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#3A7B59] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <DashboardLayout title="Gestion des Régions">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Régions</h1>
            <p className="text-muted-foreground">Gérer les régions viticoles</p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            style={{ backgroundColor: '#3A7B59' }}
            className="text-white hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle Région
          </Button>
        </div>

        {/* Regions Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#3A7B59]" />
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Miniature</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Coordonnées</TableHead>
                      <TableHead>Parent</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {regions.map((region) => (
                      <TableRow key={region._id}>
                        <TableCell>
                          {region.thumbnailUrl ? (
                            <img
                              src={region.thumbnailUrl}
                              alt={region.denom}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                              <ImageIcon className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{region.denom}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          <div>Min: {region.min_lat.toFixed(4)}, {region.min_lon.toFixed(4)}</div>
                          <div>Max: {region.max_lat.toFixed(4)}, {region.max_lon.toFixed(4)}</div>
                        </TableCell>
                        <TableCell>
                          {region.parent ? (
                            <span className="text-sm">{region.parent}</span>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {region.isParent ? (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              Parent
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                              Enfant
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(region)}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteModal(region)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t">
                    <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                      Page {page} sur {totalPages} <span className="hidden sm:inline">({total} régions au total)</span>
                    </p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {/* Previous Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="px-2 sm:px-3 text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">Précédent</span>
                        <span className="sm:hidden">Préc</span>
                      </Button>

                      {/* First Page */}
                      {page > 3 && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(1)}
                            className="px-2 sm:px-3 text-xs sm:text-sm"
                          >
                            1
                          </Button>
                          {page > 4 && (
                            <span className="px-1 sm:px-2 py-1 flex items-center text-gray-500 text-xs sm:text-sm">...</span>
                          )}
                        </>
                      )}

                      {/* Page Numbers Around Current Page */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(pageNum => {
                          // On mobile, show fewer pages
                          const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
                          if (isMobile) {
                            return pageNum === page || pageNum === page - 1 || pageNum === page + 1;
                          }
                          return pageNum === page ||
                                 pageNum === page - 1 ||
                                 pageNum === page - 2 ||
                                 pageNum === page + 1 ||
                                 pageNum === page + 2;
                        })
                        .map((pageNum) => (
                          <Button
                            key={pageNum}
                            variant={page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(pageNum)}
                            className={page === pageNum 
                              ? "px-2 sm:px-3 bg-[#3A7B59] hover:bg-[#2d5a43] text-white text-xs sm:text-sm"
                              : "px-2 sm:px-3 text-xs sm:text-sm"
                            }
                          >
                            {pageNum}
                          </Button>
                        ))}

                      {/* Last Page */}
                      {page < totalPages - 2 && (
                        <>
                          {page < totalPages - 3 && (
                            <span className="px-1 sm:px-2 py-1 flex items-center text-gray-500 text-xs sm:text-sm">...</span>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(totalPages)}
                            className="px-2 sm:px-3 text-xs sm:text-sm"
                          >
                            {totalPages}
                          </Button>
                        </>
                      )}

                      {/* Next Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(page + 1)}
                        disabled={page === totalPages}
                        className="px-2 sm:px-3 text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">Suivant</span>
                        <span className="sm:hidden">Suiv</span>
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Créer une Nouvelle Région</DialogTitle>
            <DialogDescription>
              Remplissez les informations de la région
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="denom">Nom de la Région *</Label>
              <Input
                id="denom"
                value={formData.denom}
                onChange={(e) => setFormData({ ...formData, denom: e.target.value })}
                placeholder="Ex: Val de Loire"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min_lat">Latitude Min *</Label>
                <Input
                  id="min_lat"
                  type="number"
                  step="0.0001"
                  value={formData.min_lat}
                  onChange={(e) => setFormData({ ...formData, min_lat: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="min_lon">Longitude Min *</Label>
                <Input
                  id="min_lon"
                  type="number"
                  step="0.0001"
                  value={formData.min_lon}
                  onChange={(e) => setFormData({ ...formData, min_lon: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max_lat">Latitude Max *</Label>
                <Input
                  id="max_lat"
                  type="number"
                  step="0.0001"
                  value={formData.max_lat}
                  onChange={(e) => setFormData({ ...formData, max_lat: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="max_lon">Longitude Max *</Label>
                <Input
                  id="max_lon"
                  type="number"
                  step="0.0001"
                  value={formData.max_lon}
                  onChange={(e) => setFormData({ ...formData, max_lon: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isParent"
                checked={formData.isParent}
                onCheckedChange={(checked) => setFormData({ ...formData, isParent: checked as boolean })}
              />
              <Label htmlFor="isParent">Région parente</Label>
            </div>
            {!formData.isParent && (
              <div>
                <Label htmlFor="parent">Région Parente</Label>
                <Input
                  id="parent"
                  value={formData.parent || ''}
                  onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                  placeholder="Nom de la région parente"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsCreateModalOpen(false); resetForm(); }}>
              Annuler
            </Button>
            <Button
              onClick={handleCreate}
              style={{ backgroundColor: '#3A7B59' }}
              className="text-white"
            >
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la Région</DialogTitle>
            <DialogDescription>
              Mettez à jour les informations de la région
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Thumbnail Upload */}
            {selectedRegion && (
              <div>
                <Label>Miniature</Label>
                <div className="mt-2 space-y-2">
                  {selectedRegion.thumbnailUrl && !previewUrl && (
                    <div className="relative inline-block">
                      <img
                        src={selectedRegion.thumbnailUrl}
                        alt={selectedRegion.denom}
                        className="w-32 h-32 object-cover rounded"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1"
                        onClick={() => handleDeleteThumbnail(selectedRegion._id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  {previewUrl && (
                    <div className="relative inline-block">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute top-1 right-1"
                        onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                  {selectedFile && (
                    <p className="text-sm text-gray-600 mt-1">
                      La miniature sera téléchargée lors de l&apos;enregistrement
                    </p>
                  )}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="edit_denom">Nom de la Région *</Label>
              <Input
                id="edit_denom"
                value={formData.denom}
                onChange={(e) => setFormData({ ...formData, denom: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_min_lat">Latitude Min *</Label>
                <Input
                  id="edit_min_lat"
                  type="number"
                  step="0.0001"
                  value={formData.min_lat}
                  onChange={(e) => setFormData({ ...formData, min_lat: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="edit_min_lon">Longitude Min *</Label>
                <Input
                  id="edit_min_lon"
                  type="number"
                  step="0.0001"
                  value={formData.min_lon}
                  onChange={(e) => setFormData({ ...formData, min_lon: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit_max_lat">Latitude Max *</Label>
                <Input
                  id="edit_max_lat"
                  type="number"
                  step="0.0001"
                  value={formData.max_lat}
                  onChange={(e) => setFormData({ ...formData, max_lat: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="edit_max_lon">Longitude Max *</Label>
                <Input
                  id="edit_max_lon"
                  type="number"
                  step="0.0001"
                  value={formData.max_lon}
                  onChange={(e) => setFormData({ ...formData, max_lon: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit_isParent"
                checked={formData.isParent}
                onCheckedChange={(checked) => setFormData({ ...formData, isParent: checked as boolean })}
              />
              <Label htmlFor="edit_isParent">Région parente</Label>
            </div>
            {!formData.isParent && (
              <div>
                <Label htmlFor="edit_parent">Région Parente</Label>
                <Input
                  id="edit_parent"
                  value={formData.parent || ''}
                  onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditModalOpen(false); resetForm(); }}>
              Annuler
            </Button>
            <Button
              onClick={handleEdit}
              style={{ backgroundColor: '#3A7B59' }}
              className="text-white"
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la Suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la région &quot;{selectedRegion?.denom}&quot; ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsDeleteModalOpen(false); setSelectedRegion(null); }}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
