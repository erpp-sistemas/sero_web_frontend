//import './styles/DatosContribuyente.css'
import { Typography, Paper } from "@mui/material";
import styles from "./styles/styles";
import PersonIcon from "@mui/icons-material/Person";
import ListDictionary from "./ListDictionary";
import classNames from "./styles/classNames";

export const DatosContribuyenteNodos = ({ contribuyente }) => {

  console.log(contribuyente);
  // useEffect(() => {
  //   console.log(contribuyente);
  // }, []);
  return (
    <>
      <article className={classNames.article}>
        <header className={classNames.articleHeader}>
          <PersonIcon sx={styles.iconSubtitle} />
          <Typography variant="h5">Datos del contribuyente</Typography>
        </header>
      </article>
      <Paper className={classNames.paper}>
        <ListDictionary list={contribuyente} />
      </Paper>
      {/* <FormularioDatosContribuyente /> */}
    </>
  );
};

const DatosContribuyente = (params) => {
  return (
    <div className={classNames.containerArticle}>
      <DatosContribuyenteNodos {...params} />
    </div>
  );
};

export default DatosContribuyente;
