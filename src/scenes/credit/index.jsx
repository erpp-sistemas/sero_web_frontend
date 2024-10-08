import { Box } from "@mui/material"
import { useState } from "react"
import Formatos from "./formatos"
import Catastro from "./catastro"
import Buttons from "./butons"
import Data from "./data"
import Preview from "./preview"
import IndexHeader from "../../components/credict/index/header"
import PreviewConfirmacion from "../../components/credict/previews/confirmacion"

export default function Credit() {
	const [action, setAction] = useState('formatos')
	const [preview, setPreview] = useState(false)
	const [data, setData] = useState(false)
	const [seleccion, setSeleccion] = useState(null)
	const [seleccionFormato, setSeleccionFormato] = useState(null)
	const [openConfirmation, setOpenConfirmation] = useState(false)
    const [validAccounts, setValidAccounts] = useState([])
	const [invalidAccounts, setInvalidAccounts] = useState([]) 
    const [fileName, setFileName] = useState("")

	return (

		<Box sx={{ width: 'calc(100% - 40px)', height: 'auto', margin: '0px 20px', overflow: 'hidden' }}>

			<IndexHeader />

			<Buttons 
				setAction={setAction}
				action={action} 
			/>

			{

				action === 'formatos' ? 

					<Formatos 
						setPreview={setPreview} 
						setSeleccionFormato={setSeleccionFormato} 
						setOpenConfirmation={setOpenConfirmation} 
						setInvalidAccounts={setInvalidAccounts} 
						setValidAccounts={setValidAccounts} 
						validAccounts={validAccounts}
						invalidAccounts={invalidAccounts}
						setFileName={setFileName}
						fileName={fileName}
					/>

				: action === 'catastro' ? 

					<Catastro 
						setData={setData} 
						setSeleccion={setSeleccion} 
					/>

				: false	
			}

			<Data 
				data={data} 
				setData={setData} 
				seleccion={seleccion} 
			/>

			<Preview 
				preview={preview} 
				setPreview={setPreview} 
				seleccionFormato={seleccionFormato} 
			/>

			<PreviewConfirmacion 
				validAccounts={validAccounts}
				openConfirmation={openConfirmation} 
				setValidAccounts={setValidAccounts}
				setOpenConfirmation={setOpenConfirmation} 
				invalidAccounts={invalidAccounts}
				setFileName={setFileName}
			/>

		</Box>

	)

}