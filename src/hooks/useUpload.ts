import { useMutation } from "@tanstack/react-query";
import { uploadService } from "@/services/upload.service";
import { toast } from "sonner";

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => uploadService.uploadImage(file),
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Failed to upload image to Cloudinary");
    },
  });
}
