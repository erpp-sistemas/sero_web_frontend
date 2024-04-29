import { useState } from 'react'

const useFichasState = () => {
    const [activity, setActivity] = useState(true)
    const [plazas, setPlazas] = useState([])
    const [servicios, setServicios] = useState([])
    const [plaza, setPlaza] = useState('')
    const [servicio, setServicio] = useState('')
    const [fileName, setFileName] = useState('')
    const [selectionCompleted, setSelectionCompleted] = useState(false)
	const [cargando, setCargando] = useState(false)
	const [regsitros, setRegistros] = useState([])
	const [porcentaje, setPorcentaje] = useState([])
	const [modal, setModal] = useState(false)
	const [fechaCorte, setFechaCorte] = useState(null)
	const [folio, setFolio] = useState(null)

    return {
        modal,
        setModal,
        porcentaje,
        setPorcentaje,
        regsitros,
        setRegistros,
        cargando,
        setCargando,
		activity,
		setActivity,
        plazas,
        setPlazas,
		plaza,
        setPlaza,
		servicio,
		setServicio,
        servicios,
        setServicios,
        fileName,
        setFileName,
        selectionCompleted,
        setSelectionCompleted,
		fechaCorte,
		setFechaCorte,
		folio,
		setFolio,
    }
}

export default useFichasState