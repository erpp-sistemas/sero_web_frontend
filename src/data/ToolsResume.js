import Sec6Image1 from "../assets/aggregation-protocol.webp"
import Sec6Image2 from "../assets/limit-order-protocol.webp"
import LottieData from '../assets/json/location.json'
import LottieData2 from '../assets/json/robot.json'

export const section6Content = {
    title: "Herrameintas",
    ITEMS: [
		{
			title: "Geolocalización de personal",
			subtitle:
			"Ubica al personal de campo en tiempo real mediante la obtencion de geoposiciones de nuestras plataformas",
			image: Sec6Image1,
			animation: ''
		},
		{
			title: "Chat bot",
			subtitle:
			"Lanza campañas para recabar datos atendidos por chatbots",
			image: null,
			animation: LottieData2
		},
		{
			title: "Sistemas de información geográfica",
			subtitle:
			"Visualiza datos representados en sistemas SIG",
			image: null,
			animation: LottieData
		},
		{
			title: "Generación de reportes",
			subtitle:
			"Reportes gráficos y tabulares para la interpretación de datos",
			image: Sec6Image2,
			animation: ''
		},
    ],
}