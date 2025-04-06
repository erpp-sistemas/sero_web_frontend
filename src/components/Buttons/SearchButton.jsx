import React from "react";
import { tokens } from "../../theme";
import { useTheme, Button } from "@mui/material";
import { Search } from "@mui/icons-material";

function SearchButton({ onClick, text }) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Button
      variant="contained"
      style={{ width: "100%", height: "100%" }}
      onClick={() => {
        onClick();
      }}
      sx={{
        borderRadius: "35px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: { xs: "0 8px", md: "0 16px" }, // Ajusta el padding en pantallas pequeñas y grandes
        backgroundColor: colors.searchButton[100],
        color: colors.contentSearchButton[100],
        border: "1px solid #d5e3f5",
        boxShadow: "0 4px 6px rgba(255, 255, 255, 0.1)", // Sombra sutil
        ":hover": {
          backgroundColor: colors.searchButton[200],
          boxShadow: "0 8px 12px rgba(255, 255, 255, 0.2)",
        },
      }}
    >
      {/* Texto centrado */}
      <span
        style={{
          flex: 1,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {text}
      </span>

      {/* Icono al final */}
      <Search />
    </Button>
  );
}

export default SearchButton;
