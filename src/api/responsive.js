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

export const confirmationResponsiva = async (payload) => {
  try {
    const response = await instance.post(
      "/inventory/article/responsive/confirmation",  // ← Ruta que definimos
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

// ✅ NUEVOS ENDPOINTS PARA VERIFICACIÓN
export const verifyResponsiva = async (token, hash) => {
  try {
    const response = await instance.get("/verificar-responsiva", {
      params: { token, hash }
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error en verificación:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const getResponsivaPDFUrl = async (id, token) => {
  try {    
    
    const response = await instance.get(`/documentos/${id}/pdf`, {
      params: { token },
      // Headers para evitar cache
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    
    console.log(response.data)
    return response.data;

  } catch (error) {
    console.error('❌ Error en getResponsivaPDFUrl:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Error de conexión al obtener el PDF'
    );
  }
};