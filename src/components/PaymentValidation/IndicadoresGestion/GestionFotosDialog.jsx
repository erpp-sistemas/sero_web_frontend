// src/components/PaymentValidation/IndicadoresGestion/GestionFotosDialog.jsx
import React, { useState, useMemo, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  TablePagination,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  Close,
  Search,
  PhotoLibrary,
  Close as CloseIcon,
  Download,
  House as HouseIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import { tokens } from "../../../theme";

import FiltrosFotos from "./FiltrosFotos";
import { obtenerEstadoFotos } from "./estadoFotos";
import TablaGestiones from "./TablaGestiones";
import { parseFotos, esTipoFoto, fechaNuevaFoto, nombreFoto } from "../Shared/fotoRules";
import FotoEditorDialog from "../Shared/FotoEditorDialog";
import ConfirmDeleteDialog from "../Shared/ConfirmDeleteDialog";
import FotoAmpliadaDialog from "../Shared/FotoAmpliadaDialog";

import {
  insertFotoRequest,
  updateFotoRequest,
  deleteFotoRequest,
} from "../../../api/photo";

/**
 * GestionFotosDialog
 * ------------------------------------------------------------------
 * Dialog para gestionar (agregar / editar / eliminar) las fotografías
 * de las gestiones válidas de Pagos Válidos.
 *
 * ⚠️ Solo muestra las gestiones que cumplen:
 *    - p["estatus de gestion valida"] === "Gestión válida"
 *    - p.evaluacion_periodos === "PERIODO_VALIDO"
 *
 * Diseño idéntico al GestorDetallesDialog.
 */
const GestionFotosDialog = ({
  open,
  onClose,
  pagosValidos = [],
  placeId,
  servicioId,
  userIdSession,
  onUpdatePago,
  colors: colorsProp,
  COLOR_TEXTO: COLOR_TEXTO_PROPS,
  COLOR_FONDO: COLOR_FONDO_PROPS,
  COLOR_BORDE: COLOR_BORDE_PROPS,
  COLOR_EFICIENTE: COLOR_EFICIENTE_PROPS,
  COLOR_REGULAR: COLOR_REGULAR_PROPS,
  COLOR_ATENCION: COLOR_ATENCION_PROPS,
}) => {
  const theme = useTheme();
  const colors = colorsProp || tokens(theme.palette.mode);

  const COLOR_TEXTO = COLOR_TEXTO_PROPS || colors.grey[100];
  const COLOR_FONDO = COLOR_FONDO_PROPS || colors.bgContainer;
  const COLOR_BORDE = COLOR_BORDE_PROPS || colors.primary[500];
  const COLOR_EFICIENTE = COLOR_EFICIENTE_PROPS || colors.accentGreen[100];
  const COLOR_REGULAR = COLOR_REGULAR_PROPS || colors.yellowAccent[400];
  const COLOR_ATENCION = COLOR_ATENCION_PROPS || colors.redAccent[400];

  // ----------------------------------------------------------------
  // 🔹 Filtrado: solo gestiones válidas con período válido
  // ----------------------------------------------------------------
  const pagosValidosFiltrados = useMemo(() => {
    return pagosValidos.filter(
      (p) =>
        p["estatus de gestion valida"] === "Gestión válida" &&
        p.evaluacion_periodos === "PERIODO_VALIDO"
    );
  }, [pagosValidos]);

  // ----------------------------------------------------------------
  // Estados
  // ----------------------------------------------------------------
  const [filtroActivo, setFiltroActivo] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Editor
  const [fotoEditando, setFotoEditando] = useState(null);
  const [modoEditor, setModoEditor] = useState(null);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [tipoFotoNueva, setTipoFotoNueva] = useState(null);

  // Eliminar
  const [fotoEliminar, setFotoEliminar] = useState(null);
  const [registroEliminar, setRegistroEliminar] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Visor
  const [fotoAmpliada, setFotoAmpliada] = useState(null);
  const [fotoAmpliadaIndex, setFotoAmpliadaIndex] = useState(0);
  const [fotosAmpliadasLista, setFotosAmpliadasLista] = useState([]);

  // Loading y notificaciones
  const [cargandoAccion, setCargandoAccion] = useState(false);
  const [errorSincronizacion, setErrorSincronizacion] = useState("");
  const accionEnCurso = useRef(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ----------------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------------
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  // ----------------------------------------------------------------
  // Cálculos: conteos para los chips
  // ----------------------------------------------------------------
  const counts = useMemo(() => {
    const conteos = {
      todas: pagosValidosFiltrados.length,
      sin_fotos: 0,
      solo_fachada: 0,
      solo_evidencia: 0,
      con_ambas: 0,
    };

    pagosValidosFiltrados.forEach((registro) => {
      conteos[obtenerEstadoFotos(registro)]++;
    });

    return conteos;
  }, [pagosValidosFiltrados]);

  // ----------------------------------------------------------------
  // Filtrado + búsqueda
  // ----------------------------------------------------------------
  const registrosFiltrados = useMemo(() => {
    let resultado = [...pagosValidosFiltrados];

    if (filtroActivo !== "todas") {
      resultado = resultado.filter(
        (registro) => obtenerEstadoFotos(registro) === filtroActivo,
      );
    }

    const texto = busqueda.trim().toLowerCase();
    if (texto) {
      resultado = resultado.filter((r) => {
        const cuenta = String(r.cuenta || "").toLowerCase();
        const propietario = String(r.propietario || "").toLowerCase();
        const gestor = String(r.gestor || "").toLowerCase();
        return (
          cuenta.includes(texto) ||
          propietario.includes(texto) ||
          gestor.includes(texto)
        );
      });
    }

    return resultado;
  }, [pagosValidosFiltrados, filtroActivo, busqueda]);

  // ----------------------------------------------------------------
  // Paginación
  // ----------------------------------------------------------------
  const ultimaPagina = Math.max(
    0,
    Math.ceil(registrosFiltrados.length / pageSize) - 1,
  );
  const paginaActual = Math.min(pagina, ultimaPagina);

  const registrosPaginados = useMemo(() => {
    const start = paginaActual * pageSize;
    return registrosFiltrados.slice(start, start + pageSize);
  }, [registrosFiltrados, paginaActual, pageSize]);

  React.useEffect(() => {
    setPagina((actual) => Math.min(actual, ultimaPagina));
  }, [ultimaPagina]);

  React.useEffect(() => {
    setPagina(0);
  }, [filtroActivo, busqueda]);

  // ----------------------------------------------------------------
  // Handlers: agregar / editar / eliminar
  // ----------------------------------------------------------------
  const handleAgregarFoto = (registro, tipo) => {
    if (errorSincronizacion) return;
    setRegistroSeleccionado(registro);
    setFotoEditando(null);
    setTipoFotoNueva(tipo);
    setModoEditor("agregar");
  };

  const handleEditarFoto = (registro, foto) => {
    if (errorSincronizacion) return;
    setRegistroSeleccionado(registro);
    setFotoEditando(foto);
    setTipoFotoNueva(null);
    setModoEditor("editar");
  };

  const handleEliminarFoto = (registro, foto) => {
    if (errorSincronizacion) return;
    setRegistroEliminar(registro);
    setFotoEliminar(foto);
    setConfirmDeleteOpen(true);
  };

  const handleFotoClick = (registro, foto) => {
    setRegistroSeleccionado(registro);
    const fotos = parseFotos(registro.fotos);
    const idx = fotos.findIndex(
      (f) =>
        f.idRegistroFoto === foto.idRegistroFoto ||
        f.urlImagen === foto.urlImagen
    );
    setFotosAmpliadasLista(fotos);
    setFotoAmpliadaIndex(idx >= 0 ? idx : 0);
    setFotoAmpliada(foto);
  };

  const handleNextFoto = () => {
    if (fotoAmpliadaIndex < fotosAmpliadasLista.length - 1) {
      const next = fotoAmpliadaIndex + 1;
      setFotoAmpliadaIndex(next);
      setFotoAmpliada(fotosAmpliadasLista[next]);
    }
  };

  const handlePrevFoto = () => {
    if (fotoAmpliadaIndex > 0) {
      const prev = fotoAmpliadaIndex - 1;
      setFotoAmpliadaIndex(prev);
      setFotoAmpliada(fotosAmpliadasLista[prev]);
    }
  };

  const fotosEditor = useMemo(
    () => registroSeleccionado ? parseFotos(registroSeleccionado.fotos) : [],
    [registroSeleccionado],
  );

  // ----------------------------------------------------------------
  // Guardar foto
  // ----------------------------------------------------------------
  const handleGuardarFoto = async (datos) => {
    if (!registroSeleccionado || accionEnCurso.current || errorSincronizacion) return false;

    accionEnCurso.current = true;
    setCargandoAccion(true);

    try {
      if (!placeId || !servicioId || !userIdSession) {
        throw new Error("Falta la plaza, servicio o usuario de sesión");
      }
      const fechaCapturaEnvio = modoEditor === "editar"
        ? fotoEditando.fechaCaptura
        : fechaNuevaFoto(registroSeleccionado.fecha_de_gestion, fotosEditor);

      const fotoData = {
        place_id: placeId,
        cuenta: registroSeleccionado.cuenta,
        idAspUser: modoEditor === "editar" ? fotoEditando.idAspUser : userIdSession,
        nombreFoto: modoEditor === "editar" ? nombreFoto(fotoEditando) : `${registroSeleccionado.cuenta}${fechaCapturaEnvio}.000Z`,
        fechaCaptura: fechaCapturaEnvio,
        tipo: datos.tipo,
        imagenBase64: datos.imagenBase64 || null,
        urlImagenExistente: datos.urlImagenExistente,
        id_servicio: servicioId,
        medio_carga: false,
        tipo_carga: false,
        id_usuario_session: userIdSession,
      };

      if (!["FACHADA", "EVIDENCIA"].includes(datos.tipo)) throw new Error("Selecciona un tipo de fotografía válido");
      if (modoEditor === "agregar" && !datos.imagenBase64) throw new Error("Selecciona una imagen para agregar");
      if (modoEditor === "editar") {
        if (fotoEditando?.idRegistroFoto == null) throw new Error("Falta el identificador de la foto a editar");
        fotoData.idRegistroFoto = fotoEditando.idRegistroFoto;
        if (fotoEditando.idTarea != null) fotoData.idTarea = fotoEditando.idTarea;
      }
      if (!fotoData.nombreFoto) throw new Error("No se pudo identificar el archivo original de la fotografía");

      let response;
      if (modoEditor === "agregar") {
        response = await insertFotoRequest(fotoData);
      } else {
        response = await updateFotoRequest(fotoData);
      }

      if (response.data.success) {
        const idRegistroFoto =
          response.data.idRegistroFoto || datos.idRegistroFotoExistente;
        const urlImagen =
          response.data.urlImagen || datos.urlImagenExistente;

        if (idRegistroFoto == null || !urlImagen) {
          setModoEditor(null);
          setErrorSincronizacion("El servidor guardó la foto pero no devolvió su identificador o URL. Vuelve a consultar los filtros de pagos para sincronizar antes de administrar más fotos.");
          return;
        }
        const fotoGuardada = {
          ...(modoEditor === "editar" ? fotoEditando : {}),
          idRegistroFoto,
          cuenta: registroSeleccionado.cuenta,
          idAspUser: fotoData.idAspUser,
          nombreFoto: fotoData.nombreFoto,
          fechaCaptura: fechaCapturaEnvio,
          tipo: datos.tipo,
          urlImagen,
        };
        onUpdatePago({
          cuenta: registroSeleccionado.cuenta,
          fechaGestion: registroSeleccionado.fecha_de_gestion,
          foto: fotoGuardada,
        });

        showSnackbar(
          response.data.message ||
            (modoEditor === "agregar"
              ? "Foto agregada correctamente"
              : "Foto actualizada correctamente"),
          "success"
        );

        setFotoEditando(null);
        setRegistroSeleccionado(null);
        setModoEditor(null);
        setTipoFotoNueva(null);
        return true;
      } else {
        showSnackbar(
          response.data.message || "Error al guardar la foto",
          "error"
        );
        return false;
      }
    } catch (error) {
      console.error("❌ Error al guardar foto:", error);
      showSnackbar(
        error.response?.data?.message ||
          "Error al guardar la foto. Intenta nuevamente.",
        "error"
      );
      return false;
    } finally {
      accionEnCurso.current = false;
      setCargandoAccion(false);
    }
  };

  // ----------------------------------------------------------------
  // Eliminar foto
  // ----------------------------------------------------------------
  const handleConfirmarEliminar = async () => {
    if (!fotoEliminar || !registroEliminar || accionEnCurso.current) return;
    accionEnCurso.current = true;

    setCargandoAccion(true);

    try {
      if (!placeId || !userIdSession || fotoEliminar.idRegistroFoto == null) {
        throw new Error("Falta el identificador de la fotografía, plaza o usuario");
      }
      const response = await deleteFotoRequest({
        place_id: placeId,
        idRegistroFoto: fotoEliminar.idRegistroFoto,
        id_usuario_session: userIdSession,
      });

      if (response.data.success) {
        onUpdatePago({
          cuenta: registroEliminar.cuenta,
          fechaGestion: registroEliminar.fecha_de_gestion,
          idRegistroFoto: fotoEliminar.idRegistroFoto,
        });
        setModoEditor(null);
        setRegistroSeleccionado(null);
        setFotoEditando(null);

        showSnackbar(
          response.data.message || "Foto eliminada correctamente",
          "success"
        );

        setFotoEliminar(null);
        setRegistroEliminar(null);
        setConfirmDeleteOpen(false);
      } else {
        showSnackbar(
          response.data.message || "Error al eliminar la foto",
          "error"
        );
      }
    } catch (error) {
      console.error("❌ Error al eliminar foto:", error);
      showSnackbar(
        error.response?.data?.message ||
          "Error al eliminar la foto. Intenta nuevamente.",
        "error"
      );
    } finally {
      accionEnCurso.current = false;
      setCargandoAccion(false);
    }
  };

  // ----------------------------------------------------------------
  // Reset al cerrar
  // ----------------------------------------------------------------
  const handleClose = () => {
    if (cargandoAccion) return;
    onClose();
  };

  // ----------------------------------------------------------------
  // Contadores de fotos (footer)
  // ----------------------------------------------------------------
  const totalFotosFiltradas = useMemo(() => {
    let countFachada = 0;
    let countEvidencia = 0;

    registrosFiltrados.forEach((r) => {
      const fotos = parseFotos(r.fotos);
      fotos.forEach((f) => {
        if (esTipoFoto(f, "fachada")) countFachada++;
        if (esTipoFoto(f, "evidencia")) countEvidencia++;
      });
    });

    return {
      fachada: countFachada,
      evidencia: countEvidencia,
      total: countFachada + countEvidencia,
    };
  }, [registrosFiltrados]);

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: "90vh",
            borderRadius: "12px",
            overflow: "hidden",
          },
        }}
      >
        {/* ---------- HEADER ---------- */}
        <DialogTitle
          sx={{
            backgroundColor: COLOR_FONDO,
            color: COLOR_TEXTO,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
            borderBottom: `1px solid ${COLOR_BORDE}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <PhotoLibrary sx={{ color: COLOR_TEXTO, fontSize: 28 }} />
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: COLOR_TEXTO }}
              >
                Gestión de fotografías
              </Typography>
              <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                {counts.todas} gestión{counts.todas !== 1 ? "es" : ""} válida
                {counts.todas !== 1 ? "s" : ""} • {counts.sin_fotos + counts.solo_evidencia} sin
                fachada • {counts.sin_fotos + counts.solo_fachada} sin evidencia
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleClose}
            disabled={cargandoAccion}
            sx={{ color: colors.grey[400] }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        {/* ---------- CONTENIDO ---------- */}
        <DialogContent
          sx={{
            backgroundColor: COLOR_FONDO,
            p: 3,
            minHeight: 0,
            overflow: "auto",
          }}
        >
          {errorSincronizacion && <Alert severity="warning" sx={{ mb: 2 }}>{errorSincronizacion}</Alert>}
          {/* Filtros */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: COLOR_TEXTO,
                mb: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              📊 Filtrar por estado de fotos
              <Typography
                component="span"
                variant="caption"
                sx={{
                  color: colors.grey[500],
                  fontWeight: 400,
                  ml: 1,
                }}
              >
                (Haz clic para filtrar)
              </Typography>
            </Typography>

            <FiltrosFotos
              filtroActivo={filtroActivo}
              onChange={setFiltroActivo}
              counts={counts}
              COLOR_EFICIENTE={COLOR_EFICIENTE}
              COLOR_REGULAR={COLOR_REGULAR}
              COLOR_ATENCION={COLOR_ATENCION}
            />
          </Box>

          {/* Búsqueda */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: COLOR_TEXTO }}
            >
              📝 Gestiones válidas
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Buscar cuenta, propietario o gestor..."
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                InputProps={{
                  endAdornment: (
                    <>
                      {busqueda && (
                        <IconButton
                          size="small"
                          onClick={() => setBusqueda("")}
                          aria-label="Limpiar búsqueda"
                          sx={{
                            color: colors.grey[400],
                            p: 0.5,
                            mr: 0.5,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              color: colors.accentGreen[100],
                              backgroundColor: `${colors.accentGreen[100]}10`,
                            },
                          }}
                        >
                          <CloseIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      )}
                      <InputAdornment position="end">
                        <Search
                          sx={{ color: colors.grey[300], fontSize: 20 }}
                        />
                      </InputAdornment>
                    </>
                  ),
                }}
                sx={{
                  minWidth: { xs: "100%", sm: 260 },
                  maxWidth: 320,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    fontSize: "0.875rem",
                    backgroundColor: colors.bgContainer,
                    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.borderContainer,
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.accentGreen[100],
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.accentGreen[200],
                      boxShadow: "0 0 0 3px rgba(34,197,94,0.15)",
                    },
                    "& input::placeholder": {
                      color: colors.grey[400],
                      opacity: 1,
                    },
                  },
                  "& .MuiInputAdornment-root": {
                    marginRight: "8px",
                  },
                }}
              />
            </Box>
          </Box>

          {/* Conteo */}
          <Typography
            variant="body2"
            sx={{ color: colors.grey[400], fontSize: "0.875rem", mb: 2 }}
          >
            {filtroActivo === "todas" ? (
              <>Mostrando {registrosFiltrados.length} registros</>
            ) : (
              <>
                Filtrado: <strong>{registrosFiltrados.length}</strong> de{" "}
                {counts.todas} registros
              </>
            )}
          </Typography>

          {/* Tabla */}
          <TablaGestiones
            registros={registrosPaginados}
            onAgregarFoto={handleAgregarFoto}
            onEditarFoto={handleEditarFoto}
            onEliminarFoto={handleEliminarFoto}
            onFotoClick={handleFotoClick}
            COLOR_TEXTO={COLOR_TEXTO}
            COLOR_BORDE={COLOR_BORDE}
            COLOR_EFICIENTE={COLOR_EFICIENTE}
            COLOR_REGULAR={COLOR_REGULAR}
            COLOR_ATENCION={COLOR_ATENCION}
          />
        </DialogContent>

        {/* ---------- FOOTER ---------- */}
        <DialogActions
          sx={{
            backgroundColor: COLOR_FONDO,
            p: 2,
            borderTop: `1px solid ${COLOR_BORDE}`,
            justifyContent: "space-between",
          }}
        >
          <Button onClick={handleClose} sx={{ color: colors.grey[400] }}>
            Cerrar
          </Button>

          {/* Contadores */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <Tooltip
              title={`${totalFotosFiltradas.fachada} fachada${
                totalFotosFiltradas.fachada !== 1 ? "s" : ""
              } en gestiones filtradas`}
              arrow
            >
              <Chip
                label={totalFotosFiltradas.fachada}
                size="small"
                icon={<HouseIcon sx={{ fontSize: 12 }} />}
                sx={{
                  backgroundColor:
                    totalFotosFiltradas.fachada > 0
                      ? COLOR_EFICIENTE + "20"
                      : COLOR_REGULAR + "20",
                  color:
                    totalFotosFiltradas.fachada > 0
                      ? COLOR_EFICIENTE
                      : COLOR_REGULAR,
                  fontSize: "0.7rem",
                  minWidth: 40,
                  height: 22,
                  "& .MuiChip-icon": {
                    fontSize: "0.8rem",
                    marginLeft: "4px",
                    marginRight: "2px",
                    color:
                      totalFotosFiltradas.fachada > 0
                        ? COLOR_EFICIENTE
                        : COLOR_REGULAR,
                  },
                  "& .MuiChip-label": {
                    px: 0.5,
                  },
                }}
              />
            </Tooltip>

            <Tooltip
              title={`${totalFotosFiltradas.evidencia} evidencia${
                totalFotosFiltradas.evidencia !== 1 ? "s" : ""
              } en gestiones filtradas`}
              arrow
            >
              <Chip
                label={totalFotosFiltradas.evidencia}
                size="small"
                icon={<DescriptionIcon sx={{ fontSize: 12 }} />}
                sx={{
                  backgroundColor:
                    totalFotosFiltradas.evidencia > 0
                      ? COLOR_EFICIENTE + "20"
                      : COLOR_REGULAR + "20",
                  color:
                    totalFotosFiltradas.evidencia > 0
                      ? COLOR_EFICIENTE
                      : COLOR_REGULAR,
                  fontSize: "0.7rem",
                  minWidth: 40,
                  height: 22,
                  "& .MuiChip-icon": {
                    fontSize: "0.8rem",
                    marginLeft: "4px",
                    marginRight: "2px",
                    color:
                      totalFotosFiltradas.evidencia > 0
                        ? COLOR_EFICIENTE
                        : COLOR_REGULAR,
                  },
                  "& .MuiChip-label": {
                    px: 0.5,
                  },
                }}
              />
            </Tooltip>

            <Tooltip title="Total de fotos en gestiones filtradas" arrow>
              <Chip
                label={`📸 ${totalFotosFiltradas.total}`}
                size="small"
                sx={{
                  backgroundColor: colors.primary[800],
                  color: colors.grey[300],
                  fontSize: "0.7rem",
                  minWidth: 50,
                  height: 22,
                  "& .MuiChip-label": {
                    px: 0.5,
                  },
                }}
              />
            </Tooltip>
          </Box>

          <Button
            variant="text"
            startIcon={<Download />}
            disabled={registrosFiltrados.length === 0}
            onClick={() => {
              // Descarga placeholder — se puede implementar después
              alert("Descarga de reporte próximamente");
            }}
            sx={{
              color: colors.grey[400],
              textTransform: "none",
              fontWeight: 400,
              fontSize: "0.875rem",
              "&:hover": {
                backgroundColor: colors.primary[400] + "20",
                color: COLOR_TEXTO,
              },
            }}
          >
            Descargar reporte
          </Button>
        </DialogActions>

        {/* ---------- PAGINACIÓN ---------- */}
        {registrosFiltrados.length > 0 && (
          <TablePagination
            component="div"
            count={registrosFiltrados.length}
            page={paginaActual}
            onPageChange={(e, newPage) => setPagina(newPage)}
            rowsPerPage={pageSize}
            onRowsPerPageChange={(e) => {
              setPageSize(parseInt(e.target.value, 10));
              setPagina(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
            labelRowsPerPage="Registros por página:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}–${to} de ${count}`
            }
            getItemAriaLabel={(type) =>
              type === "next" ? "Página siguiente" : "Página anterior"
            }
            sx={{
              flexShrink: 0,
              backgroundColor: COLOR_FONDO,
              color: COLOR_TEXTO,
              borderTop: `1px solid ${COLOR_BORDE}`,
              "& .MuiTablePagination-selectIcon": {
                color: COLOR_TEXTO,
              },
            }}
          />
        )}
      </Dialog>

      {/* ---------- EDITOR ---------- */}
      <FotoEditorDialog
        open={Boolean(modoEditor)}
        onClose={() => {
          if (cargandoAccion) return;
          setFotoEditando(null);
          setRegistroSeleccionado(null);
          setModoEditor(null);
          setTipoFotoNueva(null);
        }}
        onSave={handleGuardarFoto}
        foto={fotoEditando}
        modo={modoEditor}
        cuenta={registroSeleccionado?.cuenta}
        fechaRegistro={registroSeleccionado?.fecha_de_gestion}
        tipoInicial={tipoFotoNueva}
        fotosDisponibles={fotosEditor}
        onSeleccionarFoto={setFotoEditando}
        onEliminarFoto={(foto) => handleEliminarFoto(registroSeleccionado, foto)}
        colors={colors}
        COLOR_TEXTO={COLOR_TEXTO}
        COLOR_FONDO={COLOR_FONDO}
        COLOR_BORDE={COLOR_BORDE}
      />

      {/* ---------- CONFIRMAR ELIMINAR ---------- */}
      <ConfirmDeleteDialog
        open={confirmDeleteOpen}
        onClose={() => {
          if (cargandoAccion) return;
          setFotoEliminar(null);
          setRegistroEliminar(null);
          setConfirmDeleteOpen(false);
        }}
        onConfirm={handleConfirmarEliminar}
        foto={fotoEliminar}
        loading={cargandoAccion}
        colors={colors}
        COLOR_FONDO={COLOR_FONDO}
        COLOR_BORDE={COLOR_BORDE}
      />

      {/* ---------- VISOR AMPLIADO ---------- */}
      <FotoAmpliadaDialog
        open={Boolean(fotoAmpliada)}
        foto={fotoAmpliada}
        onClose={() => setFotoAmpliada(null)}
        onNext={handleNextFoto}
        onPrev={handlePrevFoto}
        onDownload={(f) => {
          const url = f.urlImagen || f.url;
          if (!url) return;
          const link = document.createElement("a");
          link.href = url;
          link.download = `${f.tipo}_${f.cuenta}_${
            f.nombreFoto || "foto"
          }.jpg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}
        onEdit={(f) => {
          setFotoAmpliada(null);
          if (registroSeleccionado) {
            handleEditarFoto(registroSeleccionado, f);
          }
        }}
        onDelete={(f) => {
          setFotoAmpliada(null);
          if (registroSeleccionado) {
            handleEliminarFoto(registroSeleccionado, f);
          }
        }}
        totalFotos={fotosAmpliadasLista.length}
        index={fotoAmpliadaIndex}
      />

      {/* ---------- SNACKBAR ---------- */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            backgroundColor:
              snackbar.severity === "success"
                ? colors.greenAccent[200]
                : snackbar.severity === "error"
                ? colors.redAccent[200]
                : colors.blueAccent[200],
            color: colors.grey[100],
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            "& .MuiAlert-icon": {
              color: colors.grey[100],
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* ---------- OVERLAY DE CARGA ---------- */}
      {cargandoAccion && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <CircularProgress sx={{ color: colors.accentGreen[100] }} />
        </Box>
      )}
    </>
  );
};

export default GestionFotosDialog;
