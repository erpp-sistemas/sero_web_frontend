import { Box, useTheme, Typography} from "@mui/material"
import { tokens } from "../../theme";
import Line from '../../components/NivoChart/Line'
import PropTypes from 'prop-types'

function MonthlyPayments({ data, typeConcept }) {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

	if (!data) {
		return null
	}
    
	return (

		<Box
			id="grid-1"
			display="grid"
			gridTemplateColumns="repeat(12, 1fr)"
			gridAutoRows="490px"
			gap="15px"
			width='100%'      
			padding='5px'
		>   

			<Box
				gridColumn='span 12'
				backgroundColor='rgba(128, 128, 128, 0.1)'
				borderRadius="10px"
				sx={{ cursor: 'pointer' }}
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
						sx={{ padding: "2px 30px 0 5px" }}
						color={colors.grey[200]}
						textAlign={'center'}
					>
						Pagos por mes
					</Typography>

				</Box>

				{data.length > 0 && (
					<Line data={ data } titlex={typeConcept === 'hour' ? 'horas del dia' : 'dias del mes'} />
				)}

			</Box>

		</Box>

	)

}

MonthlyPayments.propTypes = { 
    data: PropTypes.any.isRequired, 
    typeConcept: PropTypes.any.isRequired, 
}

export default MonthlyPayments