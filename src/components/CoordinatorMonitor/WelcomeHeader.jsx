import React from "react";
import { tokens } from "../../theme";
import { useTheme, Typography } from "@mui/material";

const WelcomeHeader = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <header className="w-full mb-6">
      {/* Bloque principal: nombre + rol */}
      <div className="flex flex-wrap items-baseline gap-x-2">
        <Typography
          variant="h3"
          sx={{
            color: colors.grey[100],
            fontWeight: 500,
            letterSpacing: "-0.02em",
          }}
        >
          Monitor de coordinacion
        </Typography>
      </div>

      {/* Texto descriptivo */}
      <Typography
        variant="body2"
        sx={{
          color: colors.grey[400],
          marginTop: "6px",
          lineHeight: 1.6,
        }}
      >
        Este es el resumen general de la actividad de tu equipo por periodo.
        Identifica alertas y da seguimiento a la operación.
      </Typography>
    </header>
  );
};

export default WelcomeHeader;
