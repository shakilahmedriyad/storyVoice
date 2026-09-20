import { CreateAudioBookFormValues } from "@/app/(root)/(dashboard)/create/CreateAudioBookForm";
import apiClient from "@/lib/fast-api-client/axiosClient";

export default function useCreateAudioBook() {
  const createAudioBook = async (data: CreateAudioBookFormValues) => {
    try {
      const response = await apiClient.post("/api/converter", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating audio book:", error);
      // we will handle error later
    }
  };

  return { createAudioBook };
}
