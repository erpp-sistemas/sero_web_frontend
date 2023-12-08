//import './styles/Domicilio.css'
import { Typography, Paper } from "@mui/material";
import ListDictionary from "./ListDictionary";
import styles from "./styles/styles";
import ApartmentIcon from "@mui/icons-material/Apartment";
import classNames from "./styles/classNames";



export const DomicilioNodos = ({ domicilio }) => {
  return (
    <>
      <article className={classNames.article}>
        <header className={classNames.articleHeader}>
          <ApartmentIcon sx={styles.iconSubtitle} />
          <Typography variant="h5">Domicilio</Typography>
        </header>
      </article>
      <Paper className={classNames.paper}>
        {/* {direcciones.map((direccion) => (
          <ListDictionary list={direccion[0]} />
        ))} */}
        <ListDictionary list={domicilio} />
      </Paper>
    </>
  );
};

const Domicilio = (params) => {
  return (
    <div className={classNames.containerArticle}>
      <DomicilioNodos {...params} />
    </div>
  );
};

export default Domicilio;
