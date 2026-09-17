import axios from "axios";

export default function useCreateAudioBook() {
  const createAudioBook = async (data: FormData) => {
    try {
      const response = await axios.post("/api/converter", data, {
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
