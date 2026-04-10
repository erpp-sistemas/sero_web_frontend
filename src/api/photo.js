// src/api/photo.js
import axios from './axios'

// Función existente - Guardar foto (para otro panorama)
export const savePhotoRequest = (photo_data) => axios.post(`/SavePhoto`, photo_data)

// ============================================================
// NUEVAS FUNCIONES PARA GESTORDETALLESDIALOG
// ============================================================

/**
 * Insertar una nueva foto
 * @param {Object} photoData - Datos de la foto
 * @param {number} photoData.place_id - ID del lugar
 * @param {string} photoData.cuenta - Número de cuenta
 * @param {string} photoData.idAspUser - ID del usuario gestor
 * @param {string} photoData.nombreFoto - Nombre de la foto
 * @param {string} photoData.fechaCaptura - Fecha de captura (ISO string)
 * @param {string} photoData.tipo - Tipo de foto (FACHADA o EVIDENCIA)
 * @param {string} photoData.imagenBase64 - Imagen en base64
 * @param {number} [photoData.id_servicio=2] - ID del servicio
 * @param {boolean} [photoData.medio_carga=false] - Medio de carga
 * @param {boolean} [photoData.tipo_carga=false] - Tipo de carga
 * @returns {Promise} Respuesta del servidor
 */
export const insertFotoRequest = (photoData) => axios.post(`/fotos/insert`, photoData)

/**
 * Actualizar una foto existente
 * @param {Object} photoData - Datos de la foto
 * @param {number} photoData.place_id - ID del lugar
 * @param {number} photoData.idRegistroFoto - ID del registro de foto
 * @param {string} photoData.cuenta - Número de cuenta
 * @param {string} photoData.idAspUser - ID del usuario gestor
 * @param {string} photoData.nombreFoto - Nombre de la foto
 * @param {string} photoData.fechaCaptura - Fecha de captura (ISO string)
 * @param {string} photoData.tipo - Tipo de foto (FACHADA o EVIDENCIA)
 * @param {string} [photoData.imagenBase64] - Nueva imagen en base64 (opcional)
 * @param {string} [photoData.urlImagenExistente] - URL de imagen existente
 * @param {number} [photoData.id_servicio=2] - ID del servicio
 * @param {boolean} [photoData.medio_carga=false] - Medio de carga
 * @param {boolean} [photoData.tipo_carga=false] - Tipo de carga
 * @returns {Promise} Respuesta del servidor
 */
export const updateFotoRequest = (photoData) => axios.put(`/fotos/update`, photoData)

/**
 * Eliminar una foto
 * @param {Object} photoData - Datos de la foto
 * @param {number} photoData.place_id - ID del lugar
 * @param {number} photoData.idRegistroFoto - ID del registro de foto
 * @returns {Promise} Respuesta del servidor
 */
export const deleteFotoRequest = (photoData) => axios.delete(`/fotos/delete`, { data: photoData })

// ============================================================
// FUNCIONES DE UTILIDAD PARA FORMATEAR DATOS
// ============================================================

/**
 * Prepara los datos de una foto para enviar al backend
 * @param {Object} params - Parámetros para preparar la foto
 * @param {string} params.cuenta - Número de cuenta
 * @param {string} params.idAspUser - ID del usuario gestor
 * @param {string} params.nombreFoto - Nombre de la foto
 * @param {string} params.fechaCaptura - Fecha de captura (ISO string)
 * @param {string} params.tipo - Tipo de foto (Fachada predio o Evidencia)
 * @param {File|null} params.imagenFile - Archivo de imagen (para agregar)
 * @param {string|null} params.urlImagenExistente - URL existente (para editar)
 * @param {number|null} params.idRegistroFoto - ID del registro (para editar)
 * @param {number} params.place_id - ID del lugar
 * @returns {Object} Datos formateados para el backend
 */
export const prepareFotoData = ({
    cuenta,
    idAspUser,
    nombreFoto,
    fechaCaptura,
    tipo,
    imagenFile = null,
    urlImagenExistente = null,
    idRegistroFoto = null,
    place_id
}) => {
    const tipoBackend = tipo === "Fachada predio" ? "FACHADA" : "EVIDENCIA";
    
    const baseData = {
        place_id,
        cuenta,
        idAspUser,
        nombreFoto,
        fechaCaptura,
        tipo: tipoBackend,
        id_servicio: 2,
        medio_carga: false,
        tipo_carga: false
    };

    if (idRegistroFoto) {
        // Modo editar
        return {
            ...baseData,
            idRegistroFoto,
            urlImagenExistente,
            imagenBase64: imagenFile || null
        };
    } else {
        // Modo agregar
        return {
            ...baseData,
            imagenBase64: imagenFile
        };
    }
};

/**
 * Convierte un archivo a base64
 * @param {File} file - Archivo a convertir
 * @returns {Promise<string>} Promesa con el string base64
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

// ============================================================
// EJEMPLO DE USO EN EL COMPONENTE
// ============================================================
/*
// En GestorDetallesDialog.jsx, importar las funciones:
import { insertFotoRequest, updateFotoRequest, deleteFotoRequest, prepareFotoData, fileToBase64 } from '../../../api/photo';

// En handleGuardarFoto:
const handleGuardarFoto = async (datos) => {
    setCargandoGuardado(true);
    
    try {
        let imagenBase64 = null;
        
        // Si hay un archivo, convertirlo a base64
        if (datos.imagenFile) {
            imagenBase64 = await fileToBase64(datos.imagenFile);
        }
        
        const fotoData = prepareFotoData({
            cuenta: gestionSeleccionada?.cuenta,
            idAspUser: usuario?.id,
            nombreFoto: datos.nombreFoto,
            fechaCaptura: datos.fechaCaptura,
            tipo: datos.tipo,
            imagenFile: imagenBase64,
            urlImagenExistente: datos.urlImagenExistente,
            idRegistroFoto: modoEditor === "editar" ? fotoEditando?.idRegistroFoto : null,
            place_id: 1 // Ajustar según tu contexto
        });
        
        let response;
        if (modoEditor === "agregar") {
            response = await insertFotoRequest(fotoData);
        } else {
            response = await updateFotoRequest(fotoData);
        }
        
        if (response.data.success) {
            // Actualizar estado local
            actualizarRegistroEnUsuario(gestionSeleccionada?.cuenta, (registro) => {
                const fotosActuales = registro.fotos || [];
                let nuevasFotos;
                
                if (modoEditor === "agregar") {
                    const nuevaFoto = {
                        idRegistroFoto: response.data.idRegistroFoto,
                        cuenta: gestionSeleccionada?.cuenta,
                        idAspUser: usuario?.id,
                        nombreFoto: datos.nombreFoto,
                        fechaCaptura: datos.fechaCaptura,
                        tipo: datos.tipo === "Fachada predio" ? "FACHADA" : "EVIDENCIA",
                        urlImagen: response.data.urlImagen,
                        fechaSincronizacion: new Date().toISOString(),
                        id_servicio: 2,
                        medio_carga: false,
                        tipo_carga: false,
                        verificada: false
                    };
                    nuevasFotos = [nuevaFoto, ...fotosActuales];
                } else {
                    nuevasFotos = fotosActuales.map(f => 
                        f.idRegistroFoto === fotoEditando?.idRegistroFoto 
                            ? { ...f, ...fotoData, urlImagen: response.data.urlImagen }
                            : f
                    );
                }
                
                return { ...registro, fotos: nuevasFotos };
            });
            
            setSnackbarMessage(response.data.message);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            
            setFotoEditando(null);
            setGestionSeleccionada(null);
            setModoEditor(null);
        } else {
            setSnackbarMessage(response.data.message || "Error al guardar la foto");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
        
    } catch (error) {
        console.error("❌ Error al guardar foto:", error);
        setSnackbarMessage(error.response?.data?.message || "Error al guardar la foto");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
    } finally {
        setCargandoGuardado(false);
    }
};

// En handleConfirmarEliminar:
const handleConfirmarEliminar = async () => {
    setCargandoGuardado(true);
    
    try {
        const response = await deleteFotoRequest({
            place_id: 1, // Ajustar según tu contexto
            idRegistroFoto: fotoEliminar.idRegistroFoto
        });
        
        if (response.data.success) {
            actualizarRegistroEnUsuario(fotoEliminar.cuenta, (registro) => {
                const fotosActuales = registro.fotos || [];
                const nuevasFotos = fotosActuales.filter(f => f.idRegistroFoto !== fotoEliminar.idRegistroFoto);
                return { ...registro, fotos: nuevasFotos };
            });
            
            setSnackbarMessage(response.data.message);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            
            setFotoEliminar(null);
            setConfirmDeleteOpen(false);
        } else {
            setSnackbarMessage(response.data.message || "Error al eliminar la foto");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
        
    } catch (error) {
        console.error("❌ Error al eliminar foto:", error);
        setSnackbarMessage(error.response?.data?.message || "Error al eliminar la foto");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
    } finally {
        setCargandoGuardado(false);
    }
};
*/