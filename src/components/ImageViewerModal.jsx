import React, { useState } from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function ImageViewerModal({ open, onClose, imageUrl }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: 'rgba(128, 128, 128, 0.5)',
          boxShadow: 24,
          p: 4,
          maxWidth: "80%",
          maxHeight: "80%",
          overflow: "auto",
          borderRadius: 4,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Imagen</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <img src={imageUrl} alt="Imagen" style={{ maxWidth: "100%", maxHeight: "100%" }} />
      </Box>
    </Modal>
  );
}

export default ImageViewerModal;
