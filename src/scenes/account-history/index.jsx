import React, { useState } from "react";
import { Box, useTheme, Button, InputAdornment, Chip } from "@mui/material";
import { tokens } from "../../theme";
import LoadingModal from "../../components/LoadingModal.jsx";
import CustomAlert from "../../components/CustomAlert.jsx";
import Grid from "@mui/material/Grid";
import PlaceSelect from "../../components/PlaceSelect";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import TextField from "@mui/material/TextField";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { AccountHistoryRequest } from "../../api/account.js";
import AccountDetails from "../../components/account-history/account-details.jsx";
import Payments from "../../components/account-history/payments.jsx";
import Debit from "../../components/account-history/debit.jsx";
import Actions from "../../components/account-history/actions.jsx";
import Photos from "../../components/account-history/photos.jsx";
import {
  AddAPhoto,
  ContactEmergency,
  CreditScore,
  DirectionsBike,
  Person,
  Savings,
  Search,
} from "@mui/icons-material";

const Index = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [informationUser, setInformationUser] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [account, setAccount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");
  const [selectedChip, setSelectedChip] = useState(0);

  const handlePlaceChange = (event) => {
    setSelectedPlace(event.target.value);
  };

  const handleChange = (event) => {
    setAccount(event.target.value);
  };

  const handleGetAccount = async () => {
    try {
      if (!selectedPlace) {
        setAlertOpen(true);
        setAlertType("error");
        setAlertMessage("¡Error! Debes seleccionar una plaza");
        return;
      } else if (!account) {
        setAlertOpen(true);
        setAlertType("error");
        setAlertMessage("¡Error! Debes ingresar una cuenta");
        return;
      }

      setIsLoading(true);
      const response = await AccountHistoryRequest(selectedPlace, account);
      setInformationUser(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);

      if (error.response.status === 400) {
        setAlertOpen(true);
        setAlertType("warning");
        setAlertMessage("¡Atencion! La cuenta no existe");
        setInformationUser([]);
      } else {
        return;
      }

      setInformationUser([]);
    }
  };

  const handleChipClick = (index) => {
    setSelectedChip(index);
  };

  return (
    <Box sx={{ margin: "20px" }}>
      <LoadingModal open={isLoading} />

      <CustomAlert
        alertOpen={alertOpen}
        type={alertType}
        message={alertMessage}
        onClose={setAlertOpen}
      />

      <Box
        m="20px 0"
        display="flex"
        justifyContent="space-evenly"
        flexWrap="wrap"
        gap="20px"
        sx={{ backgroundColor: colors.primary[400], width: "100%" }}
        padding="15px 10px"
        borderRadius="10px"
      >
        <Grid
          xs={12}
          md={12}
          container
          justifyContent="space-between"
          alignItems="stretch"
          spacing={2}
        >
          <Grid item xs={12} md={4}>
            <PlaceSelect
              selectedPlace={selectedPlace}
              handlePlaceChange={handlePlaceChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Ingresa una cuenta"
              value={account}
              onChange={handleChange}
              color="info"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              sx={{
                width: "100%",
                minHeight: { xs: "50px", md: "100%" }, // Mantén un tamaño mínimo en pantallas pequeñas
                borderRadius: "35px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: { xs: "0 8px", md: "0 16px" }, // Ajusta el padding en pantallas pequeñas y grandes
                backgroundColor: colors.searchButton[100],
                color: colors.contentSearchButton[100],
                border: "1px solid #d5e3f5",
                boxShadow: "0 4px 6px rgba(255, 255, 255, 0.1)", // Sombra sutil
                ":hover": {
                  backgroundColor: colors.searchButton[200],
                  boxShadow: "0 8px 12px rgba(255, 255, 255, 0.2)",
                },
              }}
              onClick={handleGetAccount}
            >
              {/* Texto centrado */}
              <span
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: { xs: "0.875rem", sm: "1rem" }, // Ajuste de tamaño de texto en pantallas pequeñas
                  fontWeight: "bold",
                }}
              >
                Buscar
              </span>

              {/* Icono al final */}
              <Search sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
            </Button>
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
            <Box
              display="flex"
              justifyContent="flex-start"
              flexWrap="wrap"
              gap={1}
            >
              <Chip
                icon={<Person />}
                label="Informacion General"
                clickable
                onClick={() => handleChipClick(0)}
                sx={{
                  backgroundColor:
                    selectedChip === 0 ? colors.accentGreen[100] : "default",
                  color:
                    selectedChip === 0
                      ? colors.contentAccentGreen[100]
                      : "default",
                  fontWeight: "bold",
                  "& .MuiChip-icon": {
                    display: "flex",
                    alignItems: "center",
                    color:
                      selectedChip === 0
                        ? colors.contentAccentGreen[100]
                        : "default",
                  },
                }}
              />
              <Chip
                icon={<CreditScore />}
                label="Pagos"
                clickable
                onClick={() => handleChipClick(1)}
                sx={{
                  backgroundColor:
                    selectedChip === 1 ? colors.accentGreen[100] : "default",
                  color:
                    selectedChip === 1
                      ? colors.contentAccentGreen[100]
                      : "default",
                  fontWeight: "bold",
                  "& .MuiChip-icon": {
                    display: "flex",
                    alignItems: "center",
                    color:
                      selectedChip === 1
                        ? colors.contentAccentGreen[100]
                        : "default",
                  },
                }}
              />
              <Chip
                icon={<Savings />}
                label="Deuda"
                clickable
                onClick={() => handleChipClick(2)}
                sx={{
                  backgroundColor:
                    selectedChip === 2 ? colors.accentGreen[100] : "default",
                  color:
                    selectedChip === 2
                      ? colors.contentAccentGreen[100]
                      : "default",
                  fontWeight: "bold",
                  "& .MuiChip-icon": {
                    display: "flex",
                    alignItems: "center",
                    color:
                      selectedChip === 2
                        ? colors.contentAccentGreen[100]
                        : "default",
                  },
                }}
              />
              <Chip
                icon={<DirectionsBike />}
                label="Acciones"
                clickable
                onClick={() => handleChipClick(3)}
                sx={{
                  backgroundColor:
                    selectedChip === 3 ? colors.accentGreen[100] : "default",
                  color:
                    selectedChip === 3
                      ? colors.contentAccentGreen[100]
                      : "default",
                  fontWeight: "bold",
                  "& .MuiChip-icon": {
                    display: "flex",
                    alignItems: "center",
                    color:
                      selectedChip === 3
                        ? colors.contentAccentGreen[100]
                        : "default",
                  },
                }}
              />
              <Chip
                icon={<AddAPhoto />}
                label="Fotografias"
                clickable
                onClick={() => handleChipClick(4)}
                sx={{
                  backgroundColor:
                    selectedChip === 4 ? colors.accentGreen[100] : "default",
                  color:
                    selectedChip === 4
                      ? colors.contentAccentGreen[100]
                      : "default",
                  fontWeight: "bold",
                  "& .MuiChip-icon": {
                    display: "flex",
                    alignItems: "center",
                    color:
                      selectedChip === 4
                        ? colors.contentAccentGreen[100]
                        : "default",
                  },
                }}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            {selectedChip === 0 && (
              <Box>
                {informationUser.map((data, index) => (
                  <div key={index}>
                    <AccountDetails accountDetails={data} />
                  </div>
                ))}
              </Box>
            )}
            {selectedChip === 1 && (
              <Box>
                {informationUser.map((data, index) => (
                  <div key={index}>
                    <Payments payments={data.payments} />
                  </div>
                ))}
              </Box>
            )}
            {selectedChip === 2 && (
              <Box>
                {informationUser.map((data, index) => (
                  <div key={index}>
                    <Debit debit={data.debit} />
                  </div>
                ))}
              </Box>
            )}
            {selectedChip === 3 && (
              <Box>
                {informationUser.map((data, index) => (
                  <div key={index}>
                    <Actions action={data.action} />
                  </div>
                ))}
              </Box>
            )}
            {selectedChip === 4 && (
              <Box>
                {informationUser.map((data, index) => (
                  <div key={index}>
                    <Photos photo={data.photo} />
                  </div>
                ))}
              </Box>
            )}
          </Grid>
		  
        </Grid>
      </Box>
    </Box>
  );
};

export default Index;
