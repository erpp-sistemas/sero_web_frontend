import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Block, Download, Error, Search } from "@mui/icons-material";
import * as ExcelJS from "exceljs";
// import Loading from "../../components/modals/loading";
import ImageViewer from "../viewer/imageViewer";
import { useSelector } from "react-redux";
import { tokens } from "../../theme";
import {
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

const DataGridManagement = ({ data }) => {
  
  if (!data || data.length === 0) {
    return <p>No hay datos para mostrar</p>;
  }

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showModalLoading, setShowModalLoading] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [openImageViewer, setOpenImageViewer] = useState(false); // Estado para controlar la visibilidad del visor de imágenes
  const [themeColor, setThemeColor] = useState("");

  // Obtener los diferentes tipos de fotos y crear columnas dinámicamente
  const photoTypes = new Set();
  data.forEach((row) => {
    if (row.fotos) {
      row.fotos.forEach((photo) => {
        if (photo.type) {
          photoTypes.add(photo.type);
        }
      });
    }
  });

  // Crear columnas para cada tipo de foto
  const getTextWidth = (text, font = "14px Arial") => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    return context.measureText(text).width;
  };

  // Obtener todos los campos únicos de todos los objetos en `data`
  const allKeys = Array.from(new Set(data.flatMap(Object.keys)));

  // Normalizar los datos para asegurarse de que cada objeto tenga todos los campos
  // Normalizar los datos para asegurarse de que cada objeto tenga todos los campos
  const normalizedData = data.map((item) => {
    const newItem = {};
    allKeys.forEach((key) => {
      let value = item[key] !== undefined ? item[key] : "";

      // Si el campo es "fecha_captura", eliminar "T" y "Z"
      if (key === "fecha_captura" && typeof value === "string") {
        value = value.split(".")[0].replace("T", " ");
      }

      newItem[key] = value;
    });
    return newItem;
  });

  const columns = allKeys
  .filter(
    (key) => 
      key !== "id" && // Omitir si es exactamente "id"
      !key.startsWith("id_") && // Omitir si empieza con "id_"
      key !== "fotos" &&
      key !== "image_user"
  )
    .map((key) => {
      const headerText = key.replace(/_/g, " ").toUpperCase();
      const headerWidth = getTextWidth(headerText, "bold 16px Arial");

      const maxCellWidth = Math.max(
        ...normalizedData.map((row) =>
          getTextWidth(row[key]?.toString() || "", "14px Arial")
        )
      );

      const finalWidth = Math.max(headerWidth, maxCellWidth) + 20;

      return {
        field: key,
        headerName: headerText,
        minWidth: Math.max(100, finalWidth),
        width: finalWidth,
        maxWidth: 600,
        flex: 1,
      };
    });

  // Ordenar las columnas para asegurarse de que latitud y longitud estén seguidas
  columns.sort((a, b) => {
    if (a.field === "latitud" && b.field === "longitud") return -1;
    if (a.field === "longitud" && b.field === "latitud") return 1;
    return 0;
  });

  // Agregar columnas para cada tipo de foto
  Array.from(photoTypes).forEach((type) => {
    columns.push({
      field: type,
      headerName: type.toUpperCase(),
      flex: 2,
      minWidth: 150,
      renderCell: (params) => {
        const fotos = params.row.fotos.filter((photo) => photo.type === type);
        if (!fotos || fotos.length === 0) {
          return (
            <div className="font-[sans-serif] flex flex-col gap-4 items-center mx-auto justify-center h-full">
              <div className="flex justify-center items-center">
                <Block className="text-gray-500" style={{ fontSize: "24px" }} />{" "}
                {/* Icono de bloqueo */}
              </div>
            </div>
          );
        }
        return (
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {fotos.slice(0, 3).map((photo, index) => (
              <img
                key={index}
                src={photo.urlImage}
                alt={`Foto ${index + 1}`}
                className="w-12 h-12 object-cover rounded-lg border border-gray-300 cursor-pointer"
                onClick={() => {
                  setSelectedPhotos([photo]);
                  setOpenImageViewer(true);
                }}
              />
            ))}
            {fotos.length > 3 && (
              <span style={{ color: "#888", fontSize: "12px" }}>
                +{fotos.length - 3} más
              </span>
            )}
          </div>
        );
      },
    });
  });

  const handleDownload = async () => {
    try {
      setShowModalLoading(true);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Registros Encontrados");

      // Generar encabezados dinámicos
      const baseHeaders = Object.keys(normalizedData[0])
        .filter((header) => header !== "fotos")
        .map((header) => header.toUpperCase());
      let dynamicHeaders = [...baseHeaders];
      const maxPhotosPerType = {};

      // Filtrar las filas a exportar
      const rowsToExport =
        filteredUsers.length > 0 ? filteredUsers : normalizedData;

      // Comprobar si hay fotos en alguna de las filas
      let hasPhotos = false;

      // Determinar cuántas fotos hay por tipo para cada fila
      for (const row of rowsToExport) {
        if (row.fotos) {
          hasPhotos = true;
          for (const photoType of photoTypes) {
            const count = row.fotos.filter(
              (photo) => photo.type === photoType
            ).length;
            maxPhotosPerType[photoType] = Math.max(
              maxPhotosPerType[photoType] || 0,
              count
            );
          }
        }
      }

      // Si hay fotos, agregamos los encabezados dinámicos para cada tipo de foto
      if (hasPhotos) {
        for (const photoType of photoTypes) {
          const photoCount = maxPhotosPerType[photoType] || 0;
          if (photoCount > 0) {
            for (let i = 1; i <= photoCount; i++) {
              dynamicHeaders.push(`FOTO DE ${photoType.toUpperCase()} ${i}`);
            }
          }
        }

        /// Aplicar estilo a los encabezados
        const headerRow = worksheet.addRow(dynamicHeaders);
        headerRow.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: themeColor.replace("#", "") },
          };
          cell.font = {
            color: { argb: "000000" }, // Letra blanca
            bold: true,
          };
          cell.alignment = { horizontal: "center", vertical: "middle" }; // Centrado
        });

        // Procesar filas
        for (const [rowIndex, row] of rowsToExport.entries()) {
          const rowValues = dynamicHeaders.map((header) =>
            baseHeaders.includes(header) ? row[header.toLowerCase()] : null
          );
          const excelRow = worksheet.addRow(rowValues);

          // Ajustar altura de fila para imágenes
          worksheet.getRow(rowIndex + 2).height = 75;

          if (row.fotos) {
            const photoColumns = {};

            for (const photo of row.fotos) {
              // Encontrar la siguiente columna disponible para este tipo de foto
              const photoHeaderBase = dynamicHeaders.filter((header) =>
                header.startsWith(`FOTO DE ${photo.type.toUpperCase()}`)
              );
              let colIndex = -1;

              for (let i = 0; i < photoHeaderBase.length; i++) {
                if (!photoColumns[photoHeaderBase[i]]) {
                  photoColumns[photoHeaderBase[i]] = true;
                  colIndex = dynamicHeaders.indexOf(photoHeaderBase[i]) + 1; // Índice de columna en Excel
                  break;
                }
              }

              if (colIndex !== -1) {
                const base64 = await urlToBase64(photo.urlImage);

                const imageId = workbook.addImage({
                  base64: base64,
                  extension: "jpeg",
                });

                worksheet.addImage(imageId, {
                  tl: { col: colIndex - 1, row: rowIndex + 1 },
                  ext: { width: 75, height: 75 },
                });

                // Ajustar ancho de columna
                worksheet.getColumn(colIndex).width = 12;
              }
            }
          }
        }
      } else {
        // Si no hay fotos, solo agregamos las filas sin fotos
        worksheet.addRow(baseHeaders); // Solo encabezados base sin fotos
        // Procesar filas sin fotos
        for (const row of rowsToExport) {
          const rowValues = baseHeaders.map((header) => row[header]);
          worksheet.addRow(rowValues);
        }
      }

      // Ajustar ancho de columnas basado en el contenido o el encabezado
      worksheet.columns = dynamicHeaders.map((header) => {
        const maxLength = Math.max(
          header.length,
          ...rowsToExport.map((row) =>
            row[header.toLowerCase()]
              ? row[header.toLowerCase()].toString().length
              : 0
          )
        );
        return { width: maxLength + 2 }; // Añadir un margen
      });

      // Guardar archivo Excel
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reportes.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar el archivo Excel:", error);
    } finally {
      //setShowModalLoading(false);
    }
  };

  // Función para convertir la imagen a Base64 utilizando html2canvas
  const convertToBase64 = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("Error al convertir la imagen a Base64:", error);
      throw new Error("Error al convertir la imagen a Base64.");
    }
  };

  // Función para convertir una URL de imagen a base64
  const urlToBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (!value) {
      setFilteredUsers(normalizedData);
      setNoResults(false);
      return;
    }

    const matchingUsers = normalizedData.filter((data_grid) => {
      return Object.values(data_grid).some(
        (fieldValue) =>
          fieldValue && fieldValue.toString().toLowerCase().includes(value)
      );
    });

    if (matchingUsers.length === 0) {
      setFilteredUsers([]);
      setNoResults(true);
    } else {
      setFilteredUsers(matchingUsers);
      setNoResults(false);
    }
  };

  return (
    <div className="font-[sans-serif]">
      {/* Contenedor para el input de búsqueda y el botón */}
      {/* <Loading open={showModalLoading} /> */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-4">
          <div>
            <FormControl fullWidth>
              <TextField
                fullWidth
                value={searchTerm}
                onChange={handleChange}
                color="secondary"
                size="small"
                placeholder="Ingresa tu búsqueda"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search color="secondary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "20px", // Bordes redondeados
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: colors.accentGreen[100], // Color predeterminado del borde
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "accent.light", // Color al pasar el mouse
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "accent.dark", // Color al enfocar
                    },
                  },
                }}
              />

              {noResults && (
                <p className="text-xs text-red-500 flex items-center mt-2">
                  <Error />
                  No se encontraron resultados
                </p>
              )}
            </FormControl>
          </div>
        </div>
        <div className="col-span-2">
          <Button
            variant="contained"
            color="info"
            onClick={handleDownload}
            endIcon={<Download />}
            fullWidth
            sx={{
              borderRadius: "35px",
              color: "white",
            }}
          >
            Exportar
          </Button>
        </div>
        {/* Las 6 columnas restantes se quedan vacías */}
        <div className="col-span-6"></div>
      </div>

      {/* DataGrid */}
      <div
        style={{
          height: "auto",
          maxHeight: 800,
          minHeight: 400,
          width: "100%",
        }}
      >
        <DataGrid
          rows={
            filteredUsers.length > 0 || searchTerm
              ? filteredUsers
              : normalizedData
          }
          columns={columns.map((column) => ({
            ...column,
            renderHeader: () => (
              <Typography
                sx={{
                  color: colors.contentSearchButton[100],
                  fontWeight: "bold",
                }}
              >
                {column.headerName}
              </Typography>
            ),
          }))}
          getRowId={(row) => row.id || Math.random()}
          disableSelectionOnClick
          sx={{
            borderRadius: "8px",
            boxShadow: 3,
            padding: 0,
            background: "rgba(128, 128, 128, 0.1)",
            "& .MuiDataGrid-cell": {
              fontSize: "14px", // Cambia el tamaño de la letra en todas las celdas
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.accentGreen[100], // Color de fondo deseado
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
            },
            "& .MuiDataGrid-footerContainer": {
              borderBottomLeftRadius: "8px",
              borderBottomRightRadius: "8px",
              backgroundColor: colors.accentGreen[100], // Fondo del footer (paginador)
              color: colors.contentSearchButton[100], // Color de texto dentro del footer
            },
            "& .MuiTablePagination-root": {
              color: colors.contentSearchButton[100], // Color del texto del paginador
            },
            // Estilos específicos para los íconos en el encabezado y pie de página
            "& .MuiDataGrid-columnHeaders .MuiSvgIcon-root, .MuiDataGrid-footerContainer .MuiSvgIcon-root":
              {
                color: colors.contentSearchButton[100], // Color de los íconos (flechas)
              },
            // Evitar que los íconos en las celdas se vean afectados
            "& .MuiDataGrid-cell .MuiSvgIcon-root": {
              color: "inherit", // No afectar el color de los íconos en las celdas
            },
          }}
        />
      </div>

      {/* Modal de visualización de imágenes */}
      {openImageViewer && (
        <ImageViewer
          photos={selectedPhotos} // Asegúrate de pasar las fotos seleccionadas
          open={openImageViewer}
          onClose={() => setOpenImageViewer(false)} // Cerrar el modal
        />
      )}
    </div>
  );
};

export default DataGridManagement;
