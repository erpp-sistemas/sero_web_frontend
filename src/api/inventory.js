import instance from "./axios";

export const getAllInventory = async () => {
  try {
    const response = await instance.get("/inventory/AllInventory");
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener todos los articulos:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const getAllInventoryCategory = async () => {
  try {
    const response = await instance.get("/inventory/AllInventoryCategory");
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener todas las categorias:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const getAllInventorySubcategory = async () => {
  try {
    const response = await instance.get("/inventory/AllInventorySubcategory");
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener todas las sub categorias:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const getAllInventoryFieldsCategorySubcategory = async () => {
  try {
    const response = await instance.get(
      "/inventory/AllInventoryFieldsCategorySubcategory"
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error al obtener todos los campos de los articulos :",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const updateArticlePhotos = async (payload) => {
  try {
    const response = await instance.post(
      "/inventory/article/photos/update",
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error al actualizar las fotos del artículo:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const createArticle = async (payload) => {
  try {
    const response = await instance.post(
      "/inventory/article/create",  // ← Ruta que definimos
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error al crear el artículo:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const updateArticle = async (payload) => {
  try {
    const response = await instance.put(
      "/inventory/article/update",  // ← Ruta que definimos
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error al crear el artículo:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};