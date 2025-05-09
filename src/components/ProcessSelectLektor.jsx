import React, { useState, useEffect, memo } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";
import { getPlaceServiceFormByUserId } from "../services/form.service";

function ProcessSelectLektor({
  selectedPlace,
  selectedService,
  selectedProcess,
  handleProcessChange,
}) {
  const user = useSelector((state) => state.user);
  const [process, setProcess] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProcesses = async () => {
      if (selectedPlace && selectedService) {
        setLoading(true);
        try {
          const res = await getPlaceServiceFormByUserId(
            user.user_id,
            selectedPlace,
            selectedService
          );
          setProcess(res);

          // Seleccionar automáticamente el primer proceso si hay datos y no hay un valor seleccionado
          if (res.length > 0 && !selectedProcess) {
            handleProcessChange({ target: { value: res[0].form_id } });
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
          <MenuItem key={proces.form_id} value={proces.form_id}>
            {proces.name}
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
            Cargando procesos...
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default memo(ProcessSelectLektor);
