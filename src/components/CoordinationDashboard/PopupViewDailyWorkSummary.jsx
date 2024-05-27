import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

function PopupViewPositionDailyWorkSummary({ open, onClose, userId, dateCapture }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Detalles del Usuario</DialogTitle>
      <DialogContent>
        <Typography variant="body1">User ID: {userId}</Typography>
        <Typography variant="body1">Date Capture: {dateCapture}</Typography>
        {/* Aquí puedes añadir más contenido según tus necesidades */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PopupViewPositionDailyWorkSummary;
