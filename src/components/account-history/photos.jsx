import React from "react";
import {
  Avatar,
  Box,
  Grid,
  Typography,
  useTheme,
  Divider,
  Card,
  CardContent,
  CardMedia,
  CardHeader,
} from "@mui/material";
import Viewer from "react-viewer";
import { tokens } from "../../theme";

const Photos = ({ photo }) => {

  if (!photo || photo.length === 0) {
        return (
          <Typography align="center" color="textSecondary">
            No hay datos para mostrar
          </Typography>
        );
      }
      
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const parsedPhotos = Array.isArray(photo) ? photo : JSON.parse(photo);

  const [visibleImage, setVisibleImage] = React.useState(null);

  const AvatarImage = ({ data }) => {
    const [visibleAvatar, setVisibleAvatar] = React.useState(false);
    return (
      <>
        <Avatar
          onClick={() => {
            setVisibleAvatar(true);
          }}
          alt="Foto"
          src={data}
          sx={{ width: 56, height: 56, cursor: "pointer" }}
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const datePart = date.toLocaleDateString();
    const timePart = date.toLocaleTimeString();
    return `${datePart} ${timePart}`;
  };

  return (
    <div className="space-y-3 pt-3">
      <Typography
        variant="h3"
        sx={{
          color: colors.accentGreen[100],
          marginTop: "10px",
          fontWeight: "bold",
        }}
      >
        Fotografias tomadas a la cuenta
      </Typography>
      <Box
        display="flex"
        justifyContent="space-evenly"
        flexWrap="wrap"
        gap="20px"        
        borderRadius="10px"
      >
        <Grid container spacing={2}>
          {parsedPhotos.map((ph, index) => (
            <Grid key={index} item xs={12} md={3}>
              <Card
                variant="outlined"
                sx={{
                  backgroundColor: "rgba(128, 128, 128, 0.1)",
                  borderRadius: "8px",
                  boxShadow: 3,
                }}
              >
                <CardHeader
                  avatar={<AvatarImage data={ph.photo_person_who_capture} />}
                  title={
                    <Typography variant="body1">
                      {ph.person_who_capture || "No disponible"}
                    </Typography>
                  }
                  subheader={
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: colors.accentGreen[100],
                        textTransform: "uppercase",
                      }}
                    >
                      Persona que capturó
                    </Typography>
                  }
                />
                <CardMedia
                  component="img"
                  image={ph.image_url}
                  alt="Fotografía"
                  sx={{
                    height: 200,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setVisibleImage({ src: ph.image_url, alt: "Fotografía" })
                  }
                />
                <CardContent>
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: colors.accentGreen[100],
                      textTransform: "uppercase",
                    }}
                  >
                    Tipo de foto
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {ph.image_type || "No disponible"}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: colors.accentGreen[100],
                      textTransform: "uppercase",
                    }}
                  >
                    Tarea gestionada
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {ph.task_done || "No disponible"}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: "bold",
                      color: colors.accentGreen[100],
                      textTransform: "uppercase",
                    }}
                  >
                    Fecha de captura
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatDate(ph.date_capture) || "No disponible"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {visibleImage && (
          <Viewer
            visible={true}
            onClose={() => setVisibleImage(null)}
            images={[visibleImage]}
            scalable={true}
            rotatable={true}
          />
        )}
      </Box>
    </div>
  );
};

export default Photos;
