import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Chip,
  Stack,
  Dialog,
  DialogContent,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  Verified as VerifiedIcon,
  Error as ErrorIcon,
  Download as DownloadIcon,
  Security as SecurityIcon,
  OpenInNew as OpenInNewIcon,
  Close as CloseIcon,
  Fullscreen as FullscreenIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import { verifyResponsiva, getResponsivaPDFUrl } from "../../api/responsive.js";

const Index = () => {
  const theme = useTheme();
  const [searchParams] = useSearchParams();
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfInfo, setPdfInfo] = useState(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [viewerError, setViewerError] = useState(false);

  const token = searchParams.get("token");
  const hash = searchParams.get("hash");

  useEffect(() => {
    if (token && hash) {
      verifyAndLoadPDF();
    } else {
      setError("Faltan parámetros de verificación (token y hash)");
      setLoading(false);
    }
  }, [token, hash]);

  const verifyAndLoadPDF = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await verifyResponsiva(token, hash);
      setVerificationData(data);

      if (data.isValid && data.document?.id) {
        await loadPDF(data.document.id);
      }
    } catch (err) {
      setError(err.message || "Error en la verificación");
    } finally {
      setLoading(false);
    }
  };

  const loadPDF = async (documentId) => {
    try {
      setPdfLoading(true);
      setViewerError(false);
      const response = await getResponsivaPDFUrl(documentId, token);
      setPdfInfo(response.data);
    } catch (err) {
      console.error("Error cargando PDF:", err);
      setViewerError(true);
    } finally {
      setPdfLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (pdfInfo?.s3Url) {
      window.open(pdfInfo.s3Url, "_blank");
    }
  };

  const handleOpenInNewTab = () => {
    if (pdfInfo?.pdfUrl) {
      window.open(pdfInfo.pdfUrl, "_blank");
    }
  };

  const handleOpenDirectUrl = () => {
    if (pdfInfo?.directUrl) {
      window.open(pdfInfo.directUrl, "_blank");
    }
  };

  // Componente de visor de PDF
  const PDFViewer = ({ fullscreen = false }) => {
    if (pdfLoading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={fullscreen ? "80vh" : "400px"}
          flexDirection="column"
          gap={2}
          sx={{
            backgroundColor:
              theme.palette.mode === "dark" ? "#2c2c2c" : "#f8f9fa",
            borderRadius: "8px",
          }}
        >
          <CircularProgress size={32} />
          <Typography variant="body2" color="text.secondary">
            Cargando documento...
          </Typography>
        </Box>
      );
    }

    if (viewerError || !pdfInfo?.pdfUrl) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={fullscreen ? "80vh" : "400px"}
          flexDirection="column"
          gap={2}
          p={2}
          sx={{
            backgroundColor:
              theme.palette.mode === "dark" ? "#2c2c2c" : "#f8f9fa",
            borderRadius: "8px",
          }}
        >
          <ErrorIcon color="error" sx={{ fontSize: 40 }} />
          <Typography variant="body2" color="error" align="center">
            No pudimos cargar el visor del documento
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            textAlign="center"
            sx={{ maxWidth: "400px" }}
          >
            Esto puede deberse a problemas de conexión o formato del archivo.
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button
              variant="outlined"
              size="small"
              onClick={() => loadPDF(verificationData.document.id)}
            >
              Reintentar
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleOpenDirectUrl}
              startIcon={<OpenInNewIcon />}
            >
              Abrir directamente
            </Button>
          </Stack>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          width: "100%",
          height: fullscreen ? "80vh" : "500px",
          borderRadius: "8px",
          overflow: "hidden",
          backgroundColor:
            theme.palette.mode === "dark" ? "#2c2c2c" : "#f8f9fa",
          boxShadow: "none",
          border: `1px solid ${
            theme.palette.mode === "dark" ? "#404040" : "#e0e0e0"
          }`,
        }}
      >
        <iframe
          src={pdfInfo.pdfUrl}
          title="Documento verificado"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
          loading="eager"
          allowFullScreen
          onError={(e) => {
            console.error("Error cargando el visor PDF:", e);
            setViewerError(true);
          }}
        />
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="60vh"
        >
          <CircularProgress size={40} sx={{ mb: 2, color: "text.secondary" }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Verificando documento
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Estamos validando la autenticidad e integridad del documento...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: "12px",
            bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",
            boxShadow: "none",
            border: `1px solid ${
              theme.palette.mode === "dark" ? "#404040" : "#e0e0e0"
            }`,
          }}
        >
          <Box textAlign="center">
            <ErrorIcon sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
            <Typography variant="h6" color="text.primary" gutterBottom>
              No podemos verificar este documento
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {error.includes("parámetros")
                ? "El enlace de verificación está incompleto. Asegúrate de usar el enlace completo proporcionado."
                : "Ocurrió un problema durante la verificación. Esto puede deberse a un enlace inválido o expirado."}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mb: 3 }}
            >
              Si crees que esto es un error, contacta al administrador del
              sistema.
            </Typography>
            <Button
              variant="contained"
              onClick={verifyAndLoadPDF}
              startIcon={<SecurityIcon />}
            >
              Reintentar verificación
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (!verificationData) return null;

  const { isValid, document } = verificationData;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header de verificación */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: "12px",
          bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",
          boxShadow: "none",
          border: `1px solid ${
            isValid
              ? theme.palette.mode === "dark"
                ? "#404040"
                : "#e0e0e0"
              : theme.palette.mode === "dark"
              ? "#f44336"
              : "#ffebee"
          }`,
        }}
      >
        <Stack spacing={2} alignItems="center" textAlign="center">
          {isValid ? (
            <>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "50%",
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "success.dark"
                      : "success.light",
                  color:
                    theme.palette.mode === "dark"
                      ? "success.contrastText"
                      : "success.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <VerifiedIcon sx={{ fontSize: 36 }} />
              </Box>
              <Typography variant="h4" fontWeight={600} color="text.primary">
                Verificación exitosa
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Hemos confirmado que este documento es auténtico y no ha sido
                alterado.
              </Typography>
              {document?.folio && (
                <Chip
                  label={`Folio: ${document.folio}`}
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "success.dark"
                        : "success.light",
                    color:
                      theme.palette.mode === "dark" ? "#fff" : "success.dark",
                    fontWeight: 500,
                    fontSize: "0.9rem",
                    height: 32,
                  }}
                />
              )}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 1,
                  p: 1.5,
                  borderRadius: "6px",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(76, 175, 80, 0.1)"
                      : "rgba(76, 175, 80, 0.05)",
                  border: `1px solid ${
                    theme.palette.mode === "dark"
                      ? "rgba(76, 175, 80, 0.3)"
                      : "rgba(76, 175, 80, 0.2)"
                  }`,
                  maxWidth: "500px",
                }}
              >
                <InfoIcon sx={{ fontSize: 18, mr: 1, color: "success.main" }} />
                <Typography variant="caption" color="text.secondary">
                  Este documento fue firmado digitalmente y verificado con
                  tecnología blockchain.
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: "50%",
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? "error.dark"
                      : "error.light",
                  color:
                    theme.palette.mode === "dark"
                      ? "error.contrastText"
                      : "error.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ErrorIcon sx={{ fontSize: 36 }} />
              </Box>
              <Typography variant="h4" fontWeight={600} color="text.primary">
                Verificación fallida
              </Typography>
              <Typography variant="body1" color="text.secondary">
                No pudimos verificar la autenticidad de este documento.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 1,
                  p: 1.5,
                  borderRadius: "6px",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(244, 67, 54, 0.1)"
                      : "rgba(244, 67, 54, 0.05)",
                  border: `1px solid ${
                    theme.palette.mode === "dark"
                      ? "rgba(244, 67, 54, 0.3)"
                      : "rgba(244, 67, 54, 0.2)"
                  }`,
                  maxWidth: "500px",
                }}
              >
                <InfoIcon sx={{ fontSize: 18, mr: 1, color: "error.main" }} />
                <Typography variant="caption" color="text.secondary">
                  Esto puede deberse a una alteración del documento o a un error
                  en el proceso de firma.
                </Typography>
              </Box>
            </>
          )}
        </Stack>
      </Paper>

      {isValid && (
        <>
          {/* Visor de PDF integrado */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "12px",
              bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",
              boxShadow: "none",
              border: `1px solid ${
                theme.palette.mode === "dark" ? "#404040" : "#e0e0e0"
              }`,
              mb: 3,
            }}
          >
            <Stack spacing={3}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
              >
                <Typography variant="h6" fontWeight={600}>
                  Documento Verificado
                </Typography>

                <Box display="flex" gap={1} flexWrap="wrap">
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<FullscreenIcon />}
                    onClick={() => setFullscreenOpen(true)}
                    disabled={!pdfInfo}
                    sx={{ borderRadius: "20px" }}
                  >
                    Pantalla completa
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<OpenInNewIcon />}
                    onClick={handleOpenInNewTab}
                    disabled={!pdfInfo}
                    sx={{ borderRadius: "20px" }}
                  >
                    Abrir en pestaña
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadPDF}
                    disabled={!pdfInfo}
                    sx={{ borderRadius: "20px" }}
                  >
                    Descargar
                  </Button>
                </Box>
              </Box>

              <PDFViewer />
            </Stack>
          </Paper>

          {/* Modal de pantalla completa */}
          <Dialog
            open={fullscreenOpen}
            onClose={() => setFullscreenOpen(false)}
            maxWidth="xl"
            fullWidth
            sx={{
              "& .MuiDialog-paper": {
                height: "90vh",
                maxHeight: "90vh",
                overflow: "hidden",
                borderRadius: "8px",
                backgroundColor:
                  theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",
              },
            }}
          >
            <DialogContent sx={{ p: 0, height: "100%" }}>
              <Box
                display="flex"
                justifyContent="flex-end"
                alignItems="center"
                position="absolute"
                top={8}
                right={8}
                zIndex={1000}
              >
                <IconButton
                  onClick={() => setFullscreenOpen(false)}
                  size="medium"
                  sx={{
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#2c2c2c" : "#ffffff",
                    boxShadow: theme.shadows[2],
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "dark" ? "#3c3c3c" : "#f5f5f5",
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
              <PDFViewer fullscreen />
            </DialogContent>
          </Dialog>

          {/* Información del documento */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "12px",
              bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#ffffff",
              boxShadow: "none",
              border: `1px solid ${
                theme.palette.mode === "dark" ? "#404040" : "#e0e0e0"
              }`,
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              gutterBottom
              sx={{ mb: 2 }}
            >
              Información de Verificación
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                gap: 2,
              }}
            >
              {/* Fecha de verificación */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 1.5,
                  borderRadius: "8px",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(50, 50, 50, 0.3)"
                      : "rgba(0, 0, 0, 0.02)",
                  border: `1px solid ${
                    theme.palette.mode === "dark" ? "#353535" : "#f0f0f0"
                  }`,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  gutterBottom
                >
                  Fecha de verificación
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {new Date().toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>

              {/* Folio del documento */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 1.5,
                  borderRadius: "8px",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(50, 50, 50, 0.3)"
                      : "rgba(0, 0, 0, 0.02)",
                  border: `1px solid ${
                    theme.palette.mode === "dark" ? "#353535" : "#f0f0f0"
                  }`,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  gutterBottom
                >
                  Folio del documento
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {document.folio}
                </Typography>
              </Box>

              {/* Fecha de firma */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 1.5,
                  borderRadius: "8px",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(50, 50, 50, 0.3)"
                      : "rgba(0, 0, 0, 0.02)",
                  border: `1px solid ${
                    theme.palette.mode === "dark" ? "#353535" : "#f0f0f0"
                  }`,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  gutterBottom
                >
                  Fecha de firma
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  {new Date(document.fechaFirma).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              </Box>

              {/* Estado */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  p: 1.5,
                  borderRadius: "8px",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(50, 50, 50, 0.3)"
                      : "rgba(0, 0, 0, 0.02)",
                  border: `1px solid ${
                    theme.palette.mode === "dark" ? "#353535" : "#f0f0f0"
                  }`,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  gutterBottom
                >
                  Estado
                </Typography>
                <Box>
                  <Chip
                    label={document.estado}
                    color="success"
                    size="small"
                    variant="filled"
                    sx={{
                      height: 24,
                      fontWeight: 500,
                      "& .MuiChip-label": {
                        px: 1,
                        fontSize: "0.75rem",
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        </>
      )}

      <Box
        component="footer"
        sx={{
          mt: 6,
          pt: 2,
          pb: 3,
          px: 2,
          borderTop: `1px solid ${
            theme.palette.mode === "dark" ? "#404040" : "#e0e0e0"
          }`,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          {/* Información de derechos y versión */}
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              gutterBottom
            >
              © {new Date().getFullYear()} ERPP Corporativo. Todos los derechos
              reservados.
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Generado automáticamente por el sistema Ser0 • v2.1.0
            </Typography>

            {/* Timestamp de verificación */}
            {isValid && (
              <Typography
                variant="caption"
                color="text.disabled"
                display="block"
                sx={{ mt: 1 }}
              >
                Verificado el{" "}
                {new Date().toLocaleDateString("es-MX", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                a las{" "}
                {new Date().toLocaleTimeString("es-MX", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            )}
          </Box>
        </Container>
      </Box>
    </Container>
  );
};

export default Index;
