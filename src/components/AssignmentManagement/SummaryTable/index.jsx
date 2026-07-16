import React, { useMemo } from "react";

import { Box, Typography, useTheme } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { tokens } from "../../../theme";

import buildColumns from "./buildColumns";

function SummaryTable({ data = [], onManagerSelected }) {
  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  const COLOR_TEXTO = colors.grey[100];
  const COLOR_FONDO = colors.bgContainer;
  const COLOR_BORDE = colors.primary[500];
  const COLOR_PRIMARIO = colors.primary[400];

  const columns = useMemo(
    () =>
      buildColumns({
        colors,

        onManagerSelected,
      }),
    [colors, onManagerSelected],
  );

  if (!data.length) {
    return (
      <Box
        sx={{
          mt: 3,
          p: 6,
          borderRadius: "12px",
          border: `1px solid ${colors.borderContainer}`,
          backgroundColor: colors.bgContainer,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: colors.grey[400],
            fontWeight: 500,
          }}
        >
          No se encontraron asignaciones activas.
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 1,
            color: colors.grey[500],
          }}
        >
          Intenta cambiar los filtros de búsqueda.
        </Typography>
      </Box>
    );
  }

  const alturaTabla = useMemo(() => {
    const alturaHeader = 56;
    const alturaFila = 52;
    const margenExtra = 16;

    if (data.length <= 5) {
      return alturaHeader + data.length * alturaFila + margenExtra;
    }

    return 500;
  }, [data.length]);

  return (
    <>
      <Box
        className="rounded-xl shadow-sm"
        sx={{
          mt: 4,
          backgroundColor: COLOR_FONDO,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: alturaTabla,
            width: "100%",

            "& .MuiDataGrid-root": {
              border: "none",
              color: COLOR_TEXTO,
              backgroundColor: COLOR_FONDO,
            },

            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${COLOR_BORDE}`,
              display: "flex",
              alignItems: "center",
            },

            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: COLOR_FONDO,
              borderBottom: `1px solid ${COLOR_BORDE}`,
              fontWeight: 600,
            },

            "& .MuiDataGrid-footerContainer": {
              display: "none",
            },

            "& .MuiDataGrid-row": {
              "&:hover": {
                backgroundColor: colors.primary[400],
              },
            },
          }}
        >
          <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row.id_usuario}
            disableRowSelectionOnClick
            hideFooter
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: {
                  page: 0,
                  pageSize: 10,
                },
              },
            }}
            sx={{
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: COLOR_FONDO,
              },

              "& .MuiDataGrid-columnHeaders": {
                position: "sticky",
                top: 0,
                zIndex: 1,
                backgroundColor: COLOR_FONDO,
              },

              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600,
              },

              "& .MuiDataGrid-columnSeparator": {
                display: "none",
              },

              "& .MuiDataGrid-sortIcon": {
                color: colors.grey[400],
              },

              "& .MuiDataGrid-columnHeader:hover .MuiDataGrid-sortIcon": {
                color: colors.accentGreen[100],
              },
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: colors.grey[500],
          }}
        >
          Mostrando {data.length.toLocaleString()} gestores
        </Typography>
      </Box>
    </>
  );
}

export default SummaryTable;
