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
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import InlineEditableText from "../../components/ResponsiveGenerator/InlineEditableText";
import SignatureModal from "../../components/ResponsiveGenerator/SignatureModal";
import VerifiedIcon from "@mui/icons-material/Verified";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import { tokens } from "../../theme";
import {
  AssignmentOutlined,
  DrawOutlined,
  HowToRegOutlined,
  LockPersonOutlined,
  VerifiedOutlined,
} from "@mui/icons-material";

const Index = () => {
  const { state } = useLocation();
  const { nuevoArticulo } = state || {};
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [observaciones, setObservaciones] = useState("");
  const [motivoCambio, setMotivoCambio] = useState("");
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

  // Generación segura de hash con nonce
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

  // Mock: Enviar OTP (conectar a tu API real)
  const handleOTPRequest = (callback) => {
    console.log("Enviando OTP a:", nuevoArticulo.usuarioAsignado?.email);
    // Simular delay de red
    setTimeout(() => callback(), 1500);
  };

  // Mock: Validar OTP (conectar a tu API real)
  const handleOTPValidate = async (otp, qrResponse) => {
    // En producción, verificar contra tu backend
    if (otp === "123456") {
      const hashResult = await generateSecureHash(qrResponse.qrData, {
        includeTimestamp: true,
        includeUniqueId: true,
        documentId: nuevoArticulo?.id,
      });

      const newSignatureStatus = {
        isSigned: true,
        showModal: false,
        qrImage: qrResponse.qrImage,
        qrData: qrResponse.qrData,
        verificationHash: hashResult.hash,
        hashMetadata: {
          algorithm: hashResult.algorithm,
          timestamp: hashResult.timestamp,
          timezone: hashResult.timezone,
          uniqueId: hashResult.uniqueId,
          documentId: hashResult.documentId,
        },
        signedAt: new Date(),
      };

      setSignatureStatus(newSignatureStatus);
      setPdfVersion((prev) => prev + 1);

      // Guardar firma en backend (simulado)
      console.log("Guardando firma en backend:", newSignatureStatus);

      alert("✅ Firma electrónica verificada y guardada");
      return true;
    } else {
      alert("❌ Código incorrecto");
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
      .then(() => alert("Token copiado al portapapeles"))
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
    fonts: {
      title: {
        size: 16,
        style: "bold",
        align: "left",
      },
      section: {
        size: 12,
        style: "bold",
        align: "left",
      },
      bodyBold: {
        size: 10,
        style: "bold",
        align: "justify",
      },
      body: {
        size: 10,
        style: "normal",
        align: "justify",
      },
      small: {
        size: 8,
        style: "normal",
        align: "left",
      },
    },
    spacing: {
      section: 20,
      line: 14,
      bullet: 6,
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
    setPdfVersion((prev) => prev + 1);
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

  const drawCustomTable = (doc, data, startY, maxWidth) => {
    const tableConfig = {
      rowHeight: 12, // Reducido de 16 a 12
      padding: 4, // Reducido de 8 a 4
      fontSize: 9, // Mantenemos el tamaño de fuente
      lineWidth: 0.1,
      column1Width: maxWidth * 0.35,
      column2Width: maxWidth * 0.65,
      headerBg: "#ffffff",
      evenRowBg: "#ffffff",
      oddRowBg: "#f8f8f8", // Más sutil que #fafafa
      borderColor: "#eaeaea", // Más claro que #e0e0e0
      textColor: "#333333",
      headerTextColor: "#666666",
      headerFontSize: 9,
      headerPadding: 4,
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

  const generarPDF = async () => {
    if (!nuevoArticulo || !images.loaded) {
      console.log("Faltan datos necesarios para generar el PDF");
      return;
    }

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
        "Responsiva de Equipo",
        MARGINS.left,
        y,
        maxWidth,
        { type: "title", align: "left" }
      );
      y += PDF_STYLES.spacing.section;

      // Primer párrafo con justificación mejorada
      y = addJustifiedText(
        doc,
        "Por medio del presente documento, hago constar que he recibido el siguiente equipo, propiedad de la empresa ERPP CORPORATIVO S.A. DE C.V.",
        MARGINS.left,
        y,
        maxWidth,
        { fontSize: PDF_STYLES.fonts.body.size }
      );
      y += PDF_STYLES.spacing.section;

      // Sección de datos del responsable
      y = addStyledText(
        doc,
        "Datos del responsable",
        MARGINS.left,
        y,
        maxWidth,
        { type: "section", align: "left" }
      );
      y += PDF_STYLES.spacing.line;

      const datosResponsable = [
        `- Nombre completo: ${nuevoArticulo.usuarioAsignado?.nombre || "N/A"}`,
        `- Puesto: ${nuevoArticulo.usuarioAsignado?.puesto?.nombre || "N/A"}`,
        `- Departamento: ${
          nuevoArticulo.usuarioAsignado?.area?.nombre || "N/A"
        }`,
        `- Fecha de entrega: ${nuevoArticulo.fecha_ingreso || "N/A"}`,
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

      // Sección de Motivo de Cambio (solo si tiene contenido)
      if (motivoCambio && motivoCambio.trim() !== "") {
        y += PDF_STYLES.spacing.section;
        y = addStyledText(doc, "Motivo de cambio", MARGINS.left, y, maxWidth, {
          type: "section",
          align: "left",
        });
        y += PDF_STYLES.spacing.line;

        y = addJustifiedText(
          doc,
          motivoCambio.trim(),
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
        "Datos del equipo entregado",
        MARGINS.left,
        y,
        maxWidth,
        { type: "section", align: "left" }
      );
      y += PDF_STYLES.spacing.line;

      const camposData = Object.entries(nuevoArticulo.campos || {}).map(
        ([key, value]) => [key.replace(/_/g, " ").toUpperCase(), value]
      );

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

      y = addStyledText(doc, "Condiciones y uso", MARGINS.left, y, maxWidth, {
        type: "title",
        align: "left",
      });
      y += PDF_STYLES.spacing.section;

      const condiciones = [
        `Se hace constar: La empresa ERPP CORPORATIVO S.A. DE C.V. hace entrega del equipo ${
          nuevoArticulo.campos?.nombre_articulo
        }, propiedad de la misma, a favor de ${
          nuevoArticulo.usuarioAsignado?.nombre || "el empleado"
        } con CURP ${
          nuevoArticulo.usuarioAsignado?.curp
        }, con un valor comercial: $${
          nuevoArticulo.campos?.precio_articulo
        }. Declaro que el equipo recibido se encuentra en buen estado y funcionando correctamente.`,
        "Asimismo, me comprometo a:",
        "- Hacer uso exclusivo del equipo para fines estrictamente laborales.",
        "- Dar cumplimiento a las políticas internas de la empresa.",
        "- No realizar cambios de uso, configuración y/o programación sin la autorización correspondiente.",
        "- Asegurar su buen uso, conservación y reportar cualquier incidente o daño; de lo contrario se deberá cubrir en su totalidad los gastos de reparación o reposición.",
        "- Devolver el equipo en las mismas condiciones en que fue entregado, al término de mi relación laboral o cuando la empresa así lo requiera.",
        "",
        "Una vez concluida mi relación con ERPP CORPORATIVO S.A. DE C.V., me comprometo a:",
        "- Entregar de manera inmediata toda información documentada propiedad de la empresa, incluyendo, pero no limitada a: expedientes, reportes, estudios, actas, resoluciones, oficios, correspondencia, acuerdos, directivas, directrices, circulares, contratos, convenios, instructivos, notas, memorandos, estadísticas y cualquier otro registro.",
        "- Devolver el equipo de cómputo con toda la información que contenga y en óptimas condiciones de funcionamiento.",
      ];

      // Primer párrafo justificado
      y = addJustifiedText(doc, condiciones[0], MARGINS.left, y, maxWidth, {
        fontSize: PDF_STYLES.fonts.body.size,
      });
      y += PDF_STYLES.spacing.section;

      // Subtítulo
      y = addStyledText(doc, condiciones[1], MARGINS.left, y, maxWidth, {
        type: "section",
        align: "left",
      });
      y += PDF_STYLES.spacing.line;

      // Lista de compromisos
      const compromisos1 = condiciones.slice(2, 7);
      compromisos1.forEach((item) => {
        if (item.trim() !== "") {
          y = addJustifiedText(doc, item, MARGINS.left + 10, y, maxWidth - 10, {
            fontSize: PDF_STYLES.fonts.body.size,
          });
          y += PDF_STYLES.spacing.bullet;
        }
      });

      // Segundo subtítulo
      y += PDF_STYLES.spacing.section;
      y = addStyledText(doc, condiciones[8], MARGINS.left, y, maxWidth, {
        type: "section",
        align: "left",
      });
      y += PDF_STYLES.spacing.line;

      // Segunda lista de compromisos
      const compromisos2 = condiciones.slice(9);
      compromisos2.forEach((item) => {
        y = addJustifiedText(doc, item, MARGINS.left + 10, y, maxWidth - 10, {
          fontSize: PDF_STYLES.fonts.body.size,
        });
        y += PDF_STYLES.spacing.bullet;
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
      if (signatureStatus.isSigned && signatureStatus.qrImage) {
        const qrSize = 90; // Tamaño moderado para no saturar
        const qrX = rightCenter - qrSize / 2; // Centrado sobre la línea
        const qrY = lineY - qrSize - 30; // 10pt arriba de la línea

        doc.addImage(signatureStatus.qrImage, "PNG", qrX, qrY, qrSize, qrSize);

        // Mostrar el token/hash de verificación debajo del QR
        const token = signatureStatus.verificationHash;
        const formattedToken = token.match(/.{1,8}/g).join(" "); // Separar cada 8 caracteres

        // Información de validación
        doc.setFontSize(6);
        doc.setTextColor(100, 100, 100);
        doc.text(
          `Verificado: ${signatureStatus.signedAt.toLocaleString()}`,
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

      const pdfBlob = doc.output("blob");
      const newPdfUrl = URL.createObjectURL(pdfBlob);
      setPdfUrl(newPdfUrl);
    } catch (error) {
      console.error("Error al generar el PDF:", error);
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
        sx={{ color: "primary.main", fontWeight: "bold" }}
      >
        Generar Responsiva de Equipo
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "text.secondary" }}
            >
              Configuración del Documento
            </Typography>

            <Box mb={3}>
              <Typography variant="subtitle2" gutterBottom>
                Motivo de Cambio
              </Typography>
              <InlineEditableText
                value={motivoCambio}
                onChange={handleMotivoCambioChange}
                placeholder="motivo del cambio de equipo..."
                minRows={4}
                sx={{ backgroundColor: "background.paper" }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Observaciones
              </Typography>
              <InlineEditableText
                value={observaciones}
                onChange={handleObservacionesChange}
                placeholder="observación relevante..."
                minRows={6}
                sx={{ backgroundColor: "background.paper" }}
              />
            </Box>
          </Paper>

          {/* Botón de firma */}
          {!signatureStatus.isSigned ? (
            <Button
              variant="contained"
              onClick={() =>
                setSignatureStatus({ ...signatureStatus, showModal: true })
              }
              endIcon={
                <LockPersonOutlined
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
              Firmar Electrónicamente
            </Button>
          ) : (
            <Box
              sx={{
                p: 2,
                mt: 2,
                borderRadius: 1,
              }}
            >
              <Box display="flex" alignItems="center" mb={2}>
                <VerifiedIcon
                  color={
                    verificationResult
                      ? "success"
                      : verificationResult === false
                      ? "error"
                      : "disabled"
                  }
                />
                <Typography variant="subtitle1" sx={{ ml: 1 }}>
                  {verificationResult
                    ? "Documento verificado"
                    : verificationResult === false
                    ? "¡Advertencia! Documento modificado"
                    : "Documento firmado"}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Documento:</strong> Responsiva #{nuevoArticulo?.id}
                </Typography>
                <Typography variant="body2">
                  <strong>Firmado por:</strong>{" "}
                  {nuevoArticulo.usuarioAsignado?.nombre}
                </Typography>
                <Typography variant="body2">
                  <strong>Fecha:</strong>{" "}
                  {signatureStatus.signedAt.toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Algoritmo:</strong>{" "}
                  {signatureStatus.hashMetadata?.algorithm}
                </Typography>
              </Box>

              <Box
                sx={{
                  p: 1.5,
                  mb: 2,
                  borderRadius: 1,
                  position: "relative",
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
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

              <Box display="flex" justifyContent="space-between">
                <Button
                  variant="contained"
                  color="info"
                  size="small"
                  endIcon={<DownloadIcon />}
                  onClick={exportSignatureCertificate}
                >
                  Exportar certificado
                </Button>
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
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom sx={{ px: 2 }}>
              Vista Previa del Documento
            </Typography>

            {pdfUrl ? (
              <iframe
                key={pdfVersion}
                ref={pdfRef}
                src={pdfUrl}
                title="Vista previa de la responsiva"
                width="100%"
                height="700px"
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
            ) : (
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="700px"
                border="1px dashed #e0e0e0"
                borderRadius={2}
                sx={{ backgroundColor: "background.default" }}
              >
                <CircularProgress sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  {images.loaded
                    ? "Generando documento..."
                    : "Cargando recursos del documento..."}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Index;
