import { useCallback } from "react";

import apiClient from "@/lib/fast-api-client/axiosClient";
import type { GetAudioBookResponse } from "@/feature/create-audio-book/types";

export default function useGetAudioBook() {
  const getAudioBook = useCallback(
    async (bookId: number, signal?: AbortSignal) => {
      const response = await apiClient.get<GetAudioBookResponse>(
        `/api/converter/${bookId}`,
        { signal },
      );
      return response.data;
    },
    [],
  );

  return { getAudioBook };
}
