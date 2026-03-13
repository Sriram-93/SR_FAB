                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    import api from "./axios";

export const triggerModelGeneration = async ({
  productId,
  sourceImageUrl,
  prompt,
}) => {
  const { data } = await api.post("/models/generate", {
    productId: String(productId),
    sourceImageUrl,
    prompt,
  });
  return data;
};

export const fetchModelGenerationStatus = async (jobId) => {
  const { data } = await api.get(`/models/generate/${jobId}`);
  return data;
};

export const fetchProductModelMeta = async (productId) => {
  const { data } = await api.get(`/models/product/${productId}`);
  return data;
};
