import React from "react";
import { Modal } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  AccessTime,
  AccessTimeRounded,
  Apartment,
  AttachMoney,
  BeachAccess,
  Business,
  CalendarMonth,
  Cancel,
  CheckCircle,
  Dangerous,
  EditRoad,
  InsertEmoticon,
  LocalHospital,
  MoneyOff,
  PersonPinCircle,
  Public,
  RunningWithErrors,
  SentimentVeryDissatisfied,
  SentimentVeryDissatisfiedOutlined,
  Smartphone,
  WarningAmber,
} from "@mui/icons-material";
import Viewer from "react-viewer";
import {
  useTheme,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  Tooltip,
} from "@mui/material";
import { tokens } from "../../theme";
import buildColumns from "./GeneralAttendanceReport/buildColumns.jsx";

const ModalTable = ({ open, onClose, data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const useBuildColumns = buildColumns();  

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: "80%",
          maxHeight: 500,
          overflow: "auto",
          bgcolor: "background.paper",
          mx: "auto",
          my: 4,
          p: 2,
          borderRadius: 4,
        }}
      >
        <Typography variant="h6" gutterBottom component="div">
          Registros
        </Typography>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={data}
            columns={useBuildColumns.map((column) => ({
              ...column,
              renderHeader: () => (
                <Typography
                  sx={{
                    color: colors.contentSearchButton[100],
                    fontWeight: "bold",
                  }}
                >
                  {column.headerName}
                </Typography>
              ),
            }))}
            getRowId={(row) => row.usuario_id}
            autoPageSize
            sx={{
              borderRadius: "8px",
              boxShadow: 3,
              padding: 0,
              background: "rgba(128, 128, 128, 0.1)",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.accentGreen[100], // Color de fondo deseado
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
              },
              "& .MuiDataGrid-footerContainer": {
                borderBottomLeftRadius: "8px",
                borderBottomRightRadius: "8px",
                backgroundColor: colors.accentGreen[100], // Fondo del footer (paginador)
                color: colors.contentSearchButton[100], // Color de texto dentro del footer
              },
              "& .MuiTablePagination-root": {
                color: colors.contentSearchButton[100], // Color del texto del paginador
              },
              // Estilos específicos para los íconos en el encabezado y pie de página
              "& .MuiDataGrid-columnHeaders .MuiSvgIcon-root, .MuiDataGrid-footerContainer .MuiSvgIcon-root":
                {
                  color: colors.contentSearchButton[100], // Color de los íconos (flechas)
                },
              // Evitar que los íconos en las celdas se vean afectados
              "& .MuiDataGrid-cell .MuiSvgIcon-root": {
                color: "inherit", // No afectar el color de los íconos en las celdas
              },
            }}
          />
        </div>
      </Box>
    </Modal>
  );
};

export default ModalTable;
