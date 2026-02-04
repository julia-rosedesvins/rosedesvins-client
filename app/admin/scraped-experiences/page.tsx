"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Plus, 
  Pencil, 
  Trash2, 
  Image as ImageIcon,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import DashboardLayout from "@/components/admin/DashboardLayout"
import { useAdmin } from '@/contexts/AdminContext'
import { 
  adminStaticExperiencesService, 
  StaticExperience, 
  CreateStaticExperienceDto, 
  UpdateStaticExperienceDto 
} from '@/services/admin-static-experiences.service'
import toast from 'react-hot-toast'

export default function AdminScrapedExperiencesPage() {
  const { admin, isLoading } = useAdmin();
  const [experiences, setExperiences] = useState<StaticExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10;

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<StaticExperience | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateStaticExperienceDto | UpdateStaticExperienceDto>({
    name: '',
    category: '',
    address: '',
    city: '',
    latitude: 0,
    longitude: 0,
    rating: 0,
    reviews: 0,
    website: '',
    phone: '',
    about: '',
    url: ''
  });

  // File upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [creating, setCreating] = useState(false);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      
      // If searching, fetch all experiences to search across all records
      const fetchLimit = searchTerm.trim() ? 1000 : limit;
      const fetchPage = searchTerm.trim() ? 1 : page;
      
      const response = await adminStaticExperiencesService.getAll(fetchPage, fetchLimit);
      
      let filteredData = response.items;
      if (searchTerm.trim()) {
        // Filter by search term (name, city, category)
        filteredData = response.items.filter(exp => 
          exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (exp.city && exp.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (exp.category && exp.category.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        // Apply pagination to filtered results
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        
        setExperiences(paginatedData);
        setTotal(filteredData.length);
        setTotalPages(Math.ceil(filteredData.length / limit));
      } else {
        setExperiences(response.items);
        setTotal(response.total);
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (error: any) {
      console.error('Error fetching experiences:', error);
      toast.error('Erreur lors du chargement des expériences');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) {
      fetchExperiences();
    }
  }, [admin, page, searchTerm]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    if (searchTerm !== '') {
      setPage(1);
    }
  }, [searchTerm]);

  const handleCreate = async () => {
    try {
      setCreating(true);
      // First create the experience
      const response = await adminStaticExperiencesService.create(formData as CreateStaticExperienceDto);
      
      // If an image file is selected, upload it
      if (selectedFile && response._id) {
        try {
          await adminStaticExperiencesService.uploadMainImage(response._id, selectedFile);
        } catch (error: any) {
          toast.error('Expérience créée mais erreur lors du téléchargement de l\'image');
        }
      }
      
      toast.success('Expérience créée avec succès');
      setIsCreateModalOpen(false);
      resetForm();
      fetchExperiences();
    } catch (error: any) {
      toast.error('Erreur lors de la création');
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedExperience) return;
    try {
      // First, upload image if a new file is selected
      if (selectedFile) {
        setUploadingImage(true);
        try {
          await adminStaticExperiencesService.uploadMainImage(selectedExperience._id, selectedFile);
        } catch (error) {
          toast.error('Erreur lors du téléchargement de l\'image');
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }

      // Then update the experience
      await adminStaticExperiencesService.update(selectedExperience._id, formData as UpdateStaticExperienceDto);
      toast.success('Expérience mise à jour avec succès');
      setIsEditModalOpen(false);
      resetForm();
      fetchExperiences();
    } catch (error: any) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async () => {
    if (!selectedExperience) return;
    try {
      await adminStaticExperiencesService.delete(selectedExperience._id);
      toast.success('Expérience supprimée avec succès');
      setIsDeleteModalOpen(false);
      setSelectedExperience(null);
      fetchExperiences();
    } catch (error: any) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (experience: StaticExperience) => {
    setSelectedExperience(experience);
    setFormData({
      name: experience.name,
      category: experience.category || '',
      address: experience.address || '',
      city: experience.city || '',
      latitude: experience.latitude || 0,
      longitude: experience.longitude || 0,
      rating: experience.rating || 0,
      reviews: experience.reviews || 0,
      website: experience.website || '',
      phone: experience.phone || '',
      about: experience.about || '',
      url: experience.url || ''
    });
    setPreviewUrl(experience.main_image || null);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (experience: StaticExperience) => {
    setSelectedExperience(experience);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      address: '',
      city: '',
      latitude: 0,
      longitude: 0,
      rating: 0,
      reviews: 0,
      website: '',
      phone: '',
      about: '',
      url: ''
    });
    setSelectedFile(null);
    setPreviewUrl(null);
    setSelectedExperience(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['latitude', 'longitude', 'rating', 'reviews'].includes(name) 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  // Pagination
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <Button
            key={i}
            variant={page === i ? "default" : "outline"}
            size="sm"
            onClick={() => setPage(i)}
            className="w-10"
          >
            {i}
          </Button>
        );
      }
    } else {
      // Always show first page
      pageNumbers.push(
        <Button
          key={1}
          variant={page === 1 ? "default" : "outline"}
          size="sm"
          onClick={() => setPage(1)}
          className="w-10"
        >
          1
        </Button>
      );

      // Determine the range to show
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(totalPages - 1, page + 1);

      // Adjust if we're near the start
      if (page <= 3) {
        startPage = 2;
        endPage = Math.min(4, totalPages - 1);
      }

      // Adjust if we're near the end
      if (page >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
        endPage = totalPages - 1;
      }

      // Add ellipsis if needed before the range
      if (startPage > 2) {
        pageNumbers.push(
          <span key="ellipsis-start" className="px-2 py-1 text-sm text-gray-500">
            ...
          </span>
        );
      }

      // Add the middle range
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <Button
            key={i}
            variant={page === i ? "default" : "outline"}
            size="sm"
            onClick={() => setPage(i)}
            className="w-10"
          >
            {i}
          </Button>
        );
      }

      // Add ellipsis if needed after the range
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="ellipsis-end" className="px-2 py-1 text-sm text-gray-500">
            ...
          </span>
        );
      }

      // Always show last page
      pageNumbers.push(
        <Button
          key={totalPages}
          variant={page === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => setPage(totalPages)}
          className="w-10"
        >
          {totalPages}
        </Button>
      );
    }

    return pageNumbers;
  };

  if (isLoading || !admin) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold">Expériences Scrapées</CardTitle>
            <Button onClick={openCreateModal}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter
            </Button>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Rechercher par nom, ville ou catégorie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : (
              <>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Ville</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {experiences.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            Aucune expérience trouvée
                          </TableCell>
                        </TableRow>
                      ) : (
                        experiences.map((exp) => (
                          <TableRow key={exp._id}>
                            <TableCell>
                              {exp.main_image ? (
                                <img 
                                  src={exp.main_image} 
                                  alt={exp.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                  <ImageIcon className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="font-medium">{exp.name}</TableCell>
                            <TableCell>{exp.category || '-'}</TableCell>
                            <TableCell>{exp.city || '-'}</TableCell>
                            <TableCell>{exp.rating ? `${exp.rating}/5` : '-'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditModal(exp)}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openDeleteModal(exp)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
                    <div className="text-sm text-gray-600 text-center sm:text-left">
                      Affichage de {((page - 1) * limit) + 1} à {Math.min(page * limit, total)} sur {total} expériences
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="min-w-[80px] sm:min-w-[100px]"
                      >
                        <ChevronLeft className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Précédent</span>
                        <span className="sm:hidden">Préc</span>
                      </Button>
                      <div className="flex items-center gap-1">
                        {renderPageNumbers()}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="min-w-[80px] sm:min-w-[100px]"
                      >
                        <span className="hidden sm:inline">Suivant</span>
                        <span className="sm:hidden">Suiv</span>
                        <ChevronRight className="w-4 h-4 sm:ml-2" />
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
            <DialogTitle>Créer une nouvelle expérience</DialogTitle>
            <DialogDescription>
              Remplissez les informations de l'expérience
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Catégorie</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">Ville</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="rating">Note</Label>
                <Input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reviews">Avis</Label>
                <Input
                  id="reviews"
                  name="reviews"
                  type="number"
                  value={formData.reviews}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="website">Site Web</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="about">Description</Label>
              <Textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="main_image">Image principale (optionnel)</Label>
              <Input
                id="main_image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {previewUrl && (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded mt-2"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} disabled={creating}>
              Annuler
            </Button>
            <Button onClick={handleCreate} disabled={!formData.name || creating}>
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'expérience</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'expérience
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nom *</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Catégorie</Label>
                <Input
                  id="edit-category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-city">Ville</Label>
                <Input
                  id="edit-city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Adresse</Label>
              <Input
                id="edit-address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-latitude">Latitude</Label>
                <Input
                  id="edit-latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-longitude">Longitude</Label>
                <Input
                  id="edit-longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-rating">Note</Label>
                <Input
                  id="edit-rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-reviews">Avis</Label>
                <Input
                  id="edit-reviews"
                  name="reviews"
                  type="number"
                  value={formData.reviews}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-website">Site Web</Label>
              <Input
                id="edit-website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-phone">Téléphone</Label>
              <Input
                id="edit-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-url">URL</Label>
              <Input
                id="edit-url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-about">Description</Label>
              <Textarea
                id="edit-about"
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-main_image">Image principale</Label>
              <Input
                id="edit-main_image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {previewUrl && (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded mt-2"
                />
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEdit} disabled={!formData.name || uploadingImage}>
              {uploadingImage ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Téléchargement...
                </>
              ) : (
                'Enregistrer'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer l'expérience &quot;{selectedExperience?.name}&quot; ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
