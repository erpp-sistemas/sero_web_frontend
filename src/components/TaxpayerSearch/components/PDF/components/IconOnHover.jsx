import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import "./styles/IconOnHover.css";

// const opciones = {
//   cancel: () => {},
//   succes: () => {},
// };
// const opcion = "cancel";
// opciones[opcion]();
const IconOnHover = ({ children, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ display: "inline-block" }}
      className="icons-on-hover-container"
    >
      <div
        className="icons-on-hover"
        style={{ display: isHovered ? "flex" : "none" }}
      >
        <IconButton
          onClick={onClick}
          className="icon"
          color="primary"
          aria-label="delete"
        >
          <DownloadIcon />
        </IconButton>
        {/* <IconButton className="icon" color="primary" aria-label="edit">
          <EditIcon />
        </IconButton> */}
      </div>

      <div>{children}</div>
      <div>¡Pasa el ratón aquí!</div>
    </div>
  );
};

export default IconOnHover;
