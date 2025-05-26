import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  datosPersonales: {
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    fecha_nacimiento: "",
    id_sexo: 1,
    telefono_personal: "",
    telefono_empresa: "",
    id_area: "",
    id_puesto: "",
    id_horario: "",
    usuario: "",
    contrasena: "",
    activo: true,
    activo_app_movil: true,
    activo_app_desktop: false,
    foto: "",
    id_rol: "",
  },
  plazas: [],
  horario: [],
  menus: [],
  resguardo: [],
  seccionesEstado: {
    datosPersonales: { completado: false },
    plazas: { completado: false },
    horario: { completado: false },
    menus: { completado: false },
    resguardo: { completado: false },
  },
  seccionesVisibles: {
    plazas: false,
    horario: false,
    menus: false,
    resguardo: false,
  },
  modo: "create", // o "edicion"
  borradorGuardado: false,
};

const formularioSlice = createSlice({
  name: "formulario",
  initialState,
  reducers: {
    // Guardar datos por sección y marcar como completado
    setSectionData: (state, action) => {
      const { section, data } = action.payload;
      if (state.hasOwnProperty(section)) {
        state[section] = data;

        if (state.modo === "create" && state.seccionesEstado[section]) {
          state.seccionesEstado[section].completado = true;
        }

        // Si es datosPersonales y contiene id_rol, actualizar seccionesVisibles
        if (section === "datosPersonales" && data.id_rol !== undefined) {
          const idRol = parseInt(data.id_rol);
          console.log(idRol);
          if (idRol === 5) {
            state.seccionesVisibles = {
              plazas: true,
              horario: true,
              menus: false,
              resguardo: false,
            };
          } else if (idRol === 1) {
            state.seccionesVisibles = {
              plazas: false,
              horario: true,
              menus: false,
              resguardo: true,
            };
          } else {
            state.seccionesVisibles = {
              plazas: true,
              horario: true,
              menus: true,
              resguardo: false,
            };
          }
          console.log(
            "idRol:",
            idRol,
            "seccionesVisibles:",
            state.seccionesVisibles
          );
        }
      }
    },

    // Marcar sección como incompleta manualmente
    marcarSeccionIncompleta: (state, action) => {
      const section = action.payload;
      if (state.seccionesEstado[section]) {
        state.seccionesEstado[section].completado = false;
      }
    },

    // Cambiar modo
    setModo: (state, action) => {
      state.modo = action.payload;
    },

    // Marcar borrador
    guardarBorrador: (state) => {
      state.borradorGuardado = true;
    },

    // Resetear bandera de borrador
    resetBorrador: (state) => {
      state.borradorGuardado = false;
    },

    // Resetear todo el formulario
    resetFormulario: () => initialState,
  },
});

export const {
  setSectionData,
  marcarSeccionIncompleta,
  setModo,
  guardarBorrador,
  resetBorrador,
  resetFormulario,
} = formularioSlice.actions;

export default formularioSlice.reducer;
