import { CloudDownload, Preview } from "@mui/icons-material";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { tokens } from "../../theme";
import { color } from "echarts";

function ClasificacionesSection({
  clasificaciones,
  handleExportToExcel,
  handleFilteredRows,
  typeFilter,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [Range1, Range2, Range3, Range4, Range5, Range6, Range7, Range8] =
    clasificaciones;

  console.log(clasificaciones)

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <List
        sx={{
          width: "100%",
          bgcolor: "rgba(128, 128, 128, 0.1)",
          borderRadius: "8px",
          boxShadow: 3,
          padding: 0,
        }}
      >
        {/* Encabezado de la "tabla" */}
        <ListItem
          sx={{
            borderBottom: "2px solid #ddd",
            fontWeight: "bold",
            padding: "4px 8px",
          }}
        >
          <ListItemText
            primary={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ flex: 1, textAlign: "center", color: colors.accentGreen[100], fontWeight: "bold" }}
                >
                  Rango
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ flex: 1, textAlign: "center", color: colors.accentGreen[100], fontWeight: "bold" }}
                >
                  Total Pagado
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ flex: 1, textAlign: "center", color: colors.accentGreen[100], fontWeight: "bold" }}
                >
                  Cuentas Pagadas
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ flex: 1, textAlign: "center", color: colors.accentGreen[100], fontWeight: "bold" }}
                >
                  Acciones
                </Typography>
              </Box>
            }
          />
        </ListItem>

        {/* Rango 2 */}
        <ListItem
          sx={{
            padding: "2px 0px",
            borderRadius: "12px",
            border:
              typeFilter === 8 ? "3px solid #F4D03F" : "3px solid transparent",
            animation:
              typeFilter === 8 ? "borderAnimation 2s infinite" : "none",
            "@keyframes borderAnimation": {
              "0%": { borderColor: "transparent" },
              "50%": { borderColor: "#00ff00" },
              "100%": { borderColor: "transparent" },
            },
          }}
        >
          <ListItemText
            primary={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ flex: 1, textAlign: "center" }}
                >
                  {Range1.rango}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    color: colors.accentGreen[100],
                    fontWeight: "bold",
                  }}
                >
                  {Range1.total_pagado
                    ? `$ ${Range1.total_pagado.toLocaleString()}`
                    : "$ 0"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ flex: 1, textAlign: "center" }}
                >
                  {Range1.cuentas_pagadas || 0}
                </Typography>

                {/* Acciones */}
                <Box
                  sx={{ flex: 1, display: "flex", justifyContent: "center" }}
                >
                  <Tooltip title="Descargar" arrow>
                    <IconButton
                      onClick={() => handleExportToExcel(8)}
                      size="small"
                    >
                      <CloudDownload sx={{color: colors.accentGreen[100]}} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Ver Registros" arrow>
                    <IconButton
                      onClick={() => handleFilteredRows(8)}
                      size="small"
                    >
                      <Preview sx={{color: colors.accentGreen[100]}} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            }
          />
        </ListItem>
        {/* Rango 1 */}
        <ListItem
          sx={{
            padding: "2px 0px",
            borderRadius: "12px",
            border:
              typeFilter === 9 ? "3px solid #F4D03F" : "3px solid transparent",
            animation:
              typeFilter === 9 ? "borderAnimation 2s infinite" : "none",
            "@keyframes borderAnimation": {
              "0%": { borderColor: "transparent" },
              "50%": { borderColor: "#00ff00" },
              "100%": { borderColor: "transparent" },
            },
          }}
        >
          <ListItemText
            primary={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ flex: 1, textAlign: "center" }}
                >
                  {Range2.rango}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    color: colors.accentGreen[100],
                    fontWeight: "bold"
                  }}
                >
                  {Range2.total_pagado
                    ? `$ ${Range2.total_pagado.toLocaleString()}`
                    : "$ 0"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ flex: 1, textAlign: "center" }}
                >
                  {Range2.cuentas_pagadas || 0}
                </Typography>

                {/* Acciones */}
                <Box
                  sx={{ flex: 1, display: "flex", justifyContent: "center" }}
                >
                  <Tooltip title="Descargar" arrow>
                    <IconButton
                      onClick={() => handleExportToExcel(9)}
                      size="small"
                    >
                      <CloudDownload sx={{color: colors.accentGreen[100]}} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Ver Registros" arrow>
                    <IconButton
                      onClick={() => handleFilteredRows(9)}
                      size="small"
                    >
                      <Preview sx={{color: colors.accentGreen[100]}} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            }
          />
        </ListItem>
        {/* Rango 1 */}
        <ListItem
          sx={{
            padding: "2px 0px",
            borderRadius: "12px",
            border:
              typeFilter === 10 ? "3px solid #F4D03F" : "3px solid transparent",
            animation:
              typeFilter === 10 ? "borderAnimation 2s infinite" : "none",
            "@keyframes borderAnimation": {
              "0%": { borderColor: "transparent" },
              "50%": { borderColor: "#00ff00" },
              "100%": { borderColor: "transparent" },
            },
          }}
        >
          <ListItemText
            primary={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ flex: 1, textAlign: "center" }}
                >
                  {Range3.rango}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    color: colors.accentGreen[100],
                    fontWeight: "bold"
                  }}
                >
                  {Range3.total_pagado
                    ? `$ ${Range3.total_pagado.toLocaleString()}`
                    : "$ 0"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ flex: 1, textAlign: "center" }}
                >
                  {Range3.cuentas_pagadas || 0}
                </Typography>

                {/* Acciones */}
                <Box
                  sx={{ flex: 1, display: "flex", justifyContent: "center" }}
                >
                  <Tooltip title="Descargar" arrow>
                    <IconButton
                      onClick={() => handleExportToExcel(10)}
                      size="small"
                    >
                      <CloudDownload sx={{color: colors.accentGreen[100]}} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Ver Registros" arrow>
                    <IconButton
                      onClick={() => handleFilteredRows(10)}
                      size="small"
                    >
                      <Preview sx={{color: colors.accentGreen[100]}} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            }
          />
        </ListItem>

        {/* Rango 1 */}
        <ListItem
          sx={{
            padding: "2px 0px",
            borderRadius: "12px",
            border:
              typeFilter === 11 ? "3px solid #F4D03F" : "3px solid transparent",
            animation:
              typeFilter === 11 ? "borderAnimation 2s infinite" : "none",
            "@keyframes borderAnimation": {
              "0%": { borderColor: "transparent" },
              "50%": { borderColor: "#00ff00" },
              "100%": { borderColor: "transparent" },
            },
          }}
        >
          <ListItemText
            primary={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ flex: 1, textAlign: "center" }}
                >
                  {Range4.rango}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    color: colors.accentGreen[100],
                    fontWeight: "bold"
                  }}
                >
                  {Range4.total_pagado
                    ? `$ ${Range4.total_pagado.toLocaleString()}`
                    : "$ 0"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ flex: 1, textAlign: "center" }}
                >
                  {Range4.cuentas_pagadas || 0}
                </Typography>

                {/* Acciones */}
                <Box
                  sx={{ flex: 1, display: "flex", justifyContent: "center" }}
                >
                  <Tooltip title="Descargar" arrow>
                    <IconButton
                      onClick={() => handleExportToExcel(11)}
                      size="small"
                    >
                      <CloudDownload sx={{color: colors.accentGreen[100]}} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Ver Registros" arrow>
                    <IconButton
                      onClick={() => handleFilteredRows(11)}
                      size="small"
                    >
                      <Preview sx={{color: colors.accentGreen[100]}} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            }
          />
        </ListItem>

        {/* Rango 1 */}
        <ListItem
          sx={{
            padding: "2px 0px",
            borderRadius: "12px",
            border:
              typeFilter === 12 ? "3px solid #F4D03F" : "3px solid transparent",
            animation:
              typeFilter === 12 ? "borderAnimation 2s infinite" : "none",
            "@keyframes borderAnimation": {
              "0%": { borderColor: "transparent" },
              "50%": { borderColor: "#00ff00" },
              "100%": { borderColor: "transparent" },
            },
          }}
        >
          <ListItemText
            primary={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ flex: 1, textAlign: "center" }}
                >
                  {Range5.rango}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    color: colors.accentGreen[100],
                    fontWeight: "bold"
                  }}
                >
                  {Range5.total_pagado
                    ? `$ ${Range5.total_pagado.toLocaleString()}`
                    : "$ 0"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ flex: 1, textAlign: "center" }}
                >
                  {Range5.cuentas_pagadas || 0}
                </Typography>

                {/* Acciones */}
                <Box
                  sx={{ flex: 1, display: "flex", justifyContent: "center" }}
                >
                  <Tooltip title="Descargar" arrow>
                    <IconButton
                      onClick={() => handleExportToExcel(12)}
                      size="small"
                    >
                      <CloudDownload sx={{color: colors.accentGreen[100]}} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Ver Registros" arrow>
                    <IconButton
                      onClick={() => handleFilteredRows(12)}
                      size="small"
                    >
                      <Preview sx={{color: colors.accentGreen[100]}} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            }
          />
        </ListItem>
        {/* Rango 1 */}
        <ListItem
          sx={{
            padding: "2px 0px",
            borderBottom: "1px solid #ddd",
            borderRadius: "12px",
            border:
              typeFilter === 13 ? "3px solid #F4D03F" : "3px solid transparent",
            animation:
              typeFilter === 13 ? "borderAnimation 2s infinite" : "none",
            "@keyframes borderAnimation": {
              "0%": { borderColor: "transparent" },
              "50%": { borderColor: "#00ff00" },
              "100%": { borderColor: "transparent" },
            },
          }}
        >
          <ListItemText
            primary={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ flex: 1, textAlign: "center" }}
                >
                  {Range6.rango}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    color: colors.accentGreen[100],
                    fontWeight: "bold"
                  }}
                >
                  {Range6.total_pagado
                    ? `$ ${Range6.total_pagado.toLocaleString()}`
                    : "$ 0"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ flex: 1, textAlign: "center" }}
                >
                  {Range6.cuentas_pagadas || 0}
                </Typography>

                {/* Acciones */}
                <Box
                  sx={{ flex: 1, display: "flex", justifyContent: "center" }}
                >
                  <Tooltip title="Descargar" arrow>
                    <IconButton
                      onClick={() => handleExportToExcel(13)}
                      size="small"
                    >
                      <CloudDownload sx={{color: colors.accentGreen[100]}} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Ver Registros" arrow>
                    <IconButton
                      onClick={() => handleFilteredRows(13)}
                      size="small"
                    >
                      <Preview sx={{color: colors.accentGreen[100]}} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            }
          />
        </ListItem>
        {/* Rango 1 */}
        <ListItem
          sx={{
            padding: "2px 0px",
            borderBottom: "1px solid #ddd",
            borderRadius: "12px",
            border:
              typeFilter === 14 ? "3px solid #F4D03F" : "3px solid transparent",
            animation:
              typeFilter === 14 ? "borderAnimation 2s infinite" : "none",
            "@keyframes borderAnimation": {
              "0%": { borderColor: "transparent" },
              "50%": { borderColor: "#00ff00" },
              "100%": { borderColor: "transparent" },
            },
          }}
        >
          <ListItemText
            primary={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ flex: 1, textAlign: "center" }}
                >
                  {Range7.rango}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    color: colors.accentGreen[100],
                    fontWeight: "bold"
                  }}
                >
                  {Range7.total_pagado
                    ? `$ ${Range7.total_pagado.toLocaleString()}`
                    : "$ 0"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ flex: 1, textAlign: "center" }}
                >
                  {Range7.cuentas_pagadas || 0}
                </Typography>

                {/* Acciones */}
                <Box
                  sx={{ flex: 1, display: "flex", justifyContent: "center" }}
                >
                  <Tooltip title="Descargar" arrow>
                    <IconButton
                      onClick={() => handleExportToExcel(14)}
                      size="small"
                    >
                      <CloudDownload sx={{color: colors.accentGreen[100]}} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Ver Registros" arrow>
                    <IconButton
                      onClick={() => handleFilteredRows(14)}
                      size="small"
                    >
                      <Preview sx={{color: colors.accentGreen[100]}} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            }
          />
        </ListItem>
        {/* Rango 1 */}
        <ListItem
          sx={{
            padding: "2px 0px",
            borderBottom: "1px solid #ddd",
            borderRadius: "12px",
            border:
              typeFilter === 15 ? "3px solid #F4D03F" : "3px solid transparent",
            animation:
              typeFilter === 15 ? "borderAnimation 2s infinite" : "none",
            "@keyframes borderAnimation": {
              "0%": { borderColor: "transparent" },
              "50%": { borderColor: "#00ff00" },
              "100%": { borderColor: "transparent" },
            },
          }}
        >
          <ListItemText
            primary={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ flex: 1, textAlign: "center" }}
                >
                  {Range8.rango}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    textAlign: "center",
                    color: colors.accentGreen[100],
                    fontWeight: "bold"
                  }}
                >
                  {Range8.total_pagado
                    ? `$ ${Range8.total_pagado.toLocaleString()}`
                    : "$ 0"}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ flex: 1, textAlign: "center" }}
                >
                  {Range8.cuentas_pagadas || 0}
                </Typography>

                {/* Acciones */}
                <Box
                  sx={{ flex: 1, display: "flex", justifyContent: "center" }}
                >
                  <Tooltip title="Descargar" arrow>
                    <IconButton
                      onClick={() => handleExportToExcel(15)}
                      size="small"
                    >
                      <CloudDownload sx={{color: colors.accentGreen[100]}} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Ver Registros" arrow>
                    <IconButton
                      onClick={() => handleFilteredRows(15)}
                      size="small"
                    >
                      <Preview sx={{color: colors.accentGreen[100]}} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            }
          />
        </ListItem>
      </List>
    </>
  );
}

export default ClasificacionesSection;
