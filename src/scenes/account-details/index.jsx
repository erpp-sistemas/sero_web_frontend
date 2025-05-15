import { useState, useCallback } from "react";
import { TextField, Button, useTheme, Typography } from "@mui/material";
import PlaceSelect from "../../components/select/placeSelect.jsx";
import { tokens } from "../../theme";
import { Search } from "@mui/icons-material";
import LoadingModal from "../../components/LoadingModal.jsx";
import CustomAlert from "../../components/CustomAlert.jsx";
import { AccountHistoryRequest } from "../../api/account.js";
import AccountDetails from "../../components/account-history/account-details.jsx";
import Payments from "../../components/account-history/payments.jsx";
import Debit from "../../components/account-history/debit.jsx";
import Actions from "../../components/account-history/actions.jsx";
import Photos from "../../components/account-history/photos.jsx";
import PDFGenerator from "../../components/account-history/pdf-generator.jsx";

function Index() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [account, setAccount] = useState("");
  const [informationUser, setInformationUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertType, setAlertType] = useState("info");
  const [alertMessage, setAlertMessage] = useState("");

  const handlePlaceChange = useCallback((event) => {
    setSelectedPlace(event.target.value);
  }, []);

  const handleChange = (event) => {
    setAccount(event.target.value);
  };

  const handleGetAccount = () => {
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

    AccountHistoryRequest(selectedPlace, account)
      .then((response) => {
        setInformationUser(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        if (error.response?.status === 400) {
          setAlertOpen(true);
          setAlertType("warning");
          setAlertMessage("¡Atención! La cuenta no existe");
          setInformationUser([]);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="p-4 font-[sans-serif]">
      <LoadingModal open={isLoading} />

      <CustomAlert
        alertOpen={alertOpen}
        type={alertType}
        message={alertMessage}
        onClose={setAlertOpen}
      />
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <Typography
          variant="h3"
          sx={{
            color: colors.accentGreen[100],
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          Busqueda de cuentas
        </Typography>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <PlaceSelect
          selectedPlace={selectedPlace}
          handlePlaceChange={handlePlaceChange}
          setSelectedPlace={setSelectedPlace}
        />
        <TextField
          fullWidth
          label="Ingresa una cuenta"
          value={account}
          onChange={handleChange}
          color="info"
        />
        <Button
          variant="contained"
          sx={{
            width: "100%",
            borderRadius: "35px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
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
        <PDFGenerator data={informationUser} />
      </div>

      {informationUser && informationUser.length > 0 && (
        <div>
          <AccountDetails accountDetails={informationUser} />
          <Payments payments={informationUser[0].payments} />
          <Debit debit={informationUser[0].debit} />
          <Actions action={informationUser[0].action} />
          <Photos photo={informationUser[0].photo} />
        </div>
      )}
    </div>
  );
}

export default Index;
