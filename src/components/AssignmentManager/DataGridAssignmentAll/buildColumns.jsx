
import { Typography, Box, Avatar, Button } from "@mui/material";
import React, { useMemo, useState } from "react";
import Viewer from "react-viewer";

const ColumnsConfig = ({ onViewDetails }) => {
  return useMemo(() => {
    return [
      {
        field: "gestor",
        headerName: "NOMBRE",
        flex: 2,
        editable: false,
        renderCell: (params) => (
          <Box sx={{ display: "flex", alignItems: "center", p: "12px" }}>
            <AvatarImage data={params.row.imagen_usuario} />
            <Typography variant="h6" sx={{ marginLeft: 1 }}>
              {params.value}
            </Typography>
          </Box>
        ),
      },
      {
        field: "total_cuentas",
        headerName: "CUENTAS ASIGNADAS",
        flex: 1,
        editable: false,
        renderCell: (params) => (
          <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "1.2em", textAlign: "center" }}>
            {params.value}
          </Typography>
        ),
      },
      {
        field: "total_cuentas_activas",
        headerName: "CUENTAS ACTIVAS",
        flex: 1,
        editable: false,
        renderCell: (params) => (
          <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "1.2em", textAlign: "center" }}>
            {params.value}
          </Typography>
        ),
      },
      {
        field: "total_cuentas_inactivas",
        headerName: "CUENTAS INACTIVAS",
        flex: 1,
        editable: false,
        renderCell: (params) => (
          <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "1.2em", textAlign: "center" }}>
            {params.value}
          </Typography>
        ),
      },
      {
        field: "acciones",
        headerName: "Acciones",
        flex: 1,
        sortable: false,
        renderCell: (params) => (
          <Button
            variant="contained"
            size="small"
            onClick={() => onViewDetails(params.row)}
          >
            Ver
          </Button>
        ),
      },
    ];
  }, [onViewDetails]);
};

const AvatarImage = ({ data }) => {
  const [visibleAvatar, setVisibleAvatar] = useState(false);
  return (
    <>
      <Avatar
        onClick={() => setVisibleAvatar(true)}
        alt="Imagen de usuario"
        src={data}
        sx={{ cursor: "pointer" }}
      />
      <Viewer
        visible={visibleAvatar}
        onClose={() => setVisibleAvatar(false)}
        images={[{ src: data, alt: "avatar" }]}
      />
    </>
  );
};

export default ColumnsConfig;
