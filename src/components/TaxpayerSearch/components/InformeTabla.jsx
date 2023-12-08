//import './styles/InformeTabla.css'
import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { FC } from "react";
import classNames from "./styles/classNames";



const Tabla = ({ adeudo }) => {
  return (
    <Paper>
      <Typography variant="h6">Tabla de Datos</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fecha de Actualización</TableCell>
            <TableCell>Fecha de Corte</TableCell>
            <TableCell>Monto de Adeudo</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {adeudo?.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.fechaActualizacion}</TableCell>
              <TableCell>{row.fechaCorte}</TableCell>
              <TableCell>{row.montoAdeudo}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

const InformeTabla = ({ adeudo }) => {
  // const handleClick = () => {};
  return (
    <div className={classNames.containerArticle}>
      <article className={classNames.article}>
        <header className={classNames.articleHeader}>
          {/* <Icon sx={styles.iconSubtitle} /> */}
          <Typography variant="h5">Adeudo</Typography>
        </header>
      </article>
      <Paper className={classNames.paper}>
        <Tabla adeudo={adeudo} />
      </Paper>
    </div>
  );
};

export default InformeTabla;
