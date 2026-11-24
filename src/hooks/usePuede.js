// S02-H2.6: ¿la persona de la sesión puede hacer esta acción en este recurso?
//   const { puede, cargando } = usePuede('usuarios', 'create')
// Solo decide qué se muestra: el backend vuelve a revisar con requirePermission y responde 403.
import useMisPermisos from './useMisPermisos'

const usePuede = (recurso, accion) => {
	const { puede, cargando, error } = useMisPermisos()
	return { puede: !cargando && !error && puede(recurso, accion), cargando, error }
}

export default usePuede
