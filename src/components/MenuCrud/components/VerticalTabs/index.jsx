import { Box, Tab, Tabs, Typography } from "@mui/material"
import React from "react"
import MenuIcon from "@mui/icons-material/Menu"
import DragHandleIcon from "@mui/icons-material/DragHandle"
import DataGridMenuCrud from "../DataGridMenuCrud"
import DataGridSubMenuCrud from "../DataGridSubMenuCrud"

function TabPanel(props) {

	const { children, value, index, ...other } = props

	return (

		<div
			style={{ height: "auto" }}
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>

			{value === index && (
				<Box sx={{ width: "850px", p: 3 }}>
					{children}
				</Box>
			)}

		</div>

	)

}

function a11yProps(index) {
	return {
		id: `vertical-tab-${index}`,
		"aria-controls": `vertical-tabpanel-${index}`,
	}
}

function VerticalTabs() {
	
	const [value, setValue] = React.useState(0)

	const handleChange = (event, newValue) => {
		setValue(newValue)
	}

	return (

		<Box 
			sx={{ 
				flexGrow: 1, 
				display: "flex", 
				height: "auto",
				flexDirection:{
					xs:'column',
					md:'row'
				},
				overflowY:'hidden',
				overflowX:'scroll'
			}}
		>

			<Tabs
				orientation="vertical"
				variant="scrollable"
				value={value}
				onChange={handleChange}
				aria-label="Vertical tabs example"
				sx={{ borderRight: 1, borderColor: "divider" }}
			>

				<Tab
					label="Menus"
					{...a11yProps(0)}
					icon={<MenuIcon />}
					indicatorColor={"secondary"}
					textColor="secondary"
					sx={{
						"&:hover": {
						color: "#9298E3",
						},
						"&:visited": {
						color: "#9298E3", 
						},

						"&:active": {
						color: "#9298E3",
						},
						"&:focus": {
						color: "#00FF00",
						},
					}}
				/>

				<Tab
					label="SubMenus"
					{...a11yProps(1)}
					icon={<DragHandleIcon />}
					indicatorColor={"secondary"}
					textColor="secondary"
					sx={{
						"&:hover": {
						color: "#9298E3",
						},
						"&:visited": {
						color: "#9298E3", 
						},

						"&:active": {
						color: "#9298E3",
						},
						"&:focus": {
						color: "#00FF00", 
						},
					}}
				/>
				
			</Tabs>

			<TabPanel value={value} index={0}>
				<Typography variant="button" gutterBottom sx={{ color: "#9298E3" }}>
				Administraciòn de Menus
				</Typography>
				<DataGridMenuCrud />
			</TabPanel>

			<TabPanel value={value} index={1}>
				<Typography variant="button" gutterBottom sx={{ color: "#9298E3" }}>
				Administraciòn de SubMenus
				</Typography>
				<DataGridSubMenuCrud />
			</TabPanel>

			<TabPanel value={value} index={2}>
				Item Three
			</TabPanel>

		</Box>
	)
}

export default VerticalTabs;
