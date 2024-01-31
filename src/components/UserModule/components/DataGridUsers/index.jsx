import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import React from "react";
import { getUserById } from "../../../../api/user";
import { store } from "../../../../redux/store";
import { useSelector } from "react-redux";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import { Avatar, Button, Chip, IconButton, Link } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import PlaceIcon from "@mui/icons-material/Place";
import VillaIcon from "@mui/icons-material/Villa";
import { AddOutlined } from "@mui/icons-material";

const ShipPlaces = ({ data }) => {
  const lugaresArray = data.split(", ");

  return (
    <>
      {lugaresArray.map(
        (place, index) =>
          place && (
            <Chip
              color="secondary"
              size="small"
              key={index}
              icon={<VillaIcon fontSize="small" />}
              label={`${place}`}
              variant="outlined"
            />
          )
      )}
    </>
  );
};

const LinkUserName = ({ data }) => {
  return (
    <>
      <Link sx={{ color: "#9298E3" }} href="#" underline="hover">
        {`${data}`}
      </Link>
    </>
  );
};

const CheckCell = ({ data }) => {
  if (data) {
    return (
      <IconButton aria-label="check" size="small">
        <CheckIcon fontSize="inherit" color="secondary" />
      </IconButton>
    );
  } else {
    return (
      <IconButton aria-label="check" size="small">
        <ClearIcon fontSize="inherit" sx={{ color: "red" }} />
      </IconButton>
    );
  }
};

const AvatarImage = ({ data }) => {
  return <Avatar alt="Remy Sharp" src={data} />;
};

const Sex = ({ data }) => {
  switch (data) {
    case "masculino":
      return <MaleIcon sx={{ color: "#4682B4" }} />;

      break;

    case "femenino":
      return <FemaleIcon sx={{ color: "pink" }} />;

      break;

    default:
      break;
  }
};

function hiddenPhoneNumber(phone) {
  const arrayCaracters = [...phone];
  // Utilizamos map para modificar el array y devolver el nuevo array
  const x = arrayCaracters.map((caracter, index) => {
    if (index < 6) {
      return "*"; // Devolvemos "*" en lugar de modificar directamente arrayCaracters
    } else {
      return caracter; // Devolvemos el carácter sin cambios para los primeros 8 dígitos
    }
  });

  return x.join("");
}
const PersonalPhone = ({ data }) => {
  if (data) {
    return (
      <>
        {" "}
        <img src="https://flagsapi.com/MX/flat/16.png" />
        {`${data}`}
      </>
    );
  } else {
    {
      ("-");
    }
  }
};

function DataGridUsers({ setComponentesVisibility, componentesVisibility,fetchUser }) {
  const [rows, setRows] = React.useState([]);

  /**
   * Función asíncrona para obtener y establecer los datos de las tareas.
   *
   * @function
   * @async
   * @private
   */
  const fetchData = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getUserById(151);

      // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_tarea || index.toString(),
      }));

      setRows(rowsWithId);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  /**
   * Custom toolbar component for the service grid. It includes various actions like column selection,
   * filtering, density selector, and export. Additionally, it provides a button to open a dialog
   * for adding a new service.
   *
   * @component
   * @param {Object} props - The properties passed to the component.
   * @param {Function} props.handleOpenDialog - The function to handle opening the dialog for adding a new service.
   * @returns {React.ReactElement} The rendered component.
   *
   * @example
   * // Usage example
   * const handleOpenDialogFunc = () => {
   *   // Implement the logic to open the dialog for adding a new service
   * };
   *
   * // Render the CustomToolbar component with the handleOpenDialog function
   * <CustomToolbar handleOpenDialog={handleOpenDialogFunc} />
   */
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton color="secondary" />
        <GridToolbarFilterButton color="secondary" />
        <GridToolbarDensitySelector color="secondary" />

        <GridToolbarExport color="secondary" />

        <Button
          color="secondary"
          /*  onClick={handleOpenNewServiceDialog} */
          startIcon={<AddOutlined />}
          size="small"
          onClick={() => {
            setComponentesVisibility({
              dataGridVisible: false,
              stepperVisible: true,
            });
          }}
        >
          Agregar Nuevo Usuario
        </Button>
      </GridToolbarContainer>
    );
  }

  React.useEffect(() => {
    fetchData();
  }, []);

  /**
   * Construye y devuelve la configuración de columnas para el DataGrid.
   *
   * @function
   * @returns {Array} - Configuración de columnas para el DataGrid.
   * @private
   */

  /* [11:52, 30/1/2024] Cahrly Erpp: noombre, nombre usuario, foto
[11:52, 30/1/2024] Cahrly Erpp: plazas */

  const buildColumns = () => {
    const columns = [
      {
        field: "name",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"Nombre"}</strong>
        ),
        width: 180,
        editable: true,
      },
      /*    {
        field: "birthdate",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"Fecha de nacimiento"}</strong>
        ),
        width: 120,
        editable: true,
        type: "dateTime",
        valueGetter: ({ value }) => value && new Date(value),
      }, */
      /*     {
        field: "sex",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"Sexo"}</strong>
        ),
        width: 60,
        editable: true,
        renderCell: (params) => <Sex data={params.row.sex} />,
      }, */
      {
        field: "url_image",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"Foto"}</strong>
        ),
        width: 60,
        editable: false,
        renderCell: (params) => <AvatarImage data={params.row.url_image} />,
      },
      /*  {
        field: "personal_phone",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"Telefono Personal"}</strong>
        ),
        width: 120,
        editable: true,
        renderCell: (params) => (
          <PersonalPhone data={params.row.personal_phone} />
        ),
      }, */
      /*  {
        field: "work_phone",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"Telefono Trabajo"}</strong>
        ),
        width: 120,
        editable: true,
        renderCell: (params) => <PersonalPhone data={params.row.work_phone} />,
      }, */
      {
        field: "active",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"Estado"}</strong>
        ),
        width: 60,
        editable: true,
        renderCell: (params) => <CheckCell data={params.row.active} />,
        type: "boolean",
      },
      {
        field: "user_name",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"Nombre Usuario"}</strong>
        ),
        width: 270,
        editable: true,
        renderCell: (params) => <LinkUserName data={params.row.user_name} />,
      },
      /*  {
        field: "password",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"Contraseña"}</strong>
        ),
        width: 300,
        editable: true,
      },
      {
        field: "active_web_access",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"Accesso Web"}</strong>
        ),
        width: 300,
        editable: true,
      },
      {
        field: "active_app_mobil_access",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"Acceso Mobil"}</strong>
        ),
        width: 300,
        editable: true,
      },
      {
        field: "app_version",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"App Version"}</strong>
        ),
        width: 300,
        editable: true,
      }, */
      {
        field: "assigned_places",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"Plazas Asignadas"}</strong>
        ),
        width: 600,
        editable: true,
        renderCell: (params) => (
          <ShipPlaces data={params.row.assigned_places} />
        ),
      },
    ];

    return columns;
  };
  /*  "name": "Admin Admin Admin",
    "birthdate": "1999-09-08",
    "sex": "masculino",
    "foto": "sin_foto.jpg",
    "personal_phone": "",
    "work_phone": "",
    "active": "activo",
    "user_name": "admin.demo@ser0.mx",
    "password": "Demo",
    "active_web_access": "acceso permitido",
    "active_app_movil_access": "acceso permitido",
    "app_version": "",
    "assigned_places": "Cuautitlan Izcalli, Demo, Naucalpan, Zinacantepec" */
  return (
    <DataGrid
      rows={rows}
      columns={buildColumns()}
      localeText={{
        toolbarColumns: "Columnas",
        toolbarFilters: "Filtros",
        toolbarDensity: "Tamaño Celda",
        toolbarExport: "Exportar",
      }}
      slots={{ toolbar: CustomToolbar }}
    />
  );
}

export default DataGridUsers;
