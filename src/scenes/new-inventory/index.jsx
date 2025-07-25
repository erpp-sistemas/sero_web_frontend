import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";
import CategorySelect from "../../components/inventory/select/categorySelect";
import SubcategorySelect from "../../components/inventory/select/subcategorySelect";
import PlaceSelect from "../../components/select/placeSelect.jsx";
import ActiveUsersSelect from "../../components/inventory/select/activeUsersSelect";
import CamposDinamicos from "../../components/inventory/formDinamic/camposDinamicos";
import {
  getAllInventorySubcategory,
  getAllInventoryFieldsCategorySubcategory,
} from "../../api/inventory";
import PhotosManager from "../../components/inventory/photoManager";
import { Button, Snackbar, Alert } from "@mui/material";
import { AddCircle } from "@mui/icons-material";

function Index() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const [allSubcategories, setAllSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

  const [allCampos, setAllCampos] = useState([]);
  const [filteredCampos, setFilteredCampos] = useState([]);

  const [photos, setPhotos] = useState([]);

  const [formValues, setFormValues] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  const [camposConError, setCamposConError] = useState([]);

  const handleCategoryChange = (event) => {
    const selected = event.target.value;
    setSelectedCategory(selected);

    const filtered = allSubcategories.filter(
      (sub) => sub.id_categoria_inventario === selected
    );
    setFilteredSubcategories(filtered);
    setSelectedSubcategory(""); // Reinicia subcategoría
  };

  const handleSubcategoryChange = (event) => {
    setSelectedSubcategory(event.target.value);
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleFormChange = (campoId, valor) => {
    setFormValues((prev) => ({ ...prev, [campoId]: valor }));
  };

  const handlePlaceChange = useCallback((event) => {
    setSelectedPlace(event.target.value);
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
        const data = await getAllInventoryFieldsCategorySubcategory();
        setAllCampos(data);
      } catch (error) {
        console.error("Error fetching campos:", error);
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
          <PlaceSelect
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
            />
          </div>
          <div className="md:col-span-4">
            <PhotosManager photos={photos} setPhotos={setPhotos} />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleAgregarArticulo}
            sx={{
              borderRadius: "35px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: colors.searchButton[100],
              color: colors.contentSearchButton[100],
              border: "1px solid #d5e3f5",
              boxShadow: "0 4px 6px rgba(255, 255, 255, 0.1)",
              ":hover": {
                backgroundColor: colors.searchButton[200],
                boxShadow: "0 8px 12px rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <span
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                fontWeight: "bold",
              }}
            >
              Agregar nuevo artículo
            </span>
            <AddCircle sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
          </Button>
        </div>

        <Snackbar
          open={showAlert}
          autoHideDuration={4000}
          onClose={() => setShowAlert(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="warning" onClose={() => setShowAlert(false)}>
            Por favor completa todos los campos obligatorios.
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}

export default Index;
