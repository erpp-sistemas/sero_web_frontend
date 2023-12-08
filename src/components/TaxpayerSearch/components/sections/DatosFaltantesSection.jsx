import React, { useEffect } from "react";
import { Paper, Box } from "@mui/material";
import classNames from "../styles/classNames";
import FormularioDatosFaltantes from "../FormularioDatosFaltantes";

const DatosFaltantesSection = ({ campos, setNuevosCampos }) => {
  useEffect(() => {
    console.log({ campos })
  }, [])
  return (
    <Box className={"nav-busqueda-contribuyente"}>
      <Paper className={classNames.articleHeader}>
        <FormularioDatosFaltantes
          setNuevosCampos={setNuevosCampos}
          campos={
            campos?.map(campo => ({
              name: campo,
              label: campo.replace(/[-_]/g, ' '),
              type: "text"
            }))} />
      </Paper>
    </Box>
  )
};
export default DatosFaltantesSection;
