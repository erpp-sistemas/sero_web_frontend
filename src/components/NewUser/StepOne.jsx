import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Avatar from "@mui/material/Avatar";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Divider,
  InputAdornment,
  MenuItem,
  Alert,
  Collapse,
  useTheme,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import FamilyIcon from "@mui/icons-material/FamilyRestroom";
import WcIcon from "@mui/icons-material/Wc";
import EventIcon from "@mui/icons-material/Event";
import { getAllRoles } from "../../api/rol.js";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import PhoneInTalkIcon from "@mui/icons-material/PhoneInTalk";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ComputerIcon from "@mui/icons-material/Computer";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";
import KeyboardTabIcon from "@mui/icons-material/KeyboardTab";
import { tokens } from "../../theme";

function StepOne({ onNext, onFormData, resetTrigger }) {
  const titleStyle = {
    color: "#5EBFFF",
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    name: "",
    first_last_name: "",
    second_last_name: "",
    birthdate: "",
    sex_id: "1",
    user_name: "",
    password: "",
    password_hash: "",
    profile_id: "",
    active_web_access: true,
    active_app_movil_access: true,
    personal_phone: "",
    work_phone: "",
    url_image: "",
  });

  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const firstSpaceIndex = formData.name.indexOf(" ");
      const firstWordFirstName =
        firstSpaceIndex === -1
          ? formData.name
          : formData.name.substring(0, firstSpaceIndex);
      const firstSpaceIndexLast = formData.first_last_name.indexOf(" ");
      const firstWordLastName =
        firstSpaceIndexLast === -1
          ? formData.first_last_name
          : formData.first_last_name.substring(0, firstSpaceIndexLast);
      const username = `${firstWordFirstName.toLowerCase()}.${firstWordLastName.toLowerCase()}@ser0.mx`;
      const password = generatePassword(firstWordFirstName);
      setFormData((prevState) => ({
        ...prevState,
        user_name: username,
        password: password,
      }));
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [formData.name, formData.first_last_name]);

  useEffect(() => {
    getProfiles();
  }, []);

  useEffect(() => {
    setFormData({
      name: "",
      first_last_name: "",
      second_last_name: "",
      birthdate: "",
      sex_id: "1",
      user_name: "",
      password: "",
      password_hash: "",
      profile_id: "",
      active_web_access: true,
      active_app_movil_access: true,
      personal_phone: "",
      work_phone: "",
      url_image: "",
    });
    setFileInputKey(Date.now());
  }, [resetTrigger]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, "");
    setFormData((prevState) => ({
      ...prevState,
      [name]: numericValue,
    }));
  };

  const defaultImage =
    "https://fotos-usuarios-sero.s3.amazonaws.com/user-images/PhotoNotAvailable.jpeg";

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   setFormData(prevState => ({
  //     ...prevState,
  //     url_image: file
  //   }));
  // };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prevState) => ({
        ...prevState,
        url_image: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeletePhoto = () => {
    setFormData((prevState) => ({
      ...prevState,
      url_image: null,
    }));
  };

  const handleSwitchChange = (name) => (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: event.target.checked,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const mandatoryFields = [
      "name",
      "first_last_name",
      "second_last_name",
      "birthdate",
      "sex_id",
      "user_name",
      "password",
      "profile_id",
    ];

    const newMissingFields = mandatoryFields.filter((field) => {
      const value = formData[field];
      return typeof value === "string" && !value.trim();
    });

    setMissingFields(newMissingFields);

    if (newMissingFields.length > 0) {
      setAlertOpen(true);
      setTimeout(() => {
        setAlertOpen(false);
      }, 5000);
      return;
    }

    onNext(formData);
    onFormData(formData);
  };

  const generatePassword = (firstName) => {
    const randomChars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+<>?";
    const randomString = Array.from({ length: 5 }, () =>
      randomChars.charAt(Math.floor(Math.random() * randomChars.length))
    ).join("");
    return `${firstName.charAt(0).toUpperCase()}${firstName.substring(
      1
    )}${randomString}`;
  };

  const getProfiles = async () => {
    try {
      const response = await getAllRoles();
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_rol || index.toString(),
      }));

      setProfiles(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleProfileChange = (e) => {
    const { value } = e.target;
    const selectedProfile = profiles.find(
      (profile) => profile.id_rol === value
    );
    if (selectedProfile) {
      setFormData((prevState) => ({
        ...prevState,
        profile_id: selectedProfile.id_rol,
      }));
    }
  };

  return (
    <Box m="20px">
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          color: colors.accentGreen[100],
          fontWeight: "bold",
        }}
      >
        Datos Personales
      </Typography>
      <Divider sx={{ backgroundColor: colors.accentGreen[100] }} />
      <Box mt={2}>
        <Collapse in={alertOpen}>
          <Alert severity="warning" variant="filled" onClose={() => setAlertOpen(false)}>
            <p>Los siguientes campos son obligatorios y no tienen valor: </p>
            <Typography
              sx={{
                fontWeight: "bold"
              }}
            >{missingFields.join(", ").toUpperCase()}</Typography>
          </Alert>
        </Collapse>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Grid container mt={1} spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre(s)"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  color="secondary"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PersonIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellido Paterno"
                  name="first_last_name"
                  value={formData.first_last_name}
                  onChange={handleChange}
                  color="info"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <FamilyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellido Materno"
                  name="second_last_name"
                  value={formData.second_last_name}
                  onChange={handleChange}
                  color="info"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <FamilyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Nacimiento"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    width: "100%",
                    "& input[type='date']::-webkit-calendar-picker-indicator": {
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(
                        colors.grey[100]
                      )}'%3E%3Cpath d='M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM5 20V9h14v11H5zm3-9h2v2H8v-2zm0 4h2v2H8v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      cursor: "pointer",
                      width: "20px",
                      height: "20px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend" color="info">
                    <WcIcon /> Sexo
                  </FormLabel>
                  <RadioGroup
                    row
                    name="sex_id"
                    value={formData.sex_id}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="1"
                      control={<Radio color="info" />}
                      label="Masculino"
                    />
                    <FormControlLabel
                      value="2"
                      control={<Radio color="info" />}
                      label="Femenino"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono Personal"
                  name="personal_phone"
                  value={formData.personal_phone}
                  onChange={handleNumericChange}
                  color="info"
                  inputProps={{ maxLength: 10 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono de la Empresa"
                  name="work_phone"
                  value={formData.work_phone}
                  onChange={handleNumericChange}
                  color="info"
                  inputProps={{ maxLength: 10 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <PhoneInTalkIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Grid container mt={1} spacing={2} justifyContent="center">
              <Box
                display="flex"
                alignItems="center"
                flexDirection="column"
                position="relative"
              >
                <input
                  key={fileInputKey}
                  accept="image/*"
                  id="photo-upload"
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="photo-upload" style={{ textAlign: "center" }}>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                      color: colors.accentGreen[100],
                      fontWeight: "bold",
                    }}
                  >
                    Sube tu foto
                  </Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <CloudUploadIcon
                      fontSize="large"
                      sx={{
                        color: colors.accentGreen[100],
                      }}
                    />
                    <Avatar
                      alt="Foto"
                      src={
                        formData.url_image ? formData.url_image : defaultImage
                      }
                      sx={{
                        width: 200,
                        height: 200,
                        borderRadius: "8px",
                        ml: 1,
                      }}
                    />
                  </Box>
                </label>
                {formData.url_image && (
                  <Box position="absolute" top={0} right={0}>
                    <IconButton
                      onClick={handleDeletePhoto}
                      size="small"
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>

        <Typography
          variant="h5"
          gutterBottom
          mt={3}
          sx={{
            color: colors.accentGreen[100],
            fontWeight: "bold",
          }}
        >
          Datos de Accesos al Sistema
        </Typography>
        <Divider sx={{ backgroundColor: colors.accentGreen[100] }} />
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Nombre de Usuario"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              color="info"
              InputProps={{
                startAdornment: loading && (
                  <CircularProgress size={20} color="success" />
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <AlternateEmailIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              value={formData.password}
              onChange={handleChange}
              color="info"
              InputProps={{
                startAdornment: loading && (
                  <CircularProgress size={20} color="success" />
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <VpnKeyIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              id="profile"
              select
              label="Perfil o Rol"
              value={formData.profile_id}
              color="info"
              onChange={handleProfileChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <AdminPanelSettingsIcon />
                  </InputAdornment>
                ),
              }}
            >
              {profiles.map((profile) => (
                <MenuItem key={profile.id_rol} value={profile.id_rol}>
                  {profile.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active_web_access}
                  onChange={handleSwitchChange("active_web_access")}
                  color="info"
                />
              }
              label={
                <React.Fragment>
                  <ComputerIcon /> Acceso al Sistema Web
                </React.Fragment>
              }
              labelPlacement="start"
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active_app_movil_access}
                  onChange={handleSwitchChange("active_app_movil_access")}
                  color="info"
                />
              }
              label={
                <React.Fragment>
                  <MobileFriendlyIcon /> Acceso a la App Movil
                </React.Fragment>
              }
              labelPlacement="start"
            />
          </Grid>
        </Grid>
        <Box mt={2}>
          <Button
            type="submit"
            variant="contained"
            color="info"
            endIcon={<KeyboardTabIcon />}
            sx={{
              borderRadius: "35px",
              color: "white",
            }}
          >
            Siguiente
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default StepOne;
