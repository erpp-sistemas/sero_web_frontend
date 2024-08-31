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
        <strong style={{ color: "#5EBFFF" }}>{"SERVICIO"}</strong>
      ),
    },
    { 
      headerName: 'MES',
      field: 'name_month',
      minWidth: 100,
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"MES"}</strong>
      ),
    },
    { 
      headerName: 'AÑO',
      field: 'year_number',
      minWidth: 100,
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"AÑO"}</strong>
      ),
    },
    { 
      headerName: 'CUENTAS CON DEUDA',
      field: 'account_debt',
      minWidth: 150,
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"CUENTAS CON DEUDA"}</strong>
      ),
      renderCell: (value) => (
        <Typography>
          {Number(value).toLocaleString('es-MX')}
        </Typography>
      ),
    },
    { 
      headerName: 'MONTO DE DEUDA',
      field: 'amount_debt',
      minWidth: 120,
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"MONTO DE DEUDA"}</strong>
      ),
      renderCell: (value) => (
        <Typography>
          {`${Number(value).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`}
        </Typography>
      ),
    },
    { 
      headerName: 'PAGOS REGISTRADOS',
      field: 'number_payments',
      minWidth: 120,
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"PAGOS REGISTRADOS"}</strong>
      ),
      renderCell: (value) => (
        <Typography>
          {Number(value).toLocaleString('es-MX')}
        </Typography>
      ),
    },
    { 
      headerName: 'CUENTAS PAGADAS',
      field: 'account_payments',
      minWidth: 120,
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"CUENTAS PAGADAS"}</strong>
      ),
      renderCell: (value) => (
        <Typography>
          {Number(value).toLocaleString('es-MX')}
        </Typography>
      ),
    },
    { 
      headerName: 'MONTO PAGADO',
      field: 'amount_paid',
      minWidth: 120,
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"MONTO PAGADO"}</strong>
      ),
      renderCell: (value) => (
        <Typography>
          {`${Number(value).toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}`}
        </Typography>
      ),
    },
    { 
      headerName: 'FECHA MÍNIMA DE PAGO',
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"FECHA MINIMA DE PAGO"}</strong>
      ),
      field: 'minimum_date_paid',
      minWidth: 120,
    },
    { 
      headerName: 'FECHA MÁXIMA DE PAGO',
      renderHeader: () => (
        <strong style={{ color: "#5EBFFF" }}>{"FECHA MAXIMO DE PAGO"}</strong>
      ),
      field: 'maximum_date_paid',
      minWidth: 120,
    }
  ], []);
}

export default buildColumns;
