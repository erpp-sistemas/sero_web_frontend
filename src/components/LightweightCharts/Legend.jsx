import { useState, useEffect, useRef } from 'react'
import { createChart, ColorType } from 'lightweight-charts'
import { useTheme, Typography, Box, ButtonGroup, Button } from '@mui/material'
import { tokens } from '../../theme'


const initialData = [
    { time: '2019-09-01', value: 100 },
    { time: '2019-10-01', value: 90 },
    { time: '2019-11-01', value: 220 },
    { time: '2019-12-01', value: 120 },
];

const Legend = ({ title, data }) => {

    const theme = useTheme();
    const color = tokens(theme.palette.mode);
    const chartContainerRef = useRef();

    const [total, setTotal] = useState(0);

    const colors = {
        backgroundColor: color.primary[400],
        lineColor: color.greenAccent[400],
        textColor: color.grey[500],
        areaTopColor: '#071d54',
        areaBottomColor: 'rgba(14, 30, 76, 0.19)',
    }

    useEffect(() => {
        const handleResize = () => {
            chart.applyOptions({
                width: chartContainerRef.current.clientWidth,
            });
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: colors.backgroundColor },
                textColor: colors.textColor,
            },
            grid: {
                vertLines: false,
                horzLines: false
            },

            width: chartContainerRef.current.clientWidth,
            height: 300,
        });
        chart.timeScale().fitContent();

        const newSeries = chart.addAreaSeries({ lineColor: colors.lineColor, topColor: colors.areaTopColor, bottomColor: colors.areaBottomColor });
        newSeries.setData(initialData);

        chart.subscribeCrosshairMove(param => {
            //console.log(param)
            let priceFormatted = '';
            if(param.time) {
                const data = param.seriesData.get(newSeries);
                const price = data.value !== undefined ? data.value : data.close;
                priceFormatted = price;
                setTotal(priceFormatted)
            }
        })

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);

            chart.remove();
        };
    }, [initialData, colors.backgroundColor, colors.lineColor, colors.textColor, colors.areaTopColor, colors.areaBottomColor]);



    return (
        <Box
            sx={{ backgroundColor: color.primary[400], borderRadius: '10px' }}
        >
            <Typography
                sx={{ padding: '10px 10px 0 10px', fontSize: '16px', color: color.grey[200] }}
            >{title}</Typography>

            <Box sx={{ padding: '10px 10px 0 10px', display: 'flex', justifyContent: 'space-betwenn', alignItems: 'center' }}>
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    <Button sx={{ backgroundColor: color.greenAccent[600] }}>Mes</Button>
                    <Button sx={{ backgroundColor: color.greenAccent[600] }}>Semana</Button>
                    <Button sx={{ backgroundColor: color.greenAccent[600] }}>Día</Button>
                </ButtonGroup>
                <Typography
                    sx={{ padding: '0px 10px 0 10px', fontSize: '20px', color: color.grey[200] }}
                >{`Total: ${total}`}</Typography>
            </Box>


            <div 
                ref={chartContainerRef}
            />
        </Box>
    )
}

export default Legend