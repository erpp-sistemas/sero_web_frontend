import React, { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";

const GenericSelect = ({ options, label, setSelected, ...rest }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event) => {
    const index = event.target.value;
    setSelectedOption(index);
    setSelected({ index, text: options[index] });
  };

  return (
    <Box {...rest}>
      <FormControl style={{ width: "fit-content", minWidth: "100%" }}>
        <InputLabel sx={{ width: "auto" }} id="select-label">
          {label}
        </InputLabel>
        <Select
          labelId="select-label"
          id="select"
          variant="standard"
          value={`${selectedOption}`}
          label="Selecciona una opción"
          onChange={handleChange}
        >
          {options.map((option, index) => (
            <MenuItem key={index} value={`${index}`}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default GenericSelect;
