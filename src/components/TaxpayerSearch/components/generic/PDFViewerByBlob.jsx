import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Document, Page } from "react-pdf";
// import "../PDF/components/styles/PDFFromNodes.css";

const PDFViewerByBlob = ({ pdfBlob }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!pdfBlob) return;
  return (
    <div>
      <Button variant="contained" onClick={handleOpen}>
        Abrir PDF
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Visor de PDF</DialogTitle>
        <DialogContent>
          <Document file={URL.createObjectURL(pdfBlob)}>
            <Page pageNumber={1} />
          </Document>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PDFViewerByBlob;
