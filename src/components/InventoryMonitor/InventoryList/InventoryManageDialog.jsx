// src/components/Inventory/InventoryManageDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  Avatar,
  Paper,
  useTheme,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
} from "@mui/material";
import {
  Close,
  Person,
  Inventory,
  CheckCircle,
  Warning,
  Error,
  ArrowBack,
  PhotoCamera,
  Description,
  SwapHoriz,
  Delete,
  Home,
  Search,
  LocationOn,
} from "@mui/icons-material";
import { tokens } from "../../../theme";

// Mock de usuarios (esto vendría de una API real)
const usuariosMock = [
  { 
    id: 1, 
    nombre: "Juan Pérez", 
    area: "Ventas", 
    plaza: "Cuautitlán",
  },
  { 
    id: 2, 
    nombre: "María García", 
    area: "Administración", 
    plaza: "Centro",
  },
  { 
    id: 3, 
    nombre: "Carlos López", 
    area: "Sistemas", 
    plaza: "Cuautitlán",
  },
  { 
    id: 4, 
    nombre: "Ana Martínez", 
    area: "RH", 
    plaza: "Centro",
  },
];

const InventoryManageDialog = ({ 
  open, 
  onClose, 
  articulo, 
  onDevolver, 
  onReasignar,
  onBaja,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // ============================================
  // ESTADOS
  // ============================================
  const [step, setStep] = useState("opciones");
  const [motivo, setMotivo] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [condicion, setCondicion] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================================
  // RESET AL ABRIR
  // ============================================
  useEffect(() => {
    if (open) {
      setStep("opciones");
      setMotivo("");
      setObservaciones("");
      setCondicion("");
      setSelectedUserId(null);
      setSearchTerm("");
      setLoading(false);
    }
  }, [open]);

  // ============================================
  // COLORES
  // ============================================
  const COLOR_TEXTO = colors.grey[100];
  const COLOR_FONDO = colors.bgContainerSecondary;
  const COLOR_BORDE = colors.primary[500];
  const COLOR_DISPONIBLE = colors.accentGreen[100];
  const COLOR_ASIGNADO = colors.blueAccent[400];
  const COLOR_MANTENIMIENTO = colors.yellowAccent[400];
  const COLOR_BAJA = colors.redAccent[400];

  if (!articulo) return null;

  // ============================================
  // FUNCIONES AUXILIARES
  // ============================================
  const isAssigned = articulo.id_usuario && articulo.activo !== false;
  const isAvailable = articulo.activo !== false && !articulo.id_usuario;
  const isDisposed = articulo.activo === false;

  // Filtrar usuarios
  const usuariosFiltrados = usuariosMock.filter(u =>
    u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.plaza.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBack = () => {
    setStep("opciones");
    setMotivo("");
    setObservaciones("");
    setCondicion("");
    setSelectedUserId(null);
    setSearchTerm("");
  };

  const handleDevolver = () => {
    if (!condicion) return;
    setLoading(true);
    setTimeout(() => {
      onDevolver?.(articulo.id_articulo, { condicion, observaciones });
      setLoading(false);
      onClose();
    }, 1000);
  };

  const handleBaja = () => {
    if (!motivo) return;
    setLoading(true);
    setTimeout(() => {
      onBaja?.(articulo.id_articulo, { motivo, observaciones });
      setLoading(false);
      onClose();
    }, 1000);
  };

  const handleReasignar = () => {
    if (!selectedUserId) return;
    setLoading(true);
    setTimeout(() => {
      onReasignar?.(articulo.id_articulo, selectedUserId);
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
          bgcolor: COLOR_FONDO,
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          bgcolor: COLOR_FONDO,
          color: COLOR_TEXTO,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 3,
          borderBottom: `1px solid ${COLOR_BORDE}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {step !== "opciones" && (
            <IconButton onClick={handleBack} sx={{ color: colors.grey[400], p: 0 }}>
              <ArrowBack />
            </IconButton>
          )}
          <Avatar sx={{ bgcolor: colors.primary[500], width: 40, height: 40 }}>
            <Inventory />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {step === "opciones" && "Gestionar artículo"}
              {step === "devolver" && "Devolver artículo"}
              {step === "baja" && "Dar de baja"}
              {step === "reasignar" && (isAssigned ? "Reasignar artículo" : "Asignar artículo")}
            </Typography>
            <Typography variant="body2" sx={{ color: colors.grey[400] }}>
              {articulo.nombre_articulo} • {articulo.folio}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: colors.grey[400] }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: COLOR_FONDO }}>
        {/* OPCIONES PRINCIPALES */}
        {step === "opciones" && (
          <>
            {/* Información del artículo */}
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mb: 3,
                borderRadius: "8px",
                bgcolor: colors.bgContainer,
                border: `1px solid ${COLOR_BORDE}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: colors.primary[600], width: 48, height: 48 }}>
                  <Inventory />
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: COLOR_TEXTO }}>
                    {articulo.nombre_articulo}
                  </Typography>
                  <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                    {articulo.categoria} • {articulo.subcategoria}
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 1.5, borderColor: COLOR_BORDE }} />
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                  Estado actual:
                </Typography>
                <Chip
                  label={isDisposed ? "Dado de baja" : isAssigned ? "Asignado" : "Disponible"}
                  size="small"
                  sx={{
                    bgcolor: isDisposed ? COLOR_BAJA + "20" : 
                             isAssigned ? COLOR_ASIGNADO + "20" : 
                             COLOR_DISPONIBLE + "20",
                    color: isDisposed ? COLOR_BAJA : 
                           isAssigned ? COLOR_ASIGNADO : 
                           COLOR_DISPONIBLE,
                  }}
                />
              </Box>
              {articulo.usuario && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                  <Person sx={{ fontSize: 16, color: colors.grey[500] }} />
                  <Typography variant="body2" sx={{ color: colors.grey[300] }}>
                    {articulo.usuario}
                  </Typography>
                </Box>
              )}
            </Paper>

            <Typography variant="subtitle2" sx={{ color: colors.grey[300], mb: 2 }}>
              ¿Qué deseas hacer?
            </Typography>

            {/* Opciones según estado */}
            {!isDisposed && (
              <>
                {/* Para artículos asignados: Devolver y Reasignar */}
                {isAssigned && (
                  <>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: "8px",
                        bgcolor: colors.bgContainer,
                        border: `1px solid ${COLOR_BORDE}`,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: COLOR_DISPONIBLE,
                          bgcolor: colors.bgContainerSecondary,
                        },
                      }}
                      onClick={() => setStep("devolver")}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: COLOR_DISPONIBLE + "20", width: 40, height: 40 }}>
                          <Home sx={{ color: COLOR_DISPONIBLE }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: COLOR_TEXTO }}>
                            Devolver a disponible
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                            El artículo queda disponible para futuras asignaciones
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>

                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: "8px",
                        bgcolor: colors.bgContainer,
                        border: `1px solid ${COLOR_BORDE}`,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: COLOR_ASIGNADO,
                          bgcolor: colors.bgContainerSecondary,
                        },
                      }}
                      onClick={() => setStep("reasignar")}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: COLOR_ASIGNADO + "20", width: 40, height: 40 }}>
                          <SwapHoriz sx={{ color: COLOR_ASIGNADO }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600, color: COLOR_TEXTO }}>
                            Reasignar a otro usuario
                          </Typography>
                          <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                            Cambiar la persona asignada
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </>
                )}

                {/* Para artículos disponibles: Asignar */}
                {isAvailable && (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: "8px",
                      bgcolor: colors.bgContainer,
                      border: `1px solid ${COLOR_BORDE}`,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: COLOR_ASIGNADO,
                        bgcolor: colors.bgContainerSecondary,
                      },
                    }}
                    onClick={() => setStep("reasignar")}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: COLOR_ASIGNADO + "20", width: 40, height: 40 }}>
                        <Person sx={{ color: COLOR_ASIGNADO }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: COLOR_TEXTO }}>
                          Asignar a usuario
                        </Typography>
                        <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                          El artículo será asignado a una persona
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                )}

                {/* Dar de baja (siempre disponible para artículos activos) */}
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: "8px",
                    bgcolor: colors.bgContainer,
                    border: `1px solid ${COLOR_BORDE}`,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderColor: COLOR_BAJA,
                      bgcolor: colors.bgContainerSecondary,
                    },
                  }}
                  onClick={() => setStep("baja")}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ bgcolor: COLOR_BAJA + "20", width: 40, height: 40 }}>
                      <Delete sx={{ color: COLOR_BAJA }} />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: COLOR_TEXTO }}>
                        Dar de baja
                      </Typography>
                      <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                        Marcar como inservible, obsoleto o perdido
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </>
            )}

            {/* Mensaje para artículos dados de baja */}
            {isDisposed && (
              <Alert severity="error" sx={{ bgcolor: COLOR_BAJA + "20" }}>
                Este artículo está dado de baja y no se pueden realizar acciones.
              </Alert>
            )}
          </>
        )}

        {/* SECCIÓN: REASIGNAR/ASIGNAR */}
        {step === "reasignar" && (
          <>
            {/* Alertas según disponibilidad */}
            {isAssigned && (
              <Alert severity="warning" sx={{ mb: 3, bgcolor: colors.yellowAccent[400] + "20" }}>
                Este artículo ya está asignado a {articulo.usuario}. 
                {isAssigned ? " Para reasignarlo, primero debe ser devuelto." : ""}
              </Alert>
            )}

            {isDisposed && (
              <Alert severity="error" sx={{ mb: 3, bgcolor: colors.redAccent[400] + "20" }}>
                Este artículo está dado de baja y no puede ser asignado.
              </Alert>
            )}

            {/* Información del artículo */}
            <Paper sx={{ p: 2, bgcolor: colors.primary[900], borderRadius: "8px", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Inventory sx={{ color: colors.grey[400] }} />
                <Box>
                  <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                    Estado actual
                  </Typography>
                  <Chip
                    label={isDisposed ? "Dado de baja" : isAssigned ? "Asignado" : "Disponible"}
                    size="small"
                    sx={{
                      bgcolor: isDisposed ? COLOR_BAJA + "20" : 
                               isAssigned ? COLOR_ASIGNADO + "20" : 
                               COLOR_DISPONIBLE + "20",
                      color: isDisposed ? COLOR_BAJA : 
                             isAssigned ? COLOR_ASIGNADO : 
                             COLOR_DISPONIBLE,
                      mt: 0.5,
                    }}
                  />
                </Box>
              </Box>
            </Paper>

            {/* Búsqueda de usuarios */}
            <Typography variant="subtitle2" sx={{ color: colors.grey[300], mb: 1, fontWeight: 500 }}>
              Buscar usuario
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Nombre, área o plaza..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={!isAvailable} // Solo disponible si el artículo está disponible
              InputProps={{
                startAdornment: <Search sx={{ fontSize: 18, color: colors.grey[400], mr: 1 }} />,
              }}
              sx={{ mb: 2 }}
            />

            {/* Lista de usuarios - con el mismo estilo de AssignmentDialog */}
            <Box sx={{ maxHeight: 250, overflowY: "auto", pr: 1 }}>
              {usuariosFiltrados.length === 0 ? (
                <Typography variant="body2" sx={{ color: colors.grey[500], textAlign: "center", py: 2 }}>
                  No se encontraron usuarios
                </Typography>
              ) : (
                usuariosFiltrados.map((usuario) => (
                  <Paper
                    key={usuario.id}
                    sx={{
                      p: 1.5,
                      mb: 1,
                      bgcolor: colors.primary[900],
                      borderRadius: "8px",
                      border: `1px solid ${selectedUserId === usuario.id ? COLOR_ASIGNADO : "transparent"}`,
                      cursor: isAvailable ? "pointer" : "not-allowed",
                      opacity: isAvailable ? 1 : 0.5,
                      transition: "all 0.2s ease",
                      "&:hover": isAvailable ? {
                        borderColor: COLOR_ASIGNADO,
                        bgcolor: colors.primary[800],
                      } : {},
                    }}
                    onClick={() => isAvailable && setSelectedUserId(usuario.id)}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: colors.primary[600] }}>
                        {usuario.nombre.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: COLOR_TEXTO }}>
                          {usuario.nombre}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <LocationOn sx={{ fontSize: 14, color: colors.grey[500] }} />
                          <Typography variant="caption" sx={{ color: colors.grey[400] }}>
                            {usuario.area} • {usuario.plaza}
                          </Typography>
                        </Box>
                      </Box>
                      {selectedUserId === usuario.id && (
                        <CheckCircle sx={{ color: COLOR_ASIGNADO, fontSize: 20 }} />
                      )}
                    </Box>
                  </Paper>
                ))
              )}
            </Box>
          </>
        )}

        {/* SECCIÓN: DEVOLVER (igual) */}
        {step === "devolver" && (
          <>
            <Alert severity="info" sx={{ mb: 3, bgcolor: colors.blueAccent[400] + "20" }}>
              El artículo será devuelto y quedará disponible para futuras asignaciones.
            </Alert>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel sx={{ color: colors.grey[400] }}>Condición actual *</InputLabel>
              <Select
                value={condicion}
                label="Condición actual *"
                onChange={(e) => setCondicion(e.target.value)}
                sx={{ borderRadius: "8px" }}
              >
                <MenuItem value="excelente">Excelente</MenuItem>
                <MenuItem value="bueno">Bueno</MenuItem>
                <MenuItem value="regular">Regular</MenuItem>
                <MenuItem value="malo">Malo</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              label="Observaciones"
              placeholder="Comentarios sobre el estado del artículo..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Paper
              sx={{
                p: 2,
                border: `1px dashed ${COLOR_BORDE}`,
                borderRadius: "8px",
                textAlign: "center",
                bgcolor: colors.primary[900],
                cursor: "pointer",
                "&:hover": { bgcolor: colors.primary[800] },
              }}
            >
              <PhotoCamera sx={{ fontSize: 32, color: colors.grey[500], mb: 1 }} />
              <Typography variant="caption" sx={{ color: colors.grey[400], display: "block" }}>
                Hacer clic para agregar foto de evidencia
              </Typography>
              <Typography variant="caption" sx={{ color: colors.grey[500], fontSize: "0.6rem" }}>
                (opcional)
              </Typography>
            </Paper>
          </>
        )}

        {/* SECCIÓN: BAJA (igual) */}
        {step === "baja" && (
          <>
            <Alert severity="warning" sx={{ mb: 3, bgcolor: colors.yellowAccent[400] + "20" }}>
              Esta acción es irreversible. El artículo no podrá ser asignado nuevamente.
            </Alert>

            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel sx={{ color: colors.grey[400] }}>Motivo de baja *</InputLabel>
              <Select
                value={motivo}
                label="Motivo de baja *"
                onChange={(e) => setMotivo(e.target.value)}
                sx={{ borderRadius: "8px" }}
              >
                <MenuItem value="obsolescencia">Obsolescencia</MenuItem>
                <MenuItem value="daño_irreparable">Daño irreparable</MenuItem>
                <MenuItem value="extravío">Extravío / Robo</MenuItem>
                <MenuItem value="venta">Venta / Donación</MenuItem>
                <MenuItem value="otro">Otro</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              label="Observaciones"
              placeholder="Detalles adicionales..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              sx={{ mb: 2 }}
            />

            <Paper
              sx={{
                p: 2,
                border: `1px dashed ${COLOR_BORDE}`,
                borderRadius: "8px",
                textAlign: "center",
                bgcolor: colors.primary[900],
                cursor: "pointer",
                "&:hover": { bgcolor: colors.primary[800] },
              }}
            >
              <PhotoCamera sx={{ fontSize: 32, color: colors.grey[500], mb: 1 }} />
              <Typography variant="caption" sx={{ color: colors.grey[400], display: "block" }}>
                Hacer clic para agregar foto de evidencia
              </Typography>
              <Typography variant="caption" sx={{ color: colors.grey[500], fontSize: "0.6rem" }}>
                (opcional)
              </Typography>
            </Paper>
          </>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          bgcolor: COLOR_FONDO,
          p: 2,
          borderTop: `1px solid ${COLOR_BORDE}`,
          justifyContent: "space-between",
        }}
      >
        <Button onClick={onClose} sx={{ color: colors.grey[400] }}>
          Cancelar
        </Button>
        
        {step === "devolver" && (
          <Button
            variant="text"
            onClick={handleDevolver}
            disabled={!condicion || loading}
            sx={{
              color: COLOR_DISPONIBLE,
              "&:hover": { bgcolor: COLOR_DISPONIBLE + "20" },
            }}
          >
            {loading ? "Procesando..." : "Confirmar devolución"}
          </Button>
        )}
        
        {step === "baja" && (
          <Button
            variant="text"
            onClick={handleBaja}
            disabled={!motivo || loading}
            sx={{
              color: COLOR_BAJA,
              "&:hover": { bgcolor: COLOR_BAJA + "20" },
            }}
          >
            {loading ? "Procesando..." : "Confirmar baja"}
          </Button>
        )}
        
        {step === "reasignar" && (
          <Button
            variant="text"
            onClick={handleReasignar}
            disabled={!selectedUserId || !isAvailable || loading}
            sx={{
              color: COLOR_ASIGNADO,
              "&:hover": { bgcolor: COLOR_ASIGNADO + "20" },
            }}
          >
            {loading ? "Procesando..." : isAssigned ? "Reasignar" : "Asignar"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default InventoryManageDialog;