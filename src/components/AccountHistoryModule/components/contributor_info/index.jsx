import { Box, InputAdornment, TextField } from '@mui/material'
import React from 'react'
import RecentActorsIcon from '@mui/icons-material/RecentActors'
import GasMeterIcon from '@mui/icons-material/GasMeter'
import ListIcon from '@mui/icons-material/List'
import ReviewsIcon from '@mui/icons-material/Reviews'
import PersonIcon from '@mui/icons-material/Person'
import useCombinedSlices from '../../../../hooks/useCombinedSlices'

function ContributorInfo() {
	const {informationContributor}=useCombinedSlices()
	const[ help ]=React.useState(false)

	return (
			
		<>

			<Box sx={{display:"flex",flexDirection:"column"}}>
		
				<TextField
					helperText={help?"Informaciòn de la cuenta":null}
					color='secondary'
					sx={{marginBottom:"1rem"}}
					id="input-with-icon-textfield"
					label="Cuenta"
					value={(informationContributor && informationContributor.length > 0) ? informationContributor[0]?.["account"] || "" : ""}
					InputProps={{
					startAdornment: (
						<InputAdornment position="start">
						<RecentActorsIcon />
						</InputAdornment>
					),
					readOnly: true,
					}}
					variant="standard"
				/>

				<TextField
					helperText={help?"Informaciòn del propietario":null}
					color='secondary'
					size='small'
					sx={{width:"13rem"}}
					id="input-with-icon-textfield"
					label="Propietario"
					value={(informationContributor && informationContributor.length > 0) ? informationContributor[0]?.["owner_name"] || "" : ""}
					InputProps={{
					startAdornment: (
						<InputAdornment position="start">
						<PersonIcon />
						</InputAdornment>
					),
					readOnly: true,
					}}
					variant="standard"
				/>

			</Box>

			<Box sx={{display:"flex",flexDirection:"column"}}>

				<TextField
					helperText={help?"Informaciòn del servicio":null}
					color='secondary'
					sx={{marginBottom:"1rem"}}
					id="input-with-icon-textfield"
					label="Servicio"
					value={(informationContributor && informationContributor.length > 0) ? informationContributor[0]?.["type_service"] || "" : ""}
					InputProps={{
						startAdornment: (
						<InputAdornment position="start">
							<ListIcon />
						</InputAdornment>
						),
						readOnly: true,
					}}
					variant="standard"
				/>

				<TextField
					helperText={help?"informaciòn de la tarifa":null}
					color='secondary'
					size='small'
					sx={{width:"13rem"}}
					id="input-with-icon-textfield"
					label="Tipo de tarifa"
					value={(informationContributor && informationContributor.length > 0) ? informationContributor[0]?.["rate_type"] || "" : ""}
					InputProps={{
						startAdornment: (
						<InputAdornment position="start">
							<ReviewsIcon />
						</InputAdornment>
						),
						readOnly: true,
					}}
					variant="standard"
				/>

			</Box>
			
			<Box sx={{display:"flex",flexDirection:"column"}}>
				
				<TextField
					helperText={help?"Informaciòn del turno":null}
					color='secondary'
					sx={{marginBottom:"1rem"}}
					id="input-with-icon-textfield"
					label="Turno"
					value={(informationContributor && informationContributor.length > 0) ? informationContributor[0]?.["turn"] || "" : ""}
					InputProps={{
						startAdornment: (
						<InputAdornment position="start">
							<RecentActorsIcon />
						</InputAdornment>
						),
						readOnly: true,
					}}
					variant="standard"
				/>

				<TextField
					helperText={help?"Informaciòn de la serie del medidor":null}
					color='secondary'
					size='small'
					sx={{width:"13rem"}}
					id="input-with-icon-textfield"
					label="Serie de Medidor"
					value={(informationContributor && informationContributor.length > 0) ? informationContributor[0]?.["meter_series"] || "" : ""}
					InputProps={{
						startAdornment: (
						<InputAdornment position="start">
							<GasMeterIcon />
						</InputAdornment>
						),
						readOnly: true,
					}}
					variant="standard"
				/>

			</Box>
	
		</>
   
	)

}

export default ContributorInfo