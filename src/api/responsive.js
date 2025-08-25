import instance from "./axios";

export const createResponsiva = async (payload) => {
  try {
    const response = await instance.post(
      "/inventory/article/responsive/create",  // ← Ruta que definimos
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error al guardar la responsiva:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};