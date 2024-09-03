import React from 'react'
import { Button } from '@mui/material'

const ButtonUi = ({ width, padding, bgColor, bgColorHover, mt, fontWeight, handle, title, icon = '' }) => {
    return (
        <Button sx={{
            backgroundColor: bgColor, width, padding, marginTop: mt, fontWeight: 'bold', ":hover": {
                bgcolor: bgColorHover
            }
        }} startIcon={icon !== '' ? icon : ''}
            onClick={handle}
        >
            {title}
        </Button>
    )
}

export default ButtonUi