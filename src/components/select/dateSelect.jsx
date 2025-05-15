import React from "react";
import { tokens } from "../../theme";
import { useTheme, TextField } from "@mui/material";

function dateSelect({
  label,
  selectedDate,
  handleDateChange,
  setSelectedDate,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <TextField
      label={label}
      type="date"
      value={selectedDate}
      onChange={(e) => {
        setSelectedDate(e.target.value);
        handleDateChange(e);
      }}
      InputLabelProps={{
        shrink: true,
      }}
      sx={{
        width: "100%",
        "& input[type='date']::-webkit-calendar-picker-indicator": {
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='${encodeURIComponent(
            colors.accentGreen[100]
          )}'%3E%3Cpath d='M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM5 20V9h14v11H5zm3-9h2v2H8v-2zm0 4h2v2H8v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2zm4-4h2v2h-2v-2zm0 4h2v2h-2v-2z'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          cursor: "pointer",
          width: "20px",
          height: "20px",
        },
      }}
    />
  );
}

export default dateSelect;
