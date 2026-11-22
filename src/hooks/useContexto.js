// S02-H2.1: contexto de trabajo (Plaza › Servicio › Proceso) ya resuelto contra lo asignado al usuario.
// Las pantallas rehechas lo leen de aquí; las viejas todavía no.
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { resolverContexto } from '../features/contexto/contextoSlice'

const useContexto = () => {
	const asignado = useSelector((state) => state.user.place_service_process)
	const contexto = useSelector((state) => state.contexto)
	return useMemo(() => resolverContexto(asignado, contexto), [asignado, contexto])
}

export default useContexto
