import React from "react";
import { Paper } from "@mui/material";
import DatosDomicilio from "../DatosDomicilio";
// Componentes individuales para cada sección

const ContribuyenteSection = ({
  contribuyente,
  domicilio,
  rol
}) => (
  <div>
    <Paper>
      <DatosDomicilio
        {...{
          contribuyente,
          domicilio,
          rol
        }}
      />
    </Paper>
  </div>
);

export default ContribuyenteSection;
