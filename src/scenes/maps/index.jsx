import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import Header from '../../components/Header'
import { useSelector } from 'react-redux'
import { getPlacesByUserId } from '../../services/place.service'
import Card from '../../components/Card'

const Index = () => {
  
    const user = useSelector(state => state.user)

    const [plazas, setPlazas] = useState([])

    useEffect(() => {

		const getPlazasByUser = async () => {
			const res = await getPlacesByUserId(user.user_id)
			setPlazas(res)
		}
	
		
        getPlazasByUser()

    }, [user.user_id])


    return (
		
        <Box m='20px' padding='20px 10px' >

            <Header title="Mapa GIS" subtitle="Selecciona la plaza" />

            <Box display='flex' justifyContent='space-evenly' alignItems='center' flexWrap='wrap'
                sx={{  margin: '20px 0', borderRadius: '10px' }}>

                {plazas && plazas.length > 0 && plazas.map(p => (
                    <Card key={ p.place_id } place={ p } />
                ))}

            </Box>

        </Box>
		
    )

}

export default Index