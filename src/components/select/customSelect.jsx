import React, { memo } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

const CustomSelect = ({
  label,
  options = [], // Recibe los datos directamente
  selectedValue,
  handleChange,
  loading = false,
  idKey = "id",
  nameKey = "name",
  disabled = false,
}) => {
  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <TextField
        select
        label={label}
        variant="outlined"
        fullWidth
        value={selectedValue || ""}
        onChange={handleChange}
        disabled={loading || disabled}
      >
        {options.map((option) => (
          <MenuItem key={option[idKey]} value={option[idKey]}>
            {option[nameKey]}
          </MenuItem>
        ))}
      </TextField>

      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            right: 0,
            display: "flex",
            alignItems: "center",
            transform: "translateY(-50%)",
            zIndex: 1,
            pointerEvents: "none",
            pr: 2,
          }}
        >
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ color: "gray" }}>
            Cargando {label}...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default memo(CustomSelect);
