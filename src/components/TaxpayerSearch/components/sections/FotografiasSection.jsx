import React from "react";
import { Paper, Box } from "@mui/material";
import Fotografias from "../Fotografias";
import classNames from "../styles/classNames";
import useStore from "../store/useStore.";

const FotografiasSection = () => {
  
  const store = useStore()
  const fotos = store.fotos
  return (

  <Box className={"nav-busqueda-contribuyente"}>
    <Paper className={classNames.articleHeader}>
      <Fotografias fotos={fotos} />
    </Paper>
  </Box>
)};
export default FotografiasSection;
