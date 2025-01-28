import React, { useState, useEffect, memo } from "react";
import { useSelector } from "react-redux";
import { getPlaceServiceProcessByUserId } from "../services/process.service";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Lottie from "lottie-react";
import loadingAnimation from "../../public/loading-8.json";

function ProcessSelectMultipleChip({
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
          const res = await getPlaceServiceProcessByUserId(
            user.user_id,
            selectedPlace,
            selectedService
          );
          setProcess(res);

          // Si no hay procesos seleccionados, puedes establecer automáticamente el primer proceso
          if (selectedProcess.length === 0 && res.length > 0) {
            handleProcessChange({
              target: { value: [res[0].process_id] },
            });
          }
        } catch (error) {
          console.error("Error loading processes:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setProcess([]);
      }
    };

    loadProcesses();
  }, [user.user_id, selectedPlace, selectedService, handleProcessChange]);

  // Mapear los process_ids a sus nombres correspondientes
  const selectedProcessNames = selectedProcess.map(
    (selectedId) =>
      process.find((proces) => proces.process_id === selectedId)?.name || ""
  );

  return (
    <FormControl variant="outlined" sx={{ width: "100%" }}>
      <InputLabel id="process-multiple-chip-label">Procesos</InputLabel>
      <Select
        labelId="process-multiple-chip-label"
        id="process-multiple-chip"
        multiple
        value={selectedProcess}
        onChange={handleProcessChange}
        input={<OutlinedInput id="select-multiple-chip" label="Procesos" />}
        renderValue={() => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selectedProcessNames.map((name) => (
              <Chip key={name} label={name} />
            ))}
          </Box>
        )}
        disabled={loading || !selectedPlace || !selectedService}
      >
        {process.map((proces) => (
          <MenuItem key={proces.process_id} value={proces.process_id}>
            {proces.name}
          </MenuItem>
        ))}
      </Select>

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
          <Typography
            variant="body2"
            sx={{
              mr: 1,
              color: "gray",
            }}
          >
            Cargando...
          </Typography>
          <Lottie
            animationData={loadingAnimation}
            style={{ width: 60, height: 60 }}
          />
        </Box>
      )}
    </FormControl>
  );
}

export default memo(ProcessSelectMultipleChip);
