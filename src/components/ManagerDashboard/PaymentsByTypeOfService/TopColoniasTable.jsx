import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  useTheme
} from "@mui/material";
import { tokens } from '../../../theme.js';

function TopColoniasTable({ type, topColonias }) {

   const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const themeBackgroundColor = theme.palette.background.paper;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(value);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "400px",
        p: 2,
        borderRadius: "10px",
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        Promedio pagado: {type}
      </Typography>
      <TableContainer sx={{ backgroundColor: theme.palette.background.paper }}>
        <Table >
          <TableHead>
            <TableRow>
              <TableCell>Colonia</TableCell>
              <TableCell>Cuentas</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Promedio</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {topColonias.map((colonia) => (
              <TableRow key={colonia.colonia}>
                <TableCell style={{ padding: "4px 8px" }}>
                  {colonia.colonia || "Sin nombre"}
                </TableCell>
                <TableCell style={{ padding: "4px 8px" }}>
                  {colonia.count}
                </TableCell>
                <TableCell style={{ padding: "4px 8px" }}>
                {formatCurrency(colonia.total)}
                </TableCell>
                <TableCell style={{ padding: "4px 8px" }}>
                  {formatCurrency(colonia.promedio)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TopColoniasTable;
