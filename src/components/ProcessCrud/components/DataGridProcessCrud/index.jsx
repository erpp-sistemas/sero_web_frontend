import React from "react";
import { getAllProcesses } from "../../../../api/process";
import { Avatar, IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
function DataGridProcess() {
  const [rows, setRows] = React.useState([]);


  const fetchProcesses = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAllProcesses();

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

  React.useEffect(() => {
    /**
     * Función asíncrona para obtener y establecer los datos de las tareas.
     *
     * @function
     * @async
     * @private
     */

    fetchProcesses();
  }, []);

   /**
   * Componente funcional que representa una imagen de avatar con funcionalidad adicional.
   *
   * @component
   * @name AvatarImage
   * @param {object} props - Propiedades del componente.
   * @param {string} props.data - Datos de la imagen del avatar.
   * @param {Function} props.handleClickOpen - Función para manejar la apertura de un diálogo.
   * @param {Function} props.getDataRow - Función para obtener datos de una fila.
   * @returns {JSX.Element} Elemento JSX que representa la imagen de avatar.
   */
   const AvatarImage = ({ data, handleClickOpen, getDataRow }) => {
    return (
      <Avatar
       /*  onClick={() => {
          handleClickOpen();
          setGetRowData(getDataRow);
        }} */
        alt="Remy Sharp"
        src={data}
      />
    );
  };
  /**
   * Componente funcional que representa una celda con marca de verificación o cruz.
   *
   * @component
   * @name CheckCell
   * @param {object} props - Propiedades del componente.
   * @param {boolean} props.data - Datos para determinar si mostrar la marca de verificación o cruz.
   * @returns {JSX.Element} Elemento JSX que representa la celda con marca de verificación o cruz.
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
   * Maneja el evento de confirmación al hacer clic en "Sí" en el cuadro de diálogo de confirmación.
   *
   * @function
   * @name handleYes
   * @async
   * @throws {Error} Se lanza un error si ocurre un problema al realizar la operación.
   * @returns {Promise<void>} Una promesa que se resuelve después de realizar la operación.
   */

    /**
   * Construye y devuelve las columnas para la tabla de procesos.
   *
   * @function
   * @name buildColumns
   * @returns {Array} - Un array de objetos que representa las columnas de la tabla.
   */
    const buildColumns = () => {
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
          width: 130,
          editable: true,
        },
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
          width: 100,
          editable: false,
          renderCell: (params) => (
            <AvatarImage
             /*  handleClickOpen={handleClickOpen}
              getDataRow={params.row} */
              data={params.row.imagen}
            />
          ),
        },
        {
          field: "activo",
          type: "boolean",
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>
              {"Estado"}
              {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
              📃
              </span> */}
            </strong>
          ),
          width: 80,
          editable: true,
          renderCell: (params) => <CheckCell data={params.row.activo} />,
        },
        {
          field: "procedimiento_almacenado_gestion",
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>
              {"Procedimiento Almacenado"}
              {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
              📃
              </span> */}
            </strong>
          ),
          width: 200,
          editable: true,
        },
        {
          field: "procedimiento_almacenado_gestion_grafico",
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>
              {"Procedimiento Almacenado Gestion Grafico"}
              {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
              📃
              </span> */}
            </strong>
          ),
          width: 300,
          editable: true,
        },
        {
          field: "tabla_gestion",
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>
              {"Tabla Gestion"}
              {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
              📃
              </span> */}
            </strong>
          ),
          width: 180,
          editable: true,
        },
        {
          field: "url_aplicacion_movil",
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>
              {"Url Aplicacion Movil"}
              {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
              📃
              </span> */}
            </strong>
          ),
          width: 180,
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
             /*    onClick={() => handleDeleteClick(id)} */
                color="inherit"
              />,
            ];
          },
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
      ];
  
      return columns;
    };
  return  <DataGrid
  rows={rows}
  columns={buildColumns()}
 
/>;
}

export default DataGridProcess;
