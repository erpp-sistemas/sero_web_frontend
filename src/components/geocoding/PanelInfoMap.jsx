import React from 'react'
import { useSelector } from 'react-redux';
import { Button } from '@mui/material'

import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';

const PanelInfoMap = ({ resetMarkers }) => {
    const comparacion = useSelector(c => c.dataGeocoding?.cordendasComparacion);
    return (
        <>
            {
                comparacion?.length ?
                    <>
                        {
                            comparacion.map(c => (
                                <div key={c.id} style={{ color: 'black', padding: "5px" }}>
                                    <Button variant='contained' sx={{ backgroundColor: c.color, width: "30px", marginRight: "10px" }}> {c.text}</Button>{c.cuenta}
                                </div>
                            ))
                        }
                        <div style={{ display: 'flex' }}>
                            <Button variant='contained' color='primary' onClick={resetMarkers} sx={{ margin: "0 0 0 auto", marginRight: "10px" }} > <KeyboardReturnIcon /> Regresar </Button>
                        </div>
                    </>
                    : ""
            }
        </>
    )
}

export default PanelInfoMap