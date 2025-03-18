import {
  Typography,
  useTheme,  
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { tokens } from "../../theme";

function DataGridAssignmentAll({ data }) {
  console.log(data);
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos para mostrar</p>
    );
  }

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);  

  const groupedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const result = Object.values(
      data.reduce((acc, item) => {
        const { gestor, imagen_usuario, id_estatus_asignacion } = item;

        if (!acc[gestor]) {
          acc[gestor] = {
            gestor,
            imagen_usuario,
            total_cuentas: 0,
            total_cuentas_activas: 0,
            total_cuentas_inactivas: 0,
          };
        }

        acc[gestor].total_cuentas += 1;
        if (id_estatus_asignacion === 1) {
          acc[gestor].total_cuentas_activas += 1;
        } else {
          acc[gestor].total_cuentas_inactivas += 1;
        }

        return acc;
      }, {})
    ).sort((a, b) => b.total_cuentas - a.total_cuentas);

    console.log("Nuevo array agrupado:", result);
    return result;
  }, [data]);  

  return (
    <div className="w-full text-white">
      <div className="w-full p-4 rounded-lg shadow-md mb-4">
        <Typography
          variant="h6"
          sx={{
            color: colors.accentGreen[100],
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          listado de asignaciones
        </Typography>
        <div className="grid grid-cols-12 gap-4 mb-4">
          <div className="col-span-4 shadow-lg">
            
          </div>
          <div className="col-span-2">
            
          </div>
          {/* Las 6 columnas restantes se quedan vacías */}
          <div className="col-span-6"></div>
        </div>
        <div className="w-full pb-3 rounded-lg shadow-md flex flex-col max-h-[600px] overflow-auto">
          
        </div>
      </div>
    </div>
  );
}

export default DataGridAssignmentAll;
