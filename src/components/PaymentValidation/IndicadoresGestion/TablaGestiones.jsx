// src/components/PaymentValidation/IndicadoresGestion/TablaGestiones.jsx
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Button,
  useTheme,
} from "@mui/material";
import {
  AddPhotoAlternate,
  Edit,
  Delete,
  House as HouseIcon,
  Description as DescriptionIcon,
  AssignmentOutlined,
} from "@mui/icons-material";
import { fotoRepresentativa, nombreFoto, parseFotos } from "../Shared/fotoRules";
import { tokens } from "../../../theme";

/**
 * TablaGestiones
 * ------------------------------------------------------------------
 * Tabla de gestiones válidas con estado de fotos y acciones.
 * Diseño idéntico al GestorDetallesDialog:
 *  - MUI Table/TableContainer/TableHead/TableBody/TableRow/TableCell
 *  - Estilo Paper con border COLOR_BORDE y borderRadius 8px
 *  - Chips de fotos en las columnas de cada tipo
 *
 * Props:
 *  - registros        (arr)  Array de pagos válidos con sus fotos
 *  - onAgregarFoto    (fn)   Click en "Agregar". Recibe (registro, tipo)
 *                            donde tipo = "FACHADA" | "EVIDENCIA"
 *  - onEditarFoto     (fn)   Click en "Editar". Recibe (registro, foto)
 *  - onEliminarFoto   (fn)   Click en "Eliminar". Recibe (registro, foto)
 *  - onFotoClick      (fn)   Click en thumbnail. Recibe (registro, foto)
 *  - COLOR_TEXTO      (str)  Color de texto
 *  - COLOR_BORDE      (str)  Color de borde
 *  - COLOR_EFICIENTE  (str)  Color para estados positivos
 *  - COLOR_REGULAR    (str)  Color para estados regulares
 *  - COLOR_ATENCION   (str)  Color para estados de atención (rojo)
 */
const TablaGestiones = ({
  registros = [],
  onAgregarFoto,
  onEditarFoto,
  onEliminarFoto,
  onFotoClick,
  COLOR_TEXTO,
  COLOR_BORDE,
  COLOR_ATENCION,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // ----------------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------------
  // ----------------------------------------------------------------
  // Render de celda de foto (alineada verticalmente)
  // ----------------------------------------------------------------
  const renderCeldaFoto = (registro, tipo) => {
    const candidata = fotoRepresentativa(registro, tipo.toLowerCase());
    const foto = nombreFoto(candidata) != null ? candidata : null;
    const esF = tipo === "FACHADA";

    // -------- Sin foto: chip "Falta" + botón agregar --------
    if (!foto) {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
        >
          <Chip
            label="Falta"
            size="small"
            sx={{
              backgroundColor: COLOR_ATENCION + "20",
              color: COLOR_ATENCION,
              fontSize: "0.7rem",
              height: 22,
              fontWeight: 600,
              minWidth: 50,
            }}
          />
          <Tooltip title={`Agregar foto de ${esF ? "fachada" : "evidencia"}`} arrow>
            <IconButton
              size="small"
              onClick={() => onAgregarFoto(registro, tipo)}
              sx={{
                color: colors.blueAccent[400],
                backgroundColor: colors.blueAccent[400] + "15",
                "&:hover": {
                  backgroundColor: colors.blueAccent[400] + "25",
                  transform: "scale(1.05)",
                },
                transition: "all 0.2s ease",
                padding: "5px",
              }}
            >
              <AddPhotoAlternate sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      );
    }

    // -------- Con foto: thumbnail + acciones --------
    const urlImagen = foto.urlImagen || foto.url;
    const fecha = foto.fechaCaptura
      ? new Date(foto.fechaCaptura).toLocaleString("es-MX", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      : "Sin fecha";

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        {/* Thumbnail */}
        <Tooltip
          title={
            <Box>
              <Typography variant="caption" display="block">
                {esF ? "Fachada predio" : "Evidencia"}
              </Typography>
              <Typography
                variant="caption"
                display="block"
                sx={{ fontSize: "0.65rem", color: colors.grey[100] }}
              >
                {fecha}
              </Typography>
            </Box>
          }
          arrow
        >
          <Box
            onClick={() => onFotoClick(registro, foto)}
            sx={{
              width: 44,
              height: 44,
              borderRadius: "8px",
              overflow: "hidden",
              cursor: "pointer",
              border: `1px solid ${
                esF ? colors.greenAccent[700] : colors.blueAccent[700]
              }`,
              backgroundColor: colors.primary[900],
              transition: "all 0.2s ease",
              flexShrink: 0,
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              },
            }}
          >
            <img
              src={urlImagen}
              alt={foto.nombreFoto || "Foto"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/44/${
                  esF ? "1b5e20" : "0d47a1"
                }/ffffff?text=${esF ? "F" : "E"}`;
              }}
            />
          </Box>
        </Tooltip>

        <Tooltip title={`Agregar otra foto de ${esF ? "fachada" : "evidencia"}`}>
          <IconButton size="small" onClick={() => onAgregarFoto(registro, tipo)}
            aria-label={`Agregar ${tipo.toLowerCase()}`} sx={{ color: colors.blueAccent[400] }}>
            <AddPhotoAlternate sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>

        {/* Botones editar / eliminar */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
          <Tooltip title="Editar foto" arrow>
            <IconButton
              size="small"
              onClick={() => onEditarFoto(registro, foto)}
              sx={{
                color: colors.blueAccent[400],
                padding: "2px",
                "&:hover": {
                  backgroundColor: colors.blueAccent[400] + "20",
                },
              }}
            >
              <Edit sx={{ fontSize: 13 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar foto" arrow>
            <IconButton
              size="small"
              onClick={() => onEliminarFoto(registro, foto)}
              sx={{
                color: colors.redAccent[400],
                padding: "2px",
                "&:hover": {
                  backgroundColor: colors.redAccent[400] + "20",
                },
              }}
            >
              <Delete sx={{ fontSize: 13 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    );
  };

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------

  if (registros.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          backgroundColor: colors.primary[900],
          borderRadius: "8px",
          border: `1px solid ${COLOR_BORDE}`,
        }}
      >
        <AssignmentOutlined
          sx={{ fontSize: 48, color: colors.grey[600], mb: 2 }}
        />
        <Typography variant="h6" sx={{ color: COLOR_TEXTO, mb: 1 }}>
          No hay gestiones para mostrar
        </Typography>
        <Typography variant="body2" sx={{ color: colors.grey[400] }}>
          Prueba cambiando el filtro o la búsqueda.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: colors.bgContainer,
        border: `1px solid ${COLOR_BORDE}`,
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                color: COLOR_TEXTO,
                fontWeight: 600,
                borderBottom: `1px solid ${COLOR_BORDE}`,
              }}
            >
              Cuenta
            </TableCell>
            <TableCell
              sx={{
                color: COLOR_TEXTO,
                fontWeight: 600,
                borderBottom: `1px solid ${COLOR_BORDE}`,
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                }}
              >
                <HouseIcon sx={{ fontSize: 16 }} />
                Fachada
              </Box>
            </TableCell>
            <TableCell
              sx={{
                color: COLOR_TEXTO,
                fontWeight: 600,
                borderBottom: `1px solid ${COLOR_BORDE}`,
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                }}
              >
                <DescriptionIcon sx={{ fontSize: 16 }} />
                Evidencia
              </Box>
            </TableCell>
            <TableCell
              sx={{
                color: COLOR_TEXTO,
                fontWeight: 600,
                borderBottom: `1px solid ${COLOR_BORDE}`,
              }}
            >
              Gestor
            </TableCell>
            <TableCell
              sx={{
                color: COLOR_TEXTO,
                fontWeight: 600,
                borderBottom: `1px solid ${COLOR_BORDE}`,
                textAlign: "center",
              }}
            >
              Fecha gestión
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {registros.map((registro, idx) => (
            <TableRow
              key={registro.id ?? idx}
              sx={{
                "&:hover": {
                  backgroundColor: colors.bgContainerSecondary,
                },
                transition: "background-color 0.2s ease",
                "&:last-child td": {
                  borderBottom: 0,
                },
              }}
            >
              {/* Cuenta + Propietario */}
              <TableCell
                sx={{
                  borderBottom: `1px solid ${colors.primary[700]}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: COLOR_TEXTO }}
                >
                  {registro.cuenta}
                </Typography>
                {parseFotos(registro.fotos).length > 0 && (
                  <Button size="small" sx={{ display: "block", textTransform: "none" }}
                    onClick={() => onEditarFoto(registro, parseFotos(registro.fotos)[0])}>
                    Administrar {parseFotos(registro.fotos).length} fotos
                  </Button>
                )}
                {registro.propietario && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.grey[500],
                      fontSize: "0.7rem",
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 200,
                    }}
                  >
                    {registro.propietario}
                  </Typography>
                )}
              </TableCell>

              {/* Foto fachada */}
              <TableCell
                sx={{
                  borderBottom: `1px solid ${colors.primary[700]}`,
                  textAlign: "center",
                }}
              >
                {renderCeldaFoto(registro, "FACHADA")}
              </TableCell>

              {/* Foto evidencia */}
              <TableCell
                sx={{
                  borderBottom: `1px solid ${colors.primary[700]}`,
                  textAlign: "center",
                }}
              >
                {renderCeldaFoto(registro, "EVIDENCIA")}
              </TableCell>

              {/* Gestor */}
              <TableCell
                sx={{
                  borderBottom: `1px solid ${colors.primary[700]}`,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.grey[300],
                    fontSize: "0.8rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: 180,
                  }}
                >
                  {registro.gestor || "Sin gestor"}
                </Typography>
              </TableCell>

              {/* Fecha gestión */}
              <TableCell
                sx={{
                  borderBottom: `1px solid ${colors.primary[700]}`,
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: colors.grey[400],
                    fontSize: "0.75rem",
                  }}
                >
                  {registro.fecha_de_gestion
                    ? new Date(registro.fecha_de_gestion).toLocaleDateString(
                        "es-MX",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        }
                      )
                    : "—"}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TablaGestiones;
