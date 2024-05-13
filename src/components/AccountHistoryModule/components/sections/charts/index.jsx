import { useStoreZustand } from "../../../../../zustan_store/useStoreZustand"
import { create, all } from "mathjs"
import ReactApexChart from "react-apexcharts"
import { Grid } from "@mui/material"
const config = {}
const math = create(all, config)

function Charts() {

	const { debts } = useStoreZustand()
	const datos = debts.map((item) => item.debtAmount || 0)
	const media = math.mean(datos).toFixed(2)
	const mediana = math.median(datos).toFixed(2)
	const desviacionEstandar = math.std(datos).toFixed(2)
	const minimo = math.min(datos).toFixed(2)
	const maximo = math.max(datos).toFixed(2)

	const chartOptions = {
		xaxis: {
		categories: [
			"Media",
			"Mediana",
			"Desviación Estándar",
			"Mínimo",
			"Máximo",
		],
		labels: {
			style: {
			colors: ["#17E85D", "#17E85D", "#17E85D", "#17E85D", "#17E85D"],
			},
		},
		},
		yaxis: {
		labels: {
			style: {
			colors: ["#17E85D", "#17E85D", "#17E85D", "#17E85D", "#17E85D"],
			},
		},
		},
		dataLabels: {
		style: {
			colors: ["#17E85D", "#17E85D", "#17E85D", "#17E85D", "#17E85D"],
		},
		},
		x: {
		show: true,
		format: 'dd',
		
	},  
		tooltip:{
		enabled:true,
		theme:
			"dark"
		,
		}
	}

	const chartSeries = [
		{
		name: "Estadísticas",
		data: [media, mediana, desviacionEstandar, minimo, maximo],
		},
	]

	return (

		<>

			<div>Charts</div>

			<Grid container spacing={2} >

				<Grid item xs={6}>
					<ReactApexChart
						options={chartOptions}
						series={chartSeries}
						type="bar"
						height={350}
						style={{width:"100%"}}
					/>
				</Grid>

				<Grid item xs={6}>
				</Grid>

			</Grid>
			
		</>

	)

}

export default Charts
