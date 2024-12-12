import React from "react";
import {
  Typography,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { tokens } from "../../theme";

const Payments = ({ payments }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const parsedPayments = Array.isArray(payments)
    ? payments
    : JSON.parse(payments);

  if (parsedPayments === null) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h4" component="h4" sx={{ fontWeight: "bold" }}>
            <Divider>No se encontraron pagos</Divider>
          </Typography>
        </Grid>
      </Grid>
    );
  }

  // Ordenar los pagos por fecha de pago de mayor a menor
  const sortedPayments = parsedPayments.sort(
    (a, b) => new Date(b.payment_date) - new Date(a.payment_date)
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
          {sortedPayments.map((payment, index) => (
            <Grid key={index} item xs={12} md={4}>
              <Box
                sx={{
                  backgroundColor: "rgba(128, 128, 128, 0.1)",
                  borderRadius: "8px",
                  boxShadow: 3,
                  padding: 1.5,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: colors.accentGreen[100],
                    borderRadius: "4px",
                    padding: "8px",
                    marginBottom: 1,
                  }}
                >
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{
                      fontWeight: "bold",
                      color: colors.contentAccentGreen[100],
                    }}
                  >
                    PAGO:{" "}
                    {payment.payment_date
                      ? new Date(payment.payment_date)
                          .toLocaleDateString()
                          .toUpperCase()
                      : "NO DISPONIBLE"}
                  </Typography>
                </Box>

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
                          Monto pagado
                        </Typography>
                      }
                      secondary={new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      }).format(payment.amount_paid)}
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
                          Referencia
                        </Typography>
                      }
                      secondary={payment.reference || "No disponible"}
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
                          Descripción
                        </Typography>
                      }
                      secondary={payment.description || "No disponible"}
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
                          Periodo
                        </Typography>
                      }
                      secondary={payment.payment_period || "No disponible"}
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

export default Payments;
