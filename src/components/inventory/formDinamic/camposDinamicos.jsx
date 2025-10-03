import React from "react";
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

  const formateaNombre = (texto) =>
    texto
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());

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
            const label = baseLabel;
            const placeholder = `Escribe ${baseLabel.toLowerCase()}`;
            const value =
              values[campo.id] ??
              (campo.tipo_campo === "checkbox" ? false : "");

            const tieneError = camposConError.includes(campo.id);

            const handleChange = (e) => {
              const newValue =
                campo.tipo_campo === "checkbox"
                  ? e.target.checked
                  : e.target.value;
              onChange?.(campo.id, newValue);
            };

            const textFieldProps = {
              label,
              placeholder,
              variant: "outlined",
              fullWidth: true,
              margin: "dense",
              required: isRequired,
              value: value,
              onChange: handleChange,
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
                    <TextField {...textFieldProps} size="small"/>
                  )}

                  {campo.tipo_campo === "numero" && (
                    <TextField
                      {...textFieldProps}
                      size="small"
                      type="number"
                      InputProps={{
                        inputProps: {
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
                            checked={!!value}
                            onChange={handleChange}
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
                  ) && <TextField {...textFieldProps}/>}
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
