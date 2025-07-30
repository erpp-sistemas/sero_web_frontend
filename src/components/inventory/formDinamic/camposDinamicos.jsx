import React from "react";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Skeleton,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

function CamposDinamicos({
  campos,
  values = {},
  onChange,
  camposConError = [],
  loading = false, // ← Nueva prop
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const formateaNombre = (texto) =>
    texto
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div>
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          paddingBottom: 1,
          color: colors.accentGreen[100],
        }}
      >
        Campos para llenar
      </Typography>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={56}
              className="w-full"
              sx={{ borderRadius: 2, marginBottom: 2 }}
            />
          ))}
        </div>
      ) : campos.length === 0 ? (
        <div className="text-gray-400 italic py-4 text-center">
          No hay campos disponibles.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {campos.map((campo) => {
            const baseLabel = formateaNombre(campo.nombre_campo);
            const isRequired = campo.obligatorio === "1";
            const label = baseLabel; // Solo el texto, sin asterisco
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
              // size: "small",
              className: "w-full",
              required: isRequired,
              value: value,
              onChange: handleChange,
              error: tieneError,
              helperText: tieneError ? "Este campo es obligatorio" : "",
              sx: {
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: colors.accentGreen[100],
                  },
                  "& input": {
                    color: colors.grey[100],
                  },
                },
                "& label.Mui-focused": {
                  color: colors.accentGreen[100],
                },
              },
            };

            switch (campo.tipo_campo) {
              case "texto":
                return (
                  <div key={campo.id}>
                    <TextField {...textFieldProps} />
                  </div>
                );

              case "numero":
                return (
                  <div key={campo.id}>
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
                  </div>
                );

              case "checkbox":
                return (
                  <div key={campo.id} className="flex items-center h-full">
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={!!value}
                          onChange={handleChange}
                        />
                      }
                      label={label}
                      required={isRequired}
                      sx={{ marginTop: 1, marginBottom: 1 }}
                      className="w-full"
                    />
                  </div>
                );

              case "fecha":
                return (
                  <div key={campo.id}>
                    <TextField
                      {...textFieldProps}
                      type="date"
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        ...textFieldProps.sx,
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
                  </div>
                );

              default:
                return (
                  <div key={campo.id}>
                    <TextField {...textFieldProps} />
                  </div>
                );
            }
          })}
        </div>
      )}
    </div>
  );
}

export default CamposDinamicos;
