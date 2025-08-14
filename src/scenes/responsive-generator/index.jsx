import React, { useEffect, useRef, useState } from "react";
import { Grid, TextField, Typography, Box, Paper } from "@mui/material";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import InlineEditableText from "../../components/ResponsiveGenerator/InlineEditableText";

const Index = () => {
  const { state } = useLocation();
  const { nuevoArticulo } = state || {};

  const [observaciones, setObservaciones] = useState("");
  const [motivoCambio, setMotivoCambio] = useState("");
  const [logoBase64, setLogoBase64] = useState(null);
  const pdfRef = useRef(null);

  // Función para convertir imagen pública a base64
  const getImageBase64FromUrl = (url) => {
    return fetch(url)
      .then((response) => response.blob())
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

  // Carga logo base64 al montar
  useEffect(() => {
    getImageBase64FromUrl("/ERPP.png").then(setLogoBase64);
  }, []);

  // Justify with paging helper (igual que antes)
  function textJustifyAutoPaging(
    doc,
    text,
    x,
    y,
    width,
    lineHeight,
    marginBottom = 20
  ) {
    const pageHeight = doc.internal.pageSize.getHeight();
    const lines = doc.splitTextToSize(text, width);
    const fontSize = doc.getFontSize();
    const charWidth =
      (doc.getStringUnitWidth(" ") * fontSize) / doc.internal.scaleFactor;

    lines.forEach((line, idx) => {
      if (y + lineHeight > pageHeight - marginBottom) {
        doc.addPage();
        y = 30; // Considera margen superior para el header
        addHeader(doc); // Poner header en la nueva página
        addFooter(doc); // Poner footer en la nueva página
      }

      const words = line.trim().split(" ");
      if (words.length === 1 || idx === lines.length - 1) {
        doc.text(line, x, y);
      } else {
        const lineWidth = doc.getTextWidth(line);
        const spaceCount = words.length - 1;
        const extraSpace = (width - lineWidth) / spaceCount;

        let currentX = x;
        words.forEach((word, i) => {
          doc.text(word, currentX, y);
          if (i < words.length - 1) {
            currentX += doc.getTextWidth(word) + charWidth + extraSpace;
          }
        });
      }

      y += lineHeight;
    });

    return y;
  }

  // Función para agregar encabezado con logo en todas las páginas
  const addHeader = (doc) => {
    if (!logoBase64) return;

    // Logo en la esquina superior izquierda
    doc.addImage(logoBase64, "PNG", 20, 10, 40, 15);

    // Línea azul horizontal frente al logo
    doc.setDrawColor(0, 102, 204); // azul
    doc.setLineWidth(0.5);
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.line(65, 20, pageWidth - 20, 20);
    // Restablecer color negro para el texto posterior
    doc.setTextColor(0, 0, 0);
  };

  // Función para agregar pie de página en todas las páginas
  const addFooter = (doc) => {
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const rightOffset = 10; // nuevo margen más pequeño solo para el número de página

    // Línea azul superior del pie de página
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

    // Fuente para el pie de página
    doc.setFont("times");
    doc.setFontSize(10);
    doc.setTextColor(0, 102, 204);

    // Número de página
    const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
    const pageText = `Página ${pageNumber} de {totalPages}`;

    // Texto izquierda
    doc.text("sitio web: www.erpp.mx", margin, pageHeight - 10);

    // Texto derecha más cerca del borde
    doc.text(pageText, pageWidth - rightOffset, pageHeight - 10, {
      align: "right",
    });

    // Restaurar color de texto a negro
    doc.setTextColor(0, 0, 0);
  };

  const generarPDF = () => {
    if (!nuevoArticulo) return;
    if (!logoBase64) return; // Espera a que cargue la imagen

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "letter", // tamaño carta
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = 20;
    const marginRight = 20;
    const maxWidth = pageWidth - marginLeft - marginRight;

    doc.setFont("times");
    addHeader(doc); // Header primera página
    addFooter(doc); // Footer primera página

    // Título centrado debajo del header (considera espacio del header)
    doc.setFontSize(16);
    doc.setFont("times", "bold");
    doc.text("Responsiva de Equipo", pageWidth / 2, 30, {
      align: "center",
    });

    doc.setFontSize(11);
    doc.setFont("times", "normal");

    let y = 45;

    y = textJustifyAutoPaging(
      doc,
      "Por medio del presente documento, hago constar que he recibido el siguiente equipo, propiedad de la empresa ERPP CORPORATIVO S.A. DE C.V.",
      marginLeft,
      y,
      maxWidth,
      8
    );

    doc.setFontSize(13);
    doc.setFont("times", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Datos del responsable:", marginLeft, y + 10);
    doc.setFont("times", "normal");

    y += 18;
    doc.setFontSize(11);
    const bullet = "•";

    const datosResponsable = [
      `Nombre completo: ${nuevoArticulo.usuarioAsignado?.nombre || "N/A"}`,
      `Puesto: ${nuevoArticulo.usuarioAsignado?.puesto?.nombre || "N/A"}`,
      `Departamento: ${nuevoArticulo.usuarioAsignado?.area?.nombre || "N/A"}`,
      `Fecha de entrega: ${nuevoArticulo.fecha_ingreso || "N/A"}`,
      `Correo institucional: N/A`,
      `Plaza: ${nuevoArticulo.plaza?.nombre_plaza || "N/A"}`,
    ];

    datosResponsable.forEach((linea) => {
      y = textJustifyAutoPaging(
        doc,
        `${bullet} ${linea}`,
        marginLeft + 5,
        y,
        maxWidth - 5,
        8
      );
      y += 2; // espacio adicional entre líneas
    });

    y += 2;
    doc.setFont("times", "bold");
    doc.text(`${bullet} Motivo de cambio:`, 25, y);
    y += 6;
    doc.setFont("times", "normal");
    y = textJustifyAutoPaging(
      doc,
      motivoCambio || "N/A",
      marginLeft + 10,
      y,
      maxWidth - 10,
      8
    );

    doc.setFont("times", "bold");
    doc.setFontSize(13);
    doc.setTextColor(40, 40, 40);
    doc.text("Datos del equipo entregado:", 20, y + 10);
    doc.setFont("times", "normal");

    const tablaY = y + 15;

    const camposData = Object.entries(nuevoArticulo.campos || {}).map(
      ([key, value]) => [key.replace(/_/g, " ").toUpperCase(), value]
    );

    doc.autoTable({
      startY: tablaY,
      margin: { left: marginLeft, right: marginRight, top: 35 },
      head: [
        [
          {
            content: "INFORMACIÓN DEL EQUIPO",
            colSpan: 2,
            styles: {
              halign: "center",
              fontStyle: "bold",
              fillColor: [0, 102, 204],
              font: "times",
              fontSize: 11,
              textColor: [255, 255, 255],
            },
          },
        ],
      ],
      body: camposData,
      theme: "grid",
      styles: {
        font: "times",
        fontSize: 11,
        lineColor: [80, 80, 80],
        textColor: [0, 0, 0],
      },
      columnStyles: {
        0: {
          fontStyle: "bold",
          cellWidth: maxWidth * 0.45,
          font: "times",
          fontSize: 11,
        },
        1: { cellWidth: maxWidth * 0.55, font: "times", fontSize: 11 },
      },
      didDrawPage: (data) => {
        addHeader(doc);
        addFooter(doc);
      },
    });

    const finalY = doc.lastAutoTable?.finalY || tablaY + 20;
    let obsStartY = finalY + 10;

    doc.setFontSize(11);
    doc.setFont("times", "bold");
    doc.text("Observaciones:", 20, obsStartY);
    doc.setFontSize(11);
    doc.setFont("times", "normal");
    obsStartY = textJustifyAutoPaging(
      doc,
      observaciones || "N/A",
      marginLeft + 10, // << Aquí mismo ajuste igual que motivoCambio
      obsStartY + 6,
      maxWidth - 10,
      8
    );

    doc.addPage();
    addHeader(doc); // Header nueva página
    addFooter(doc); // Footer nueva página

    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.text("Condiciones y uso", doc.internal.pageSize.getWidth() / 2, 30, {
      align: "center",
    });

    doc.setFont("times", "normal");
    doc.setFontSize(11);

    const condiciones = [
      `Se hace constar: La empresa ERPP CORPORATIVO S.A. DE C.V. hace entrega del equipo ${nuevoArticulo.campos?.nombre_articulo}, propiedad de la misma, a favor de ${nuevoArticulo.usuarioAsignado.nombre} con CURP, con un valor comercial: $${nuevoArticulo.campos?.precio_articulo}. Declaro que el equipo recibido se encuentra en buen estado y funcionando correctamente.`,
      "Asimismo, me comprometo a:",
      "• Hacer uso exclusivo del equipo para fines estrictamente laborales.",
      "• Dar cumplimiento a las políticas internas de la empresa.",
      "• No realizar cambios de uso, configuración y/o programación sin la autorización correspondiente.",
      "• Asegurar su buen uso, conservación y reportar cualquier incidente o daño; de lo contrario se deberá cubrir en su totalidad los gastos de reparación o reposición.",
      "• Devolver el equipo en las mismas condiciones en que fue entregado, al término de mi relación laboral o cuando la empresa así lo requiera.",
      "",

      // Esta línea será impresa con negritas y alineada a 20
      "Una vez concluida mi relación con ERPP CORPORATIVO S.A. DE C.V., me comprometo a:",

      // El resto del texto normal
      "• Entregar de manera inmediata toda información documentada propiedad de la empresa, incluyendo, pero no limitada a: expedientes, reportes, estudios, actas, resoluciones, oficios, correspondencia, acuerdos, directivas, directrices, circulares, contratos, convenios, instructivos, notas, memorandos, estadísticas y cualquier otro registro.",
      "• Devolver el equipo de cómputo con toda la información que contenga y en óptimas condiciones de funcionamiento.",
    ];

    // ...

    let yCond = 40;
    yCond = textJustifyAutoPaging(
      doc,
      condiciones[0],
      marginLeft,
      yCond,
      maxWidth,
      8
    );
    yCond += 4;

    doc.setFont("times", "bold");
    yCond = textJustifyAutoPaging(
      doc,
      condiciones[1],
      marginLeft,
      yCond,
      maxWidth,
      8
    );
    yCond += 3;

    doc.setFont("times", "normal");

    // Imprimir compromisos previos
    const compromisos1 = condiciones.slice(2, 7);
    compromisos1.forEach((item) => {
      yCond = textJustifyAutoPaging(
        doc,
        item,
        marginLeft + 5,
        yCond,
        maxWidth - 5,
        8
      );
      yCond += 1;
    });

    yCond += 2;

    // Imprimir línea en negritas y alineada a x=20
    doc.setFont("times", "bold");
    yCond = textJustifyAutoPaging(
      doc,
      condiciones[8], // "Una vez concluida mi relación con ERPP..."
      marginLeft, // margen izquierdo fijo 20 para alinear
      yCond,
      maxWidth,
      8
    );
    doc.setFont("times", "normal");
    yCond += 3;

    // Imprimir el resto del texto con indentación
    const compromisos2 = condiciones.slice(9);
    compromisos2.forEach((item) => {
      yCond = textJustifyAutoPaging(
        doc,
        item,
        marginLeft + 5,
        yCond,
        maxWidth - 5,
        8
      );
      yCond += 1;
    });

    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.text("Atentamente", doc.internal.pageSize.getWidth() / 2, 225, {
      align: "center",
    });

    //const pageWidth = doc.internal.pageSize.getWidth();
    doc.setLineWidth(0.5);
    doc.setDrawColor(80, 80, 80);
    doc.line(20, 250, 80, 250);
    doc.line(pageWidth - 80, 250, pageWidth - 20, 250);

    doc.setFont("times", "normal");
    doc.setFontSize(10);

    const leftLineStart = 20;
    const leftLineEnd = 80;
    const rightLineStart = pageWidth - 80;
    const rightLineEnd = pageWidth - 20;
    const leftCenter = (leftLineStart + leftLineEnd) / 2;
    const rightCenter = (rightLineStart + rightLineEnd) / 2;

    doc.text(
      "Firma del otorgante\nERPP CORPORATIVO S.A DE C.V.",
      leftCenter,
      255,
      { align: "center" }
    );
    doc.text(
      `Firma del receptor\n${nuevoArticulo.usuarioAsignado.nombre}`,
      rightCenter,
      255,
      { align: "center" }
    );

    // Reemplaza el marcador con el número real total de páginas
    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages("{totalPages}");
    }

    const pdfURL = doc.output("dataurlstring");
    if (pdfRef.current) {
      pdfRef.current.src = pdfURL;
    }
  };

  useEffect(() => {
    if (nuevoArticulo && logoBase64) {
      generarPDF();
    }
  }, [nuevoArticulo, observaciones, motivoCambio, logoBase64]);

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Generar Responsiva
      </Typography>

      <Grid container spacing={2}>
        {/* Motivo de cambio */}
        <Grid item xs={12} md={4}>
          <InlineEditableText
            value={motivoCambio}
            onChange={setMotivoCambio}
            placeholder="Motivo de cambio"
            minRows={4}
          />

          {/* Observaciones */}
          <InlineEditableText
            value={observaciones}
            onChange={setObservaciones}
            placeholder="Observaciones"
            minRows={6}
          />
        </Grid>

        {/* PDF Preview */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Vista previa de la responsiva
            </Typography>
            <iframe
              ref={pdfRef}
              title="Vista previa PDF"
              width="100%"
              height="600px"
              style={{ border: "1px solid #ccc", borderRadius: 4 }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Index;
