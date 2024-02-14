import { Box, Button, Typography, useTheme } from "@mui/material";
import React, { useRef, useState } from "react";
import VerifiedIcon from "@mui/icons-material/Verified";
import { tokens } from "../../../../theme";

function PlaceButton({ plaza,setButtons}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [selected, setSelected] = useState(false);
  const cardRef = useRef(null);
  

  const handleSelectionPlaza = () => {
    const cardElement = cardRef.current;

    if (selected) {
      cardElement.style.backgroundColor = null;
      setButtons((prevButtons) => ({
        ...prevButtons,
        [`button${plaza?.id_plaza}`]: selected ? "" : null,
      }));
    } else {
      cardElement.style.backgroundColor = "rgba(46, 124, 103, 0.3)";
      setButtons((prevButtons) => ({
        ...prevButtons,
        [`button${plaza?.id_plaza}`]: selected ? "" : plaza?.id_plaza,
      }));
    }

    setSelected(!selected);

  
   

    // Aquí puedes realizar otras acciones con la plaza seleccionada si es necesario
  };

  return (
    <Box
      ref={cardRef}
      sx={{ padding: "20px", borderRadius: "7px" }}
      id={plaza?.id_plaza.toString()}
    >
      <Typography
        variant="caption"
        sx={{
          display: "inline-block",
          fontSize: "14px",
          color: colors.greenAccent[400],
        }}
      >
        {plaza?.nombre}
      </Typography>
      <img
        src={plaza?.imagen}
        alt="logo imagen"
        style={{
          width: "120px",
          height: "120px",
          marginBottom: "10px",
        }}
      />
      <Button
        sx={{ width: "100%", color: colors.grey[200] }}
        onClick={handleSelectionPlaza}
      >
        <VerifiedIcon
          sx={{
            fontSize: "36px",
            color: selected ? "green" : "gray",
          }}
        />
      </Button>
    </Box>
  );
}

export default PlaceButton;
