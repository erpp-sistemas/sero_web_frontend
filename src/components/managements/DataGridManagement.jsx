import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Block, Download, Error, Search } from "@mui/icons-material";
import * as ExcelJS from "exceljs";
import ImageViewer from "../viewer/imageViewer";
import { tokens } from "../../theme";
import {
  Button,
  FormControl,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
  Box,
  Tooltip,
  Chip,
  Link,
} from "@mui/material";
import LoadingModal from "../../components/LoadingModal.jsx";


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

  const isJsonString = (str) => {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) && typeof parsed[0] === "object";
    } catch (e) {
      return false;
    }
  };
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

  const renderDynamicCell = (params) => {
    const value = params.value;

    // Si no es un string JSON válido de array de objetos, mostrar valor normal
    if (typeof value !== "string" || !isJsonString(value)) {
      return <Typography noWrap>{String(value)}</Typography>;
    }

    // Parsear el valor porque sí es un array válido
    const values = JSON.parse(value);

    const getMainField = (item) => {
      if (typeof item === "object" && item !== null) {
        return item.inquietud || item.area || "Dato";
      }
      return item;
    };

    const renderTooltipDetail = (item) => {
      if (typeof item === "object" && item !== null) {
        return Object.entries(item)
          .filter(([key]) => !key.toLowerCase().includes("id"))
          .map(([key, val], index) => {
            const stringVal = String(val);

            const isLink =
              stringVal.startsWith("http://") ||
              stringVal.startsWith("https://");

            return (
              <Typography
                key={index}
                variant="body2"
                sx={{ color: colors.grey[100] }}
              >
                <strong
                  style={{
                    color: colors.blueAccent[900],
                    textTransform: "uppercase",
                  }}
                >
                  {key}:
                </strong>{" "}
                {isLink ? (
                  <Link
                    href={stringVal}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{ color: "info.main" }}
                  >
                    {stringVal}
                  </Link>
                ) : (
                  stringVal
                )}
              </Typography>
            );
          });
      }

      return <Typography variant="body2">{String(item)}</Typography>;
    };

    return (
      <Box
        display="flex"
        flexWrap="wrap"
        gap={1}
        sx={{
          whiteSpace: "normal",
          wordBreak: "break-word",
          lineHeight: 1.2,
          py: 1,
        }}
      >
        {values.map((item, index) => (
          <Tooltip
            key={index}
            title={<Box>{renderTooltipDetail(item)}</Box>}
            arrow
            placement="top"
          >
            <Chip
              label={getMainField(item)}
              size="small"
              sx={{
                cursor: "pointer",
                backgroundColor: colors.tealAccent[400],
                color: colors.contentAccentGreen[100],
                fontWeight: "bold",
              }}
            />
          </Tooltip>
        ))}
      </Box>
    );
  };

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

      const isArrayField = normalizedData.some(
        (row) => typeof row[key] === "string" && isJsonString(row[key])
      );

      const finalWidth = isArrayField
        ? 200 // Ancho fijo razonable para chips, dejar espacio para el wrap
        : Math.max(headerWidth, maxCellWidth) + 20;

      return {
        field: key,
        headerName: headerText,
        minWidth: Math.max(100, finalWidth),
        width: finalWidth,
        maxWidth: 600,
        flex: 1,
        renderCell: renderDynamicCell,
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
            {fotos.slice(0, 5).map((photo, index) => (
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
            {fotos.length > 5 && (
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

      const rowsToExportRaw =
        filteredUsers.length > 0 ? filteredUsers : normalizedData;

      // 🔁 Expandir arrays serializados y omitir campos con "id" dentro
      const rowsToExport = rowsToExportRaw.map((entry) => {
        const newEntry = { ...entry };

        for (const key in entry) {
          const value = entry[key];

          if (
            typeof value === "string" &&
            value.trim().startsWith("[") &&
            value.trim().endsWith("]")
          ) {
            try {
              const parsed = JSON.parse(value);
              if (Array.isArray(parsed)) {
                delete newEntry[key];
                parsed.forEach((item, index) => {
                  const filteredItem = Object.fromEntries(
                    Object.entries(item).filter(
                      ([k]) =>
                        !k.toLowerCase().includes("id") &&
                        k.toLowerCase() !== "selected" // 👉 omitimos también "selected"
                    )
                  );
                  const newKey = `${key} ${index + 1}`;
                  newEntry[newKey] = filteredItem;
                });
              }
            } catch (err) {
              // No hacer nada si falla el parseo
            }
          }
        }

        return newEntry;
      });

      // 🧠 Encabezados dinámicos (sin fotos ni campos con "id")
      const allHeadersSet = new Set();
      rowsToExport.forEach((row) => {
        Object.keys(row).forEach((key) => {
          if (
            key !== "fotos" &&
            !key.toLowerCase().includes("id") &&
            !key.toLowerCase().includes("image_user")
          ) {
            const value = row[key];
            if (
              typeof value === "object" &&
              value !== null &&
              !Array.isArray(value)
            ) {
              Object.keys(value).forEach((subKey) => {
                if (!subKey.toLowerCase().includes("id")) {
                  allHeadersSet.add(`${key} - ${subKey}`.toUpperCase());
                }
              });
            } else {
              allHeadersSet.add(key.toUpperCase());
            }
          }
        });
      });

      let dynamicHeaders = Array.from(allHeadersSet);

      // 📸 Revisar fotos
      const maxPhotosPerType = {};
      let hasPhotos = false;
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

      if (hasPhotos) {
        for (const photoType of photoTypes) {
          const photoCount = maxPhotosPerType[photoType] || 0;
          for (let i = 1; i <= photoCount; i++) {
            dynamicHeaders.push(`FOTO DE ${photoType.toUpperCase()} ${i}`);
          }
        }
      }

      const headerRow = worksheet.addRow(
        dynamicHeaders.map((header) => header.replace(/_/g, " "))
      );
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "4F81BD" },
        };
        cell.font = {
          color: { argb: "FFFFFF" },
          bold: true,
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle",
          wrapText: true,
        };
      });

      // 🧾 Agregar datos
      for (const [rowIndex, row] of rowsToExport.entries()) {
        const rowValues = dynamicHeaders.map((header) => {
          const match = header.match(/^(.+?) - (.+)$/);
          if (match) {
            const [_, parentKey, subKey] = match;
            const obj = row[parentKey.toLowerCase()];
            if (obj && typeof obj === "object") {
              return obj[subKey.toLowerCase()] ?? "";
            }
          } else {
            const value = row[header.toLowerCase()];
            if (Array.isArray(value)) {
              return value.join(", ");
            } else if (typeof value === "object" && value !== null) {
              return Object.entries(value)
                .filter(([k]) => !k.toLowerCase().includes("id"))
                .map(([k, v]) => `${k}: ${v}`)
                .join(", ");
            } else {
              return value ?? "";
            }
          }
          return "";
        });

        const excelRow = worksheet.addRow(rowValues);
        worksheet.getRow(rowIndex + 2).height = 75;

        // 🖼️ Insertar imágenes si hay
        if (row.fotos) {
          const photoColumns = {};
          for (const photo of row.fotos) {
            const photoHeaderBase = dynamicHeaders.filter((header) =>
              header.startsWith(`FOTO DE ${photo.type.toUpperCase()}`)
            );
            let colIndex = -1;
            for (let i = 0; i < photoHeaderBase.length; i++) {
              if (!photoColumns[photoHeaderBase[i]]) {
                photoColumns[photoHeaderBase[i]] = true;
                colIndex = dynamicHeaders.indexOf(photoHeaderBase[i]) + 1;
                break;
              }
            }

            if (colIndex !== -1 && photo.imageBase64) {
              const imageId = workbook.addImage({
                base64: photo.imageBase64,
                extension: "jpeg",
              });
              worksheet.addImage(imageId, {
                tl: { col: colIndex - 1, row: rowIndex + 1 },
                ext: { width: 75, height: 75 },
              });
              worksheet.getColumn(colIndex).width = 12;
            }
          }
        }
      }

      // 📐 Ajustar ancho dinámicamente
      dynamicHeaders.forEach((header, i) => {
        let maxLength = header.length;
        worksheet.eachRow((row, rowNumber) => {
          const cell = row.getCell(i + 1);
          const val = cell.value ? cell.value.toString() : "";
          if (val.length > maxLength) maxLength = val.length;
        });
        worksheet.getColumn(i + 1).width = Math.min(maxLength + 2, 100);
      });

      // 💾 Descargar
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
      setShowModalLoading(false);
    }
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
    <div className="w-full text-white">
    <LoadingModal open={showModalLoading} />
      <div className="w-full p-4 rounded-lg shadow-md mb-4">
        <Typography
          variant="h6"
          sx={{
            color: colors.accentGreen[100],
            fontWeight: "bold",
            textTransform: "uppercase",
          }}
        >
          registros encontrados
        </Typography>
        <div className="grid grid-cols-12 gap-4 mb-4 shadow-lg">
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

        <div className="w-full pb-3 rounded-lg shadow-md flex flex-col max-h-[600px] overflow-auto">
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
            autoHeight
            getRowHeight={() => "auto"}
          />
          {/* Modal de visualización de imágenes */}
          {openImageViewer && (
            <ImageViewer
              photos={selectedPhotos} // Asegúrate de pasar las fotos seleccionadas
              open={openImageViewer}
              onClose={() => setOpenImageViewer(false)} // Cerrar el modal
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DataGridManagement;
