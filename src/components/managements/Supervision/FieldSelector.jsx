import React, { useState, useMemo } from "react";
import { Chip, Box, useTheme, Typography } from "@mui/material";
import { tokens } from "../../../theme";
import { Flaky, People, TextFields } from "@mui/icons-material";

const FieldSelector = ({ data, onSelectionChange }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos para mostrar</p>
    );
  }
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // Lista de campos a omitir
  const omittedFields = [
    "id",
    "cuenta",
    "id_usuario",
    "usuario",
    "image_user",
    "tarea",
    "fecha_captura",
    "gestor_visitado",
    "id_form",
    "id_proceso",
    "id_servicio",
    "latitud",
    "longitud",
    "gestor_visitado_nombre",
    "fotos",
  ];

  // Obtener los nombres de los campos disponibles
  const availableFields = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]).filter(
      (field) => !omittedFields.includes(field)
    );
  }, [data]);

  // Estado para los campos seleccionados
  const [selectedFields, setSelectedFields] = useState([]);

  const handleToggleField = (field) => {
    setSelectedFields((prev) => {
      const newSelection = prev.includes(field)
        ? prev.filter((f) => f !== field)
        : [...prev, field];
      onSelectionChange(newSelection);
      return newSelection;
    });
  };

  return (
    <div className="space-y-4">
      <Typography
        variant="h6"
        sx={{
          color: colors.accentGreen[100],
          fontWeight: "bold",
          textTransform: "uppercase",
        }}
      >
        Selecciona las opciones a evaluar
      </Typography>
      <div className="flex flex-wrap gap-2">
        {availableFields.map((field) => (
          <Chip
            key={field}
            label={field.replace(/_/g, " ")}
            clickable
            sx={{
              backgroundColor: selectedFields.includes(field)
                ? colors.accentGreen[100]
                : "default",
              color: selectedFields.includes(field)
                ? colors.contentAccentGreen[100]
                : "inherit",
              "&:hover": {
                backgroundColor: selectedFields.includes(field)
                  ? colors.accentGreen[200]
                  : "default",
              },
              "& .MuiChip-icon": {
                color: selectedFields.includes(field)
                  ? colors.contentAccentGreen[100]
                  : "inherit",
              },
              fontWeight: "bold",
            }}
            icon={<Flaky />}
            onClick={() => handleToggleField(field)}
          />
        ))}
      </div>
    </div>
  );
};

export default FieldSelector;
