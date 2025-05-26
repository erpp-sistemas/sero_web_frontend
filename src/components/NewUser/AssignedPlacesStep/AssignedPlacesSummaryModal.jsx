import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const AssignedPlacesSummaryModal = ({ open, onClose, data, onConfirm }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Resumen de elementos asignados</DialogTitle>
      <DialogContent dividers>
        {data.length === 0 ? (
          <Typography color="textSecondary">
            No hay asignaciones aún.
          </Typography>
        ) : (
          <div className="text-sm max-h-[400px] overflow-auto pr-2">
            {data.map((plaza) => (
              <div key={plaza.id_plaza} className="mb-3">
                <Typography variant="subtitle2" color="info.main">
                  🏢 Plaza: {plaza.nombre_plaza}
                </Typography>
                {plaza.servicios.map((servicio) => (
                  <div key={servicio.id_servicio} className="ml-4 mb-2">
                    <Typography variant="body2" color="secondary">
                      🛠️ Servicio: {servicio.nombre_servicio}
                    </Typography>
                    <ul className="ml-6 list-disc">
                      {servicio.procesos.map((proceso) => (
                        <li key={proceso.id_proceso}>
                          🔄 Proceso: {proceso.nombre_proceso}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignedPlacesSummaryModal;
