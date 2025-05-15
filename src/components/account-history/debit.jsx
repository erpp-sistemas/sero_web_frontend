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
  TableSortLabel,
  TextField,
  InputAdornment,
  FormControl,
} from "@mui/material";
import { tokens } from "../../theme";
import { Search } from "@mui/icons-material";

const Debit = ({ debit }) => {
  if (!debit || debit.length === 0) {
    return (
      <Typography align="center" color="textSecondary">
        No hay datos para mostrar
      </Typography>
    );
  }

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const parseddebit = Array.isArray(debit) ? debit : JSON.parse(debit);

  const [orderBy, setOrderBy] = useState("update_date");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filtereddebit = parseddebit.filter((debit) =>
    Object.values(debit).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const sorteddebit = filtereddebit.sort((a, b) => {
    if (orderBy === "debt_amount") {
      return order === "asc"
        ? a[orderBy] - b[orderBy]
        : b[orderBy] - a[orderBy];
    }
    return order === "asc"
      ? new Date(a[orderBy]) - new Date(b[orderBy])
      : new Date(b[orderBy]) - new Date(a[orderBy]);
  });

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
        Adeudos de la cuenta
      </Typography>
      <div className="grid grid-cols-12 gap-4">
        <FormControl fullWidth className="col-span-6">
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
                  active={orderBy === "update_date"}
                  direction={order}
                  onClick={() => handleRequestSort("update_date")}
                >
                  Fecha de Actualización
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
                  active={orderBy === "cutoff_date"}
                  direction={order}
                  onClick={() => handleRequestSort("cutoff_date")}
                >
                  Fecha de Corte
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
                  active={orderBy === "debt_amount"}
                  direction={order}
                  onClick={() => handleRequestSort("debt_amount")}
                >
                  Monto de Deuda
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sorteddebit
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((debit, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {debit.update_date
                      ? new Date(debit.update_date)
                          .toLocaleDateString()
                          .toUpperCase()
                      : "NO DISPONIBLE"}
                  </TableCell>
                  <TableCell>
                    {debit.cutoff_date
                      ? new Date(debit.cutoff_date)
                          .toLocaleDateString()
                          .toUpperCase()
                      : "NO DISPONIBLE"}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    }).format(debit.debt_amount)}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sorteddebit.length}
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

export default Debit;
