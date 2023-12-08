//import './styles/Fotografia.css'
import { useState } from "react";
import React from "react";
import "./styles/Fotografia.css";
import {
  Card,
  CardContent,
  IconButton,
  Checkbox,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
  Paper,
  Box,
} from "@mui/material";

import HighlightOffIcon from "@mui/icons-material/HighlightOff"; // Icono de desactivación
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Icono de activación
import useStore from "./store/useStore.";
import replaceItemAtIndex from "./utils/replaceItemAtIndex";
import { dateConverter } from "../helpers/dateConverter";

const classNames = {
  parentContainer: "fotografias-tomadas",
  container: "fotografias-tomada",
  containerDisabled: "fotografias-tomada",
  image: "imagen",
  icons: "icons",
  iconLike: "icon like",
  iconDislike: "icon dislike",
};

const Fotografia = ({ image, onClick, index }) => {
  // const [isEnabled, setIsEnabled] = useState(true);
  // const handleClick = () => {};
  const { setFotosFuncion } = useStore();
  const [isEnabled, setIsEnabled] = useState(image.isActive);
  const handleClickImage = (e) => {
    if (onClick) onClick(e);
  };
  const handleClick = () => {
    const isActive = !isEnabled;
    setIsEnabled(isActive);
    setFotosFuncion((fotos) => {
      const foto = {
        ...fotos[index],
        isActive,
      };
      console.log({ nuevafoto: foto });
      // fotos[index] = foto;
      return replaceItemAtIndex(fotos, foto, index);
    });
  };
  /* 
  rediseñemos el microcomponente ,
  el parte superior estara la imagen 
  y la parte inferior una carda para fecha y descripcion
  ademas de dos botones de 50% width , de desactivar/activar,
  las imagenes desactivadas tendran un icono de mui que lo represente
  
  */
  return (
    <ImageListItem className={classNames.container}>
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          height: 600,
          justifyContent: "flex-end",
        }}
      >
        <Box m={1}>
          <img
            onClick={handleClickImage}
            className={classNames.image}
            src={image.imageUrl}
            alt={image. imageType || "-"}
          
          />
        </Box>
        <CardContent>
          <div style={{display:"flex",flexDirection:"row"}}>
            <Typography
               variant="caption" display="block" gutterBottom
            >
              Tipo de Imagen :
            </Typography>
            <Typography   variant="caption" display="block" gutterBottom>
              {image.imageType || "-"}
            </Typography>
          </div>
          <div  style={{display:"flex",flexDirection:"row"}}>
            <Typography
              variant="caption" display="block" gutterBottom
            >
              Fecha de captura:
            </Typography>
            <Typography  variant="caption" display="block" gutterBottom>
              { dateConverter(image.dateCapture)  || "-"}
            </Typography>
          </div>
          <div  style={{display:"flex",flexDirection:"row"}}>
            <Typography
              variant="caption" display="block" gutterBottom
            >
              Tarea realizada:
            </Typography>
            <Typography  variant="caption" display="block" gutterBottom>
              {image.taskDone || "-"}
            </Typography>
          </div>
          <div  style={{display:"flex",flexDirection:"row"}}>
            <Typography
             variant="caption" display="block" gutterBottom
            >
              Persona quien captura:
            </Typography>
            <Typography  variant="caption" display="block" gutterBottom>
              {image.personWhoCapture || "-"}
            </Typography>
          </div>
          <div  style={{display:"flex",flexDirection:"row"}}>
            <Typography
              variant="caption" display="block" gutterBottom
            >
              Fecha de sincronizaciòn:
            </Typography>
            <Typography  variant="caption" display="block" gutterBottom>
              {image.synchronizationDate || "-"}
            </Typography>
          </div>
        </CardContent>
        <Box
          display={"flex"}
          justifyContent={"center"}
          gap={0}
          width={"100%"}
          mb={1}
        >
          <IconButton onClick={handleClick} style={{ width: "25%" }}>
            {isEnabled ? <CheckCircleIcon /> : <HighlightOffIcon />}
          </IconButton>
          <IconButton
            size="small"
            onClick={handleClick}
            style={{ width: "50%" }}
          >
            {isEnabled ? "Desactivar" : "Activar"}
          </IconButton>
        </Box>
      </Card>
    </ImageListItem>
  );
};
export default Fotografia;
