import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import Adeudos from "../Adeudos";
import classNames from "../styles/classNames";

const AdeudosSection = ({ adeudos }) => {
  console.log(adeudos);
  return (
  
  <Box className={"nav-busqueda-contribuyente"}>
    <Paper
      sx={{ display: "flex", flexDirection: "column" }}
      className={classNames.articleHeader}
    >
      <Typography variant="h5" style={{ width: "100%" }}>
        Adeudos
      </Typography>
      <Adeudos filas={adeudos} />
    </Paper>
  </Box>
)};

export default AdeudosSection;
