import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  useTheme,
  Box,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import clsx from "clsx";
import { tokens } from "../../theme";
import AssignedPlacesSummaryModal from "./AssignedPlacesStep/AssignedPlacesSummaryModal";
import useFormulario from "../../hooks/useFormulario";

const AssignedPlacesStep = ({
  mode = "create",
  initialValues = {},
  onChange,
}) => {
  const user = useSelector((state) => state.user);
  const placeServiceProcess = user.place_service_process;
  const [openSummaryModal, setOpenSummaryModal] = useState(false);

  const [formData, setFormData] = useState({
    plazas: [],
    ...initialValues,
  });

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [selectedData, setSelectedData] = useState([]);
  const [selectedPlazaId, setSelectedPlazaId] = useState(null);
  const [selectedServicioId, setSelectedServicioId] = useState(null);

  const { guardarSeccion } = useFormulario();

  useEffect(() => {
  if (mode === "edit" && initialValues?.plazas?.length > 0) {
    setSelectedData(initialValues.plazas);
  }
}, [mode, initialValues]);

  const isPlazaSelected = (plazaId) =>
    selectedData.some((p) => p.id_plaza === plazaId);

  const isServicioSelected = (plazaId, servicioId) =>
    selectedData
      .find((p) => p.id_plaza === plazaId)
      ?.servicios?.some((s) => s.id_servicio === servicioId);

  const isProcesoSelected = (plazaId, servicioId, procesoId) =>
    selectedData
      .find((p) => p.id_plaza === plazaId)
      ?.servicios?.find((s) => s.id_servicio === servicioId)
      ?.procesos?.some((pr) => pr.id_proceso === procesoId);

  const handleProcesoToggle = (plaza, servicio, proceso, checked) => {
    setSelectedData((prev) => {
      const updated = [...prev];
      const plazaIdx = updated.findIndex((p) => p.id_plaza === plaza.id_plaza);

      if (checked) {
        if (plazaIdx === -1) {
          updated.push({
            id_plaza: plaza.id_plaza,
            nombre_plaza: plaza.nombre_plaza,
            servicios: [
              {
                id_servicio: servicio.id_servicio,
                nombre_servicio: servicio.nombre_servicio,
                procesos: [proceso],
              },
            ],
          });
        } else {
          const servicioIdx = updated[plazaIdx].servicios.findIndex(
            (s) => s.id_servicio === servicio.id_servicio
          );

          if (servicioIdx === -1) {
            updated[plazaIdx].servicios.push({
              id_servicio: servicio.id_servicio,
              nombre_servicio: servicio.nombre_servicio,
              procesos: [proceso],
            });
          } else {
            const procesoIdx = updated[plazaIdx].servicios[servicioIdx].procesos.findIndex(
              (p) => p.id_proceso === proceso.id_proceso
            );
            if (procesoIdx === -1) {
              updated[plazaIdx].servicios[servicioIdx].procesos.push(proceso);
            }
          }
        }
      } else {
        if (plazaIdx !== -1) {
          const servicioIdx = updated[plazaIdx].servicios.findIndex(
            (s) => s.id_servicio === servicio.id_servicio
          );

          if (servicioIdx !== -1) {
            updated[plazaIdx].servicios[servicioIdx].procesos = updated[plazaIdx].servicios[servicioIdx].procesos.filter(
              (p) => p.id_proceso !== proceso.id_proceso
            );

            if (updated[plazaIdx].servicios[servicioIdx].procesos.length === 0) {
              updated[plazaIdx].servicios.splice(servicioIdx, 1);
            }

            if (updated[plazaIdx].servicios.length === 0) {
              updated.splice(plazaIdx, 1);
            }
          }
        }
      }

      return updated;
    });
  };

  const handleServicioToggle = (plaza, servicio, checked) => {
    servicio.procesos.forEach((proceso) =>
      handleProcesoToggle(plaza, servicio, proceso, checked)
    );
  };

  const handlePlazaToggle = (plaza, checked) => {
    plaza.servicios.forEach((servicio) =>
      servicio.procesos.forEach((proceso) =>
        handleProcesoToggle(plaza, servicio, proceso, checked)
      )
    );
  };

  const plazaColumns = [
    {
      field: "nombre_plaza",
      headerName: "Plaza",
      flex: 1,
      cellClassName: (params) =>
        selectedPlazaId === params.row.id_plaza
          ? "bg-green-300 text-indigo-800 font-bold text-xl rounded-r-lg "
          : "",
    },
    {
      field: "acciones",
      headerName: "Asignar",
      width: 100,
      renderCell: (params) => (
        <FormControlLabel
          control={
            <Switch
              checked={isPlazaSelected(params.row.id_plaza)}
              onChange={(e) => handlePlazaToggle(params.row, e.target.checked)}
              color="secondary"
            />
          }
        />
      ),
    },
  ];

  const servicioRows =
    placeServiceProcess
      .find((p) => p.id_plaza === selectedPlazaId)
      ?.servicios.map((s) => ({
        ...s,
        plazaId: selectedPlazaId,
      })) || [];

  const servicioColumns = [
    {
      field: "nombre_servicio",
      headerName: "Servicio",
      flex: 1,
      cellClassName: (params) =>
        clsx({
          "bg-green-300 text-indigo-800 font-bold text-xl rounded-r-lg":
            selectedServicioId === params.row.id_servicio,
        }),
    },
    {
      field: "acciones",
      headerName: "Asignar",
      width: 100,
      renderCell: (params) => {
        const plaza = placeServiceProcess.find(
          (p) => p.id_plaza === params.row.plazaId
        );
        return (
          <FormControlLabel
            control={
              <Switch
                checked={isServicioSelected(
                  plaza.id_plaza,
                  params.row.id_servicio
                )}
                onChange={(e) =>
                  handleServicioToggle(plaza, params.row, e.target.checked)
                }
                color="secondary"
              />
            }
          />
        );
      },
    },
  ];

  const procesoRows =
    servicioRows
      .find((s) => s.id_servicio === selectedServicioId)
      ?.procesos.map((p) => ({
        ...p,
        plazaId: selectedPlazaId,
        servicioId: selectedServicioId,
      })) || [];

  const procesoColumns = [
    {
      field: "nombre_proceso",
      headerName: "Proceso",
      flex: 1,
    },
    {
      field: "acciones",
      headerName: "Asignar",
      width: 100,
      renderCell: (params) => {
        const plaza = placeServiceProcess.find(
          (p) => p.id_plaza === params.row.plazaId
        );
        const servicio = plaza.servicios.find(
          (s) => s.id_servicio === params.row.servicioId
        );
        return (
          <FormControlLabel
            control={
              <Switch
                checked={isProcesoSelected(
                  plaza.id_plaza,
                  servicio.id_servicio,
                  params.row.id_proceso
                )}
                onChange={(e) =>
                  handleProcesoToggle(
                    plaza,
                    servicio,
                    params.row,
                    e.target.checked
                  )
                }
                color="secondary"
              />
            }
          />
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Typography variant="h6">Plaza, Servicios y Procesos</Typography>
      <Divider />
      <div className="grid grid-cols-3 gap-4">
        <div>
          <Typography variant="subtitle2">Plazas</Typography>
          <DataGrid
            autoHeight
            rows={placeServiceProcess}
            columns={plazaColumns}
            getRowId={(row) => row.id_plaza}
            onRowClick={(params) => {
              setSelectedPlazaId(params.row.id_plaza);
              setSelectedServicioId(null);
            }}
            hideFooter
          />
        </div>
        <div>
          <Typography variant="subtitle2">Servicios</Typography>
          <DataGrid
            autoHeight
            rows={servicioRows}
            columns={servicioColumns}
            getRowId={(row) => row.id_servicio}
            onRowClick={(params) => {
              setSelectedServicioId(params.row.id_servicio);
            }}
            hideFooter
          />
        </div>
        <div>
          <Typography variant="subtitle2">Procesos</Typography>
          <DataGrid
            autoHeight
            rows={procesoRows}
            columns={procesoColumns}
            getRowId={(row) => row.id_proceso}
            hideFooter
          />
        </div>
      </div>
      <div className="mt-6">
        <Typography variant="subtitle1" gutterBottom>
          Resumen de elementos asignados:
        </Typography>
        <div className=" p-4 rounded max-h-64 overflow-auto text-sm">
          {selectedData.length === 0 ? (
            <Typography color="textSecondary">
              No hay asignaciones aún.
            </Typography>
          ) : (
            selectedData.map((plaza) => (
              <div key={plaza.id_plaza} className="mb-2">
                <Typography variant="subtitle2" color="info">
                  🏢 Plaza: {plaza.nombre_plaza}
                </Typography>
                {plaza.servicios.map((servicio) => (
                  <div key={servicio.id_servicio} className="ml-4 mb-1">
                    <Typography variant="body2" color="secondary">
                      🛠️ Servicio: {servicio.nombre_servicio}
                    </Typography>
                    <ul className="ml-6 list-disc">
                      {servicio.procesos.map((proceso) => (
                        <li key={proceso.id_proceso}>
                          🔄 Proceso: {proceso.nombre_proceso}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (selectedData.length > 0) {
              setOpenSummaryModal(true);
            }
          }}
          disabled={selectedData.length === 0}
        >
          Guardar
        </Button>
      </Box>
      <AssignedPlacesSummaryModal
        open={openSummaryModal}
        onClose={() => setOpenSummaryModal(false)}
        data={selectedData}
        onConfirm={() => {
          guardarSeccion("plazas", selectedData);
          console.log("Datos guardados:", selectedData);
          setOpenSummaryModal(false);
        }}
      />
    </div>
  );
};

export default AssignedPlacesStep;
