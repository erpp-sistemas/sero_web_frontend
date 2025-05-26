import { useDispatch, useSelector } from "react-redux";
import {
  setSectionData,
  marcarSeccionIncompleta,
  setModo,
  guardarBorrador,
  resetBorrador,
  resetFormulario,
} from "../redux/formularioSlice";

const useFormulario = () => {
  const dispatch = useDispatch();
  const formulario = useSelector((state) => state.formulario);

  const guardarSeccion = (section, data) => {
    const { seccionesEstado, modo } = formulario;

    if (modo === "create" && seccionesEstado[section]?.completado) {
      return;
    }

    dispatch(setSectionData({ section, data }));  
  };


  return {
    ...formulario,
    seccionesCompletadas: formulario.seccionesEstado,
    guardarSeccion,
    marcarIncompleta: (section) => dispatch(marcarSeccionIncompleta(section)),
    cambiarModo: (modo) => dispatch(setModo(modo)),
    guardarBorrador: () => dispatch(guardarBorrador()),
    resetearBorrador: () => dispatch(resetBorrador()),
    resetearFormulario: () => dispatch(resetFormulario()),
  };
};

export default useFormulario;
