import { Box, Typography, Button } from "@mui/material";

export default function PreviewConfirmacion () {

	return(

		<Box sx={{ }}>

			<Box sx={{  }}>

				<Typography sx={{  }}>
					Tienes X cuentas Válidas
				</Typography>

				<Typography sx={{  }}>
					Tienes X cuentas Inválidas
				</Typography>

				<Typography sx={{  }}>
					Si continual las cuentas invalidas no generar ningun documento, esto se debe a que no existen registros de esa cuenta actualiza el listado de catastro para generar los documentos invalidos.
				</Typography>

				<Box sx={{  }}>
					<Button sx={{  }}>
						Aceptar
					</Button>
					<Button sx={{  }}>
						Cancelar
					</Button>
				</Box>

			</Box>

		</Box>

	)

}