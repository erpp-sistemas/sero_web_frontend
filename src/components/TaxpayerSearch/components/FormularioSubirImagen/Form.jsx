import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import InputAdornment from "@mui/material/InputAdornment";
import {
  Lock as LockIcon,
  CloudUpload,
  PhotoCamera,
} from "@mui/icons-material";
import UploadSection from "./UploadSection";
import "./styles/Form.css";
import SubirArchivo from "../generic/SubirArchivo";
import { Typography } from "antd";
import Viewer from "react-viewer";
import GenericSelect from "../generic/GenericSelect";
import GenericSwitch from "../generic/GenericSwitch";
import useConfig from "./useConfig";
// const tiposDeFoto = ["Retrato", "Paisaje", "Macro", "Otros"];
const gestores = [
  "Victor Manuel Hernandez Vargaz",
  "Oscar Alejadnro Vazquez Galvan",
];
const tiposDeFoto = ["Regularización predio", "Regularización agua"];
const tareas = ["Primera carta", "Segunda carta", "Tercera carta"];

const classNamesUpload = {
  principal: "FormUplodadImage",
  whenisDragging: "WhenFormUploadImageDragging",
  drag: "FormUploadImageDragging",
};
const PreviewImage = ({ image }) => {
  const [viewerVisible, setViewerVisible] = useState(false);
  if (!image) return;
  return (
    <>
      <Typography
        style={{ display: "flex", gap: 20, textAlign: "left", width: "100%" }}
      >
        <PhotoCamera fontSize="medium" />
        Previsualizacion
      </Typography>

      <div>
        <Viewer
          className="react-viewer"
          visible={true}
          onClose={() => {
            setViewerVisible(false);
          }}
          images={[{ src: image, alt: "" }]}
          activeIndex={0}
        />
      </div>
      <img
        src={image && URL.createObjectURL(image)}
        alt="Imagen"
        style={{ maxHeight: 200 }}
        onClick={(e) => {
          e.stopPropagation();
          alert("ok");
          setViewerVisible(true);
        }}
      />
    </>
  );
};

const UploadImage = ({ image, isDragging }) => {
  return (
    /* Apoyame con un label  */
    // <div>Form</div>
    <div className={classNamesUpload.principal}>
      <Box
        className={`${classNamesUpload.drag} ${
          isDragging ? classNamesUpload.whenisDragging : ""
        }`}
      >
        <CloudUpload style={{ fontSize: 45 }} />
        <Typography style={{ color: "white" }}>
          ¡Suelta para subir las imágenes!
        </Typography>
      </Box>
      <PreviewImage image={image} />
    </div>
  );
};

function SelectControl({ name, label, control, options }) {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Select {...field}>
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        )}
      />
    </FormControl>
  );
}

function SwitchControl({
  name,
  label,
  control,
  disabled,
  defaultValue = false,
}) {
  return (
    <Box width={"100%"} display="flex" justifyContent="space-between">
      <FormControlLabel
        control={
          <Controller
            disabled={disabled}
            name={name}
            control={control}
            defaultValue={defaultValue} //Establecer el valor predeterminado
            render={({ field }) => (
              <Switch {...field} defaultChecked={true} color="primary" />
            )}
          />
        }
        label={label}
      />
      {disabled && (
        <LockIcon fontSize="small" sx={{ marginRight: 2, color: "#cccccc" }} />
      )}
    </Box>
  );
}

// import { Box, Typography, Button, Controller } from '@mui/material';

function ImageUpload({ onImageSelect, control, name, setHandleUploadFile }) {
  const inputRef = useRef();
  const [isRenderer, setIsRenderer] = useState(false);
  const handleShowDialogUploadImage = () => inputRef?.current.click();

  useEffect(() => {
    setIsRenderer(true);
    if (isRenderer) return;
    setHandleUploadFile(() => handleShowDialogUploadImage);
  }, []);
  return (
    <Box>
      <Controller
        name={name}
        control={control}
        defaultValue={null} // Valor inicial
        render={({ field }) => (
          <>
            {field.value ? (
              <Box position="absolute" top={55} left={570}>
                <img
                  src={URL.createObjectURL(field.value)}
                  alt="Previsualización de la imagen"
                  width="200"
                />
                <Typography>{field.value.name}</Typography>
              </Box>
            ) : (
              <Typography>No se ha seleccionado ninguna imagen.</Typography>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              id={name}
              style={{ display: "none" }}
              onChange={(event) => {
                field.onChange(event.target.files[0]);
                if (onImageSelect) {
                  onImageSelect(event.target.files[0]);
                }
              }}
            />
            <label htmlFor="image-upload-input">
              {/* <Button
                onClick={handleShowDialogUploadImage}
                variant="contained"
                component="span"
              >
                Subir imagen
              </Button> */}
            </label>
          </>
        )}
      />
    </Box>
  );
}

// export default ImageUpload;

function Form({ onSubmit, form }) {
  const my = 2;
  const width = "50%";
  const { handleSubmit, control, reset } = form;
  const [user, setUser] = useState("Usuario 1");
  const [image, setimage] = useState();
  const [handleUploadFile, setHandleUploadFile] = useState();
  // const [isClosedAutomatically, setIsClosedAutomatically] = useState(true);
  const { setIsClosedAutomatically, config } = useConfig();
  // useEffect(() => {
  //   console.log({ isClosedAutomatically });
  // }, [isClosedAutomatically]);
  const handleUplodadFiles = (images) => {
    // console.log(`{ images }`);
    console.log(images);
    setimage(images[0]);
    // setimage()
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="flex" flexWrap={"wrap"} position={"relative"}>
        <Box width={width} my={my} flexGrow={1}>
          <SwitchControl
            control={control}
            label={"Esta activo"}
            name={"activo"}
            disabled={true}
            defaultValue={true}
          />
        </Box>

        <Box width={width} my={my} flexGrow={1}>
          <Controller
            name="usuario"
            control={control}
            defaultValue={user}
            render={({ field }) => (
              <TextField
                {...field}
                value={user}
                label="Usuario"
                fullWidth
                // disabled
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <LockIcon /> {/* Icono de candado */}
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Box>

        <Box width={width} my={my} flexGrow={1}>
          <Controller
            name="fecha"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Fecha Gestion"
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Box>
        <Box width={width} my={my} flexGrow={1}>
          <SelectControl
            control={control}
            options={tiposDeFoto}
            label="Tipo de foto"
            name="tipoFoto"
          />
        </Box>
        <Box width={width} my={my} flexGrow={1}>
          <SelectControl
            control={control}
            options={gestores}
            label="Gestor"
            name="gestor"
          />
        </Box>
        <Box width={width} my={my} flexGrow={1}>
          <SelectControl
            control={control}
            options={tareas}
            label="Tarea"
            name="tarea"
          />
        </Box>
        <ImageUpload
          setHandleUploadFile={setHandleUploadFile}
          name={"file"}
          control={control}
          onImageSelect={(E) => console.log({ E })}
        />

        <Box
          width={"100%"}
          my={my}
          flexGrow={1}
          display={"flex"}
          justifyContent={"end"}
          gap={2}
        >
          <GenericSwitch
            checked={config.isClosedAutomatically}
            label={"Cerrar al enviar"}
            onChange={setIsClosedAutomatically}
          />

          <Button
            onClick={handleUploadFile && handleUploadFile}
            variant="contained"
          >
            Subir imagen
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Enviar
          </Button>
        </Box>
        {/* <UploadSection /> */}
      </Box>
    </form>
  );
}

export default Form;
