import React, { useState, useEffect } from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Skeleton,
  Grow,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

function CamposDinamicos({
  campos,
  values = {},
  onChange,
  camposConError = [],
  loading = false,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [localValues, setLocalValues] = useState({});
  const [isFocused, setIsFocused] = useState({});
  const [initialized, setInitialized] = useState(false);

  const formateaNombre = (texto) =>
    texto
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());

  // Función para obtener valor por defecto según el tipo
  const getDefaultValue = (tipoCampo, isRequired) => {
    if (isRequired) return "";

    switch (tipoCampo) {
      case "numero":
        return "0";
      case "fecha":
        return "1900-01-01";
      case "checkbox":
        return false;
      default:
        return "N/D";
    }
  };

  // Función para obtener el valor real a enviar al backend
  const getValueForBackend = (value, tipoCampo, isRequired) => {
    if (isRequired) {
      return value || "";
    }

    // Si no es obligatorio y está vacío, enviar valor por defecto
    if (value === "" || value === null || value === undefined) {
      switch (tipoCampo) {
        case "numero":
          return "0";
        case "fecha":
          return "1900-01-01";
        case "checkbox":
          return false;
        default:
          return "N/D";
      }
    }

    return value;
  };

  // Inicializar valores locales y notificar al padre
  useEffect(() => {
    if (campos.length > 0 && !initialized) {
      const initialValues = {};
      const updates = {};

      campos.forEach((campo) => {
        const isRequired = campo.obligatorio === "1";
        const currentValue = values[campo.id];

        // Si el valor actual está vacío y no es obligatorio, usar valor por defecto
        if (
          !isRequired &&
          (currentValue === undefined ||
            currentValue === null ||
            currentValue === "")
        ) {
          const defaultValue = getDefaultValue(campo.tipo_campo, false);
          initialValues[campo.id] = defaultValue;
          updates[campo.id] = defaultValue;
        } else {
          initialValues[campo.id] = currentValue || "";
        }
      });

      setLocalValues(initialValues);

      // Notificar al padre de todos los valores por defecto
      Object.keys(updates).forEach((campoId) => {
        onChange?.(campoId, updates[campoId]);
      });

      setInitialized(true);
    }
  }, [campos, values, initialized, onChange]);

  const handleFocus = (campoId) => {
    setIsFocused((prev) => ({ ...prev, [campoId]: true }));

    const campo = campos.find((c) => c.id === campoId);
    if (campo && campo.obligatorio !== "1") {
      const defaultValue = getDefaultValue(campo.tipo_campo, false);
      const currentValue = localValues[campoId];

      // Si el valor actual es el por defecto, limpiar temporalmente para edición
      if (currentValue === defaultValue) {
        setLocalValues((prev) => ({ ...prev, [campoId]: "" }));
      }
    }
  };

  const handleBlur = (campoId) => {
    setIsFocused((prev) => ({ ...prev, [campoId]: false }));

    const campo = campos.find((c) => c.id === campoId);
    if (campo) {
      const isRequired = campo.obligatorio === "1";
      const currentValue = localValues[campoId];

      // Si no es obligatorio y está vacío, restaurar valor por defecto
      if (
        !isRequired &&
        (currentValue === "" ||
          currentValue === null ||
          currentValue === undefined)
      ) {
        const defaultValue = getDefaultValue(campo.tipo_campo, false);
        setLocalValues((prev) => ({ ...prev, [campoId]: defaultValue }));
        onChange?.(campoId, defaultValue);
      } else if (
        currentValue !== "" &&
        currentValue !== null &&
        currentValue !== undefined
      ) {
        // Enviar valor actual al backend
        onChange?.(campoId, currentValue);
      }
    }
  };

  const handleChange = (e, campo) => {
    let newValue;

    if (campo.tipo_campo === "checkbox") {
      newValue = e.target.checked;
      setLocalValues((prev) => ({ ...prev, [campo.id]: newValue }));
      onChange?.(campo.id, newValue);
    } else {
      newValue = e.target.value;
      setLocalValues((prev) => ({ ...prev, [campo.id]: newValue }));

      // Para campos obligatorios, enviar inmediatamente
      if (campo.obligatorio === "1") {
        onChange?.(campo.id, newValue);
      } else {
        // Para campos no obligatorios, enviar el valor actual
        onChange?.(campo.id, newValue);
      }
    }
  };

  // Función para obtener el placeholder
  const getPlaceholder = (tipoCampo, isRequired) => {
    if (isRequired) return "";
    return getDefaultValue(tipoCampo, false);
  };

  // Función para determinar si mostrar el valor o dejarlo vacío para el placeholder
  const getDisplayValue = (campo) => {
    const isRequired = campo.obligatorio === "1";
    const isFocusedField = isFocused[campo.id];
    const currentValue = localValues[campo.id];

    if (isRequired) {
      return currentValue || "";
    }

    // Si está enfocado y el valor actual es el valor por defecto, mostrar vacío
    if (isFocusedField) {
      const defaultValue = getDefaultValue(campo.tipo_campo, false);
      if (currentValue === defaultValue) {
        return "";
      }
    }

    // Si no está enfocado y el valor está vacío, mostrar el valor por defecto
    if (
      !isFocusedField &&
      (currentValue === "" ||
        currentValue === null ||
        currentValue === undefined)
    ) {
      return getDefaultValue(campo.tipo_campo, false);
    }

    return currentValue || "";
  };

  // Función para determinar si mostrar placeholder o no
  const shouldShowPlaceholder = (campo) => {
    const isRequired = campo.obligatorio === "1";
    const isFocusedField = isFocused[campo.id];
    const currentValue = localValues[campo.id];
    const defaultValue = getDefaultValue(campo.tipo_campo, false);

    if (isRequired) return false;

    // Mostrar placeholder cuando está enfocado y el valor es el por defecto
    if (isFocusedField && currentValue === defaultValue) {
      return true;
    }

    // Mostrar placeholder cuando no está enfocado y el valor está vacío
    if (
      !isFocusedField &&
      (currentValue === "" ||
        currentValue === null ||
        currentValue === undefined)
    ) {
      return true;
    }

    return false;
  };

  // ESTILO CONSISTENTE PARA TODOS LOS CAMPOS
  const estiloCampo = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      fontSize: "0.875rem",
      backgroundColor: colors.bgContainer,
      transition: "border-color 0.2s ease, box-shadow 0.2s ease",

      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: colors.borderContainer,
      },

      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: colors.accentGreen[100],
      },

      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: colors.accentGreen[200],
        boxShadow: "0 0 0 3px rgba(34,197,94,0.15)",
      },

      "&.Mui-error .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.error.main,
      },

      "&.Mui-error:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.error.dark,
      },

      "& input::placeholder": {
        color: colors.grey[400],
        opacity: 1,
        fontSize: "0.875rem",
        fontStyle: "italic",
      },
    },

    "& .MuiInputLabel-root": {
      "&.Mui-error": {
        color: theme.palette.error.main,
      },
    },

    "& .MuiInputAdornment-root": {
      marginRight: "8px",
    },

    "& .MuiFormHelperText-root": {
      marginLeft: 1,
      fontSize: "0.75rem",
      color: theme.palette.error.main,
    },
  };

  // Estilo específico para checkbox
  const estiloCheckbox = {
    "& .MuiCheckbox-root": {
      color: colors.borderContainer,
      "&:hover": {
        backgroundColor: "rgba(34,197,94,0.04)",
      },
      "&.Mui-checked": {
        color: colors.accentGreen[200],
      },
      "&.Mui-error": {
        color: theme.palette.error.main,
      },
    },
    "& .MuiFormControlLabel-label": {
      fontSize: "0.875rem",
      color: colors.grey[100],
      "&.Mui-error": {
        color: theme.palette.error.main,
      },
    },
  };

  return (
    <div>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          marginBottom: 1.5,
          color: colors.accentGreen[100],
        }}
      >
        Completa la informacion
      </Typography>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={44}
              className="w-full"
              sx={{ borderRadius: "10px", mb: 2 }}
            />
          ))}
        </div>
      ) : campos.length === 0 ? (
        <div className="text-gray-400 italic py-4 text-center">
          No hay campos disponibles.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {campos.map((campo, index) => {
            const baseLabel = formateaNombre(campo.nombre_campo);
            const isRequired = campo.obligatorio === "1";
            const label = baseLabel + (isRequired ? " *" : "");
            const placeholderValue = getPlaceholder(
              campo.tipo_campo,
              isRequired
            );

            const displayValue = getDisplayValue(campo);
            const showPlaceholder = shouldShowPlaceholder(campo);
            const tieneError = camposConError.includes(campo.id);

            const textFieldProps = {
              label,
              placeholder: showPlaceholder ? placeholderValue : "",
              variant: "outlined",
              fullWidth: true,
              margin: "dense",
              required: isRequired,
              value: displayValue,
              onFocus: () => handleFocus(campo.id),
              onBlur: () => handleBlur(campo.id),
              onChange: (e) => handleChange(e, campo),
              error: tieneError,
              helperText: tieneError ? "Este campo es obligatorio" : "",
              sx: estiloCampo,
            };

            return (
              <Grow
                key={campo.id}
                in={true}
                style={{ transformOrigin: "0 0 0" }}
                timeout={200 + index * 100}
              >
                <div>
                  {campo.tipo_campo === "texto" && (
                    <TextField {...textFieldProps} size="small" />
                  )}

                  {campo.tipo_campo === "numero" && (
                    <TextField
                      {...textFieldProps}
                      size="small"
                      type="number"
                      onKeyDown={(e) => {
                        if (
                          !/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab|\.|,/.test(
                            e.key
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                      InputProps={{
                        inputProps: {
                          min: "0",
                          className:
                            "appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                          style: { MozAppearance: "textfield" },
                        },
                      }}
                    />
                  )}

                  {campo.tipo_campo === "checkbox" && (
                    <div className="flex items-center h-full">
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            checked={!!localValues[campo.id]}
                            onChange={(e) => handleChange(e, campo)}
                            sx={estiloCheckbox}
                            required={isRequired}
                          />
                        }
                        label={label}
                        required={isRequired}
                        sx={{
                          ...estiloCheckbox,
                          "& .MuiFormControlLabel-label": {
                            ...estiloCheckbox["& .MuiFormControlLabel-label"],
                            ...(tieneError && {
                              color: theme.palette.error.main,
                            }),
                          },
                        }}
                        className="w-full"
                      />
                      {tieneError && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            marginLeft: 1,
                            fontSize: "0.75rem",
                            color: theme.palette.error.main,
                            marginTop: 0.5,
                          }}
                        >
                          Este campo es obligatorio
                        </Typography>
                      )}
                    </div>
                  )}

                  {campo.tipo_campo === "fecha" && (
                    <TextField
                      {...textFieldProps}
                      type="date"
                      size="small"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        ...estiloCampo,
                        "& input[type='date']::-webkit-calendar-picker-indicator":
                          {
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(
                              tieneError
                                ? theme.palette.error.main
                                : colors.accentGreen[100]
                            )}'%3E%3Cpath d='M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM5 20V9h14v11H5zm3-9h2v2H8v-2zm0 4h2v2H8v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center",
                            cursor: "pointer",
                            width: "20px",
                            height: "20px",
                          },
                      }}
                    />
                  )}

                  {!["texto", "numero", "checkbox", "fecha"].includes(
                    campo.tipo_campo
                  ) && <TextField {...textFieldProps} />}
                </div>
              </Grow>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CamposDinamicos;
