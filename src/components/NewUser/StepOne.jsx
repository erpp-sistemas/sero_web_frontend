import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Avatar from '@mui/material/Avatar';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CircularProgress from '@mui/material/CircularProgress';
import { Divider, InputAdornment, MenuItem, Alert, Collapse } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import FamilyIcon from '@mui/icons-material/FamilyRestroom';
import WcIcon from '@mui/icons-material/Wc';
import EventIcon from '@mui/icons-material/Event';
import { getAllRoles } from '../../api/rol.js';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ComputerIcon from '@mui/icons-material/Computer';
import MobileFriendlyIcon from '@mui/icons-material/MobileFriendly';
import { useSelector } from 'react-redux';
import KeyboardTabIcon from '@mui/icons-material/KeyboardTab';

function StepOne({ onNext, onFormData }) {
  const titleStyle = {
    color: '#5EBFFF',
  };

  const [formData, setFormData] = useState({
    name: '',
    first_last_name: '',
    second_last_name: '',
    birthdate: '',
    sex_id: '1',
    user_name: '',
    password: '',
    password_hash: '',
    profile_id: '',
    active_web_access: 1,
    active_app_movil_access: 1,
    personal_phone: '',
    work_phone: '',
    url_image: ''
  });

  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [missingFields, setMissingFields] = useState([]);
  const user = useSelector(state => state.user);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const firstSpaceIndex = formData.name.indexOf(' ');
      const firstWordFirstName = firstSpaceIndex === -1 ? formData.name : formData.name.substring(0, firstSpaceIndex);
      const firstSpaceIndexLast = formData.first_last_name.indexOf(' ');
      const firstWordLastName = firstSpaceIndexLast === -1 ? formData.first_last_name : formData.first_last_name.substring(0, firstSpaceIndexLast);
      const username = `${firstWordFirstName.toLowerCase()}.${firstWordLastName.toLowerCase()}@ser0.mx`;
      const password = generatePassword(firstWordFirstName);
      setFormData(prevState => ({
        ...prevState,
        user_name: username,
        password: password
      }));
      setLoading(false);
    }, 500); 
    return () => clearTimeout(timer);
  }, [formData.name, formData.first_last_name]);

  useEffect(() => {
    getProfiles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, '');
    setFormData(prevState => ({
      ...prevState,
      [name]: numericValue
    }));
  };

  const defaultImage = "https://ser0.mx/ser0/image/sin_foto_perfil.png";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prevState => ({
      ...prevState,
      url_image: file
    }));
  };

  const handleDeletePhoto = () => {
    setFormData(prevState => ({
      ...prevState,
      url_image: null
    }));
  };

  const handleSwitchChange = (name) => (event) => {
    setFormData({ ...formData, [name]: event.target.checked });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const mandatoryFields = ['name', 'first_last_name', 'second_last_name', 'birthdate', 'sex_id', 'user_name', 'password', 'profile_id'];

    const newMissingFields = mandatoryFields.filter(field => {
      const value = formData[field];
      return typeof value === 'string' && !value.trim();
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
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+<>?';
    const randomString = Array.from({ length: 5 }, () => randomChars.charAt(Math.floor(Math.random() * randomChars.length))).join('');
    return `${firstName.charAt(0).toUpperCase()}${firstName.substring(1)}${randomString}`;
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
    const selectedProfile = profiles.find(profile => profile.id_rol === value);
    if (selectedProfile) {
      setFormData(prevState => ({
        ...prevState,
        profile_id: selectedProfile.id_rol
      }));
    }
  };

  return (
    <Box m='20px'>
      <Typography variant="h5" gutterBottom>
        Datos Personales
      </Typography>
      <Divider sx={{ backgroundColor: '#5EBFFF' }} />
      <Box mt={2}>
        <Collapse in={alertOpen}>
          <Alert severity="error" onClose={() => setAlertOpen(false)}>
            Los siguientes campos son obligatorios y no tienen valor: {missingFields.join(', ')}
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
                color="info"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
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
                  startAdornment: (
                    <InputAdornment position="start">
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
                  startAdornment: (
                    <InputAdornment position="start">
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
                color="info"
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EventIcon />
                    </InputAdornment>
                  ),
                  sx: {
                    '& input[type="date"]::-webkit-calendar-picker-indicator': {
                      filter: 'invert(50%) sepia(100%) saturate(1000%) hue-rotate(90deg) brightness(1.2) contrast(1.2)',
                    },
                    '& input[type="date"]::-webkit-clear-button': {
                      display: 'none',
                    },
                    '& input[type="date"]::-webkit-inner-spin-button': {
                      display: 'none',
                    },
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
                    control={<Radio color="secondary" />}
                    label="Masculino"
                  />
                  <FormControlLabel
                    value="2"
                    control={<Radio color="secondary" />}
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
                  startAdornment: (
                    <InputAdornment position="start">
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
                  startAdornment: (
                    <InputAdornment position="start">
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
            <Box display="flex" alignItems="center" flexDirection="column" position="relative">
              <input
                accept="image/*"
                id="photo-upload"
                type="file"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="photo-upload" style={{ textAlign: 'center' }}>
                <Typography variant="body1" gutterBottom>Sube tu foto</Typography>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <CloudUploadIcon color="info" fontSize="large" />
                  <Avatar
                    alt="Foto"
                    src={formData.url_image ? URL.createObjectURL(formData.url_image) : defaultImage}
                    sx={{ width: 200, height: 200, borderRadius: '8px', ml: 1 }}
                  />
                </Box>
              </label>
              {formData.url_image && (
                <Box position="absolute" top={0} right={0}>
                  <IconButton onClick={handleDeletePhoto} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Grid>
        </Grid>
      </Grid>

        <Typography variant="h5" gutterBottom mt={3}>
          Datos de Accesos al Sistema
        </Typography>
        <Divider sx={{ backgroundColor: '#5EBFFF' }} />
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Nombre de Usuario"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              color='info'
              InputProps={{
                endAdornment: loading && <CircularProgress size={20} color="success" />,
                startAdornment: (
                  <InputAdornment position="start">
                    <AlternateEmailIcon/>
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
              color='info'
              InputProps={{
                endAdornment: loading && <CircularProgress size={20} color="success" />,
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKeyIcon/>
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
              color='info'
              onChange={handleProfileChange}
              InputProps={{                
                startAdornment: (
                  <InputAdornment position="start">
                    <AdminPanelSettingsIcon/>
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
              control={<Switch checked={formData.active_web_access} onChange={handleSwitchChange('active_web_access')} color='secondary' />}
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
              control={<Switch checked={formData.active_app_movil_access} onChange={handleSwitchChange('active_app_movil_access')} color='secondary' />}
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
          <Button type="submit" variant="contained" color="secondary" endIcon={<KeyboardTabIcon/>}>
            Siguiente
          </Button>
        </Box>
      </form>      
    </Box>
  );
}

export default StepOne;
