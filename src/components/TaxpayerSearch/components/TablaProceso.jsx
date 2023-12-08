// const TablaProceso = () => {
import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Paper,
  Container,
  Box,
} from "@mui/material";
import {
  Assignment,
  WorkOutline,
  AssignmentInd,
  DateRange,
  DoneAll,
} from "@mui/icons-material";
import { dateConverter } from "../helpers/dateConverter";

const data = [
  {
    proceso: "Proceso 1",
    servicio: "Servicio A",
    tarea: "Tarea X",
    gestor: "Gestor 1",
    fechaDeCaptura: "2023-10-01",
  },
  {
    proceso: "Proceso 2",
    servicio: "Servicio B",
    tarea: "Tarea Y",
    gestor: "Gestor 2",
    fechaDeCaptura: "2023-10-02",
  },
  {
    proceso: "Proceso 3",
    servicio: "Servicio C",
    tarea: "Tarea Z",
    gestor: "Gestor 3",
    fechaDeCaptura: "2023-10-03",
  },
  {
    proceso: "Proceso 4",
    servicio: "Servicio D",
    tarea: "Tarea W",
    gestor: "Gestor 4",
    fechaDeCaptura: "2023-10-04",
  },
];

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  listItem: {
    display: "flex",
    flexGrow: 1,
    width: "fit-content",
  },
};

const TablaProceso = ({acciones}) => {
  console.log(acciones);
  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Acciones realizadas
      </Typography>
      <Paper elevation={3}>
        <List
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
            width: "100%",
          }}
        >
          {acciones?.slice(0,1)?.map((item, index) => {
            console.log(item);
            return(
            <ListItem key={index} style={styles.listItem}>
              <ListItemIcon>
                <Assignment />
              </ListItemIcon>
              <ListItemText>
                {/* <Typography
                  style={{ color: "var(--color-text)" }}
                  variant="subtitle1"
                >
                  {item.proceso}
                </Typography>
                <Typography variant="body2">{item.servicio}</Typography> */}
                <Typography variant="body2">{item.taskDone}</Typography>
                <Typography variant="body2">{item.personWhoCapture}</Typography>
                <Typography variant="body2">
                  <DateRange /> {dateConverter(item.dateCapture)}
                </Typography>
              </ListItemText>
            </ListItem>
          )})}
        </List>
      </Paper>
    </Container>
  );
};

export default TablaProceso;
