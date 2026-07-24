import React, { useState, useEffect, useMemo, useCallback } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import { AssignmentIndOutlined, Close, Search } from "@mui/icons-material";

import { DataGrid } from "@mui/x-data-grid";

import buildColumns from "./buildColumns";

import AssignmentOutlined from "@mui/icons-material/AssignmentOutlined";

import DataGridEmptyState from "../../../components/DataGrid/DataGridEmptyState";

import { tokens } from "../../../theme";

function DialogAssignment({
  open,
  onClose,
  manager,
  data = [],
  loading = false,
  processing = false,
  onUnassign,
}) {
  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  const COLOR_TEXTO = colors.grey[100];
  const COLOR_FONDO = colors.bgContainerSecondary;
  const COLOR_BORDE = colors.primary[500];
  const COLOR_DISPONIBLE = colors.accentGreen[100];
  const COLOR_ASIGNADO = colors.blueAccent[400];
  const COLOR_MANTENIMIENTO = colors.yellowAccent[400];
  const COLOR_BAJA = colors.redAccent[400];

  const [search, setSearch] = useState("");

  const [selectedAccounts, setSelectedAccounts] = useState([]);

  const [selectedDate, setSelectedDate] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);

  const resetDialogState = useCallback(() => {
    setSelectedAccounts([]);
    setSelectedDate("");
    setConfirmOpen(false);
  }, []);

  const handleClose = () => {
    resetDialogState();
    onClose();
  };

  useEffect(() => {
    if (!open) {
      resetDialogState();
    }
  }, [open, resetDialogState]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        !search.trim() ||
        item.cuenta.toLowerCase().includes(search.trim().toLowerCase());

      const matchesDate =
        !selectedDate || item.fecha_asignacion.startsWith(selectedDate);

      return matchesSearch && matchesDate;
    });
  }, [data, search, selectedDate]);

  const columns = useMemo(
    () =>
      buildColumns({
        colors,
      }),
    [colors],
  );

  const availableDates = useMemo(() => {
    const uniqueDates = [
      ...new Set(
        data.map(
          (item) => new Date(item.fecha_asignacion).toISOString().split("T")[0],
        ),
      ),
    ];

    return uniqueDates.sort((a, b) => new Date(b) - new Date(a));
  }, [data]);

  const totalAccounts = data.length;

  const resumen = useMemo(() => {
    let recientes = 0;

    let seguimiento = 0;

    let criticas = 0;

    data.forEach((item) => {
      const dias = Number(item.dias_asignado);

      if (dias <= 14) {
        recientes++;
      } else if (dias <= 29) {
        seguimiento++;
      } else {
        criticas++;
      }
    });

    return {
      total: data.length,

      recientes,

      seguimiento,

      criticas,
    };
  }, [data]);

  const NoRowsOverlay = () => (
    <DataGridEmptyState
      icon={<AssignmentOutlined />}
      title="No se encontraron cuentas"
      description="Prueba modificando el texto de búsqueda o la fecha de asignación."
    />
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          maxHeight: "90vh",
          borderRadius: "12px",
          overflow: "hidden",
        },
      }}
    >
      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

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
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box display="flex" gap={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: colors.accentGreen[100] + "20",
                color: colors.accentGreen[100],
              }}
            >
              <AssignmentIndOutlined />
            </Box>

            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 600,
                  color: colors.grey[100],
                }}
              >
                {manager?.gestor ?? "Gestor"}
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  color: colors.grey[400],
                }}
              >
                {totalAccounts.toLocaleString()} cuentas asignadas
              </Typography>
            </Box>
          </Box>

          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      {/* ===================================================== */}
      {/* CONTENT */}
      {/* ===================================================== */}

      <DialogContent
        sx={{
          backgroundColor: COLOR_FONDO,
          p: 3,
          overflow: "auto",
        }}
      >
        {/* Buscador */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "2fr 1fr",
            },
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por número de cuenta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search
                    sx={{
                      color: colors.grey[400],
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,

              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                backgroundColor: colors.bgContainer,

                "& fieldset": {
                  borderColor: colors.borderContainer,
                },

                "&:hover fieldset": {
                  borderColor: colors.accentGreen[100],
                },

                "&.Mui-focused fieldset": {
                  borderColor: colors.accentGreen[200],
                },
              },
            }}
          />

          <FormControl fullWidth size="small">
            <InputLabel>Fecha de asignación</InputLabel>

            <Select
              value={selectedDate}
              label="Fecha de asignación"
              onChange={(event) => setSelectedDate(event.target.value)}
            >
              <MenuItem value="">Todas las fechas</MenuItem>

              {availableDates.map((date) => (
                <MenuItem key={date} value={date}>
                  {new Date(date).toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box className="grid grid-cols-1 gap-3 mb-4">
          <Box
            className="p-4 rounded-xl shadow-sm"
            sx={{
              backgroundColor: colors.bgContainer,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",

              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {/* Información */}
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: colors.grey[400],
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    fontSize: "0.875rem",
                    mb: 1,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 600,
                      color: colors.grey[100],
                    }}
                  >
                    {resumen.total} cuentas activas
                  </Box>
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Verde */}

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: colors.accentGreen[100],
                      }}
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.grey[400],
                        fontSize: "0.75rem",
                      }}
                    >
                      {resumen.recientes} Asignación reciente
                    </Typography>
                  </Box>

                  <Box
                    component="span"
                    sx={{
                      color: colors.grey[500],
                      fontSize: "0.75rem",
                    }}
                  >
                    •
                  </Box>

                  {/* Amarillo */}

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "#EAB308",
                      }}
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.grey[400],
                        fontSize: "0.75rem",
                      }}
                    >
                      {resumen.seguimiento} Dar seguimiento
                    </Typography>
                  </Box>

                  <Box
                    component="span"
                    sx={{
                      color: colors.grey[500],
                      fontSize: "0.75rem",
                    }}
                  >
                    •
                  </Box>

                  {/* Rojo */}

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: colors.redAccent[400],
                      }}
                    />

                    <Typography
                      variant="body2"
                      sx={{
                        color: colors.grey[400],
                        fontSize: "0.75rem",
                      }}
                    >
                      {resumen.criticas} Requiere atención
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Resumen */}

        <Typography
          variant="body2"
          sx={{
            mb: 2,
            color: colors.grey[400],
            fontSize: "0.875rem",
          }}
        >
          {selectedAccounts.length > 0
            ? `${selectedAccounts.length} ${
                selectedAccounts.length === 1
                  ? "cuenta seleccionada"
                  : "cuentas seleccionadas"
              }`
            : "Selecciona cuentas para desasignar."}
        </Typography>

        {/* Área donde irá el DataGrid */}

        <Box
          sx={{
            height: 500,

            "& .MuiDataGrid-root": {
              border: "none",
              backgroundColor: colors.bgContainer,
            },

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.bgContainer,
              borderBottom: `1px solid ${colors.borderContainer}`,
            },

            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },

            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${colors.borderContainer}`,
              display: "flex",
              alignItems: "center",
            },

            "& .MuiDataGrid-row:hover": {
              backgroundColor: colors.primary[400] + "10",
            },

            "& .MuiDataGrid-footerContainer": {
              borderTop: `1px solid ${colors.borderContainer}`,
            },
          }}
        >
          <DataGrid
            rows={filteredData}
            columns={columns}
            slots={{
              noRowsOverlay: NoRowsOverlay,
            }}
            getRowId={(row) => row.cuenta}
            loading={loading}
            checkboxSelection
            disableRowSelectionOnClick
            rowSelectionModel={selectedAccounts}
            onRowSelectionModelChange={(selection) =>
              setSelectedAccounts(selection)
            }
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: {
                  page: 0,
                  pageSize: 10,
                },
              },
            }}
          />
        </Box>
      </DialogContent>

      <Divider />

      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <DialogActions
        sx={{
          backgroundColor: COLOR_FONDO,
          p: 2,
          borderTop: `1px solid ${COLOR_BORDE}`,
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            textTransform: "none",
          }}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          disabled={selectedAccounts.length === 0 || processing}
          onClick={() => setConfirmOpen(true)}
          sx={{
            textTransform: "none",
            borderRadius: "10px",
            fontWeight: 500,
            backgroundColor: colors.accentGreen[100],
            color: colors.textAccent,

            "&:hover": {
              backgroundColor: colors.accentGreen[200],
            },

            "&.Mui-disabled": {
              backgroundColor: colors.grey[300],
              color: colors.grey[500],
            },
          }}
        >
          {processing
            ? "Desasignando..."
            : selectedAccounts.length > 0
              ? `Desasignar ${
                  selectedAccounts.length === 1
                    ? "1 cuenta"
                    : `${selectedAccounts.length} cuentas`
                }`
              : "Desasignar cuentas"}
        </Button>
      </DialogActions>

      <Dialog
        open={confirmOpen}
        onClose={() => !processing && setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: "90vh",
            borderRadius: "12px",
            overflow: "hidden",
          },
        }}
      >
        <DialogContent
          sx={{
            backgroundColor: COLOR_FONDO,
            p: 3,
            overflow: "auto",
          }}
        >
          <Box
            sx={{
              width: 54,
              height: 54,
              margin: "0 auto",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.accentGreen[100] + "15",
              color: colors.accentGreen[100],
              mb: 3,
            }}
          >
            <AssignmentIndOutlined />
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              mb: 2,
            }}
          >
            Desasignar cuentas
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: colors.grey[400],
              mb: 1,
              lineHeight: 1.7,
            }}
          >
            Se desasignarán{" "}
            <Typography
              component="span"
              sx={{
                fontWeight: 600,
                color: colors.grey[100],
              }}
            >
              {selectedAccounts.length}{" "}
              {selectedAccounts.length === 1 ? "cuenta" : "cuentas"}
            </Typography>{" "}
            del gestor{" "}
            <Typography
              component="span"
              sx={{
                fontWeight: 600,
                color: colors.grey[100],
              }}
            >
              {manager?.gestor}
            </Typography>
            .
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: colors.grey[400],
            }}
          >
            Las cuentas quedarán disponibles para una nueva asignación.
          </Typography>
        </DialogContent>

        <DialogActions
          sx={{
            backgroundColor: COLOR_FONDO,
            p: 2,
            borderTop: `1px solid ${COLOR_BORDE}`,
            
          }}
        >
          <Button
            disabled={processing}
            variant="contained"
            color="primary"
            onClick={() => setConfirmOpen(false)}
            sx={{
              textTransform: "none",
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            disabled={processing}
            onClick={() => onUnassign(selectedAccounts)}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              backgroundColor: colors.accentGreen[100],
              color: colors.textAccent,

              "&:hover": {
                backgroundColor: colors.accentGreen[200],
              },
            }}
          >
            {processing ? (
              <>
                <CircularProgress
                  size={16}
                  sx={{
                    mr: 1,
                    color: "inherit",
                  }}
                />
                Desasignando...
              </>
            ) : (
              "Desasignar"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}

export default DialogAssignment;
