import React, { useState, useEffect, memo } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { getPlaceServiceProcessByUserId } from "../services/process.service";

function ProcessSelect({ selectedPlace, selectedService, selectedProcess, handleProcessChange }) {
  const user = useSelector((state) => state.user);
  const [process, setProcess] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProcesses = async () => {
      if (selectedPlace && selectedService) {
        setLoading(true);
        try {
          const res = await getPlaceServiceProcessByUserId(user.user_id, selectedPlace, selectedService);
          setProcess(res);

          // Seleccionar automáticamente el primer proceso si hay datos y no hay un valor seleccionado
          if (res.length > 0 && !selectedProcess) {
            handleProcessChange({ target: { value: res[0].process_id } });
          }
        } catch (error) {
          console.error("Error loading processes:", error);
          setProcess([]);
        } finally {
          setLoading(false);
        }
      } else {
        setProcess([]);
      }
    };

    loadProcesses();
  }, [user.user_id, selectedPlace, selectedService]);

  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        id="process-select"
        select
        label="Proceso"
        variant="outlined"
        fullWidth
        value={selectedProcess || ""}
        onChange={handleProcessChange}
        disabled={loading || !selectedPlace || !selectedService}
      >
        {process.map((proces) => (
          <MenuItem key={proces.process_id} value={proces.process_id}>
            {proces.name}
          </MenuItem>
        ))}
      </TextField>

      {loading && (
        <Box sx={{ mt: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="body2" sx={{ color: "gray" }}>
            Cargando procesos...
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default memo(ProcessSelect);
