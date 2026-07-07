import api from "@/lib/axios";

const PAPERS_BASE_URL = "/papers";

export const uploadPaper = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`${PAPERS_BASE_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (onUploadProgress && event.total) {
        const percent = Math.round((event.loaded * 100) / event.total);
        onUploadProgress(percent);
      }
    },
  });
};

export const getPapers = () => api.get(PAPERS_BASE_URL);

export const deletePaper = (id) => api.delete(`${PAPERS_BASE_URL}/${id}`);