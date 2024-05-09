import { Box, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PropTypes from 'prop-types'
export default function Preview({ registro, setOpenPreview }) {

    return (

        <Box sx={{ position:'absolute', width:'100%', height:'100vh', display: 'flex', alignItems: 'center', top:'0px', left:'0', zIndex:'20000', background:'rgba(0, 0, 0, 0.42)', flexDirection:'column', justifyContent:'center' }}>
            
			<Box sx={{ width:'90%', padding:'20px', height:'90%', background:'#ffffff', display: 'flex', alignItems: 'center', justifyContent:'center', flexDirection:'column', gap:'1rem', borderRadius:'10px', position:'relative' }}>
                
				<button onClick={() => setOpenPreview(false)} className='preview_close'><CloseIcon sx={{ fontSize:'1.5rem', color:'black', fontWeight:'900' }} /></button>
                
				<Typography sx={{ color:'black', fontSize:'1.5rem', fontWeight:'600' }}>Vista previa</Typography>

                <Box sx={{ 
					width:'100%', 
					height:'100%', 
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

										<div style="width:100%; margin:0px; margin-bottom:10px; text-align:center; font-size:14pt; display: flex; align-items:end; justify-content:space-between; ">

											<div style="width:25%;">
												<img style="margin-bottom: 20px;" src="https://docsfichas.s3.us-east-2.amazonaws.com/statics/logo_erpp_azul.png" width="160" height="80" alt style="-aw-left-pos:0pt; -aw-rel-hpos:column; -aw-rel-vpos:paragraph; -aw-top-pos:0pt; -aw-wrap-type:inline" />
											</div>			
											
											<div style="width:50%; text-align:center; font-size:14pt; display: flex; align-items:center; justify-content:space-between; flex-direction:column;">
												<span style="font-family:Arial; font-weight:bold; color:#254061">ERPP Corporativo S.A de C.V</span>
												<span style="margin-top:20px; font-family:Arial; font-size:11pt; font-weight:bold; color:#254061">Información general de la cuenta</span>
											</div>
											
											<div style="width:25%;">
												<img src="https://docsfichas.s3.us-east-2.amazonaws.com/statics/logo_municipio_cuautitlan_mexico.png" width="187" height="80" alt style="-aw-left-pos:0pt; -aw-rel-hpos:column; -aw-rel-vpos:paragraph; -aw-top-pos:0pt; -aw-wrap-type:inline" />
												<span style="font-family:Arial; font-size:6pt; font-weight:bold; color:#254061">Folio:ERPP/CMOA/31DIC/DOM/0001/10530</span>
											</div>
											
										</div>
												
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
													<p style="text-align:center; font-size:12pt" margin:0px;><img src="https://docsfichas.s3.us-east-2.amazonaws.com/statics/mapaPrueba.png" width="267px" height="194px" alt /></p>
												</td>

												<td colspan="4" rowspan="2" style="width:164.92pt; border-style:solid; border-width:0.75pt; padding-left:1.88pt; vertical-align:middle; -aw-border:0.5pt single">
													<p style="text-align:justify; font-size:12pt"><img src="${registro.url_evidencia}" width="217" height="213" alt style="-aw-left-pos:0pt; -aw-rel-hpos:column; -aw-rel-vpos:paragraph; -aw-top-pos:0pt; -aw-wrap-type:inline" /></p>
												</td>

												<td colspan="4" rowspan="2" style="width:164.82pt; border-style:solid; border-width:0.75pt; padding-left:1.88pt; vertical-align:middle; -aw-border:0.5pt single">
													<p style="text-align:justify; font-size:12pt"><img src="${registro.url_fachada}" width="217" height="213" alt style="-aw-left-pos:0pt; -aw-rel-hpos:column; -aw-rel-vpos:paragraph; -aw-top-pos:0pt; -aw-wrap-type:inline" /></p>
												</td>

											</tr>
											
											<tr style="height:14.95pt; -aw-height-rule:exactly">

												<td colspan="5"
													style="width:137.25pt; border-style:solid; border-width:0.75pt; padding-right:30.72pt; padding-left:35.67pt; vertical-align:middle; background-color:#e6e6e6; -aw-border:0.5pt single">
													<p style="text-align:center; width:100%; margin:0px;"><span style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Latitud: ${registro.latitud} Longitud: ${registro.longitud}</span></p>
												</td>

											</tr>

											<tr>

												<td colspan="13" style="width:100%; border-style:solid; border-width:0.75pt; padding: 0px 10px; vertical-align:middle; background-color:#254061;">
													<p style="text-align:center; width:100%; margin:5px;"><span style="font-family:Arial; font-size:11px; font-weight:bold; color:#ffffff; background-color:#254061">Acciones realizadas al contribuyente</span></p>
												</td>

											</tr>

											<tr>

												<td colspan="2" style="width:100%; border-style:solid; border-width:0.75pt; padding-right: 0px 10px; vertical-align:middle; background-color:#e6e6e6;">
													<p style="width:100%; text-align:center; margin: 0px;"><span style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Tarea</span></p>
												</td>

												<td colspan="2" style="width:100%; border-style:solid; border-width:0.75pt; padding: 0px 10px; vertical-align:middle; background-color:#e6e6e6;">
													<p style="width:100%; text-align:center; margin: 0px;"><span style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Gestor</span></p>
												</td>

												<td colspan="2" style="width:100%; border-style:solid; border-width:0.75pt; padding: 0px 10px; vertical-align:middle; background-color:#e6e6e6;">
													<p style="width:100%; text-align:center; margin:0px;"><span style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Fecha de captura</span></p>
												</td>

												<td colspan="6" style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle; background-color:#e6e6e6;">
													<p style="width:100%; text-align:center; margin:0px;"><span style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Servicio</span></p>
												</td>

												<td style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle; background-color:#e6e6e6;">
													<p style="width:100%; text-align:center; margin:0px;"><span style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Proceso</span></p>
												</td>>

											</tr>

											<tr>

												<td colspan="2" style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle;">
													<p style="width:100%; text-align:center; margin:0px; "><span style="font-family:Arial; font-size:6pt; color:#254061">${registro.tarea_gestionada}</span></p>
												</td>

												<td colspan="2" style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 5px; vertical-align:middle;">
													<p style="width:100%; text-align:center; line-height: 8px; margin:0px;"><span style="font-family:Arial; font-size:8px; color:#254061">${registro.gestor}</span></p>
												</td>

												<td colspan="2" style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle;">
													<p style="width:100%; text-align:center; margin:0px; "><span style="font-family:Arial; font-size:6pt; color:#254061">${registro.fecha_gestion}</span></p>
												</td>

												<td colspan="6" style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle;">
													<p style="width:100%; text-align:center; margin:2px; line-height: 8px;"><span style="font-family:Arial; font-size:6pt; color:#254061">${registro.servicio}</span></p>
												</td>

												<td style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle;">
													<p style="width:100%; text-align:center; margin:0px; "><span style="font-family:Arial; font-size:6pt; color:#254061">${registro.tipo_gestion}</span></p>
												</td>

											</tr>

											<tr>

												<td colspan="13" style="width:100%; border-style:solid; border-width:0.75pt; padding: 0px 10px; vertical-align:middle; background-color:#254061;">
													<p style="text-align:center; width:100%; margin:5px;"><span style="font-family:Arial; font-size:11px; font-weight:bold; color:#ffffff; background-color:#254061">Pagos del contribuyente</span></p>
												</td>

											</tr>

											<tr>

												<td style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle; background-color:#e6e6e6;">
													<p style="width:100%; text-align:center; margin:0px;"><span style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">CFDI</span></p>
												</td>

												<td colspan="3" style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle; background-color:#e6e6e6;">
													<p style="width:100%; text-align:center; margin:0px;"><span style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Fecha de pago</span></p>
												</td>

												<td colspan="7" style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle; background-color:#e6e6e6;">
													<p style="width:100%; text-align:center; margin:0px;"><span style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Descripción</span></p>
												</td>

												<td colspan="2" style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle; background-color:#e6e6e6;">
													<p style="width:100%; text-align:center; margin:0px;"><span style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061; background-color:#e6e6e6">Monto pagado</span></p>
												</td>

											</tr>

											<tr>

												<td style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle;">
													<p style="width:100%; text-align:center; margin:0px; "><span style="font-family:Arial; font-size:6pt; color:#254061">${registro.recibo}</span></p>
												</td>

												<td colspan="3" style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle;">
													<p style="width:100%; text-align:center; margin:0px; "><span style="font-family:Arial; font-size:6pt; color:#254061">${registro.fecha_pago}</span></p>
												</td>

												<td colspan="7" style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle;">
													<p style="width:100%; text-align:center; margin:0px; "><span style="font-family:Arial; font-size:6pt; color:#254061">SUMINISTRO DE AGUA POTABLE</span></p>
												</td>

												<td colspan="2" style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle;">
													<p style="width:100%; text-align:center; margin:0px; "><span style="font-family:Arial; font-size:6pt; color:#254061">1798</span></p>
												</td>

											</tr>

											<tr>
												<td colspan="11" style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle;">
													<p style="width:100%; text-align:end; margin:0px;"><span style="font-family:Arial; font-size:7pt; font-weight:bold; color:#254061">Total</span></p>
												</td>

												<td colspan="2" style="width:100%; border-style:solid; border-width:0.75pt; padding:0px 10px; vertical-align:middle;">
													<p style="width:100%; text-align:center; margin:0px;"><span style="font-family:Arial; font-size:6pt; font-weight:bold; color:#254061">$1,798.00</span></p>
												</td>

											</tr>

										</table>

										<div style="width:100%; margin-top:300px; display:flex; justify-content: space-between; aling-items:center;">

											<div style="width:40%;">
												<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">_____________________________________</p>
												<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">Firma</p>
												<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">Jhovany Francisco Cedillo Cardenas</p>
												<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">Representante legal ERPP</p>
											</div>

											<div style="width:40%;">
												<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">_____________________________________</p>
												<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">Firma</p>
												<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">Lic. Elba Irene Silva López</p>
												<p style="width:100%; text-align: center; font-family:Arial; font-size:11px; font-weight:bold; color:#254061; line-height:7px;">Tesorera Municipal</p>
											</div>

										</div>


										<div style="width:100%; border-top: 1.5px solid rgb(175, 175, 175); margin-top:70px; display:flex; justify-content:center; align-items:center; flex-direction:column;">
											<p style="font-family:Arial; margin:0px; margin-top:10px; font-size:9px; line-height:12	px; font-weight:bold; color:gray">Pagina 1 de 1</p>
											<p style="font-family:Arial; margin:0px; font-size:9px; line-height:12px; font-weight:bold; color:gray">Detalles del contribuyente: 10530 cuautitlan mexico</p>
											<p style="font-family:Arial; margin:0px; font-size:9px; line-height:12px; font-weight:bold; color:gray">https://www.erpp.mx/</p>
											<p style="font-family:Arial; margin:0px; font-size:9px; line-height:12px; font-weight:bold; color:gray">SER0®</p>
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