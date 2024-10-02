import React, { useState, useEffect } from "react";
import { Box, useTheme, Modal} from "@mui/material";
import Typography from '@mui/material/Typography';
import AmountOfProcedures from '../SecondSection/ModalChart/AmountOfProcedures.jsx'


function ModalChart({ open, onClose, amountValidProcedures, amountInvalidProcedures }) {    
    
  return (
    <Modal 
      open={open} 
      onClose={onClose} 
      aria-labelledby="pie-chart-title"
      aria-describedby="pie-chart-description"
    >
        <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            width: 600, 
            bgcolor: 'background.paper', 
            boxShadow: 24, 
            p: 4,
            borderRadius: '8px'
        }}>
            <Typography 
              id="pie-chart-title" 
              variant="h6" 
              component="h2" 
              gutterBottom
              sx={{           
                color: "#5EBFFF",
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
                MONTO PAGADO
            </Typography>
            <Box style={{ height: 600 }}>
                <AmountOfProcedures 
                  amountValidProcedures ={amountValidProcedures}
                  amountInvalidProcedures={amountInvalidProcedures}
                /> 
            </Box>
        </Box>
    </Modal>
  )
}

export default ModalChart