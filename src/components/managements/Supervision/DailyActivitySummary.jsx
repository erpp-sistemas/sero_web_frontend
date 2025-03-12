import React, { useState } from "react";
import {
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  useTheme,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { tokens } from "../../../theme";

const DailyActivitySummary = ({ data }) => {
  console.log(data);
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos para mostrar</p>
    );
  }

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openRows, setOpenRows] = useState({});
  const [filters, setFilters] = useState({}); // Almacena los filtros por gestor

  const toggleRow = (id) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setGestorFilter = (gestor, key, value) => {
    setFilters((prev) => ({
      ...prev,
      [gestor]: { key, value },
    }));
  };

  const clearGestorFilter = (gestor) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[gestor]; // Elimina el filtro para ese gestor
      return newFilters;
    });
  };

  const gestorSummaries = data.reduce((acc, item) => {
    const gestor = item.gestor_visitado_nombre; // Usamos el nombre del gestor
    if (!acc[gestor]) {
      acc[gestor] = {
        gestor,
        total: 0,
        acreditacionSi: 0,
        acreditacionNo: 0,
        chalecoSi: 0,
        chalecoNo: 0,
        vestimentaSi: 0,
        vestimentaNo: 0,
        details: [],
      };
    }
    acc[gestor].total++;
    if (item.trae_acreditacion === "Si") acc[gestor].acreditacionSi++;
    if (item.trae_acreditacion === "No") acc[gestor].acreditacionNo++;
    if (item.trae_chaleco === "Si") acc[gestor].chalecoSi++;
    if (item.trae_chaleco === "No") acc[gestor].chalecoNo++;
    if (item.vestimenta_semiformal === "Si") acc[gestor].vestimentaSi++;
    if (item.vestimenta_semiformal === "No") acc[gestor].vestimentaNo++;
    acc[gestor].details.push(item);
    return acc;
  }, {});

  const filterDetails = (gestor, details) => {
    const gestorFilter = filters[gestor];
    if (!gestorFilter) return details;
    return details.filter(
      (detail) => detail[gestorFilter.key] === gestorFilter.value
    );
  };

  return (
    <div className="w-full text-white">
      <div>
        <Typography
          variant="h6"
          sx={{
            color: colors.accentGreen[100],
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Estadisticas por Gestor Visitado
        </Typography>
      </div>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "8px",
          boxShadow: 3,
          padding: 0,
          background: "rgba(128, 128, 128, 0.1)",
          maxHeight: 500,
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: colors.accentGreen[100],
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
              }}
            >
              <TableCell
                sx={{
                  color: colors.contentSearchButton[100],
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
              <TableCell
                sx={{
                  color: colors.contentSearchButton[100],
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Gestor Visitado
              </TableCell>
              <TableCell
                sx={{
                  color: colors.contentSearchButton[100],
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Total Supervisiones
              </TableCell>
              <TableCell
                sx={{
                  color: colors.contentSearchButton[100],
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Acreditaciones
              </TableCell>
              <TableCell
                sx={{
                  color: colors.contentSearchButton[100],
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Chaleco
              </TableCell>
              <TableCell
                sx={{
                  color: colors.contentSearchButton[100],
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Vestimenta
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(gestorSummaries).map((gestor) => (
              <React.Fragment key={gestor.gestor}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleRow(gestor.gestor)}
                      sx={{ color: colors.accentGreen[100] }}
                    >
                      {openRows[gestor.gestor] ? (
                        <KeyboardArrowUp sx={{ fontWeight: "bold" }} />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="h5"
                      sx={{
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      {gestor.gestor}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => clearGestorFilter(gestor.gestor)}
                      sx={{
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      {gestor.total}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        setGestorFilter(
                          gestor.gestor,
                          "trae_acreditacion",
                          "Si"
                        )
                      }
                      sx={{
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      {gestor.acreditacionSi}
                    </IconButton>
                    <small style={{ color: colors.accentGreen[100] }}>
                      (SI)
                    </small>
                    /{" "}
                    <IconButton
                      onClick={() =>
                        setGestorFilter(
                          gestor.gestor,
                          "trae_acreditacion",
                          "No"
                        )
                      }
                      sx={{
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      {gestor.acreditacionNo}
                    </IconButton>
                    <small style={{ color: colors.accentGreen[100] }}>
                      (NO)
                    </small>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        setGestorFilter(gestor.gestor, "trae_chaleco", "Si")
                      }
                      sx={{
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      {gestor.chalecoSi}
                    </IconButton>
                    <small style={{ color: colors.accentGreen[100] }}>
                      (SI)
                    </small>
                    /{" "}
                    <IconButton
                      onClick={() =>
                        setGestorFilter(gestor.gestor, "trae_chaleco", "No")
                      }
                      sx={{
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      {gestor.chalecoNo}
                    </IconButton>
                    <small style={{ color: colors.accentGreen[100] }}>
                      (NO)
                    </small>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        setGestorFilter(
                          gestor.gestor,
                          "vestimenta_semiformal",
                          "Si"
                        )
                      }
                      sx={{
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      {gestor.vestimentaSi}
                    </IconButton>
                    <small style={{ color: colors.accentGreen[100] }}>
                      (SI)
                    </small>
                    /{" "}
                    <IconButton
                      onClick={() =>
                        setGestorFilter(
                          gestor.gestor,
                          "vestimenta_semiformal",
                          "No"
                        )
                      }
                      sx={{
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      {gestor.vestimentaNo}
                    </IconButton>
                    <small style={{ color: colors.accentGreen[100] }}>
                      (NO)
                    </small>
                  </TableCell>
                </TableRow>
                {openRows[gestor.gestor] && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Collapse
                        in={openRows[gestor.gestor]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Supervisor</TableCell>{" "}
                              {/* Columna agregada */}
                              <TableCell>Fecha Captura</TableCell>
                              <TableCell>Acreditación</TableCell>
                              <TableCell>Chaleco</TableCell>
                              <TableCell>Vestimenta</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filterDetails(gestor.gestor, gestor.details).map(
                              (detail) => (
                                <TableRow key={detail.id}>
                                  <TableCell>{detail.usuario}</TableCell>{" "}
                                  {/* Mostrar el usuario */}
                                  <TableCell>
                                    {new Date(
                                      detail.fecha_captura
                                    ).toLocaleString()}
                                  </TableCell>
                                  <TableCell>
                                    {detail.trae_acreditacion}
                                  </TableCell>
                                  <TableCell>{detail.trae_chaleco}</TableCell>
                                  <TableCell>
                                    {detail.vestimenta_semiformal}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DailyActivitySummary;
