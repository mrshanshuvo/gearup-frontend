"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Edit3, Trash2, Save, X, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useCategories } from "@/hooks/useGear";
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategory";
import { categorySchema, CategoryInput } from "@/validations/category.schema";
import { toast } from "sonner";

export default function CategoryManagementPage() {
  const { data: categoryData, isLoading } = useCategories();
  const categories = categoryData?.data || [];

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
  });

  const handleCreate = async (data: CategoryInput) => {
    try {
      await createCategory.mutateAsync(data);
      toast.success("Category created successfully!");
      reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create category");
    }
  };

  const startEdit = (id: string, name: string, description?: string) => {
    setEditingId(id);
    setEditName(name);
    setEditDescription(description || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDescription("");
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    try {
      await updateCategory.mutateAsync({
        id,
        payload: { name: editName, description: editDescription },
      });
      toast.success("Category updated!");
      cancelEdit();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update category");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      await deleteCategory.mutateAsync(id);
      toast.success(`Category "${name}" deleted`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Gear Category Management
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage sports & outdoor equipment category taxonomy.
        </p>
      </div>

      {/* Add Category Form Card */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardContent className="space-y-4 p-6">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
            <PlusCircle className="h-4 w-4 text-blue-600" /> Create New
            Category
          </h2>

          <form
            onSubmit={handleSubmit(handleCreate)}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="flex-1 space-y-1">
              <Input
                {...register("name")}
                placeholder="Category Name (e.g. Camping & Hiking)"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <Input
                {...register("description")}
                placeholder="Short Description (Optional)"
              />
            </div>

            <Button
              type="submit"
              disabled={createCategory.isPending}
              className="shrink-0 bg-blue-600 font-bold text-white hover:bg-blue-700"
            >
              {createCategory.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Add Category"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Category List Table */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-12 text-center dark:border-slate-800 dark:bg-slate-900">
          <Tag className="mx-auto mb-2 h-12 w-12 text-slate-400" />
          <p className="text-sm text-slate-500">No categories created yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-950">
                  <th className="p-4">Name</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Created At</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm dark:divide-slate-800">
                {categories.map((cat) => {
                  const isEditing = editingId === cat.id;

                  return (
                    <tr
                      key={cat.id}
                      className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    >
                      <td className="p-4 font-bold text-slate-900 dark:text-slate-100">
                        {isEditing ? (
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-8"
                          />
                        ) : (
                          cat.name
                        )}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">
                        {isEditing ? (
                          <Input
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="h-8"
                          />
                        ) : (
                          cat.description || "-"
                        )}
                      </td>
                      <td className="p-4 text-xs text-slate-500">
                        {new Date(cat.createdAt).toLocaleDateString()}
                      </td>
                      <td className="space-x-2 p-4 text-right">
                        {isEditing ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleSaveEdit(cat.id)}
                              disabled={updateCategory.isPending}
                              className="h-8 bg-blue-600 text-white hover:bg-blue-700"
                            >
                              <Save className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                              className="h-8"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                startEdit(cat.id, cat.name, cat.description)
                              }
                              className="h-8"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                              onClick={() => handleDelete(cat.id, cat.name)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
