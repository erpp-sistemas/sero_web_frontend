import React from "react";
import { tokens } from "../../theme";
import { useTheme, Typography } from "@mui/material";

const WelcomeHeader = ({
  userName = "Carlos Martínez",
  role = "Coordinador de campo",
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Fecha actual con zona horaria de México
  const now = new Date();
  const formattedDate = new Intl.DateTimeFormat("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Mexico_City",
  }).format(now);

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
          Hola, {userName}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: colors.grey[400],
            fontWeight: 400,
            fontSize: "0.9rem",
          }}
        >
          · {role}
        </Typography>
      </div>

      {/* Fecha */}
      <Typography
        variant="body2"
        sx={{
          color: colors.grey[300],
          textTransform: "capitalize",
          marginTop: "2px",
        }}
      >
        {formattedDate}
      </Typography>

      {/* Texto descriptivo */}
      <Typography
        variant="body2"
        sx={{
          color: colors.grey[400],
          marginTop: "6px",
          lineHeight: 1.6,
        }}
      >
        Este es el resumen general de las gestiones realizadas hoy. Revisa el
        progreso de tu equipo y detecta incidencias rápidamente.
      </Typography>
    </header>
  );
};

export default WelcomeHeader;
