import { Box, useTheme, Typography} from "@mui/material"
import { tokens } from "../../theme"
import Line from '../../components/NivoChart/Line'
import PropTypes from 'prop-types'

function DailyManagementNotPhoto({ data, typeConcept }) {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)
	const generateColor = () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`

	if (!data) {
		return null
	}

	const groupedData = data.reduce((acc, curr) => {
		const { month_year, concept, count } = curr
		if (!acc[month_year]) {
			acc[month_year] = {
				id: month_year,
				color: generateColor(),
				data: []
			}
		}
		acc[month_year].data.push({ x: concept.toString(), y: count })
		return acc
	}, {})
	
	const allDays = new Set()

	Object.values(groupedData).forEach(group => {
		group.data.forEach(point => {
			allDays.add(point.x)
		})
	})
	
	Object.values(groupedData).forEach(group => {
		const daySet = new Set(group.data.map(point => point.x))
		allDays.forEach(day => {
		if (!daySet.has(day)) {
			group.data.push({ x: day, y: 0 });
		}
		})
		group.data.sort((a, b) => parseInt(a.x) - parseInt(b.x))
	})

	const formattedData = Object.values(groupedData)
    
	return (

		<Box
			sx={{
				overflow: 'auto', 
				width: '100%',
				height: '450px'
			}}
		>   
			
			<Box
				sx={{ 
					overflow: 'hidden',
					backgroundColor: 'rgba(128, 128, 128, 0.1)',
					borderRadius: '10px',
					gridColumn: 'span 12',
					height: '100%',
					minWidth: {
						xs:'700px',
						md:'100%'
					},
					width: '100%'
				}}
			>

				<Box
					mt="10px"
					mb="-15px"
					p="0 10px"
					justifyContent="space-between"
					alignItems="center"
				>

					<Typography
						variant="h5"
						fontWeight="600"
						sx={{ 
							padding: "2px 30px 0 5px",
							textAlign: { xs: 'start', md: 'center' }
						}}
						color={colors.grey[200]}
						textAlign={'center'}
					>
						GESTIONES REALIZADAS SIN FOTO TOMADAS
					</Typography>
					
				</Box>

				{data.length > 0 && (
					<Line data={ formattedData } titlex={typeConcept === 'hour' ? 'horas del dia' : 'dias del mes'} />
				)}

			</Box>
			
		</Box>

	)

}

DailyManagementNotPhoto.propTypes = { 
    data: PropTypes.any.isRequired, 
    typeConcept: PropTypes.any.isRequired
}

export default DailyManagementNotPhoto