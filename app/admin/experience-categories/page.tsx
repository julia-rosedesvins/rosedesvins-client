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
  Plus, 
  Pencil, 
  Trash2, 
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  ToggleRight
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import DashboardLayout from "@/components/admin/DashboardLayout"
import { useAdmin } from '@/contexts/AdminContext'
import { 
  adminExperienceCategoriesService, 
  ExperienceCategory, 
  CreateExperienceCategoryDto, 
  UpdateExperienceCategoryDto 
} from '@/services/admin-experience-categories.service'
import toast from 'react-hot-toast'

export default function AdminExperienceCategoriesPage() {
  const { admin, isLoading } = useAdmin();
  const [categories, setCategories] = useState<ExperienceCategory[]>([]);
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
  const [selectedCategory, setSelectedCategory] = useState<ExperienceCategory | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateExperienceCategoryDto | UpdateExperienceCategoryDto>({
    category_name: '',
    isActive: true
  });

  // Loading states
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // If searching, fetch all categories to search across all records
      const fetchLimit = searchTerm.trim() ? 1000 : limit;
      const fetchPage = searchTerm.trim() ? 1 : page;
      
      const response = await adminExperienceCategoriesService.getAll(fetchPage, fetchLimit);
      
      let filteredData = response.items;
      if (searchTerm.trim()) {
        // Filter by search term
        filteredData = response.items.filter(cat => 
          cat.category_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Apply pagination to filtered results
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = filteredData.slice(startIndex, endIndex);
        
        setCategories(paginatedData);
        setTotal(filteredData.length);
        setTotalPages(Math.ceil(filteredData.length / limit));
      } else {
        setCategories(response.items);
        setTotal(response.total);
        setTotalPages(Math.ceil(response.total / limit));
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast.error('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (admin) {
      fetchCategories();
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
      await adminExperienceCategoriesService.create(formData as CreateExperienceCategoryDto);
      toast.success('Catégorie créée avec succès');
      setIsCreateModalOpen(false);
      resetForm();
      fetchCategories();
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('Une catégorie avec ce nom existe déjà');
      } else {
        toast.error('Erreur lors de la création');
      }
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedCategory) return;
    try {
      setUpdating(true);
      await adminExperienceCategoriesService.update(selectedCategory._id, formData as UpdateExperienceCategoryDto);
      toast.success('Catégorie mise à jour avec succès');
      setIsEditModalOpen(false);
      resetForm();
      fetchCategories();
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error('Une catégorie avec ce nom existe déjà');
      } else {
        toast.error('Erreur lors de la mise à jour');
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    try {
      await adminExperienceCategoriesService.delete(selectedCategory._id);
      toast.success('Catégorie supprimée avec succès');
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      fetchCategories();
    } catch (error: any) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleToggleActive = async (category: ExperienceCategory) => {
    try {
      await adminExperienceCategoriesService.toggleActive(category._id);
      toast.success(`Catégorie ${category.isActive ? 'désactivée' : 'activée'}`);
      fetchCategories();
    } catch (error: any) {
      toast.error('Erreur lors du changement de statut');
    }
  };

  const openCreateModal = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const openEditModal = (category: ExperienceCategory) => {
    setSelectedCategory(category);
    setFormData({
      category_name: category.category_name,
      isActive: category.isActive
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (category: ExperienceCategory) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      category_name: '',
      isActive: true
    });
    setSelectedCategory(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Pagination
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
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

      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(totalPages - 1, page + 1);

      if (page <= 3) {
        startPage = 2;
        endPage = Math.min(4, totalPages - 1);
      }

      if (page >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
        endPage = totalPages - 1;
      }

      if (startPage > 2) {
        pageNumbers.push(
          <span key="ellipsis-start" className="px-2 py-1 text-sm text-gray-500">
            ...
          </span>
        );
      }

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

      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="ellipsis-end" className="px-2 py-1 text-sm text-gray-500">
            ...
          </span>
        );
      }

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
            <CardTitle className="text-2xl font-bold">Catégories d&apos;Expériences</CardTitle>
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
                  placeholder="Rechercher par nom de catégorie..."
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
                        <TableHead>Nom de la Catégorie</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date de Création</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                            Aucune catégorie trouvée
                          </TableCell>
                        </TableRow>
                      ) : (
                        categories.map((cat) => (
                          <TableRow key={cat._id}>
                            <TableCell className="font-medium">{cat.category_name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={cat.isActive}
                                  onCheckedChange={() => handleToggleActive(cat)}
                                />
                                <span className={cat.isActive ? 'text-green-600' : 'text-gray-400'}>
                                  {cat.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString('fr-FR') : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openEditModal(cat)}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openDeleteModal(cat)}
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
                      Affichage de {((page - 1) * limit) + 1} à {Math.min(page * limit, total)} sur {total} catégories
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une nouvelle catégorie</DialogTitle>
            <DialogDescription>
              Ajoutez une nouvelle catégorie d&apos;expérience
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="category_name">Nom de la Catégorie *</Label>
              <Input
                id="category_name"
                name="category_name"
                value={formData.category_name}
                onChange={handleInputChange}
                placeholder="Ex: Dégustation de vin"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Catégorie active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} disabled={creating}>
              Annuler
            </Button>
            <Button onClick={handleCreate} disabled={!formData.category_name || creating}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la catégorie</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la catégorie
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-category_name">Nom de la Catégorie *</Label>
              <Input
                id="edit-category_name"
                name="category_name"
                value={formData.category_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="edit-isActive">Catégorie active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} disabled={updating}>
              Annuler
            </Button>
            <Button onClick={handleEdit} disabled={!formData.category_name || updating}>
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mise à jour...
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
              Êtes-vous sûr de vouloir supprimer la catégorie &quot;{selectedCategory?.category_name}&quot; ?
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
