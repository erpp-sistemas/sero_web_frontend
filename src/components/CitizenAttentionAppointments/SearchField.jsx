import React from "react";
import { TextField } from "@mui/material";

const SearchField = ({ value, onChange }) => (
  <TextField
    label="Buscar en toda la información"
    variant="outlined"
    fullWidth
    size="small"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    sx={{ maxWidth: 400, mb: 3 }}
  />
);

export default SearchField;
