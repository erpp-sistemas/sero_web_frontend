import React, { useEffect, useState } from "react";
import { Typography, Chip, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const StatusPointFilter = ({
  statusCountsEntry,
  statusCountsExit,
  onFilter,
  profiles,
  selectedProfile,
  onProfileSelect,
  profileCounts, 
}) => {
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <div className="rounded-lg shadow-md pb-3">
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-12">
          <Typography variant="h7">
            Selecciona un puesto y un estatus para visualizar los registros
          </Typography>
        </div>

        {/* Chips de perfiles */}
        <div className="col-span-12 mb-2">
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              paddingBottom: 1,
              color: colors.accentGreen[100],
            }}
          >
            Puesto
          </Typography>
          <div className="flex flex-wrap gap-2">
            <Chip
              label={`Todos (${Object.values(profileCounts).reduce(
                (a, b) => a + b,
                0
              )})`}
              clickable
              onClick={() => onProfileSelect("")}
              sx={{
                backgroundColor: selectedProfile === "" ? colors.accentGreen[100] : "default",
                color: selectedProfile === "" ? colors.contentAccentGreen[100] : "default",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: colors.accentGreen[200],
                  color: colors.contentAccentGreen[100],
                },
              }}
            />
            {profiles.map((profile) => (
              <Chip
                key={profile}
                label={`${profile} (${profileCounts[profile] || 0})`}
                clickable
                onClick={() => onProfileSelect(profile)}
                sx={{
                  backgroundColor: selectedProfile === profile ? colors.accentGreen[100] : "default",
                  color: selectedProfile === profile ? colors.contentAccentGreen[100] : "default",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: colors.accentGreen[200],
                    color: colors.contentAccentGreen[100],
                  },
                }}
              />
            ))}
          </div>
        </div>

        {/* Estatus Punto de Entrada */}
        <div className="col-span-6">
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

        {/* Estatus Punto de Salida */}
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
