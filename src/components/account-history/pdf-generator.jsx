import React from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ErppLogo from "../../../public/ERPP-LOGO-2.png";
import Ser0Logo from "../../../public/sero-logo.png";

import { Button } from "@mui/material";
import { Download } from "@mui/icons-material";

const PDFGenerator = ({ data }) => {
  const generatePDF = async () => {
    if (!data || data.length === 0) {
      alert("No hay datos para generar el PDF.");
      return;
    }

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height; // Altura de la página
    const pageWidth = doc.internal.pageSize.width; // Ancho de la página
    const marginBottom = 10; // Margen inferior

    const user = data[0]; // Tomamos el primer objeto del array

    // Función para agregar el encabezado en cada página
    const addHeader = () => {
      doc.addImage(ErppLogo, "PNG", 10, 10, 30, 15); // Logo en la esquina superior izquierda
      doc.addImage(Ser0Logo, "PNG", 170, 10, 30, 15); // Logo en la esquina superior derecha
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("HISTORIAL DE LA CUENTA", 105, 20, { align: "center" }); // Texto centrado
    };

    // Función para verificar si hay espacio suficiente en la página
    const checkPageSpace = (currentY, estimatedHeight) => {
      if (currentY + estimatedHeight > pageHeight - marginBottom) {
        doc.addPage(); // Agregar una nueva página si no hay espacio suficiente
        addHeader(); // Agregar el encabezado en la nueva página
        return 30; // Reiniciar la posición Y en la nueva página
      }
      return currentY;
    };

    // Agregar el encabezado inicial
    addHeader();

    // Información General (Título principal de la sección)
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMACIÓN GENERAL", 10, 40);

    // Información de la Cuenta (Subtítulo)
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMACION DE LA CUENTA", 10, 50);

    const accountInfo = [
      [
        {
          content: "Cuenta",
          styles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            halign: "right",
            fontStyle: "bold",
          },
        },
        user.account || "No disponible",
      ],
      [
        {
          content: "Propietario",
          styles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            halign: "right",
            fontStyle: "bold",
          },
        },
        user.owner_name || "No disponible",
      ],
      [
        {
          content: "Tipo de servicio",
          styles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            halign: "right",
            fontStyle: "bold",
          },
        },
        user.type_service || "No disponible",
      ],
      [
        {
          content: "Tipo de tarifa",
          styles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            halign: "right",
            fontStyle: "bold",
          },
        },
        user.rate_type || "No disponible",
      ],
      [
        {
          content: "Giro",
          styles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            halign: "right",
            fontStyle: "bold",
          },
        },
        user.turn || "No disponible",
      ],
      [
        {
          content: "Serie del Medidor",
          styles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            halign: "right",
            fontStyle: "bold",
          },
        },
        user.meter_series || "No disponible",
      ],
    ];

    doc.autoTable({
      startY: 55,
      body: accountInfo,
      columnStyles: {
        0: { cellWidth: 50, halign: "right" }, // Reducir el ancho de la columna de títulos
        1: { cellWidth: 130, halign: "left" }, // Ajustar el ancho de la columna de valores
      },
      styles: { cellPadding: 2, fontSize: 10 },
    });

    // Dirección de la Cuenta (Subtítulo)
    let currentY = doc.autoTable.previous.finalY + 10;
    currentY = checkPageSpace(currentY, 50); // Verificar espacio antes de agregar la tabla
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DIRECCION DE LA CUENTA", 10, currentY);

    const addressInfo = [
      [
        {
          content: "Calle",
          styles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            halign: "right",
            fontStyle: "bold",
          },
        },
        user.street || "No disponible",
      ],
      [
        {
          content: "Número Exterior",
          styles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            halign: "right",
            fontStyle: "bold",
          },
        },
        user.outdoor_number || "No disponible",
      ],
      [
        {
          content: "Número Interior",
          styles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            halign: "right",
            fontStyle: "bold",
          },
        },
        user.interior_number || "No disponible",
      ],
      [
        {
          content: "Colonia",
          styles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            halign: "right",
            fontStyle: "bold",
          },
        },
        user.cologne || "No disponible",
      ],
      [
        {
          content: "Manzana",
          styles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            halign: "right",
            fontStyle: "bold",
          },
        },
        user.square || "No disponible",
      ],
      [
        {
          content: "Lote",
          styles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            halign: "right",
            fontStyle: "bold",
          },
        },
        user.allotment || "No disponible",
      ],
      [
        {
          content: "Entre Calle 1",
          styles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            halign: "right",
            fontStyle: "bold",
          },
        },
        user.between_street_1 || "No disponible",
      ],
      [
        {
          content: "Entre Calle 2",
          styles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            halign: "right",
            fontStyle: "bold",
          },
        },
        user.between_street_2 || "No disponible",
      ],
      [
        {
          content: "Referencia",
          styles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            halign: "right",
            fontStyle: "bold",
          },
        },
        user.reference || "No disponible",
      ],
      [
        {
          content: "Poblacion",
          styles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            halign: "right",
            fontStyle: "bold",
          },
        },
        user.town || "No disponible",
      ],
      [
        {
          content: "Código Postal",
          styles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            halign: "right",
            fontStyle: "bold",
          },
        },
        user.postal_code || "No disponible",
      ],
      [
        {
          content: "Latitud",
          styles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            halign: "right",
            fontStyle: "bold",
          },
        },
        user.latitude || "No disponible",
      ],
      [
        {
          content: "Longitud",
          styles: {
            fillColor: [0, 102, 204],
            textColor: 255,
            halign: "right",
            fontStyle: "bold",
          },
        },
        user.longitude || "No disponible",
      ],
    ];

    doc.autoTable({
      startY: currentY + 5,
      body: addressInfo,
      columnStyles: {
        0: { cellWidth: 50, halign: "right" }, // Reducir el ancho de la columna de títulos
        1: { cellWidth: 130, halign: "left" }, // Ajustar el ancho de la columna de valores
      },
      styles: { cellPadding: 2, fontSize: 10 },
    });

    // Historial de Pagos
    const payments = JSON.parse(user.payments || "[]");
    if (payments.length > 0) {
      currentY = doc.autoTable.previous.finalY + 10;
      currentY = checkPageSpace(currentY, 50);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("PAGOS REALIZADOS POR LA CUENTA", 10, currentY);
      doc.autoTable({
        startY: currentY + 5,
        head: [
          [
            "Fecha de pago",
            "Monto Pagado",
            "Referencia",
            "Descripción",
            "Período",
          ],
        ],
        headStyles: { fillColor: [0, 102, 204], textColor: 255, fontSize: 7 }, // Color azul para encabezados
        body: payments.map((p) => [
          p.payment_date.split("T")[0],
          `$${p.amount_paid.toFixed(2)}`,
          p.reference,
          p.description,
          p.payment_period,
        ]),
        styles: { fontSize: 7 },
      });
    }

    // Historial de Deudas
    const debts = JSON.parse(user.debit || "[]");
    if (debts.length > 0) {
      currentY = doc.autoTable.previous.finalY + 10;
      currentY = checkPageSpace(currentY, 50);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("ADEUDOS REGISTRADOS DE LA CUENTA", 10, currentY);
      doc.autoTable({
        startY: currentY + 5,
        head: [
          ["Fecha de actualizacion", "Fecha de corte", "Monto del adeudo"],
        ],
        headStyles: { fillColor: [0, 102, 204], textColor: 255, fontSize: 7 }, // Color azul para encabezados
        body: debts.map((d) => [
          d.update_date ? d.update_date.split("T")[0] : "No disponible",
          d.cutoff_date ? d.cutoff_date.split("T")[0] : "No disponible",
          `$${d.debt_amount.toFixed(2)}`,
        ]),
        styles: { fontSize: 7 },
      });
    }

    // Historial de Acciones
    const actions = JSON.parse(user.action || "[]");
    if (actions.length > 0) {
      currentY = doc.autoTable.previous.finalY + 10;
      currentY = checkPageSpace(currentY, 50);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("ACCIONES REALIZADAS A LA CUENTA", 10, currentY);
      doc.autoTable({
        startY: currentY + 5,
        head: [
          ["Persona que gestiono", "Tarea gestionada", "Fecha de gestion"],
        ],
        headStyles: { fillColor: [0, 102, 204], textColor: 255 }, // Color azul para encabezados
        body: actions.map((a) => [
          a.person_who_capture || "No disponible",
          a.task_done,
          a.date_capture.split("T")[0],
        ]),
      });
    }

    const photos = Array.isArray(user.photo)
      ? user.photo
      : JSON.parse(user.photo || "[]");
    if (photos.length > 0) {
      currentY = doc.autoTable.previous.finalY + 15; // Aumentar el espacio antes del título
      currentY = checkPageSpace(currentY, 50);
      if (currentY + 80 > pageHeight - marginBottom) {
        doc.addPage(); // Agregar una nueva página si no hay espacio suficiente
        addHeader();
        currentY = 30; // Reiniciar la posición Y en la nueva página
      }
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("FOTOS CAPTURADAS DE LA CUENTA", 10, currentY);

      currentY += 15; // Aumentar la distancia entre el título y la primera foto

      for (const photo of photos) {
        currentY = checkPageSpace(currentY, 80); // Verificar espacio antes de agregar la tabla e imagen

        const base64Image = photo.imageBase64;

        if (base64Image) {
          // Crear tabla con la foto y la información
          const photoInfo = [
            [
              {
                content: "", // Espacio reservado para la imagen
                rowSpan: 4, // La imagen ocupará 4 filas
                styles: { halign: "center", valign: "middle" }, // Sin fondo
              },
              {
                content: "Persona que capturo",
                styles: {
                  fillColor: [0, 102, 204],
                  textColor: 255,
                  halign: "right",
                  fontStyle: "bold",
                },
              },
              {
                content: photo.person_who_capture || "No disponible",
                styles: { halign: "left" },
              },
            ],
            [
              {
                content: "Tipo de foto",
                styles: {
                  fillColor: [0, 102, 204],
                  textColor: 255,
                  halign: "right",
                  fontStyle: "bold",
                },
              },
              {
                content: photo.image_type || "No disponible",
                styles: { halign: "left" },
              },
            ],
            [
              {
                content: "Tarea gestionada",
                styles: {
                  fillColor: [0, 102, 204],
                  textColor: 255,
                  halign: "right",
                  fontStyle: "bold",
                },
              },
              {
                content: photo.task_done || "No disponible",
                styles: { halign: "left" },
              },
            ],
            [
              {
                content: "Fecha de captura",
                styles: {
                  fillColor: [0, 102, 204],
                  textColor: 255,
                  halign: "right",
                  fontStyle: "bold",
                },
              },
              {
                content: photo.date_capture || "No disponible",
                styles: { halign: "left" },
              },
            ],
          ];

          doc.autoTable({
            startY: currentY,
            body: photoInfo,
            columnStyles: {
              0: { cellWidth: 60, fillColor: [255, 255, 255] }, // Columna para la imagen
              1: { cellWidth: 40 }, // Columna para los títulos
              2: { cellWidth: 80 }, // Columna para los valores
            },
            styles: { cellPadding: 2, fontSize: 9 }, // Reducir el padding y el tamaño de fuente
            didDrawCell: (data) => {
              // Dibujar la imagen dentro de la celda de la primera columna
              if (data.column.index === 0 && data.row.index === 0) {
                const cell = data.cell;
                const imgWidth = 50; // Ancho de la imagen
                const imgHeight = 50; // Alto de la imagen
                const xPos = cell.x + (cell.width - imgWidth) / 2; // Centrar horizontalmente
                const yPos = cell.y + (cell.height - imgHeight) / 2; // Centrar verticalmente
                doc.addImage(
                  base64Image,
                  "JPG",
                  xPos,
                  yPos,
                  imgWidth,
                  imgHeight
                );
              }
            },
          });

          currentY = doc.autoTable.previous.finalY + 25; // Aumentar el espacio después de la tabla
        } else {
          doc.setFontSize(10);
          doc.text("Imagen no disponible", 10, currentY);
          currentY += 15; // Espacio si no hay imagen
        }
      }
    }

    // Guardar el PDF
    doc.save("Historial_de_cuenta.pdf");
  };

  return (
    <Button
      variant="contained"
      color="info"
      onClick={generatePDF}
      sx={{
        width: "100%",
        borderRadius: "35px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #d5e3f5",
        boxShadow: "0 4px 6px rgba(255, 255, 255, 0.1)", // Sombra sutil
      }}
    >
      {" "}
      <span
        style={{
          flex: 1,
          textAlign: "center",
          fontSize: { xs: "0.875rem", sm: "1rem" }, // Ajuste de tamaño de texto en pantallas pequeñas
          fontWeight: "bold",
        }}
      >
        Descarga PDF
      </span>
      {/* Icono al final */}
      <Download sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
    </Button>
  );
};

export default PDFGenerator;
