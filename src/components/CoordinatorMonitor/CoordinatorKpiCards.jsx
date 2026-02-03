// src/components/HomeCoordination/CoordinatorKpiCards.jsx
import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

const CoordinatorKpiCards = ({ data = [] }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  /* ======================================================
     KPIs CALCULADOS DESDE EL DATASET
  ====================================================== */

  const gestoresActivos = new Set(data.map((d) => d.id_usuario)).size;

  const prediosLocalizados = data.filter(
    (d) => d.estatus_predio === "Predio localizado",
  ).length;

  const prediosNoLocalizados = data.length - prediosLocalizados;

  const gestionesConFoto = data.filter((d) => d.total_fotos > 0).length;
  const gestionesSinFoto = data.length - gestionesConFoto;

  const totalGestiones = data.length;

  const gestionesCompletas = data.filter(
    (d) => d.estatus_gestion === "COMPLETA",
  ).length;

  const gestionesIncompletas = data.filter(
    (d) => d.estatus_gestion === "INCOMPLETA",
  ).length;

  /* ======================================================
     CARD BASE
  ====================================================== */

  const Card = ({ icon, title, children }) => (
    <Box
      className="p-4 rounded-xl shadow-sm"
      sx={{
        backgroundColor: colors.bgContainer,
        display: "flex",
        alignItems: "center",
        gap: 2,
      }}
    >
      <Box sx={{ color: colors.grey[500], fontSize: 28 }}>{icon}</Box>
      <Box>{children}</Box>
    </Box>
  );

  return (
    <Box className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-6">
      {/* ================== Gestores activos ================== */}
      <Card icon={<GroupsOutlinedIcon />}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {gestoresActivos}
        </Typography>
        <Typography variant="body2" sx={{ color: colors.grey[400] }}>
          Gestores activos
        </Typography>
      </Card>

      {/* ================== Predios ================== */}
      <Card icon={<LocationOnOutlinedIcon />}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {prediosLocalizados}
          <Typography
            component="span"
            sx={{ color: colors.redAccent[400], fontWeight: 500 }}
          >
            {" "}
            / {prediosNoLocalizados}
          </Typography>
        </Typography>
        <Typography variant="caption" sx={{ color: colors.grey[400] }}>
          Localizados / No localizados
        </Typography>
      </Card>

      {/* ================== Evidencia fotográfica ================== */}
      <Card icon={<PhotoCameraOutlinedIcon />}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {gestionesConFoto}
          <Typography
            component="span"
            sx={{ color: colors.redAccent[400], fontWeight: 500 }}
          >
            {" "}
            / {gestionesSinFoto}
          </Typography>
        </Typography>
        <Typography variant="body2" sx={{ color: colors.grey[400] }}>
          Con foto / Sin foto
        </Typography>
      </Card>

      {/* ================== Total gestiones ================== */}
      <Card icon={<AssignmentOutlinedIcon />}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {totalGestiones}
        </Typography>
        <Typography variant="body2" sx={{ color: colors.grey[400] }}>
          Total de gestiones
        </Typography>
      </Card>

      {/* ================== Gestiones ================== */}
      <Card icon={<CheckCircleOutlineIcon />}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {gestionesCompletas}
          <Typography
            component="span"
            sx={{ color: colors.redAccent[400], fontWeight: 500 }}
          >
            {" "}
            / {gestionesIncompletas}
          </Typography>
        </Typography>
        <Typography variant="body2" sx={{ color: colors.grey[400] }}>
          Completas / Incompletas
        </Typography>
      </Card>
    </Box>
  );
};

export default CoordinatorKpiCards;
