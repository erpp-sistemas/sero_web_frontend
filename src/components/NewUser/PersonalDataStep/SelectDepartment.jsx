import { useEffect, useState } from "react";
import { TextField, MenuItem, FormControl, CircularProgress, InputAdornment, Fade } from "@mui/material";
import { getAllDepartment } from "../../../api/department"; // Ajusta tu ruta de servicio

export default function SelectDepartment({ value, onChange, error }) {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    const getAreas = async () => {
      try {
        const response = await getAllDepartment();
        const rowsWithId = response.map((row, index) => ({
          ...row,
          id: row.id_area || index.toString(),
        }));

        const sortedAreas = rowsWithId.sort((a, b) => a.id - b.id);

        setAreas(sortedAreas);

        // Establecer el valor por defecto si no hay un valor inicial
        if (!value && sortedAreas.length > 0) {
          onChange({ target: { name: "id_area", value: sortedAreas[0].id } });
        }
      } catch (error) {
        console.error("Error fetching areas:", error);
      } finally {
        setLoading(false);
      }
    };

    getAreas();
  }, [value, onChange]); // Asegúrate de incluir `value` y `onChange` como dependencias

  const handleChange = (e) => {
    onChange(e);
    setHighlight(true);
    setTimeout(() => setHighlight(false), 400);
  };

  return (
    <FormControl fullWidth error={error}>
      <TextField
        select
        label="Área"
        name="id_area"
        value={value}
        onChange={handleChange}
        variant="outlined"
        sx={{
          transition: "0.3s",
          boxShadow: highlight ? "0 0 0 3px rgba(25, 118, 210, 0.4)" : "none",
          borderRadius: 2,
        }}
        InputProps={{
          endAdornment: (
            <Fade in={loading} timeout={{ enter: 400, exit: 400 }} unmountOnExit>
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            </Fade>
          ),
        }}
        SelectProps={{
          MenuProps: {
            PaperProps: {
              style: {
                maxHeight: 300,
                transition: "all 0.3s ease",
              },
            },
          },
        }}
      >
        {areas.map((area) => (
          <MenuItem key={area.id} value={area.id}>
            {area.nombre}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  );
}
