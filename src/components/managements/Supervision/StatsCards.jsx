import React, { useMemo, useState } from "react";
import {  
  Typography,  
  useTheme,
} from "@mui/material";
import { tokens } from "../../../theme";

const StatsCards = ({ data }) => {
  console.log(data);
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos para mostrar</p>
    );
  }
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const summary = useMemo(() => {
    return {
      total: data.length,
      acreditacionesSi: data.filter((item) => item.trae_acreditacion === "Si")
        .length,
      acreditacionesNo: data.filter((item) => item.trae_acreditacion === "No")
        .length,
      chalecosSi: data.filter((item) => item.trae_chaleco === "Si").length,
      chalecosNo: data.filter((item) => item.trae_chaleco === "No").length,
      vestimentaSi: data.filter((item) => item.vestimenta_semiformal === "Si")
        .length,
      vestimentaNo: data.filter((item) => item.vestimenta_semiformal === "No")
        .length,
    };
  }, [data]);  

  return (
    <div className=" font-[sans-serif]">
      <div className="grid grid-cols-12 gap-4 p-4">
        {/* Sección de tablas (6 columnas) */}
        <div className="col-span-12 md:col-span-12 space-y-6">
          {/* Indicadores */}
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
            <div className="flex items-center gap-6">
              <div>
                <Typography variant="h2" sx={{ fontWeight: "bold" }}>
                  {summary.acreditacionesSi} <small>(SI)</small> /{" "}
                  {summary.acreditacionesNo} <small>(NO)</small>
                </Typography>
                <Typography variant="h4">Acreditaciones</Typography>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <Typography variant="h2" sx={{ fontWeight: "bold" }}>
                  {summary.chalecosSi} <small>(SI)</small> /{" "}
                  {summary.chalecosNo} <small>(NO)</small>
                </Typography>
                <Typography variant="h4">Chaleco</Typography>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div>
                <Typography variant="h2" sx={{ fontWeight: "bold" }}>
                  {summary.vestimentaSi} <small>(SI)</small> /{" "}
                  {summary.vestimentaNo} <small>(NO)</small>
                </Typography>
                <Typography variant="h4">Vestimenta semiformal</Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default StatsCards;
