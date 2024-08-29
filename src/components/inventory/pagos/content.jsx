import React from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import Verificacion from './verificacion'
import Tenencia from './tenencia'
import Placas from './placas'
import Extraordinarios from './Extraordinarios'

function Content() {
	
	const [selectedTab, setSelectedTab] = React.useState(0)

	const handleChange = (event, newValue) => {
		setSelectedTab(newValue)
	}

	return (

		<Box sx={{ width: '100%', padding: '20px', backgroundColor: '#282c34', color: '#fff', mt:'30px', overflowY:'hidden', overflowX:'scroll' }}>

			<Typography variant="h4" gutterBottom>Historial de Pagos</Typography>

			<Tabs
				value={selectedTab}
				onChange={handleChange}
				sx={{
					marginBottom: '20px',
					minWidth:'700px',
					'& .MuiTab-root': {
						color: 'gray',
						transition: 'color 0.3s',
					},
					'& .Mui-selected': {
						color: 'white', 
						fontWeight: 'bold',
					},
					'& .MuiTabs-indicator': {
						backgroundColor: '#38b000',
					},
				}}
				>
					<Tab label="Verificación" />
					<Tab label="Tenencia" />
					<Tab label="Placas" />
					<Tab label="Pagos Extraordinarios" />
				</Tabs>

			{ selectedTab === 0 && <Verificacion /> }
			{ selectedTab === 1 && <Tenencia /> }
			{ selectedTab === 2 && <Placas /> }
			{ selectedTab === 3 && <Extraordinarios /> }

		</Box>

	)

}

export default Content