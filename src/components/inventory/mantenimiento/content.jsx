import { Box } from "@mui/material"
import { useState } from "react"
import Agregar from "./agregar"
import Historial from "./historial"

const Content = () => {
    const [imagenes, setImagenes] = useState([])

    return (

        <Box sx={{ width: '100%', height: 'auto', display: 'flex', justifyContent: 'start', alignItems: 'start', mt: '40px', flexDirection:{ xs:'column-reverse', md:'row' }, gap:{ xs:'30px', md:'0px' } }}>
			<Historial imagenes={imagenes} />
			<Agregar imagenes={imagenes} setImagenes={setImagenes} />
        </Box>

    )

}

export default Content