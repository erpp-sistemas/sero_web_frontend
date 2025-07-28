import React, { useState, useEffect, memo } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { getAllActiveUsers } from "../../../api/user";
import Lottie from "lottie-react";
import loadingAnimation from "../../../../public/loading-8.json";

function ActiveUsersSelect({ selectedUser, handleUserChange }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const res = await getAllActiveUsers();
        setUsers(res);

        if (!selectedUser && res.length > 0) {
          handleUserChange({
            target: { value: res[0].id_usuario },
          });
        }
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <Box sx={{ position: "relative", width: "100%" }}>
      <TextField
        id="select-user"
        select
        label="Usuario"
        variant="outlined"
        sx={{ width: "100%" }}
        value={selectedUser || ""}
        onChange={handleUserChange}
        disabled={loading}
      >
        {users.map((user) => (
          <MenuItem key={user.id_usuario} value={user.id_usuario}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
              <Avatar src={user.url_image || ""} alt={user.nombre} sx={{ width: 40, height: 40 }} />
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
          <Lottie animationData={loadingAnimation} style={{ width: 60, height: 60 }} />
        </Box>
      )}
    </Box>
  );
}

export default memo(ActiveUsersSelect);
