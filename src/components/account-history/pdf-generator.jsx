import React from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import ErppLogo from '../../../public/ERPP-LOGO-2.png';
import Ser0Logo from '../../../public/sero-logo.png';

const PDFGenerator = ({ data }) => {
  const generatePDF = async () => {
    if (!data || data.length === 0) {
      alert("No hay datos para generar el PDF.");
      return;
    }

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height; // Altura de la página
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

    // Función para convertir una imagen a base64
    const convertImageToBase64 = async (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = (err) => reject(err);
        img.src = url;
      });
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
    doc.text("Información de la Cuenta", 10, 50);

    const accountInfo = [
      [{ content: "Cuenta", styles: { fillColor: [0, 102, 204], textColor: 255, halign: "right", fontStyle: "bold" } }, user.account || "No disponible"],
      [{ content: "Nombre", styles: { fillColor: [0, 102, 204], textColor: 255, halign: "right", fontStyle: "bold" } }, user.owner_name || "No disponible"],
      [{ content: "Servicio", styles: { fillColor: [0, 102, 204], textColor: 255, halign: "right", fontStyle: "bold" } }, user.type_service || "No disponible"],
      [{ content: "Tarifa", styles: { fillColor: [0, 102, 204], textColor: 255, halign: "right", fontStyle: "bold" } }, user.rate_type || "No disponible"],
      [{ content: "Turno", styles: { fillColor: [0, 102, 204], textColor: 255, halign: "right", fontStyle: "bold" } }, user.turn || "No disponible"],
      [{ content: "Serie del Medidor", styles: { fillColor: [0, 102, 204], textColor: 255, halign: "right", fontStyle: "bold" } }, user.meter_series || "No disponible"],
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
    doc.text("Dirección de la Cuenta", 10, currentY);

    const addressInfo = [
      [{ content: "Calle", styles: { fillColor: [0, 102, 204], textColor: 255, halign: "right", fontStyle: "bold" } }, user.street || "No disponible"],
      [{ content: "Número Exterior", styles: { fillColor: [0, 102, 204], textColor: 255, halign: "right", fontStyle: "bold" } }, user.outdoor_number || "No disponible"],
      [{ content: "Número Interior", styles: { fillColor: [0, 102, 204], textColor: 255, halign: "right", fontStyle: "bold" } }, user.interior_number || "No disponible"],
      [{ content: "Colonia", styles: { fillColor: [0, 102, 204], textColor: 255, halign: "right", fontStyle: "bold" } }, user.cologne || "No disponible"],
      [{ content: "Plaza", styles: { fillColor: [0, 102, 204], textColor: 255, halign: "right", fontStyle: "bold" } }, user.square || "No disponible"],
      [{ content: "Lote", styles: { fillColor: [0, 102, 204], textColor: 255, halign: "right", fontStyle: "bold" } }, user.allotment || "No disponible"],
      [{ content: "Entre Calle 1", styles: { fillColor: [0, 102, 204], textColor: 255, halign: "right", fontStyle: "bold" } }, user.between_street_1 || "No disponible"],
      [{ content: "Entre Calle 2", styles: { fillColor: [0, 102, 204], textColor: 255, halign: "right", fontStyle: "bold" } }, user.between_street_2 || "No disponible"],
      [{ content: "Referencia", styles: { fillColor: [0, 102, 204], textColor: 255, halign: "right", fontStyle: "bold" } }, user.reference || "No disponible"],
      [{ content: "Municipio", styles: { fillColor: [0, 102, 204], textColor: 255, halign: "right", fontStyle: "bold" } }, user.town || "No disponible"],
      [{ content: "Código Postal", styles: { fillColor: [0, 102, 204], textColor: 255, halign: "right", fontStyle: "bold" } }, user.postal_code || "No disponible"],
      [{ content: "Latitud", styles: { fillColor: [0, 102, 204], textColor: 255, halign: "right", fontStyle: "bold" } }, user.latitude || "No disponible"],
      [{ content: "Longitud", styles: { fillColor: [0, 102, 204], textColor: 255, halign: "right", fontStyle: "bold" } }, user.longitude || "No disponible"],
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
      doc.text("HISTORIAL DE PAGOS", 10, currentY);
      doc.autoTable({
        startY: currentY + 5,
        head: [["Descripción", "Monto", "Fecha", "Período"]],
        headStyles: { fillColor: [0, 102, 204], textColor: 255 }, // Color azul para encabezados
        body: payments.map((p) => [
          p.description,
          `$${p.amount_paid.toFixed(2)}`,
          p.payment_date.split("T")[0],
          p.payment_period,
        ]),
      });
    }

    // Historial de Deudas
    const debts = JSON.parse(user.debit || "[]");
    if (debts.length > 0) {
      currentY = doc.autoTable.previous.finalY + 10;
      currentY = checkPageSpace(currentY, 50);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("HISTORIAL DE DEUDAS", 10, currentY);
      doc.autoTable({
        startY: currentY + 5,
        head: [["Monto Deuda", "Último Pago", "Fecha Corte"]],
        headStyles: { fillColor: [0, 102, 204], textColor: 255 }, // Color azul para encabezados
        body: debts.map((d) => [
          `$${d.debt_amount.toFixed(2)}`,
          d.last_payment_date ? d.last_payment_date.split("T")[0] : "No disponible",
          d.cutoff_date ? d.cutoff_date.split("T")[0] : "No disponible",
        ]),
      });
    }

    // Historial de Acciones
    const actions = JSON.parse(user.action || "[]");
    if (actions.length > 0) {
      currentY = doc.autoTable.previous.finalY + 10;
      currentY = checkPageSpace(currentY, 50);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("HISTORIAL DE ACCIONES", 10, currentY);
      doc.autoTable({
        startY: currentY + 5,
        head: [["Acción", "Fecha", "Descripción"]],
        headStyles: { fillColor: [0, 102, 204], textColor: 255 }, // Color azul para encabezados
        body: actions.map((a) => [
          a.task_done,
          a.date_capture.split("T")[0],
          a.person_who_capture || "No disponible",
        ]),
      });
    }

    // Sección de Fotos
    const photos = JSON.parse(user.photo || "[]");
    if (photos.length > 0) {
      currentY = doc.autoTable.previous.finalY + 10;
      currentY = checkPageSpace(currentY, 50);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("FOTOS", 10, currentY);

      for (const photo of photos) {
        currentY += 10;
        currentY = checkPageSpace(currentY, 60); // Verificar espacio antes de agregar la imagen

        // Convertir la imagen a base64
        const base64Image = await convertImageToBase64(photo.image_url);

        // Agregar la imagen al PDF
        doc.addImage(base64Image, "PNG", 10, currentY, 50, 50);

        // Agregar información de la foto
        doc.setFontSize(10);
        doc.text(`Tipo: ${photo.image_type || "No disponible"}`, 70, currentY + 10);
        doc.text(`Fecha Captura: ${photo.date_capture || "No disponible"}`, 70, currentY + 20);
        doc.text(`Tarea: ${photo.task_done || "No disponible"}`, 70, currentY + 30);
        doc.text(`Capturado por: ${photo.person_who_capture || "No disponible"}`, 70, currentY + 40);

        currentY += 50; // Espacio entre fotos
      }
    }

    // Guardar el PDF
    doc.save("Historial_de_cuenta.pdf");
  };

  return <button onClick={generatePDF}>Generar PDF</button>;
};

export default PDFGenerator;
