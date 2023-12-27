import {
  AppBar,
  Avatar,
  Box,
  Button,
  Dialog,
  Grid,
  IconButton,
  Paper,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import React from "react";
import { getAllServices, updateService } from "../../../../api/service";

import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { BiSolidImageAdd } from "react-icons/bi";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import EmptyImage from "../../../../assets/image/empty-image.jpg";
import { uploadToS3 } from "../../../../services/s3.service";
function DataGridServiceCrud() {
  // Estado para almacenar la URL
  const [url, setUrl] = React.useState(
    "https://www.generationsforpeace.org/wp-content/uploads/2018/03/empty.jpg"
  );
  const [rows, setRows] = React.useState([]);
  const [isImageDialogOpen, setIsImageDialogOpen] = React.useState(false);
   // Estado para almacenar la imagen seleccionada
   const [selectedImage, setSelectedImage] = React.useState('');
   const [getRowData,setGetRowData] = React.useState()
   const [singnedUrl, setSignedUrl] = React.useState(null);
  const [serviceData, setServiceData] = React.useState({
    nombre: "",
    imagen: "",
    activo: Boolean(""),
    orden: Number(""),
    icono_app_movil: "",
  });

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }

    try {
      const fileUrl = await uploadToS3(file);
      console.log("URL del archivo subido:", fileUrl);

      setSignedUrl(fileUrl);
      // Configura el mensaje de Snackbar en caso de éxito
      setSnackbar({
       
        children: 'Archivo subido exitosamente',
        severity: 'success',
      });
    } catch (error) {

      setSnackbar({
    
        children: 'Error al subir archivo. Por favor, inténtalo de nuevo.',
        severity: 'error',
      });
      console.error("Error al subir archivo:", error.message);
      // Handle the error according to your requirements
    }
  };

  console.log(serviceData);

  const handleOpenImageDialog = () => {
    setIsImageDialogOpen(true);
  };

  const handleCloseImageDialog = () => {
    setIsImageDialogOpen(false);
  };

  const AvatarImage = ({
    data,
    setGetRowData,
    getDataRow,
    field,
    setUrl
    /*  handleClickOpen,
      ,
      ,
      ,
      , */
  }) => {
    console.log(getDataRow);
   
    if (!data) {
      return (
        <IconButton
             onClick={() => {
              handleOpenImageDialog();
              switch (field) {
                case "imagen":
                  setGetRowData({ ...getDataRow, field: field });
    
                  break;
    
                case "icono_app_movil":
                  setGetRowData({ ...getDataRow, field: field });
    
                  break;
    
                default:
                  break;
              }
            }}
          aria-label="delete"
        >
          <BiSolidImageAdd />
        </IconButton>
      );
    } else {
      return (
        <Avatar
          onClick={(e) => {
            handleOpenImageDialog();
            setUrl(e.target.src);
             
              switch (field) {
                case "imagen":
                  setGetRowData({ ...getDataRow, field: field });
    
                  break;
    
                case "icono_app_movil":
                  setGetRowData({ ...getDataRow, field: field });
    
                  break;
    
                default:
                  break;
              } 
          }}
          alt="Remy Sharp"
          src={data }
        />
      );
    }
  };

  React.useEffect(() => {
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
        const response = await getAllServices();

        // Agrega el campo 'id_tarea' a cada fila usando el índice como valor único si no no se ven en la datagrid
        const rowsWithId = response.map((row, index) => ({
          ...row,
          id: row.id_servicio || index.toString(),
        }));

        setRows(rowsWithId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const buildColumns = () => {
    /**
     * The configuration for a column in the data grid.
     *
     * @typedef {Object} ColumnConfig
     * @property {string} field - The field identifier for the column.
     * @property {Function} [renderHeader] - The function to render the header content.
     * @property {number} [width] - The width of the column.
     * @property {boolean} [editable] - Indicates whether the column is editable.
     * @property {Function} [renderCell] - The function to render the cell content.
     * @property {string} [type] - The type of the column (e.g., 'boolean', 'dateTime').
     * @property {string} [cellClassName] - The class name for the cell.
     * @property {Function} [getActions] - The function to get actions for the cell.
     */
    const columns = [
      {
        field: "nombre",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Nombre"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
          📃
          </span> */}
          </strong>
        ),
        width: 180,
        editable: true,
      },
      /*  {
          field: "fecha_ingreso",
          type: "dateTime",
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>
              {"Fecha de Ingreso"}
              
            </strong>
          ),
          valueGetter: ({ value }) => {
            return value && new Date(value);
          },
          width: 180,
          editable: true,
        }, */
      {
        field: "imagen",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Imagen"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
          📃
          </span> */}
          </strong>
        ),
        width: 200,
        editable: false,
        renderCell: (params) => (
          <AvatarImage
            data={params.row.imagen}
            setGetRowData={setGetRowData}
            getDataRow={params.row}
            field={"imagen"} 
            setUrl={setUrl}
            /*  
              
              
              handleClickOpen={handleClickOpen}
              
              */
          />
        ),
      },
      {
        field: "icono_app_movil",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Icono de App Movil"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
          📃
          </span> */}
          </strong>
        ),
        width: 200,
        editable: true,
        renderCell: (params) => (
          <AvatarImage
          data={params.row.icono_app_movil}
              setGetRowData={setGetRowData}
              getDataRow={params.row}
           /*    data={params.row.icono_app_movil} */
              /* handleClickOpen={handleClickOpen} */
              setUrl={setUrl}
              field={"icono_app_movil"} 
          />
        ),
      },
      {
        field: "activo",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Estado"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
          📃
          </span> */}
          </strong>
        ),
        width: 80,
        type: "boolean",
        editable: true,
        renderCell: (params) => <CheckCell data={params.row.activo} />,
      },
      {
        field: "orden",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Orden"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
          📃
          </span> */}
          </strong>
        ),
        width: 100,
        editable: true,
      },
      {
        field: "actions",
        type: "actions",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Acciones"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
              📃
              </span> */}
          </strong>
        ),
        width: 100,
        cellClassName: "actions",
        getActions: ({ id }) => {
          return [
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              /*   onClick={() => handleDeleteClick(id)} */
              color="inherit"
            />,
          ];
        },
      },
    ];

    return columns;
  };

  /**
   * CheckCell component for rendering an IconButton with check or clear icon based on data.
   *
   * @component
   * @param {Object} props - The component props.
   * @param {boolean} props.data - Boolean data to determine the icon.
   * @returns {JSX.Element} - The rendered CheckCell component.
   *
   * @example
   * // Usage example
   * <CheckCell data={true} />
   */
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



  /**
   * Handles the save operation for the updated row data.
   *
   * @async
   * @function
   *
   * @throws {Error} If there is an error during the save operation.
   *
   * @example
   * // Usage example
   * // Assuming getRowData is an object you want to update and getUrl is the API endpoint
   * handleSave();
   */

  const handleSave = async () => {


    
    /**
     * The updated row data object.
     *
     * @typedef {Object} UpdatedRowData
     * @property {string} id - The unique identifier of the row.
     * @property {string} field - The field to be updated (e.g., "imagen", "icono_app_movil").
     * @property {string} imagen - The updated image URL.
     * @property {string} icono_app_movil - The updated icon URL for the mobile app.
     * @property {string} ... - Other properties of the row data.
     */
     console.log(getRowData);
    if (getRowData) {
      try {
        // Assuming getRowData is an object you want to update and getUrl is the API endpoint

        // Modify the getRowData object with the new getUrl value

        let updatedRowData;
        switch (getRowData.field) {
          case "imagen":
            updatedRowData = { ...getRowData, imagen: singnedUrl };

            break;

          case "icono_app_movil":
            updatedRowData = { ...getRowData, icono_app_movil: singnedUrl };

            break;

          default:
            // Si field no coincide con ninguna condición, usa un valor predeterminado o maneja según tu lógica
            updatedRowData = { ...getRowData };
            break;
        }

        // Make a PUT request using the updatedRowData
        /*    console.log(updatedRowData);
         */
        
        const response = await updateService(getRowData.id, updatedRowData)
        
        // You can handle the response as needed
        console.log("Save successful:", response.data);
        // If you want to close something after successful save, uncomment the following line
        handleCloseImageDialog();
      } catch (error) {
        console.error("Error al cargar la imagen:", error);
      }
    }
  };

  return (
    <Box style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={buildColumns()} />
      {isImageDialogOpen && (
        <Dialog
          fullScreen
          open={isImageDialogOpen}
          onClose={handleCloseImageDialog}
        >
          <AppBar sx={{ position: "relative" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseImageDialog}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              {/* <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Sound
              </Typography>
              <Button autoFocus color="inherit" onClick={handleClose}>
                Gua
              </Button> */}
            </Toolbar>
          </AppBar>
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
                width: "40%",
                height: "70%",
                boxShadow: 3,
                padding: "2rem",
                borderRadius: 1,
              }}
            >
              {/* Contenido real del Paper */}
              <Typography variant="body1" sx={{ mb: "2rem" }}>
                Cambiar Imagen
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={6}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  ><Box sx={{display:"felx",flexDirection:"column"}}>
                    <img
                      className="rounded-full h-36 w-36 object-cover"
                      src={selectedImage || url}
                    />
                      <TextField
                  type="file"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    inputProps: {
                      accept: "image/*", // specify accepted file types if needed
                    },
                  }}
                  onChange={handleFileChange}
                />
                </Box>
                  </Grid>

                  <Grid item xs={6}>
                    Caracteristicas
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "end" }}>
                <Button onClick={handleSave}
                  color="secondary"
                  variant="contained" /* onClick={handleAddTask} */
                >
                  Guardar Imagen
                </Button>
              </Box>
            </Paper>
          </Box>
        </Dialog>
      )}
    </Box>
  );
}

export default DataGridServiceCrud;
