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
  Grid,
  Divider,
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
  QrCode as QrCodeIcon,
  CalendarToday as CalendarIcon,
  Fingerprint as FingerprintIcon,
  Description as DescriptionIcon,
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

  // const handleOpenInNewTab = () => {
  //   if (pdfInfo?.pdfUrl) {
  //     window.open(pdfInfo.pdfUrl, "_blank");
  //   }
  // };

  // const handleOpenDirectUrl = () => {
  //   if (pdfInfo?.directUrl) {
  //     window.open(pdfInfo.directUrl, "_blank");
  //   }
  // };

  const getBlobUrl = () => {
    if (!pdfInfo?.pdfBase64) return null;

    try {
      // Limpiar el base64 (remover el prefijo data URL si existe)
      const base64Data = pdfInfo.pdfBase64.replace(
        /^data:application\/pdf;base64,/,
        ""
      );

      // Convertir base64 a blob
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: "application/pdf" });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error creando blob URL:", error);
      return null;
    }
  };

  // Componente de visor de PDF
  const PDFViewer = ({ fullscreen = false }) => {
    const [blobUrl, setBlobUrl] = useState(null);

    useEffect(() => {
      const url = getBlobUrl();
      setBlobUrl(url);

      // Cleanup function para revocar la URL cuando el componente se desmonte
      return () => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      };
    }, [pdfInfo?.pdfBase64]);

    if (pdfLoading) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={fullscreen ? "80vh" : "100%"}
          flexDirection="column"
          gap={2}
          sx={{
            backgroundColor:
              theme.palette.mode === "dark" ? "#1a1a1a" : "#fafafa",
            borderRadius: "12px",
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
          minHeight={fullscreen ? "80vh" : "100%"}
          flexDirection="column"
          gap={2}
          p={2}
          sx={{
            backgroundColor:
              theme.palette.mode === "dark" ? "#1a1a1a" : "#fafafa",
            borderRadius: "12px",
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
          height: fullscreen ? "80vh" : "100%",
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor:
            theme.palette.mode === "dark" ? "#1a1a1a" : "#fafafa",
          boxShadow: "none",
          border: `1px solid ${
            theme.palette.mode === "dark" ? "#333" : "#e0e0e0"
          }`,
        }}
      >
        <iframe
          src={blobUrl}
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
            bgcolor: theme.palette.mode === "dark" ? "#1a1a1a" : "#ffffff",
            boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
            border: `1px solid ${
              theme.palette.mode === "dark" ? "#333" : "#e0e0e0"
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
              sx={{ borderRadius: "8px" }}
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
    <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
      <Grid container spacing={3}>
        {/* Panel izquierdo - 40% - Información de verificación */}
        <Grid item xs={12} md={5} lg={4}>
          <Box sx={{ position: "sticky", top: 24 }}>
            {/* Header de verificación */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "16px",
                bgcolor: theme.palette.mode === "dark" ? "#1a1a1a" : "#ffffff",
                boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.08)",
                border: `1px solid ${
                  theme.palette.mode === "dark" ? "#333" : "#e0e0e0"
                }`,
                mb: 3,
              }}
            >
              <Stack spacing={2.5} alignItems="center" textAlign="center">
                {isValid ? (
                  <>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: "50%",
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? "rgba(76, 175, 80, 0.15)"
                            : "rgba(76, 175, 80, 0.08)",
                        color: "success.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <VerifiedIcon sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography
                      variant="h5"
                      fontWeight={600}
                      color="text.primary"
                    >
                      Verificación exitosa
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      Hemos confirmado que este documento es auténtico y no ha
                      sido alterado.
                    </Typography>
                    {document?.folio && (
                      <Chip
                        label={`Folio: ${document.folio}`}
                        sx={{
                          backgroundColor:
                            theme.palette.mode === "dark"
                              ? "rgba(76, 175, 80, 0.2)"
                              : "rgba(76, 175, 80, 0.1)",
                          color: "success.main",
                          fontWeight: 500,
                          height: 32,
                          borderRadius: "6px",
                        }}
                      />
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        mt: 1,
                        p: 2,
                        borderRadius: "12px",
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(76, 175, 80, 0.08)"
                            : "rgba(76, 175, 80, 0.04)",
                        border: `1px solid ${
                          theme.palette.mode === "dark"
                            ? "rgba(76, 175, 80, 0.2)"
                            : "rgba(76, 175, 80, 0.1)"
                        }`,
                      }}
                    >
                      <InfoIcon
                        sx={{
                          fontSize: 18,
                          mr: 1.5,
                          color: "success.main",
                          mt: 0.2,
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ lineHeight: 1.5 }}
                      >
                        Este documento fue firmado digitalmente y verificado con
                        tecnología blockchain.
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: "50%",
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? "rgba(244, 67, 54, 0.15)"
                            : "rgba(244, 67, 54, 0.08)",
                        color: "error.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <ErrorIcon sx={{ fontSize: 40 }} />
                    </Box>
                    <Typography
                      variant="h5"
                      fontWeight={600}
                      color="text.primary"
                    >
                      Verificación fallida
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      No pudimos verificar la autenticidad de este documento.
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        mt: 1,
                        p: 2,
                        borderRadius: "12px",
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(244, 67, 54, 0.08)"
                            : "rgba(244, 67, 54, 0.04)",
                        border: `1px solid ${
                          theme.palette.mode === "dark"
                            ? "rgba(244, 67, 54, 0.2)"
                            : "rgba(244, 67, 54, 0.1)"
                        }`,
                      }}
                    >
                      <InfoIcon
                        sx={{
                          fontSize: 18,
                          mr: 1.5,
                          color: "error.main",
                          mt: 0.2,
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ lineHeight: 1.5 }}
                      >
                        Esto puede deberse a una alteración del documento o a un
                        error en el proceso de firma.
                      </Typography>
                    </Box>
                  </>
                )}
              </Stack>
            </Paper>

            {isValid && (
              /* Información del documento */
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  bgcolor:
                    theme.palette.mode === "dark" ? "#1a1a1a" : "#ffffff",
                  boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.08)",
                  border: `1px solid ${
                    theme.palette.mode === "dark" ? "#333" : "#e0e0e0"
                  }`,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  gutterBottom
                  sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <DescriptionIcon fontSize="small" />
                  Información de Verificación
                </Typography>

                <Stack spacing={2.5}>
                  {/* Fecha de verificación */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >
                    <CalendarIcon
                      sx={{ color: "text.secondary", fontSize: 20, mt: 0.5 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
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
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  {/* Folio del documento */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >
                    <FingerprintIcon
                      sx={{ color: "text.secondary", fontSize: 20, mt: 0.5 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        gutterBottom
                      >
                        Folio del documento
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {document.folio}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  {/* Fecha de firma */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >
                    <CalendarIcon
                      sx={{ color: "text.secondary", fontSize: 20, mt: 0.5 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        gutterBottom
                      >
                        Fecha de firma
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {new Date(document.fechaFirma).toLocaleDateString(
                          "es-MX",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1 }} />

                  {/* Estado */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 2,
                    }}
                  >
                    <QrCodeIcon
                      sx={{ color: "text.secondary", fontSize: 20, mt: 0.5 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        gutterBottom
                      >
                        Estado
                      </Typography>
                      <Chip
                        label={document.estado}
                        color="success"
                        size="small"
                        variant="filled"
                        sx={{
                          height: 24,
                          fontWeight: 500,
                          borderRadius: "6px",
                          "& .MuiChip-label": {
                            px: 1.5,
                            fontSize: "0.75rem",
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Stack>
              </Paper>
            )}
          </Box>
        </Grid>

        {/* Panel derecho - 60% - Visor de PDF */}
        <Grid item xs={12} md={7} lg={8}>
          {isValid && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: "16px",
                bgcolor: theme.palette.mode === "dark" ? "#1a1a1a" : "#ffffff",
                boxShadow: "0px 2px 12px rgba(0, 0, 0, 0.08)",
                border: `1px solid ${
                  theme.palette.mode === "dark" ? "#333" : "#e0e0e0"
                }`,
                height: "calc(100vh - 100px)",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
                gap={2}
                sx={{ mb: 3 }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <DescriptionIcon fontSize="small" />
                  Documento Verificado
                </Typography>

                <Box display="flex" gap={1} flexWrap="wrap">
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadPDF}
                    disabled={!pdfInfo}
                    sx={{ borderRadius: "8px", textTransform: "none" }}
                  >
                    Descargar
                  </Button>
                </Box>
              </Box>

              <Box sx={{ flex: 1, minHeight: 0 }}>
                <PDFViewer />
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          mt: 4,
          pt: 3,
          borderTop: `1px solid ${
            theme.palette.mode === "dark" ? "#333" : "#e0e0e0"
          }`,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Sistema de Verificación de Documentos • {new Date().getFullYear()}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            © {new Date().getFullYear()} ERPP Corporativo. Todos los derechos
            reservados.
          </Typography>
          <Typography variant="caption" color="text.disabled" display="block">
            Generado automáticamente por el sistema Ser0 • v2.1.0
          </Typography>

          {isValid && (
            <Typography
              variant="caption"
              color="text.disabled"
              display="block"
              sx={{ mt: 1 }}
            >
              Verificado el {new Date().toLocaleDateString("es-MX")} a las{" "}
              {new Date().toLocaleTimeString("es-MX", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          )}
        </Container>
      </Box>
    </Container>
  );
};

export default Index;
