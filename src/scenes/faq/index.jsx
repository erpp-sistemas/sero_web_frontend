import { Box, useTheme } from "@mui/material"
import Header from "../../components/Header"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import Typography from "@mui/material/Typography"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { tokens } from "../../theme"

const FAQ = () => {
	const theme = useTheme()
	const colors = tokens(theme.palette.mode)

	return (

		<Box m="20px">

			<Header title="FAQ" subtitle="Preguntas precuentes" />

			<Accordion defaultExpanded>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography color={colors.greenAccent[500]} variant="h5">
					Pregunta importante
				</Typography>
				</AccordionSummary>
				<AccordionDetails>
				<Typography>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
					malesuada lacus ex, sit amet blandit leo lobortis eget.
				</Typography>
				</AccordionDetails>
			</Accordion>

			<Accordion defaultExpanded>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography color={colors.greenAccent[500]} variant="h5">
					Otra pregunta importante
				</Typography>
				</AccordionSummary>
				<AccordionDetails>
				<Typography>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
					malesuada lacus ex, sit amet blandit leo lobortis eget.
				</Typography>
				</AccordionDetails>
			</Accordion>

			<Accordion defaultExpanded>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography color={colors.greenAccent[500]} variant="h5">
					Otra pregunta importante
				</Typography>
				</AccordionSummary>
				<AccordionDetails>
				<Typography>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
					malesuada lacus ex, sit amet blandit leo lobortis eget.
				</Typography>
				</AccordionDetails>
			</Accordion>

			<Accordion defaultExpanded>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography color={colors.greenAccent[500]} variant="h5">
					Otra pregunta importante
				</Typography>
				</AccordionSummary>
				<AccordionDetails>
				<Typography>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
					malesuada lacus ex, sit amet blandit leo lobortis eget.
				</Typography>
				</AccordionDetails>
			</Accordion>

			<Accordion defaultExpanded>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Typography color={colors.greenAccent[500]} variant="h5">
					Otra pregunta importante
				</Typography>
				</AccordionSummary>
				<AccordionDetails>
				<Typography>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
					malesuada lacus ex, sit amet blandit leo lobortis eget.
				</Typography>
				</AccordionDetails>
			</Accordion>

		</Box>

	)

}

// eslint-disable-next-line react-refresh/only-export-components
export default FAQ
