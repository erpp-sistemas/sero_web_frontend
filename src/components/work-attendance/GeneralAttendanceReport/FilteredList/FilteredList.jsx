import React from "react";
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, Tooltip, IconButton, Divider, ListItemIcon, Typography } from "@mui/material";
import { DoneAll, CloudDownload, Preview, SubdirectoryArrowRight, SubdirectoryArrowLeft, Warning, Error } from "@mui/icons-material";

const FilteredList = ({ resultCountsEntry, resultCountsExit, handleDownloadExcel, handleOpenModal, totalRecords, colors, theme }) => { 
  if (!totalRecords) {
    return 
  }

  const resultIcons = {
    "Asistencia correcta": <DoneAll color="secondary" />,
    "Retardo": <Warning color="warning" />,
    "Falta": <Error color="error" />,
    "Dia incompleto": <Warning color="warning" />,
  };

  return (    
    <List sx={{ width: '100%', maxWidth: 500, bgcolor: colors.primary[400] }}>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <DoneAll color="secondary" />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={`Registros encontrados: ${totalRecords}`} />
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem sx={{ backgroundColor: theme.palette.info.main }}>
        <ListItemIcon>
          <SubdirectoryArrowRight />
        </ListItemIcon>
        <ListItemText primary={`Entrada`} />
      </ListItem>
      <Divider variant="inset" component="li" />
      {/* Maneja el caso en que resultCountsEntry esté vacío */}
      {Object.entries(resultCountsEntry || {}).length > 0 ? (
        Object.entries(resultCountsEntry).map(([result, count]) => (
          <React.Fragment key={result}>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  {resultIcons[result]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={`${result}: ${count}`} />
              <ListItemSecondaryAction>
                <Tooltip title="Descargar" arrow>
                  <IconButton onClick={() => handleDownloadExcel(1, result)}>
                    <CloudDownload style={{ color: theme.palette.secondary.main }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Ver Registros" arrow>
                  <IconButton onClick={() => handleOpenModal(1, result)}>
                    <Preview style={{ color: theme.palette.info.main }} />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="No hay resultados de entrada." />
        </ListItem>
      )}
      <ListItem sx={{ backgroundColor: theme.palette.info.main }}>
        <ListItemIcon>
          <SubdirectoryArrowLeft />
        </ListItemIcon>
        <ListItemText primary={`Salida`} />
      </ListItem>
      <Divider variant="inset" component="li" />
      {/* Maneja el caso en que resultCountsExit esté vacío */}
      {Object.entries(resultCountsExit || {}).length > 0 ? (
        Object.entries(resultCountsExit).map(([results, counts]) => (
          <React.Fragment key={results}>
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  {resultIcons[results]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={`${results}: ${counts}`} />
              <ListItemSecondaryAction>
                <Tooltip title="Descargar" arrow>
                  <IconButton onClick={() => handleDownloadExcel(2, results)}>
                    <CloudDownload style={{ color: theme.palette.secondary.main }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Ver Registros" arrow>
                  <IconButton onClick={() => handleOpenModal(2, results)}>
                    <Preview style={{ color: theme.palette.info.main }} />
                  </IconButton>
                </Tooltip>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))
      ) : (
        <ListItem>
          <ListItemText primary="No hay resultados de salida." />
        </ListItem>
      )}
    </List>
  );
};

export default FilteredList;
