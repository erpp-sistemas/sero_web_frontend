import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useTheme,
  CardMedia,
  CardHeader,
  Badge,
  Divider,
} from "@mui/material";
import Box from "@mui/material/Box";
import { tokens } from "../../theme";
import Grid from "@mui/material/Grid";
import { viewPositionDailyWorkSummaryRequest } from "../../api/coordination.js";
import MapboxMap from "../../components/CoordinationDashboard/MapBoxComponent.jsx";
import * as XLSX from "xlsx";
import DownloadIcon from "@mui/icons-material/Download";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import LoadingModal from "../../components/LoadingModal.jsx";
import { Close } from "@mui/icons-material";

function PopupViewPositionDailyWorkSummary({
  open,
  onClose,
  userId,
  dateCapture,
  placeId,
  serviceId,
  proccessId,
}) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [positionsData, setPositionsData] = useState([]);
  const [photosData, setPhotosData] = useState([]);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [notPhotosData, setNotPhotosData] = useState([]);
  const [notPositionData, setNotPositionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const ViewPositionDailyWorkSummary = async () => {
    try {
      setIsLoading(true);

      const response = await viewPositionDailyWorkSummaryRequest(
        placeId,
        serviceId,
        proccessId,
        userId,
        dateCapture
      );
      setPositionsData(JSON.parse(response.data[0].Positions));
      setPhotosData(JSON.parse(response.data[0].Photos));
      setNotPhotosData(JSON.parse(response.data[0].NotPhotos) || []);
      setNotPositionData(JSON.parse(response.data[0].NotPosition) || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      setPositionsData([]);
      setPhotosData([]);
      setNotPhotosData([]);
      setNotPositionData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      setSelectedPhotos([]);
      setPositionsData([]);
      setPhotosData([]);
      setNotPhotosData([]);
      setNotPositionData([]);
      ViewPositionDailyWorkSummary();
    }
  }, [open, userId, dateCapture, placeId, serviceId, proccessId]);

  const downloadExcel = (data, filename) => {
    const filteredData = data.map((item) => {
      // Remover el campo 'photo'
      const { photo, ...newItem } = item;
      return newItem;
    });

    const translatedData = filteredData.map((item) => {
      // Traducir los nombres de los campos al español
      return {
        Cuenta: item.account,
        Tarea_realizada: item.task,
        Fecha_gestion: item.date_capture,
        Estatus_predio: item.property_status,
        Latitud: item.latitude,
        Longitud: item.longitude,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const handleGestionesDownload = () => {
    downloadExcel(positionsData, "Gestiones");
  };

  const handleLocalizadasDownload = () => {
    const localizedData = positionsData.filter(
      (item) => item.property_status !== "Predio no localizado"
    );
    downloadExcel(localizedData, "Localizadas");
  };

  const handleNoLocalizadasDownload = () => {
    const notLocalizedData = positionsData.filter(
      (item) => item.property_status === "Predio no localizado"
    );
    downloadExcel(notLocalizedData, "No_Localizadas");
  };

  const handleNotPhotosDownload = () => {
    downloadExcel(notPhotosData, "Sin_Fotos");
  };

  const handleNotPositionDownload = () => {
    downloadExcel(notPositionData, "Sin_Posicion");
  };

  const handleMarkerClick = ({ account, dateCapture, latitude, longitude }) => {
    const photosForAccount = photosData.filter(
      (photo) => photo.account === account
    );
    setSelectedPhotos(photosForAccount || []);
  };

  const gestionesCount = positionsData.length;
  const localizadasCount = positionsData.filter(
    (item) => item.property_status !== "Predio no localizado"
  ).length;
  const noLocalizadasCount = positionsData.filter(
    (item) => item.property_status === "Predio no localizado"
  ).length;
  const notPhotosCount = notPhotosData.length;
  const notPositionCount = notPositionData.length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const datePart = date.toLocaleDateString();
    const timePart = date.toLocaleTimeString();
    return `${datePart} ${timePart}`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      sx={{
        "& .MuiPaper-root": {
          border: `2px solid ${colors.accentGreen[100]}`,
        },
      }}
    >
      <DialogTitle
        sx={{ color: colors.accentGreen[100], fontWeight: "bold" }}
        variant="h4"
      >
        Ubicaciones
      </DialogTitle>
      <Divider sx={{ backgroundColor: colors.accentGreen[100] }} />
      <DialogContent>
        <Box display="flex" justifyContent="space-between" m={2}>
          <Badge
            badgeContent={gestionesCount}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: colors.accentGreen[100],
                color: colors.contentAccentGreen[100],
                fontWeight: "bold",
              },
            }}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            max={9999}
          >
            <Button
              color="info"
              variant="contained"
              endIcon={<DownloadIcon />}
              onClick={handleGestionesDownload}
              sx={{ borderRadius: "35px", color: "white", fontWeight: "bold" }}
              disabled={gestionesCount === 0}
            >
              Gestiones
            </Button>
          </Badge>
          <Badge
            badgeContent={localizadasCount}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: colors.accentGreen[100],
                color: colors.contentAccentGreen[100],
                fontWeight: "bold",
              },
            }}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            max={9999}
          >
            <Button
              color="secondary"
              variant="contained"
              endIcon={<DownloadIcon />}
              onClick={handleLocalizadasDownload}
              sx={{ borderRadius: "35px", fontWeight: "bold" }}
              disabled={localizadasCount === 0}
            >
              Localizadas
            </Button>
          </Badge>
          <Badge
            badgeContent={noLocalizadasCount}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: colors.accentGreen[100],
                color: colors.contentAccentGreen[100],
                fontWeight: "bold",
              },
            }}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            max={9999}
          >
            <Button
              color="warning"
              variant="contained"
              endIcon={<DownloadIcon />}
              onClick={handleNoLocalizadasDownload}
              sx={{ borderRadius: "35px", color: "white", fontWeight: "bold" }}
              disabled={noLocalizadasCount === 0}
            >
              No Localizadas
            </Button>
          </Badge>
          <Badge
            badgeContent={notPositionCount}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: colors.accentGreen[100],
                color: colors.contentAccentGreen[100],
                fontWeight: "bold",
              },
            }}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            max={9999}
          >
            <Button
              color="error"
              variant="contained"
              endIcon={<DownloadIcon />}
              onClick={handleNotPositionDownload}
              sx={{ borderRadius: "35px", color: "white", fontWeight: "bold" }}
              disabled={notPositionCount === 0}
            >
              Sin Posicion
            </Button>
          </Badge>
          <Badge
            badgeContent={notPhotosCount}
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: colors.accentGreen[100],
                color: colors.contentAccentGreen[100],
                fontWeight: "bold",
              },
            }}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            max={9999}
          >
            <Button
              color="error"
              variant="contained"
              endIcon={<DownloadIcon />}
              onClick={handleNotPhotosDownload}
              sx={{ borderRadius: "35px", color: "white", fontWeight: "bold" }}
              disabled={notPhotosCount === 0}
            >
              Sin fotos
            </Button>
          </Badge>
        </Box>
        {isLoading && <LoadingModal open={isLoading} />}
        <Box
          display="flex"
          justifyContent="space-evenly"
          flexWrap="wrap"
          gap="20px"
          sx={{ bgcolor: "background.paper", width: "100%" }}
          padding="5px 10px"
          borderRadius="10px"
        >
          <Grid
            item
            xs={12}
            container
            justifyContent="space-between"
            alignItems="stretch"
            spacing={2}
          >
            <Grid item xs={12}>
              {positionsData.length > 0 && (
                <MapboxMap
                  positions={positionsData}
                  onClickMarker={handleMarkerClick}
                  setIsLoading={setIsLoading}
                />
              )}
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            container
            justifyContent="space-between"
            alignItems="stretch"
            spacing={2}
          >
            <Grid item xs={12}>
              <Box display="flex" flexDirection="column">
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ color: colors.accentGreen[100], fontWeight: "bold" }}
                >
                  Fotos
                </Typography>
                <Divider sx={{ backgroundColor: colors.accentGreen[100] }} />
                <ImageList
                  sx={{
                    width: "100%",
                    flexWrap: "wrap",
                    gap: 10,
                    paddingTop: "10px",
                  }}
                  cols={4}
                >
                  {selectedPhotos.map((photo) => (
                    <ImageListItem key={photo.photo}>
                      <Card
                        variant="outlined"
                        sx={{ backgroundColor: "rgba(128, 128, 128, 0.1)" }}
                      >
                        <CardHeader
                          title={`Cuenta: ${photo.account}`}
                          subheader={`Fecha de captura: ${formatDate(
                            photo.date_capture
                          )}`}
                          sx={{
                            "& .MuiCardHeader-title": {
                              color: colors.accentGreen[100], // Color para el título
                              fontWeight: "bold", // Opcional: añadir estilo al título
                            },
                            "& .MuiCardHeader-subheader": {
                              fontStyle: "italic", // Opcional: añadir estilo al subheader
                              fontWeight: "bold",
                            },
                          }}
                        />
                        <CardMedia
                          component="img"
                          style={{ height: "200px" }}
                          image={photo.photo}
                          alt={photo.photo}
                        />
                        <CardContent>
                          <Typography
                            sx={{
                              fontSize: 14,
                              color: colors.accentGreen[100],
                              fontWeight: "bold",
                            }}
                          >
                            Tipo de foto
                          </Typography>
                          <Typography variant="h4" component="div" gutterBottom>
                            {photo.type}
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 14,
                              color: colors.accentGreen[100],
                              fontWeight: "bold",
                            }}
                          >
                            Fecha de ingreso al sistema
                          </Typography>
                          <Typography variant="h4" component="div" gutterBottom>
                            {formatDate(photo.date_sincronization)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </ImageListItem>
                  ))}
                </ImageList>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="info"
          variant="contained"
          sx={{ borderRadius: "35px", color: "white", fontWeight: "bold" }}
          endIcon={<Close />}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default PopupViewPositionDailyWorkSummary;
