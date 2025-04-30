import React from "react";
import { Chip, Stack } from "@mui/material";

// Función auxiliar para calcular color a partir de un string
const getColorFromString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

const RegularizationChips = ({ options, selectedFilters, onFilterClick }) => {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap">
      {Object.entries(options).map(([option, count]) => {
        const bulletColor = getColorFromString(option || "");

        return (
          <Chip
            key={option}
            label={`${option} (${count})`}
            clickable
            onClick={() => onFilterClick(option)}
            variant={selectedFilters.includes(option) ? "filled" : "outlined"}
            sx={{
              textTransform: "capitalize",
              fontWeight: "bold",
              borderColor: bulletColor,
              color: selectedFilters.includes(option) ? "white" : bulletColor,
              backgroundColor: selectedFilters.includes(option)
                ? bulletColor
                : "transparent",
              "&:hover": {
                backgroundColor: selectedFilters.includes(option)
                  ? bulletColor
                  : bulletColor + "33", // Ligero fondo en hover
              },
            }}
          />
        );
      })}
    </Stack>
  );
};

export default RegularizationChips;
