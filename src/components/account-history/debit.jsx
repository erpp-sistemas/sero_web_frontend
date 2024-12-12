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

const Debit = ({ debit }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const parsedDebit = Array.isArray(debit) ? debit : JSON.parse(debit);

  if (parsedDebit === null) {
    return (
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h4" component="h4" sx={{ fontWeight: "bold" }}>
            <Divider>No se encontraron adeudos</Divider>
          </Typography>
        </Grid>
      </Grid>
    );
  }

  // Ordenar los adeudos por update_date de mayor a menor
  const sortedDebits = parsedDebit.sort(
    (a, b) => new Date(b.update_date) - new Date(a.update_date)
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
          {sortedDebits.map((debt, index) => (
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
                    marginBottom: 1.5,
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
                    ADEUDO:{" "}
                    {debt.update_date
                      ? new Date(debt.update_date)
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
                          Monto de deuda
                        </Typography>
                      }
                      secondary={new Intl.NumberFormat("es-MX", {
                        style: "currency",
                        currency: "MXN",
                      }).format(debt.debt_amount)}
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
                          Fecha de actualizacion
                        </Typography>
                      }
                      secondary={
                        debt.update_date
                          ? new Date(debt.update_date).toLocaleDateString()
                          : "No disponible"
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
                          Fecha de corte
                        </Typography>
                      }
                      secondary={
                        debt.cutoff_date
                          ? new Date(debt.cutoff_date).toLocaleDateString()
                          : "No disponible"
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
                          Último bimestre de pago
                        </Typography>
                      }
                      secondary={debt.last_two_month_payment || "No disponible"}
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
                          Última fecha de pago
                        </Typography>
                      }
                      secondary={
                        debt.last_payment_date
                          ? new Date(
                              debt.last_payment_date
                            ).toLocaleDateString()
                          : "No disponible"
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

export default Debit;
