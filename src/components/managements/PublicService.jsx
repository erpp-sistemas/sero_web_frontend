import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  useTheme,
  Button,
} from "@mui/material";
import { tokens } from "../../theme";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic2lzdGVtYXMyMzEyIiwiYSI6ImNsdThuaGczYTAwcnoydG54dG05OGxocXgifQ.J6tkaSWvRwfhXfiHoXzGFQ";

const getRandomColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

function PublicService({ data }) {

  console.log(data)
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos para mostrar</p>
    );
  }

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Contar la cantidad de incidencias (múltiples incidencias por registro)
  const incidenceCount = data.reduce((acc, item) => {
    const incidences = JSON.parse(item.tipo_incidencia || "[]");
    incidences.forEach((incidence) => {
      acc[incidence] = (acc[incidence] || 0) + 1;
    });
    return acc;
  }, {});

  // Calcular el total de incidencias y el porcentaje
  const totalIncidences = Object.values(incidenceCount).reduce(
    (sum, count) => sum + count,
    0
  );
  const incidencePercentage = Object.entries(incidenceCount).map(
    ([key, value]) => ({
      incidence: key,
      count: value,
      percentage: ((value / totalIncidences) * 100).toFixed(2),
    })
  );

  // Ordenar por porcentaje descendente
  const sortedIncidences = incidencePercentage.sort(
    (a, b) => b.percentage - a.percentage
  );

  // Calcular indicadores
  const totalRecords = data.length;

  // Contar incidencias por usuario considerando múltiples incidencias por registro
  const mostActiveUsers = data.reduce((acc, item) => {
    const incidences = JSON.parse(item.tipo_incidencia || "[]");
    incidences.forEach((incidence) => {
      acc[item.usuario] = (acc[item.usuario] || 0) + 1;
    });
    return acc;
  }, {});

  // Calcular el porcentaje de incidencias para cada usuario
  const sortedActiveUsers = Object.entries(mostActiveUsers)
    .map(([user, count]) => {
      const userIncidences = data.filter((item) => item.usuario === user);
      const userIncidenceCount = userIncidences.reduce((acc, item) => {
        const incidences = JSON.parse(item.tipo_incidencia || "[]");
        incidences.forEach((incidence) => {
          acc[incidence] = (acc[incidence] || 0) + 1;
        });
        return acc;
      }, {});

      const userTotalIncidences = Object.values(userIncidenceCount).reduce(
        (sum, count) => sum + count,
        0
      );
      const userPercentage = (
        (userTotalIncidences / totalIncidences) *
        100
      ).toFixed(2);

      return {
        user,
        count,
        percentage: userPercentage,
      };
    })
    .sort((a, b) => b.count - a.count);

  const lastCaptureDate = data.reduce(
    (latest, item) =>
      new Date(item.fecha_captura) > new Date(latest)
        ? item.fecha_captura
        : latest,
    data[0].fecha_captura
  );

  const [filteredData, setFilteredData] = useState([]);
  const [incidenceColors, setIncidenceColors] = useState({});
  const [selectedIncidence, setSelectedIncidence] = useState(null);
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markers = useRef([]); // Ref para almacenar los marcadores

  // Inicialización del mapa solo una vez
  useEffect(() => {
    if (data.length > 0) {
      const uniqueColors = {};
      data.forEach((item) => {
        JSON.parse(item.tipo_incidencia || "[]").forEach((incidence) => {
          if (!uniqueColors[incidence]) {
            uniqueColors[incidence] = getRandomColor();
          }
        });
      });
      setIncidenceColors(uniqueColors);

      // Calcular cuál incidencia tiene más posiciones
      const incidenceCounts = {};

      data.forEach((item) => {
        JSON.parse(item.tipo_incidencia || "[]").forEach((incidence) => {
          if (!incidenceCounts[incidence]) {
            incidenceCounts[incidence] = 0;
          }
          if (hasValidPosition(item)) {
            incidenceCounts[incidence]++;
          }
        });
      });

      // Encontrar la incidencia con más posiciones válidas
      const mostIncidence = Object.keys(incidenceCounts).reduce((a, b) =>
        incidenceCounts[a] > incidenceCounts[b] ? a : b
      );

      setSelectedIncidence(mostIncidence); // Selecciona la incidencia con más posiciones válidas
      const filtered = data.filter((item) =>
        JSON.parse(item.tipo_incidencia || "[]").includes(mostIncidence)
      );
      setFilteredData(filtered);
    }

    // Verificar si ya existe mapInstance antes de crear uno nuevo
    if (mapContainer.current && !mapInstance.current) {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      mapInstance.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-99.1332, 19.4326],
        zoom: 15,   // Nivel de zoom predeterminado
        minZoom: 15,  // Limitar el zoom mínimo
        maxZoom: 18, // Limitar el zoom máximo
      });
      

      mapInstance.current.on("load", () => {
        console.log("Mapa cargado correctamente.");
      });
    }

    return () => {
      // Limpiar recursos cuando el componente se desmonta
      if (mapInstance.current) {
        markers.current.forEach(marker => marker.remove()); // Eliminar marcadores
        markers.current = [];
        mapInstance.current.remove(); // Remover el mapa
        mapInstance.current = null; // Evitar referencias persistentes
      }
    };
  }, [data]);

  // Manejo de los marcadores
  useEffect(() => {
    if (mapInstance.current && filteredData.length > 0) {
      markers.current.forEach((marker) => marker.remove()); // Limpiar marcadores anteriores
      markers.current = []; // Limpiar lista de marcadores
  
      filteredData.forEach((item) => {
        const incidence = JSON.parse(item.tipo_incidencia || "[]")[0];
        const marker = new mapboxgl.Marker({
          color: incidenceColors[incidence],
        })
          .setLngLat([parseFloat(item.longitud), parseFloat(item.latitud)])
          .addTo(mapInstance.current);
  
        markers.current.push(marker); // Agregar el marcador a la lista de marcadores
      });
  
      // Centrar el mapa según las posiciones de las incidencias
      const positions = filteredData
        .map((item) => [parseFloat(item.longitud), parseFloat(item.latitud)])
        .filter(([lon, lat]) => lat !== 0 && lon !== 0);
  
      if (positions.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        positions.forEach((position) => bounds.extend(position));
  
        // Ajustar el mapa a los límites, pero sin hacer un zoom demasiado cercano
        mapInstance.current.fitBounds(bounds, {
          padding: 20,
          maxZoom: 10,  // Limitar el zoom máximo
          minZoom: 5,   // Limitar el zoom mínimo
          duration: 1000,  // Duración de la animación (en milisegundos)
        });
      }
    }
  }, [filteredData, incidenceColors]); // Solo ejecutar si los datos o los colores cambian

  const handleFilter = (incidence) => {
    if (selectedIncidence === incidence) {
      setFilteredData(data);
      setSelectedIncidence(null);
    } else {
      const filtered = data.filter((item) =>
        JSON.parse(item.tipo_incidencia || "[]").includes(incidence)
      );
      setFilteredData(filtered);
      setSelectedIncidence(incidence);
    }
  };

  // Función para verificar si una incidencia tiene posiciones válidas
  const hasValidPosition = (item) => {
    const positions = JSON.parse(item.tipo_incidencia || "[]");
    return positions.some(
      (pos) => parseFloat(item.latitud) !== 0 && parseFloat(item.longitud) !== 0
    );
  };

  return (
    <div className="grid grid-cols-12 gap-4 p-4">
      {/* Sección de tablas (6 columnas) */}
      <div className="col-span-12 md:col-span-6 space-y-6">
        {/* Indicadores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-6">
            <div>
              <h3 className="text-white text-3xl font-bold">
                {totalRecords.toLocaleString()}
              </h3>
              <p className="text-base text-gray-300 mt-2">Gestiones</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <h3 className="text-white text-3xl font-bold">
                {totalIncidences.toLocaleString()}
              </h3>
              <p className="text-base text-gray-300 mt-2">
                Total de Incidencias
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <h3 className="text-white text-3xl font-bold">
                {new Date(lastCaptureDate).toLocaleDateString()}
              </h3>
              <p className="text-base text-gray-300 mt-2">
                Última Fecha de Captura
              </p>
            </div>
          </div>
        </div>

        {/* Tabla de incidencias */}
        <div>
          <Typography
            variant="h6"
            sx={{
              color: colors.accentGreen[100],
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Incidencias
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "8px",
              boxShadow: 3,
              padding: 0,
              background: "rgba(128, 128, 128, 0.1)",
              maxHeight: 300,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: colors.accentGreen[100],
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                  }}
                >
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Tipo de Incidencia
                  </TableCell>
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Cantidad
                  </TableCell>
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Porcentaje
                  </TableCell>
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Acciones
                  </TableCell>
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Color
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedIncidences.map(({ incidence, count, percentage }) => (
                  <TableRow
                    key={incidence}
                    className={
                      selectedIncidence === incidence ? "bg-gray-300" : ""
                    }
                  >
                    <TableCell
                      sx={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: selectedIncidence === incidence ? "gray" : "",
                      }}
                    >
                      {incidence}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: selectedIncidence === incidence ? "gray" : "",
                      }}
                    >
                      {count}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: selectedIncidence === incidence ? "gray" : "",
                      }}
                    >
                      {percentage}%
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleFilter(incidence)}
                        disabled={
                          !data.some(
                            (item) =>
                              item.tipo_incidencia.includes(incidence) &&
                              hasValidPosition(item)
                          )
                        } // Desactivar el botón si no tiene posiciones válidas
                      >
                        Ver posiciones
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: incidenceColors[incidence] }}
                      ></div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Tabla de usuarios más activos */}
        <div>
          <Typography
            variant="h6"
            sx={{
              color: colors.accentGreen[100],
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Gestores
          </Typography>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: "8px",
              boxShadow: 3,
              padding: 0,
              background: "rgba(128, 128, 128, 0.1)",
              maxHeight: 300,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: colors.accentGreen[100],
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                  }}
                >
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Usuario
                  </TableCell>
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Cantidad de Incidencias
                  </TableCell>
                  <TableCell
                    sx={{
                      color: colors.contentSearchButton[100],
                      fontWeight: "bold",
                      textTransform: "uppercase",
                    }}
                  >
                    Porcentaje de Incidencias
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedActiveUsers.map(({ user, count, percentage }) => (
                  <TableRow key={user}>
                    <TableCell sx={{ fontSize: "14px", fontWeight: "bold" }}>
                      {user}
                    </TableCell>
                    <TableCell sx={{ fontSize: "14px", fontWeight: "bold" }}>
                      {count}
                    </TableCell>
                    <TableCell sx={{ fontSize: "14px", fontWeight: "bold" }}>
                      {percentage}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>

      {/* Sección del mapa (6 columnas) */}
      <div className="col-span-12 md:col-span-6 flex items-center justify-center">
        <div className="w-full h-full border-2 border-gray-400 flex items-center justify-center text-gray-600">
          <div
            className="col-span-12 md:col-span-6"
            ref={mapContainer}
            style={{ width: "100%", height: "500px" }}
          />
        </div>
      </div>
    </div>
  );
}

export default PublicService;
