import React from "react";
import { getAllSubMenus } from "../../../../api/submenu";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { AddOutlined } from "@mui/icons-material";
import { FaRegCircleCheck } from "react-icons/fa6";
import { TbZoomCancel } from "react-icons/tb";
import { GrServices } from "react-icons/gr";
import CloseIcon from "@mui/icons-material/Close";
import { Sync, SyncAltOutlined } from "@mui/icons-material";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as faIcons from '@fortawesome/free-solid-svg-icons'
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



const FaIcon = ({data})=>{
    const [iconNames, setIconNames] = React.useState([]);
    const [randomColor, setRandomColor] = React.useState('');
  
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
  
    React.useEffect(() => {
      // Obtener los nombres de los iconos al montar el componente
      const names = Object.keys(faIcons);
      console.log(names);
      setIconNames(names);
  
      // Generar el color aleatorio y establecerlo solo durante el montaje
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      setRandomColor(color);
    }, []); 
  
    const getFilteredIconName = (data) => {
      return iconNames.find((iconName) =>{ 
       
        
        return iconName === data});
    };
  
    const filteredIconName = getFilteredIconName(data);
    
  
    return filteredIconName ? (<>
      <IconButton  onClick={handleClick} sx={{ bgcolor: randomColor }} size="small">
        {<FontAwesomeIcon icon={faIcons[`${filteredIconName}`]} /> }
      </IconButton>
       <Menu
       id="basic-menu"
       anchorEl={anchorEl}
       open={open}
       onClose={handleClose}
       MenuListProps={{
         'aria-labelledby': 'basic-button',
       }}
     >
       <MenuItem>Profile</MenuItem>
       <MenuItem >My account</MenuItem>
       <MenuItem >Logout</MenuItem>
     </Menu>
     </>
      
    ) : data;
  
  }

function DataGridSubMenuCrud() {
  const [rows, setRows] = React.useState([]);

  const fetchSubMenus = async () => {
    try {
      // Aquí deberías hacer tu solicitud de red para obtener los datos
      // Reemplaza 'TU_URL_DE_DATOS' con la URL real de tus datos
      const response = await getAllSubMenus();

      // Agrega el campo 'id_menu' a cada fila usando el índice como valor único si no no se ven en la datagrid
      const rowsWithId = response.map((row, index) => ({
        ...row,
        id: row.id_sub_menu,
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

    fetchSubMenus();
  }, []);

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
        width: 180,
        editable: true,
      },

      {
        field: "descripcion",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Descripción"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
          </strong>
        ),
        width: 180,
        editable: true,
      },

      {
        field: "id_sub_menu",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Sub Menu"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
          </strong>
        ),
        width: 180,
        editable: true,
      },
      {
        field: "id_menu_padre",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Menu Padre"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
          </strong>
        ),
        width: 180,
        editable: true,
      },

      {
        field: "url",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Url"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
          </strong>
        ),
        width: 180,
        editable: true,
      },
      {
        field: "icono",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Icono"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
          </strong>
        ),
        width: 180,
        editable: true,
        renderCell: (params) => (
            <FaIcon
              data={params.row.icono}
             
              
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
        field: "icon_mui",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Icon Mui"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
          </strong>
        ),
        width: 180,
        editable: true,
        /* renderCell: (params) => (
          <AvatarImage
            data={params.row.icon_mui}
           
            
          />
        ), */
      },
      {
        field: "route",
        renderHeader: () => (
          <strong style={{ color: "#5EBFFF" }}>
            {"Ruta"}
            {/*    <span role="img" aria-label="task" style={{color:"#5EBFFF"}}>
        📃
        </span> */}
          </strong>
        ),
        width: 180,
        editable: true,
      },
    ];
    return columns;
  };

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
      {" "}
      <DataGrid rows={rows} columns={buildColumns()} />
    </Box>
  );
}

export default DataGridSubMenuCrud;
