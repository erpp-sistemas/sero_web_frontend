import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  IconButton,
  Typography,
  Grow,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { tokens } from "../../theme";

const InlineEditableText = ({ value, onChange, placeholder, minRows = 4 }) => {
  const [editing, setEditing] = useState(false);
  const [internalValue, setInternalValue] = useState(value);
  const inputRef = useRef(null);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
        const len = inputRef.current.value.length;
        inputRef.current.setSelectionRange(len, len);
      }, 50);
    }
  }, [editing]);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setInternalValue(value); // cancelar edición
      setEditing(false);
      inputRef.current.blur(); // quitar foco
    }
    if (e.key === "Enter" && !e.shiftKey) {
      setEditing(false);
      e.preventDefault(); // evitar salto de línea si no se desea
      inputRef.current.blur(); // quitar foco
    }
  };

  const handleChange = (e) => {
    setInternalValue(e.target.value);
    onChange(e.target.value); // cambio en tiempo real
  };

  const baseMinimalSx = {
    backgroundColor: "transparent",
    borderRadius: "8px",
    fontSize: "0.875rem",
    "& .MuiOutlinedInput-root": {
      transition: "all 0.25s ease",
      boxShadow: editing ? "0 2px 10px rgba(0,0,0,0.08)" : "none", // sombra sutil al enfocar
      borderRadius: "8px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(128,128,128,0.3)",
      transition: "border-color 0.25s ease",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0,120,212,0.6)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(0,120,212,1)",
    },
    "& input": {
      paddingRight: "36px",
      fontSize: "0.875rem",
      boxSizing: "border-box",
      transition: "all 0.25s ease",
    },
    "& textarea": {
      paddingRight: "36px", // espacio para el
      transition: "all 0.25s ease",
    },
    "& label": {
      fontSize: "0.875rem",
    },
  };

  return (
    <Grow in timeout={250}>
      <div style={{ position: "relative", marginBottom: 16 }}>
        {/* Título flotante */}
        <Typography
          variant="subtitle2"
          sx={{
            mb: 0.5,
            color: colors.grey[400],
            fontSize: "0.75rem",
          }}
        >
          {placeholder}
        </Typography>

        {/* TextField con icono flotante */}
        <TextField
          inputRef={inputRef}
          size="small"
          multiline
          minRows={editing ? minRows : 1}
          fullWidth
          variant="outlined"
          value={value}
          onFocus={() => setEditing(true)}
          onBlur={() => setEditing(false)}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={
            editing
              ? placeholder
              : `Haz click aquí para agregar ${placeholder.toLowerCase()}…`
          }
          sx={baseMinimalSx}
        />

        {/* Icono flotante dentro del TextField */}
        {value && !editing && (
          <IconButton
            size="small"
            sx={{
              position: "absolute",
              right: 8,
              top: "70%",
              transform: "translateY(-50%)",
              color: colors.grey[400],
              pointerEvents: "none", // no interfiere con la edición
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </div>
    </Grow>
  );
};

export default InlineEditableText;
