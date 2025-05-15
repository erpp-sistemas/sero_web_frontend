import React, { useState } from "react";
import { Box, Typography, Chip, Grid } from "@mui/material";

const StatusSummary = ({
  data,
  filteredData,
  field,
  onChipClick,
  colors,
  title,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Si filteredData tiene datos, se utiliza para calcular los contadores; 
  // en caso contrario se utiliza data.
  const counts = React.useMemo(() => {
    const activeData = filteredData && filteredData.length > 0 ? filteredData : data;
    return activeData.reduce((acc, item) => {
      const value = item[field];
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  }, [data, filteredData, field]);

  const handleChipClick = (status) => {
    if (selectedStatus === status) {
      setSelectedStatus(null); // Deseleccionar el filtro
      onChipClick(field, null); // Mostrar toda la información
    } else {
      setSelectedStatus(status); // Aplicar el filtro
      onChipClick(field, status);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: colors.primary[400],
        padding: "10px",
        borderRadius: "10px",
        marginBottom: "20px",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          color: colors.accentGreen[100],
          marginBottom: "10px",
        }}
      >
        {title}
      </Typography>
      <Grid container spacing={1} wrap="nowrap" sx={{ overflowX: "auto" }}>
        {Object.entries(counts).map(([status, count]) => (
          <Grid item key={status}>
            <Chip
              label={`${status}: ${count}`}
              onClick={() => handleChipClick(status)}
              sx={{
                backgroundColor:
                  selectedStatus === status
                    ? colors.accentGreen[100]
                    : colors.tealAccent[400],
                color: "black",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: colors.accentGreen[200],
                },
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StatusSummary;