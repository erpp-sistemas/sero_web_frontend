import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Tooltip,
  IconButton,
  Divider,
  ListItemIcon,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import {
  DoneAll,
  CloudDownload,
  Preview,
  SubdirectoryArrowRight,
  SubdirectoryArrowLeft,
  Warning,
  Error,
  RunningWithErrors,
  Login,
  Logout,
  BeachAccess,
  AttachMoney,
  MoneyOff,
  LocalHospital,
} from "@mui/icons-material";

const FilteredList = ({
  resultCountsEntry,
  resultCountsExit,
  handleDownloadExcel,
  handleOpenModal,
  totalRecords,
  colors,
  theme,
}) => {
  if (!totalRecords) {
    return null;
  }

  const resultIcons = {
    "Asistencia correcta": <DoneAll color="secondary" />,
    Vacaciones: <BeachAccess sx={{ color: colors.accentGreen[100] }} />,
    "Permiso con goce de sueldo": (
      <AttachMoney sx={{ color: colors.accentGreen[100] }} />
    ),
    "Permiso sin goce de sueldo": <MoneyOff color="warning" />,
    Incapacidad: <LocalHospital sx={{ color: colors.accentGreen[100] }} />,
    Retardo: <Warning color="warning" />,
    Falta: <Error color="error" />,
    "Dia incompleto": <Warning color="warning" />,
    "Registro incompleto": <RunningWithErrors color="error" />,
  };

  const sortedEntries = Object.entries(resultCountsEntry || {}).sort(
    (a, b) => b[1] - a[1]
  );
  const sortedExits = Object.entries(resultCountsExit || {}).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 500,
        bgcolor: colors.primary[400],
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: "bold", color: theme.palette.text.primary }}
        >
          <strong>Registros encontrados:</strong>{" "}
          <span style={{ fontWeight: "bold", color: colors.accentGreen[100] }}>
            {totalRecords}
          </span>
        </Typography>
        <List>
          <ListItem
            sx={{ backgroundColor: colors.accentGreen[100], borderRadius: 1 }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: "transparent", // Fondo transparente
                  border: `2px solid ${colors.contentSearchButton[100]}`, // Borde del color deseado
                  width: 40, // Tamaño personalizado
                  height: 40,
                }}
              >
                <Login sx={{ color: colors.contentSearchButton[100] }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: colors.contentSearchButton[100],
                  }}
                >
                  Entrada
                </Typography>
              }
            />
          </ListItem>
          <Divider />
          {sortedEntries.length > 0 ? (
            sortedEntries.map(([result, count]) => (
              <React.Fragment key={result}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: "transparent", // Fondo transparente
                        border: `2px solid ${colors.accentGreen[100]}`, // Borde del color deseado
                        width: 40, // Tamaño personalizado
                        height: 40,
                      }}
                    >
                      {resultIcons[result]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <span>
                        <strong>{result}:</strong>{" "}
                        <span
                          style={{
                            fontWeight: "bold",
                            color: colors.accentGreen[100],
                          }}
                        >
                          {count}
                        </span>
                      </span>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Descargar" arrow>
                      <IconButton
                        onClick={() => handleDownloadExcel(1, result)}
                      >
                        <CloudDownload
                          style={{ color: colors.accentGreen[100] }}
                        />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ver Registros" arrow>
                      <IconButton onClick={() => handleOpenModal(1, result)}>
                        <Preview style={{ color: theme.palette.info.main }} />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No hay resultados de entrada." />
            </ListItem>
          )}

          <ListItem
            sx={{ backgroundColor: colors.accentGreen[100], borderRadius: 1 }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  bgcolor: "transparent", // Fondo transparente
                  border: `2px solid ${colors.contentSearchButton[100]}`, // Borde del color deseado
                  width: 40, // Tamaño personalizado
                  height: 40,
                }}
              >
                <Logout sx={{ color: colors.contentSearchButton[100] }} />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color: colors.contentSearchButton[100],
                  }}
                >
                  Salida
                </Typography>
              }
            />
          </ListItem>
          <Divider />
          {sortedExits.length > 0 ? (
            sortedExits.map(([results, counts]) => (
              <React.Fragment key={results}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: "transparent", // Fondo transparente
                        border: `2px solid ${colors.accentGreen[100]}`, // Borde del color deseado
                        width: 40, // Tamaño personalizado
                        height: 40,
                      }}
                    >
                      {resultIcons[results]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <span>
                        <strong>{results}:</strong>{" "}
                        <span
                          style={{
                            fontWeight: "bold",
                            color: colors.accentGreen[100],
                          }}
                        >
                          {counts}
                        </span>
                      </span>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Descargar" arrow>
                      <IconButton
                        onClick={() => handleDownloadExcel(2, results)}
                      >
                        <CloudDownload
                          style={{ color: colors.accentGreen[100] }}
                        />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Ver Registros" arrow>
                      <IconButton onClick={() => handleOpenModal(2, results)}>
                        <Preview style={{ color: theme.palette.info.main }} />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No hay resultados de salida." />
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

export default FilteredList;
