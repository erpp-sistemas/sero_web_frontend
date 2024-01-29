import { useState } from 'react'
import { Box, Button, useTheme, Modal, Typography, Select, MenuItem } from '@mui/material';
import GridOnIcon from '@mui/icons-material/GridOn';
import { tokens } from "../theme";
import { DataGrid } from "@mui/x-data-grid";




const ModalNamePolygon = ({ setShowModal, poligonosDibujados }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: '#EAF0F0',
        boxShadow: 24,
        pt: 4,
        px: 4,
        pb: 4,
        borderRadius: '10px'
    };

    const [open, setOpen] = useState(true);


    const handleClose = () => {
        setOpen(false);
        setShowModal(false)
    };

    const rows = [
        { id: 1, name_polygon: 'Poligono1', cuentas: 24 },
        { id: 2, name_polygon: 'Poligono2', cuentas: 100 },
    ];

    const columns = [
        {
            field: "id",
            headerName: "Id",
            flex: 1,
            headerAlign: "center",
            cellClassName: "name-column--cell",
        },
        {
            field: "name_polygon",
            headerName: "Poligono",
            headerAlign: "center",
            align: "center",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "cuentas",
            headerName: "Número cuentas",
            headerAlign: "center",
            align: "center",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "gestor",
            headerName: "Gestor",
            flex: 1,
            headerAlign: "center",
            renderCell: () => {
                return (
                    <Box
                        width="90%"
                        m="0 auto"
                        p="5px"
                        display="flex"
                        justifyContent="center"
                        borderRadius="4px"
                    >
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={10}
                            //onChange={handleChange}
                            label="Age"
                            sx={{ color: 'black' }}
                        >
                            <MenuItem value={10}>Selecciona el gestor</MenuItem>
                            <MenuItem value={40}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </Box>
                );
            },
        },
    ];

    return (
        <div>
            {/* <Button onClick={handleOpen}>Open modal</Button> */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: '66%', height: '500px' }}>
                    <Typography
                        sx={{ fontSize: '20px', marginBottom: '10px', color: colors.primary[500] }}>Poligonos seleccionados
                    </Typography>
                    <p sx={{ marginTop: '10px' }} id="parent-modal-description">
                        <Typography sx={{ fontSize: '16px', color: colors.grey[400], display: 'inline-block' }}>
                            Información de todos los poligonos creados, puedes crear una asignación a partir de estos poligonos
                        </Typography>
                    </p>
                    <Box
                        sx={{ marginTop: '15px' }}
                    >

                        <Box
                            m="20px auto"
                            height="50vh"
                            sx={{
                                "& .MuiDataGrid-root": {
                                    border: "none",
                                    textAlign: "center"
                                },
                                "& .MuiDataGrid-cell": {
                                    borderBottom: "none",
                                    textAlign: "center !important"
                                },
                                "& .name-column--cell": {
                                    color: 'black',
                                    fontSize: "14px"
                                },
                                "& .MuiDataGrid-columnHeaders": {
                                    backgroundColor: colors.grey[600],
                                    borderBottomColor: colors.greenAccent[700],
                                },
                                "& .MuiDataGrid-virtualScroller": {
                                    backgroundColor: '#EAF0F0',
                                    color: 'black'
                                },
                                "& .MuiDataGrid-footerContainer": {
                                    borderTop: "none",
                                    backgroundColor: colors.grey[600],
                                },
                                "& .MuiCheckbox-root": {
                                    color: `${colors.greenAccent[200]} !important`,
                                },
                                "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                                    color: `${colors.grey[100]} !important`,
                                },
                            }}
                        >
                            <DataGrid rows={poligonosDibujados} columns={columns} autoPageSize />
                        </Box>

                        <Button variant="contained" endIcon={<GridOnIcon />}
                            sx={{ backgroundColor: colors.greenAccent[600], margin: '10px 0' }}

                        >
                            Aceptar
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}

export default ModalNamePolygon