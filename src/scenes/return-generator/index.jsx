import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Button,
  IconButton,
  useTheme,
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Chip,
  Select,
  MenuItem,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import InlineEditableText from "../../components/ResponsiveGenerator/InlineEditableText";
import SignatureModal from "../../components/ResponsiveGenerator/SignatureModal";
import PhotoUpload from "../../components/ReturnGenerator/PhotoUpload";
import VerifiedIcon from "@mui/icons-material/Verified";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import { tokens } from "../../theme";
import {
  AssignmentOutlined,
  CheckCircle,
  Close,
  ErrorOutline,
  Info,
  KeyboardArrowDownOutlined,
  LockPersonOutlined,
  Refresh,
} from "@mui/icons-material";
import {
  createResponsiva,
  confirmationResponsiva,
  confirmationResponsivaReturn,
} from "../../api/responsive";
import { useSelector } from "react-redux";

const getInternetDate = async () => {
  try {
    const response = await fetch(
      "http://worldtimeapi.org/api/timezone/America/Mexico_City"
    );
    const data = await response.json();
    return new Date(data.datetime);
  } catch (error) {
    console.warn(
      "Error obteniendo fecha de internet, usando fecha local:",
      error
    );
    return new Date(); // Fallback a fecha local
  }
};

const hasValidEmail = (user) => {
  return user?.email && user.email.trim() !== "";
};

const Index = () => {
  const { state } = useLocation();
  const { nuevoArticulo, tipo_responsiva, articuloId } = state || {};
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const user = useSelector((state) => state.user);

  // Estado para snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info", // "success", "error", "warning", "info"
  });

  // Estado para controlar errores de guardado y reintentos
  const [saveState, setSaveState] = useState({
    isLoading: false,
    error: null,
    success: false,
    retryCount: 0,
    showRetryDialog: false,
    lastSignatureData: null, // Almacenar datos de firma para reintentos
  });

  const [observaciones, setObservaciones] = useState("");
  const [motivoCambio, setMotivoCambio] = useState("renuncia");
  const [motivoCambioOtro, setMotivoCambioOtro] = useState("");
  const [estadoArticulo, setEstadoArticulo] = useState("bueno");
  const [estadoArticuloDanado, setEstadoArticuloDanado] = useState("");
  const [fotosEvidencia, setFotosEvidencia] = useState([]);
  const [images, setImages] = useState({
    erpp: null,
    headerRight: null,
    worldIcon: null,
    markerIcon: null,
    loaded: false,
  });
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfVersion, setPdfVersion] = useState(0);
  const pdfRef = useRef(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  // Estado para firma electrónica
  const [signatureStatus, setSignatureStatus] = useState({
    isSigned: false,
    showModal: false,
    qrImage: null,
    qrData: null,
    verificationHash: "",
    signedAt: null,
    hashMetadata: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const signatureStatusRef = useRef(signatureStatus);

  // 🔥 AGREGA ESTE useEffect para mantener la referencia actualizada
  useEffect(() => {
    signatureStatusRef.current = signatureStatus;
  }, [signatureStatus]);

  const handleFirmarClick = () => {
    if (!hasValidEmail(nuevoArticulo?.usuarioAsignado)) {
      setSnackbar({
        open: true,
        message:
          "❌ No se puede firmar: El usuario no tiene un email válido registrado",
        severity: "error",
      });
      return;
    }

    // Si tiene email válido, abrir el modal
    setSignatureStatus({ ...signatureStatus, showModal: true });
  };

  // Función para limpiar los campos de configuración del documento
  const limpiarCamposConfiguracion = () => {
    setMotivoCambio("renuncia");
    setMotivoCambioOtro("");
    setEstadoArticulo("bueno");
    setEstadoArticuloDanado("");
    setFotosEvidencia([]);
    setObservaciones("");

    console.log("Campos de configuración limpiados");
  };

  // Función para manejar reintentos de guardado
  const handleRetrySave = async () => {
    if (!saveState.lastSignatureData) {
      setSnackbar({
        open: true,
        message: "No hay datos de firma para reintentar el guardado",
        severity: "error",
      });
      return;
    }

    setSaveState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      showRetryDialog: false,
    }));

    try {
      await enviarResponsivaAlBackend(saveState.lastSignatureData);
    } catch (error) {
      // El error ya se maneja en enviarResponsivaAlBackend
    }
  };

  // Función para cerrar el diálogo de reintento
  const handleCloseRetryDialog = () => {
    setSaveState((prev) => ({
      ...prev,
      showRetryDialog: false,
    }));
  };

  // Mock: Enviar OTP (conectar a tu API real)
  const handleOTPRequest = async (callback) => {
    try {
      // Esta función ahora será manejada por el SignatureModal directamente
      // Solo llamamos al callback para mantener la compatibilidad
      callback();
    } catch (error) {
      console.error("Error in OTP request:", error);
    }
  };

  // Mock: Validar OTP (conectar a tu API real)
  // Reemplaza tu handleOTPValidate actual con esta versión
  const handleOTPValidate = async (
    otp,
    qrResponse,
    signatureCompleteData = null
  ) => {
    try {
      if (signatureCompleteData && signatureCompleteData.success) {
        const newSignatureStatus = {
          isSigned: true,
          showModal: false,
          qrImage: signatureCompleteData.qrImage,
          qrData: signatureCompleteData.qrData,
          verificationHash: signatureCompleteData.verificationHash,
          hashMetadata: signatureCompleteData.hashMetadata,
          signedAt: new Date(signatureCompleteData.timestamp),
          codigo_verificacion: signatureCompleteData.codigo_verificacion,
          timestamp_firma: signatureCompleteData.timestamp,
          validationToken: signatureCompleteData.validationToken,
          verificationUrl: signatureCompleteData.verificationUrl,
        };

        // ✅ Solo actualizar UI
        signatureStatusRef.current = newSignatureStatus;
        setSignatureStatus(newSignatureStatus);
        setPdfVersion((prev) => prev + 1);

        return true;
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "❌ Código incorrecto",
        severity: "error",
      });
      return false;
    }
  };

  const handleSignatureComplete = async (signatureData) => {
    if (signatureData.success) {
      try {
        const newSignatureStatus = {
          isSigned: true,
          showModal: false,
          qrImage: signatureData.qrImage,
          qrData: signatureData.qrData,
          verificationHash: signatureData.verificationHash,
          hashMetadata: signatureData.hashMetadata,
          signedAt: new Date(signatureData.timestamp),
          codigo_verificacion: signatureData.codigo_verificacion,
          timestamp_firma: signatureData.timestamp,
          validationToken: signatureData.validationToken,
          verificationUrl: signatureData.verificationUrl,
        };

        // ✅ ACTUALIZAR LA REFERENCIA
        signatureStatusRef.current = newSignatureStatus;

        // ✅ ACTUALIZAR EL ESTADO DE REACT
        setSignatureStatus(newSignatureStatus);
        setPdfVersion((prev) => prev + 1);

        // Guardar datos de firma para posibles reintentos
        setSaveState((prev) => ({
          ...prev,
          lastSignatureData: newSignatureStatus,
        }));

        await enviarResponsivaAlBackend(newSignatureStatus);

        // 2. Enviar email de confirmación (no bloqueante)
        sendConfirmationEmail(newSignatureStatus)
          .then((emailResult) => {
            if (emailResult) {
              console.log("✅ Email de confirmación enviado exitosamente");
              // Opcional: Mostrar mensaje de éxito
              setSnackbar({
                open: true,
                message: "✅ Firma completada y email de confirmación enviado",
                severity: "success",
              });
            } else {
              console.log(
                "⚠️ Email de confirmación no enviado, pero la firma fue exitosa"
              );
              // El error ya se maneja en sendConfirmationEmail
            }
          })
          .catch((emailError) => {
            console.error("Error no crítico en envío de email:", emailError);
            // No mostrar error al usuario para no interrumpir el flujo principal
          });
      } catch (error) {
        setSnackbar({
          open: true,
          message: "❌ Error al completar el proceso de firma",
          severity: "error",
        });
      }
    } else {
      setSnackbar({
        open: true,
        message: `Error en firma electrónica: ${signatureData.error}`,
        severity: "error",
      });
    }
  };

  const prepareResponsivaData = async (currentSignatureStatus) => {
    const idArticulo = nuevoArticulo?.id_articulo;
    const tipoResponsiva = state?.tipo_responsiva || "asignacion_inicial";

    if (
      !currentSignatureStatus.codigo_verificacion ||
      !currentSignatureStatus.verificationHash ||
      !currentSignatureStatus.qrImage ||
      !nuevoArticulo?.usuarioAsignado?.id_usuario
    ) {
      throw new Error("Faltan datos requeridos para la responsiva");
    }

    const pdfBase64 = await generarPDF(true, currentSignatureStatus); // true indica que queremos base64

    const responsivaData = {
      // ✅ DATOS BÁSICOS
      id_articulo: nuevoArticulo.id_articulo,
      id_usuario_asignado: nuevoArticulo.usuarioAsignado?.id_usuario,
      id_usuario_autoriza: user?.user_id,
      usuario_puesto: nuevoArticulo.usuarioAsignado.puesto?.nombre,
      usuario_departamento: nuevoArticulo.usuarioAsignado.area?.nombre,
      usuario_email: nuevoArticulo.usuarioAsignado?.email,
      usuario_plaza: nuevoArticulo.plaza?.nombre_plaza,
      // ✅ FIRMA ELECTRÓNICA (usar SOLO el parámetro)
      codigo_verificacion: currentSignatureStatus.codigo_verificacion,
      firma_electronica_hash: currentSignatureStatus.verificationHash,
      algoritmo_hash:
        currentSignatureStatus.hashMetadata?.algorithm || "SHA-256",
      timestamp_firma:
        currentSignatureStatus.timestamp_firma || new Date().toISOString(),
      timezone_firma:
        currentSignatureStatus.hashMetadata?.timezone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      unique_id_firma:
        currentSignatureStatus.hashMetadata?.uniqueId || crypto.randomUUID(),

      validation_token: currentSignatureStatus.validationToken,
      verification_url: currentSignatureStatus.verificationUrl,

      // ✅ QR CODE
      qr_image_base64: currentSignatureStatus.qrImage,

      pdf_base64: pdfBase64,
      pdf_filename: `responsiva-${nuevoArticulo.id_articulo}-${Date.now()}.pdf`,

      // ✅ INFORMACIÓN DEL DOCUMENTO
      motivo_cambio: motivoCambio || "Asignación inicial de equipo",
      descripcion_motivo_cambio:
        motivoCambio === "otro" ? motivoCambioOtro : "",
      estado_articulo: estadoArticulo || "bueno",
      descripcion_estado_articulo:
        estadoArticulo === "danado" ? estadoArticuloDanado : "",
      url_fotos: fotosEvidencia || [],
      observaciones: observaciones || "",
      tipo_responsiva: "devolucion", //tipoResponsiva,
      estado: "activa",
      folio_responsiva: `RESP-${nuevoArticulo.id_articulo}-${Date.now()}`,

      // ✅ UBICACIÓN Y CONTEXTO
      ubicacion_actual: nuevoArticulo.ubicacion || "Oficina Central",
      id_plaza: nuevoArticulo.plaza?.id_plaza || 1,
      plaza_asignacion: nuevoArticulo.plaza?.nombre_plaza || "CDMX",

      // ✅ FECHAS
      fecha_asignacion: new Date().toISOString().split("T")[0],
      fecha_limite_firma: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    };

    // Limpiar datos undefined/null
    Object.keys(responsivaData).forEach((key) => {
      if (responsivaData[key] === null || responsivaData[key] === undefined) {
        delete responsivaData[key];
      }
    });

    return responsivaData;
  };

  const enviarResponsivaAlBackend = async (currentSignatureData) => {
    try {
      setIsLoading(true);
      setSaveError(null);
      setSaveSuccess(false);

      setSaveState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        success: false,
      }));

      // ✅ PASAR EXPLÍCITAMENTE los datos a prepareResponsivaData
      const responsivaData = await prepareResponsivaData(currentSignatureData);

      // ✅ LLAMAR DIRECTAMENTE a la función (ya no es fetch)
      const result = await createResponsiva(responsivaData);

      // ✅ VERIFICAR éxito basado en la respuesta del backend
      if (!result.success) {
        throw new Error(result.message || "Error al guardar la responsiva");
      }

      setSnackbar({
        open: true,
        message: "✅ Responsiva guardada exitosamente en el sistema",
        severity: "success",
      });

      setSaveSuccess(true);

      setSaveState((prev) => ({
        ...prev,
        isLoading: false,
        success: true,
        error: null,
        retryCount: 0,
      }));

      limpiarCamposConfiguracion();

      return result;
    } catch (error) {
      console.error("Error al guardar responsiva:", error);

      setSnackbar({
        open: true,
        message: `❌ Error al guardar: ${error.message}`,
        severity: "error",
      });

      setSaveState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
        success: false,
        showRetryDialog: true, // Mostrar diálogo de reintento
        retryCount: prev.retryCount + 1,
      }));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // En la función sendConfirmationEmail, modifica la preparación de equipmentData:
  const sendConfirmationEmail = async (signatureData) => {
    try {
      // Extraer los campos EXACTAMENTE como se hace en el PDF
      const equipmentData = Object.entries(nuevoArticulo.campos || {}).map(
        ([key, value]) => ({
          label: key.replace(/_/g, " ").toUpperCase(),
          value:
            typeof value === "number" && key.toLowerCase().includes("precio")
              ? `$${value.toLocaleString("es-MX")}`
              : String(value || "N/A"),
        })
      );

      console.log(nuevoArticulo.id_articulo);

      const emailData = {
        to: nuevoArticulo.usuarioAsignado?.email,
        employeeName: nuevoArticulo.usuarioAsignado?.nombre || "N/A",
        documentId: nuevoArticulo?.id_articulo || "N/A",
        documentName: nuevoArticulo.campos?.nombre_articulo || "N/A",
        articleSerial: nuevoArticulo.campos?.serial_articulo || "N/A",
        signingDate: signatureData.signedAt.toLocaleDateString("es-MX"),
        signingTime: signatureData.signedAt.toLocaleTimeString("es-MX"),
        verificationCode: signatureData.codigo_verificacion,
        verificationHash: signatureData.verificationHash,
        articleModel: nuevoArticulo.campos?.modelo_articulo || "N/A",
        articleValue: nuevoArticulo.campos?.precio_articulo
          ? `$${parseFloat(nuevoArticulo.campos.precio_articulo).toLocaleString(
              "es-MX"
            )}`
          : "N/A",
        location: nuevoArticulo.plaza?.nombre_plaza || "N/A",
        assignmentDate:
          nuevoArticulo.fecha_ingreso || new Date().toLocaleDateString("es-MX"),
        portalUrl: `${window.location.origin}/mis-documentos`,
        supportEmail: "soporte@erpp.mx",
        hrEmail: "rh@erpp.mx",
        supportPhone: "+52 55 1234 5678",
        // Nuevo campo con los datos específicos del equipo (EXACTAMENTE como en el PDF)
        equipmentData: equipmentData,
      };

      // ✅ Usar la función de la API en lugar de fetch directo
      const result = await confirmationResponsivaReturn(emailData);

      if (result.success) {
        console.log("📧 Email de confirmación enviado exitosamente");
        return true;
      } else {
        throw new Error(
          result.message || "Error al enviar el email de confirmación"
        );
      }
    } catch (error) {
      console.error("❌ Error enviando email de confirmación:", error);

      // Mostrar snackbar de advertencia (no error crítico)
      setSnackbar({
        open: true,
        message:
          "✅ Firma completada, pero no se pudo enviar el email de confirmación",
        severity: "warning",
      });

      return false;
    }
  };

  // Exportar certificado de firma
  const exportSignatureCertificate = () => {
    if (!signatureStatus.isSigned) return;

    const certData = {
      document: {
        id: nuevoArticulo?.id,
        type: "Responsiva de equipo",
        name: nuevoArticulo?.campos?.nombre_articulo || "N/A",
      },
      signer: {
        id: nuevoArticulo.usuarioAsignado?.id,
        name: nuevoArticulo.usuarioAsignado?.nombre,
        position: nuevoArticulo.usuarioAsignado?.puesto?.nombre,
      },
      signature: {
        hash: signatureStatus.verificationHash,
        algorithm: signatureStatus.hashMetadata?.algorithm,
        timestamp: signatureStatus.hashMetadata?.timestamp,
        timezone: signatureStatus.hashMetadata?.timezone,
        uniqueId: signatureStatus.hashMetadata?.uniqueId,
      },
      signedAt: signatureStatus.signedAt.toISOString(),
      verificationUrl: "https://erpp.mx/verify", // URL de verificación (ajustar)
    };

    const blob = new Blob([JSON.stringify(certData, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, `firma-responsiva-${nuevoArticulo?.id || "documento"}.json`);
  };

  // Copiar token al portapapeles
  const copyTokenToClipboard = () => {
    if (!signatureStatus.isSigned) return;
    navigator.clipboard
      .writeText(signatureStatus.verificationHash)
      .then(() => {
        setSnackbar({
          open: true,
          message: "✅ Token copiado al portapapeles",
          severity: "success",
        });
      })
      .catch((err) => console.error("Error copiando token:", err));
  };

  // Configuración de estilos actualizada (estilo Notion/Figma)
  const PDF_STYLES = {
    colors: {
      primary: "#37352f",
      secondary: "#666666",
      text: "#333333",
      accent: "#4caf50",
    },
    // Encuentra el objeto PDF_STYLES.fonts y cámbialo por:
    fonts: {
      title: {
        size: 14, // ↑ Aumentado de 12 a 14 (para títulos principales)
        style: "bold",
        align: "left",
      },
      section: {
        size: 11, // ↑ Aumentado de 9 a 11 (para secciones)
        style: "bold",
        align: "left",
      },
      bodyBold: {
        size: 10, // ↑ Aumentado de 9 a 10 (texto en negrita)
        style: "bold",
        align: "justify",
      },
      body: {
        size: 10, // ↑ Aumentado de 9 a 10 (texto normal)
        style: "normal",
        align: "justify",
      },
      small: {
        size: 8, // ↑ Aumentado de 7 a 8 (texto pequeño)
        style: "normal",
        align: "left",
      },
    },
    spacing: {
      section: 11,
      line: 12,
      bullet: 7,
    },
  };

  const MARGINS = {
    top: 95,
    left: 40,
    right: 40,
    bottom: 60,
    headerHeight: 50,
    footerHeight: 50,
  };

  const convertImageToBase64 = (url) => {
    return fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(`Failed to fetch image: ${url}`);
        return response.blob();
      })
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
  };

  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      try {
        const [erpp, headerRight, worldIcon, markerIcon] = await Promise.all([
          convertImageToBase64("/ERPP.png"),
          convertImageToBase64("/HeaderRight2025.png"),
          convertImageToBase64("/world-icon.png"),
          convertImageToBase64("/marker-icon.png"),
        ]);

        if (isMounted) {
          setImages({
            erpp,
            headerRight,
            worldIcon,
            markerIcon,
            loaded: true,
          });
        }
      } catch (error) {
        console.error("Error loading images:", error);
        if (isMounted) {
          setImages((prev) => ({ ...prev, loaded: true }));
        }
      }
    };

    if (!images.loaded) {
      loadImages();
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMotivoCambioChange = (value) => {
    setMotivoCambio(value);
    if (value !== "otro") {
      setMotivoCambioOtro("");
    }
    setPdfVersion((prev) => prev + 1);
  };

  const handleMotivoCambioOtroChange = (value) => {
    setMotivoCambioOtro(value);
    setPdfVersion((prev) => prev + 1);
  };

  const handleEstadoArticuloChange = (value) => {
    setEstadoArticulo(value);
    if (value !== "dañado") {
      setEstadoArticuloDanado("");
    }
    setPdfVersion((prev) => prev + 1);
  };

  const handleEstadoArticuloDanadoChange = (value) => {
    setEstadoArticuloDanado(value);
    setPdfVersion((prev) => prev + 1);
  };

  const handleFotosEvidenciaChange = (photos) => {
    setFotosEvidencia(photos);
    setPdfVersion((prev) => prev + 1);
    console.log("Fotos actuales:", photos);
  };

  const handleObservacionesChange = (value) => {
    setObservaciones(value);
    setPdfVersion((prev) => prev + 1);
  };

  useEffect(() => {
    const generate = async () => {
      if (nuevoArticulo && images.loaded) {
        await generarPDF();
      }
    };

    const timer = setTimeout(generate, 300);

    return () => clearTimeout(timer);
  }, [nuevoArticulo, images.loaded, pdfVersion]);

  const cmToPt = (cm) => cm * 28.35;

  const drawHeader = (doc, pageWidth) => {
    try {
      const marginLeft = MARGINS.left;
      const marginRight = MARGINS.right;
      const headerTop = 15;

      const rightImgWidth = cmToPt(9);
      const rightImgHeight = cmToPt(7.5);
      const rightX = pageWidth - marginRight - rightImgWidth;

      if (images.headerRight) {
        doc.addImage(
          images.headerRight,
          "PNG",
          rightX,
          headerTop,
          rightImgWidth,
          rightImgHeight,
          undefined,
          "NONE",
          0
        );
      }

      if (images.erpp) {
        doc.addImage(
          images.erpp,
          "PNG",
          marginLeft,
          headerTop,
          cmToPt(3),
          cmToPt(2)
        );
      }

      const greenWidth = cmToPt(2);
      const lineY = headerTop + cmToPt(2) + 5;
      doc.setFillColor("#4caf50");
      doc.rect(marginLeft, lineY, greenWidth, 3, "F");
      doc.setFillColor("#999999");
      doc.rect(
        marginLeft + greenWidth,
        lineY,
        pageWidth - marginLeft * 2 - greenWidth,
        3,
        "F"
      );
    } catch (error) {
      console.error("Error drawing header:", error);
    }
  };

  const drawFooter = (doc, pageWidth, pageHeight, pageNum, totalPages) => {
    try {
      doc.setDrawColor(255, 255, 255);
      doc.setFillColor(255, 255, 255);
      doc.rect(
        0,
        pageHeight - MARGINS.footerHeight,
        pageWidth,
        MARGINS.footerHeight,
        "F"
      );

      const marginLeft = MARGINS.left;
      const marginRight = MARGINS.right;
      const greenWidth = cmToPt(2);
      const footerY = pageHeight - 50 + 10;

      doc.setFillColor("#4caf50");
      doc.rect(marginLeft, footerY, greenWidth, 3, "F");
      doc.setFillColor("#999999");
      doc.rect(
        marginLeft + greenWidth,
        footerY,
        pageWidth - marginLeft * 2 - greenWidth,
        3,
        "F"
      );

      const pageText = `Página ${pageNum} de ${totalPages}`;
      doc.setFontSize(8);
      doc.setTextColor(PDF_STYLES.colors.text);
      doc.text(pageText, pageWidth / 2, pageHeight - 25 + 5, {
        align: "center",
      });

      const iconSize = 12;
      const iconTextGap = 5;
      const leftX = marginLeft;
      const leftY = pageHeight - 25 - iconSize / 2 + 5;

      if (images.worldIcon) {
        doc.addImage(images.worldIcon, "PNG", leftX, leftY, iconSize, iconSize);
      }

      doc.setFontSize(8);
      doc.setTextColor(PDF_STYLES.colors.text);
      doc.text(
        "www.erpp.mx",
        leftX + iconSize + iconTextGap,
        leftY + iconSize * 0.75
      );

      const rightIconSize = 12;
      const iconTextGapRight = 5;
      const maxTextWidth = 150;
      const rightBlockWidth = rightIconSize + iconTextGapRight + maxTextWidth;
      const rightX = pageWidth - marginRight - rightBlockWidth;
      const totalTextHeight = 3 * 10;
      const rightY = pageHeight - 25 - totalTextHeight / 2;

      if (images.markerIcon) {
        doc.addImage(
          images.markerIcon,
          "PNG",
          rightX - 12,
          rightY + 2 + (totalTextHeight - rightIconSize) / 2,
          rightIconSize,
          rightIconSize
        );
      }

      doc.setFontSize(8);
      doc.setTextColor(PDF_STYLES.colors.text);

      const shiftLeft = 15;
      const addressX = rightX + rightIconSize + iconTextGapRight - shiftLeft;

      const addressLines = [
        "Jaime Balmes no.11 Torre A, Piso 1 int.B",
        "Polanco I Sección Miguel Hgo., CDMX.",
        "C.P. 11510",
      ];

      let currentY = rightY + 10;
      const lineHeight = 10;

      addressLines.forEach((line) => {
        doc.text(line, addressX, currentY);
        currentY += lineHeight;
      });
    } catch (error) {
      console.error("Error drawing footer:", error);
    }
  };

  const checkPageBreak = (doc, currentY, spaceNeeded = 20) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    if (currentY + spaceNeeded > pageHeight - MARGINS.bottom) {
      doc.addPage();
      drawHeader(doc, doc.internal.pageSize.getWidth());
      return MARGINS.top;
    }
    return currentY;
  };

  const addStyledText = (doc, text, x, y, maxWidth, options = {}) => {
    const {
      type = "body",
      lineHeight = PDF_STYLES.spacing.line,
      align = PDF_STYLES.fonts[type]?.align,
    } = options;

    const style = PDF_STYLES.fonts[type] || PDF_STYLES.fonts.body;
    doc.setFontSize(style.size);
    doc.setFont("helvetica", style.style);
    doc.setTextColor(PDF_STYLES.colors.text);

    const lines = doc.splitTextToSize(text, maxWidth);

    lines.forEach((line) => {
      y = checkPageBreak(doc, y, lineHeight);
      doc.text(line, x, y, {
        align,
        maxWidth,
      });
      y += lineHeight;
    });

    return y;
  };

  const addJustifiedText = (doc, text, x, y, maxWidth, options = {}) => {
    const {
      lineHeight = PDF_STYLES.spacing.line,
      fontSize = PDF_STYLES.fonts.body.size,
      align = "justify",
      maxSpaceMultiplier = 1.8, // Limitar la expansión máxima del espacio
    } = options;

    doc.setFontSize(fontSize);
    doc.setFont("helvetica", options.bold ? "bold" : "normal");
    doc.setTextColor(PDF_STYLES.colors.text);

    // Dividir el texto en líneas
    const lines = doc.splitTextToSize(text, maxWidth);

    lines.forEach((line, index) => {
      y = checkPageBreak(doc, y, lineHeight);

      // Solo justificar si la línea tiene suficiente contenido y no es la última
      if (
        align === "justify" &&
        index < lines.length - 1 &&
        line.trim().length > 30
      ) {
        const words = line.split(" ");
        if (words.length > 1) {
          const textWidth = doc.getTextWidth(line);
          const spaceToDistribute = maxWidth - textWidth;
          const spaceWidth = doc.getTextWidth(" ");
          const spaceMultiplier = Math.min(
            1 + spaceToDistribute / (spaceWidth * (words.length - 1)),
            maxSpaceMultiplier
          );

          let currentX = x;
          words.forEach((word, i) => {
            doc.text(word, currentX, y);
            if (i < words.length - 1) {
              currentX += doc.getTextWidth(word) + spaceWidth * spaceMultiplier;
            }
          });
        } else {
          doc.text(line, x, y);
        }
      } else {
        // Alineación normal (izquierda para última línea o líneas cortas)
        doc.text(line, x, y);
      }

      y += lineHeight;
    });

    return y;
  };

  // Agrega esta función después de addJustifiedText
  const addTextWithBoldMarkers = (doc, text, x, y, maxWidth, options = {}) => {
    const {
      lineHeight = PDF_STYLES.spacing.line,
      fontSize = PDF_STYLES.fonts.body.size,
    } = options;

    doc.setFontSize(fontSize);
    doc.setTextColor(PDF_STYLES.colors.text);

    let currentY = y;
    const initialX = x;
    let currentX = x;

    // Función para procesar un fragmento de texto
    const processTextFragment = (text, isBold = false) => {
      doc.setFont("helvetica", isBold ? "bold" : "normal");

      const words = text.split(" ");
      let line = "";

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const testLine = line + (line ? " " : "") + word;
        const testWidth = doc.getTextWidth(testLine);

        // Si la línea excede el ancho máximo
        if (testWidth > maxWidth - (currentX - initialX)) {
          if (line) {
            // Dibujar la línea actual
            doc.text(line, currentX, currentY);
            currentY += lineHeight;
            currentX = initialX;
            line = word;
          } else {
            // Si una sola palabra es más larga que el ancho máximo
            // Dividir la palabra
            const characters = word.split("");
            let subWord = "";

            for (let j = 0; j < characters.length; j++) {
              const char = characters[j];
              const testChar = subWord + char;
              const charWidth = doc.getTextWidth(testChar);

              if (charWidth > maxWidth - (currentX - initialX)) {
                if (subWord) {
                  doc.text(subWord, currentX, currentY);
                  currentY += lineHeight;
                  currentX = initialX;
                  subWord = char;
                } else {
                  // Carácter individual muy ancho (raro caso)
                  doc.text(char, currentX, currentY);
                  currentY += lineHeight;
                  currentX = initialX;
                  subWord = "";
                }
              } else {
                subWord += char;
              }
            }

            if (subWord) {
              line = subWord;
            }
          }
        } else {
          line = testLine;
        }
      }

      // Dibujar la última línea
      if (line) {
        doc.text(line, currentX, currentY);
        currentX += doc.getTextWidth(line);
      }
    };

    // Dividir el texto usando los marcadores {{ }}
    const parts = text.split(/(\{\{.*?\}\})/);

    parts.forEach((part) => {
      if (part.startsWith("{{") && part.endsWith("}}")) {
        // Texto entre {{ }} → BOLD
        const boldText = part.slice(2, -2);
        processTextFragment(boldText, true);
      } else if (part.trim() !== "") {
        // Texto normal
        processTextFragment(part, false);
      }

      // Agregar espacio después de cada parte (excepto si es puntuación)
      if (parts.length > 1) {
        const spaceWidth = doc.getTextWidth(" ");
        if (currentX + spaceWidth <= initialX + maxWidth) {
          currentX += spaceWidth;
        } else {
          currentY += lineHeight;
          currentX = initialX;
        }
      }
    });

    return currentY + lineHeight;
  };

  const drawCustomTable = (doc, data, startY, maxWidth) => {
    const tableConfig = {
      rowHeight: 12, // ↑ Aumentado de 10 a 12
      padding: 4, // ↑ Aumentado de 3 a 4
      fontSize: 9, // ↑ Aumentado de 8 a 9 (¡ESTE ES EL MÁS IMPORTANTE!)
      lineWidth: 0.1,
      column1Width: maxWidth * 0.35,
      column2Width: maxWidth * 0.65,
      headerBg: "#ffffff",
      evenRowBg: "#ffffff",
      oddRowBg: "#f8f8f8",
      borderColor: "#eaeaea",
      textColor: "#333333",
      headerTextColor: "#666666",
      headerFontSize: 9, // ↑ Aumentado de 8 a 9
      headerPadding: 4, // ↑ Aumentado de 3 a 4
      cellPadding: 3,
    };

    let y = startY;
    const {
      rowHeight,
      padding,
      fontSize,
      lineWidth,
      column1Width,
      column2Width,
      headerBg,
      evenRowBg,
      oddRowBg,
      borderColor,
      textColor,
      headerTextColor,
      headerFontSize,
      headerPadding,
      cellPadding,
    } = tableConfig;

    // Estilo del encabezado
    doc.setFontSize(headerFontSize);
    doc.setTextColor(headerTextColor);
    doc.setLineWidth(lineWidth);

    // Fondo del encabezado (sin fondo de color, solo borde inferior)
    doc.setDrawColor(borderColor);
    doc.line(
      MARGINS.left,
      y + rowHeight + headerPadding * 2,
      MARGINS.left + maxWidth,
      y + rowHeight + headerPadding * 2
    );

    doc.setFont("helvetica", "bold");
    doc.text(
      "PROPIEDAD",
      MARGINS.left + cellPadding,
      y + headerPadding + rowHeight / 2 + 1
    );
    doc.text(
      "VALOR",
      MARGINS.left + column1Width + cellPadding,
      y + headerPadding + rowHeight / 2 + 1
    );

    y += rowHeight + headerPadding * 2;

    // Filas de datos
    data.forEach(([key, value], index) => {
      y = checkPageBreak(doc, y, rowHeight * 3);

      const bgColor = index % 2 === 0 ? evenRowBg : oddRowBg;
      doc.setFillColor(bgColor);
      doc.rect(MARGINS.left, y, maxWidth, rowHeight + padding * 2, "F");

      let displayValue = value;
      if (typeof value === "number" && key.toLowerCase().includes("precio")) {
        displayValue = `$${value.toLocaleString()}`;
      } else if (typeof value === "boolean") {
        displayValue = value ? "Sí" : "No";
      }

      const propertyText = key.replace(/_/g, " ").toUpperCase();
      doc.setFont("helvetica", "bold");
      doc.setTextColor(textColor);
      const propertyLines = doc.splitTextToSize(
        propertyText,
        column1Width - cellPadding * 2
      );

      let propY = y + cellPadding;
      propertyLines.forEach((line) => {
        doc.text(line, MARGINS.left + cellPadding, propY + rowHeight / 2);
        propY += rowHeight;
      });

      doc.setFont("helvetica", "normal");
      const valueLines = doc.splitTextToSize(
        String(displayValue),
        column2Width - cellPadding * 2
      );

      let valY = y + cellPadding;
      valueLines.forEach((line) => {
        doc.text(
          line,
          MARGINS.left + column1Width + cellPadding,
          valY + rowHeight / 2,
          { maxWidth: column2Width - cellPadding * 2 }
        );
        valY += rowHeight;
      });

      const linesUsed = Math.max(propertyLines.length, valueLines.length);
      y += linesUsed * rowHeight + padding * 2;

      // Línea divisoria sutil entre filas
      if (index < data.length - 1) {
        doc.setDrawColor(borderColor);
        doc.line(
          MARGINS.left + cellPadding,
          y - padding / 2,
          MARGINS.left + maxWidth - cellPadding,
          y - padding / 2
        );
      }
    });

    return y + 6;
  };

  const generarPDF = async (
    returnBase64 = false,
    customSignatureStatus = null
  ) => {
    if (!nuevoArticulo || !images.loaded) {
      console.log("Faltan datos necesarios para generar el PDF");
      return returnBase64 ? null : undefined;
    }

    // Usa el estado de firma más reciente si se proporciona
    const signature = customSignatureStatus || signatureStatus;

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const maxWidth = pageWidth - MARGINS.left - MARGINS.right;

      doc.setFont("helvetica");
      drawHeader(doc, pageWidth);
      let y = MARGINS.top;

      // Título principal (alineado a la izquierda como Notion)
      y = addStyledText(
        doc,
        "Responsiva de Devolución de Equipo",
        MARGINS.left,
        y,
        maxWidth,
        { type: "title", align: "left" }
      );
      y += PDF_STYLES.spacing.section;

      // Primer párrafo con justificación mejorada
      y = addJustifiedText(
        doc,
        "Por medio del presente documento, hago constar que he realizado la devolución del equipo descrito a continuación, propiedad de ERPP CORPORATIVO S.A. DE C.V., quedando la empresa como único responsable de su custodia y uso a partir de esta fecha.",
        MARGINS.left,
        y,
        maxWidth,
        { fontSize: PDF_STYLES.fonts.body.size }
      );
      y += PDF_STYLES.spacing.section;

      // Sección de datos del responsable
      y = addStyledText(
        doc,
        "Información del responsable de la devolución",
        MARGINS.left,
        y,
        maxWidth,
        { type: "section", align: "left" }
      );
      y += PDF_STYLES.spacing.line;

      const fechaEntregaConfiable = await getInternetDate();
      const fechaEntregaFormateada =
        fechaEntregaConfiable.toLocaleDateString("es-MX");

      const datosResponsable = [
        `- Nombre completo: ${nuevoArticulo.usuarioAsignado?.nombre || "N/A"}`,
        `- Puesto: ${nuevoArticulo.usuarioAsignado?.puesto?.nombre || "N/A"}`,
        `- Departamento: ${
          nuevoArticulo.usuarioAsignado?.area?.nombre || "N/A"
        }`,
        `- Fecha de entrega: ${fechaEntregaFormateada || "N/A"}`,
        `- Correo institucional: ${
          nuevoArticulo.usuarioAsignado?.email || "N/A"
        }`,
        `- Plaza: ${nuevoArticulo.plaza?.nombre_plaza || "N/A"}`,
      ];

      datosResponsable.forEach((linea) => {
        y = addJustifiedText(doc, linea, MARGINS.left + 10, y, maxWidth - 10, {
          fontSize: PDF_STYLES.fonts.body.size,
        });
        y += PDF_STYLES.spacing.bullet;
      });

      let motivoFinal = motivoCambio?.trim();

      if (motivoCambio === "otro") {
        if (motivoCambioOtro?.trim()) {
          motivoFinal = `otro - ${motivoCambioOtro.trim()}`;
        } else {
          motivoFinal = "otro";
        }
      }

      // Solo mostrar si hay algún valor válido
      if (motivoFinal && motivoFinal !== "") {
        y += PDF_STYLES.spacing.section;
        y = addStyledText(doc, "Motivo de cambio", MARGINS.left, y, maxWidth, {
          type: "section",
          align: "left",
        });
        y += PDF_STYLES.spacing.line;

        y = addJustifiedText(
          doc,
          motivoFinal.trim(),
          MARGINS.left + 10,
          y,
          maxWidth - 10,
          {
            fontSize: PDF_STYLES.fonts.body.size,
            lineHeight: PDF_STYLES.spacing.line * 1.1,
          }
        );
      }

      let estadoArticuloFinal = estadoArticulo?.trim();

      if (estadoArticulo === "danado") {
        if (estadoArticuloDanado?.trim()) {
          estadoArticuloFinal = `otro - ${estadoArticuloDanado.trim()}`;
        } else {
          estadoArticuloFinal = "otro";
        }
      }

      // Solo mostrar si hay algún valor válido
      if (estadoArticuloFinal && estadoArticuloFinal !== "") {
        y += PDF_STYLES.spacing.section;
        y = addStyledText(
          doc,
          "Estado del artículo",
          MARGINS.left,
          y,
          maxWidth,
          {
            type: "section",
            align: "left",
          }
        );
        y += PDF_STYLES.spacing.line;

        y = addJustifiedText(
          doc,
          estadoArticuloFinal.trim(),
          MARGINS.left + 10,
          y,
          maxWidth - 10,
          {
            fontSize: PDF_STYLES.fonts.body.size,
            lineHeight: PDF_STYLES.spacing.line * 1.1,
          }
        );
      }

      y += PDF_STYLES.spacing.section;
      y = addStyledText(
        doc,
        "Información del equipo devuelto",
        MARGINS.left,
        y,
        maxWidth,
        { type: "section", align: "left" }
      );
      y += PDF_STYLES.spacing.line;

      const camposData = Object.entries(nuevoArticulo.campos || {})
        .filter(([key, value]) => {
          // Filtrar campos que no queremos mostrar
          if (value === null || value === undefined) return false;
          if (typeof value === "string" && value.trim() === "") return false;
          if (String(value).toLowerCase() === "null") return false;
          if (String(value).toLowerCase() === "undefined") return false;
          if (String(value).toLowerCase() === "n/a") return false;

          return true;
        })
        .map(([key, value]) => [key.replace(/_/g, " ").toUpperCase(), value]);

      y = drawCustomTable(doc, camposData, y, maxWidth, pageWidth);

      // Sección de Observaciones (solo si tiene contenido)
      if (observaciones && observaciones.trim() !== "") {
        y += PDF_STYLES.spacing.section;
        y = addStyledText(doc, "Observaciones", MARGINS.left, y, maxWidth, {
          type: "section",
          align: "left",
        });
        y += PDF_STYLES.spacing.line;

        y = addJustifiedText(
          doc,
          observaciones.trim(),
          MARGINS.left + 10,
          y,
          maxWidth - 10,
          { fontSize: PDF_STYLES.fonts.body.size }
        );
      }

      // Segunda página con condiciones
      doc.addPage();
      drawHeader(doc, pageWidth);
      y = MARGINS.top;

      y = addStyledText(
        doc,
        "Constancia de Devolución",
        MARGINS.left,
        y,
        maxWidth,
        {
          type: "title",
          align: "left",
        }
      );
      y += PDF_STYLES.spacing.section;

      const condiciones = [
        // 1. FUNDAMENTO LEGAL
        `Con fundamento en los artículos 47 de la Ley Federal del Trabajo, 15 de la Ley Federal de Protección de Datos Personales y 78 del Código Civil Federal, ${
          nuevoArticulo.usuarioAsignado?.nombre || "el empleado"
        } hace entrega formal del equipo ${
          nuevoArticulo.campos?.nombre_articulo || "No disponible"
        } propiedad de ERPP CORPORATIVO S.A. DE C.V.`,

        // 2. DECLARACIÓN BAJO PROTESTA
        `Declaro bajo protesta de decir VERDAD que el equipo se devuelve en el estado físico y funcional descrito en el presente documento, habiendo sido verificado conjuntamente con el representante autorizado de la empresa.`,

        // 3. SUBTÍTULO - COMPROMISOS
        "Como parte del proceso de devolución, certifico que:",

        // Lista de compromisos
        "- He eliminado toda información personal y he permitido la verificación técnica por parte del departamento de TI para la eliminación segura de datos corporativos.",
        "- Entregó todos los accesorios, manuales y embalaje original que fueron proporcionados al momento de la asignación.",
        "- No conservo copias físicas o digitales de información confidencial de la empresa.",
        "- He notificado cualquier daño, pérdida o anomalía del equipo dentro de los plazos establecidos.",

        // 4. ACEPTACIÓN DE POLÍTICAS INTERNAS
        "Reconozco que este proceso de devolución se apega íntegramente a las políticas internas de administración de bienes de la empresa, mismas que me fueron previamente notificadas y de las cuales tengo pleno conocimiento.",

        // 5. CLAÚSULA DE SANCIÓN POR INCUMPLIMIENTO
        "En caso de incumplimiento o falsedad en la presente declaración, acepto que la empresa podrá ejercer las acciones legales correspondientes, incluyendo la retención proporcional de pagos o la reclamación de daños y perjuicios.",

        // 6. CLAÚSULA FINAL DE LIBERACIÓN DE RESPONSABILIDAD
        `Una vez firmado el presente documento, se da por concluida mi responsabilidad sobre el equipo devuelto, quedando ERPP CORPORATIVO S.A. DE C.V. como único responsable a partir de este momento.`,
      ];

      // 1. FUNDAMENTO LEGAL
      y = addTextWithBoldMarkers(
        doc,
        condiciones[0],
        MARGINS.left,
        y,
        maxWidth,
        {
          fontSize: PDF_STYLES.fonts.body.size,
        }
      );
      y += PDF_STYLES.spacing.line;

      // 2. DECLARACIÓN BAJO PROTESTA
      y = addJustifiedText(doc, condiciones[1], MARGINS.left, y, maxWidth, {
        fontSize: PDF_STYLES.fonts.body.size,
        bold: false,
      });
      y += PDF_STYLES.spacing.section;

      // 3. SUBTÍTULO - COMPROMISOS
      y = addStyledText(doc, condiciones[2], MARGINS.left, y, maxWidth, {
        type: "section",
        align: "left",
      });
      y += PDF_STYLES.spacing.line;

      // LISTA DE COMPROMISOS
      const compromisos = condiciones.slice(3, 7);
      compromisos.forEach((item) => {
        if (item.trim() !== "") {
          y = addJustifiedText(doc, item, MARGINS.left + 10, y, maxWidth - 10, {
            fontSize: PDF_STYLES.fonts.body.size,
          });
          y += PDF_STYLES.spacing.bullet;
        }
      });

      // 4. ACEPTACIÓN DE POLÍTICAS
      y += PDF_STYLES.spacing.section;
      y = addJustifiedText(doc, condiciones[7], MARGINS.left, y, maxWidth, {
        fontSize: PDF_STYLES.fonts.body.size,
        bold: false,
        align: "justify",
      });

      // 5. CLAÚSULA DE SANCIÓN
      y += PDF_STYLES.spacing.line;
      y = addJustifiedText(doc, condiciones[8], MARGINS.left, y, maxWidth, {
        fontSize: PDF_STYLES.fonts.body.size,
        bold: false,
        align: "justify",
      });

      // 6. CLAÚSULA FINAL
      y += PDF_STYLES.spacing.section;
      y = addJustifiedText(doc, condiciones[9], MARGINS.left, y, maxWidth, {
        fontSize: PDF_STYLES.fonts.body.size,
        bold: false,
        align: "justify",
      });

      // Firmas
      // Firmas - Área modificada para incluir el QR
      y = pageHeight - 150; // Posición inicial para las firmas
      y = addStyledText(doc, "Atentamente", pageWidth / 2, y, maxWidth, {
        type: "section",
        align: "center",
      });
      y += PDF_STYLES.spacing.line;

      // Posiciones fijas para las líneas de firma
      const lineY = y + 40; // Espacio para QR si está firmado
      doc.setLineWidth(0.5);
      doc.setDrawColor(80, 80, 80);

      // Línea del otorgante (siempre visible)
      doc.line(MARGINS.left, lineY, MARGINS.left + 160, lineY);

      // Línea del receptor (siempre visible)
      doc.line(
        pageWidth - MARGINS.left - 160,
        lineY,
        pageWidth - MARGINS.left,
        lineY
      );

      // Texto de firmas (siempre visible)
      const textY = lineY + 20;
      doc.setFontSize(10);
      doc.setTextColor(PDF_STYLES.colors.text);
      const leftCenter = MARGINS.left + 80;
      const rightCenter = pageWidth - MARGINS.left - 80;

      // Firma otorgante (sin cambios)
      doc.text(
        "Firma del otorgante\nERPP CORPORATIVO S.A DE C.V.",
        leftCenter,
        textY - 7,
        { align: "center" }
      );

      // Firma receptor (sin cambios)
      doc.text(
        `Firma del receptor\n${
          nuevoArticulo.usuarioAsignado?.nombre || "Nombre del receptor"
        }`,
        rightCenter,
        textY - 7,
        { align: "center" }
      );

      // QR solo si está firmado (encima de la línea del receptor)
      if (signature.isSigned && signature.qrImage) {
        const qrSize = 90; // Tamaño moderado para no saturar
        const qrX = rightCenter - qrSize / 2; // Centrado sobre la línea
        const qrY = lineY - qrSize - 30; // 10pt arriba de la línea

        doc.addImage(signature.qrImage, "PNG", qrX, qrY, qrSize, qrSize);

        // Mostrar el token/hash de verificación debajo del QR
        const token = signature.verificationHash;
        const formattedToken = token.match(/.{1,8}/g).join(" "); // Separar cada 8 caracteres

        // Información de validación
        doc.setFontSize(6);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Verificado: ${signature.signedAt.toLocaleString()}`,
          rightCenter,
          qrY + qrSize + 2,
          { align: "center" }
        );

        doc.setFontSize(6);
        doc.setTextColor(100, 100, 100);
        doc.text("Token de verificación:", rightCenter, qrY + qrSize + 8, {
          align: "center",
        });

        doc.setFontSize(5);
        doc.text(formattedToken, rightCenter, qrY + qrSize + 14, {
          align: "center",
          maxWidth: qrSize + 30,
        });

        doc.setFontSize(6);
        doc.setTextColor(100, 100, 100);
        doc.text(
          "Firma electrónica avanzada - ERPP Corporativo",
          rightCenter,
          qrY + qrSize + 27,
          { align: "center" }
        );
      }

      // Añadir pies de página a todas las páginas
      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        drawFooter(doc, pageWidth, pageHeight, i, totalPages);
      }

      if (returnBase64) {
        const pdfBlob = doc.output("blob");
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = reader.result.split(",")[1];
            resolve(base64);
          };
          reader.readAsDataURL(pdfBlob);
        });
      } else {
        const pdfBlob = doc.output("blob");
        const newPdfUrl = URL.createObjectURL(pdfBlob);
        setPdfUrl(newPdfUrl);
      }
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      return returnBase64 ? null : undefined;
    }
  };

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  return (
    <Box p={3}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: colors.grey[100], // adaptable a modo oscuro/claro según token
          fontWeight: 600, // ligeramente menos que "bold" puro para suavidad
          mb: 2, // margen inferior consistente
        }}
      >
        Generar responsiva de devolución de equipo
      </Typography>
      {/* Snackbar para notificaciones */}
      {/* Snackbar para notificaciones - Estilo minimalista */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          // Asegurar que esté por encima de otros elementos
          zIndex: 1400,
          // Para dispositivos móviles, asegurar que no esté demasiado abajo
          bottom: { xs: 70, sm: 24 },
        }}
      >
        <Box
          sx={{
            backgroundColor:
              snackbar.severity === "error"
                ? "#d32f2f" // Rojo más estándar para errores
                : snackbar.severity === "success"
                ? "#2e7d32" // Verde más profesional
                : "#1976d2", // Azul principal para información
            color: "white",
            borderRadius: "4px", // Bordes ligeramente menos redondeados (estándar Material)
            padding: "14px 16px", // Un poco más de padding
            boxShadow: "0 3px 10px rgba(0,0,0,0.2), 0 3px 3px rgba(0,0,0,0.12)",
            minWidth: "288px", // Ancho mínimo según especificación Material Design
            maxWidth: "600px", // Ancho máximo para no sobrepasar en pantallas grandes
            fontSize: "0.875rem",
            fontWeight: 400, // Peso normal para mejor legibilidad
            display: "flex",
            alignItems: "center",
            // Añadir transición suave
            transition: "transform 0.2s ease-in-out, opacity 0.2s ease-in-out",
            // Estilo para cuando está abierto
            transform: snackbar.open ? "translateY(0)" : "translateY(100px)",
            opacity: snackbar.open ? 1 : 0,
          }}
        >
          {/* Icono según el tipo de mensaje (mejora la comprensión) */}
          {snackbar.severity === "error" && (
            <ErrorOutline sx={{ mr: 1, fontSize: "20px" }} />
          )}
          {snackbar.severity === "success" && (
            <CheckCircle sx={{ mr: 1, fontSize: "20px" }} />
          )}
          {snackbar.severity === "info" && (
            <Info sx={{ mr: 1, fontSize: "20px" }} />
          )}

          {/* Mensaje */}
          <Box component="span" sx={{ flexGrow: 1 }}>
            {snackbar.message}
          </Box>

          {/* Botón de cerrar opcional */}
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => setSnackbar({ ...snackbar, open: false })}
            sx={{ ml: 2, padding: "4px" }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Snackbar>
      {/* Diálogo para reintentar guardado - Estilo minimalista */}
      <Dialog
        open={saveState.showRetryDialog}
        onClose={handleCloseRetryDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            maxWidth: "500px",
            width: "90%",
          },
        }}
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            fontSize: "1.25rem",
            fontWeight: 600,
            pb: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ErrorOutline color="error" />
          Error al guardar
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            sx={{ color: "text.secondary", lineHeight: 1.6 }}
          >
            No se pudo guardar la responsiva en la base de datos. Por favor,
            verifica tu conexión a internet e intenta nuevamente.
            {saveState.error && (
              <Box
                component="span"
                sx={{
                  display: "block",
                  mt: 1,
                  fontStyle: "italic",
                  fontSize: "0.9em",
                }}
              >
                Error: {saveState.error}
              </Box>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseRetryDialog}
            sx={{
              color: "text.secondary",
              fontWeight: 500,
              borderRadius: "6px",
              px: 2,
              py: 1,
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleRetrySave}
            autoFocus
            variant="contained"
            startIcon={<Refresh />}
            sx={{
              borderRadius: "6px",
              px: 2,
              py: 1,
              textTransform: "none",
              fontWeight: 500,
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            }}
          >
            Reintentar ({saveState.retryCount})
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box
            mb={3}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: colors.bgContainer, // fondo sutil según modo
              border: `1px solid ${colors.borderContainer}`, // borde punteado suave
              transition:
                "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)", // sombra ligera
              },
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={600}
              mb={2}
              color={colors.grey[100]}
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <AssignmentOutlined
                sx={{ fontSize: 18, color: colors.accentGreen[100] }}
              />
              CONFIGURACIÓN DEL DOCUMENTO
            </Typography>

            <Box mb={3}>
              <Typography
                variant="body1"
                color={colors.grey[100]}
                mb={1}
                sx={{ fontWeight: 500 }}
              >
                Motivo de Devolución
              </Typography>
              <Select
                value={motivoCambio}
                onChange={(e) => handleMotivoCambioChange(e.target.value)}
                fullWidth
                size="small"
                sx={{
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
                  "& .MuiInputAdornment-root": {
                    marginRight: "8px",
                  },

                  "& .MuiFormHelperText-root": {
                    marginLeft: 1,
                    fontSize: "0.75rem",
                    color: theme.palette.error.main,
                  },
                }}
                IconComponent={(props) => (
                  <KeyboardArrowDownOutlined
                    {...props}
                    sx={{ color: colors.grey[300], fontSize: 20 }}
                  />
                )}
              >
                <MenuItem value="renuncia">Renuncia voluntaria</MenuItem>
                <MenuItem value="despido">Despido</MenuItem>
                <MenuItem value="reemplazo">Reemplazo de equipo</MenuItem>
                <MenuItem value="actualizacion">
                  Actualización tecnológica
                </MenuItem>
                <MenuItem value="baja_tecnica">
                  Baja técnica (ya no funciona)
                </MenuItem>
                <MenuItem value="otro">Otro</MenuItem>
              </Select>
            </Box>

            {motivoCambio === "otro" && (
              <Box mb={3}>
                <Typography
                  variant="body1"
                  color={colors.grey[100]}
                  mb={1}
                  sx={{ fontWeight: 500 }}
                >
                  Especifica el motivo
                </Typography>
                <InlineEditableText
                  value={motivoCambioOtro}
                  onChange={handleMotivoCambioOtroChange}
                  placeholder="Describe el motivo del cambio de equipo..."
                  minRows={3}
                  sx={{
                    backgroundColor: colors.primary[800],
                    borderRadius: 2,
                    border: `1px solid ${colors.grey[400]}`,
                    p: 1.5,
                    color: colors.grey[100],
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": { borderColor: colors.grey[300] },
                    "&:focus": {
                      borderColor: colors.accentGreen[100],
                      boxShadow: "0 0 0 3px rgba(34,197,94,0.2)",
                    },
                  }}
                />
              </Box>
            )}

            <Box mb={3}>
              <Typography
                variant="body1"
                color={colors.grey[100]}
                mb={1}
                sx={{ fontWeight: 500 }}
              >
                Estado del Artículo
              </Typography>
              <Select
                value={estadoArticulo}
                onChange={(e) => handleEstadoArticuloChange(e.target.value)}
                fullWidth
                size="small"
                sx={{
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
                  "& .MuiInputAdornment-root": {
                    marginRight: "8px",
                  },

                  "& .MuiFormHelperText-root": {
                    marginLeft: 1,
                    fontSize: "0.75rem",
                    color: theme.palette.error.main,
                  },
                }}
                IconComponent={(props) => (
                  <KeyboardArrowDownOutlined
                    {...props}
                    sx={{ color: colors.grey[300], fontSize: 20 }}
                  />
                )}
              >
                <MenuItem value="excelente">Excelente (como nuevo)</MenuItem>
                <MenuItem value="bueno">Bueno (uso normal)</MenuItem>
                <MenuItem value="regular">Regular (signos de uso)</MenuItem>
                <MenuItem value="danado">Dañado (requiere reparación)</MenuItem>
                <MenuItem value="perdido">Perdido</MenuItem>
              </Select>
            </Box>

            {estadoArticulo === "danado" && (
              <Box mb={3}>
                <Typography
                  variant="body1"
                  color={colors.grey[100]}
                  mb={1}
                  sx={{ fontWeight: 500 }}
                >
                  Descripción del Daño
                </Typography>
                <InlineEditableText
                  value={estadoArticuloDanado}
                  onChange={handleEstadoArticuloDanadoChange}
                  placeholder="Describe el daño del artículo..."
                  minRows={3}
                  sx={{
                    backgroundColor: colors.primary[800],
                    borderRadius: 2,
                    border: `1px solid ${colors.grey[400]}`,
                    p: 1.5,
                    color: colors.grey[100],
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": { borderColor: colors.grey[300] },
                    "&:focus": {
                      borderColor: colors.accentGreen[100],
                      boxShadow: "0 0 0 3px rgba(34,197,94,0.2)",
                    },
                  }}
                />
              </Box>
            )}

            <PhotoUpload
              onPhotosChange={handleFotosEvidenciaChange}
              maxPhotos={5}
            />

            <Box>
              <Typography
                variant="body1"
                color={colors.grey[100]}
                mb={1}
                sx={{ fontWeight: 500 }}
              >
                Observaciones
              </Typography>
              <InlineEditableText
                value={observaciones}
                onChange={handleObservacionesChange}
                placeholder="Añade cualquier observación relevante..."
                minRows={4}
                sx={{
                  backgroundColor: colors.primary[800],
                  borderRadius: 2,
                  border: `1px solid ${colors.grey[400]}`,
                  p: 1.5,
                  color: colors.grey[100],
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    borderColor: colors.grey[300],
                  },
                  "&:focus": {
                    borderColor: colors.accentGreen[100],
                    boxShadow: "0 0 0 3px rgba(34,197,94,0.2)", // feedback accesible
                  },
                }}
              />
            </Box>
          </Box>

          <Box>
            {saveState.isLoading && (
              <Alert
                severity="info"
                icon={<CircularProgress size={16} />}
                sx={{
                  mb: 2,
                  mt: 2,
                  borderRadius: 2,
                  border: `1px solid ${colors.borderContainer}`,
                  bgcolor: colors.bgContainer, // coherente con el resto del diseño
                  color: colors.grey[100],
                  transition:
                    "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    borderColor: colors.accentGreen[100],
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)", // misma sombra ligera que el contenedor
                  },
                  "& .MuiAlert-icon": {
                    color: colors.accentGreen[100], // ícono consistente con el resto
                  },
                  "& .MuiAlert-message": {
                    padding: 0,
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  },
                }}
              >
                Guardando responsiva en el sistema...
              </Alert>
            )}
          </Box>

          {/* Botón de firma */}
          {!signatureStatus.isSigned ? (
            <Button
              variant="contained"
              // onClick={() =>
              //   setSignatureStatus({ ...signatureStatus, showModal: true })
              // }
              onClick={handleFirmarClick}
              endIcon={
                <LockPersonOutlined
                  sx={{ fontSize: 18, color: colors.textAccent }}
                />
              }
              sx={{
                textTransform: "none", // minimalista, sin mayúsculas forzadas
                borderRadius: "10px", // bordes redondeados suaves
                fontWeight: 500,
                fontSize: "0.875rem", // tamaño legible, consistente
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px", // espacio limpio entre texto e icono
                backgroundColor: colors.accentGreen[100], // color normal
                color: colors.textAccent, // contraste legible
                border: "none",
                cursor: "pointer",

                "&:hover": {
                  backgroundColor: colors.accentGreen[200], // hover sutil
                },
                "&:active": {
                  backgroundColor: colors.accentGreen[300], // feedback presionado
                },
                "& .MuiButton-endIcon": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                },
                transition: "background-color 0.3s ease, box-shadow 0.2s ease",
                boxShadow: "none", // minimalismo: sin sombra por defecto
                "&:hover, &:active": {
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)", // sombra muy ligera al interactuar
                },
              }}
            >
              Firmar Electrónicamente
            </Button>
          ) : (
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: colors.bgContainer, // fondo sutil según modo
                border: `1px solid ${colors.borderContainer}`, // borde punteado suave
                transition:
                  "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)", // sombra ligera
                },
              }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <Typography
                  variant="subtitle2"
                  fontWeight={600}
                  mb={2}
                  color={colors.grey[100]}
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <VerifiedIcon
                    sx={{ fontSize: 22, color: colors.accentGreen[100] }}
                  />
                  DOCUMENTO FIRMADO EXITOSAMENTE
                </Typography>
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <Box component="span" sx={{ fontWeight: 500 }}>
                    Documento:
                  </Box>{" "}
                  Responsiva #{nuevoArticulo?.id}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <Box component="span" sx={{ fontWeight: 500 }}>
                    Firmado por:
                  </Box>{" "}
                  {nuevoArticulo.usuarioAsignado?.nombre}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <Box component="span" sx={{ fontWeight: 500 }}>
                    Fecha:
                  </Box>{" "}
                  {signatureStatus.signedAt.toLocaleString()}
                </Typography>
                <Chip
                  label={signatureStatus.hashMetadata?.algorithm || "SHA-256"}
                  size="small"
                  variant="outlined"
                  sx={{ mt: 1, fontSize: "0.7rem" }}
                />
              </Box>
              <Box
                sx={{
                  p: 1.5,
                  mb: 2,
                  borderRadius: "8px",

                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                  sx={{ fontWeight: 500, mb: 0.5 }}
                >
                  Token de verificación:
                </Typography>
                <Box display="flex" alignItems="center">
                  <Typography
                    variant="caption"
                    sx={{
                      wordBreak: "break-all",
                      fontFamily: "monospace",
                      fontSize: "0.7rem",
                      flexGrow: 1,
                      color: "text.primary",
                    }}
                  >
                    {signatureStatus.verificationHash}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={copyTokenToClipboard}
                    sx={{ ml: 1 }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Box display="flex" justifyContent="space-between" gap={1}>
                <Button
                  variant="contained"
                  endIcon={
                    <DownloadIcon
                      sx={{ fontSize: 18, color: colors.textAccent }}
                    />
                  }
                  sx={{
                    textTransform: "none", // minimalista, sin mayúsculas forzadas
                    borderRadius: "10px", // bordes redondeados suaves
                    fontWeight: 500,
                    fontSize: "0.875rem", // tamaño legible, consistente
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px", // espacio limpio entre texto e icono
                    backgroundColor: colors.accentGreen[100], // color normal
                    color: colors.textAccent, // contraste legible
                    border: "none",
                    cursor: "pointer",

                    "&:hover": {
                      backgroundColor: colors.accentGreen[200], // hover sutil
                    },
                    "&:active": {
                      backgroundColor: colors.accentGreen[300], // feedback presionado
                    },
                    "& .MuiButton-endIcon": {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    },
                    transition:
                      "background-color 0.3s ease, box-shadow 0.2s ease",
                    boxShadow: "none", // minimalismo: sin sombra por defecto
                    "&:hover, &:active": {
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)", // sombra muy ligera al interactuar
                    },
                  }}
                  onClick={exportSignatureCertificate}
                >
                  Exportar certificado
                </Button>

                {/* Botón de reintento que aparece cuando hay error */}
                {saveState.error && (
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Refresh />}
                    onClick={handleRetrySave}
                    sx={{
                      textTransform: "none",
                      borderRadius: "6px",
                      fontWeight: 500,
                    }}
                  >
                    Reintentar
                  </Button>
                )}
              </Box>
              <Box display="flex" justifyContent="space-between" gap={1}>
                {saveState.error && !saveState.isLoading && (
                  <Alert
                    severity="error"
                    sx={{
                      mb: 2,
                      mt: 2,
                      borderRadius: "8px",
                      alignItems: "center",
                      "& .MuiAlert-message": {
                        padding: "4px 0",
                        flexGrow: 1,
                      },
                    }}
                    action={
                      <Button
                        color="inherit"
                        size="small"
                        onClick={handleRetrySave}
                        startIcon={<Refresh />}
                        sx={{
                          textTransform: "none",
                          fontWeight: 500,
                        }}
                      >
                        Reintentar
                      </Button>
                    }
                  >
                    Error al guardar la responsiva. Por favor, intenta
                    nuevamente.
                  </Alert>
                )}
              </Box>
            </Box>
          )}

          <SignatureModal
            open={signatureStatus.showModal}
            onClose={() =>
              setSignatureStatus({ ...signatureStatus, showModal: false })
            }
            userEmail={nuevoArticulo.usuarioAsignado?.email}
            onOTPRequest={handleOTPRequest}
            onOTPValidate={handleOTPValidate}
            onSignatureComplete={handleSignatureComplete}
            documentData={{
              id: nuevoArticulo?.id_articulo, // ← CORREGIDO: usar id_articulo en lugar de id
              employeeId: nuevoArticulo.usuarioAsignado?.id_usuario, // ← CORREGIDO: usar id_usuario en lugar de id
              employee: {
                id: nuevoArticulo.usuarioAsignado?.id_usuario, // ← CORREGIDO
                name: nuevoArticulo.usuarioAsignado?.nombre,
              },
              article: {
                id: nuevoArticulo.id_articulo, // ← CORREGIDO
                name: nuevoArticulo.campos?.nombre_articulo,
              },
            }}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Box
            mb={3}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: colors.bgContainer, // fondo sutil según modo
              border: `1px solid ${colors.borderContainer}`, // borde punteado suave
              transition:
                "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)", // sombra ligera
              },
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                px: 2,
                fontWeight: 600,
                fontSize: "1.1rem",
              }}
            >
              Vista Previa del Documento
            </Typography>

            {pdfUrl ? (
              <Box
                mb={3}
                sx={{
                  p: 2, // padding interno
                  borderRadius: 2, // borde redondeado
                  bgcolor: colors.bgContainerSecondary, // fondo sutil según tema
                  border: `1px solid ${colors.borderContainer}`, // borde suave
                  transition:
                    "background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)", // sombra ligera al hover
                  },
                }}
              >
                <iframe
                  key={pdfVersion}
                  ref={pdfRef}
                  src={pdfUrl}
                  title="Vista previa de la responsiva"
                  width="100%"
                  height="700px"
                  style={{
                    border: "none", // borde ya definido por el Box
                    borderRadius: "8px",
                  }}
                />
              </Box>
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="700px"
                border="1px solid #e0e0e0"
                borderRadius={2}
                sx={{ backgroundColor: "grey.50" }}
              >
                <CircularProgress sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  {images.loaded
                    ? "Generando documento..."
                    : "Cargando recursos del documento..."}
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Index;
