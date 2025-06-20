import { useState, useEffect } from "react";
import { tokens } from "../../theme";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Divider,
  Typography,
  Button,
  useTheme
} from "@mui/material";
import PhotoUpload from "./PersonalDataStep/PhotoUpload";
import SelectProfiles from "./PersonalDataStep/SelectProfiles";
import SelectPositions from "./PersonalDataStep/SelectPositions";
import SelectDepartment from "./PersonalDataStep/SelectDepartment";
import useFormulario from "../../hooks/useFormulario";

function generateSecurePassword() {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const special = "!@#$%^&*()_+[]{}|;:,.<>?";

  const all = upper + lower + digits + special;

  // Garantizamos al menos una de cada categoría
  let password = [
    upper[Math.floor(Math.random() * upper.length)],
    lower[Math.floor(Math.random() * lower.length)],
    digits[Math.floor(Math.random() * lower.length)],
    special[Math.floor(Math.random() * special.length)],
  ];

  // Rellenamos con caracteres aleatorios hasta llegar a 8
  while (password.length < 8) {
    password.push(all[Math.floor(Math.random() * all.length)]);
  }

  // Mezclar el orden
  return password.sort(() => 0.5 - Math.random()).join("");
}
function sanitizeTextForEmail(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ñ/g, "n")
    .replace(/[^a-zA-Z0-9]/g, "");
}

export default function PersonalDataStep({
  mode = "create",
  initialValues = {},
  onChange,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    fecha_nacimiento: null,
    id_sexo: 1,
    telefono_personal: "",
    telefono_empresa: "",
    id_area: "",
    id_puesto: "",
    id_horario: "",
    usuario: "",
    contrasena: "",
    activo: true,
    activo_app_movil: true,
    activo_app_desktop: false,
    foto: "",
    id_rol: "",
    ...initialValues,
  });

  const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  const [errors, setErrors] = useState({});
  const [usuarioModificadoManualmente, setUsuarioModificadoManualmente] =
    useState(false);
  const [contrasenaModificadaManualmente, setContrasenaModificadaManualmente] =
    useState(false);

    const { guardarSeccion } = useFormulario();

  const validateField = (field, value) => {
    let error = "";

    if (
      [
        "nombre",
        "apellido_paterno",
        "apellido_materno",
        "usuario",
        "contrasena",
      ].includes(field)
    ) {
      if (!value.trim()) {
        error = "Este campo es obligatorio.";
      }
    }

    if (field === "fecha_nacimiento" && !value) {
      error = "La fecha de nacimiento es obligatoria.";
    }

    if (field === "foto" && !value) {
      error = "La foto es obligatoria.";
    }

    // if (["telefono_personal", "telefono_empresa"].includes(field)) {
    //   if (!/^\d{10}$/.test(value)) {
    //     error = "Debe ser un número de 10 dígitos.";
    //   }
    // }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Retorna true si no hay errores
  };

  const handleChange = (field, value) => {
    const error = validateField(field, value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: error }));

    let updatedData = { ...formData, [field]: value };

    // Detectar cambios en nombre o apellido paterno para actualizar el usuario
    if (field === "nombre" || field === "apellido_paterno") {
      const rawNombre = field === "nombre" ? value : formData.nombre;
      const rawApellido =
        field === "apellido_paterno" ? value : formData.apellido_paterno;

      const nombreSanitizado = sanitizeTextForEmail(
        rawNombre.trim().split(" ")[0] || ""
      ); // primer nombre
      const apellidoSanitizado = sanitizeTextForEmail(
        rawApellido.trim().split(" ")[0] || ""
      ); // primer apellido

      const usuarioGenerado =
        `${nombreSanitizado}.${apellidoSanitizado}@ser0.mx`.toLowerCase();

      if (!usuarioModificadoManualmente) {
        updatedData.usuario = usuarioGenerado;
      }
    }

    // Generar contraseña automáticamente solo si estamos en modo create y no se modificó manualmente
    if (
      mode === "create" &&
      !contrasenaModificadaManualmente &&
      (field === "nombre" || field === "apellido_paterno")
    ) {
      updatedData.contrasena = generateSecurePassword();
    }

    if (field === "usuario") {
      setUsuarioModificadoManualmente(true);
    }

    setFormData(updatedData);
    onChange && onChange(updatedData);
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const datosPersonales = {
      nombre: formData.nombre,
      apellido_paterno: formData.apellido_paterno,
      apellido_materno: formData.apellido_materno,
      fecha_nacimiento: formData.fecha_nacimiento,
      id_sexo: formData.id_sexo,
      telefono_personal: formData.telefono_personal,
      telefono_empresa: formData.telefono_empresa,
      id_area: formData.id_area,
      id_puesto: formData.id_puesto,
      id_horario: formData.id_horario,
      usuario: formData.usuario,
      contrasena: formData.contrasena,
      activo: formData.activo,
      activo_app_movil: formData.activo_app_movil,
      activo_app_desktop: formData.activo_app_desktop,
      foto: formData.foto,
      id_rol: formData.id_rol,
    };

    guardarSeccion("datosPersonales", datosPersonales);
    console.log("Datos guardados:", datosPersonales);
  };

  return (
    <div className="w-full p-4 flex flex-col gap-10">
      {/* DATOS PERSONALES */}
      <div className="flex flex-col gap-4">
        <Typography variant="h6">Datos Personales</Typography>
        <Divider />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TextField
            label="Nombre"
            value={formData.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            error={!!errors.nombre}
            helperText={errors.nombre}
          />
          <TextField
            label="Apellido Paterno"
            value={formData.apellido_paterno}
            onChange={(e) => handleChange("apellido_paterno", e.target.value)}
            error={!!errors.apellido_paterno}
            helperText={errors.apellido_paterno}
          />
          <TextField
            label="Apellido Materno"
            value={formData.apellido_materno}
            onChange={(e) => handleChange("apellido_materno", e.target.value)}
            error={!!errors.apellido_materno}
            helperText={errors.apellido_materno}
          />
          <TextField
            id="start-date"
            label="Fecha de nacimiento"
            type="date"
            value={formData.fecha_nacimiento || ""} // Asegúrate de que no sea null o undefined
            onChange={(e) => handleChange("fecha_nacimiento", e.target.value)} // Extrae el valor del evento
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              width: "100%",
              "& input[type='date']::-webkit-calendar-picker-indicator": {
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(
                  colors.accentGreen[100]
                )}'%3E%3Cpath d='M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM5 20V9h14v11H5zm3-9h2v2H8v-2zm0 4h2v2H8v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                cursor: "pointer",
                width: "20px",
                height: "20px",
              },
            }}
          />

          <FormControl fullWidth>
            <InputLabel>Sexo</InputLabel>
            <Select
              value={formData.id_sexo}
              onChange={(e) => handleChange("id_sexo", e.target.value)}
              label="Sexo"
            >
              <MenuItem value={1}>Masculino</MenuItem>
              <MenuItem value={2}>Femenino</MenuItem>
            </Select>
          </FormControl>
          <div className="w-full flex justify-center md:justify-start">
            <PhotoUpload
              photoUrl={formData.foto}
              onPhotoChange={(base64) => handleChange("foto", base64)}
            />
            {errors.foto && (
              <Typography color="error">{errors.foto}</Typography>
            )}
          </div>
        </div>
      </div>

      {/* DATOS DE CONTACTO */}
      <div className="flex flex-col gap-4">
        <Typography variant="h6">Datos de Contacto</Typography>
        <Divider />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField
            label="Teléfono Personal"
            value={formData.telefono_personal}
            onChange={(e) => handleChange("telefono_personal", e.target.value)}
            error={!!errors.telefono_personal}
            helperText={errors.telefono_personal}
          />
          <TextField
            label="Teléfono Empresa"
            value={formData.telefono_empresa}
            onChange={(e) => handleChange("telefono_empresa", e.target.value)}
            error={!!errors.telefono_empresa}
            helperText={errors.telefono_empresa}
          />
        </div>
      </div>

      {/* DATOS LABORALES */}
      <div className="flex flex-col gap-4">
        <Typography variant="h6">Datos Laborales</Typography>
        <Divider />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectDepartment
            value={formData.id_area}
            onChange={(e) => handleChange("id_area", e.target.value)}
          />
          <SelectPositions
            value={formData.id_puesto}
            onChange={(e) => handleChange("id_puesto", e.target.value)}
          />
        </div>
      </div>

      {/* DATOS DE ACCESO */}
      <div className="flex flex-col gap-4">
        <Typography variant="h6">Acceso al Sistema</Typography>
        <Divider />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TextField
            label="Usuario"
            value={formData.usuario}
            onChange={(e) => {
              handleChange("usuario", e.target.value);
              setUsuarioModificadoManualmente(true);
            }}
            error={!!errors.usuario}
            helperText={errors.usuario}
          />
          {mode === "create" && (
            <TextField
              label="Contraseña"
              value={formData.contrasena}
              onChange={(e) => {
                handleChange("contrasena", e.target.value);
                setContrasenaModificadaManualmente(true);
              }}
              error={!!errors.contrasena}
              helperText={errors.contrasena}
            />
          )}
          <SelectProfiles
            value={formData.id_rol}
            onChange={(e) => handleChange("id_rol", e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <FormControlLabel
            control={
              <Switch
                checked={formData.activo}
                onChange={(e) => handleChange("activo", e.target.checked)}
              />
            }
            label="Activo"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.activo_app_movil}
                onChange={(e) =>
                  handleChange("activo_app_movil", e.target.checked)
                }
              />
            }
            label="App Móvil"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.activo_app_desktop}
                onChange={(e) =>
                  handleChange("activo_app_desktop", e.target.checked)
                }
              />
            }
            label="App Desktop"
          />
        </div>
      </div>

      {/* BOTÓN GUARDAR */}
      <div className="flex justify-end">
        <Button variant="contained" color="info" onClick={handleSave}>
          {mode === "edit" ? "Guardar cambios" : "Guardar"}
        </Button>
      </div>
    </div>
  );
}
