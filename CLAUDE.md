# Frontend SERO — sero_web_frontend

Vite + React 18 + MUI 5 + Redux Toolkit. Despliegue en Firebase Hosting (lo hace el usuario, nunca Claude Code).
Las reglas generales están en el `CLAUDE.md` de la raíz del workspace; aquí solo lo propio del frontend.

## Sistema de diseño (obligatorio en todo cambio de UI)
@../../docs/DESIGN.md

## Mapa del código
- `src/App.jsx` rutas (react-router 6) y verificación de sesión (`verifyTokenRequest`).
- `src/api/axios.js` instancia de axios con `withCredentials`; un archivo por módulo en `src/api/*.js`.
- `src/scenes/<pantalla>/index.jsx` pantallas; `src/components/` componentes; `src/redux/` estado global (`userSlice` tiene el perfil y `place_service_process`).
- `src/theme.js` tema actual (se reemplaza por `seroTheme` en S03).
- `src/scenes/global/Sidebar.jsx` y `Topbar.jsx` armazón.

## Reglas del frontend
- **Solo MUI** para componentes nuevos. No agregar componentes de Ant Design, ni nuevas librerías de gráficas (gráficas nuevas: ECharts).
- Llamadas a la API solo desde `src/api/*.js`; nunca `axios` directo en un componente.
- **Ningún secreto en el frontend**: nada de llaves de AWS, Google u otras. Lo que requiera llave pasa por el backend. La URL de la API viene de `import.meta.env.VITE_API_URL`.
- Toda pantalla nueva maneja: cargando (Skeleton), vacío, error y sin permiso.
- Cifras con `tabular-nums`; montos `Intl.NumberFormat('es-MX')`.
- Textos de interfaz en español de México.

## Comandos
- `npm run dev` — local.
- `npm run lint` — debe pasar antes de cada commit.
- `npm run build` — verificar que compila antes de cerrar una historia.

## Carpetas duplicadas o de plantilla (no usar de referencia)
`acount-history` (usar `account-history`), `records-backup`, `team`, `invoices`, `contacts`, `faq`, `bar`, `pie`, `line`, `geography`, `calendar`, `form`. Se eliminan en S03.
