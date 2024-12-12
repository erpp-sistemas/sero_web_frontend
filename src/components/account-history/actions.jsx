import React from "react";
import Grid from "@mui/material/Grid";
import { tokens } from "../../theme";
import {
  Box,
  useTheme,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Viewer from "react-viewer";
import Chip from "@mui/material/Chip";
import { DirectionsRun, MarkEmailRead } from "@mui/icons-material";

const Actions = ({ action }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const parsedActions = Array.isArray(action) ? action : JSON.parse(action);

  const AvatarImage = ({ data }) => {
    const [visibleAvatar, setVisibleAvatar] = React.useState(false);
    return (
      <>
        <Avatar
          onClick={() => {
            setVisibleAvatar(true);
          }}
          alt="Remy Sharp"
          src={data}
        />

        <Viewer
          visible={visibleAvatar}
          onClose={() => {
            setVisibleAvatar(false);
          }}
          images={[{ src: data, alt: "avatar" }]}
        />
      </>
    );
  };

  if (parsedActions === null) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h4" component="h4" sx={{ fontWeight: "bold" }}>
            No se encontraron acciones
          </Typography>
        </Grid>
      </Grid>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const datePart = date.toLocaleDateString();
    const timePart = date.toLocaleTimeString();
    return `${datePart} ${timePart}`;
  };

  const sortedActions = parsedActions.sort(
    (a, b) => new Date(b.date_capture) - new Date(a.date_capture)
  );

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-evenly"
        flexWrap="wrap"
        gap="20px"
        padding="15px 10px"
        borderRadius="10px"
      >
        <Grid container spacing={2}>
          {sortedActions.map((actions, index) => (
            <Grid key={index} item xs={12} md={4}>
              <Box
                sx={{
                  backgroundColor: "rgba(128, 128, 128, 0.1)",
                  borderRadius: "8px",
                  boxShadow: 3,
                  padding: 1.5,
                }}
              >
                <List>
                  <ListItem sx={{ paddingY: 0.5 }}>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color: colors.accentGreen[100],
                            textTransform: "uppercase",
                          }}
                        >
                          Persona que gestionó
                        </Typography>
                      }
                      secondary={
                        <Box display="flex" alignItems="center">
                          <AvatarImage
                            data={actions.photo_person_who_capture}
                          />
                          <Typography sx={{ marginLeft: 1 }}>
                            {actions.person_who_capture || "No disponible"}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ paddingY: 0.5 }}>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color: colors.accentGreen[100],
                            textTransform: "uppercase",
                          }}
                        >
                          Tarea gestionada
                        </Typography>
                      }
                      secondary={
                        <Chip
                          icon={
                            actions.task_done.includes("Carta Invitación") ? (
                              <MarkEmailRead />
                            ) : (
                              <DirectionsRun />
                            )
                          }
                          label={actions.task_done || "No disponible"}
                          variant="outlined"
                          color={
                            actions.task_done === "1ra Carta Invitación"
                              ? "secondary"
                              : actions.task_done === "2da Carta Invitación"
                              ? "warning"
                              : actions.task_done === "3ra Carta Invitación"
                              ? "warning"
                              : actions.task_done === "4ta Carta Invitación"
                              ? "error"
                              : "info"
                          }
                        />
                      }
                    />
                  </ListItem>
                  <ListItem sx={{ paddingY: 0.5 }}>
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color: colors.accentGreen[100],
                            textTransform: "uppercase",
                          }}
                        >
                          Fecha de gestión
                        </Typography>
                      }
                      secondary={
                        formatDate(actions.date_capture) || "No disponible"
                      }
                    />
                  </ListItem>
                </List>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
};

export default Actions;
