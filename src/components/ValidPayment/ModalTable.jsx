import React, { useState, useEffect } from "react";
import { Box, useTheme, Button, Avatar, Modal} from "@mui/material";
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import Chip from '@mui/material/Chip';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ImageViewerModal from '../../components/ImageViewerModal.jsx'

function ModalTable({ open, onClose, data }) {
  
  const [columns, setColumns] = useState([]);  

  const buildColumns = () => {      
    if (data.length > 0) {
      const firstRow = data[0];
      const dynamicColumns = Object.keys(firstRow).map((key) => {
        
        if (key === 'id') {
          return null;
        }

        if (key === 'urlImagenFachada' || key === 'urlImagenEvidencia') {
          return {
            field: key,
            headerName: key.toUpperCase(),
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{key.toUpperCase()}</strong>
            ),
            renderCell: (params) => <AvatarImage data={params.value} />,              
            width: 150,
            sortable: false,
            filterable: false,
          };
        }

        if (key === 'foto fachada predio') {
          return {
            field: key,
            headerName: key.toUpperCase(),
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{key.toUpperCase()}</strong>
            ),
            renderCell: (params) => (
              <Chip
                icon={params.value === 'si' ? <CheckCircleIcon style={{ color: 'green' }} /> : <ErrorIcon style={{ color: 'red' }} />}
                label={params.value}
                color={params.value === 'si' ? 'secondary' : 'error'}
                variant="outlined"
              />
            ),
            width: 150,
            sortable: false,
            filterable: false,
          };
        }

        if (key === 'foto evidencia predio') {
          return {
            field: key,
            headerName: key.toUpperCase(),
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{key.toUpperCase()}</strong>
            ),
            renderCell: (params) => (
              <Chip
                icon={params.value === 'si' ? <CheckCircleIcon style={{ color: 'green' }} /> : <ErrorIcon style={{ color: 'red' }} />}
                label={params.value}
                color={params.value === 'si' ? 'secondary' : 'error'}
                variant="outlined"
              />
            ),
            width: 150,
            sortable: false,
            filterable: false,
          };
        }

        if (key === 'estatus de gestion valida') {
          return {
            field: key,
            headerName: key.toUpperCase(),
            renderHeader: () => (
              <strong style={{ color: "#5EBFFF" }}>{key.toUpperCase()}</strong>
            ),
            renderCell: (params) => (
              <Chip
                icon={params.value === 'valida' ? <CheckCircleIcon style={{ color: 'green' }} /> : <ErrorIcon style={{ color: 'red' }} />}
                label={params.value}
                color={params.value === 'valida' ? 'secondary' : 'error'}
                variant="outlined"
              />
            ),
            width: 150,
            sortable: false,
            filterable: false,
          };
        }

        return {
          field: key,
          headerName: key.toUpperCase(),
          renderHeader: () => (
            <strong style={{ color: "#5EBFFF" }}>{key.toUpperCase()}</strong>
          ),
          width: 210,
          editable: false,
        };
      }).filter((column) => column !== null);

      setColumns(dynamicColumns);
    }
  };  
  
  useEffect(() => {
    buildColumns();
  }, [data]);  

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
  
      {visibleAvatar && (
        <ImageViewerModal
          open={true}
          onClose={() => setVisibleAvatar(false)}
          imageUrl={data}
        />
      )}
        
      </>
    );
  };
    
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ width: '80%', maxHeight: 500, overflow: 'auto', bgcolor: 'background.paper', mx: 'auto', my: 4, p: 2, borderRadius: 4 }}>
        <Typography variant="h6" gutterBottom component="div">
          Registros encontrados
        </Typography>
        <DataGrid
          rows={data}
          columns={columns}          
        />
      </Box>
    </Modal>
  )
}

export default ModalTable