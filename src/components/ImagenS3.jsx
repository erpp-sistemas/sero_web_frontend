import PropTypes from "prop-types"
import { Avatar, Box, Skeleton, Tooltip } from "@mui/material"
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined"
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined"
import { useUrlArchivo } from "../hooks/useUrlArchivo"

// Muestra una imagen guardada en S3 a partir de lo que haya en la base (key o URL vieja).
// variante "avatar": foto de persona (avatar por defecto si no hay imagen).
// variante "imagen": imagen rectangular (plaza, servicio, proceso, cuenta).
// Estados: cargando (Skeleton), vacío y error (ícono de línea en gris, con texto alternativo).
const ImagenS3 = ({ valor, alt = "", variante = "imagen", ancho = 40, alto, sx, onClick }) => {
	const { url, estado } = useUrlArchivo(valor)
	const altura = alto ?? ancho

	if (variante === "avatar") {
		if (estado === "cargando") return <Skeleton variant="circular" width={ancho} height={altura} sx={sx} />
		return (
			<Tooltip title={estado === "error" ? "No se pudo cargar la foto" : ""} disableHoverListener={estado !== "error"}>
				<Avatar
					src={estado === "listo" ? url : undefined}
					alt={alt}
					onClick={onClick}
					sx={{ width: ancho, height: altura, bgcolor: "#EEF2F7", color: "#A0AEC0", cursor: onClick ? "pointer" : undefined, ...sx }}
				>
					<PersonOutlineOutlinedIcon fontSize="small" />
				</Avatar>
			</Tooltip>
		)
	}

	if (estado === "cargando") {
		return <Skeleton variant="rounded" width={ancho} height={altura} sx={{ borderRadius: "6px", ...sx }} />
	}

	if (estado !== "listo") {
		return (
			<Box
				role="img"
				aria-label={estado === "error" ? `No se pudo cargar la imagen${alt ? `: ${alt}` : ""}` : alt || "Sin imagen"}
				title={estado === "error" ? "No se pudo cargar la imagen" : "Sin imagen"}
				onClick={onClick}
				sx={{
					width: ancho,
					height: altura,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					border: "1px solid #E6E9EE",
					borderRadius: "6px",
					bgcolor: "#F7F8FA",
					color: "#A0AEC0",
					...sx,
				}}
			>
				<ImageNotSupportedOutlinedIcon fontSize="small" />
			</Box>
		)
	}

	return (
		<Box
			component="img"
			src={url}
			alt={alt}
			onClick={onClick}
			sx={{ width: ancho, height: altura, objectFit: "cover", borderRadius: "6px", cursor: onClick ? "pointer" : undefined, ...sx }}
		/>
	)
}

ImagenS3.propTypes = {
	valor: PropTypes.string,
	alt: PropTypes.string,
	variante: PropTypes.oneOf(["imagen", "avatar"]),
	ancho: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	alto: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
	sx: PropTypes.object,
	onClick: PropTypes.func,
}

export default ImagenS3
