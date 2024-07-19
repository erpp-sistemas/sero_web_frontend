import React from 'react'
import { Calendar as CalendarHook, dayjsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import dayjs from 'dayjs'


import '../../scenes/ausencias-personal/stylesCustomCalendar.css'
import { Box, Button, Tooltip, Typography } from '@mui/material'



const Calendar = () => {
    const localizer=dayjsLocalizer(dayjs)

    const events=[
        {
        start:dayjs('2024-07-19T12:00:00').toDate(),
        end:dayjs('2024-07-22T12:00:00').toDate(),
        title:"Evento 1"
     },
        {
        start:dayjs('2024-07-21T12:00:00').toDate(),
        end:dayjs('2024-07-22T12:00:00').toDate(),
        title:"Evento 2"
     }
]

    const eventComponet=({title})=>{
            console.log(title)
            return <div>
                <Tooltip title="You don't have permission to do this" followCursor>
                    <Box sx={{ bgcolor: 'text.disabled', color: 'background.paper', p: 2 }}>
                    hola soy un componente
                    {title}
                    </Box>
                </Tooltip>
            </div>
        
    }

    const CustomDateCellWrapper = (props) => {
        // console.log()
        const isWeekend = props.value.getDay() === 6 || props.value.getDay() === 0;
        const isToday = dayjs().isSame(props.value, 'day');
    
        return (
          <div
            className={`rbc-day-bg ${isWeekend && 'weekend noLaboralble' } ${isToday && 'rbc-today' }`}
          >
            {isWeekend && (
                <Box  height="100%" display="flex" justifyContent="center" alignItems="center" flexWrap="wrap" >
                    <Typography >
                    DÍA NO LABORABLE
                    </Typography>
                    <Button variant="contained" color="primary" my="auto">
                    Botón
                  </Button>
                </Box>
                  
            )}
            {props.children}
          </div>
        );
      };


  return (
    <CalendarHook
        messages={{
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día"
        }}
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={['month','week']}
        components={{event:eventComponet,dateCellWrapper:CustomDateCellWrapper,}}
        style={{ height: "80vh",padding:"20px" }}

    />
  )
}

export default Calendar