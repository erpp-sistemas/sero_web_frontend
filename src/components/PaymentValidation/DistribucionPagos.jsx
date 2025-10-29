// src/components/PaymentValidation/DistribucionPagos.jsx
import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";

const rangos = [
  { label: "De 1 a 1 mil", min: 1, max: 1000 },
  { label: "De 1 a 5 mil", min: 1, max: 5000 },
  { label: "De 5 a 10 mil", min: 5000, max: 10000 },
  { label: "De 10 a 25 mil", min: 10000, max: 25000 },
  { label: "De 25 a 50 mil", min: 25000, max: 50000 },
  { label: "De 50 a 100 mil", min: 50000, max: 100000 },
  { label: "De 100 a 500 mil", min: 100000, max: 500000 },
  { label: "Mayor a 500 mil", min: 500000, max: Infinity },
];

const DistribucionPagos = ({ pagosValidos = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tab, setTab] = useState("periodo_valido");

  const handleChange = (_, newValue) => setTab(newValue);

  // 🔹 Procesamos datos
  const dataClasificada = useMemo(() => {
    const base = {
      periodo_valido: rangos.map((r) => ({ ...r, count: 0, total: 0 })),
      periodo_no_valido: rangos.map((r) => ({ ...r, count: 0, total: 0 })),
    };

    pagosValidos
      .filter((p) => p["estatus de gestion valida"] === "Gestión válida")
      .forEach((p) => {
        const periodo = p["evaluacion_periodos"];
        const monto = Number(p.total_pagado || 0);

        if (!["periodo_valido", "periodo_no_valido"].includes(periodo)) return;

        const rango = base[periodo].find((r) => monto >= r.min && monto < r.max);
        if (rango) {
          rango.count += 1;
          rango.total += monto;
        }
      });

    return base;
  }, [pagosValidos]);

  const totalGeneral =
    dataClasificada[tab].reduce((sum, r) => sum + r.total, 0) || 1; // evitar división por 0

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: 1,
        border: `1px solid ${colors.grey[200]}`,
        mt: 4,
      }}
    >
      <CardHeader
        title="Distribución de pagos por monto"
        sx={{
          pb: 0,
          "& .MuiTypography-root": { fontWeight: 600 },
        }}
      />

      <Tabs
        value={tab}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        sx={{
          borderBottom: `1px solid ${colors.grey[200]}`,
          px: 2,
        }}
      >
        <Tab label="Periodo válido" value="periodo_valido" />
        <Tab label="Periodo no válido" value="periodo_no_valido" />
      </Tabs>

      <CardContent>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: colors.grey[100] }}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Rango de monto
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Registros
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Total pagado
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {dataClasificada[tab].map((rango, index) => {
                const porcentaje = (rango.total / totalGeneral) * 100;
                return (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {rango.label}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={porcentaje}
                          sx={{
                            mt: 0.5,
                            height: 6,
                            borderRadius: 2,
                            backgroundColor: colors.grey[100],
                            "& .MuiLinearProgress-bar": {
                              backgroundColor:
                                porcentaje > 20
                                  ? colors.greenAccent[400]
                                  : porcentaje > 5
                                  ? colors.yellowAccent[400]
                                  : colors.grey[400],
                            },
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      {rango.count.toLocaleString("es-MX")}
                    </TableCell>
                    <TableCell align="right">
                      ${rango.total.toLocaleString("es-MX")}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default DistribucionPagos;
