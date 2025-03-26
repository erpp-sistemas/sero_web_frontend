import React, { useMemo, useState, useEffect } from "react";
import {
  Typography,
  useTheme,
  Chip,
  Box,
  TextField,
  MenuItem,
  FormControl,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import ColumnsConfig from "../AssignmentManager/DataGridAssignmentAll/buildColumns";
import AssignmentDetailsModal from "../AssignmentManager/DataGridAssignmentAll/AssignmentDetailsModal";

function DataGridAssignmentAll({ data }) {
  console.log(data);
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos para mostrar</p>
    );
  }

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedGestor, setSelectedGestor] = useState(null);
  const [filteredGestor, setFilteredGestor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTareas, setSelectedTareas] = useState([]);
  const [selectedFecha, setSelectedFecha] = useState("todas");

  const uniqueTareas = useMemo(() => {
    const tareas = data.map((item) => item.tarea);
    return [...new Set(tareas)];
  }, [data]);

  const uniqueFechas = useMemo(() => {
    const filteredData =
      selectedTareas.length > 0
        ? data.filter((item) => selectedTareas.includes(item.tarea))
        : data;

    const fechas = filteredData.map((item) => item.fecha_asignacion);
    return ["todas", ...new Set(fechas)];
  }, [data, selectedTareas]);

  const handleTareaClick = (tarea) => {
    setSelectedTareas((prevSelectedTareas) => {
      const newTareas = prevSelectedTareas.includes(tarea)
        ? prevSelectedTareas.filter((t) => t !== tarea)
        : [...prevSelectedTareas, tarea];
      setSelectedFecha("todas"); // Resetear la selección de fecha
      return newTareas;
    });
  };

  const filteredData = useMemo(() => {
    let filtered = data;
    if (selectedTareas.length > 0) {
      filtered = filtered.filter((item) => selectedTareas.includes(item.tarea));
    }
    if (selectedFecha !== "todas") {
      filtered = filtered.filter(
        (item) => item.fecha_asignacion === selectedFecha
      );
    }
    return filtered;
  }, [data, selectedTareas, selectedFecha]);

  const groupedData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return [];
    const result = Object.values(
      filteredData.reduce((acc, item) => {
        const { gestor, imagen_usuario, id_estatus_asignacion } = item;
        if (!acc[gestor]) {
          acc[gestor] = {
            gestor,
            imagen_usuario,
            total_cuentas: 0,
            total_cuentas_activas: 0,
            total_cuentas_inactivas: 0,
          };
        }
        acc[gestor].total_cuentas += 1;
        if (id_estatus_asignacion === 1) {
          acc[gestor].total_cuentas_activas += 1;
        } else {
          acc[gestor].total_cuentas_inactivas += 1;
        }
        return acc;
      }, {})
    ).sort((a, b) => b.total_cuentas - a.total_cuentas);
    return result;
  }, [filteredData]);

  const columns = ColumnsConfig({ onViewDetails: setSelectedGestor });

  useEffect(() => {
    if (selectedGestor) {
      setIsModalOpen(true);
      const filteredData = data.filter(
        (item) => item.gestor === selectedGestor.gestor
      );
      setFilteredGestor(filteredData);
      console.log(filteredData);
    } else {
      setIsModalOpen(false);
    }
  }, [selectedGestor]);

  return (
    <div className="w-full text-white">
      <div className="w-full rounded-lg shadow-md">
        <div className="w-full p-3 rounded-lg shadow-md">
          <Typography
            variant="h6"
            sx={{
              color: colors.accentGreen[100],
              fontWeight: "bold",
              textTransform: "uppercase",
              paddingBottom: 1,
            }}
          >
            Selecciona las tareas a buscar
          </Typography>
          <div className="flex flex-wrap gap-2">
            {uniqueTareas.map((tarea) => (
              <Chip
                key={tarea}
                label={tarea}
                clickable
                onClick={() => handleTareaClick(tarea)}
                sx={{
                  backgroundColor: selectedTareas.includes(tarea)
                    ? colors.accentGreen[100]
                    : "default",
                  color: selectedTareas.includes(tarea)
                    ? colors.contentAccentGreen[100]
                    : "inherit",
                  "&:hover": {
                    backgroundColor: selectedTareas.includes(tarea)
                      ? colors.accentGreen[200]
                      : "default",
                  },
                }}
              />
            ))}
          </div>
        </div>

        <div className="w-full p-3 rounded-lg shadow-md">
          <Typography
            variant="h6"
            sx={{
              color: colors.accentGreen[100],
              fontWeight: "bold",
              textTransform: "uppercase",
            }}
          >
            Selecciona las tareas a buscar
          </Typography>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Selector de Fechas */}
            <FormControl fullWidth>
              <TextField
              size="small"
              labelId="place-select-label"
              id="place-select"
                select
                fullWidth
                label="Selecciona una fecha"
                value={selectedFecha}
                onChange={(e) => setSelectedFecha(e.target.value)}
                displayEmpty
                sx={{ marginTop: 2 }}
              >
                {uniqueFechas.map((fecha) => (
                  <MenuItem key={fecha} value={fecha}>
                    {fecha === "todas" ? "Todas las fechas" : fecha}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </div>
        </div>
        <div className="w-full pb-3 rounded-lg shadow-md flex flex-col max-h-[600px] overflow-auto">
          <DataGrid
            rows={groupedData}
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
                fontSize: "14px",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: colors.accentGreen[100],
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
              },
              "& .MuiDataGrid-footerContainer": {
                borderBottomLeftRadius: "8px",
                borderBottomRightRadius: "8px",
                backgroundColor: colors.accentGreen[100],
                color: colors.contentSearchButton[100],
              },
              "& .MuiTablePagination-root": {
                color: colors.contentSearchButton[100],
              },
              "& .MuiDataGrid-columnHeaders .MuiSvgIcon-root, .MuiDataGrid-footerContainer .MuiSvgIcon-root":
                {
                  color: colors.contentSearchButton[100],
                },
              "& .MuiDataGrid-cell .MuiSvgIcon-root": {
                color: "inherit",
              },
            }}
          />
        </div>
      </div>
      <AssignmentDetailsModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedGestor={selectedGestor}
        setSelectedGestor={setSelectedGestor}
        filteredGestor={filteredGestor}
      />
    </div>
  );
}

export default DataGridAssignmentAll;
