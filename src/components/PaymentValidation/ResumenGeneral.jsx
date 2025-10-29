// src/components/PaymentValidation/ResumenGeneral.jsx
import React, { useMemo } from "react";
import { Box, Typography, useTheme, Grow } from "@mui/material";
import { tokens } from "../../theme";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";

const ResumenGeneral = ({ pagosValidos = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // 🔹 Calculo de valores
  const resumen = useMemo(() => {
    if (!Array.isArray(pagosValidos) || pagosValidos.length === 0)
      return {
        total_registros: 0,
        cuentas_unicas: 0,
        monto_total: 0,
        fecha_min: "-",
        fecha_max: "-",
      };

    const cuentas = new Set();
    let monto_total = 0;
    let fecha_min = null;
    let fecha_max = null;

    const extractFecha = (p) => p["fecha de pago"] || p.fecha_pago || null;

    const parseToDate = (val) => {
      if (!val) return null;
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d;
    };

    pagosValidos.forEach((p) => {
      if (p.cuenta) cuentas.add(p.cuenta);
      monto_total += parseFloat(p.total_pagado || 0);

      const fechaObj = parseToDate(extractFecha(p));
      if (fechaObj) {
        if (!fecha_min || fechaObj < fecha_min) fecha_min = fechaObj;
        if (!fecha_max || fechaObj > fecha_max) fecha_max = fechaObj;
      }
    });

    const formatoFecha = (f) => (f ? f.toISOString().split("T")[0] : "-");

    return {
      total_registros: pagosValidos.length,
      cuentas_unicas: cuentas.size,
      monto_total,
      fecha_min: formatoFecha(fecha_min),
      fecha_max: formatoFecha(fecha_max),
    };
  }, [pagosValidos]);

  // 🔹 Definimos las cards
  const cards = [
    {
      label: "Registros encontrados",
      value: resumen.total_registros,
      icon: <DescriptionOutlinedIcon />,
      delay: 0,
    },
    {
      label: "Cuentas únicas",
      value: resumen.cuentas_unicas,
      icon: <AccountCircleOutlinedIcon />,
      delay: 100,
    },
    {
      label: "Monto ingresado",
      value: `$${resumen.monto_total.toLocaleString("es-MX")}`,
      icon: <AttachMoneyOutlinedIcon />,
      delay: 200,
    },
    {
      label: "Rango de pago",
      value: `${resumen.fecha_min} → ${resumen.fecha_max}`,
      icon: <DateRangeOutlinedIcon />,
      delay: 300,
    },
  ];

  return (
    <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {cards.map((card, index) => (
        <Grow
          key={index}
          in={true}
          style={{ transformOrigin: "0 0 0" }}
          timeout={800}
          // Efecto escalonado para cada card
          {...{ timeout: 500 + card.delay }}
        >
          <Box
            className="p-4 rounded-xl shadow-sm"
            sx={{
              backgroundColor: colors.bgContainer,
              display: "flex",
              alignItems: "center",
              gap: 2,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
            }}
          >
            <Box sx={{ color: colors.grey[500], fontSize: 28 }}>
              {card.icon}
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {typeof card.value === "number"
                  ? card.value.toLocaleString("es-MX")
                  : card.value}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.grey[400] }}>
                {card.label}
              </Typography>
            </Box>
          </Box>
        </Grow>
      ))}
    </Box>
  );
};

export default ResumenGeneral;
