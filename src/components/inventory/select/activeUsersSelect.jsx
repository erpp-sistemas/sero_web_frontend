import React, { useState, useEffect, memo } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { getAllActiveUsers } from "../../../api/user";
import Lottie from "lottie-react";
import loadingAnimation from "../../../../public/loading-8.json";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import { tokens } from "../../../theme";
import { useTheme } from "@mui/material";

function ActiveUsersSelect({ selectedUser, handleUserChange }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const res = await getAllActiveUsers();

        await new Promise((resolve) => setTimeout(resolve, 300));
        setUsers(res);

        if (!selectedUser && res.length > 0) {
          handleUserChange(res[0]); // envia el objeto completo
        }
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleChange = (event) => {
    const selectedId = event.target.value;
    const fullUser = users.find((u) => u.id_usuario === selectedId);
    handleUserChange(fullUser); // también enviamos el objeto completo aquí
  };

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <TextField
        id="select-user"
        select
        label="Selecciona un Usuario"
        variant="outlined"
        size="small"
        value={selectedUser?.id_usuario || ""}
        onChange={handleChange}
        disabled={loading}
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            fontSize: "0.875rem",
            backgroundColor: colors.bgContainer, // mismo fondo que usamos en contenedores
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",

            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.borderContainer,
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.accentGreen[100], // hover sutil
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: colors.accentGreen[200],
              boxShadow: "0 0 0 3px rgba(34,197,94,0.15)", // realce minimalista accesible
            },

            "& input::placeholder": {
              color: colors.grey[400],
              opacity: 1,
            },
          },

          "& .MuiInputAdornment-root": {
            marginRight: "8px",
          },

          "& .MuiFormHelperText-root": {
            marginLeft: 1,
            fontSize: "0.75rem",
            color: theme.palette.error.main,
          },
        }}
        SelectProps={{
          IconComponent: (props) => (
            <KeyboardArrowDown
              {...props}
              sx={{ color: colors.grey[300], fontSize: 20 }}
            />
          ),
        }}
      >
        {users.map((user) => (
          <MenuItem key={user.id_usuario} value={user.id_usuario}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <Avatar
                src={user.url_image || ""}
                alt={user.nombre}
                sx={{ width: 40, height: 40 }}
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Typography variant="body1" fontWeight="bold">
                  {user.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.puesto?.nombre || "Puesto no disponible"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.area?.nombre || "Área no disponible"}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </TextField>

      {loading && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            right: 0,
            display: "flex",
            alignItems: "center",
            transform: "translateY(-50%)",
            zIndex: 1,
            pointerEvents: "none",
            pr: 2,
          }}
        >
          <Typography variant="body2" sx={{ mr: 1, color: "gray" }}>
            Cargando...
          </Typography>
          <Lottie
            animationData={loadingAnimation}
            style={{ width: 60, height: 60 }}
          />
        </Box>
      )}
    </Box>
  );
}

export default memo(ActiveUsersSelect);
