import { useEffect, useState } from "react";
import { TextField, MenuItem, FormControl, CircularProgress, InputAdornment, Fade  } from "@mui/material";
import { getAllRoles } from "../../../api/rol.js";

export default function SelectProfiles({ value, onChange, error }) {
    const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    const getProfiles = async () => {
      try {
        const response = await getAllRoles();
        const rowsWithId = response.map((row, index) => ({
          ...row,
          id: row.id_rol || index.toString(),
        }));

        const sortedProfiles = rowsWithId.sort((a, b) => a.id - b.id);

        setProfiles(sortedProfiles);

        // Establecer el valor por defecto si no hay un valor inicial
        if (!value && sortedProfiles.length > 0) {
          onChange({ target: { name: "id_rol", value: sortedProfiles[0].id } });
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };

    getProfiles();
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
        label="Rol"
        name="id_rol"
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
        {profiles.map((profile) => (
          <MenuItem key={profile.id} value={profile.id}>
            {profile.nombre}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  );
}