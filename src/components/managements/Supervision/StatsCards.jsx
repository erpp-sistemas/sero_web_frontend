import React, { useMemo } from "react";
import { Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const StatsCards = ({ data, selectedFields }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos para mostrar</p>
    );
  }
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Calcular dinámicamente las métricas basadas en los campos seleccionados
  const summary = useMemo(() => {
    const result = { total: data.length };

    selectedFields.forEach((field) => {
      if (typeof data[0][field] !== "undefined") {
        result[`${field}Si`] = data.filter(
          (item) => item[field] === "Si"
        ).length;
        result[`${field}No`] = data.filter(
          (item) => item[field] === "No"
        ).length;
      }
    });

    return result;
  }, [data, selectedFields]);

  return (
    <div className="font-[sans-serif]">
      <div className="grid grid-cols-12 gap-4 p-4">
        <div className="col-span-12 md:col-span-12 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-6">
              <div>
                <Typography variant="h2" sx={{ fontWeight: "bold" }}>
                  {summary.total.toLocaleString()}
                </Typography>
                <Typography variant="h4" className="mt-2">
                  Total Supervisiones
                </Typography>
              </div>
            </div>
            {selectedFields.map((field) => (
              <div className="flex items-center gap-6" key={field}>
                <div>
                  <Typography variant="h2" sx={{ fontWeight: "bold" }}>
                    {summary[`${field}Si`] || 0} <small>(SI)</small> /{" "}
                    {summary[`${field}No`] || 0} <small>(NO)</small>
                  </Typography>
                  <Typography variant="h4">
                    {field.replace(/_/g, " ")}
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
