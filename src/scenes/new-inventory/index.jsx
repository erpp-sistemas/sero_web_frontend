import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
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
} from "../../api/inventory";
import PhotosManager from "../../components/inventory/photoManager";
import { Button, Snackbar, Alert } from "@mui/material";
import {
  AddBox,
  AddBoxOutlined,
  AddCircle,
  Description,
  SaveAltOutlined,
  SaveOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Index() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate(); // ← Agrega esto

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [allSubcategories, setAllSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  const [allCampos, setAllCampos] = useState([]);
  const [filteredCampos, setFilteredCampos] = useState([]);

  const [photos, setPhotos] = useState([]);

  const [formValues, setFormValues] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const [camposConError, setCamposConError] = useState([]);
  const [loadingCampos, setLoadingCampos] = useState(true);

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [nuevoArticuloTemp, setNuevoArticuloTemp] = useState(null);

  const handleCategoryChange = (event) => {
    const selected = event.target.value;
    console.log(event.target.value);
    setSelectedCategory(selected);

    const filtered = allSubcategories.filter(
      (sub) => sub.id_categoria_inventario === selected
    );
    setFilteredSubcategories(filtered);
    setSelectedSubcategory(""); // Reinicia subcategoría
  };

  const handleSubcategoryChange = (event) => {
    setSelectedSubcategory(event.target.value);
    console.log(event.target.value);
  };

  const handleUserChange = (userData) => {
    setSelectedUser(userData);
    console.log(userData);
  };

  const handleFormChange = (campoId, valor) => {
    setFormValues((prev) => ({ ...prev, [campoId]: valor }));
  };

  const handlePlaceChange = useCallback((placeData) => {
    setSelectedPlace(placeData);
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const data = await getAllInventorySubcategory();
        setAllSubcategories(data);

        // Si ya hay categoría seleccionada, filtra
        if (selectedCategory) {
          const filtered = data.filter(
            (sub) => sub.id_categoria_inventario === selectedCategory
          );
          setFilteredSubcategories(filtered);
          setSelectedSubcategory(filtered[0]?.id_subcategoria_inventario || "");
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, [selectedCategory]); // se recarga si cambia la categoría

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
    if (
      selectedCategory &&
      selectedCategory !== "" &&
      selectedSubcategory &&
      selectedSubcategory !== ""
    ) {
      const camposFiltrados = allCampos.filter(
        (campo) =>
          campo.id_categoria_inventario === selectedCategory &&
          campo.id_subcategoria_inventario === selectedSubcategory
      );
      setFilteredCampos(camposFiltrados);
    } else {
      setFilteredCampos([]); // ← Limpia si no hay selección válida
    }
  }, [selectedCategory, selectedSubcategory, allCampos]);

  const validateCampos = () => {
    const camposObligatorios = filteredCampos.filter(
      (c) => c.obligatorio === "1"
    );
    const faltantes = camposObligatorios.filter(
      (c) => !formValues[c.id] || formValues[c.id].toString().trim() === ""
    );

    if (faltantes.length > 0) {
      setCamposConError(faltantes.map((c) => c.id)); // ← Guarda los campos con error
      setShowAlert(true);
      return false;
    }
    setCamposConError([]); // Limpia si todo está bien
    return true;
  };

  const handleAgregarArticulo = () => {
    if (!validateCampos()) return;

    // Convertimos el objeto de campos usando nombre_campo en lugar del ID
    const camposFormateados = filteredCampos.reduce((acc, campo) => {
      const valor = formValues[campo.id];
      if (valor !== undefined) {
        acc[campo.nombre_campo] = valor;
      }
      return acc;
    }, {});

    // Validar que camposFormateados no esté vacío
    if (Object.keys(camposFormateados).length === 0) {
      setShowAlert(true);
      // Opcional: puedes personalizar el mensaje si quieres distinguir este caso
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

    console.log("Artículo a enviar:", nuevoArticulo);
    setNuevoArticuloTemp(nuevoArticulo);
    setOpenConfirmDialog(true); // ← abrimos el dialog
    // Aquí podrías hacer el POST a tu API
  };

  return (
    <div className="p-4 space-y-6">
      <div className="max-w-full mx-auto rounded font-[sans-serif]">
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 mb-6">
          <CategorySelect
            selectedCategory={selectedCategory}
            handleCategoryChange={handleCategoryChange}
          />
          <SubcategorySelect
            subcategories={filteredSubcategories}
            selectedSubcategory={selectedSubcategory}
            handleSubcategoryChange={handleSubcategoryChange}
          />
          <PlaceSelectArray
            selectedPlace={selectedPlace}
            handlePlaceChange={handlePlaceChange}
            setSelectedPlace={setSelectedPlace}
          />
          <ActiveUsersSelect
            selectedUser={selectedUser}
            handleUserChange={handleUserChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-6 mb-6">
          <div className="md:col-span-8">
            <CamposDinamicos
              campos={filteredCampos}
              values={formValues}
              onChange={handleFormChange}
              camposConError={camposConError}
              loading={loadingCampos} // ← Nueva prop
            />
          </div>
          <div className="md:col-span-4">
            <PhotosManager photos={photos} setPhotos={setPhotos} />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="contained"
            color="info"
            onClick={handleAgregarArticulo}
            endIcon={<AddBoxOutlined/>}
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
            }}
          >
            Agregar nuevo artículo
          </Button>
        </div>

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
              backgroundColor: colors.grey[900], // Fondo similar al diálogo
              "& .MuiAlert-icon": {
                alignItems: "center",
              },
            }}
          >
            Por favor completa todos los campos obligatorios.
          </Alert>
        </Snackbar>

        <Dialog
          open={openConfirmDialog}
          onClose={() => setOpenConfirmDialog(false)}
          PaperProps={{
            sx: {
              borderRadius: "12px",
              padding: "8px",
              boxShadow: "0px 4px 14px rgba(0,0,0,0.08)", // Sombra suave
              minWidth: 320,
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: "1rem",
              fontWeight: 500,
              color: colors.grey[100],
              pb: 1,
            }}
          >
            <WarningAmberOutlined
              sx={{ color: colors.yellowAccent[500], fontSize: 22 }}
            />
            ¿Deseas generar una responsiva?
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                fontSize: "0.8rem",
                fontWeight: 500,
                color: colors.grey[100],
                pb: 1,
              }}
            >
              Esto generará un documento PDF con la información del artículo que
              estás registrando.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenConfirmDialog(false)}
              variant="contained"
              startIcon={
                <SaveOutlined sx={{ fontSize: 18, color: colors.grey[700] }} />
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
              Guardar articulo
            </Button>
            <Button
              onClick={() => {
                setOpenConfirmDialog(false);
                navigate("/responsive-generator", {
                  state: { nuevoArticulo: nuevoArticuloTemp },
                });
              }}
              color="info"
              variant="contained"
              autoFocus
              startIcon={
                <Description sx={{ fontSize: 18, color: colors.grey[700] }} />
              }
              sx={{
                textTransform: "none",
                borderRadius: "6px",
                color: colors.grey[700],
                backgroundColor: "rgba(255,255,255,0.85)",
                border: "1px solid",
                borderColor: colors.grey[300],
                "&:hover": {
                  backgroundColor: colors.yellowAccent[300],
                  borderColor: colors.yellowAccent[500],
                  color: colors.grey[700],
                  "& .MuiSvgIcon-root": {
                    color: colors.yellowAccent[800],
                  },
                },
              }}
            >
              Generar responsiva
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Index;
