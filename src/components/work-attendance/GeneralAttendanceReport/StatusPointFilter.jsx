import React from "react";
import { Typography, Chip, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const StatusPointFilter = ({
  statusCountsEntry,
  statusCountsExit,
  onFilter,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <div className="rounded-lg shadow-md pb-3">
      <div className="grid grid-cols-12 ">
        <div className="col-span-12">
          <Typography variant="body2"  >
            Selecciona un estatus para vizualizar los registros
          </Typography>
        </div>
        {/* Estatus Punto de Entrada (col-span-6) */}
        <div className="col-span-6 ">
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              paddingBottom: 2,
              color: colors.accentGreen[100],              
            }}
          >
            Estatus del punto de entrada
          </Typography>
          <div className="flex flex-wrap gap-2">
            {Object.entries(statusCountsEntry).map(([status, count]) => (
              <Chip
                key={status}
                label={`${status}: ${count}`}
                onClick={() => onFilter("estatus_punto_entrada", status)}
                clickable
                sx={{
                  backgroundColor: colors.accentGreen[100],
                  color: colors.contentAccentGreen[100],
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: colors.accentGreen[200],
                    color: colors.contentAccentGreen[200],
                  },
                }}
              />
            ))}
          </div>
        </div>

        {/* Estatus Punto de Salida (col-span-6) */}
        <div className="col-span-6">
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              paddingBottom: 2,
              color: colors.accentGreen[100],              
            }}
          >
            Estatus del punto de salida
          </Typography>
          <div className="flex flex-wrap gap-2">
            {Object.entries(statusCountsExit).map(([status, count]) => (
              <Chip
                key={status}
                label={`${status}: ${count}`}
                onClick={() => onFilter("estatus_punto_salida", status)}
                clickable
                sx={{
                  backgroundColor: colors.accentGreen[100],
                  color: colors.contentAccentGreen[100],
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: colors.accentGreen[200],
                    color: colors.contentAccentGreen[200],
                  },
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPointFilter;
