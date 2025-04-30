import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";

const columns = [
  { field: "folio", headerName: "Folio", width: 210 },
  { field: "propietario", headerName: "Propietario", width: 200 },
  { field: "cuenta", headerName: "Cuenta", width: 150 },
  { field: "fecha_visita", headerName: "Fecha Visita", width: 180 },
  { field: "fecha_cita", headerName: "Fecha Cita", width: 180 },
  {
    field: "opcion_regularizacion",
    headerName: "Opcion Regularizacion",
    width: 210,
  },
];

const DataGridAppointments = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <div className="w-full">
      <Typography
        variant="h5"
        sx={{
          color: colors.accentGreen[100],
          fontWeight: "bold",
          textTransform: "uppercase",
          paddingBottom: "10px",
        }}
      >
        registros encontrados
      </Typography>
      <div className="h-[500px] shadow-lg rounded-lg overflow-hidden">
        <DataGrid
          rows={data}
          columns={columns.map((column) => ({
            ...column,
            renderHeader: () => (
              <Typography
                sx={{
                  color: colors.contentSearchButton[100],
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                {column.headerName}
              </Typography>
            ),
          }))}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
          sx={{
            borderRadius: "8px",
            boxShadow: 3,
            padding: 0,
            background: "rgba(128, 128, 128, 0.1)",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.accentGreen[100], // Color de fondo deseado
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            },
            "& .MuiDataGrid-footerContainer": {
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              backgroundColor: colors.accentGreen[100], // Fondo del footer (paginador)
              color: colors.contentSearchButton[100], // Color de texto dentro del footer
            },
            "& .MuiTablePagination-root": {
              color: colors.contentSearchButton[100], // Color del texto del paginador
            },
            // Estilos específicos para los íconos en el encabezado y pie de página
            "& .MuiDataGrid-columnHeaders .MuiSvgIcon-root, .MuiDataGrid-footerContainer .MuiSvgIcon-root":
              {
                color: colors.contentSearchButton[100], // Color de los íconos (flechas)
              },
            // Evitar que los íconos en las celdas se vean afectados
            "& .MuiDataGrid-cell .MuiSvgIcon-root": {
              color: "inherit", // No afectar el color de los íconos en las celdas
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              whiteSpace: "nowrap",
            },
          }}
        />
      </div>
    </div>
  );
};

export default DataGridAppointments;
