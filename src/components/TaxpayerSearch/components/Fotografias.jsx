//import './styles/Fotografias.css'
import { Typography, Paper, Button, Box } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./styles/styles";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import classNames from "./styles/classNames";
import VisualizadorFotografias from "./VisualizadorFotografias";
import Fotografia from "./Fotografia";
import SubirArchivo from "./generic/SubirArchivo";
import UseClick from "./UseClick";
import BackupIcon from "@mui/icons-material/Backup";
import handleUploadToAWSS3 from "../../../components/TaxpayerSearch/components/utils/handleUploadToAWSS3";
import useStore from "./store/useStore.";
import FormularioSubirImagen from "./FormularioSubirImagen/FormularioSubirImagen";
import usePDF from "./store/usePDF";

// const handleUplodadFiles = async (callback) => {
//   const file = files[0];
//   handleUploadToAWSS3(({url}))
//   const { url } = await handleUploadToAWSS3({ file });
//   if (callback && typeof (callback) === 'function')
//     callback({ url });

//   return { url };
// };

/* 
Apoyame con un componente modal que capsule el slider de imagenes junto la imagen seleccionada usa para cada elemento className={clasNames.[nombre]} , los estilos reales seran en css usando BEM empezando por visualizar_imagen, el requerimiento es que se solo se cree un tsx y un css

   import './styles/Fotografias.css'
// console.log({ files });

/* 
Apoyame con un formulario con react-hook-form usaa tsx, material ui , con los siguioentes campos:
Cuenta
Clave Catastral
Propietario
Tipo de Servicio
Tipo de Tarifa
Giro
Serie del medidor
Servicio
*/
const Arrastrar = () => {
  return (
    <div className="when_files_dragging">
      <p>Suelta aqui los archivos</p>
      <UseClick>
        <BackupIcon sx={{ fontSize: 45 }} />
      </UseClick>
    </div>
  );
};
const GaleriaFotografias = ({
  fotos,
  isDragging = false,
  setHandleUploadFiles,
}) => {
  // const { getBlob } = usePDF();
  const { setFotosFuncion } = useStore();

  const handleClick = (e) => {
    e.stopPropagation();
  };
  const [isVisibleViewImages, setisVisibleViewImages] = useState(false);
  const [indexCurrentImage, setIndexCurrentImage] = useState(0);
  const [urlsImages, setUrlsImages] = useState([]);

  useEffect(() => {
    console.log({ fotos });
    const images = fotos.map(({ imageUrl }) => imageUrl);
    if (images.length > 0) setUrlsImages(images);
    console.log({ UrlsImages: images });
    // console.log({ ima ges });
  }, [fotos]);

  const handleUplodadFiles = async ({ file, date, description }) => {
    const foto = await handleUploadToAWSS3({ file, date, description });
    console.log({
      handleUplodadFiles: true,
      foto,
    });
    setFotosFuncion((fotos) => [
      ...fotos,
      {
        ...foto,
        isActive: true,
      },
    ]);
    setUrlsImages((urls) => [...urls, foto.url]);
  };

  // () => {
  //   handleUploadToAWSS3(async ({ url }) => {
  //     setUrlsImages([...images, url])
  //   })
  // };
  useEffect(() => {
    if (setHandleUploadFiles)
      setHandleUploadFiles(() => () => (ARCHIVOS) => {
        console.log({ ARCHIVOS });
      });
  }, []);
  return (
    <div className={`fotografias`} onClick={handleClick}>
      {isDragging && <Arrastrar />}
      <article className={classNames.article}>
        <header className={classNames.articleHeader}>
          <PhotoCameraIcon sx={styles.iconSubtitle} />
          <Typography variant="h5">Fotografias Tomadas</Typography>
        </header>
      </article>
      <Paper className={classNames.paper}>
        <VisualizadorFotografias
          images={urlsImages}
          visible={isVisibleViewImages}
          setVisible={setisVisibleViewImages}
          activeIndex={indexCurrentImage}
        />
        <div className={classNames.photos}>
          {fotos?.map((foto, index) => (
            <Fotografia
              key={foto.url + index}
              index={index}
              image={foto}
              onClick={() => {
                setisVisibleViewImages(true);
                setIndexCurrentImage(index);
              }}
            />
          ))}
        </div>
        <Box
          gap={2}
          display={"flex"}
          flexWrap={"wrap"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <FormularioSubirImagen
            onOpenDialog={(onOpenDialog) => (
              <Box display={"flex"} gap={2}>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDialog();
                  }}
                  type="button"
                  variant="contained"
                >
                  Subir imagenes
                </Button>

                <Button variant="contained">Aplicar</Button>
              </Box>
            )}
            onSumit={(response) => {
              if (!(response && response?.file)) return;
              // console.log(response);
              handleUplodadFiles(response);
              // getBlob()
            }}
          />
          {/* <SubirArchivo onAcceptedFiles={handleUplodadFiles}>
            <Button sx={{ marginTop: "20px" }} variant="contained">
              Subir imagenes
            </Button>
          </SubirArchivo> */}
          {/* <Button sx={{ marginTop: "20px" }} variant="contained">
            Aplicar
          </Button> */}
        </Box>
      </Paper>
    </div>
  );
};

const Fotografias = ({ fotos }) => {
  const [handleUploadFiles, setHandleUploadFiles] = useState(() => {});

  return (
    <SubirArchivo
      className={classNames.containerArticle}
      onAcceptedFiles={handleUploadFiles}
      NodeOnDrag={
        <GaleriaFotografias
          key="fotos-tomadas"
          fotos={fotos}
          isDragging={true}
        />
      }
    >
      <GaleriaFotografias
        key="fotos-tomadas"
        fotos={fotos}
        setHandleUploadFiles={setHandleUploadFiles}
      />
    </SubirArchivo>
  );
};

export default Fotografias;
