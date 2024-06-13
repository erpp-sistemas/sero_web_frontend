import { useState } from 'react'
import { tokens } from '../../theme'

// LIBRARIES
import { Box, useTheme, Typography, Button } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

// ICONS
import NewspaperIcon from '@mui/icons-material/Newspaper'
import PaidIcon from '@mui/icons-material/Paid'
import PushPinIcon from '@mui/icons-material/PushPin'
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import MyLocationIcon from '@mui/icons-material/MyLocation'
import PhotoIcon from '@mui/icons-material/Photo'
import RequestQuoteIcon from '@mui/icons-material/RequestQuote'

// COMPONENTS
import RecaudacionGestor from '../../components/RecaudacionGestor'
import PorcentajeGestor from '../../components/PorcentajeGestor'
import StatBox from '../../components/StatBox'
import ProgressCircle from "../../components/ProgressCircle"
import Legend from '../../components/LightweightCharts/Legend'
import BarStack from '../../components/NivoChart/BarStack'
import Pie from '../../components/NivoChart/Pie'
import ModalBox from '../../components/ModalBox'
import ModalGridData from '../../components/ModalGridData'

// DATA TEMP
import { data, data_cuentas_pagadas, data_tipo_servicio_bar } from '../../data/BarStack'
import { data as data_pie, data_tipo_servicio } from '../../data/Pie'

const Index = () => {

    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const [showModal, setShowModal] = useState(false)
    const [showModalGrid, setShowModalGrid] = useState(false)
    const [titleModal, setTitleModal] = useState('')

    const openModalBox = (box) => {
        setTitleModal(box)
        setShowModal(true)
    }

    return (
        <Box
            m='20px'
        >
            {showModal && (<ModalBox setShowModal={setShowModal} title={titleModal} setShowModalGrid={setShowModalGrid} />)}
            {showModalGrid && (<ModalGridData setShowModal={setShowModalGrid} />)}

            {/* RANGO DE FECHAS */}
            <DatePicker
                sx={{ width: '36%', backgroundColor: colors.primary[1000] }}
                // onChange={(e) => changeControl(e, 'fechaNacimiento')}
                views={["year", "month", "day"]}
                format="DD-MM-YYYY"
                disableFuture
                label='Fecha inicial'
            />

            <DatePicker
                sx={{ width: '36%', backgroundColor: colors.primary[1000], marginLeft: '10px' }}
                // onChange={(e) => changeControl(e, 'fechaNacimiento')}
                views={["year", "month", "day"]}
                format="DD-MM-YYYY"
                disableFuture
                label='Fecha final'
            />

            <Button variant="contained" color="success"
                sx={{ marginLeft: '10px', width: '120px', height: '40px', position: 'relative', top: '5px' }}>
                Aplicar
            </Button>

            {/* FILA 1 datos generales */}
            <Box
                id="grid-1"
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="100px"
                gap="15px"
                sx={{ margin: '20px 0' }}
            >


                <Box
                    gridColumn='span 3'
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="10px"
                    onClick={() => openModalBox('Gestiones')}
                    sx={{ cursor: 'pointer' }}
                >
                    <StatBox
                        title="Gestiones"
                        subtitle={1250}
                        icon={
                            <NewspaperIcon
                                sx={{ color: 'black', fontSize: "28px" }}
                            />
                        }
                    />
                </Box>

                <Box
                    gridColumn='span 3'
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="10px"
                    // onClick={() => openModalBox('Jornadas')}
                    sx={{ cursor: 'pointer' }}
                >
                    <StatBox
                        title="Localizados"
                        subtitle={1250}
                        icon={
                            <PushPinIcon
                                sx={{ color: 'black', fontSize: "28px" }}
                            />
                        }
                    />
                </Box>

                <Box
                    gridColumn='span 3'
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="10px"
                    // onClick={() => openModalBox('Jornadas')}
                    sx={{ cursor: 'pointer' }}
                >
                    <StatBox
                        title="No localizados"
                        subtitle={1250}
                        icon={
                            <DoNotDisturbAltIcon
                                sx={{ color: 'black', fontSize: "28px" }}
                            />
                        }
                    />
                </Box>

                <Box
                    gridColumn='span 3'
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="10px"
                    // onClick={() => openModalBox('Jornadas')}
                    sx={{ cursor: 'pointer' }}
                >
                    <StatBox
                        title="Gestores"
                        subtitle={1250}
                        icon={
                            <AssignmentIndIcon
                                sx={{ color: 'black', fontSize: "28px" }}
                            />
                        }
                    />
                </Box>


            </Box>

            {/* FILA 2 */}
            <Box
                id="grid-1"
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="390px"
                gap="15px"
                sx={{ margin: '20px 0' }}
            >

                <Box
                    gridColumn='span 7'
                    backgroundColor={colors.primary[400]}
                    borderRadius="10px"
                    sx={{ cursor: 'pointer' }}
                >

                    {/* <Legend
                        title='NÚMERO DE GESTIONES TOTALES'
                        data=''
                    /> */}
                </Box>

                <RecaudacionGestor size_grid={5} />


            </Box>


            {/* FILA 3 */}
            <Box
                id="grid-1"
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="300px"
                gap="15px"
                sx={{ margin: '20px 0' }}
            >

                <Box
                    gridColumn='span 3'
                    backgroundColor={colors.primary[400]}
                    borderRadius="10px"
                >
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{ padding: "10px 30px 0 20px" }}
                            color={colors.grey[100]}
                        >
                            META ESTABLECIDA
                        </Typography>
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            mt="25px"
                        >
                            <ProgressCircle size="125" progress={.25} />
                            <Typography
                                variant="h4"
                                color={colors.blueAccent[500]}
                                sx={{ mt: "15px" }}
                            >
                                40000
                            </Typography>
                            <Typography variant="h5"> {'24.96%'} </Typography>
                            <Typography> {'En progreso'} </Typography>
                        </Box>

                    </Box>
                </Box>

                <Box
                    gridColumn='span 9'
                    backgroundColor={colors.primary[400]}
                    borderRadius="10px"
                >
                    <Box
                        mt="10px"
                        p="0 10px"
                        justifyContent="space-between"
                        alignItems="center"
                    >

                        <Typography
                            variant="h5"
                            fontWeight="600"
                            sx={{ padding: "2px 30px 0 5px" }}
                            color={colors.grey[200]}
                        >
                            GESTIONES POR TIPO DE SERVICIO Y ESTATUS DE LOCALIZACIÓN
                        </Typography>
                    </Box>

                    <Box
                        gridColumn='span 9'
                        backgroundColor={colors.primary[400]}
                        borderRadius="10px"
                        sx={{ padding: '0 5px' }}
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        height='266px'
                    >

                        <Box sx={{ width: '49%', height: '97%' }}>
                            {/* <Pie data={data_tipo_servicio} theme='yellow_green_blue' /> */}
                        </Box>

                        <Box sx={{ width: '49%', height: '97%' }}>
                            {/* <Pie data={data_pie} theme='accent' /> */}
                        </Box>



                    </Box>

                </Box>

            </Box>

            {/* FILA 4 */}
            <Box
                id="grid-1"
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="350px"
                gap="15px"
                sx={{ margin: '20px 0' }}
            >

                {/* GRAFICA DE BARRA EN STACK MOSTRANDO TOTAL DE GESTIONES POR GESTOR Y CUANTAS FUERON LOCALIZADAS */}
                <Box
                    gridColumn='span 12'
                    backgroundColor={colors.primary[400]}
                    borderRadius="10px"
                    sx={{ cursor: 'pointer' }}

                >

                    <Box
                        mt="10px"
                        mb="-15px"
                        p="0 10px"
                        justifyContent="space-between"
                        alignItems="center"
                    >

                        <Typography
                            variant="h5"
                            fontWeight="600"
                            sx={{ padding: "2px 30px 0 5px" }}
                            color={colors.grey[200]}
                        >
                            GESTIONES POR GESTOR Y ESTATUS DE LOCALIZACIÓN
                        </Typography>
                    </Box>

                    <BarStack data={data} position='vertical' color='nivo' keys={['localizado', 'no localizado']} groupMode={false} />
                </Box>
            </Box>

            {/* FILA 6 */}
            <Box
                id="grid-1"
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="300px"
                gap="15px"
                sx={{ margin: '20px 0' }}
            >
                {/* GRAFICA DE BARRA MOSTRANDO TOTAL DE GESTIONES POR GESTOR Y CUANTAS TIPO DE SERVICIO CAPTURADOS */}
                <Box
                    gridColumn='span 12'
                    backgroundColor={colors.primary[400]}
                    borderRadius="10px"
                    sx={{ cursor: 'pointer' }}
                >
                    <Box
                        mt="10px"
                        mb="-15px"
                        p="0 10px"
                        justifyContent="space-between"
                        alignItems="center"
                    >

                        <Typography
                            variant="h5"
                            fontWeight="600"
                            sx={{ padding: "2px 30px 0 5px" }}
                            color={colors.grey[200]}
                        >
                            GESTIONES CON TIPO DE SERVCIO CAPTURADO POR GESTOR
                        </Typography>
                    </Box>

                    <BarStack data={data_tipo_servicio_bar} position='horizontal' color='nivo'
                        keys={['tipo servicio', 'no tipo servicio']} groupMode={false} />
                </Box>
            </Box>

            {/* FILA 7 */}
            <Box
                id="grid-1"
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="100px"
                gap="15px"
                sx={{ marginTop: '20px' }}
            >


                <Box
                    gridColumn='span 3'
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="10px"
                    // onClick={() => openModalBox('Jornadas')}
                    sx={{ cursor: 'pointer' }}
                >
                    <StatBox
                        title="Gestiones con pago"
                        subtitle={1250}
                        icon={
                            <RequestQuoteIcon
                                sx={{ color: 'black', fontSize: "28px" }}
                            />
                        }
                    />
                </Box>

                <Box
                    gridColumn='span 3'
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="10px"
                    // onClick={() => openModalBox('Jornadas')}
                    sx={{ cursor: 'pointer' }}
                >
                    <StatBox
                        title="Gestiones sin posicion"
                        subtitle={1250}
                        icon={
                            <MyLocationIcon
                                sx={{ color: 'black', fontSize: "28px" }}
                            />
                        }
                    />
                </Box>


                <Box
                    gridColumn='span 3'
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="10px"
                    // onClick={() => openModalBox('Jornadas')}
                    sx={{ cursor: 'pointer' }}
                >
                    <StatBox
                        title="Gestiones sin foto"
                        subtitle={1250}
                        icon={
                            <PhotoIcon
                                sx={{ color: 'black', fontSize: "28px" }}
                            />
                        }
                    />
                </Box>

                <Box
                    gridColumn='span 3'
                    backgroundColor={colors.primary[400]}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="10px"
                    // onClick={() => openModalBox('Jornadas')}
                    sx={{ cursor: 'pointer' }}
                >
                    <PaidIcon sx={{ fontSize: '50px', color: colors.greenAccent[700] }} />
                </Box>



            </Box>

            {/* FILA 8 */}
            <Box
                id="grid-1"
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="300px"
                gap="15px"
                sx={{ margin: '20px 0' }}
            >
                {/* GRAFICA DE BARRA MOSTRANDO TOTAL DE GESTIONES POR GESTOR Y CUANTAS FUERON PAGADAS */}
                <Box
                    gridColumn='span 12'
                    backgroundColor={colors.primary[400]}
                    borderRadius="10px"
                    sx={{ cursor: 'pointer' }}
                >

                    <Box
                        mt="10px"
                        mb="-15px"
                        p="0 10px"
                        justifyContent="space-between"
                        alignItems="center"
                    >

                        <Typography
                            variant="h5"
                            fontWeight="600"
                            sx={{ padding: "2px 30px 0 5px" }}
                            color={colors.grey[200]}
                        >
                            GESTIONES POR GESTOR Y CUANTAS FUERON PAGADAS
                        </Typography>
                    </Box>

                    <BarStack data={data_cuentas_pagadas} position='vertical' color='yellow_green'
                        keys={['gestionadas', 'pagadas']} groupMode={true} />
                </Box>
            </Box>

            {/* FILA 9 */}
            <Box
                id="grid-1"
                display="grid"
                gridTemplateColumns="repeat(12, 1fr)"
                gridAutoRows="390px"
                gap="15px"
                sx={{ margin: '20px 0' }}
            >
                <RecaudacionGestor size_grid={6} />

                <PorcentajeGestor size_grid={6} />

            </Box>


        </Box>
    )
}

export default Index