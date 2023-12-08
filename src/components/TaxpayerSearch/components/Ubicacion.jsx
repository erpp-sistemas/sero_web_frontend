//import './styles/Ubicacion.css'
import { Typography, Paper } from "@mui/material";
import styles from "./styles/styles";
import RoomIcon from "@mui/icons-material/Room";
import classNames from "./styles/classNames";
import GoogleMaps from "./maps/GoogleMaps";
import { useEffect } from "react";


const Ubicacion = ({ coordenadas }) => {
  const [longitude, latitude] = coordenadas;
  useEffect(() => {
    console.log({ coordenadas })
  }, [coordenadas])
  return (
    <div
      className={classNames.containerArticle}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <article className={classNames.article}>
        <header className={classNames.articleHeader}>
          <RoomIcon sx={styles.iconSubtitle} />
          <Typography variant="h5">Ubicacion</Typography>
        </header>
      </article>
      <Paper className={classNames.paper} style={{ flexGrow: 1 }}>
        {((coordenadas || latitude) ?
          <GoogleMaps lng={longitude} lat={latitude} />
          : <p>Esta cuenta no tiene coordenadas o no son validas</p>
        )}
      </Paper>
    </div>
  );
};

export default Ubicacion;
