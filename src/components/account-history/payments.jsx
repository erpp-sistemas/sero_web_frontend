import React, { useState } from "react";
import {
  Typography,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  TableSortLabel,
  InputAdornment,
  FormControl,
} from "@mui/material";
import { tokens } from "../../theme";
import { Search } from "@mui/icons-material";

const Payments = ({ payments }) => {
  if (!payments || payments.length === 0) {
    return (
      <Typography align="center" color="textSecondary">
        No hay datos para mostrar
      </Typography>
    );
  }

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const parsedPayments = Array.isArray(payments)
    ? payments
    : JSON.parse(payments);

  const [orderBy, setOrderBy] = useState("payment_date");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedPayments = parsedPayments.sort((a, b) => {
    if (orderBy === "amount_paid") {
      return order === "asc"
        ? a[orderBy] - b[orderBy]
        : b[orderBy] - a[orderBy];
    }
    return order === "asc"
      ? new Date(a[orderBy]) - new Date(b[orderBy])
      : new Date(b[orderBy]) - new Date(a[orderBy]);
  });

  const filteredPayments = sortedPayments.filter((payment) =>
    Object.values(payment).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery)
    )
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className="space-y-3 pt-3">
      <Typography
        variant="h3"
        sx={{
          color: colors.accentGreen[100],
          marginTop: "10px",
          fontWeight: "bold",
        }}
      >
        Pagos de la cuenta
      </Typography>
      <div className="grid grid-cols-12 gap-4">
        <FormControl fullWidth className="col-span-6">
          <TextField
            fullWidth
            onChange={handleSearchChange}
            color="secondary"
            size="small"
            placeholder="Ingresa tu búsqueda"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="secondary" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px", // Bordes redondeados
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: colors.accentGreen[100], // Color predeterminado del borde
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "accent.light", // Color al pasar el mouse
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "accent.dark", // Color al enfocar
                },
              },
            }}
          />
        </FormControl>
      </div>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "8px",
          boxShadow: 3,
          padding: 0,
          background: "rgba(128, 128, 128, 0.1)",
          maxHeight: 500,
        }}
      >
        <Table>
          <TableHead
            sx={{
              backgroundColor: colors.accentGreen[100],
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            <TableRow>
              <TableCell
                sx={{
                  color: colors.contentSearchButton[100],
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                <TableSortLabel
                  active={orderBy === "payment_date"}
                  direction={order}
                  onClick={() => handleRequestSort("payment_date")}
                >
                  Fecha de Pago
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  color: colors.contentSearchButton[100],
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                <TableSortLabel
                  active={orderBy === "amount_paid"}
                  direction={order}
                  onClick={() => handleRequestSort("amount_paid")}
                >
                  Monto Pagado
                </TableSortLabel>
              </TableCell>
              <TableCell
                sx={{
                  color: colors.contentSearchButton[100],
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Referencia
              </TableCell>
              <TableCell
                sx={{
                  color: colors.contentSearchButton[100],
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Descripción
              </TableCell>
              <TableCell
                sx={{
                  color: colors.contentSearchButton[100],
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Periodo
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments.length > 0 ? (
              filteredPayments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((payment, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {payment.payment_date
                        ? new Date(payment.payment_date)
                            .toLocaleDateString()
                            .toUpperCase()
                        : "NO DISPONIBLE"}
                    </TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      }).format(payment.amount_paid)}
                    </TableCell>
                    <TableCell>
                      {payment.reference || "No disponible"}
                    </TableCell>
                    <TableCell>
                      {payment.description || "No disponible"}
                    </TableCell>
                    <TableCell>
                      {payment.payment_period || "No disponible"}
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay datos para mostrar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredPayments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          backgroundColor: colors.accentGreen[100],
          borderBottomLeftRadius: "8px",
          borderBottomRightRadius: "8px",
          color: colors.contentSearchButton[100],
          fontWeight: "bold",
          textTransform: "uppercase",
        }}
      />
    </div>
  );
};

export default Payments;
