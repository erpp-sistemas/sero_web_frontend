import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { Box, Button, ButtonGroup } from '@mui/material';

const ChartExample = ({ dayData, weekData, monthData, yearData }) => {
    const chartContainerRef = useRef();
    const [chart, setChart] = useState(null);
    const [lineSeries, setLineSeries] = useState(null);
    const [selectedInterval, setSelectedInterval] = useState('1D'); 

    const seriesesData = {
        '1D': dayData,
        '1W': weekData,
        '1M': monthData,
        '1Y': yearData,
    };

    const intervalColors = {
        '1D': '#2962FF',
        '1W': 'rgb(225, 87, 90)',
        '1M': 'rgb(242, 142, 44)',
        '1Y': 'rgb(164, 89, 209)',
    };

    useEffect(() => {
        const chartInstance = createChart(chartContainerRef.current, {
            layout: {
                textColor: 'white',
                background: { type: 'solid', color: 'black' },
            },
            height: 200,
        });

        const series = chartInstance.addLineSeries({ color: intervalColors['1D'] });
        series.setData(seriesesData['1D']);
        setChart(chartInstance);
        setLineSeries(series);

        return () => chartInstance.remove();
    }, []);

    const setChartInterval = (interval) => {
        setSelectedInterval(interval);
        if (lineSeries) {
            lineSeries.setData(seriesesData[interval]);
            lineSeries.applyOptions({
                color: intervalColors[interval],
            });
            chart.timeScale().fitContent();
        }
    };

    return (
        <Box>
            <Box ref={chartContainerRef} />
            <ButtonGroup variant="contained" sx={{ mt: 2 }}>
                {['1D', '1W', '1M', '1Y'].map((interval) => (
                    <Button
                        key={interval}
                        onClick={() => setChartInterval(interval)}
                        color={selectedInterval === interval ? 'secondary' : 'info'}
                        variant={selectedInterval === interval ? 'contained' : 'outlined'}
                    >
                        {interval}
                    </Button>
                ))}
            </ButtonGroup>
        </Box>
    );
};

export default ChartExample;
