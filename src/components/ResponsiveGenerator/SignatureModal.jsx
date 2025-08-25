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
  CheckCircleOutline,
  EmailOutlined,
  SecurityOutlined,
} from "@mui/icons-material";
import { QRCode } from "react-qr-code";
import { toPng } from "html-to-image";

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
  const [isCodeExpired, setIsCodeExpired] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [showResendAlert, setShowResendAlert] = useState(false);
  const [isAlertRendered, setIsAlertRendered] = useState(false);

  // Reset al cerrar
  const handleClose = () => {
    setStep("confirm");
    setOtp("");
    setCountdown(0);
    setIsCodeExpired(false);
    onClose();
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
  const handleSendOTP = () => {
    setIsLoading(true);
    setIsCodeExpired(false);
    setOtp("");
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
    setOtp("");
    onOTPRequest(() => {
      setCountdown(30);
      setIsLoading(false);
      setShowResendAlert(true); // ← Mostrar alerta
      setTimeout(() => setShowResendAlert(false), 3000); // ← Ocultar después de 3s
    });
  };

  const generateVerificationHash = async () => {
    try {
      const data = `${userEmail}-${Date.now()}-${crypto.randomUUID()}`;
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch (error) {
      console.error("Error generating hash:", error);
      return `fallback-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}`;
    }
  };

  // Agrega esta función en SignatureModal para generar hashes consistentes
  const generateSecureHash = async (data, options = {}) => {
    const {
      algorithm = "SHA-256",
      includeTimestamp = true,
      includeUniqueId = true,
      documentId = null,
    } = options;

    try {
      // Salts para el hash
      const timestampSalt = includeTimestamp
        ? new Date().toISOString() +
          "|" +
          Intl.DateTimeFormat().resolvedOptions().timeZone
        : "";

      const uniqueIdSalt = includeUniqueId ? crypto.randomUUID() : "";
      const documentSalt = documentId ? `|DOC-${documentId}` : "";

      // Combinar todos los componentes
      const combinedData = `${data}|${timestampSalt}|${uniqueIdSalt}${documentSalt}`;

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
        documentId: documentId || undefined,
      };
    } catch (error) {
      console.error("Error generando hash seguro:", error);

      // Fallback seguro
      const fallbackHash = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(
          `${data}|${Date.now()}|${Math.random().toString(36).slice(2)}|${
            nuevoArticulo?.id || "fallback"
          }`
        )
      );
      const fallbackArray = Array.from(new Uint8Array(fallbackHash));

      return {
        hash: fallbackArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
        algorithm: "SHA-256",
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
      // Generar hash seguro
      const verificationHash = await generateVerificationHash();

      const verificationData = {
        documentId: documentData?.id || "RESP-" + Date.now(),
        employee:
          documentData?.employeeId || documentData?.employee?.id || "N/A",
        employeeName: documentData?.employee?.name || "N/A",
        email: userEmail,
        date: new Date().toISOString(),
        hash: verificationHash,
        otp: otp, // Incluir el OTP en los datos
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
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
          verificationHash: verificationHash,
          hashMetadata: {
            algorithm: "SHA-256",
            timestamp: new Date().toISOString(),
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            uniqueId: crypto.randomUUID?.(),
            documentId: verificationData.documentId,
          },
        };

        console.log("📤 SignatureModal enviando:", signatureCompleteData);

        // Llamar a ambos callbacks
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
      console.error("Error generating QR:", error);
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
                timeout={{ enter: 300, exit: 450 }} // Transiciones más rápidas
                onExited={handleExited}
                style={{ transformOrigin: "left center" }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: colors.greenAccent[600], // Verde un poco más oscuro
                    fontSize: "0.725rem", // Tamaño ligeramente menor
                    display: "flex", // Para integrar icono si quieres
                    alignItems: "center",
                    gap: 0.5, // Espaciado entre icono y texto
                    mt: 0.5, // Menos margen superior
                    fontWeight: 500, // Peso medio (no bold)
                    letterSpacing: 0.2, // Espaciado sutil entre letras
                  }}
                >
                  <CheckCircleOutline sx={{ fontSize: "0.9rem" }} />{" "}
                  {/* Icono opcional */}
                  ¡Código reenviado! {/* Texto más corto */}
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
              onClick={handleValidateOTP}
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
