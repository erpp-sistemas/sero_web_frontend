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

const SupervisionsPerUser = ({ data }) => {
  console.log(data);
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos para mostrar</p>
    );
  }
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);  

  const [openRows, setOpenRows] = useState({});
  const [filters, setFilters] = useState({}); // Almacena los filtros por usuario

  const toggleRow = (id) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setUserFilter = (usuario, key, value) => {
    setFilters((prev) => ({
      ...prev,
      [usuario]: { key, value },
    }));
  };

  const clearUserFilter = (usuario) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[usuario]; // Elimina el filtro para ese usuario
      return newFilters;
    });
  };

  const userSummaries = data.reduce((acc, item) => {
    if (!acc[item.usuario]) {
      acc[item.usuario] = {
        usuario: item.usuario,
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
    acc[item.usuario].total++;
    if (item.trae_acreditacion === "Si") acc[item.usuario].acreditacionSi++;
    if (item.trae_acreditacion === "No") acc[item.usuario].acreditacionNo++;
    if (item.trae_chaleco === "Si") acc[item.usuario].chalecoSi++;
    if (item.trae_chaleco === "No") acc[item.usuario].chalecoNo++;
    if (item.vestimenta_semiformal === "Si") acc[item.usuario].vestimentaSi++;
    if (item.vestimenta_semiformal === "No") acc[item.usuario].vestimentaNo++;
    acc[item.usuario].details.push(item);
    return acc;
  }, {});

  const filterDetails = (usuario, details) => {
    const userFilter = filters[usuario];
    if (!userFilter) return details;
    return details.filter(
      (detail) => detail[userFilter.key] === userFilter.value
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
          Supervisiones por usuario
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
                Usuario
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
            {Object.values(userSummaries).map((user) => (
              <React.Fragment key={user.usuario}>
                <TableRow>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleRow(user.usuario)}
                      sx={{ color: colors.accentGreen[100] }}
                    >
                      {openRows[user.usuario] ? (
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
                      {user.usuario}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => clearUserFilter(user.usuario)}
                      sx={{
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      {user.total}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        setUserFilter(user.usuario, "trae_acreditacion", "Si")
                      }
                      sx={{
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      {user.acreditacionSi}
                    </IconButton>
                    <small style={{ color: colors.accentGreen[100] }}>
                      (SI)
                    </small>{" "}
                    /{" "}
                    <IconButton
                      onClick={() =>
                        setUserFilter(user.usuario, "trae_acreditacion", "No")
                      }
                      sx={{
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      {user.acreditacionNo}
                    </IconButton>
                    <small style={{ color: colors.accentGreen[100] }}>
                      (NO)
                    </small>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        setUserFilter(user.usuario, "trae_chaleco", "Si")
                      }
                      sx={{
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      {user.chalecoSi}
                    </IconButton>
                    <small style={{ color: colors.accentGreen[100] }}>
                      (SI)
                    </small>{" "}
                    /{" "}
                    <IconButton
                      onClick={() =>
                        setUserFilter(user.usuario, "trae_chaleco", "No")
                      }
                      sx={{
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      {user.chalecoNo}
                    </IconButton>
                    <small style={{ color: colors.accentGreen[100] }}>
                      (NO)
                    </small>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        setUserFilter(
                          user.usuario,
                          "vestimenta_semiformal",
                          "Si"
                        )
                      }
                      sx={{
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      {user.vestimentaSi}
                    </IconButton>
                    <small style={{ color: colors.accentGreen[100] }}>
                      (SI)
                    </small>{" "}
                    /{" "}
                    <IconButton
                      onClick={() =>
                        setUserFilter(
                          user.usuario,
                          "vestimenta_semiformal",
                          "No"
                        )
                      }
                      sx={{
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      {user.vestimentaNo}
                    </IconButton>
                    <small style={{ color: colors.accentGreen[100] }}>
                      (NO)
                    </small>
                  </TableCell>
                </TableRow>
                {openRows[user.usuario] && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Collapse
                        in={openRows[user.usuario]}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Gestor Visitado</TableCell>
                              <TableCell>Fecha Captura</TableCell>
                              <TableCell>Acreditación</TableCell>
                              <TableCell>Chaleco</TableCell>
                              <TableCell>Vestimenta</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filterDetails(user.usuario, user.details).map(
                              (detail) => (
                                <TableRow key={detail.id}>
                                  <TableCell>
                                    {detail.gestor_visitado_nombre}
                                  </TableCell>
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

export default SupervisionsPerUser;
