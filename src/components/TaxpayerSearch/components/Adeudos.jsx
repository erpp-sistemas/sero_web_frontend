//import './styles/Adeudo.css'
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import useStore from "./store/useStore.";
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

const DataRow = ({ item }) => {
 
 

  
  return (
  <TableRow>
    <TableCell>{item.debtAmount}</TableCell>
    <TableCell>{item.lastPaymentDate}</TableCell>
    <TableCell>{dateConverter(item.updateDate) }</TableCell>
    <TableCell>{dateConverter(item.cutoffDate) }</TableCell>
    <TableCell>{item.lasTwoMonthPayment}</TableCell>
  </TableRow>
)}

const DataTable = ({ filas }) => {
  const store = useStore();
  return (
  <TableContainer component={Paper}>
    <Table>
      <TableHeader
        cellsText={[
          "Monto de deuda",
          "Fecha del último pago",
          "Fecha de actualización",
          "Fecha de corte o fecha límite",
          "Pago de los últimos dos meses",
        ]}
      />
      <TableBody>
       
        {store.adeudos?.map((item, index) => {
          console.log(item);
          return (
          <DataRow key={index} item={item} />
        )})}
      </TableBody>
    </Table>
  </TableContainer>
)};
const Adeudos = DataTable;

export default Adeudos;
