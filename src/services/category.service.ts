import { axiosInstance } from "@/lib/axios";
import { ApiResponse, Category } from "@/types";

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string;
}

export const categoryService = {
  async createCategory(
    payload: CreateCategoryPayload
  ): Promise<ApiResponse<Category>> {
    const response = await axiosInstance.post<ApiResponse<Category>>(
      "/categories",
      payload
    );
    return response.data;
  },

  async updateCategory(
    id: string,
    payload: UpdateCategoryPayload
  ): Promise<ApiResponse<Category>> {
    const response = await axiosInstance.put<ApiResponse<Category>>(
      `/categories/${id}`,
      payload
    );
    return response.data;
  },

  async deleteCategory(id: string): Promise<ApiResponse<Category>> {
    const response = await axiosInstance.delete<ApiResponse<Category>>(
      `/categories/${id}`
    );
    return response.data;
  },
};
