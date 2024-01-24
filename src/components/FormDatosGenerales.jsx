import React, { useEffect, useState } from "react";

import { tokens } from "../theme";

// helpers
import functionsCustom from "../helpers";

// material ui
import {
  Input,
  InputAdornment,
  TextField,
  Box,
  useTheme,
  MenuItem,
  Button,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// iconos
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import LockResetIcon from "@mui/icons-material/LockReset";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import PermPhoneMsgIcon from "@mui/icons-material/PermPhoneMsg";
import { uploadToS3 } from "../services/s3.service";
import { getAllRoles } from "../api/rol";

const FormDatosGenerales = ({ chageDatosGenerales, datosGenerales }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [selectedImage, setSelectedImage] = useState();

  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [fotoUsuario, setFotoUsuario] = useState("");
  const [usuarioAcceso, setUsuarioAcceso] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = React.useState([]);

  /**
   * Función asíncrona para obtener los datos de los roles y actualizar el estado 'rows'.
   *
   * @async
   * @private
   * @function
   * @throws {Error} Error al intentar obtener los datos de los roles.
   */
  const fetchRoles = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAllRoles();

      // Agrega el campo 'id_rol' a cada fila usando el índice como valor único si no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_rol || index.toString(),
      }));

      setRoles(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  React.useEffect(() => {
    fetchRoles();
  }, []);

  const imageChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
      const file = e.target.files[0];
      //console.log(e.target.files)

      try {
        const fileUrl = await uploadToS3(file);
        console.log("URL del archivo subido:", fileUrl);

        setFotoUsuario(fileUrl);

        chageDatosGenerales({
          ...datosGenerales,
          foto: fileUrl, // Utiliza 'fileUrl' directamente aquí
        });
      } catch (error) {
        console.error("Error al subir archivo:", error.message);
      }
    }
  };

  const changeControl = (e, campo) => {
    let fecha_format;

    if (campo === "fechaNacimiento") {
      fecha_format = functionsCustom.getFechaFormat(e);
    }

    if (campo === "nombre") {
      let user = e.target.value.split(" ");
      let name = user[0];
      setNombre(name);
    }

    if (campo === "apellidoPaterno") {
      let user = e.target.value.split(" ");
      let apellido = user[0];
      setApellidoPaterno(apellido);
    }

    if (campo === "password") {
      let caracteres = functionsCustom.generarAleatorios(7);
      let pass = `${nombre.split(" ")[0]}${caracteres}`;
      setPassword(pass);
    }

    let usernameCreated = `${nombre}.${apellidoPaterno}@ser0.mx`;
    setUsuarioAcceso(usernameCreated.toLocaleLowerCase());

    chageDatosGenerales({
      ...datosGenerales,
      usuarioAcceso: usuarioAcceso,
      password: password,
      foto: fotoUsuario,
      [campo]: campo !== "fechaNacimiento" ? e.target.value : fecha_format,
    });
  };

  const handleSwitchSeroWeb = (e) => {
    chageDatosGenerales({
      ...datosGenerales,
      accesoSeroWeb: e.target.checked,
    });
  };

  const handleSwitchSeroMovil = (e) => {
    chageDatosGenerales({
      ...datosGenerales,
      accesoSeroMovil: e.target.checked,
    });
  };
  const handleSwitchWhatsApp = (e) => {
    chageDatosGenerales({
      ...datosGenerales,
      credencialesWhatsApp: e.target.checked,
    });
  };

  const handleSwitchCorreo = (e) => {
    chageDatosGenerales({
      ...datosGenerales,
      credencialesCorreo: e.target.checked,
    });
  };

  return (
    <>
      <Box
        m="20px 0"
        display="flex"
        justifyContent="space-evenly"
        flexWrap="wrap"
        gap="20px"
        sx={{ backgroundColor: colors.primary[400], width: "100%" }}
        padding="15px 10px"
        borderRadius="10px"
      >
        <TextField
          id="input-with-icon-textfield"
          label="Nombre(S)"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
          variant="filled"
          color="success"
          sx={{ width: "31%" }}
          onChange={(e) => changeControl(e, "nombre")}
          value={datosGenerales?.nombre}
        />

        <TextField
          id="input-with-icon-textfield"
          label="Apellido paterno"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
          variant="filled"
          color="success"
          sx={{ width: "31%" }}
          onChange={(e) => changeControl(e, "apellidoPaterno")}
          value={datosGenerales?.apellidoPaterno}
        />

        <TextField
          id="input-with-icon-textfield"
          label="Apellido materno"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle />
              </InputAdornment>
            ),
          }}
          variant="filled"
          color="success"
          sx={{ width: "31%" }}
          onChange={(e) => changeControl(e, "apellidoMaterno")}
          value={datosGenerales?.apellidoMaterno}
        />

        <TextField
          id="input-with-icon-textfield"
          label="Telefono personal"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocalPhoneIcon />
              </InputAdornment>
            ),
          }}
          variant="filled"
          color="success"
          sx={{ width: "31%" }}
          onChange={(e) => changeControl(e, "telefonoPersonal")}
          value={datosGenerales?.telefonoPersonal}
        />

        <TextField
          id="input-with-icon-textfield"
          label="Telefono empresa"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PermPhoneMsgIcon />
              </InputAdornment>
            ),
          }}
          variant="filled"
          color="success"
          sx={{ width: "31%" }}
          onChange={(e) => changeControl(e, "telefonoEmpresa")}
          value={datosGenerales?.telefonoEmpresa}
        />

        <TextField
          id="filled-select-currency"
          select
          label="Sexo"
          variant="filled"
          sx={{ width: "45%" }}
          defaultValue=""
          value={datosGenerales?.sexo}
          onChange={(e) => changeControl(e, "sexo")}
        >
          <MenuItem key="1" value="1">
            {" "}
            Masculino{" "}
          </MenuItem>
          <MenuItem key="2" value="2">
            {" "}
            Femenino{" "}
          </MenuItem>
          <MenuItem key="3" value="3">
            {" "}
            No sabe{" "}
          </MenuItem>
        </TextField>

        <DatePicker
          sx={{ width: "45%", backgroundColor: colors.primary[1000] }}
          onChange={(e) => changeControl(e, "fechaNacimiento")}
          views={["year", "month", "day"]}
          format="DD-MM-YYYY"
          disableFuture
          label="Fecha de nacimiento"
          openTo="year"
         
        />

        <Box
          display="flex"
          justifyContent="space-evenly"
          alignItems="center"
          sx={{ width: "100%" }}
        >
          <Box sx={{ textAlign: "center", width: "50%" }}>
            {/* <InputLabel id="demo-simple-select-standard-label">Foto</InputLabel> */}
            <label for="file-input">
              <AddAPhotoIcon
                sx={{ color: colors.blueAccent[400], fontSize: "100px" }}
              />
            </label>
            {selectedImage && (
              <Typography
                variant="caption"
                sx={{
                  display: "inline-block",
                  fontSize: "14px",
                  color: colors.greenAccent[400],
                }}
              >
                {selectedImage.name}
              </Typography>
            )}
            <Input
              id="file-input"
              type="file"
              sx={{ display: "none" }}
              onChange={imageChange}
            />
          </Box>

          {selectedImage && (
            <Box sx={{ width: "30%" }}>
              <img
                src={URL.createObjectURL(selectedImage)}
                //style={styles.image}
                alt="Thumb"
                style={{
                  width: "150px",
                  height: "170px",
                  margin: "0 auto",
                  borderRadius: "10px",
                }}
              />
            </Box>
          )}
        </Box>
      </Box>

      <Box
        m="20px 0"
        display="flex"
        justifyContent="space-evenly"
        flexWrap="wrap"
        gap="20px"
        sx={{ backgroundColor: colors.primary[400], width: "100%" }}
        padding="15px 10px"
        borderRadius="10px"
      >
        <TextField
          id="input-with-icon-textfield"
          label="Usuario de acceso"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AssignmentIndIcon />
              </InputAdornment>
            ),
          }}
          variant="filled"
          color="success"
          sx={{ width: "31%" }}
          value={datosGenerales.usuarioAcceso}
        />

        <Box sx={{ width: "31%" }}>
          <TextField
            id="input-with-icon-textfield"
            label="Password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
            variant="filled"
            color="success"
            sx={{ width: "75%" }}
            value={datosGenerales.password}
          />
          <Button
            variant="outline"
            size="small"
            sx={{
              position: "relative",
              left: "2px",
              top: "2px",
              height: "50px",
              width: "10%",
              backgroundColor: colors.blueAccent[400],
              color: colors.grey[200],
            }}
            onClick={() => changeControl("", "password")}
          >
            <LockResetIcon sx={{ fontSize: "36px", color: colors.grey[100] }} />
          </Button>
        </Box>

        <TextField
          id="filled-select-currency"
          select
          label="Rol"
          variant="filled"
          sx={{ width: "31%" }}
          onChange={(e) => changeControl(e, "rol")}
          defaultValue=""
          value={datosGenerales?.rol}
        >
          {/*   <MenuItem key={1} value="Administrador">
            {" "}
            Administrador{" "}
          </MenuItem>
          <MenuItem key={2} value="Directivo">
            {" "}
            Directivo{" "}
          </MenuItem>
          <MenuItem key={3} value="Gerente">
            {" "}
            Gerente{" "}
          </MenuItem>
          <MenuItem key={4} value="Coordinador">
            {" "}
            Coordinador{" "}
          </MenuItem>
          <MenuItem key={5} value="Gestor">
            {" "}
            Gestor{" "}
          </MenuItem> */}
          {roles.map((role) => {
            return (
              <MenuItem key={role.id} value={role.id}>
                {role.nombre}
              </MenuItem>
            );
          })}
        </TextField>

        <FormGroup>
          <Grid container spacing={2}>

         <Grid item xs={6}>
          <Box sx={{display:"flex",flexDirection:"column",width:"200px"}}>
          <FormControlLabel
            control={
              <Switch defaultChecked color="info" sx={{ width: "70px" }} />
            }
            label="Acceso ser0 web"
            onChange={handleSwitchSeroWeb}
          />
          <FormControlLabel
            control={<Switch color="success" sx={{ width: "70px" }} />}
            label="Acceso ser0 móvil"
            onChange={handleSwitchSeroMovil}
          />
          </Box>
          </Grid>
          <Grid item xs={6}>
          <Box sx={{display:"flex",flexDirection:"column",width:"300px"}}>
          <FormControlLabel
            control={
              <Switch  color="info" sx={{ width: "70px" }} />
            }
            label="Enviar acceso por WhatsApp"
            onChange={handleSwitchWhatsApp}
          />
          <FormControlLabel
            control={<Switch color="success" sx={{ width: "70px" }} />}
            label="Enviar acceso por Correo"
            onChange={handleSwitchCorreo}
          />
          </Box>
          </Grid>
           </Grid>
        </FormGroup>
      </Box>
    </>
  );
};
export default FormDatosGenerales;
