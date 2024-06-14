import { Box, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PropTypes from 'prop-types'
export default function Preview({ registro, setOpenPreview, paquete }) {

    const getSrcDoc = () => {
        if (paquete.plaza === 'Cuautitlan Izcalli' && paquete.servicio === 'Regularización predio') {

			if (!paquete.firma) {
            return `<!DOCTYPE html>

			<html>
	
				<head>	
					<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
					<meta http-equiv="Content-Style-Type" content="text/css" />
					<meta name="generator" content="Aspose.Words for .NET 24.2.0" />
					<title></title>
					<style>
						.title{
							background: black;
						}
					</style>
				</head>
	
				<body>
	
					<div style="max-width:730px; margin: auto; margin-top:50px;">
	
						<div style="width:100%; margin:0px; margin-bottom:10px; text-align:center; font-size:14pt; overflow:hidden;">
							<div style="width:25%; float:left;">
								<img style="margin-bottom: 10px;" src="https://docsfichas.s3.us-east-2.amazonaws.com/statics/logo_erpp_azul.png" width="160" height="80" alt="">
							</div>
							<div style="margin-top:50px; width:50%; text-align:center; font-size:14pt; float:left;">
								<div style="font-family:Arial; font-weight:bold; color:#254061;">
									ERPP Corporativo S.A de C.V
								</div>
								<div style="margin-top:10px; font-family:Arial; font-size:11pt; font-weight:bold; color:#254061;">
									Información general de la cuenta
								</div>
							</div>
							<div style="width:25%; float:right;">
								<img src="https://docsfichas.s3.us-east-2.amazonaws.com/statics/logo_cuautitlan_izcalli_regularizaci%C3%B3n_predio.png" width="187" height="80" alt="">
								<span style="font-family:Arial; font-size:6pt; font-weight:bold; color:#254061">Folio:{registro.folio}</span>
							</div>
						</div>
	
						<div style="width: 100%;">
	
							<div style="width: 99.5%; height:20px; border:1px solid black; border-bottom:none;  background:#254061; overflow:hidden;">
								<p style="width: 100%; margin:0px; margin-top:4px; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#ffffff;">Datos del contribuyente</p>
							</div>
	
							<div style="width: 100%; height:20px; ">
								<div style="width: 24.12%; float: left; height:20px; border:1px solid black; border-bottom:none; border-right:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Cuenta</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-bottom:none; border-right:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Clave catastral</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-bottom:none; border-right:none;	 background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Propietario</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-bottom:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Uso de suelo</p>
								</div>
							</div>
	
							<div style="width: 100%; height:20px;">
								<div style="width: 24.12%; float: left; height:30px; border:1px solid black; border-right:none; border-bottom:none; padding:0px;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.cuenta}</p>
								</div>
								<div style="width: 25%; float: left; height:30px; border:1px solid black; border-right:none; border-bottom:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.clave_catastral}</p>
								</div>
								<div style="width: 25%; float: left; height: 30px; border:1px solid black; border-right: none; border-bottom: none; text-align: center;">
									<p style="margin: 0; line-height: 12px; font-family: Arial; margin-top:2px; font-size: 8px; color: #254061;">${registro.propietario}</p>
								</div>
								<div style="width: 25%; float: left; height:30px; border:1px solid black; border-bottom:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.tipo_servicio}</p>
								</div>
							</div>
	
							<div style="width: 100%; height:20px; ">
								<div style="width: 24.12%; float: left; height:20px; border:1px solid black; border-right:none; border-bottom:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Servicio</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-right:none; border-bottom:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Superficie del terreno</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-right:none; border-bottom:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Superficie de construccion</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-bottom:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Valor del terreno</p>
								</div>
							</div>
	
							
							<div style="width: 100%; height:20px;">
								<div style="width: 24.12%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">Regularización de predio</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.superficie_terreno}</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.superficie_construccion}</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.valor_terreno}</p>
								</div>
							</div>
	
							<div style="width: 100%; height:20px; ">
								<div style="width: 24.12%; float: left; height:20px; border:1px solid black; border-right:none; border-bottom:none; background:#e6e6e6; border-top: none;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Valor de contruccion</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-right:none; border-bottom:none; background:#e6e6e6; border-top: none;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Valor catastral</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-right:none; border-bottom:none; background:#e6e6e6; border-top: none;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;"></p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-bottom:none; background:#e6e6e6; border-top: none;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;"></p>
								</div>
							</div>
							
							<div style="width: 100%; height:20px;">
								<div style="width: 24.12%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.valor_construccion}</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.valor_catastral}</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-right:none;">
									
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black;">
									
								</div>
							</div>
	
							<div style="width: 99.5%; height:20px; border:1px solid black; border-bottom:none;  background:#e6e6e6; overflow:hidden; border-top:none;">
								<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Domicilio del contribuyente</p>
							</div>
	
							<div style="width: 99.5%; height:20px; border:1px solid black; border-bottom:none;  background:#fff; overflow:hidden;">
								<p style="margin:0px; width:100%; text-align:center; margin-top:4px; font-family:Arial; font-size:8px; color:#254061;">${registro.calle}, ${registro.colonia}</p>
							</div>
	
							<div style="width: 99.5%; height:20px; border:1px solid black; border-bottom:none;  background:#254061; overflow:hidden;">
								<p style="width: 100%; margin:0px; margin-top:4px; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#ffffff;">Geolocalización y reporte fotográfico del inmueble</p>
							</div>
	
							<div class="">
								<div style="width: 37.1%; float:left; height:20px; border:1px solid black; border-bottom:none;  background:#e6e6e6; overflow:hidden; border-top:none; border-right:none;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Geolocalizacion</p>
								</div>
								<div style="width: 31.1%; float:left; height:20px; border:1px solid black; border-bottom:none;  background:#e6e6e6; overflow:hidden; border-top:none; border-right:none;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Fotografia de fachada</p>
								</div>
								<div style="width: 31.1%; float:left; height:20px; border:1px solid black; border-bottom:none;  background:#e6e6e6; overflow:hidden; border-top:none;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Fotografia de evidencia</p>
								</div>
							</div>
		
							<div class="">
								<div style="width: 37.1%; float:left; height:200px; border:1px solid black; border-right:none; border-bottom:none; position: relative;">
									<img src="https://docsfichas.s3.us-east-2.amazonaws.com/statics/mapaPrueba.png" alt="" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
									<div style="width: 100%; height: 20px; position: absolute; bottom: 0; border:1px solid black; border-bottom:none; border-right:none; background:#e6e6e6;">
										<p style="width:99.6%; font-family:Arial; text-align:center; font-size: 9px; margin: 0; margin-top:2px; font-weight:bold; color:#254061;">Latitud: ${registro.latitud} Longitud: ${registro.longitud}</p>
									</div>
								</div>
	
								<div style="width: 31.1%; float:left; height:20px; border:1px solid black; border-bottom:none; height:200px; background:#fff; overflow:hidden; border-right:none;">
									<img style="top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" src="${registro.url_evidencia}" alt="">
								</div>
	
								<div style="width: 31.1%; float:left; height:20px; border:1px solid black; border-bottom:none; height:200px; background:#fff; overflow:hidden; ">
									<img style="top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" src="${registro.url_fachada}" alt="">
									
								</div>
							</div>
	
							<div style="width: 99.5%; height:20px; border:1px solid black; border-bottom:none;  background:#254061; overflow:hidden;">
								<p style="width: 100%; margin:0px; margin-top:4px; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#ffffff;">Acciones realizadas al contribuyente</p>
							</div>
	
							<div style="width: 100%; height:20px; ">
								<div style="width: 19.5%; float: left; height:20px; border:1px solid black; border-bottom:none; border-right:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Tarea</p>
								</div>
								<div style="width: 20%; float: left; height:20px; border:1px solid black; border-bottom:none; border-right:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Gestor</p>
								</div>
								<div style="width: 20%; float: left; height:20px; border:1px solid black; border-bottom:none; border-right:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Fecha de captura</p>
								</div>
								<div style="width: 20%; float: left; height:20px; border:1px solid black; border-bottom:none; border-right:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Servicio</p>
								</div>
								<div style="width: 19.5%; float: left; height:20px; border:1px solid black; border-bottom:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Proceso</p>
								</div>
							</div>
	
							<div style="width: 100%; height:20px;">
								<div style="width: 19.5%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.tarea_gestionada}</p>
								</div>
								<div style="width: 20%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.gestor}</p>
								</div>
								<div style="width: 20%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.fecha_gestion}</p>
								</div>
								<div style="width: 20%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">Regularización de Predio</p>
								</div>
								<div style="width: 19.5%; float: left; height:20px; border:1px solid black;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.tipo_gestion}</p>
								</div>
							</div>
	
							<div style="width: 99.5%; height:20px; border:1px solid black; border-bottom:none; border-top:none; background:#254061; overflow:hidden;">
								<p style="width: 100%; margin:0px; margin-top:4px; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#ffffff;">Pagos del contribuyente</p>
							</div>
	
							<div style="width: 100%; height:20px; ">
								<div style="width: 19.5%; float: left; height:20px; border:1px solid black; border-bottom:none; border-right:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">CFDI</p>
								</div>
								<div style="width: 20%; float: left; height:20px; border:1px solid black; border-bottom:none; border-right:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Fecha de pago</p>
								</div>
								<div style="width: 40%; float: left; height:20px; border:1px solid black; border-bottom:none; border-right:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Descripción</p>
								</div>
								<div style="width: 19.5%; float: left; height:20px; border:1px solid black; border-bottom:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Monto pagado</p>
								</div>
							</div>
	
							<div style="width: 100%; height:20px;">
								<div style="width: 19.5%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.recibo}</p>
								</div>
								<div style="width: 20%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.fecha_pago}</p>
								</div>
								<div style="width: 40%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">Impuesto predial rezago</p>
								</div>
								<div style="width: 19.5%; float: left; height:20px; border:1px solid black;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.total_pagado}</p>
								</div>
							</div>
	
						</div>
	
						<div style="width:100%; margin-top:440px; overflow: auto;">
	
							<div style="width:40%; float: left;">
								<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">_____________________________________</p>
								<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">Firma</p>
								<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">Jhovany Francisco Cedillo Cardenas</p>
								<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">Representante legal ERPP</p>
							</div>
						
							<div style="width:40%; float: right;">
								<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">_____________________________________</p>
								<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">Firma</p>
								<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">C.P. Elvira Morales Martinez</p>
								<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">Area requiriente</p>
							</div>
						
						</div>
	
						<div style="width:100%; border-top: 1.5px solid rgb(175, 175, 175); margin-top:40px; text-align: center;">
							<div style="display: inline-block; vertical-align: middle;">
								<p style="font-family:Arial; margin:0px; margin-top:10px; font-size:9px; line-height:12px; font-weight:bold; color:gray">Pagina 1 de 1</p>
								<p style="font-family:Arial; margin:0px; font-size:9px; line-height:12px; font-weight:bold; color:gray">Detalles del contribuyente: ${registro.cuenta} Cuautitlan Izcalli</p>
								<p style="font-family:Arial; margin:0px; font-size:9px; line-height:12px; font-weight:bold; color:gray">https://www.erpp.mx/</p>
								<p style="font-family:Arial; margin:0px; font-size:9px; line-height:12px; font-weight:bold; color:gray">SER0®</p>
							</div>
						</div>
	
					</div>
	
				</body>
	
		</html>`;

		}else{

			return `<!DOCTYPE html>

			<html>
	
				<head>	
					<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
					<meta http-equiv="Content-Style-Type" content="text/css" />
					<meta name="generator" content="Aspose.Words for .NET 24.2.0" />
					<title></title>
					<style>
						.title{
							background: black;
						}
					</style>
				</head>
	
				<body>
	
					<div style="max-width:730px; margin: auto; margin-top:50px;">
	
						<div style="width:100%; margin:0px; margin-bottom:10px; text-align:center; font-size:14pt; overflow:hidden;">
							<div style="width:25%; float:left;">
								<img style="margin-bottom: 10px;" src="https://docsfichas.s3.us-east-2.amazonaws.com/statics/logo_erpp_azul.png" width="160" height="80" alt="">
							</div>
							<div style="margin-top:50px; width:50%; text-align:center; font-size:14pt; float:left;">
								<div style="font-family:Arial; font-weight:bold; color:#254061;">
									ERPP Corporativo S.A de C.V
								</div>
								<div style="margin-top:10px; font-family:Arial; font-size:11pt; font-weight:bold; color:#254061;">
									Información general de la cuenta
								</div>
							</div>
							<div style="width:25%; float:right;">
								<img src="https://docsfichas.s3.us-east-2.amazonaws.com/statics/logo_cuautitlan_izcalli_regularizaci%C3%B3n_predio.png" width="187" height="80" alt="">
								<span style="font-family:Arial; font-size:6pt; font-weight:bold; color:#254061">Folio:{registro.folio}</span>
							</div>
						</div>
	
						<div style="width: 100%;">
	
							<div style="width: 99.5%; height:20px; border:1px solid black; border-bottom:none;  background:#254061; overflow:hidden;">
								<p style="width: 100%; margin:0px; margin-top:4px; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#ffffff;">Datos del contribuyente</p>
							</div>
	
							<div style="width: 100%; height:20px; ">
								<div style="width: 24.12%; float: left; height:20px; border:1px solid black; border-bottom:none; border-right:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Cuenta</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-bottom:none; border-right:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Clave catastral</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-bottom:none; border-right:none;	 background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Propietario</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-bottom:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Uso de suelo</p>
								</div>
							</div>
	
							<div style="width: 100%; height:20px;">
								<div style="width: 24.12%; float: left; height:30px; border:1px solid black; border-right:none; border-bottom:none; padding:0px;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.cuenta}</p>
								</div>
								<div style="width: 25%; float: left; height:30px; border:1px solid black; border-right:none; border-bottom:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.clave_catastral}</p>
								</div>
								<div style="width: 25%; float: left; height: 30px; border:1px solid black; border-right: none; border-bottom: none; text-align: center;">
									<p style="margin: 0; line-height: 12px; font-family: Arial; margin-top:2px; font-size: 8px; color: #254061;">${registro.propietario}</p>
								</div>
								<div style="width: 25%; float: left; height:30px; border:1px solid black; border-bottom:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.tipo_servicio}</p>
								</div>
							</div>
	
							<div style="width: 100%; height:20px; ">
								<div style="width: 24.12%; float: left; height:20px; border:1px solid black; border-right:none; border-bottom:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Servicio</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-right:none; border-bottom:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Superficie del terreno</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-right:none; border-bottom:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Superficie de construccion</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-bottom:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Valor del terreno</p>
								</div>
							</div>
	
							
							<div style="width: 100%; height:20px;">
								<div style="width: 24.12%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">Regularización de predio</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.superficie_terreno}</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.superficie_construccion}</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.valor_terreno}</p>
								</div>
							</div>
	
							<div style="width: 100%; height:20px; ">
								<div style="width: 24.12%; float: left; height:20px; border:1px solid black; border-right:none; border-bottom:none; background:#e6e6e6; border-top: none;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Valor de contruccion</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-right:none; border-bottom:none; background:#e6e6e6; border-top: none;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Valor catastral</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-right:none; border-bottom:none; background:#e6e6e6; border-top: none;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;"></p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-bottom:none; background:#e6e6e6; border-top: none;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;"></p>
								</div>
							</div>
							
							<div style="width: 100%; height:20px;">
								<div style="width: 24.12%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.valor_construccion}</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.valor_catastral}</p>
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black; border-right:none;">
									
								</div>
								<div style="width: 25%; float: left; height:20px; border:1px solid black;">
									
								</div>
							</div>
	
							<div style="width: 99.5%; height:20px; border:1px solid black; border-bottom:none;  background:#e6e6e6; overflow:hidden; border-top:none;">
								<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Domicilio del contribuyente</p>
							</div>
	
							<div style="width: 99.5%; height:20px; border:1px solid black; border-bottom:none;  background:#fff; overflow:hidden;">
								<p style="margin:0px; width:100%; text-align:center; margin-top:4px; font-family:Arial; font-size:8px; color:#254061;">${registro.calle}, ${registro.colonia}</p>
							</div>
	
							<div style="width: 99.5%; height:20px; border:1px solid black; border-bottom:none;  background:#254061; overflow:hidden;">
								<p style="width: 100%; margin:0px; margin-top:4px; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#ffffff;">Geolocalización y reporte fotográfico del inmueble</p>
							</div>
	
							<div class="">
								<div style="width: 37.1%; float:left; height:20px; border:1px solid black; border-bottom:none;  background:#e6e6e6; overflow:hidden; border-top:none; border-right:none;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Geolocalizacion</p>
								</div>
								<div style="width: 31.1%; float:left; height:20px; border:1px solid black; border-bottom:none;  background:#e6e6e6; overflow:hidden; border-top:none; border-right:none;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Fotografia de fachada</p>
								</div>
								<div style="width: 31.1%; float:left; height:20px; border:1px solid black; border-bottom:none;  background:#e6e6e6; overflow:hidden; border-top:none;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Fotografia de evidencia</p>
								</div>
							</div>
		
							<div class="">
								<div style="width: 37.1%; float:left; height:200px; border:1px solid black; border-right:none; border-bottom:none; position: relative;">
									<img src="https://docsfichas.s3.us-east-2.amazonaws.com/statics/mapaPrueba.png" alt="" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
									<div style="width: 100%; height: 20px; position: absolute; bottom: 0; border:1px solid black; border-bottom:none; border-right:none; background:#e6e6e6;">
										<p style="width:99.6%; font-family:Arial; text-align:center; font-size: 9px; margin: 0; margin-top:2px; font-weight:bold; color:#254061;">Latitud: ${registro.latitud} Longitud: ${registro.longitud}</p>
									</div>
								</div>
	
								<div style="width: 31.1%; float:left; height:20px; border:1px solid black; border-bottom:none; height:200px; background:#fff; overflow:hidden; border-right:none;">
									<img style="top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" src="${registro.url_evidencia}" alt="">
								</div>
	
								<div style="width: 31.1%; float:left; height:20px; border:1px solid black; border-bottom:none; height:200px; background:#fff; overflow:hidden; ">
									<img style="top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;" src="${registro.url_fachada}" alt="">
									
								</div>
							</div>
	
							<div style="width: 99.5%; height:20px; border:1px solid black; border-bottom:none;  background:#254061; overflow:hidden;">
								<p style="width: 100%; margin:0px; margin-top:4px; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#ffffff;">Acciones realizadas al contribuyente</p>
							</div>
	
							<div style="width: 100%; height:20px; ">
								<div style="width: 19.5%; float: left; height:20px; border:1px solid black; border-bottom:none; border-right:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Tarea</p>
								</div>
								<div style="width: 20%; float: left; height:20px; border:1px solid black; border-bottom:none; border-right:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Gestor</p>
								</div>
								<div style="width: 20%; float: left; height:20px; border:1px solid black; border-bottom:none; border-right:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Fecha de captura</p>
								</div>
								<div style="width: 20%; float: left; height:20px; border:1px solid black; border-bottom:none; border-right:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Servicio</p>
								</div>
								<div style="width: 19.5%; float: left; height:20px; border:1px solid black; border-bottom:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Proceso</p>
								</div>
							</div>
	
							<div style="width: 100%; height:20px;">
								<div style="width: 19.5%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.tarea_gestionada}</p>
								</div>
								<div style="width: 20%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.gestor}</p>
								</div>
								<div style="width: 20%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.fecha_gestion}</p>
								</div>
								<div style="width: 20%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">Regularización de Predio</p>
								</div>
								<div style="width: 19.5%; float: left; height:20px; border:1px solid black;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.tipo_gestion}</p>
								</div>
							</div>
	
							<div style="width: 99.5%; height:20px; border:1px solid black; border-bottom:none; border-top:none; background:#254061; overflow:hidden;">
								<p style="width: 100%; margin:0px; margin-top:4px; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#ffffff;">Pagos del contribuyente</p>
							</div>
	
							<div style="width: 100%; height:20px; ">
								<div style="width: 19.5%; float: left; height:20px; border:1px solid black; border-bottom:none; border-right:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">CFDI</p>
								</div>
								<div style="width: 20%; float: left; height:20px; border:1px solid black; border-bottom:none; border-right:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Fecha de pago</p>
								</div>
								<div style="width: 40%; float: left; height:20px; border:1px solid black; border-bottom:none; border-right:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Descripción</p>
								</div>
								<div style="width: 19.5%; float: left; height:20px; border:1px solid black; border-bottom:none; background:#e6e6e6;">
									<p style="width: 100%; margin:0px; margin-top:5px; text-align: center; font-family:Arial; font-size:9px; font-weight:bold; color:#254061;">Monto pagado</p>
								</div>
							</div>
	
							<div style="width: 100%; height:20px;">
								<div style="width: 19.5%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.recibo}</p>
								</div>
								<div style="width: 20%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.fecha_pago}</p>
								</div>
								<div style="width: 40%; float: left; height:20px; border:1px solid black; border-right:none;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">Impuesto predial rezago</p>
								</div>
								<div style="width: 19.5%; float: left; height:20px; border:1px solid black;">
									<p style="margin:0px; width:100%; text-align:center; margin-top:2px; font-family:Arial; font-size:8px; color:#254061;">${registro.total_pagado}</p>
								</div>
							</div>
	
						</div>
	
						<div style="width:100%; margin-top:440px; height:100px;">

							<div style="width:40%; float: left; position:relative;">
								<div style="width: 200px; height:150px; position: absolute; left:15%; top:-120%;">
									<img style="width: 100%; height:100%;" src="https://docsfichas.s3.us-east-2.amazonaws.com/statics/firma-jhovany.png" alt="">
								</div>
								<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">_____________________________________</p>
								<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">Firma</p>
								<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">Jhovany Francisco Cedillo Cardenas</p>
								<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">Representante legal ERPP</p>
							</div>
						
							<div style="width:40%; float: right; position:relative;">
								<div style="width: 200px; height:150px; position: absolute; left:15%; top:-120%;">
									<img style="width: 100%; height:100%;" src="https://docsfichas.s3.us-east-2.amazonaws.com/statics/firma-elvira.png" alt="">
								</div>
								<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">_____________________________________</p>
								<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">Firma</p>
								<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">C.P. Elvira Morales Martinez</p>
								<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">Area requiriente</p>
							</div>
						
						</div>
	
						<div style="width:100%; border-top: 1.5px solid rgb(175, 175, 175); margin-top:40px; text-align: center;">
							<div style="display: inline-block; vertical-align: middle;">
								<p style="font-family:Arial; margin:0px; margin-top:10px; font-size:9px; line-height:12px; font-weight:bold; color:gray">Pagina 1 de 1</p>
								<p style="font-family:Arial; margin:0px; font-size:9px; line-height:12px; font-weight:bold; color:gray">Detalles del contribuyente: ${registro.cuenta} Cuautitlan Izcalli</p>
								<p style="font-family:Arial; margin:0px; font-size:9px; line-height:12px; font-weight:bold; color:gray">https://www.erpp.mx/</p>
								<p style="font-family:Arial; margin:0px; font-size:9px; line-height:12px; font-weight:bold; color:gray">SER0®</p>
							</div>
						</div>
	
					</div>
	
				</body>
	
		</html>`;

		}

        } else {
           false
        }
    };

    return (
        <Box sx={{ position: 'absolute', width: '100%', height: '100vh', display: 'flex', alignItems: 'center', top: '0px', left: '0', zIndex: '20000', background: 'rgba(0, 0, 0, 0.42)', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ width: '90%', padding: '20px', height: '90%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', borderRadius: '10px', position: 'relative' }}>
                <button onClick={() => setOpenPreview(false)} className='preview_close'>
                    <CloseIcon sx={{ fontSize: '1.5rem', color: 'black', fontWeight: '900' }} />
                </button>
                <Typography sx={{ color: 'black', fontSize: '1.5rem', fontWeight: '600' }}>Vista previa</Typography>
                <Box sx={{ width: '100%', height: '100%', border: '2px solid gray', borderRadius: '20px', overflow: 'auto' }}>
                    <iframe srcDoc={getSrcDoc()} title="Vista previa" style={{ width: '100%', height: '100%', border: 'none' }} />
                </Box>
            </Box>
        </Box>
    )
}

Preview.propTypes = {
    registro: PropTypes.object.isRequired,
    paquete: PropTypes.object.isRequired,
    setOpenPreview: PropTypes.func.isRequired
}