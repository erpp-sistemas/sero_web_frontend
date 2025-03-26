import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme.js";
import MapboxMap from "../../components/account-history/google-map.jsx";

function AccountDetails({ accountDetails }) {
  // Verificamos si accountDetails tiene datos
  if (!accountDetails || accountDetails.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos para mostrar</p>
    );
  }

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // Desestructuramos el primer objeto de accountDetails
  const {
    account,
    owner_name,
    type_service,
    rate_type,
    turn,
    meter_series,
    street,
    outdoor_number,
    interior_number,
    cologne,
    square,
    allotment,
    between_street_1,
    between_street_2,
    reference,
    town,
    postal_code,
    latitude,
    longitude,
  } = accountDetails[0];

  return (
    <div className="space-y-3">
      {/* Sección de detalles de la cuenta */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <Typography
          variant="h3"
          sx={{
            color: colors.accentGreen[100],
            marginTop: "10px",
            fontWeight: "bold",
          }}
        >
          Informacion general
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: colors.accentGreen[100],
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Informacion de la cuenta
        </Typography>
      </div>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: "8px",
          boxShadow: 3,
          padding: 0,
          background: "rgba(128, 128, 128, 0.1)",
          maxHeight: 500,
        }}
      >
        <Table>
          <TableHead
            sx={{
              backgroundColor: colors.accentGreen[100],
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            }}
          >
            <TableCell
              sx={{
                color: colors.contentSearchButton[100],
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Cuenta
            </TableCell>

            <TableCell
              sx={{
                color: colors.contentSearchButton[100],
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Propietario
            </TableCell>
            <TableCell
              sx={{
                color: colors.contentSearchButton[100],
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Tipo de Servicio
            </TableCell>
            <TableCell
              sx={{
                color: colors.contentSearchButton[100],
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              <strong>Tipo de Tarifa</strong>
            </TableCell>
            <TableCell
              sx={{
                color: colors.contentSearchButton[100],
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              <strong>Turno</strong>
            </TableCell>
            <TableCell
              sx={{
                color: colors.contentSearchButton[100],
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              <strong>Serie del Medidor</strong>
            </TableCell>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{account}</TableCell>
              <TableCell>{owner_name}</TableCell>
              <TableCell>{type_service}</TableCell>
              <TableCell>{rate_type}</TableCell>
              <TableCell>{turn}</TableCell>
              <TableCell>{meter_series || "No disponible"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Sección de dirección de la cuenta y mapa */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <Typography
          variant="h6"
          sx={{
            color: colors.accentGreen[100],
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          Dirección de la cuenta
        </Typography>
      </div>
      <div className="grid grid-cols-12 gap-4">
        {/* Tabla de dirección (8 columnas) */}
        <div className="col-span-6 flex flex-col">
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "8px",
              boxShadow: 3,
              padding: 0,
              background: "rgba(128, 128, 128, 0.1)",
              maxHeight: 500,
            }}
          >
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      backgroundColor: colors.accentGreen[100],
                    }}
                  >
                    Calle
                  </TableCell>
                  <TableCell>{street || "No disponible"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      backgroundColor: colors.accentGreen[100],
                    }}
                  >
                    Número Exterior
                  </TableCell>
                  <TableCell>{outdoor_number || "No disponible"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      backgroundColor: colors.accentGreen[100],
                    }}
                  >
                    Número Interior
                  </TableCell>
                  <TableCell>{interior_number || "No disponible"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      backgroundColor: colors.accentGreen[100],
                    }}
                  >
                    Colonia
                  </TableCell>
                  <TableCell>{cologne || "No disponible"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      backgroundColor: colors.accentGreen[100],
                    }}
                  >
                    Manzana
                  </TableCell>
                  <TableCell>{square || "No disponible"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      backgroundColor: colors.accentGreen[100],
                    }}
                  >
                    Lote
                  </TableCell>
                  <TableCell>{allotment || "No disponible"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      backgroundColor: colors.accentGreen[100],
                    }}
                  >
                    Entre Calle 1
                  </TableCell>
                  <TableCell>{between_street_1 || "No disponible"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      backgroundColor: colors.accentGreen[100],
                    }}
                  >
                    Entre Calle 2
                  </TableCell>
                  <TableCell>{between_street_2 || "No disponible"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      backgroundColor: colors.accentGreen[100],
                    }}
                  >
                    Referencia
                  </TableCell>
                  <TableCell>{reference || "No disponible"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      backgroundColor: colors.accentGreen[100],
                    }}
                  >
                    Poblacion
                  </TableCell>
                  <TableCell>{town || "No disponible"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      backgroundColor: colors.accentGreen[100],
                    }}
                  >
                    CP
                  </TableCell>
                  <TableCell>{postal_code || "No disponible"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      backgroundColor: colors.accentGreen[100],
                    }}
                  >
                    Latitud
                  </TableCell>
                  <TableCell>{latitude || "No disponible"}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      backgroundColor: colors.accentGreen[100],
                    }}
                  >
                    Longitud
                  </TableCell>
                  <TableCell>{longitude || "No disponible"}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Mapa (4 columnas) */}
        <div className="col-span-6 flex flex-col justify-between rounded-[20px] overflow-hidden">
          <MapboxMap latitude={latitude} longitude={longitude} />
        </div>
      </div>
    </div>
  );
}

export default AccountDetails;
