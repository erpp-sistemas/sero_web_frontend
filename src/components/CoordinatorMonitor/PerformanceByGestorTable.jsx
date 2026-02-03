// src/components/HomeCoordination/GestorPerformanceTable.jsx
import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";

const getChip = (label, color) => (
  <Chip
    label={label}
    size="small"
    sx={{
      backgroundColor: color,
      color: "#fff",
      fontWeight: 500,
    }}
  />
);

const GestorPerformanceTable = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const rows = useMemo(() => {
    const map = {};

    data.forEach((g) => {
      if (!map[g.id_usuario]) {
        map[g.id_usuario] = {
          id_usuario: g.id_usuario,
          nombre: g.nombre_usuario,
          total: 0,
          completas: 0,
          incompletas: 0,
          invalidas: 0,
          evidenciaCritica: false,
          asistenciaCritica: false,
          asistenciaIrregular: false,
        };
      }

      const r = map[g.id_usuario];
      r.total++;

      if (g.estatus_gestion === "COMPLETA") r.completas++;
      if (g.estatus_gestion === "INCOMPLETA") r.incompletas++;
      if (g.estatus_gestion === "INVALIDA") {
        r.invalidas++;
        r.evidenciaCritica = true;
      }

      if (g.estatus_asistencia === "SIN_ASISTENCIA") {
        r.asistenciaCritica = true;
      } else if (
        g.estatus_asistencia === "SIN_ENTRADA" ||
        g.estatus_asistencia === "SIN_SALIDA"
      ) {
        r.asistenciaIrregular = true;
      }
    });

    return Object.values(map).map((r) => {
      const porcentaje = r.total
        ? Math.round((r.completas / r.total) * 100)
        : 0;

      let evidencia = "OK";
      if (r.evidenciaCritica) evidencia = "CRÍTICA";
      else if (r.incompletas > 0) evidencia = "INCOMPLETA";

      let asistencia = "OK";
      if (r.asistenciaCritica) asistencia = "CRÍTICA";
      else if (r.asistenciaIrregular) asistencia = "IRREGULAR";

      let estado = "OK";
      if (porcentaje < 70 || evidencia === "CRÍTICA" || asistencia === "CRÍTICA")
        estado = "CRÍTICO";
      else if (porcentaje < 90 || evidencia !== "OK" || asistencia !== "OK")
        estado = "ATENCIÓN";

      return { ...r, porcentaje, evidencia, asistencia, estado };
    });
  }, [data]);

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Desempeño por Gestor
      </Typography>

      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Gestor</TableCell>
            <TableCell align="center">Gestiones</TableCell>
            <TableCell align="center">% Completas</TableCell>
            <TableCell align="center">Evidencia</TableCell>
            <TableCell align="center">Asistencia</TableCell>
            <TableCell align="center">Estado</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id_usuario} hover>
              <TableCell>{r.nombre}</TableCell>
              <TableCell align="center">{r.total}</TableCell>
              <TableCell align="center">{r.porcentaje}%</TableCell>
              <TableCell align="center">
                {r.evidencia === "OK" &&
                  getChip("OK", colors.greenAccent[600])}
                {r.evidencia === "INCOMPLETA" &&
                  getChip("Incompleta", colors.yellowAccent[700])}
                {r.evidencia === "CRÍTICA" &&
                  getChip("Crítica", colors.redAccent[600])}
              </TableCell>
              <TableCell align="center">
                {r.asistencia === "OK" &&
                  getChip("OK", colors.greenAccent[600])}
                {r.asistencia === "IRREGULAR" &&
                  getChip("Irregular", colors.yellowAccent[700])}
                {r.asistencia === "CRÍTICA" &&
                  getChip("Crítica", colors.redAccent[600])}
              </TableCell>
              <TableCell align="center">
                {r.estado === "OK" &&
                  getChip("OK", colors.greenAccent[700])}
                {r.estado === "ATENCIÓN" &&
                  getChip("Atención", colors.yellowAccent[800])}
                {r.estado === "CRÍTICO" &&
                  getChip("Crítico", colors.redAccent[700])}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default GestorPerformanceTable;
