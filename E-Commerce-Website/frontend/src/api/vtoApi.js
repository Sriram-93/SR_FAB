import api from "./axios";

export const triggerVtoGeneration = async ({
  personImageUrl,
  garmentImageUrl,
  garmentDescription,
}) => {
  const { data } = await api.post("/vto/generate", {
    personImageUrl,
    garmentImageUrl,
    garmentDescription,
  }, {
    timeout: 30000, // 30s timeout for the initial POST (not the generation)
  });
  return data;
};

export const fetchVtoStatus = async (jobId) => {
  const { data } = await api.get(`/vto/status/${jobId}`);
  return data;
};
