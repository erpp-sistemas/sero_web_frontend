import React, { useState, useEffect, useRef } from "react";
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
  Grow,
} from "@mui/material";
import { tokens } from "../../theme";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";
import {
  AccessTime,
  CheckCircleOutline,
  EmailOutlined,
  SecurityOutlined,
} from "@mui/icons-material";
import { QRCode } from "react-qr-code";
import { toPng } from "html-to-image";
import { requestOTP, validateOTP } from "../../api/otp";

const SignatureModal = ({
  open,
  onClose,
  userEmail,
  onOTPRequest,
  onOTPValidate,
  documentData,
  onSignatureComplete,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const qrContainerRef = useRef(null);

  const [step, setStep] = useState("confirm"); // "confirm" | "otp"
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isCodeExpired, setIsCodeExpired] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [showResendAlert, setShowResendAlert] = useState(false);
  const [isAlertRendered, setIsAlertRendered] = useState(false);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      remainingSeconds.toString().padStart(2, "0"),
    ].join(":");
  };

  // Reset al cerrar
  const handleClose = () => {
    setStep("confirm");
    setOtp("");
    setCountdown(0);
    setIsCodeExpired(false);
    onClose();
  };

  // Manejar el cierre del modal - solo permitir cierre desde botones
  const handleModalClose = (event, reason) => {
    if (reason && reason === "backdropClick") {
      // Prevenir cierre al hacer clic fuera del modal
      return;
    }
    if (reason && reason === "escapeKeyDown") {
      // Prevenir cierre con la tecla ESC
      return;
    }
    handleClose();
  };

  useEffect(() => {
    if (showResendAlert) {
      setIsAlertRendered(true); // Montar el componente
    }
  }, [showResendAlert]);

  // Escuchar cuando la animación de salida termina
  const handleExited = () => {
    setIsAlertRendered(false); // Desmontar después de la animación
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
  const handleSendOTP = async () => {
    setIsLoading(true);
    setIsCodeExpired(false);
    setOtp("");

    try {
      // Llamar a la API real
      const response = await requestOTP(userEmail, documentData);

      if (response.success) {
        setStep("otp");
        setCountdown(300); // 5 minutos en segundos

        // También llamar al callback del padre si existe
        if (onOTPRequest) {
          onOTPRequest(() => {
            console.log("✅ OTP request callback executed");
          });
        }
      } else {
        throw new Error(response.message || "Error al enviar el código");
      }
    } catch (error) {
      console.error("❌ Error sending OTP:", error);

      // Mostrar mensaje de error al usuario
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Reenviar código - MODIFICADO para mantener la interfaz visible
  const handleResendCode = async () => {
    setIsResending(true);
    // NO cambiamos setIsCodeExpired(false) aquí para mantener visible la sección

    try {
      await requestOTP(userEmail, documentData);

      setCountdown(300);
      setShowResendAlert(true);
      setTimeout(() => setShowResendAlert(false), 3000);

      // Solo marcamos como no expirado cuando el reenvío es exitoso
      setIsCodeExpired(false);
    } catch (error) {
      console.error("Error resending OTP:", error);
      // Mantenemos isCodeExpired como true si falla el reenvío
    } finally {
      setIsResending(false);
    }
  };

  // Función de hash segura mejorada - REEMPLAZA generateVerificationHash
  const generateSecureHash = async (options = {}) => {
    const {
      algorithm = "SHA-256",
      includeTimestamp = true,
      includeUniqueId = true,
    } = options;

    try {
      // Datos base para el hash
      const baseData = `${userEmail}-${documentData?.id || "unknown-document"}`;

      // Salts para mayor seguridad
      const timestampSalt = includeTimestamp
        ? new Date().toISOString() +
          "|" +
          Intl.DateTimeFormat().resolvedOptions().timeZone
        : "";

      const uniqueIdSalt = includeUniqueId ? crypto.randomUUID() : "";
      const documentSalt = documentData?.id ? `|DOC-${documentData.id}` : "";
      const employeeSalt = documentData?.employeeId
        ? `|EMP-${documentData.employeeId}`
        : "";

      // Combinar todos los componentes
      const combinedData = `${baseData}|${timestampSalt}|${uniqueIdSalt}${documentSalt}${employeeSalt}`;

      // Codificar y calcular hash
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(combinedData);
      const hashBuffer = await crypto.subtle.digest(algorithm, dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));

      // Convertir a hexadecimal
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      return {
        hash: hashHex,
        algorithm,
        timestamp: includeTimestamp ? new Date().toISOString() : undefined,
        timezone: includeTimestamp
          ? Intl.DateTimeFormat().resolvedOptions().timeZone
          : undefined,
        uniqueId: includeUniqueId ? uniqueIdSalt : undefined,
        documentId: documentData?.id || undefined,
        employeeId: documentData?.employeeId || undefined,
      };
    } catch (error) {
      console.error("Error generando hash seguro:", error);

      // Fallback seguro con máxima entropía
      const fallbackData = `${userEmail}|${Date.now()}|${Math.random()
        .toString(36)
        .slice(2)}|${
        crypto.randomUUID?.() || Math.random().toString(36).slice(2)
      }|${documentData?.id || "fallback"}`;
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(fallbackData);
      const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));

      return {
        hash: hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""),
        algorithm: "SHA-256",
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        uniqueId: crypto.randomUUID?.() || Math.random().toString(36).slice(2),
        documentId: documentData?.id || "fallback",
        employeeId: documentData?.employeeId || undefined,
        isFallback: true,
        error: error.message,
      };
    }
  };

  // En tu SignatureModal.js
  const handleValidateOTP = async () => {
    if (otp.length !== 6) return;

    setIsLoading(true);

    try {
      // 1. Primero validar el OTP con el backend
      const validationResult = await validateOTP(userEmail, otp, documentData);

      if (!validationResult.success) {
        throw new Error(validationResult.message || "Código inválido");
      }

      // 2. Si el OTP es válido, generar el hash seguro y QR
      const hashResult = await generateSecureHash();

      const verificationData = {
        documentId: documentData?.id || "RESP-" + Date.now(),
        employee: documentData?.employeeId || "N/A",
        employeeName: documentData?.employee?.name || "N/A",
        email: userEmail,
        date: new Date().toISOString(),
        hash: hashResult.hash,
        otp: otp,
        timestamp: hashResult.timestamp,
        timezone: hashResult.timezone,
        validationId: validationResult.validationId,
        hashMetadata: {
          algorithm: hashResult.algorithm,
          uniqueId: hashResult.uniqueId,
          documentId: hashResult.documentId,
          employeeId: hashResult.employeeId,
          isFallback: hashResult.isFallback || false,
          error: hashResult.error,
        },
      };

      setQrData(verificationData);

      // Esperar un frame para asegurar que el QR se renderice
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (qrContainerRef.current) {
        const qrImage = await toPng(qrContainerRef.current, {
          quality: 1,
          pixelRatio: 2,
          backgroundColor: "white",
          skipFonts: true,
          cacheBust: true,
        });

        const signatureCompleteData = {
          success: true,
          qrImage: qrImage,
          qrData: JSON.stringify(verificationData),
          codigo_verificacion: otp,
          timestamp: new Date().toISOString(),
          verificationHash: hashResult.hash,
          hashMetadata: hashResult,
          validationId: validationResult.validationId,
        };

        console.log(
          "📤 SignatureModal enviando datos seguros:",
          signatureCompleteData
        );

        // Llamar a los callbacks
        if (onSignatureComplete) {
          onSignatureComplete(signatureCompleteData);
        }

        if (onOTPValidate) {
          onOTPValidate(
            otp,
            {
              qrImage,
              qrData: JSON.stringify(verificationData),
            },
            signatureCompleteData
          );
        }
      }
    } catch (error) {
      console.error("Error validating OTP:", error);

      // Mostrar error al usuario
      if (onSignatureComplete) {
        onSignatureComplete({
          success: false,
          error: error.message,
          timestamp: new Date().toISOString(),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleModalClose}
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
              autoFocus
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

            {isAlertRendered && (
              <Grow
                in={showResendAlert}
                timeout={{ enter: 300, exit: 450 }}
                onExited={handleExited}
                style={{ transformOrigin: "left center" }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: colors.greenAccent[600],
                    fontSize: "0.725rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mt: 0.5,
                    fontWeight: 500,
                    letterSpacing: 0.2,
                  }}
                >
                  <CheckCircleOutline sx={{ fontSize: "0.9rem" }} />
                  ¡Código reenviado!
                </Typography>
              </Grow>
            )}

            <div style={{ position: "absolute", left: "-9999px" }}>
              {qrData && (
                <div
                  ref={qrContainerRef}
                  style={{
                    padding: "12px",
                    backgroundColor: "white",
                    borderRadius: "8px",
                  }}
                >
                  <QRCode
                    value={JSON.stringify(qrData)}
                    size={200}
                    level="H"
                    bgColor="white"
                    fgColor="#000000"
                  />
                </div>
              )}
            </div>

            {countdown > 0 ? (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}
              >
                <AccessTime
                  sx={{
                    fontSize: "16px",
                    color:
                      countdown < 60 ? colors.redAccent[400] : colors.grey[200],
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      countdown < 60 ? colors.redAccent[400] : colors.grey[200],
                    fontSize: "0.75rem",
                    fontFamily: "monospace",
                    fontWeight: countdown < 60 ? 600 : 400,
                  }}
                >
                  El código expira en {formatTime(countdown)}
                </Typography>
              </Box>
            ) : (
              (isCodeExpired || isResending) && (
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
                      {isResending
                        ? "Reenviando código..."
                        : "El código ha expirado"}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: colors.grey[100],
                        fontSize: "0.7rem",
                      }}
                    >
                      {isResending
                        ? "Espere un momento..."
                        : "Para continuar, solicita un nuevo código"}
                    </Typography>
                  </Box>
                  <Button
                    onClick={handleResendCode}
                    disabled={isResending}
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
                        backgroundColor: isResending
                          ? "transparent"
                          : colors.redAccent[100],
                      },
                      "&.Mui-disabled": {
                        color: colors.grey[500],
                        borderColor: colors.grey[400],
                      },
                    }}
                  >
                    {isResending ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      "Haz clic para reenviar código"
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
                isLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <EmailOutlined
                    sx={{ fontSize: 18, color: colors.grey[700] }}
                  />
                )
              }
              disabled={isLoading}
              sx={{
                textTransform: "none",
                borderRadius: "极px",
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
                "&.Mui-disabled": {
                  backgroundColor: colors.grey[300],
                  color: colors.grey[500],
                },
              }}
            >
              {isLoading ? "Enviando..." : "Enviar código"}
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
                border: "极px solid",
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
              onClick={handleValidateOTP}
              variant="contained"
              disabled={otp.length !== 6 || isCodeExpired || isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={18} color="inherit" />
                ) : (
                  <SecurityOutlined
                    sx={{ fontSize: 18, color: colors.grey[700] }}
                  />
                )
              }
              sx={{
                textTransform: "none",
                borderRadius: "6px",
                color: colors.grey[700],
                backgroundColor: "rgba(255,255,255,0.85)",
                border: "1px solid",
                borderColor: colors.grey[300],
                "极:hover": {
                  backgroundColor: colors.tealAccent[300],
                  borderColor: colors.tealAccent[500],
                  color: colors.grey[100],
                  "& .MuiSvgIcon-root": {
                    color: colors.tealAccent[800],
                  },
                },
                "&.Mui-disabled": {
                  backgroundColor: colors.grey[300],
                  color: colors.grey[500],
                },
              }}
            >
              {isLoading ? "Validando..." : "Validar"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SignatureModal;
