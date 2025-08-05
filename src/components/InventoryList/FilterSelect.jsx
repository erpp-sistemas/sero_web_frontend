import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const FilterSelect = ({ filterKey, value, options, onChange }) => {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>{filterKey}</InputLabel>
      <Select
        value={value}
        label={filterKey}
        onChange={(e) => onChange(filterKey, e.target.value)}
      >
        <MenuItem value="">Todos</MenuItem>
        {options.map((option, idx) => (
          <MenuItem key={idx} value={String(option)}>
            {String(option)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterSelect;
