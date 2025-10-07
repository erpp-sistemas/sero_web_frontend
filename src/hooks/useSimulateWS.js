import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage } from '../redux/socketSlice';

function useSimulateWS() {
  const dispatch = useDispatch();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const cuenta = '12345';
      const latitud = 20.6736;
      const longitud = -103.344;
      const reqBody = {
        id_usuario: 1,
        id_tarea: 5,
        nombre: 'Juan',
        apellido_paterno: 'Pérez',
        apellido_materno: 'Gómez',
        fecha: new Date().toISOString(),
        estatus_predio: 'Localizado',
        domicilio_verified: 1,
      };

      const simulatedMessage = {
        type: 'on-register-form-dynamic-changed',
        payload: {
          message: "Se inserto un registro de formulario dinamico",
          data: {
            cuenta,
            latitud,
            longitud,
            data: reqBody,
          }
        }
      };

      // Enviamos el mensaje al store como si viniera del backend
      dispatch(addMessage(simulatedMessage));
      console.log('Mensaje simulado enviado al store:', simulatedMessage);
    }, 6000); // Simula 3 segundos después de cargar

    return () => clearTimeout(timeout);
  }, [dispatch]);
}

export default useSimulateWS;
