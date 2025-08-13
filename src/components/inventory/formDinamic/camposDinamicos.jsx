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

  const baseMinimalSx = {
    backgroundColor: "transparent",
    borderRadius: "8px",
    fontSize: "0.875rem",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(128,128,128,0.3)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0,120,212,0.6)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0,120,212,1)",
    },
    "& input": {
      padding: "10px 12px",
    },
    "& label": {
      fontSize: "0.875rem",
    },
  };

  return (
    <div>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          marginBottom: 1.5, // 12px aprox
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
              sx={{ borderRadius: "8px", mb: 2 }}
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
              sx: baseMinimalSx,
            };

            return (
              <Grow
                key={campo.id}
                in={true}
                style={{ transformOrigin: "0 0 0" }}
                timeout={200 + index * 100} // efecto escalonado
              >
                <div>
                  {campo.tipo_campo === "texto" && (
                    <TextField {...textFieldProps} />
                  )}

                  {campo.tipo_campo === "numero" && (
                    <TextField
                      {...textFieldProps}
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
                            sx={{
                              color: "rgba(0,0,0,0.54)",
                              "&.Mui-checked": {
                                color: "rgba(0,120,212,1)",
                              },
                            }}
                          />
                        }
                        label={label}
                        required={isRequired}
                        sx={{ fontSize: "0.875rem" }}
                        className="w-full"
                      />
                    </div>
                  )}

                  {campo.tipo_campo === "fecha" && (
                    <TextField
                      {...textFieldProps}
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        ...baseMinimalSx,
                        "& input[type='date']::-webkit-calendar-picker-indicator":
                          {
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
