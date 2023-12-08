import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { dateConverter } from "../helpers/dateConverter";


const TableHeader = ({ cellsText: cellsText }) => (
  <TableHead>
    <TableRow>
      {cellsText.map((text) => (
        <TableCell key={text}>{text}</TableCell>
      ))}
    </TableRow>
  </TableHead>
);

const DataRow = ({ item }) => (
  <TableRow>
    
    <TableCell>{ dateConverter(item.fechaDePago) || "-" }</TableCell>
    <TableCell>{item.descripcion}</TableCell>
    <TableCell>{item.montoPagado}</TableCell>
     <TableCell>{item.referencia || "-"}</TableCell>
  </TableRow>
  
);

const DataTable = ({ filas: filas }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHeader
        cellsText={["Fecha de Pago", "Descripción", "Monto Pagado", "Referencia"]}
      />
      <TableBody>
        {filas.map((item, index) => (
          <DataRow key={index} item={item} />
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
const Pagos = DataTable;
export default Pagos;
