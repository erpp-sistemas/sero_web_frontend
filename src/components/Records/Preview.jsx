import { Box, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PropTypes from 'prop-types'
export default function Preview({ registro, setOpenPreview }) {

    return (

        <Box sx={{ position:'absolute', width:'100%', height:'100vh', display: 'flex', alignItems: 'center', top:'0px', left:'0', zIndex:'20000', background:'rgba(0, 0, 0, 0.42)', flexDirection:'column', justifyContent:'center' }}>
            
			<Box sx={{ width:'85%', padding:'40px', height:'85%', background:'#ffffff', display: 'flex', alignItems: 'center', justifyContent:'center', flexDirection:'column', gap:'1rem', borderRadius:'10px', position:'relative' }}>
                
				<button onClick={() => setOpenPreview(false)} className='preview_close'><CloseIcon sx={{ fontSize:'1.5rem', color:'black', fontWeight:'900' }} /></button>
                
				<Typography sx={{ color:'black', fontSize:'2rem', fontWeight:'500' }}>Vista previa</Typography>

                <Box sx={{ 
					width:'95%', 
					height:'95%', 
					border:'2px solid gray', 
					borderRadius:'20px', 
					overflow:'auto', 
				}}>

                    <iframe srcDoc={`<!DOCTYPE html>

								<html>

								<head>
									<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
									<meta http-equiv="Content-Style-Type" content="text/css" />
									<meta name="generator" content="Aspose.Words for .NET 24.2.0" />
									<title></title>
									<style type="text/css">
									<style>
										body {
											overflow-y: scroll; /* Mostrar scrollbar vertical */
											scrollbar-width: thin; /* Ancho del scrollbar */
											scrollbar-color: gray gray; /* Color del scrollbar */
										}
										
										::-webkit-scrollbar {
											width: 8px; /* Ancho del scrollbar */
										}
		
										::-webkit-scrollbar-track {
											background: transparent; /* Color de fondo del scrollbar */
										}
		
										::-webkit-scrollbar-thumb {
											background-color: gray; /* Color del thumb (la parte deslizable del scrollbar) */
											border-radius: 10px; /* Borde redondeado del thumb */
										}
									</style>
								</head>

								<body style="display: flex; ">

									<div style="max-width:730px; margin: auto;">

										<p style="text-align:justify; font-size:14pt; ">

											<img src="https://docsfichas.s3.us-east-2.amazonaws.com/statics/logo_erpp_azul.png" width="160" height="80" alt style="-aw-left-pos:0pt; -aw-rel-hpos:column; -aw-rel-vpos:paragraph; -aw-top-pos:0pt; -aw-wrap-type:inline" /><span style="font-family:Arial; font-weight:bold; letter-spacing:49.1pt">
											</span>
											
											<span
												style="font-family:Arial; font-weight:bold; color:#254061">ERPP
												Corporativo S.A de C.V</span><span
												style="font-family:Arial; font-weight:bold; letter-spacing:31.1pt">
											</span>
											
											<img src="https://docsfichas.s3.us-east-2.amazonaws.com/statics/logo_municipio_cuautitlan_mexico.png" width="187" height="80" alt style="-aw-left-pos:0pt; -aw-rel-hpos:column; -aw-rel-vpos:paragraph; -aw-top-pos:0pt; -aw-wrap-type:inline" />
											
										</p>
												
										<p style="margin-top:11.85pt; margin-left:185.1pt; text-align:justify; line-height:13.95pt">
											<span style="font-family:Arial; font-size:11pt; font-weight:bold; color:#254061">Información general de la cuenta</span><span style="font-family:Arial; font-size:6pt; font-weight:bold; letter-spacing:61.1pt; color:#254061">
											</span><span style="font-family:Arial; font-size:6pt; font-weight:bold; color:#254061">Folio:ERPP/CMOA/31DIC/DOM/0001/10530</span>
										</p>

										<p style="margin-top:3.65pt; text-align:justify; line-height:1.1pt"><span style="font-family:Arial; font-size:1pt; -aw-import:spaces">&#xa0;</span></p>
										
										<table cellspacing="0" cellpadding="0" style="margin-left:0.75pt; -aw-border-insideh:0.5pt single #000000; -aw-border-insidev:0.5pt single #000000; border-collapse:collapse">
											
											<tr>
												<td colspan="13" style="width:100%; border-style:solid; border-width:0.75pt; background-color:#254061;">
													<p style="text-align:center; margin:7px; line-height:10px"><span style="font-family:Arial; font-size:11px; font-weight:bold; color:#ffffff; background-color:#254061">Datos del contribuyente</span></p>
												</td>
											</tr>

											<tr>

												<td colspan="3" style="width:100%; border-style:solid; border-width:0.75pt; padding: 0px 10px; vertical-align:middle; background-color:#e6e6e6;">
													<p style="width:100%; margin:0px; text-align:center;"><span style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Cuenta</span></p>
												</td>

												<td colspan="4" style="width:100%; border-style:solid; border-width:0.75pt; padding: 0px 10px; vertical-align:middle; background-color:#e6e6e6;">
													<p style="text-align:center; margin:0px;"><span style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Propietario</span></p>
												</td>

												<td colspan="3" style="width:100%; border-style:solid; border-width:0.75pt; padding: 0px 10px; vertical-align:middle; background-color:#e6e6e6;">
													<p style="text-align:center; margin:0px;"><span style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Uso de suelo</span></p>
												</td>

												<td colspan="3" style="width:100%; border-style:solid; border-width:0.75pt; padding: 0px 10px; vertical-align:middle; background-color:#e6e6e6;">
													<p style="text-align:center; margin:0px;"><span style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Servicio</span></p>
												</td>

											</tr>
											
											<tr>

												<td colspan="3" style="width:90%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle;">
													<p style="text-align:center; width:100%; margin:0px;"><span style="font-family:Arial; font-size:6pt; color:#254061"> ${registro.cuenta}</span></p>
												</td>

												<td colspan="4" style="width:90%; padding: 0px 10px; border-style:solid; border-width:0.75pt; vertical-align:middle;">
													<p style="text-align:center; width:100%; margin:0px; line-height:10px;"><span style="font-family:Arial; font-size:6pt"; color:#254061;"> ${registro.propietario}</span></p>
												</td>

												<td colspan="3" style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle;">
													<p style="text-align:center; width:100%; margin:0px;"><span style="font-family:Arial; font-size:6pt; color:#254061">${registro.tipo_servicio}</span></p>
												</td>

												<td colspan="3" style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle;">
													<p style="text-align:center; width:100%; margin:0px;"><span style="font-family:Arial; font-size:6pt; color:#254061"> ${registro.servicio}</span></p>
												</td>

											</tr>
											
											<tr>
											
												<td colspan="13" style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle; background-color:#e6e6e6;">
													<p style="text-align:center; width:100%; margin:2px;"><span style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Domicilio del contribuyente</span></p>
												</td>

											</tr>

											<tr>

												<td colspan="13" style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle;">
													<p style="text-align:center; width:100%; margin:2px;"><span style="font-family:Arial; font-size:6pt; color:#254061">${registro.calle} ${registro.colonia}</span></p>
												</td>

											</tr>

											<tr>

												<td colspan="13" style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle; background-color:#254061;">
													<p style="text-align:center; width:100%; margin:5px;"><span style="font-family:Arial; font-size:11px; font-weight:bold; color:#ffffff; background-color:#254061">Geolocalización y reporte fotográfico del inmueble</span></p>
												</td>

											</tr>

											<tr>

												<td colspan="5" style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle; background-color:#e6e6e6;">
													<p style="text-align:center; width:100%; margin:0px;"><span style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Geolocalizacion</span></p>
												</td>

												<td colspan="4" style="width:77.75pt; border-style:solid; border-width:0.75pt; padding: 0px 10px; vertical-align:middle; background-color:#e6e6e6;">
													<p style="text-align:center; width:100%; margin:0px;"><span style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Fotografía de fachada</span></p>
												</td>

												<td colspan="4" style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle; background-color:#e6e6e6;">
													<p style="text-align:center; width:100%; margin:0px;"><span style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Fotografía de evidencia</span></p>
												</td>

											</tr>

											<tr>

												<td colspan="5" style="width:201.88pt; border-style:solid; border-width:0.75pt; padding-left:1.78pt; vertical-align:middle; -aw-border:0.5pt single">
													<p style="text-align:center; font-size:12pt" margin:0px;><img src="images/Aspose.Words.6967f853-0b82-4b0e-baa1-74f243f6653b.003.png" width="267px" height="194px" alt /></p>
												</td>

												<td colspan="4" rowspan="2"
													style="width:164.92pt; border-style:solid; border-width:0.75pt; padding-left:1.88pt; vertical-align:middle; -aw-border:0.5pt single">
													<p style="text-align:justify; font-size:12pt"><img
															src="${registro.url_evidencia}"
															width="217" height="213" alt
															style="-aw-left-pos:0pt; -aw-rel-hpos:column; -aw-rel-vpos:paragraph; -aw-top-pos:0pt; -aw-wrap-type:inline" /></p>
												</td>
												<td colspan="4" rowspan="2"
													style="width:164.82pt; border-style:solid; border-width:0.75pt; padding-left:1.88pt; vertical-align:middle; -aw-border:0.5pt single">
													<p style="text-align:justify; font-size:12pt"><img
															src="${registro.url_fachada}"
															width="217" height="213" alt
															style="-aw-left-pos:0pt; -aw-rel-hpos:column; -aw-rel-vpos:paragraph; -aw-top-pos:0pt; -aw-wrap-type:inline" /></p>
												</td>
											</tr>
											<tr style="height:14.95pt; -aw-height-rule:exactly">
												<td colspan="5"
													style="width:137.25pt; border-style:solid; border-width:0.75pt; padding-right:30.72pt; padding-left:35.67pt; vertical-align:middle; background-color:#e6e6e6; -aw-border:0.5pt single">
													<p style="text-align:justify; line-height:7.8pt"><span
															style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Latitud:
															${registro.latitud} Longitud: ${registro.longitud}</span></p>
												</td>
											</tr>
											<tr style="height:16.5pt; -aw-height-rule:exactly">
												<td colspan="13"
													style="width:145.5pt; border-style:solid; border-width:0.75pt; padding-right:194.08pt; padding-left:199.02pt; vertical-align:middle; background-color:#254061; -aw-border:0.5pt single">
													<p style="text-align:justify; line-height:8.9pt"><span
															style="font-family:Arial; font-size:8pt; font-weight:bold; color:#ffffff; background-color:#254061">Acciones
															realizadas al contribuyente</span></p>
												</td>
											</tr>
											<tr style="height:14.75pt; -aw-height-rule:exactly">

												<td colspan="2" style="width:23.65pt; border-style:solid; border-width:0.75pt; padding-right:38.78pt; padding-left:43.68pt; vertical-align:middle; background-color:#e6e6e6; -aw-border:0.5pt single">
													<p style="margin-top:0.05pt; text-align:justify; line-height:7.8pt"><span style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Tarea</span></p>
												</td>

												<td colspan="4"
													style="width:27.6pt; border-style:solid; border-width:0.75pt; padding-right:36.72pt; padding-left:41.68pt; vertical-align:middle; background-color:#e6e6e6; -aw-border:0.5pt single">
													<p style="text-align:justify; line-height:7.8pt"><span
															style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Gestor</span></p>
												</td>
												<td colspan="2"
													style="width:62.6pt; border-style:solid; border-width:0.75pt; padding-right:19.68pt; padding-left:24.58pt; vertical-align:middle; background-color:#e6e6e6; -aw-border:0.5pt single">
													<p style="text-align:justify; line-height:7.8pt"><span
															style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Fecha
															de captura</span></p>
												</td>
												<td colspan="4"
													style="width:32.25pt; border-style:solid; border-width:0.75pt; padding-right:35.52pt; padding-left:40.48pt; vertical-align:middle; background-color:#e6e6e6; -aw-border:0.5pt single">
													<p style="text-align:justify; line-height:7.8pt"><span
															style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Servicio</span></p>
												</td>
												<td
													style="width:32.6pt; border-style:solid; border-width:0.75pt; padding-right:35.42pt; padding-left:40.42pt; vertical-align:middle; background-color:#e6e6e6; -aw-border:0.5pt single">
													<p style="text-align:justify; line-height:7.8pt"><span
															style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Proceso</span></p>
												</td>
											</tr>
											<tr style="height:13.7pt; -aw-height-rule:exactly">

												<td colspan="2" style="width:100%; border-style:solid; border-width:0.75pt; padding-right:10px; padding-left:10px; vertical-align:middle; -aw-border:0.5pt single">
													<p style="text-align:center; line-height:6.7pt; width:!00%;"><span style="font-family:Arial; font-size:6pt; color:#254061">${registro.tarea_gestionada}</span></p>
												</td>

												<td colspan="4"
													style="width:85.35pt; border-style:solid; border-width:0.75pt; padding-right:7.02pt; padding-left:13.62pt; vertical-align:middle; -aw-border:0.5pt single">
													<p style="text-align:justify; line-height:6.7pt"><span
															style="font-family:Arial; font-size:6pt; color:#254061">Santo
															Domingo</span><span
															style="font-family:Arial; font-size:6pt; color:#254061; -aw-import:spaces">&#xa0;
														</span><span
															style="font-family:Arial; font-size:6pt; color:#254061">Moran
															Rojas </span></p>
												</td>
												<td colspan="2"
													style="width:60.05pt; border-style:solid; border-width:0.75pt; padding-right:20.92pt; padding-left:25.88pt; vertical-align:middle; -aw-border:0.5pt single">
													<p style="text-align:justify; line-height:6.7pt"><span
															style="font-family:Arial; font-size:6pt; color:#254061">23/11/2023
															11:42:40</span></p>
												</td>
												<td colspan="4"
													style="width:59.75pt; border-style:solid; border-width:0.75pt; padding-right:21.78pt; padding-left:26.72pt; vertical-align:middle; -aw-border:0.5pt single">
													<p style="text-align:justify; line-height:6.7pt"><span
															style="font-family:Arial; font-size:6pt; color:#254061">Regularización
															agua</span></p>
												</td>
												<td
													style="width:46.7pt; border-style:solid; border-width:0.75pt; padding-right:28.38pt; padding-left:33.38pt; vertical-align:middle; -aw-border:0.5pt single">
													<p style="text-align:justify; line-height:6.7pt"><span
															style="font-family:Arial; font-size:6pt; color:#254061">carta_invitacion</span></p>
												</td>
											</tr>
											<tr style="height:16.5pt; -aw-height-rule:exactly">
												<td colspan="13"
													style="width:97.9pt; border-style:solid; border-width:0.75pt; padding-right:217.88pt; padding-left:222.82pt; vertical-align:middle; background-color:#254061; -aw-border:0.5pt single">
													<p style="text-align:justify; line-height:8.9pt"><span
															style="font-family:Arial; font-size:8pt; font-weight:bold; color:#ffffff; background-color:#254061">Pagos
															del contribuyente</span></p>
												</td>
											</tr>
											<tr style="height:14.8pt; -aw-height-rule:exactly">
												<td
													style="width:21.35pt; border-style:solid; border-width:0.75pt; padding-right:32.12pt; padding-left:37.02pt; vertical-align:middle; background-color:#e6e6e6; -aw-border:0.5pt single">
													<p
														style="margin-top:0.05pt; text-align:justify; line-height:7.8pt"><span
															style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">CFDI</span></p>
												</td>
												<td colspan="3"
													style="width:54pt; border-style:solid; border-width:0.75pt; padding-right:15.28pt; padding-left:20.23pt; vertical-align:middle; background-color:#e6e6e6; -aw-border:0.5pt single">
													<p style="text-align:justify; line-height:7.8pt"><span
															style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Fecha
															de pago</span></p>
												</td>
												<td colspan="7"
													style="width:45.1pt; border-style:solid; border-width:0.75pt; padding-right:86.28pt; padding-left:91.22pt; vertical-align:middle; background-color:#e6e6e6; -aw-border:0.5pt single">
													<p style="text-align:justify; line-height:7.8pt"><span
															style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Descripción</span></p>
												</td>
												<td colspan="2"
													style="width:52.85pt; border-style:solid; border-width:0.75pt; padding-right:37.98pt; padding-left:42.98pt; vertical-align:middle; background-color:#e6e6e6; -aw-border:0.5pt single">
													<p style="text-align:justify; line-height:7.8pt"><span
															style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Monto
															pagado</span></p>
												</td>
											</tr>
											<tr style="height:13.6pt; -aw-height-rule:exactly">
												<td
													style="width:33.35pt; border-style:solid; border-width:0.75pt; padding-right:26.12pt; padding-left:31.02pt; vertical-align:middle; -aw-border:0.5pt single">
													<p style="text-align:justify; line-height:6.7pt"><span
															style="font-family:Arial; font-size:6pt; color:#254061">AD307258</span></p>
												</td>
												<td colspan="3"
													style="width:35.7pt; border-style:solid; border-width:0.75pt; padding-right:24.42pt; padding-left:29.38pt; vertical-align:middle; -aw-border:0.5pt single">
													<p style="text-align:justify; line-height:6.7pt"><span
															style="font-family:Arial; font-size:6pt; color:#254061">2023-12-07</span></p>
												</td>
												<td colspan="7"
													style="width:100.7pt; border-style:solid; border-width:0.75pt; padding-right:58.48pt; padding-left:63.42pt; vertical-align:middle; -aw-border:0.5pt single">
													<p style="text-align:justify; line-height:6.7pt"><span
															style="font-family:Arial; font-size:6pt; color:#254061">SUMINISTRO
															DE AGUA POTABLE</span></p>
												</td>
												<td colspan="2"
													style="width:18.4pt; border-style:solid; border-width:0.75pt; padding-right:55.18pt; padding-left:60.22pt; vertical-align:middle; -aw-border:0.5pt single">
													<p style="text-align:justify; line-height:6.7pt"><span
															style="font-family:Arial; font-size:6pt; color:#254061">1798</span></p>
												</td>
											</tr>
											<tr style="height:15pt; -aw-height-rule:exactly">
												<td colspan="11"
													style="width:18.62pt; border-style:solid; border-width:0.75pt; padding-left:385.48pt; vertical-align:middle; -aw-border:0.5pt single">
													<p style="text-align:justify; line-height:7.8pt"><span
															style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061">Total</span></p>
												</td>
												<td colspan="2"
													style="width:31.7pt; border-style:solid; border-width:0.75pt; padding-right:48.52pt; padding-left:53.58pt; vertical-align:top; -aw-border:0.5pt single">
													<p
														style="margin-top:3.15pt; text-align:justify; line-height:6.7pt"><span
															style="font-family:Arial; font-size:6pt; font-weight:bold; color:#254061">$1,798.00</span></p>
												</td>
											</tr>
											<tr style="height:0pt">
												<td style="width:91.25pt"></td>
												<td style="width:15.6pt"></td>
												<td style="width:26.55pt"></td>
												<td style="width:48.1pt"></td>
												<td style="width:22.9pt"></td>
												<td style="width:9.2pt"></td>
												<td style="width:55.05pt"></td>
												<td style="width:52.55pt"></td>
												<td style="width:50.75pt"></td>
												<td style="width:31.85pt"></td>
												<td style="width:1.05pt"></td>
												<td style="width:25.35pt"></td>
												<td style="width:109.2pt"></td>
											</tr>
										</table>
										<p
											style="margin-top:164.9pt; margin-right:9.2pt; text-align:center; line-height:11.95pt"><span
												style="font-family:Arial; font-size:8pt; font-weight:bold; color:#254061">______________________________________
											</span><span
												style="font-family:Arial; font-size:8pt; font-weight:bold; letter-spacing:126.5pt; color:#254061; -aw-import:spaces">&#xa0;</span>
											<span
												style="font-family:Arial; font-size:8pt; font-weight:bold; color:#254061">______________________________________ <br/>Firma </span><span
												style="font-family:Arial; font-size:8pt; font-weight:bold; letter-spacing:273.75pt; color:#254061; -aw-import:spaces">&#xa0;</span><span
												style="font-family:Arial; font-size:8pt; font-weight:bold; color:#254061">Firma
											</span></p>
										<p
											style="margin-top:0.05pt; margin-right:53.55pt; margin-left:58pt; text-align:center; line-height:11.95pt"><span
												style="font-family:Arial; font-size:8pt; font-weight:bold; color:#254061">Jhovany Francisco Cedillo Cardenas </span><span
												style="font-family:Arial; font-size:8pt; font-weight:bold; letter-spacing:175.3pt; color:#254061; -aw-import:spaces">&#xa0;</span>
											<span
												style="font-family:Arial; font-size:8pt; font-weight:bold; color:#254061">Lic.
												Elba Irene Silva López Representante legal ERPP</span><span
												style="font-family:Arial; font-size:8pt; font-weight:bold; letter-spacing:211.3pt; color:#254061">
											</span><span
												style="font-family:Arial; font-size:8pt; font-weight:bold; color:#254061">Tesorera
												Municipal</span></p>
										<p
											style="margin-top:31.05pt; margin-left:2.45pt; text-align:justify; line-height:7.8pt"><span
												style="font-family:Arial; font-size:7pt; color:#254061"></span></p>
										<p
											style="margin-top:3.45pt; margin-left:249.4pt; text-align:justify; line-height:7.8pt"><span
												style="font-family:Arial; font-size:7pt; color:#254061">Pagina
												1 de 1 </span></p>
										<p
											style="margin-right:181.1pt; margin-left:191.05pt; text-align:center; line-height:7.7pt"><span
												style="font-family:Arial; font-size:7pt; color:#254061">Detalles
												del contribuyente: 10530 cuautitlan mexico
												https://www.erpp.mx/ </span></p>
										<p
											style="margin-top:0.05pt; margin-left:259.3pt; text-align:justify; line-height:7.8pt"><span
												style="font-family:Arial; font-size:7pt; color:#254061">SER0®</span></p>
									</div>
								</body>

								</html>`} title="Vista previa" style={{ width: '100%', height: '100%', border: 'none' }} />

                </Box>


            </Box>

        </Box>

    )

}
					
Preview.propTypes = {
    registro: PropTypes.object.isRequired,
    setOpenPreview: PropTypes.func.isRequired
}