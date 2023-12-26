import { Avatar, Box, IconButton } from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import React from "react";
import { getAllServices } from "../../../../api/service";

import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { BiSolidImageAdd } from "react-icons/bi";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";



const AvatarImage = ({
    data,
   /*  handleClickOpen,
    setUrl,
    setGetRowData,
    getDataRow,
    field, */
  }) => {
    if (!data) {
      return (
        <IconButton
        /*   onClick={() => {
            handleClickOpen();
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
          }} */
          aria-label="delete"
        >
          <BiSolidImageAdd />
        </IconButton>
      );
    } else {
      return (
        <Avatar
         /*  onClick={(e) => {
            handleClickOpen();
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
          }} */
          alt="Remy Sharp"
          src={data}
        />
      );
    }
  };
function DataGridServiceCrud() {


    const [rows, setRows] = React.useState([]);

  
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
            /*   setGetRowData={setGetRowData}
              getDataRow={params.row}
              
              handleClickOpen={handleClickOpen}
              setUrl={setUrl}
              field={"imagen"} */
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
            data={params.row.imagen}
             /*  setGetRowData={setGetRowData}
              getDataRow={params.row}
              data={params.row.icono_app_movil}
              handleClickOpen={handleClickOpen}
              setUrl={setUrl}
              field={"icono_app_movil"} */
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
  

  return (
    <Box style={{ height: 400, width: "100%" }}>
      <DataGrid  rows={rows} columns={buildColumns()}/>
    </Box>
  );
}

export default DataGridServiceCrud;
