import { Tab, Tabs } from '@mui/material'
import PropTypes from 'prop-types'
import PaymentIcon from '@mui/icons-material/Payment'
import PaidIcon from '@mui/icons-material/Paid'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import BusinessIcon from '@mui/icons-material/Business'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import InsertChartIcon from '@mui/icons-material/InsertChart'

function NavTabs({ value, handleChange }) {
   
	return (

		<Tabs value={value} onChange={handleChange}  aria-label="icon tabs example" indicatorColor={"secondary"} textColor='secondary'>
			<Tab icon={<BusinessIcon />} label="Domicilio" value={"Contributor"}/>
			<Tab icon={<PaymentIcon />} label="Adeudos" value={"Debt"}/>
			<Tab icon={<PaidIcon />} label="Pagos" value={"Payments"}/>
			<Tab icon={<SupervisedUserCircleIcon />} label="Acciones" value={"PerformedActions"}/>
			<Tab icon={<PhotoCameraIcon />} label="Fotografias" value={"CapturedPhotographs"}/>
			<Tab icon={<InsertChartIcon />} label="Estadisticas" value={"Statistics"}/>
		</Tabs>

	)

}

NavTabs.propTypes = {
	value: PropTypes.string.isRequired,
	handleChange: PropTypes.func.isRequired,
}


export default NavTabs