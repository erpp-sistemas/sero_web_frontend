import React, { useMemo } from 'react';
import { Typography } from "@mui/material";

function buildColumns() {
  return useMemo(() => [    
    { 
      headerName: 'SERVICIO',
      field: 'name_service',
      minWidth: 180,
      headerAlign: 'left',
      renderHeader: () => (
        <strong style={{ color: "#254061" }}>{"SERVICIO"}</strong>
      ),
    },
    { 
      headerName: 'MES',
      field: 'name_month',
      minWidth: 100,
      renderHeader: () => (
        <strong style={{ color: "#254061" }}>{"MES"}</strong>
      ),
    },
    { 
      headerName: 'AÑO',
      field: 'year_number',
      minWidth: 100,
      renderHeader: () => (
        <strong style={{ color: "#254061" }}>{"AÑO"}</strong>
      ),
    },
    { 
      headerName: 'PROCESO',
      field: 'name_proccess',
      minWidth: 100,
      renderHeader: () => (
        <strong style={{ color: "#254061" }}>{"PROCESO"}</strong>
      ),
    },
    { 
      headerName: 'TAREA',
      field: 'name_task',
      minWidth: 100,
      renderHeader: () => (
        <strong style={{ color: "#254061" }}>{"TAREA"}</strong>
      ),
    },
    { 
      headerName: 'GESTIONES REALIZADAS',
      field: 'number_managements',
      minWidth: 150,
      renderHeader: () => (
        <strong style={{ color: "#254061" }}>{"GESTIONES REALIZADAS"}</strong>
      ),
      renderCell: (value) => (
        <Typography>
          {Number(value).toLocaleString('es-MX')}
        </Typography>
      ),
    }
  ], []);
}

export default buildColumns;
