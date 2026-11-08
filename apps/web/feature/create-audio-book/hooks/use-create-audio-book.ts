import apiClient from "@/lib/fast-api-client/axiosClient";
import type { CreateAudioBookResponse } from "@/feature/create-audio-book/types";

export default function useCreateAudioBook() {
  const createAudioBook = async (data: FormData) => {
    const response = await apiClient.post<CreateAudioBookResponse>(
      "/api/converter",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  };

  return { createAudioBook };
}
