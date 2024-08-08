import { Box, useTheme } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import {  tokens } from "../theme"
import { recaudadoGestor } from '../data/recaudado'
import PropTypes from 'prop-types'

const RecaudacionGestor = ({size_grid}) => {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const columns = [
        {
            field: "photo",
            headerName: "Foto",
            headerAlign: "center",
            flex: .6,
            renderCell: ({ row: { photo } }) => {
                return (
                    <Box
                        width="40%"
                        m="0 auto"
                        display="flex"
                        justifyContent="center"
                        borderRadius="4px"
                    >
                        <img style={{ width: '45px', height: '45px', minWidth: '45px', minHeight: '45px', borderRadius: '50%', background:'white' }} src={photo} alt="foto usuario" />
                    </Box>
                )
            },
        },
        {
            field: "name",
            headerName: "Nombre",
            headerAlign: "center",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "recaudado",
            headerName: "No gestiones",
            headerAlign: "center",
            align: "center",
            cellClassName: "name-column--cell",
        },
    ]

    return (

        <Box
            backgroundColor={colors.primary[700]}
            gridColumn={`span ${size_grid}`}
            borderRadius='10px'
            height='390px'
        >
            <Box
              
                height="100%"
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
                        color: colors.grey[200],
                        fontSize: "14px"
                      },
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.primary[400],
                        borderBottomColor: colors.greenAccent[700],
                      },
                      "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                      },
                      "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.primary[400],
                      },
                      "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                      },
                      "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.grey[100]} !important`,
                      },
                }}
            >

                <DataGrid rows={recaudadoGestor} columns={columns} autoPageSize />
            </Box>

        </Box>

    )

}

RecaudacionGestor.propTypes = { 
    size_grid: PropTypes.number.isRequired, 
}

export default RecaudacionGestor