// src/components/PaymentValidation/IndicadoresGestion.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  Grow,
  Divider,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { tokens } from "../../theme";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PhotoCameraFrontOutlinedIcon from "@mui/icons-material/PhotoCameraFrontOutlined";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import LocationOffOutlinedIcon from "@mui/icons-material/LocationOffOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import PhotoLibraryOutlinedIcon from "@mui/icons-material/PhotoLibraryOutlined";
import * as ExcelJS from "exceljs";

// 🔹 Nuevos componentes modales
import ModalSinFotos from "./IndicadoresGestion/ModalSinFotos";
import ModalTodasLasFotos from "./IndicadoresGestion/ModalTodasLasFotos";
import GestionFotosDialog from "./IndicadoresGestion/GestionFotosDialog";

/**
 * IndicadoresGestion
 * ------------------------------------------------------------------
 * Indicadores de gestión de Pagos Válidos. Incluye la card de
 * "Pagos válidos" desde donde se abre el diálogo de gestión de fotos.
 *
 * Props:
 *  - pagosValidos   (arr)  Array de pagos válidos
 *  - placeId        (num)  ID de la plaza (para el backend de fotos)
 *  - servicioId     (num)  ID del servicio (para el backend de fotos)
 *  - userIdSession  (num)  ID del usuario en sesión (bitácora)
 *  - onUpdatePago   (fn)   Callback para actualizar un pago en el padre.
 *                          Firma: ({ cuenta, fechaGestion, foto?, idRegistroFoto? })
 */
const IndicadoresGestion = ({
  pagosValidos = [],
  placeId = null,
  servicioId = null,
  userIdSession = null,
  onUpdatePago = null,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // 🔹 Estados para los modales legacy
  const [modalSinFotosOpen, setModalSinFotosOpen] = useState(false);
  const [modalTodasLasFotosOpen, setModalTodasLasFotosOpen] = useState(false);
  const [tipoFotoModal, setTipoFotoModal] = useState("");
  const [registrosSinFoto, setRegistrosSinFoto] = useState([]);
  const [registrosTodasLasFotos, setRegistrosTodasLasFotos] = useState([]);

  // 🔹 Estado del nuevo diálogo de gestión de fotos
  const [gestionFotosOpen, setGestionFotosOpen] = useState(false);

  // 🔹 Colores específicos
  const COLOR_VALIDO = colors.accentGreen[100];
  const COLOR_ESTANDAR = colors.grey[100];
  const COLOR_REGULAR = colors.yellowAccent[400];
  const COLOR_ATENCION = colors.redAccent[400];

  // 🔹 Filtrar campos de fotos para Excel
  const filtrarCamposFotos = (campos) => {
    return campos.filter((campo) => campo !== "fotos");
  };

  // 🔹 Crear Excel con estilo minimalista
  const crearExcelConEstilo = (
    datos,
    nombreHoja,
    nombreArchivo,
    camposExcluir = [],
  ) => {
    if (!datos.length) {
      alert("No hay datos para descargar");
      return;
    }

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(nombreHoja);

      const allKeys = new Set();
      datos.forEach((item) => {
        Object.keys(item).forEach((key) => allKeys.add(key));
      });

      const camposFiltrados = Array.from(allKeys).filter(
        (campo) => !camposExcluir.includes(campo),
      );

      const columnas = camposFiltrados.map((key) => ({
        header: key,
        key: key,
        width: 15,
      }));

      worksheet.columns = columnas;

      datos.forEach((item) => {
        const rowData = {};
        camposFiltrados.forEach((key) => {
          rowData[key] = item[key] !== undefined ? item[key] : "";
        });
        worksheet.addRow(rowData);
      });

      // Estilos del Excel
      worksheet.getRow(1).font = {
        bold: true,
        size: 11,
        color: { argb: "FF333333" },
      };
      worksheet.getRow(1).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFF5F5F5" },
      };
      worksheet.getRow(1).alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      worksheet.getRow(1).height = 25;

      worksheet.columns.forEach((column, index) => {
        let maxLength = 0;
        const columnIndex = index + 1;

        worksheet
          .getColumn(columnIndex)
          .eachCell({ includeEmpty: true }, (cell) => {
            const cellLength = cell.value ? cell.value.toString().length : 0;
            maxLength = Math.max(maxLength, cellLength);
          });

        const headerLength = column.header.length;
        const finalWidth = Math.max(
          8,
          Math.min(35, Math.max(maxLength, headerLength) + 2),
        );
        column.width = finalWidth;
      });

      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          if (rowNumber % 2 === 0) {
            row.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFFBFBFB" },
            };
          }

          row.alignment = {
            vertical: "middle",
            horizontal: "left",
            wrapText: true,
          };

          row.font = {
            size: 10,
            name: "Arial",
          };
          row.height = 20;
        }
      });

      worksheet.views = [
        { state: "frozen", xSplit: 0, ySplit: 1, activeCell: "A2" },
      ];

      const lastRow = worksheet.rowCount;
      const lastCol = worksheet.columnCount;

      for (let i = 1; i <= lastRow; i++) {
        for (let j = 1; j <= lastCol; j++) {
          const cell = worksheet.getCell(i, j);
          cell.border = {
            top: { style: "thin", color: { argb: "FFEEEEEE" } },
            left: { style: "thin", color: { argb: "FFEEEEEE" } },
            bottom: { style: "thin", color: { argb: "FFEEEEEE" } },
            right: { style: "thin", color: { argb: "FFEEEEEE" } },
          };
        }
      }

      return workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${nombreArchivo}-${
          new Date().toISOString().split("T")[0]
        }.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error("Error al generar Excel:", error);
      alert("Error al descargar el archivo Excel");
    }
  };

  // 🔹 Funciones de descarga específicas
  const descargarPagosValidos = () => {
    const pagosValidosFiltrados = pagosValidos.filter(
      (p) =>
        p["estatus de gestion valida"] === "Gestión válida" &&
        p.evaluacion_periodos === "PERIODO_VALIDO",
    );
    crearExcelConEstilo(
      pagosValidosFiltrados,
      "Pagos Válidos",
      "pagos-validos",
      ["fotos"],
    );
  };

  const descargarPagosNoValidos = () => {
    const pagosNoValidosFiltrados = pagosValidos.filter(
      (p) =>
        p["estatus de gestion valida"] !== "Gestión válida" ||
        (p["estatus de gestion valida"] === "Gestión válida" &&
          p.evaluacion_periodos === "PERIODO_NO_VALIDO"),
    );
    crearExcelConEstilo(
      pagosNoValidosFiltrados,
      "Pagos No Válidos",
      "pagos-no-validos",
      ["fotos"],
    );
  };

  const descargarSinFotoFachada = () => {
    const pagosValidosFiltrados = pagosValidos.filter(
      (p) =>
        p["estatus de gestion valida"] === "Gestión válida" &&
        p.evaluacion_periodos === "PERIODO_VALIDO",
    );
    const sinFotoFachada = pagosValidosFiltrados.filter(
      (p) => p["foto fachada predio"] === 0,
    );
    crearExcelConEstilo(
      sinFotoFachada,
      "Sin Foto Fachada",
      "sin-foto-fachada",
      ["fotos", "foto evidencia predio", "urlImagenEvidencia"],
    );
  };

  const descargarPrediosNoLocalizados = () => {
    const pagosValidosFiltrados = pagosValidos.filter(
      (p) =>
        p["estatus de gestion valida"] === "Gestión válida" &&
        p.evaluacion_periodos === "PERIODO_VALIDO",
    );
    const prediosNoLocalizados = pagosValidosFiltrados.filter(
      (p) => p.estatus_predio !== "Predio localizado",
    );
    crearExcelConEstilo(
      prediosNoLocalizados,
      "Predios No Localizados",
      "predios-no-localizados",
      ["fotos"],
    );
  };

  const descargarSinFotoEvidencia = () => {
    const pagosValidosFiltrados = pagosValidos.filter(
      (p) =>
        p["estatus de gestion valida"] === "Gestión válida" &&
        p.evaluacion_periodos === "PERIODO_VALIDO",
    );
    const sinFotoEvidencia = pagosValidosFiltrados.filter(
      (p) => p["foto evidencia predio"] === 0,
    );
    crearExcelConEstilo(
      sinFotoEvidencia,
      "Sin Foto Evidencia",
      "sin-foto-evidencia",
      ["fotos", "foto fachada predio", "urlImagenFachada"],
    );
  };

  const descargarSinPosicion = () => {
    const pagosValidosFiltrados = pagosValidos.filter(
      (p) =>
        p["estatus de gestion valida"] === "Gestión válida" &&
        p.evaluacion_periodos === "PERIODO_VALIDO",
    );
    const sinPosicion = pagosValidosFiltrados.filter(
      (p) => !p.latitud || p.latitud === 0,
    );
    crearExcelConEstilo(sinPosicion, "Sin Posición GPS", "sin-posicion-gps", [
      "fotos",
    ]);
  };

  // 🔹 Abrir modal legacy de registros sin fotos (se mantiene por ahora)
  const abrirModalSinFotos = React.useCallback(
    (tipo) => {
      const pagosValidosFiltrados = pagosValidos.filter(
        (p) =>
          p["estatus de gestion valida"] === "Gestión válida" &&
          p.evaluacion_periodos === "PERIODO_VALIDO",
      );

      let registrosFiltrados = [];

      if (tipo === "fachada") {
        registrosFiltrados = pagosValidosFiltrados.filter(
          (p) => p["foto fachada predio"] === 0,
        );
      } else if (tipo === "evidencia") {
        registrosFiltrados = pagosValidosFiltrados.filter(
          (p) => p["foto evidencia predio"] === 0,
        );
      }

      setRegistrosSinFoto(registrosFiltrados);
      setTipoFotoModal(tipo);
      setModalSinFotosOpen(true);
    },
    [pagosValidos],
  );

  // 🔹 Abrir modal legacy de todas las fotos (se mantiene por ahora)
  const abrirModalTodasLasFotos = React.useCallback(() => {
    const pagosValidosFiltrados = pagosValidos.filter(
      (p) =>
        p["estatus de gestion valida"] === "Gestión válida" &&
        p.evaluacion_periodos === "PERIODO_VALIDO",
    );

    setRegistrosTodasLasFotos(pagosValidosFiltrados);
    setModalTodasLasFotosOpen(true);
  }, [pagosValidos]);

  // 🔹 Abrir el nuevo diálogo de gestión de fotos
  const abrirGestionFotos = () => {
    setGestionFotosOpen(true);
  };

  // 🔹 Semaforo vial con AZUL para no confundir con el verde de válidos
  const getSemaforoColor = (pct) => {
    if (pct <= 5) return colors.blueAccent[600];
    if (pct <= 15) return colors.blueAccent[600];
    if (pct <= 30) return colors.yellowAccent[400];
    if (pct <= 50) return colors.yellowAccent[500];
    return colors.redAccent[400];
  };

  // 🔹 Cálculo de métricas
  const data = useMemo(() => {
    const pagosValidosFiltrados = pagosValidos.filter(
      (p) =>
        p["estatus de gestion valida"] === "Gestión válida" &&
        p.evaluacion_periodos === "PERIODO_VALIDO",
    );

    const pagosNoValidosFiltrados = pagosValidos.filter(
      (p) =>
        p["estatus de gestion valida"] !== "Gestión válida" ||
        (p["estatus de gestion valida"] === "Gestión válida" &&
          p.evaluacion_periodos === "PERIODO_NO_VALIDO"),
    );

    const sinPosicion = pagosValidosFiltrados.filter(
      (p) => !p.latitud || p.latitud === 0,
    );
    const sinFotoFachada = pagosValidosFiltrados.filter(
      (p) => p["foto fachada predio"] === 0,
    );
    const sinFotoEvidencia = pagosValidosFiltrados.filter(
      (p) => p["foto evidencia predio"] === 0,
    );
    const prediosNoLocalizados = pagosValidosFiltrados.filter(
      (p) => p.estatus_predio !== "Predio localizado",
    );

    const sum = (arr) =>
      arr.reduce((acc, cur) => acc + (parseFloat(cur.total_pagado) || 0), 0);

    const totalValidos = pagosValidosFiltrados.length || 1;

    return {
      total_gestiones_validas: pagosValidosFiltrados.length,
      pagos_validos: {
        count: pagosValidosFiltrados.length,
        monto: sum(pagosValidosFiltrados),
        descargar: descargarPagosValidos,
        gestionarFotos: abrirGestionFotos,
        verFotos: abrirModalTodasLasFotos,
        tooltip: "Descargar listado de pagos válidos (excluye campo 'fotos')",
        tooltipFotos: "Ver todas las fotos de pagos válidos",
        tooltipGestionar: "Gestionar fotografías de pagos válidos",
      },
      pagos_no_validos: {
        count: pagosNoValidosFiltrados.length,
        monto: sum(pagosNoValidosFiltrados),
        descargar: descargarPagosNoValidos,
        tooltip:
          "Descargar listado de pagos no válidos (excluye campo 'fotos')",
      },
      sin_posicion: {
        count: sinPosicion.length,
        pct: (sinPosicion.length / totalValidos) * 100,
        total: totalValidos,
        descargar: descargarSinPosicion,
        tooltip: "Descargar registros sin posición GPS (excluye campo 'fotos')",
      },
      sin_foto_fachada: {
        count: sinFotoFachada.length,
        pct: (sinFotoFachada.length / totalValidos) * 100,
        total: totalValidos,
        descargar: descargarSinFotoFachada,
        adjuntarFoto: () => abrirModalSinFotos("fachada"),
        tooltip: "Descargar registros sin foto de fachada",
        tooltipAdjuntar: "Gestionar fotos de fachada faltantes",
      },
      sin_foto_evidencia: {
        count: sinFotoEvidencia.length,
        pct: (sinFotoEvidencia.length / totalValidos) * 100,
        total: totalValidos,
        descargar: descargarSinFotoEvidencia,
        adjuntarFoto: () => abrirModalSinFotos("evidencia"),
        tooltip: "Descargar registros sin foto de evidencia",
        tooltipAdjuntar: "Gestionar fotos de evidencia faltantes",
      },
      predios_no_localizados: {
        count: prediosNoLocalizados.length,
        pct: (prediosNoLocalizados.length / totalValidos) * 100,
        total: totalValidos,
        descargar: descargarPrediosNoLocalizados,
        tooltip:
          "Descargar registros de predios no localizados (excluye campo 'fotos')",
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagosValidos]);

  // 🔹 Card compacta para Calidad de Datos con semáforo AZUL
  const CardCalidadDatos = ({
    icon: Icon,
    title,
    count,
    pct,
    total,
    delay = 0,
    descargar,
    tooltip,
  }) => {
    const semaforoColor = getSemaforoColor(pct);

    return (
      <Grow in={true} timeout={400 + delay}>
        <Box
          className="p-4 rounded-xl"
          sx={{
            backgroundColor: colors.bgContainer,
            transition: "all 0.2s ease",
            height: "100%",
            minHeight: "120px",
            display: "flex",
            flexDirection: "column",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            },
            position: "relative",
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "flex-start", gap: 2, mb: 2 }}
          >
            <Box sx={{ color: COLOR_ESTANDAR, flexShrink: 0 }}>
              <Icon sx={{ fontSize: 24 }} />
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 600,
                  color: COLOR_ESTANDAR,
                  lineHeight: 1.3,
                  fontSize: "0.9rem",
                }}
              >
                {title}
              </Typography>
            </Box>

            <Box sx={{ textAlign: "right", minWidth: "60px" }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: semaforoColor,
                  lineHeight: 1,
                }}
              >
                {pct.toFixed(1)}%
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 2, mt: "auto" }}>
            <LinearProgress
              variant="determinate"
              value={pct > 100 ? 100 : pct}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: colors.grey[700],
                "& .MuiLinearProgress-bar": {
                  backgroundColor: semaforoColor,
                  borderRadius: 3,
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: colors.grey[300],
                  fontWeight: 500,
                  fontSize: "0.8rem",
                  lineHeight: 1.4,
                }}
              >
                <Box
                  component="span"
                  sx={{ fontWeight: 600, color: COLOR_ESTANDAR }}
                >
                  {count.toLocaleString("es-MX")}
                </Box>
                <Box
                  component="span"
                  sx={{ color: colors.grey[500], fontSize: "0.75rem", ml: 0.5 }}
                >
                  de {total.toLocaleString("es-MX")} registros
                </Box>
              </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 0.5 }}>
              {descargar && (
                <Tooltip title={tooltip} arrow>
                  <IconButton
                    size="small"
                    onClick={descargar}
                    sx={{
                      color: colors.textAccentSecondary,
                      backgroundColor: colors.bgContainerSecondary,
                      "&:hover": {
                        color: colors.textAccentSecondary,
                        backgroundColor: colors.bgContainer,
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s ease",
                      padding: "6px",
                    }}
                  >
                    <DownloadOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Box>
      </Grow>
    );
  };

  return (
    <Box sx={{ mt: 6 }}>
      {/* Título principal */}
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          color: COLOR_ESTANDAR,
          fontWeight: 600,
          fontSize: "1.125rem",
        }}
      >
        Indicadores de Gestión
      </Typography>

      {/* 🧱 Resumen de Pagos */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          sx={{
            mb: 2,
            color: colors.grey[300],
            fontWeight: 500,
          }}
        >
          Resumen de Pagos
        </Typography>
        <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {/* PAGOS VÁLIDOS */}
          <Grow in={true} timeout={400}>
            <Box
              className="p-4 rounded-xl"
              sx={{
                backgroundColor: colors.bgContainer,
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                },
                position: "relative",
              }}
            >
              <Box sx={{ color: COLOR_VALIDO, fontSize: 28 }}>
                <PaidOutlinedIcon />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: COLOR_VALIDO }}
                >
                  {data.pagos_validos.count.toLocaleString("es-MX")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: colors.grey[400], mb: 0.5 }}
                >
                  Pagos válidos
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: COLOR_VALIDO, fontWeight: 500 }}
                >
                  ${data.pagos_validos.monto.toLocaleString("es-MX")}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                  position: "absolute",
                  top: 8,
                  right: 8,
                }}
              >
                {/* Botón de descarga */}
                <Tooltip title={data.pagos_validos.tooltip} arrow>
                  <IconButton
                    size="small"
                    onClick={data.pagos_validos.descargar}
                    sx={{
                      color: colors.textAccentSecondary,
                      backgroundColor: colors.bgContainerSecondary,
                      "&:hover": {
                        color: colors.textAccentSecondary,
                        backgroundColor: colors.bgContainer,
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s ease",
                      padding: "6px",
                    }}
                  >
                    <DownloadOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                {/* NUEVO: Botón gestionar fotos */}
                <Tooltip title={data.pagos_validos.tooltipGestionar} arrow>
                  <IconButton
                    size="small"
                    onClick={data.pagos_validos.gestionarFotos}
                    sx={{
                      color: colors.blueAccent[400],
                      backgroundColor: colors.bgContainerSecondary,
                      "&:hover": {
                        color: colors.blueAccent[400],
                        backgroundColor: colors.bgContainer,
                        transform: "scale(1.05)",
                      },
                      transition: "all 0.2s ease",
                      padding: "6px",
                    }}
                  >
                    <PhotoLibraryOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grow>

          {/* PAGOS NO VÁLIDOS */}
          <Grow in={true} timeout={500}>
            <Box
              className="p-4 rounded-xl"
              sx={{
                backgroundColor: colors.bgContainer,
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "all 0.2s ease",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                },
                position: "relative",
              }}
            >
              <Box sx={{ color: COLOR_ESTANDAR, fontSize: 28 }}>
                <BlockOutlinedIcon />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: COLOR_ESTANDAR }}
                >
                  {data.pagos_no_validos.count.toLocaleString("es-MX")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: colors.grey[400], mb: 0.5 }}
                >
                  Pagos no válidos
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: COLOR_ESTANDAR, fontWeight: 500 }}
                >
                  ${data.pagos_no_validos.monto.toLocaleString("es-MX")}
                </Typography>
              </Box>

              <Tooltip title={data.pagos_no_validos.tooltip} arrow>
                <IconButton
                  size="small"
                  onClick={data.pagos_no_validos.descargar}
                  sx={{
                    color: colors.textAccentSecondary,
                    backgroundColor: colors.bgContainerSecondary,
                    "&:hover": {
                      color: colors.textAccentSecondary,
                      backgroundColor: colors.bgContainer,
                      transform: "scale(1.05)",
                    },
                    transition: "all 0.2s ease",
                    padding: "6px",
                    position: "absolute",
                    top: 8,
                    right: 8,
                  }}
                >
                  <DownloadOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grow>
        </Box>
      </Box>

      <Divider sx={{ my: 4, borderColor: colors.borderContainer }} />

      {/* 📊 Calidad de Datos */}
      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            color: colors.grey[300],
            fontWeight: 500,
            mb: 3,
          }}
        >
          Calidad de Datos en Gestiones Válidas
        </Typography>

        <Box className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <CardCalidadDatos
            icon={PhotoCameraFrontOutlinedIcon}
            title="Sin foto de fachada"
            count={data.sin_foto_fachada.count}
            pct={data.sin_foto_fachada.pct}
            total={data.sin_foto_fachada.total}
            delay={0}
            descargar={data.sin_foto_fachada.descargar}
            tooltip={data.sin_foto_fachada.tooltip}
          />
          <CardCalidadDatos
            icon={LocationOffOutlinedIcon}
            title="Predios no localizados"
            count={data.predios_no_localizados.count}
            pct={data.predios_no_localizados.pct}
            total={data.predios_no_localizados.total}
            delay={100}
            descargar={data.predios_no_localizados.descargar}
            tooltip={data.predios_no_localizados.tooltip}
          />
          <CardCalidadDatos
            icon={PhotoOutlinedIcon}
            title="Sin foto de evidencia"
            count={data.sin_foto_evidencia.count}
            pct={data.sin_foto_evidencia.pct}
            total={data.sin_foto_evidencia.total}
            delay={200}
            descargar={data.sin_foto_evidencia.descargar}
            tooltip={data.sin_foto_evidencia.tooltip}
          />
          <CardCalidadDatos
            icon={PlaceOutlinedIcon}
            title="Sin posición GPS"
            count={data.sin_posicion.count}
            pct={data.sin_posicion.pct}
            total={data.sin_posicion.total}
            delay={300}
            descargar={data.sin_posicion.descargar}
            tooltip={data.sin_posicion.tooltip}
          />
        </Box>
      </Box>

      {/* 🔹 MODALES LEGACY (se mantienen por ahora) */}
      <ModalSinFotos
        open={modalSinFotosOpen}
        onClose={() => setModalSinFotosOpen(false)}
        registros={registrosSinFoto}
        tipoFoto={tipoFotoModal}
        onEnviarFoto={async () => {
          // Legacy: deshabilitado. Se usa GestionFotosDialog.
          return false;
        }}
      />

      <ModalTodasLasFotos
        open={modalTodasLasFotosOpen}
        onClose={() => setModalTodasLasFotosOpen(false)}
        fotos={registrosTodasLasFotos}
      />

      {/* 🔹 NUEVO DIÁLOGO DE GESTIÓN DE FOTOS */}
      <GestionFotosDialog
        open={gestionFotosOpen}
        onClose={() => setGestionFotosOpen(false)}
        pagosValidos={pagosValidos}
        placeId={placeId}
        servicioId={servicioId}
        userIdSession={userIdSession}
        onUpdatePago={onUpdatePago}
        colors={colors}
        COLOR_TEXTO={COLOR_ESTANDAR}
        COLOR_FONDO={colors.bgContainer}
        COLOR_BORDE={colors.primary[500]}
        COLOR_EFICIENTE={COLOR_VALIDO}
        COLOR_REGULAR={COLOR_REGULAR}
        COLOR_ATENCION={COLOR_ATENCION}
      />
    </Box>
  );
};

export default IndicadoresGestion;
