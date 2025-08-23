import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  CircularProgress,
  Box,
} from "@mui/material";
import { tokens } from "../../theme";
import CategorySelect from "../../components/inventory/select/categorySelect";
import SubcategorySelect from "../../components/inventory/select/subcategorySelect";
import PlaceSelectArray from "../../components/select/placeSelectArray.jsx";
import ActiveUsersSelect from "../../components/inventory/select/activeUsersSelect";
import CamposDinamicos from "../../components/inventory/formDinamic/camposDinamicos";
import {
  getAllInventorySubcategory,
  getAllInventoryFieldsCategorySubcategory,
  createArticle,
} from "../../api/inventory";
import PhotosManager from "../../components/inventory/photoManager";
import { Button, Snackbar, Alert } from "@mui/material";
import {
  AddBoxOutlined,
  Description,
  SaveOutlined,
  WarningAmberOutlined,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Index() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  // Estados del formulario
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [formValues, setFormValues] = useState({});

  // Estados para datos y UI
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [allCampos, setAllCampos] = useState([]);
  const [filteredCampos, setFilteredCampos] = useState([]);
  const [camposConError, setCamposConError] = useState([]);
  const [loadingCampos, setLoadingCampos] = useState(true);

  // Estados para operaciones
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [nuevoArticuloTemp, setNuevoArticuloTemp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [resetKey, setResetKey] = useState(0); // ← Nueva key para reset

  // Reset completo usando key change
  const resetFormularioCompleto = useCallback(() => {
    // Incrementamos la key para forzar re-render de componentes hijos
    setResetKey((prev) => prev + 1);

    // También reseteamos los estados locales
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedPlace(null);
    setSelectedUser(null);
    setFormValues({});
    setPhotos([]);
    setFilteredCampos([]);
    setCamposConError([]);
  }, []);

  // Handlers para los campos del formulario
  const handleCategoryChange = (event) => {
    const selected = event.target.value;
    setSelectedCategory(selected);
    setSelectedSubcategory("");

    const filtered = allSubcategories.filter(
      (sub) => sub.id_categoria_inventario === selected
    );
    setFilteredSubcategories(filtered);
  };

  const handleSubcategoryChange = (event) => {
    setSelectedSubcategory(event.target.value);
  };

  const handleUserChange = (userData) => {
    setSelectedUser(userData);
  };

  const handleFormChange = (campoId, valor) => {
    setFormValues((prev) => ({ ...prev, [campoId]: valor }));
  };

  const handlePlaceChange = useCallback((placeData) => {
    setSelectedPlace(placeData);
  }, []);

  // Efectos para carga de datos
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const data = await getAllInventorySubcategory();
        setAllSubcategories(data);

        if (selectedCategory) {
          const filtered = data.filter(
            (sub) => sub.id_categoria_inventario === selectedCategory
          );
          setFilteredSubcategories(filtered);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchCampos = async () => {
      try {
        setLoadingCampos(true);
        const data = await getAllInventoryFieldsCategorySubcategory();
        setAllCampos(data);
      } catch (error) {
        console.error("Error fetching campos:", error);
      } finally {
        setLoadingCampos(false);
      }
    };

    fetchCampos();
  }, []);

  useEffect(() => {
    if (selectedCategory && selectedSubcategory) {
      const camposFiltrados = allCampos.filter(
        (campo) =>
          campo.id_categoria_inventario === selectedCategory &&
          campo.id_subcategoria_inventario === selectedSubcategory
      );
      setFilteredCampos(camposFiltrados);
    } else {
      setFilteredCampos([]);
    }
  }, [selectedCategory, selectedSubcategory, allCampos]);

  // Validación de campos obligatorios
  const validateCampos = () => {
    const camposObligatorios = filteredCampos.filter(
      (c) => c.obligatorio === "1"
    );
    const faltantes = camposObligatorios.filter(
      (c) => !formValues[c.id] || formValues[c.id].toString().trim() === ""
    );

    if (faltantes.length > 0) {
      setCamposConError(faltantes.map((c) => c.id));
      setShowAlert(true);
      return false;
    }
    setCamposConError([]);
    return true;
  };

  // Función simulada para enviar datos al backend
  const enviarDatosAlBackend = async (articuloData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Datos enviados al backend:", articuloData);
        resolve({
          success: true,
          id: Math.floor(Math.random() * 1000),
          message: "Artículo guardado exitosamente",
        });
      }, 1500);
    });
  };

  const handleAgregarArticulo = () => {
    if (!validateCampos()) return;

    const camposFormateados = filteredCampos.reduce((acc, campo) => {
      const valor = formValues[campo.id];
      if (valor !== undefined) {
        acc[campo.nombre_campo] = valor;
      }
      return acc;
    }, {});

    console.log("📋 Campos formateados:", camposFormateados);

    if (Object.keys(camposFormateados).length === 0) {
      setShowAlert(true);
      return;
    }

    const nuevoArticulo = {
      categoria: selectedCategory,
      subcategoria: selectedSubcategory,
      plaza: selectedPlace,
      usuarioAsignado: selectedUser,
      campos: camposFormateados,
      fotos: photos.map((p) => p.base64),
    };

    setNuevoArticuloTemp(nuevoArticulo);
    setOpenConfirmDialog(true);
  };

  // Dentro de handleConfirmarGuardado
  const handleConfirmarGuardado = async (generarResponsiva = false) => {
    setOpenConfirmDialog(false);
    setLoading(true);

    try {
      // Preparar el payload según lo que espera el backend
      const payload = {
        category: nuevoArticuloTemp.categoria,
        subcategory: nuevoArticuloTemp.subcategoria,
        assignedUser: nuevoArticuloTemp.usuarioAsignado,
        fields: nuevoArticuloTemp.campos, // ← ¡ESTE ES EL CORRECTO!
        photos: nuevoArticuloTemp.fotos,
        location: nuevoArticuloTemp.plaza,
      };
      // Llamar a la nueva función
      const resultado = await createArticle(payload);

      if (resultado.success) {
        setSnackbar({
          open: true,
          message: resultado.message || "Artículo guardado exitosamente",
          severity: "success",
        });

        if (generarResponsiva) {
          setTimeout(() => {
            navigate("/responsive-generator", {
              state: {
                nuevoArticulo: nuevoArticuloTemp, // ← O usar resultado.article
                articuloId: resultado.article.id_articulo,
              },
            });
          }, 1500);
        } else {
          setTimeout(() => {
            resetFormularioCompleto();
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Error al guardar el artículo:", error);
      setSnackbar({
        open: true,
        message:
          error.message || "Error al guardar el artículo. Intenta nuevamente.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="max-w-full mx-auto rounded font-[sans-serif]">
        {/* Header */}
        <div
          className="flex items-center gap-4 border-b pb-1"
          style={{ borderBottom: `2px solid ${colors.accentGreen[100]}` }}
        >
          <h3
            className="text-2xl font-extrabold"
            style={{ color: colors.accentGreen[100] }}
          >
            Nuevo artículo de inventario
          </h3>
          <p className="text-gray-400 text-base">
            Utiliza este formulario para registrar nuevos artículos al sistema.
            Selecciona la categoría, subcategoría y completa los campos
            requeridos.
          </p>
        </div>

        {/* Campos del formulario - Pasamos resetKey a todos los componentes */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 mb-6">
          <CategorySelect
            key={`category-${resetKey}`}
            selectedCategory={selectedCategory}
            handleCategoryChange={handleCategoryChange}
          />
          <SubcategorySelect
            key={`subcategory-${resetKey}`}
            subcategories={filteredSubcategories}
            selectedSubcategory={selectedSubcategory}
            handleSubcategoryChange={handleSubcategoryChange}
          />
          <PlaceSelectArray
            key={`place-${resetKey}`}
            selectedPlace={selectedPlace}
            handlePlaceChange={handlePlaceChange}
            setSelectedPlace={setSelectedPlace}
          />
          <ActiveUsersSelect
            key={`user-${resetKey}`}
            selectedUser={selectedUser}
            handleUserChange={handleUserChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-6 mb-6">
          <div className="md:col-span-8">
            <CamposDinamicos
              key={`campos-${resetKey}`}
              campos={filteredCampos}
              values={formValues}
              onChange={handleFormChange}
              camposConError={camposConError}
              loading={loadingCampos}
            />
          </div>
          <div className="md:col-span-4">
            <PhotosManager
              key={`photos-${resetKey}`}
              photos={photos}
              setPhotos={setPhotos}
            />
          </div>
        </div>

        {/* Botón de acción principal */}
        <div className="flex justify-center">
          <Button
            variant="contained"
            color="info"
            onClick={handleAgregarArticulo}
            endIcon={
              loading ? <CircularProgress size={20} /> : <AddBoxOutlined />
            }
            disabled={loading}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              borderColor: colors.grey[300],
              color: colors.grey[800],
              fontWeight: 500,
              fontSize: "0.875rem",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: colors.grey[100],
                borderColor: colors.primary[300],
                boxShadow: "none",
              },
              minWidth: "200px",
            }}
          >
            {loading ? "Procesando..." : "Agregar nuevo artículo"}
          </Button>
        </div>

        {/* Alertas y notificaciones */}
        <Snackbar
          open={showAlert}
          autoHideDuration={4000}
          onClose={() => setShowAlert(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="warning"
            onClose={() => setShowAlert(false)}
            icon={
              <WarningAmberOutlined
                sx={{ color: colors.yellowAccent[500], fontSize: 22 }}
              />
            }
            sx={{
              borderRadius: "12px",
              padding: "8px 12px",
              boxShadow: "0px 4px 14px rgba(0,0,0,0.08)",
              minWidth: 320,
              fontSize: "0.95rem",
              fontWeight: 500,
              color: colors.grey[100],
              backgroundColor: colors.grey[900],
              "& .MuiAlert-icon": {
                alignItems: "center",
              },
            }}
          >
            Por favor completa todos los campos obligatorios.
          </Alert>
        </Snackbar>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            sx={{
              borderRadius: "12px",
              padding: "8px 12px",
              boxShadow: "0px 4px 14px rgba(0,0,0,0.08)",
              minWidth: 320,
              fontSize: "0.95rem",
              fontWeight: 500,
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Diálogo de confirmación */}
        <Dialog
          open={openConfirmDialog}
          onClose={() => !loading && setOpenConfirmDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: "12px",
              padding: "8px",
              boxShadow: "0px 4px 14px rgba(0,0,0,0.08)",
              minWidth: 320,
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: "1.1rem",
              fontWeight: 600,
              color: colors.grey[100],
              pb: 1,
              justifyContent: "center",
            }}
          >
            <Description sx={{ color: colors.blueAccent[400], fontSize: 24 }} />
            ¿Qué deseas hacer?
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              sx={{
                fontSize: "0.95rem",
                fontWeight: 400,
                color: colors.grey[300],
                lineHeight: 1.5,
                textAlign: "center",
              }}
            >
              <Box sx={{ mb: 2 }}>
                <strong>Selecciona una opción:</strong>
              </Box>

              <Box sx={{ textAlign: "left", mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <SaveOutlined
                    sx={{ fontSize: 18, mr: 1, color: colors.greenAccent[500] }}
                  />
                  <strong>Guardar artículo</strong>
                </Box>
                <Box
                  sx={{ fontSize: "0.85rem", pl: 3, color: colors.grey[300] }}
                >
                  Solo se guarda en el inventario
                </Box>
              </Box>

              <Box sx={{ textAlign: "left" }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                  <Description
                    sx={{ fontSize: 18, mr: 1, color: colors.blueAccent[500] }}
                  />
                  <strong>Guardar y generar responsiva</strong>
                </Box>
                <Box
                  sx={{ fontSize: "0.85rem", pl: 3, color: colors.grey[300] }}
                >
                  Guarda el artículo y genera su documento de asignación oficial
                  con firma electrónica.
                </Box>
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {/* BOTÓN DE CANCELAR - NUEVO */}
            <Button
              onClick={() => setOpenConfirmDialog(false)}
              disabled={loading}
              sx={{
                textTransform: "none",
                borderRadius: "6px",
                color: colors.grey[700],
                backgroundColor: "rgba(255,255,255,0.85)",
                border: "1px solid",
                borderColor: colors.grey[300],
                "&:hover": {
                  backgroundColor: colors.grey[100],
                  borderColor: colors.grey[400],
                },
              }}
            >
              Cancelar
            </Button>

            <Button
              onClick={() => handleConfirmarGuardado(false)}
              variant="contained"
              disabled={loading}
              endIcon={
                loading ? (
                  <CircularProgress size={16} />
                ) : (
                  <SaveOutlined
                    sx={{ fontSize: 18, color: colors.grey[700] }}
                  />
                )
              }
              sx={{
                textTransform: "none",
                borderRadius: "6px",
                color: loading ? colors.grey[500] : colors.grey[700],
                backgroundColor: loading
                  ? colors.grey[300]
                  : "rgba(255,255,255,0.85)",
                border: "1px solid",
                borderColor: colors.grey[300],
                "&:hover": !loading
                  ? {
                      backgroundColor: colors.tealAccent[300],
                      borderColor: colors.tealAccent[500],
                      color: colors.grey[100],
                      "& .MuiSvgIcon-root": {
                        color: colors.tealAccent[800],
                      },
                    }
                  : {},
              }}
            >
              {loading ? "Guardando..." : "Guardar artículo"}
            </Button>
            <Button
              onClick={() => handleConfirmarGuardado(true)}
              color="info"
              variant="contained"
              disabled={loading}
              endIcon={
                loading ? (
                  <CircularProgress size={16} />
                ) : (
                  <Description sx={{ fontSize: 18, color: colors.grey[700] }} />
                )
              }
              sx={{
                textTransform: "none",
                borderRadius: "6px",
                color: loading ? colors.grey[500] : colors.grey[700],
                backgroundColor: loading
                  ? colors.grey[300]
                  : "rgba(255,255,255,0.85)",
                border: "1px solid",
                borderColor: colors.grey[300],
                "&:hover": !loading
                  ? {
                      backgroundColor: colors.yellowAccent[300],
                      borderColor: colors.yellowAccent[500],
                      color: colors.grey[700],
                      "& .MuiSvgIcon-root": {
                        color: colors.yellowAccent[800],
                      },
                    }
                  : {},
              }}
            >
              {loading ? "Guardando..." : "Guardar y generar responsiva"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Index;
