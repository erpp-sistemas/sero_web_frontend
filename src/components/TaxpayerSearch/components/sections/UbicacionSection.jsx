import React from "react";
import { Paper } from "@mui/material";
import Ubicacion from "../Ubicacion";

const UbicacionSection = ({ coordenadas }) => (
  <Paper className="nav-busqueda-contribuyente">
    <Ubicacion coordenadas={coordenadas} />
  </Paper>
);
export default UbicacionSection;
