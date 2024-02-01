import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import React from "react";
import { getUserById, updateUser } from "../../../../api/user";
import { store } from "../../../../redux/store";
import { useSelector } from "react-redux";
import MaleIcon from "@mui/icons-material/Male";
import FemaleIcon from "@mui/icons-material/Female";
import {
  Alert,
  AppBar,
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Link,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import PlaceIcon from "@mui/icons-material/Place";
import VillaIcon from "@mui/icons-material/Villa";
import { AddOutlined } from "@mui/icons-material";
import Viewer from "react-viewer";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { GrServices } from "react-icons/gr";
import CloseIcon from "@mui/icons-material/Close";
import { Sync } from "@mui/icons-material";

import { Modal, Upload } from "antd";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { getAccessUserByUserName, updateAccessUserById } from "../../../../api/access";
import { uploadToS3 } from "../../../../services/s3.service";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Cuautitlan Izcalli",
  "Cuautitlan Mexico",
  "Demo",
  "Zinacantepec",
];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
/**
 * Hook personalizado para simular una mutación asincrónica con datos ficticios.
 *
 * @param {Function} updateTaskById - Función para actualizar una tarea por ID utilizando la API.
 * @returns {Function} - Función de retorno que realiza la mutación asincrónica.
 *
 * @throws {Error} - Se lanza un error si hay un problema durante la actualización.
 *
 * @async
 * @function
 * @name useFakeMutation
 *
 * @param {Object} task - Datos de la tarea para la mutación.
 * @param {string} _action - Acción a realizar ("update", "delete", o "create").
 * @returns {Promise<Object>} - Promesa que se resuelve con los datos resultantes de la mutación.
 */
const useFakeMutation = () => {
  /**
   * Función que realiza la mutación asincrónica.
   *
   * @async
   *
   * @param {Object} task - Datos de la tarea para la mutación.
   * @param {string} _action - Acción a realizar ("update", "delete", o "create").
   * @returns {Promise<Object>} - Promesa que se resuelve con los datos resultantes de la mutación.
   *
   * @throws {Error} - Se lanza un error si hay un problema durante la actualización.
   */
  return React.useCallback(async (task, _action) => {
    console.log(task);
    try {
      // Simulando una pausa de 200 ms con setTimeout
      await new Promise((timeoutResolve) => setTimeout(timeoutResolve, 200));

      const response = updateUser(task.id, {
        nombre: task.name,
        url_image: task.url_image,
        activo: task.active === "activo" ? 1 : 0,
      });

      return response.data;
    } catch (error) {
      // Maneja errores de Axios o errores de validación
      console.error(error);
      throw error;
    }
  }, []);
};

/**
 * Calcula la mutación necesaria para la actualización de una fila.
 *
 * @param {Object} newRow - La nueva fila con los datos actualizados.
 * @param {Object} oldRow - La fila antigua con los datos originales.
 * @returns {string|null} - Una cadena que describe la mutación, o null si no hay cambios.
 */
function computeMutation(newRow, oldRow) {
  /**
   * @typedef {Object} Mutation
   * @property {string} [nameMutation] - Descripción de la mutación del nombre.
   * @property {string} [activoMutation] - Descripción de la mutación del estado activo.
   * @property {string} [procesoMutation] - Descripción de la mutación del proceso.
   */

  /** @type {Mutation} */
  const mutation = {};

  if (newRow.name !== oldRow.name) {
    /**
     * Descripción de la mutación del nombre.
     * @type {string}
     */
    mutation.nameMutation = `¿Realmente quieres cambiar el nombre de '${oldRow.name}' a '${newRow.name}?'`;
  }

  if (newRow.activo !== oldRow.activo) {
    /**
     * Descripción de la mutación del estado activo.
     * @type {string}
     */
    mutation.activoMutation = `¿Realmente deseas cambiar el estado de 'Activo' de '${
      oldRow.activo ? "✅" : "❎" || ""
    }' a '${newRow.activo ? "✅" : "❎" || ""}'?`;
  }

  if (newRow.id_proceso !== oldRow.id_proceso) {
    /**
     * Descripción de la mutación del proceso.
     * @type {string}
     */
    mutation.procesoMutation = `¿Realmente quieres cambiar el proceso de '${
      oldRow.id_proceso || ""
    }' a '${newRow.id_proceso || ""}'?`;
  }

  // Devuelve la mutación completa o null si no hay cambios
  return Object.values(mutation).join("\n") || null;
}

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
              icon={<VillaIcon color="secondary" fontSize="small" />}
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
  return data === "activo" ? (
    <IconButton aria-label="check" size="small">
      <CheckIcon fontSize="inherit" color="secondary" />
    </IconButton>
  ) : (
    <IconButton aria-label="check" size="small">
      <ClearIcon fontSize="inherit" sx={{ color: "red" }} />
    </IconButton>
  );
};

const AvatarImage = ({ data }) => {
  const [visibleAvatar, setVisibleAvatar] = React.useState(false);
  return (
    <>
      <Avatar
        onClick={() => {
          setVisibleAvatar(true);
        }}
        alt="Remy Sharp"
        src={data}
      />

      <Viewer
        visible={visibleAvatar}
        onClose={() => {
          setVisibleAvatar(false);
        }}
        images={[{ src: data, alt: "avatar" }]}
      />
    </>
  );
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

function DataGridUsers({
  setComponentesVisibility,
  componentesVisibility,
  fetchUser,
}) {
  const theme = useTheme();
  const [rows, setRows] = React.useState([]);
  const [idUser, setIdUser] = React.useState(null);
  const mutateRow = useFakeMutation();
  const noButtonRef = React.useRef(null);
  const [promiseArguments, setPromiseArguments] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState(null);
  const [isUpdateUserDialogOpen, setIsUpdateUserDialogOpen] =
    React.useState(false);
  const [selectTheRowId, setSelectTheRowID] = React.useState();
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState("");
  const [previewTitle, setPreviewTitle] = React.useState("");
  const [fileList, setFileList] = React.useState([]);

  const [personName, setPersonName] = React.useState([]);

  const [userData, setUserData] = React.useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    username: "",
    personal_phone: "",
    work_phone: "",
    app_version: "",
    password: "",
    birthdate: "",
    image_url: "",
    access_web: "",
    access_mobil: "",
    activo: Boolean(""),
    sexo: "",
  });

  console.log(userData);





  /**
   * Maneja el cambio de entrada de datos en los campos del formulario.
   *
   * @function
   * @name handleInputOnChange
   * @param {object} event - Objeto de evento que representa el cambio de entrada.
   * @returns {void}
   */
  const handleInputOnChange = (event) => {
    const { name, value, type, checked } = event.target;



    
    // Actualiza el estado serviceData con el nuevo valor del campo Servicio
    const newValue = type === "checkbox" ? checked : value;
    
    setUserData((prevState) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const handleChangePrueba = (event) => {
    const {
      target: { value },
    } = event;
    console.log(value);
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      +
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  /* {
    "name": "RazielYeray gestorPrueba555 chav",
    "birthdate": "1992-02-07",
    "sex": "masculino",
    "url_image": "https://ser0.mx/ser0/image/usuario/sin_foto.jpg",
    "personal_phone": "+525511263860",
    "work_phone": "+525511263860",
    "active": "in activo",
    "user_name": "gestorprueba564.gestorprueba555@ser0.mx",
    "password": "gestorPrueba56415=*%60",
    "active_web_access": "acceso denegado",
    "active_app_movil_access": "acceso permitido",
    "app_version": "",
    "assigned_places": "Cuautitlan Izcalli",
    "id": "306"
} */
  const handleAddImage = (urlImage) => {
    const newImage = {
      uid: "-1", // Puedes generar un nuevo uid único para cada imagen
      name: `hola`,
      status: "done",
      url: urlImage, // Reemplaza esto con la URL real de tu nueva imagen
    };

    setFileList((prevFileList) => [...prevFileList, newImage]);
  };


  console.log(fileList);
  const fetchImage = async () => {
    console.log("aqui prueba 1");

    // Fetch your base64 image URL from fileList[0].thumbUrl
    if (!fileList || fileList.length === 0) {
      console.error("File list is empty or undefined.");
      return;
    }
    console.log("aqui prueba 2");
   
    
    if (fileList) {
    
      console.log("aqui prueba 2");
      try {
       
        // Now you have the File object, you can do something with it
        if (fileList[0]) {
          const fileUrl = await uploadToS3(fileList[0].originFileObj);
          console.log("URL del archivo subido:", fileUrl);

      

          setUserData((prevState) => ({
            ...prevState,
            image_url: fileUrl,
          }));
        
        }
      } catch (error) {
        console.error("Error converting base64 to file:", error);
      }
    }
  };

  async function convertBase64ToFile(base64Image, filename) {
    const response = await fetch(base64Image);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }

  React.useEffect(() => {
    fetchImage();
  }, [fileList]);


  console.log(fileList);

  console.log(selectTheRowId);

  React.useEffect(() => {
    if (selectTheRowId && selectTheRowId.url_image) {
      handleAddImage(selectTheRowId.url_image);
    }
  }, [selectTheRowId]);

  /**
   * Maneja la apertura del diálogo de actualización de usuario.
   * @function
   * @returns {void}
   */
  const handleOpenDialog = () => {
    setIsUpdateUserDialogOpen(true);
  };

  /**
   * Maneja el cierre del diálogo de actualización de usuario.
   * @function
   * @returns {void}
   */
  const handleCloseDialog = () => {
    setIsUpdateUserDialogOpen(false);
  };

  /**
   * Función que cierra el componente Snackbar.
   *
   * @function
   * @name handleCloseSnackbar
   *
   * @description Esta función actualiza el estado del componente Snackbar para ocultarlo.
   *
   * @returns {void}
   */
  const handleCloseSnackbar = () => setSnackbar(null);

  /**
   * Función que maneja la acción "No" en el contexto de una promesa.
   *
   * @function
   * @name handleNo
   *
   * @description Esta función resuelve la promesa con la fila antigua para evitar la actualización del estado interno.
   *
   * @returns {void}
   */
  const handleNo = () => {
    const { oldRow, resolve } = promiseArguments;
    resolve(oldRow); // Resolve with the old row to not update the internal state
    setPromiseArguments(null);
  };
  /**
   * Función que maneja la acción "Sí" en el contexto de una promesa al actualizar una tarea en el backend.
   *
   * @function
   * @name handleYes
   * @async
   *
   * @description Esta función realiza una solicitud HTTP para actualizar la tarea en el backend.
   * Si la solicitud tiene éxito, resuelve la promesa con la respuesta y muestra una notificación de éxito.
   * Si hay un error, muestra una notificación de error, rechaza la promesa y utiliza la fila antigua para mantener el estado interno sin cambios.
   *
   * @returns {Promise<void>}
   */
  const handleYes = async () => {
    const { newRow, oldRow, reject, resolve } = promiseArguments;

    try {
      // Make the HTTP request to save in the backend
      const response = await mutateRow(newRow, "update");

      setSnackbar({
        children: "Tarea guardada exitosamente",
        severity: "success",
      });
      resolve(newRow);
      setPromiseArguments(null);
    } catch (error) {
      setSnackbar({ children: "Name can't be empty", severity: "error" });
      reject(oldRow);
      setPromiseArguments(null);
    }
  };

  const handleEntered = () => {
    noButtonRef.current?.focus();

    // The `autoFocus` is not used because, if used, the same Enter that saves
    // the cell triggers "No". Instead, we manually focus the "No" button once
    // the dialog is fully open.
    //
  };

  /**
   * Función que renderiza un cuadro de diálogo de confirmación.
   *
   * @function
   * @name renderConfirmDialog
   *
   * @description Esta función verifica si hay argumentos de promesa. Si los hay, utiliza la información
   * de la promesa para calcular la mutación entre la fila nueva y antigua. Luego, renderiza un cuadro de diálogo
   * de confirmación con la descripción de la mutación y botones "Sí" y "No" para confirmar o cancelar la acción.
   *
   * @returns {React.ReactElement|null} - Elemento de React que representa el cuadro de diálogo o `null` si no hay argumentos de promesa.
   */
  const renderConfirmDialog = () => {
    if (!promiseArguments) {
      return null;
    }

    const { newRow, oldRow } = promiseArguments;
    const mutation = computeMutation(newRow, oldRow);

    return (
      <Dialog
        maxWidth="xs"
        TransitionProps={{ onEntered: handleEntered }}
        open={!!promiseArguments}
      >
        <DialogTitle>¿Esta usted seguro?</DialogTitle>
        <DialogContent dividers>
          {`Presiona 'Ok' , si  ${mutation}.`}
        </DialogContent>
        <DialogActions>
          <Button
            endIcon={<ClearIcon />}
            color="secondary"
            ref={noButtonRef}
            onClick={handleNo}
          >
            No
          </Button>
          <Button endIcon={<CheckIcon />} color="secondary" onClick={handleYes}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

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
   * Función asíncrona para obtener y establecer los datos de las tareas.
   *
   * @function
   * @async
   * @private
   */
  const fetchUsername = async (user) => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAccessUserByUserName(user);

      // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
      /*  const rowsWithId = response.map((row, index) => ({
          ...row,
          id: row.id_tarea || index.toString(),
        })); */

      setIdUser(response);
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

  React.useEffect(() => {
    if (selectTheRowId && selectTheRowId.user_name) {
      fetchUsername(selectTheRowId.user_name);
    }
  }, [selectTheRowId?.user_name]);

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
        width: 110,
        editable: false,
      },
      {
        field: "last_name",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"Apellido Paterno"}</strong>
        ),
        width: 105,
        editable: false,
      },
      {
        field: "second_last_name",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>{"Apellido Materno"}</strong>
        ),
        width: 105,
        editable: false,
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
        width: 200,
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
        width: 360,
        editable: true,
        renderCell: (params) => (
          <ShipPlaces data={params.row.assigned_places} />
        ),
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Acciones",
        width: 100,
        cellClassName: "actions",
        getActions: ({ id }) => {
          return [
            <GridActionsCellItem
              icon={<ModeEditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={() => {
                setFileList([]);
                setSelectTheRowID(null);

                setSelectTheRowID(rows[Number(id)]);
                setTimeout(() => {
                  console.log("99");
                }, 1000);

                handleOpenDialog();
              }}
              color="inherit"
            />,
          ];
        },
      },
    ];

    return columns;
  };



  const handleUpdateUser = async () => {
  
    try {
      const response = await updateUser(idUser.id_usuario, {
        nombre: userData.nombre===""?selectTheRowId.name:userData.nombre,
        url_image: userData?.image_url,
        activo: userData.activo,
        apellido_paterno: userData.apellido_paterno===""?selectTheRowId.last_name:userData.apellido_paterno,
        apellido_materno: userData.apellido_materno===""?selectTheRowId.second_last_name:userData.apellido_materno,
        fecha_nacimiento:userData.birthdate===""?selectTheRowId.birthdate:userData.birthdate,
        id_sexo: userData.sexo === "" ? (selectTheRowId.sex === "masculino" ? true : false) : userData.sexo,
        telefono_personal:userData.personal_phone===""?selectTheRowId.personal_phone:userData.personal_phone,
        telefono_empresa:userData.work_phone===""?selectTheRowId.work_phone:userData.work_phone,
        app_version:userData.app_version===""?selectTheRowId.app_version:userData.app_version,
      });

     

      const response1= await updateAccessUserById(idUser.id_acceso,{
        usuario:userData.username===""?selectTheRowId.user_name:userData.username,
        password:userData.password===""?selectTheRowId.password:userData.password,
        activo_app_movil:userData.access_mobil===""?(selectTheRowId.active_app_movil_access==="acceso permitido"?true:false):userData.access_mobil,
        activo_app_desktop:userData.access_web===""?(selectTheRowId.active_web_access==="acceso permitido"?true:false):userData.access_web,


        
      })


    

      setSnackbar({ children: "Se actualizo el usuario con exito", severity: "success" });


    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeDateTime = (newValue) => {
    console.log("New Date Selected:", newValue.format("YYYY-MM-DD"));
    setUserData((prev) => ({
      ...prev,
      birthdate: newValue.format("YYYY-MM-DD"),
    }));
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

  /**
   * Función que procesa la actualización de una fila.
   *
   * @param {Object} newRow - La nueva fila con los datos actualizados.
   * @param {Object} oldRow - La fila antigua con los datos originales.
   * @returns {Promise<Object>} - Una promesa que se resolverá con la fila antigua si no hay cambios o con la fila actualizada si hay mutaciones.
   * @throws {Error} - Se lanza un error si hay un problema durante la actualización.
   */
  const processRowUpdate = React.useCallback(
    /**
     * @param {Object} newRow - La nueva fila con los datos actualizados.
     * @param {Object} oldRow - La fila antigua con los datos originales.
     * @returns {Promise<Object>} - Una promesa que se resolverá con la fila antigua si no hay cambios o con la fila actualizada si hay mutaciones.
     * @throws {Error} - Se lanza un error si hay un problema durante la actualización.
     */
    (newRow, oldRow) =>
      new Promise((resolve, reject) => {
        // Calcula la mutación necesaria para la actualización
        const mutation = computeMutation(newRow, oldRow);

        // Verifica si hay una mutación
        if (mutation) {
          // Guarda los argumentos para resolver o rechazar la promesa más tarde
          setPromiseArguments({ resolve, reject, newRow, oldRow });
        } else {
          // No hubo cambios, resuelve la promesa con la fila antigua
          resolve(oldRow);
        }
      }),
    []
  );
  return (
    <Box
      sx={{
        height: 400,
        width: "100%",
        ".css-196n7va-MuiSvgIcon-root": {
          fill: "white",
        },
      }}
    >
      {renderConfirmDialog()}
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
        processRowUpdate={processRowUpdate}
      />
      {!!snackbar && (
        <Snackbar open onClose={handleCloseSnackbar} autoHideDuration={6000}>
          <Alert {...snackbar} onClose={handleCloseSnackbar} />
        </Snackbar>
      )}

      {isUpdateUserDialogOpen && (
        <Dialog
          fullScreen
          open={isUpdateUserDialogOpen}
          onClose={handleCloseDialog}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseDialog}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              {/*  <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Agrega nueva tarea
              </Typography> */}
              {/*  <Button autoFocus color="inherit"  onClick={handleClose}>
                Guardar
              </Button> */}
            </Toolbar>
          </AppBar>
          {/* Aqui va el contenido */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%", // Ajusta según sea necesario
            }}
          >
            <Paper
              sx={{
                width: "100%",
                height: "auto",
                boxShadow: 3,
                padding: "2rem",
                borderRadius: 1,
              }}
            >
              {/* Contenido real del Paper */}
              <Typography variant="body1" sx={{ mb: "2rem" }}>
                Detalles de Usuario
              </Typography>
              {/* nombre, :imagen, :activo, :orden, :icono_app_movil */}
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  {/*    <TextField
                    color="secondary"
                    sx={{ marginBottom: "2rem", width: "100%" }}
                    id="input-with-icon-textfield-nombre"
                    label="Nombre del rol"
                         onChange={handleInputOnChange}
                    value={rolData.nombre}  
                    defaultValue={selectTheRowId || ""}
                    type="text"
                    name="nombre"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  /> */}

                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "2rem", width: "100%" }}
                    id="input-with-icon-textfield-nombre"
                    label="Nombre"
                    onChange={handleInputOnChange}
                    value={userData.nombre || selectTheRowId.name}
                    type="text"
                    name="nombre"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />

                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "2rem", width: "100%" }}
                    id="input-with-icon-textfield-apellido-paterno"
                    label="Apellido Paterno"
                    onChange={handleInputOnChange}
                    value={
                      userData.apellido_paterno || selectTheRowId.last_name
                    }
                    type="text"
                    name="apellido_paterno"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />
                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "2rem", width: "100%" }}
                    id="input-with-icon-textfield-apellido-paterno"
                    label="Apellido Materno"
                    onChange={handleInputOnChange}
                    value={
                      userData.apellido_materno ||
                      selectTheRowId.second_last_name
                    }
                    type="text"
                    name="apellido_materno"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />

                  {/*  <TextField
                    color="secondary"
                    sx={{ marginBottom: "2rem", width: "100%" }}
                    id="input-with-icon-textfield-apellido-materno"
                    label="Apellido Materno"
                    onChange={handleInputOnChange}
                    value={userData.apellido_materno}
                    type="text"
                    name="apellido_materno"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  /> */}
                  {/*     {validateInputs.nombre ? (
                    <Stack sx={{ marginTop: "0.2rem" }} direction="row">
                      <FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
                      <Typography color={"secondary"} variant="caption">
                        ¡Gracias por ingresar un rol!
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "red" }} variant="caption">
                      * ¡Por favor, ingresa un rol!
                    </Typography>
                  )}  */}

                  <Upload
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    name="image_url"
                  >
                    {fileList.length >= 1 ? null : uploadButton}
                  </Upload>
                  <Modal
                    open={previewOpen}
                    title={previewTitle}
                    footer={null}
                    onCancel={handleCancel}
                  >
                    <img
                      alt="example"
                      style={{
                        width: "100%",
                      }}
                      src={previewImage}
                    />
                  </Modal>

                  {/* <DatePicker
          sx={{ width: "100%"}}
         onChange={(e) => changeControl(e, "fechaNacimiento")} 
          views={["year", "month", "day"]}
          format="DD-MM-YYYY"
          disableFuture
          label="Fecha de nacimiento"
          openTo="year"
        /> */}
                </Grid>
                <Grid item xs={4}>
                  {/*    <TextField
                    color="secondary"
                    sx={{ marginBottom: "2rem", width: "100%" }}
                    id="input-with-icon-textfield-nombre"
                    label="Nombre del rol"
                         onChange={handleInputOnChange}
                    value={rolData.nombre}  
                    defaultValue={selectTheRowId || ""}
                    type="text"
                    name="nombre"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  /> */}

                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "2rem", width: "100%" }}
                    id="input-with-icon-textfield-user-name"
                    label="Nombre Usuario"
                    onChange={handleInputOnChange}
                    value={userData.username || selectTheRowId.user_name}
                    type="text"
                    name="username"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />

                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "2rem", width: "100%" }}
                    id="input-with-icon-textfield-apellido-password"
                    label="Contraseña"
                    onChange={handleInputOnChange}
                    value={userData.password || selectTheRowId.password}
                    type="text"
                    name="password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />
                  <DatePicker
                    sx={{ width: "100%" }}
                    defaultValue={dayjs(selectTheRowId.birthdate || null)}
                    onChange={handleChangeDateTime}
                    value={dayjs(
                      userData.birthdate || selectTheRowId.birthdate
                    )}
                    views={["year", "month", "day"]}
                    format="DD-MM-YYYY"
                    disableFuture
                    label="Fecha de nacimiento"
                    openTo="year"
                    name="birthdate"
                  />

                  {/*    <InputLabel id="demo-simple-select-filled-label">
                      SubMenu
                    </InputLabel> */}
                  <Select
                    sx={{ width: "100%", marginTop: "1rem" }}
                    value={
                      userData.sexo || selectTheRowId.sex === "masculino"
                        ? "1"
                        : selectTheRowId.sex === "femenino"
                        ? "2"
                        : null
                    }
                    color="secondary"
                    labelId="demo-simple-select-filled-label-id-menu"
                    id="demo-simple-select-filled-id-menu"
                    name="sexo"
                    onChange={handleInputOnChange}
                  >
                    <MenuItem value="">
                      <em>Ningun</em>
                    </MenuItem>
                    <MenuItem value="1">
                      <em>masculino</em>
                    </MenuItem>
                    <MenuItem value="2">
                      <em>femenino</em>
                    </MenuItem>
                    {/*     {subMenus.map((subMenu) => (
                        <MenuItem key={subMenu.id} value={subMenu.id}>
                          {subMenu.nombre}{" "}
                       
                        </MenuItem>
                      ))} */}
                  </Select>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignContent: "center",
                      marginBottom: "2rem",
                      marginTop: "2rem",
                    }}
                  >
                    <InputLabel sx={{ alignSelf: "center" }}>Activo</InputLabel>
                    <Checkbox
                      {..."label"}
                      onChange={handleInputOnChange}
                      name="activo"
                      size="small"
                      color="secondary"
                      defaultChecked={
                        selectTheRowId.active === "activo" ? true : false
                      }
                    />

                    <InputLabel sx={{ alignSelf: "center" }}>
                      Acceso SER0 Web
                    </InputLabel>
                    <Checkbox
                      {..."label"}
                      onChange={handleInputOnChange}
                      name="access_web"
                      size="small"
                      color="secondary"
                      defaultChecked={
                        selectTheRowId.active_web_access === "acceso permitido"
                          ? true
                          : false
                      }
                    />
                    <InputLabel sx={{ alignSelf: "center" }}>
                      Acceso SER0 Mobil
                    </InputLabel>
                    <Checkbox
                      {..."label"}
                      onChange={handleInputOnChange}
                      name="access_mobil"
                      size="small"
                      color="secondary"
                      defaultChecked={
                        selectTheRowId.active_app_movil_access ===
                        "acceso permitido"
                          ? true
                          : false
                      }
                    />
                  </Box>

                  {/* <DatePicker
          sx={{ width: "100%"}}
         onChange={(e) => changeControl(e, "fechaNacimiento")} 
          views={["year", "month", "day"]}
          format="DD-MM-YYYY"
          disableFuture
          label="Fecha de nacimiento"
          openTo="year"
        /> */}
                </Grid>
                <Grid item xs={4}>
                  {/*    <TextField
                    color="secondary"
                    sx={{ marginBottom: "2rem", width: "100%" }}
                    id="input-with-icon-textfield-nombre"
                    label="Nombre del rol"
                         onChange={handleInputOnChange}
                    value={rolData.nombre}  
                    defaultValue={selectTheRowId || ""}
                    type="text"
                    name="nombre"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  /> */}

                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "2rem", width: "100%" }}
                    id="input-with-icon-textfield-personal-phone"
                    label="Telefono Personal"
                    onChange={handleInputOnChange}
                    value={
                      userData.personal_phone || selectTheRowId.personal_phone
                    }
                    type="text"
                    name="personal_phone"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />

                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "2rem", width: "100%" }}
                    id="input-with-icon-textfield-work-phone"
                    label="Telefono Trabajo"
                    onChange={handleInputOnChange}
                    value={userData.work_phone || selectTheRowId.work_phone}
                    type="text"
                    name="work_phone"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />

                  <TextField
                    color="secondary"
                    sx={{ marginBottom: "2rem", width: "100%" }}
                    id="input-with-icon-textfield-app-version"
                    label="App Version"
                    onChange={handleInputOnChange}
                    value={userData.app_version || selectTheRowId.app_version}
                    type="text"
                    name="app_version"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <GrServices />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />

                  <FormControl sx={{ m: 1, width: "100%" }}>
                    <InputLabel id="demo-multiple-chip-label">
                      Plazas Asignadas
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      multiple
                      value={selectTheRowId.assigned_places.split(", ")}
                      onChange={handleChangePrueba}
                      input={
                        <OutlinedInput id="select-multiple-chip" label="Chip" />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {names.map((name) => (
                        <MenuItem
                          key={name}
                          value={name}
                          style={getStyles(name, personName, theme)}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/*     {validateInputs.nombre ? (
                    <Stack sx={{ marginTop: "0.2rem" }} direction="row">
                      <FaRegCircleCheck style={{ color: "#14B814" }} />{" "}
                      <Typography color={"secondary"} variant="caption">
                        ¡Gracias por ingresar un rol!
                      </Typography>
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "red" }} variant="caption">
                      * ¡Por favor, ingresa un rol!
                    </Typography>
                  )}  */}

                  {/* <DatePicker
          sx={{ width: "100%"}}
         onChange={(e) => changeControl(e, "fechaNacimiento")} 
          views={["year", "month", "day"]}
          format="DD-MM-YYYY"
          disableFuture
          label="Fecha de nacimiento"
          openTo="year"
        /> */}
                </Grid>
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  marginTop: "2.5rem",
                }}
              >
                <Button
                  endIcon={<Sync />}
                  color="secondary"
                  variant="contained"
                  onClick={handleUpdateUser}
                >
                  Actualizar Usuario
                </Button>
              </Box>
            </Paper>
          </Box>
        </Dialog>
      )}
    </Box>
  );
}

export default DataGridUsers;
