import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import Pagos from "../Pagos";
import classNames from "../styles/classNames";


const PagosSection = ({ pagos }) => (
  <Box className={"nav-busqueda-contribuyente"}>
    <Paper
      sx={{ display: "flex", flexDirection: "column" }}
      className={classNames.articleHeader}
    >
      <Typography variant="h5" style={{ width: "100%" }}>
        Pagos
      </Typography>
      <Pagos filas={pagos} />
      {/* <Typography variant="h5" style={{ width: "100%" }}>
        Adeudos
      </Typography>
      <Adeudos filas={adeudo} /> */}
    </Paper>
  </Box>
);
export default PagosSection;
