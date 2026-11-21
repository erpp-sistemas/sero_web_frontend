// src/components/PaymentValidation/Shared/MiniGaleria.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Card,
  CardMedia,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
} from "@mui/material";
import {
  AddPhotoAlternate,
  MoreVert,
  Edit,
  Delete,
  House as HouseIcon,
  Description as DescriptionIcon,
  Photo as PhotoIcon,
  Verified,
} from "@mui/icons-material";
import { tokens } from "../../../../theme";

/**
 * MiniGaleria
 * ------------------------------------------------------------------
 * Galería inline de miniaturas de fotos con:
 *  - Contadores por tipo (fachada / evidencia)
 *  - Botón "Agregar"
 *  - Acciones por foto (editar / eliminar) vía menú contextual
 *  - Click en la foto → onImageClick(index)
 *
 * Props:
 *  - fotos               (arr)     Array de fotos. Cada foto debe tener:
 *                                  { id, urlImagen | url, tipo, fechaCaptura,
 *                                    nombreFoto, verificada }
 *  - cuenta              (str)     Cuenta del registro (para contexto visual)
 *  - onImageClick        (fn)      Click en una miniatura. Recibe el índice
 *                                  local dentro del array original.
 *  - onEditFoto          (fn)      Click en "Editar" del menú
 *  - onDeleteFoto        (fn)      Click en "Eliminar" del menú
 *  - onAgregarFoto       (fn)      Click en botón "Agregar"
 *  - startingIndex       (num)     Offset para el onImageClick (default 0)
 *  - COLOR_EFICIENTE     (str)     Color para estados positivos
 *  - COLOR_REGULAR       (str)     Color para estados regulares
 */
const MiniGaleria = ({
  fotos = [],
  cuenta,
  onImageClick,
  onEditFoto,
  onDeleteFoto,
  onAgregarFoto,
  startingIndex = 0,
  COLOR_EFICIENTE,
  COLOR_REGULAR,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFoto, setSelectedFoto] = useState(null);

  // ----------------------------------------------------------------
  // Normalización de tipo (robusta: soporta "FACHADA", "Fachada predio", etc.)
  // ----------------------------------------------------------------
  const esFachada = (tipo) => {
    const t = (tipo || "").toUpperCase();
    return t.includes("FACHADA") || t.includes("PREDIO");
  };

  const fotosFachada = fotos.filter((f) => esFachada(f.tipo));
  const fotosEvidencia = fotos.filter((f) => !esFachada(f.tipo));
  const todasLasFotos = [...fotosFachada, ...fotosEvidencia];
  const tieneFotos = todasLasFotos.length > 0;

  const fotosParaMostrar = todasLasFotos.slice(0, 4);
  const fotosRestantes = todasLasFotos.length - 4;

  // ----------------------------------------------------------------
  // Handlers
  // ----------------------------------------------------------------
  const handleMenuOpen = (event, foto) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedFoto(foto);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFoto(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    if (selectedFoto) onEditFoto(selectedFoto);
  };

  const handleDelete = () => {
    handleMenuClose();
    if (selectedFoto) onDeleteFoto(selectedFoto);
  };

  // ----------------------------------------------------------------
  // Chip contador
  // ----------------------------------------------------------------
  const ChipContadorFoto = ({ cantidad, icono, tooltipTitle }) => {
    const tiene = cantidad > 0;
    return (
      <Tooltip title={tooltipTitle} arrow>
        <Chip
          label={cantidad}
          size="small"
          icon={icono}
          sx={{
            backgroundColor: tiene
              ? COLOR_EFICIENTE + "20"
              : COLOR_REGULAR + "20",
            color: tiene ? COLOR_EFICIENTE : COLOR_REGULAR,
            fontSize: "0.7rem",
            minWidth: 40,
            height: 22,
            "& .MuiChip-icon": {
              fontSize: "0.8rem",
              marginLeft: "4px",
              marginRight: "2px",
            },
            "& .MuiChip-label": {
              px: 0.5,
            },
          }}
        />
      </Tooltip>
    );
  };

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------
  return (
    <Box>
      {/* Contadores */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          mb: 2,
          justifyContent: "center",
        }}
      >
        <ChipContadorFoto
          cantidad={fotosFachada.length}
          icono={<HouseIcon sx={{ fontSize: 12 }} />}
          tooltipTitle={`${fotosFachada.length} fachada${
            fotosFachada.length !== 1 ? "s" : ""
          }`}
        />
        <ChipContadorFoto
          cantidad={fotosEvidencia.length}
          icono={<DescriptionIcon sx={{ fontSize: 12 }} />}
          tooltipTitle={`${fotosEvidencia.length} evidencia${
            fotosEvidencia.length !== 1 ? "s" : ""
          }`}
        />
      </Box>

      {/* Galería + Botón agregar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          p: 1,
          backgroundColor: colors.bgContainerSecondary,
          borderRadius: "12px",
          overflow: "auto",
          "&::-webkit-scrollbar": { height: 4 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: colors.primary[600],
            borderRadius: 2,
          },
        }}
      >
        {/* Botón agregar */}
        <Tooltip title="Agregar foto" arrow>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              cursor: "pointer",
              backgroundColor: "transparent",
              border: `1px dashed ${colors.primary[500]}`,
              transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
              flexShrink: 0,
              "&:hover": {
                borderColor: colors.blueAccent[400],
                backgroundColor: colors.blueAccent[400] + "08",
                transform: "translateY(-1px)",
              },
            }}
            onClick={() => onAgregarFoto()}
          >
            <AddPhotoAlternate
              sx={{
                color: colors.grey[500],
                fontSize: 20,
                transition: "color 0.2s ease",
                ".MuiBox-root:hover &": {
                  color: colors.blueAccent[400],
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: colors.grey[500],
                fontSize: "0.65rem",
                fontWeight: 400,
                letterSpacing: "0.01em",
                transition: "color 0.2s ease",
                ".MuiBox-root:hover &": {
                  color: colors.blueAccent[400],
                },
              }}
            >
              Agregar
            </Typography>
          </Box>
        </Tooltip>

        {/* Fotos o vacío */}
        {!tieneFotos ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 2,
              color: colors.grey[500],
            }}
          >
            <Typography
              variant="caption"
              sx={{ fontSize: "0.7rem", letterSpacing: "0.01em" }}
            >
              Sin fotos registradas
            </Typography>
          </Box>
        ) : (
          <>
            {fotosParaMostrar.map((foto, index) => {
              const imagenUrl = foto.urlImagen || foto.url;
              const esFachadaFoto = esFachada(foto.tipo);

              return (
                <Box key={foto.id} sx={{ position: "relative", flexShrink: 0 }}>
                  <Tooltip
                    title={
                      <Box>
                        <Typography variant="caption" display="block">
                          {esFachadaFoto ? "Fachada predio" : "Evidencia"}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ fontSize: "0.65rem", color: colors.grey[100] }}
                        >
                          {new Date(foto.fechaCaptura).toLocaleString("es-MX", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          })}
                        </Typography>
                      </Box>
                    }
                    arrow
                  >
                    <Card
                      sx={{
                        position: "relative",
                        borderRadius: "8px",
                        overflow: "hidden",
                        cursor: "pointer",
                        width: 72,
                        height: 72,
                        border: `1px solid ${
                          esFachadaFoto
                            ? colors.greenAccent[700]
                            : colors.blueAccent[700]
                        }`,
                        transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          "& .foto-actions": {
                            opacity: 1,
                          },
                        },
                      }}
                      onClick={() => onImageClick(startingIndex + index)}
                    >
                      <CardMedia
                        component="img"
                        height="72"
                        image={imagenUrl}
                        alt={foto.nombreFoto || `Foto ${index + 1}`}
                        sx={{
                          objectFit: "cover",
                          width: "100%",
                          backgroundColor: colors.primary[900],
                        }}
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/72/${
                            esFachadaFoto ? "1b5e20" : "0d47a1"
                          }/ffffff?text=${esFachadaFoto ? "F" : "E"}`;
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                        }}
                      >
                        {foto.verificada && (
                          <Tooltip title="Verificada" arrow>
                            <Verified
                              sx={{
                                fontSize: 12,
                                color: colors.greenAccent[500],
                                filter:
                                  "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                              }}
                            />
                          </Tooltip>
                        )}
                      </Box>
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 4,
                          left: 4,
                          backgroundColor: "rgba(0,0,0,0.5)",
                          borderRadius: "4px",
                          width: 18,
                          height: 18,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backdropFilter: "blur(2px)",
                        }}
                      >
                        {esFachadaFoto ? (
                          <HouseIcon
                            sx={{
                              fontSize: 10,
                              color: colors.greenAccent[300],
                            }}
                          />
                        ) : (
                          <DescriptionIcon
                            sx={{ fontSize: 10, color: colors.blueAccent[300] }}
                          />
                        )}
                      </Box>

                      {/* Botón de acciones */}
                      <Box
                        className="foto-actions"
                        sx={{
                          position: "absolute",
                          top: 4,
                          right: 4,
                          opacity: 0,
                          transition: "opacity 0.2s ease",
                          zIndex: 10,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, foto)}
                          sx={{
                            color: "white",
                            backgroundColor: "rgba(0,0,0,0.5)",
                            padding: "2px",
                            width: 20,
                            height: 20,
                            "&:hover": {
                              backgroundColor: "rgba(0,0,0,0.7)",
                            },
                            "& .MuiSvgIcon-root": {
                              fontSize: 12,
                            },
                          }}
                        >
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </Card>
                  </Tooltip>
                </Box>
              );
            })}

            {fotosRestantes > 0 && (
              <Tooltip title={`${fotosRestantes} fotos más`} arrow>
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    backgroundColor: colors.primary[800],
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${colors.primary[600]}`,
                    cursor: "pointer",
                    flexDirection: "column",
                    gap: 0.5,
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: colors.primary[700],
                      transform: "scale(1.02)",
                    },
                  }}
                  onClick={() => onImageClick(startingIndex + 4)}
                >
                  <PhotoIcon sx={{ fontSize: 18, color: colors.grey[400] }} />
                  <Typography
                    variant="caption"
                    sx={{
                      color: colors.grey[400],
                      fontWeight: 500,
                      fontSize: "0.7rem",
                    }}
                  >
                    +{fotosRestantes}
                  </Typography>
                </Box>
              </Tooltip>
            )}
          </>
        )}
      </Box>

      {/* Menú contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: colors.bgContainer,
            border: `1px solid ${colors.primary[700]}`,
            borderRadius: "10px",
            minWidth: 150,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          },
        }}
      >
        <MenuItem
          onClick={handleEdit}
          sx={{
            color: colors.grey[300],
            fontSize: "0.8rem",
            py: 0.75,
            "&:hover": {
              backgroundColor: colors.primary[700] + "40",
            },
          }}
        >
          <ListItemIcon>
            <Edit sx={{ color: colors.blueAccent[400], fontSize: 16 }} />
          </ListItemIcon>
          <ListItemText
            sx={{ "& .MuiTypography-root": { fontSize: "0.8rem" } }}
          >
            Editar
          </ListItemText>
        </MenuItem>
        <Divider sx={{ backgroundColor: colors.primary[700], my: 0.5 }} />
        <MenuItem
          onClick={handleDelete}
          sx={{
            color: colors.grey[300],
            fontSize: "0.8rem",
            py: 0.75,
            "&:hover": {
              backgroundColor: colors.redAccent[800] + "40",
            },
          }}
        >
          <ListItemIcon>
            <Delete sx={{ color: colors.redAccent[400], fontSize: 16 }} />
          </ListItemIcon>
          <ListItemText
            sx={{ "& .MuiTypography-root": { fontSize: "0.8rem" } }}
          >
            Eliminar
          </ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MiniGaleria;
