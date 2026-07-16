import React from "react";
import { Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const WelcomeHeader = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <header className="w-full mb-6">
      {/* Título */}
      <div className="flex flex-wrap items-baseline gap-x-2">
        <Typography
          variant="h3"
          sx={{
            color: colors.grey[100],
            fontWeight: 500,
            letterSpacing: "-0.02em",
          }}
        >
          Administración de asignaciones
        </Typography>
      </div>

      {/* Descripción */}
      <Typography
        variant="body2"
        sx={{
          color: colors.grey[400],
          marginTop: "6px",
          lineHeight: 1.6,
          maxWidth: "900px",
        }}
      >
        Administra las asignaciones activas de los gestores, identifica
        rápidamente la carga de trabajo de cada uno y desasigna cuentas de forma
        individual o masiva cuando sea necesario.
      </Typography>
    </header>
  );
};

export default WelcomeHeader;
