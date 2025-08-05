import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button
} from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

const FilterControls = ({ addingFilter, availableFilters, onAdd, onChange, onClear }) => {
  return (
    <div className="grid grid-cols-12 items-center gap-2 mt-4">
      <FormControl size="small" className="col-span-4">
        <InputLabel>Agregar filtro</InputLabel>
        <Select value={addingFilter} label="Agregar filtro" onChange={onChange}>
          {availableFilters.map((field) => (
            <MenuItem key={field} value={field}>{field}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className="col-span-2">
        <Button
          onClick={onAdd}
          variant="contained"
          color="info"
          fullWidth
          sx={{ borderRadius: "20px", fontWeight: "bold" }}
          endIcon={<PlaylistAddIcon />}
        >
          Agregar filtro
        </Button>
      </div>
      <div className="col-span-2">
        <Button
          onClick={onClear}
          variant="contained"
          color="error"
          fullWidth
          endIcon={<DeleteSweepIcon />}
          sx={{ borderRadius: "16px", fontWeight: "bold", color: "black" }}
        >
          Limpiar filtros
        </Button>
      </div>
      <div className="col-span-4"></div>
    </div>
  );
};

export default FilterControls;