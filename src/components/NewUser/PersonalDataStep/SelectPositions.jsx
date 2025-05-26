import { useEffect, useState } from "react";
import { TextField, MenuItem, FormControl, CircularProgress, InputAdornment, Fade } from "@mui/material";
import { getAllPositions } from "../../../api/position.js";

export default function SelectPositions({ value, onChange, error }) {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    const getPositions = async () => {
      try {
        const response = await getAllPositions();
        const rowsWithId = response.map((row, index) => ({
          ...row,
          id: row.id_puesto || index.toString(),
        }));

        const sortedPositions = rowsWithId.sort((a, b) => a.id - b.id);

        setPositions(sortedPositions);

        // Establecer el valor por defecto si no hay un valor inicial
        if (!value && sortedPositions.length > 0) {
          onChange({ target: { name: "id_puesto", value: sortedPositions[0].id } });
        }
      } catch (error) {
        console.error("Error fetching positions:", error);
      } finally {
        setLoading(false);
      }
    };

    getPositions();
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
        label="Puesto"
        name="id_puesto"
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
        {positions.map((position) => (
          <MenuItem key={position.id} value={position.id}>
            {position.nombre}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  );
}
