import axios from 'axios';

const HEREDESERVER_URL = 'https://geocode.search.hereapi.com/v1/geocode'; // URL del proveedor Heredeveloper
const HEREDESERVER_API_KEY = 'pvpXYHLE9Bl8Ql5BiMwmzDWg9qVFAmaO1bs5B3i8Js0'; // Reemplaza con tu clave de API

export const getCoordinates = async (address) => {
    try {
        const response = await axios.get(HEREDESERVER_URL, {
            params: {
                q: address,
                apiKey: HEREDESERVER_API_KEY,
            },
        });

        const { items } = response.data;
        if (items.length > 0) {
            const { position } = items[0];
            return {
                latitude: position.lat,
                longitude: position.lng,
                observation: 'Posición encontrada satisfactoriamente',
            };
        }
        return {
            latitude: null,
            longitude: null,
            observation: 'Dirección no encontrada',
        }; // Si no se encuentra la dirección
    } catch (error) {
        console.error('Error al obtener coordenadas:', error);
        let observation = 'Error al obtener coordenadas';
        if (error.response) {
            if (error.response.status === 429) {
                observation = 'La direccion tiene demasiados caracteres';
            } else if (error.response.data) {
                observation = error.response.data.message || observation;
            } else if (error.response.status === 401) {
                observation = 'Clave de API no válida o expirada.';
            }
        }
        return {
            latitude: 'Error',
            longitude: 'Error',
            observation,
        }; // Manejar el error devolviendo valores de error
    }
};