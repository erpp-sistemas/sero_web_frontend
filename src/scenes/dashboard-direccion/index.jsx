import { Box, Button, useTheme, Typography, ButtonGroup, FormControl, Select, MenuItem } from "@mui/material"
import DiscountIcon from '@mui/icons-material/Discount'
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded'
import EngineeringIcon from '@mui/icons-material/Engineering'
import Person4Icon from '@mui/icons-material/Person4'
import { numero_gestiones } from '../../data/gestiones'
import { mockBarData } from '../../data/recaudado'
import RecaudacionGestor from '../../components/RecaudacionGestor'
import PorcentajeGestor from '../../components/PorcentajeGestor'
import BarChart from '../../components/BarChart'
import { tokens } from "../../theme"
import StatBox from "../../components/StatBox"
import LineChart from "../../components/LineChart"

const Home = () => {

	const theme = useTheme()
	const colors = tokens(theme.palette.mode)

	const handleChangePeriodo = (e) => {
		console.info(e)
	}

	return (

		<Box m="20px" marginTop="0">

			<Box
				id="grid-1"
				sx={{ 
					marginTop: '10px',
					display: 'grid',
					gridTemplateColumns: {
						xs: '1fr',
						md: 'repeat(12, 1fr)', 
					},
					gridAutoRows: '140px',
					gap: {
						xs: '30px',
						md: '20px', 
					},
				}}
			>

				<Box
					gridColumn='span 3'
					backgroundColor={colors.primary[400]}
					display="flex"
					alignItems="center"
					justifyContent="center"
					borderRadius="10px"
				>

				<StatBox
					title="Contratos activos"
					subtitle={3}
					icon={
						<BookmarkAddedIcon
							sx={{ color: 'white', fontSize: "28px" }}
						/>
					}
				/>
				</Box>

				<Box
					gridColumn='span 3'
					backgroundColor={colors.primary[400]}
					display="flex"
					alignItems="center"
					justifyContent="center"
					borderRadius="10px"
				>
				<StatBox
					title="Plazas activas"
					subtitle={2}
					icon={
						<DiscountIcon
							sx={{ color: 'white', fontSize: "28px" }}
						/>
					}
				/>
				</Box>

				<Box
					gridColumn='span 3'
					backgroundColor={colors.primary[400]}
					display="flex"
					alignItems="center"
					justifyContent="center"
					borderRadius="10px"
				>
				<StatBox
					title="Gestores"
					subtitle={72}
					icon={
						<EngineeringIcon
							sx={{ color: 'white', fontSize: "28px" }}
						/>
					}
					image={true}
					src='avatar-gestor.png'
				/>
				</Box>

				<Box
					gridColumn='span 3'
					backgroundColor={colors.primary[400]}
					display="flex"
					alignItems="center"
					justifyContent="center"
					borderRadius="10px"
				>
				<StatBox
					title="Administrativos"
					subtitle={20}
					icon={
						<Person4Icon
							sx={{ color: 'white', fontSize: "28px" }}
						/>
					}
					image={true}
					src='avatar-gestor.png'
				/>

				</Box>

			</Box>

			<Box
				gridColumn="span 12"
				gridRow="span 2"
				backgroundColor={colors.primary[400]}
				borderRadius='10px'
			>
				<Box
					mt="20px"
					p="0 30px"
					display="flex "
					justifyContent="space-between"
					alignItems="center"
				>
					
				<Box sx={{ padding: '15px 0' }}>

					<Typography
						variant="h5"
						color={colors.greenAccent[400]}
						sx={{ 
							marginBottom: '10px',
							textAlign:{
								xs:'center',
								md:'start'
							}
						}}
					>
						Número de gestiones realizadas
					</Typography>

					<Box 
						sx={{ 
							display:'flex',
							justifyContent:'center',
							alignItems:'center',
							flexWrap:'wrap',
							marginTop:{
								xs:'25px',
								md:'0px'
							}
						}}
					>

						<ButtonGroup variant="contained" aria-label="outlined primary button group">
							<Button sx={{ backgroundColor: colors.greenAccent[500] }}>Año</Button>
							<Button>Mes</Button>
							<Button>Semana</Button>
						</ButtonGroup>

						<FormControl sx={{ m: 1, minWidth: 200 }} size="small">
							<Select
								labelId="demo-select-small-label"
								id="demo-select-small"
								value={1}
								label="Age"
								onChange={handleChangePeriodo}
							>
								<MenuItem value={1}><em>Selecciona</em></MenuItem>
								<MenuItem value={20}>2022</MenuItem>
								<MenuItem value={30}>2023</MenuItem>
							</Select>
						</FormControl>

					</Box>

				</Box>
				
				</Box>

				<Box 
					sx={{
						width:"100%",
						height:"250px",
						m:"-20px 0 0 0" ,
						background:'transparent',
						overflowY:'hidden',
						overflowX:'scroll'
					}}
				>
					<LineChart isDashboard={true} dataChart={numero_gestiones} isTotal={true} />
				</Box>

			</Box>

			<Box
				id="grid-1"
				sx={{ 
					marginTop: '20px',
					marginBottom: '20px',
					display: 'grid',
					gridTemplateColumns: {
						xs: '1fr',
						md: 'repeat(12, 1fr)', 
					},
					gridAutoRows: 'auto',
					gap: {
						xs: '0px',
						md: '20px', 
					},
				}}
			>
				<RecaudacionGestor size_grid='7' />
				<PorcentajeGestor size_grid='5' />
			</Box>

			<Box
				gridColumn='span 12'
				gridRow="span 2"
				backgroundColor={colors.primary[400]}
			>

				<Box
				mt="10px"
				p="0 10px"
				display="flex "
				justifyContent="space-between"
				alignItems="center"
				>

				<Typography
					variant="h5"
					sx={{ padding: "20px 30px 0 30px" }}
					color={colors.greenAccent[500]}
				>
					Recaudado en plazas
				</Typography>
				</Box>

				<Box 
					sx={{
						height:"270px",
						m:"-20px 0 0 0" ,
						background:'transparent',
						overflowY:'hidden',
						overflowX:'scroll',
						width:'100%'
					}}
				>
					<BarChart data={mockBarData} /> 
				</Box>
			</Box>

		</Box >

	)

}

export default Home






