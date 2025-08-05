import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchFilter = ({ value, onChange }) => {
  return (
    <TextField
      label="Buscar en todos los campos"
      variant="outlined"
      size="small"
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchFilter;
