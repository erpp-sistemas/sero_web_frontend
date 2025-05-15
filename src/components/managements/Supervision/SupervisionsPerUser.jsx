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
} from "@mui/material";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { tokens } from "../../../theme";

const SupervisionsPerUser = ({ data, selectedFields }) => {
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
    if (!acc[item.usuario]) {
      acc[item.usuario] = {
        usuario: item.usuario,
        totalSupervisions: 0,
        fieldCounts: {},
        details: [],
      };
    }

    acc[item.usuario].totalSupervisions += 1; // 🔹 Contador de supervisiones

    selectedFields.forEach((field) => {
      if (!acc[item.usuario].fieldCounts[field]) {
        acc[item.usuario].fieldCounts[field] = { yes: 0, no: 0 };
      }

      if (item[field] === "Si") {
        acc[item.usuario].fieldCounts[field].yes += 1;
      } else if (item[field] === "No") {
        acc[item.usuario].fieldCounts[field].no += 1;
      }
    });

    acc[item.usuario].details.push(item);
    return acc;
  }, {});

  const sortedUserSummaries = Object.values(userSummaries).sort(
    (a, b) => b.totalSupervisions - a.totalSupervisions
  );

  const totalUsuarios = sortedUserSummaries.length;

  const toggleRow = (usuario) => {
    setOpenRows((prev) => ({ ...prev, [usuario]: !prev[usuario] }));
  };

  const setUserFilter = (usuario, key, value) => {
    setFilters((prev) => ({
      ...prev,
      [usuario]: { key, value },
    }));
  };

  const filterDetails = (usuario, details) => {
    const userFilter = filters[usuario];
    if (!userFilter) return details;
    return details.filter(
      (detail) => detail[userFilter.key] === userFilter.value
    );
  };

  const clearUserFilter = (usuario) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[usuario]; // Elimina el filtro para ese usuario
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
          Estadisticas por supervisor
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
            Supervisores:
          </Typography>
          <Typography
            variant="h3"
            sx={{
              color: colors.accentGreen[100],
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            {totalUsuarios}
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
                Supervisor
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
              ({ usuario, totalSupervisions, fieldCounts, details }) => (
                <React.Fragment key={usuario}>
                  <TableRow>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => toggleRow(usuario)}
                        sx={{ color: colors.accentGreen[100] }}
                      >
                        {openRows[usuario] ? (
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
                        {usuario}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => clearUserFilter(usuario)}
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
                          onClick={() => setUserFilter(usuario, field, "Si")}
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
                          onClick={() => setUserFilter(usuario, field, "No")}
                        >
                          {fieldCounts[field]?.no || 0}
                        </IconButton>
                        <small style={{ color: colors.accentGreen[100] }}>
                          (NO)
                        </small>
                      </TableCell>
                    ))}
                  </TableRow>

                  {openRows[usuario] && (
                    <TableRow>
                      <TableCell colSpan={selectedFields.length + 3}>
                        <Collapse
                          in={openRows[usuario]}
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
                                  GESTOR VISITADO
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
                              {filterDetails(usuario, details).map(
                                (detail, index) => (
                                  <TableRow key={index}>
                                    <TableCell>
                                      {detail.gestor_visitado_nombre}
                                    </TableCell>
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
                                )
                              )}
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

export default SupervisionsPerUser;
