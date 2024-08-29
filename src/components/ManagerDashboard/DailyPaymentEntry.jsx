import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { Box, ButtonGroup, Button, useTheme } from '@mui/material';
import { tokens } from '../../theme';

const DailyPaymentEntry = ({ data }) => {
    const chartContainerRef = useRef();
    const [chart, setChart] = useState(null);
    const [seriesMap, setSeriesMap] = useState({});
    const [visibleSeries, setVisibleSeries] = useState(new Set());
    const [seriesColors, setSeriesColors] = useState({});

    useEffect(() => {
        const chartInstance = createChart(chartContainerRef.current, {
            layout: {
                textColor: 'white',
                background: { type: 'solid', color: 'black' },
            },
            grid: {
                horzLines: {
                    visible: false,
                },
                vertLines: {
                    visible: false
                }
            },
            crossHair: {
                vertLine: {
                    color: '#758696',
                    width: 1,
                    style: 1,
                },
                horzLine: {
                    color: '#758696',
                    width: 1,
                    style: 1,
                },
            },
            timeScale: {
                borderVisible: false,
            },
            priceScale: {
                borderVisible: false,
                priceFormatter: (price) => `$${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
            },
        });

        const initialSeriesMap = {};
        const colorMap = {};
        data.forEach((seriesData) => {
            const lineSeries = chartInstance.addLineSeries({ color: seriesData.color });
            lineSeries.setData(seriesData.data);
            initialSeriesMap[seriesData.name] = lineSeries;
            colorMap[seriesData.name] = seriesData.color; 
        });

        setChart(chartInstance);
        setSeriesMap(initialSeriesMap);
        setSeriesColors(colorMap);

        setVisibleSeries(new Set(Object.keys(initialSeriesMap)));

        chartInstance.timeScale().fitContent();

        return () => chartInstance.remove();
    }, [data]);

    useEffect(() => {
        if (chart && seriesMap) {
            Object.keys(seriesMap).forEach(seriesName => {
                const series = seriesMap[seriesName];
                const visible = visibleSeries.has(seriesName);
                series.setData(visible ? data.find(d => d.name === seriesName).data : []); // Actualizar los datos
            });
        }
    }, [visibleSeries]);

    const handleButtonClick = (seriesName) => {
        setVisibleSeries(prev => {
            const newSet = new Set(prev);
            if (newSet.has(seriesName)) {
                newSet.delete(seriesName);
            } else {
                newSet.add(seriesName);
            }
            return newSet;
        });
    };

    return (
        <Box>
            <Box ref={chartContainerRef} style={{ height: '400px' }} />
            <ButtonGroup variant="contained" sx={{ mt: 2 }}>
                {data.map((seriesData) => (
                    <Button
                        key={seriesData.name}
                        onClick={() => handleButtonClick(seriesData.name)}
                        sx={{
                            backgroundColor: visibleSeries.has(seriesData.name) ? seriesColors[seriesData.name] : 'default',
                            color: visibleSeries.has(seriesData.name) ? 'white' : 'inherit',
                            '&:hover': {
                                backgroundColor: visibleSeries.has(seriesData.name) ? seriesColors[seriesData.name] : 'default',
                            },
                        }}
                    >
                        {seriesData.name}
                    </Button>
                ))}
            </ButtonGroup>
        </Box>
    );
};

export default DailyPaymentEntry;
