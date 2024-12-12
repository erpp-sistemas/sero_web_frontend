import {
  Typography,
  useTheme,
  InputAdornment,
  Divider,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableHead,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Box from "@mui/material/Box";
import { tokens } from "../../theme";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MapboxMap from "../../components/account-history/google-map.jsx";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import { BorderColor, Person } from "@mui/icons-material";

const AccountDetails = ({ accountDetails }) => {
  console.log(accountDetails);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  if (accountDetails.length === 0) {
    return (
      <Grid item container xs={12}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            component="h4"
            sx={{ fontWeight: "bold", color: "secondary" }}
          >
            <Divider>No se encontraron detalle de la cuenta</Divider>
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Box
      id="grid-1"
      display="grid"
      gridTemplateColumns="repeat(12, 1fr)"
      gridAutoRows="auto"
      gap="15px"
    >
      <Box
        gridColumn="span 12"        
        borderRadius="10px"
        sx={{ cursor: "pointer" }}
      >
        <Grid container spacing={2}>
          {/* Sección de Información General */}
          <Grid item xs={12}>
            <Typography
              variant="h4"
              align="center"
              sx={{
                fontWeight: "bold",
                paddingTop: 1,
                paddingBottom: 2,
                color: colors.accentGreen[100],
              }}
            >
              INFORMACION PERSONAL
            </Typography>
            <List
              sx={{
                width: "100%",
                bgcolor: "rgba(128, 128, 128, 0.1)",
                borderRadius: "8px",
                boxShadow: 3,
                padding: 0,
                display: "flex",
                flexDirection: "row", // Para que los items se muestren en una fila
                justifyContent: "space-between", // Para distribuirlos uniformemente
                flexWrap: "wrap", // Para que se acomoden si no caben
              }}
            >
              <ListItem sx={{ paddingBottom: 0, flex: 1 }}>
                <ListItemText
                  primary={
                    <span
                      style={{
                        textTransform: "uppercase",
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      Cuenta
                    </span>
                  }
                  secondary={accountDetails.account || "No disponible"}
                />
              </ListItem>
              <ListItem sx={{ paddingBottom: 0, flex: 1 }}>
                <ListItemText
                  primary={
                    <span
                      style={{
                        textTransform: "uppercase",
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      Propietario
                    </span>
                  }
                  secondary={accountDetails.owner_name || "No disponible"}
                />
              </ListItem>
              <ListItem sx={{ paddingBottom: 0, flex: 1 }}>
                <ListItemText
                  primary={
                    <span
                      style={{
                        textTransform: "uppercase",
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      Tipo de Servicio
                    </span>
                  }
                  secondary={accountDetails.type_service || "No disponible"}
                />
              </ListItem>
              <ListItem sx={{ paddingBottom: 0, flex: 1 }}>
                <ListItemText
                  primary={
                    <span
                      style={{
                        textTransform: "uppercase",
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      Tipo de Tarifa
                    </span>
                  }
                  secondary={accountDetails.rate_type || "No disponible"}
                />
              </ListItem>
              <ListItem sx={{ paddingBottom: 0, flex: 1 }}>
                <ListItemText
                  primary={
                    <span
                      style={{
                        textTransform: "uppercase",
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      Turno
                    </span>
                  }
                  secondary={accountDetails.turn || "No disponible"}
                />
              </ListItem>
              <ListItem sx={{ paddingBottom: 0, flex: 1 }}>
                <ListItemText
                  primary={
                    <span
                      style={{
                        textTransform: "uppercase",
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      Serie del Medidor
                    </span>
                  }
                  secondary={accountDetails.meter_series || "No disponible"}
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          {/* Sección de Información General */}
          <Grid item xs={12}>
            <Typography
              variant="h4"
              align="center"
              sx={{
                fontWeight: "bold",
                paddingTop: 4,
                color: colors.accentGreen[100],
              }}
            >
              DIRECCION
            </Typography>
          </Grid>

          <Grid item xs={8}>
            <List
              sx={{
                width: "100%",
                bgcolor: "rgba(128, 128, 128, 0.1)",
                borderRadius: "8px",
                boxShadow: 3,
                padding: 0,
              }}
            >
              <ListItem
                alignItems="flex-start"
                sx={{
                  paddingBottom: 0,
                  borderRadius: "12px",
                }}
              >
                <ListItemText
                  primary={
                    <span
                      style={{
                        textTransform: "uppercase",
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      Calle
                    </span>
                  }
                  secondary={accountDetails.street || "No disponible"}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={
                    <span
                      style={{
                        textTransform: "uppercase",
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      Número Exterior
                    </span>
                  }
                  secondary={accountDetails.outdoor_number || "No disponible"}
                />
                <ListItemText
                  primary={
                    <span
                      style={{
                        textTransform: "uppercase",
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      Número Interior
                    </span>
                  }
                  secondary={accountDetails.interior_number || "No disponible"}
                />
                <ListItemText
                  primary={
                    <span
                      style={{
                        textTransform: "uppercase",
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      Colonia
                    </span>
                  }
                  secondary={accountDetails.cologne || "No disponible"}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={
                    <span
                      style={{
                        textTransform: "uppercase",
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      Manzana
                    </span>
                  }
                  secondary={accountDetails.square || "No disponible"}
                />
                <ListItemText
                  primary={
                    <span
                      style={{
                        textTransform: "uppercase",
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      Lote
                    </span>
                  }
                  secondary={accountDetails.allotment || "No disponible"}
                />
                <ListItemText
                  primary={
                    <span
                      style={{
                        textTransform: "uppercase",
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      Entre calle 1
                    </span>
                  }
                  secondary={accountDetails.between_street_1 || "No disponible"}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={
                    <span
                      style={{
                        textTransform: "uppercase",
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      Entre calle 2
                    </span>
                  }
                  secondary={accountDetails.between_street_2 || "No disponible"}
                />
                <ListItemText
                  primary={
                    <span
                      style={{
                        textTransform: "uppercase",
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      Referencia
                    </span>
                  }
                  secondary={accountDetails.reference || "No disponible"}
                />
                <ListItemText
                  primary={
                    <span
                      style={{
                        textTransform: "uppercase",
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      Población
                    </span>
                  }
                  secondary={accountDetails.town || "No disponible"}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary={
                    <span
                      style={{
                        textTransform: "uppercase",
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      Código Postal
                    </span>
                  }
                  secondary={accountDetails.postal_code || "No disponible"}
                />
                <ListItemText
                  primary={
                    <span
                      style={{
                        textTransform: "uppercase",
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      Latitud
                    </span>
                  }
                  secondary={accountDetails.latitude || "No disponible"}
                />
                <ListItemText
                  primary={
                    <span
                      style={{
                        textTransform: "uppercase",
                        color: colors.accentGreen[100],
                        fontWeight: "bold",
                      }}
                    >
                      Longitud
                    </span>
                  }
                  secondary={accountDetails.longitude || "No disponible"}
                />
              </ListItem>
              <Divider />
              {/* Nuevos campos de latitud y longitud */}
              <ListItem></ListItem>
            </List>
          </Grid>

          <Grid item xs={12} sm={4}>            
            <Box
              sx={{
                borderRadius: "16px", // Ajusta este valor según el redondeo deseado
                overflow: "hidden", // Asegúrate de que el contenido respete el borde redondeado
              }}
            >
              <MapboxMap
                latitude={accountDetails.latitude}
                longitude={accountDetails.longitude}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AccountDetails;
