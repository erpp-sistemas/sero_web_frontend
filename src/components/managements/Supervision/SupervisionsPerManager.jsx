import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  IconButton,
  Collapse,
  useTheme,
  Badge,
} from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { tokens } from "../../../theme";

const SupervisionsPerManager = ({ data, selectedFields }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos para mostrar</p>
    );
  }
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [openRows, setOpenRows] = useState({});
  const [filters, setFilters] = useState({}); // Almacena los filtros por usuario

  // 🔹 Agrupar datos por usuario
  const userSummaries = data.reduce((acc, item) => {
    if (!acc[item.gestor_visitado_nombre]) {
      acc[item.gestor_visitado_nombre] = {
        gestor_visitado_nombre: item.gestor_visitado_nombre,
        totalSupervisions: 0,
        fieldCounts: {},
        details: [],
      };
    }

    acc[item.gestor_visitado_nombre].totalSupervisions += 1; // 🔹 Contador de supervisiones

    selectedFields.forEach((field) => {
      if (!acc[item.gestor_visitado_nombre].fieldCounts[field]) {
        acc[item.gestor_visitado_nombre].fieldCounts[field] = { yes: 0, no: 0 };
      }

      if (item[field] === "Si") {
        acc[item.gestor_visitado_nombre].fieldCounts[field].yes += 1;
      } else if (item[field] === "No") {
        acc[item.gestor_visitado_nombre].fieldCounts[field].no += 1;
      }
    });

    acc[item.gestor_visitado_nombre].details.push(item);
    return acc;
  }, {});

  const sortedUserSummaries = Object.values(userSummaries).sort(
    (a, b) => b.totalSupervisions - a.totalSupervisions
  );

  const totalGestoresVisitados = sortedUserSummaries.length;

  const toggleRow = (gestor_visitado_nombre) => {
    setOpenRows((prev) => ({
      ...prev,
      [gestor_visitado_nombre]: !prev[gestor_visitado_nombre],
    }));
  };

  const setUserFilter = (gestor_visitado_nombre, key, value) => {
    setFilters((prev) => ({
      ...prev,
      [gestor_visitado_nombre]: { key, value },
    }));
  };

  const filterDetails = (gestor_visitado_nombre, details) => {
    const userFilter = filters[gestor_visitado_nombre];
    if (!userFilter) return details;
    return details.filter(
      (detail) => detail[userFilter.key] === userFilter.value
    );
  };

  const clearUserFilter = (gestor_visitado_nombre) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[gestor_visitado_nombre]; // Elimina el filtro para ese usuario
      return newFilters;
    });
  };

  return (
    <div className="w-full text-white">
      <div className="flex justify-between items-center mb-2">
        {/* Título principal */}
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

        {/* Contador de gestores visitados */}
        <div className="flex items-center gap-2">
          <Typography
            variant="h6"
            sx={{
              color: colors.accentGreen[100],
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Gestores visitados:
          </Typography>
          <Typography
            variant="h3"
            sx={{
              color: colors.accentGreen[100],
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            {totalGestoresVisitados}
          </Typography>
        </div>
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
                Total Supervisiones recibidas
              </TableCell>
              {selectedFields.map((field) => (
                <TableCell
                  key={field}
                  sx={{
                    color: colors.contentSearchButton[100],
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  {field.replace(/_/g, " ")}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedUserSummaries.map(
              ({
                gestor_visitado_nombre,
                totalSupervisions,
                fieldCounts,
                details,
              }) => (
                <React.Fragment key={gestor_visitado_nombre}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleRow(gestor_visitado_nombre)}
                        sx={{ color: colors.accentGreen[100] }}
                      >
                        {openRows[gestor_visitado_nombre] ? (
                          <KeyboardArrowUp sx={{ fontWeight: "bold" }} />
                        ) : (
                          <KeyboardArrowDown sx={{ fontWeight: "bold" }} />
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
                        {gestor_visitado_nombre}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => clearUserFilter(gestor_visitado_nombre)}
                        sx={{
                          color: colors.accentGreen[100],
                          fontWeight: "bold",
                        }}
                      >
                        {totalSupervisions}
                      </IconButton>
                    </TableCell>

                    {selectedFields.map((field) => (
                      <TableCell key={field}>
                        <IconButton
                          sx={{
                            color: colors.accentGreen[100],
                            fontWeight: "bold",
                          }}
                          onClick={() =>
                            setUserFilter(gestor_visitado_nombre, field, "Si")
                          }
                        >
                          {fieldCounts[field]?.yes || 0}
                        </IconButton>
                        <small style={{ color: colors.accentGreen[100] }}>
                          (SI)
                        </small>{" "}
                        /{" "}
                        <IconButton
                          sx={{
                            color: colors.accentGreen[100],
                            fontWeight: "bold",
                          }}
                          onClick={() =>
                            setUserFilter(gestor_visitado_nombre, field, "No")
                          }
                        >
                          {fieldCounts[field]?.no || 0}
                        </IconButton>
                        <small style={{ color: colors.accentGreen[100] }}>
                          (NO)
                        </small>
                      </TableCell>
                    ))}
                  </TableRow>

                  {openRows[gestor_visitado_nombre] && (
                    <TableRow>
                      <TableCell colSpan={selectedFields.length + 3}>
                        <Collapse
                          in={openRows[gestor_visitado_nombre]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Table size="small">
                            <TableHead>
                              <TableRow
                                sx={{
                                  backgroundColor: colors.tealAccent[500],
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
                                >
                                  Supervisor
                                </TableCell>
                                <TableCell
                                  sx={{
                                    color: colors.contentSearchButton[100],
                                    fontWeight: "bold",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  FECHA CAPTURA
                                </TableCell>
                                {selectedFields.map((field) => (
                                  <TableCell
                                    key={field}
                                    sx={{
                                      color: colors.contentSearchButton[100],
                                      fontWeight: "bold",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {field.replace(/_/g, " ").toUpperCase()}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {filterDetails(
                                gestor_visitado_nombre,
                                details
                              ).map((detail, index) => (
                                <TableRow key={index}>
                                  <TableCell>{detail.usuario}</TableCell>
                                  <TableCell>
                                    {new Date(
                                      detail.fecha_captura
                                    ).toLocaleString()}
                                  </TableCell>
                                  {selectedFields.map((field) => (
                                    <TableCell key={field}>
                                      {detail[field]}
                                    </TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SupervisionsPerManager;
