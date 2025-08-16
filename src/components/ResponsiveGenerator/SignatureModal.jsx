import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  Box,
  TextField,
  useTheme,
  DialogContentText,
} from "@mui/material";
import { tokens } from "../../theme";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";
import { EmailOutlined, SecurityOutlined } from "@mui/icons-material";

const SignatureModal = ({
  open,
  onClose,
  userEmail,
  onOTPRequest,
  onOTPValidate,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [step, setStep] = useState("confirm"); // "confirm" | "otp"
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCodeExpired, setIsCodeExpired] = useState(false);

  // Reset al cerrar
  const handleClose = () => {
    setStep("confirm");
    setOtp("");
    setCountdown(0);
    setIsCodeExpired(false);
    onClose();
  };

  // Countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsCodeExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Enviar OTP
  const handleSendOTP = () => {
    setIsLoading(true);
    setIsCodeExpired(false);
    onOTPRequest(() => {
      setStep("otp");
      setCountdown(30);
      setIsLoading(false);
    });
  };

  // Reenviar código
  const handleResendCode = () => {
    setIsLoading(true);
    setIsCodeExpired(false);
    onOTPRequest(() => {
      setCountdown(30);
      setIsLoading(false);
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          borderRadius: "12px",
          padding: "8px",
          boxShadow: "0px 4px 14px rgba(0,0,0,0.08)",
          minWidth: 320,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          fontSize: "1rem",
          fontWeight: 500,
          color: colors.grey[100],
          pb: 1,
        }}
      >
        {step === "confirm" ? (
          <>
            <WarningAmberOutlined
              sx={{ color: colors.yellowAccent[500], fontSize: 22 }}
            />
            Confirmar firma electrónica
          </>
        ) : (
          <>
            <SecurityOutlined
              sx={{ color: colors.primary[300], fontSize: 22 }}
            />
            Verificación por email
          </>
        )}
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: colors.grey[500],
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        {step === "confirm" ? (
          <Box>
            <DialogContentText
              sx={{
                fontSize: "0.8rem",
                fontWeight: 500,
                color: colors.grey[100],
                pb: 1,
                textAlign: "justify",
              }}
            >
              Al confirmar, se enviará un código de verificación a tu correo
              institucional. Este proceso asegura que aceptas los términos de la
              responsiva.
            </DialogContentText>
            <Typography
              variant="caption"
              sx={{
                color: colors.grey[200],
                fontStyle: "italic",
                fontSize: "0.8rem",
              }}
            >
              ¿Deseas continuar?
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography
              variant="body2"
              sx={{
                mb: 2,
                color: colors.grey[300],
                fontSize: "0.9rem",
              }}
            >
              Ingresa el código de 6 dígitos enviado a:
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                bgcolor: colors.grey[800],
                p: 1.5,
                borderRadius: "6px",
                mb: 2,
                fontFamily: "monospace",
                color: colors.grey[100],
                fontSize: "0.85rem",
              }}
            >
              {userEmail}
            </Typography>
            <TextField
              fullWidth
              placeholder="Ej: 123456"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                  fontSize: "0.875rem",
                  backgroundColor: colors.grey[800],
                  "& fieldset": {
                    borderColor: colors.grey[700],
                  },
                  "&:hover fieldset": {
                    borderColor: colors.grey[600],
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.primary[500],
                  },
                },
                "& .MuiInputBase-input": {
                  color: colors.grey[100],
                },
              }}
            />
            {countdown > 0 ? (
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 1,
                  color:
                    countdown < 10 ? colors.redAccent[400] : colors.grey[500],
                  fontSize: "0.75rem",
                }}
              >
                El código expira en {countdown}s
              </Typography>
            ) : (
              isCodeExpired && (
                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    borderRadius: "6px",
                    bgcolor: colors.redAccent[50],
                    border: `1px solid ${colors.redAccent[100]}`,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                  }}
                >
                  <WarningAmberOutlined
                    sx={{
                      color: colors.redAccent[400],
                      fontSize: "20px",
                    }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: colors.redAccent[500],
                        fontWeight: 500,
                        fontSize: "0.75rem",
                        lineHeight: 1.3,
                      }}
                    >
                      El código ha expirado
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: colors.grey[100],
                        fontSize: "0.7rem",
                      }}
                    >
                      Para continuar, solicita un nuevo código
                    </Typography>
                  </Box>
                  <Button
                    onClick={handleResendCode}
                    disabled={isLoading}
                    sx={{
                      textTransform: "none",
                      borderRadius: "4px",
                      color: colors.redAccent[500],
                      backgroundColor: "transparent",
                      border: `1px solid ${colors.redAccent[300]}`,
                      fontSize: "0.7rem",
                      px: 1.5,
                      py: 0.5,
                      minWidth: 0,
                      "&:hover": {
                        backgroundColor: colors.redAccent[100],
                      },
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Haz clic para reenviar codigo"
                    )}
                  </Button>
                </Box>
              )
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: `1px solid ${colors.grey[700]}`,
          px: 2,
          py: 1.5,
          gap: 1,
        }}
      >
        {step === "confirm" ? (
          <>
            <Button
              onClick={handleClose}
              sx={{
                textTransform: "none",
                borderRadius: "6px",
                color: colors.grey[700],
                backgroundColor: "rgba(255,255,255,0.85)",
                border: "1px solid",
                borderColor: colors.grey[300],
                "&:hover": {
                  backgroundColor: colors.grey[100],
                  borderColor: colors.grey[400],
                },
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSendOTP}
              variant="contained"
              startIcon={
                <EmailOutlined sx={{ fontSize: 18, color: colors.grey[700] }} />
              }
              disabled={isLoading}
              sx={{
                textTransform: "none",
                borderRadius: "6px",
                color: colors.grey[700],
                backgroundColor: "rgba(255,255,255,0.85)",
                border: "1px solid",
                borderColor: colors.grey[300],
                "&:hover": {
                  backgroundColor: colors.tealAccent[300],
                  borderColor: colors.tealAccent[500],
                  color: colors.grey[100],
                  "& .MuiSvgIcon-root": {
                    color: colors.tealAccent[800],
                  },
                },
              }}
            >
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Enviar código"
              )}
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => setStep("confirm")}
              sx={{
                textTransform: "none",
                borderRadius: "6px",
                color: colors.grey[700],
                backgroundColor: "rgba(255,255,255,0.85)",
                border: "1px solid",
                borderColor: colors.grey[300],
                "&:hover": {
                  backgroundColor: colors.grey[100],
                  borderColor: colors.grey[400],
                },
              }}
            >
              Volver
            </Button>
            <Button
              onClick={() => onOTPValidate(otp)}
              variant="contained"
              disabled={otp.length !== 6 || isCodeExpired}
              startIcon={
                <SecurityOutlined
                  sx={{ fontSize: 18, color: colors.grey[700] }}
                />
              }
              sx={{
                textTransform: "none",
                borderRadius: "6px",
                color: colors.grey[700],
                backgroundColor: "rgba(255,255,255,0.85)",
                border: "1px solid",
                borderColor: colors.grey[300],
                "&:hover": {
                  backgroundColor: colors.tealAccent[300],
                  borderColor: colors.tealAccent[500],
                  color: colors.grey[100],
                  "& .MuiSvgIcon-root": {
                    color: colors.tealAccent[800],
                  },
                },
              }}
            >
              Validar
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SignatureModal;
