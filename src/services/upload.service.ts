import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types";

export interface UploadResponse {
  url: string;
  public_id: string;
}

export const uploadService = {
  async uploadImage(file: File): Promise<ApiResponse<UploadResponse>> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post<ApiResponse<UploadResponse>>(
      "/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  },
};
