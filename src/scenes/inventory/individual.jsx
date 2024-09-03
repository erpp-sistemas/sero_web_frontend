import { Box } from "@mui/material"
import { useParams } from "react-router-dom"

export default function Individual() {
  const { vehicleNumber } = useParams()

	return (
		<Box sx={{ }}>
			<h1>Estas en el vehiculo No. {vehicleNumber}</h1>
		</Box>
	)

}