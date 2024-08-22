import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as echarts from 'echarts';
import { getIcon } from '../../data/Icons';


const FloatingWindow = ({ chartData, onClose, type, title }) => {

    const [isDragging, setIsDragging] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 100, y: 100 });
    const chartRef = useRef(null);

    const optionsBar = {
        xAxis: {
            type: 'category',
            data: chartData.map(c => c.name),
            axisLabel: {
                fontSize: 12
            },
        },
        // colorBy: 'series',
        color: ['#73c0de'],
        // gradientColor: ['#73c0de', '#d88273', '#bf444c'],
        stateAnimation: {
            animation: 'auto',
            animationDuration: 5000,
            animationEasing: 'cubicInOut'
        },
        tooltip: {
            show: true
        },
        yAxis: {
            type: 'value'
        },
        textStyle: {
            fontWeight: "bold"
        },
        series: [{
            data: chartData.map(c => c.value),
            type: type,
            label: {
                show: true,
                formatter: (params) => params.value.toLocaleString('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2
                })
            }
        }]
    }

    const optionsPie = {
        legend: {
            top: 0,
            left: 'start',
            itemWidth: 10
        },
        // tooltip: {
        //     trigger: 'item'
        // },
        aria: {
            decal: {
                show: true
            }
        },
        series: [
            {
                type: type,
                data: chartData,
                radius: ['36%', '75%'],
                avoidLabelOverlap: false,
                padAngle: 5,
                itemStyle: {
                    borderRadius: 10
                },
                label: {
                    show: false,
                    position: 'center',
                    formatter: (params) => params.value.toLocaleString('en-US', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2
                    })
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 20,

                    }
                },
                labelLine: {
                    show: false
                },
            }
        ]
    }


    const handleMouseDown = (e) => {
        setIsDragging(true);
        setOffset({
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - offset.x,
                y: e.clientY - offset.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleResizeMouseDown = (e) => {
        e.stopPropagation(); // Evita que se active el drag al redimensionar
    };


    useEffect(() => {
        if (chartData) {
            const chartInstance = echarts.init(chartRef.current);
            chartInstance.setOption(type === 'bar' ? optionsBar : optionsPie);

            new ResizeObserver(() => {
                if (chartRef.current.clientWidth != chartInstance.getWidth() || chartRef.current.clientHeight != chartInstance.getHeight()) {
                    chartInstance.resize();
                }
            }).observe(chartRef.current);

            return () => {
                chartInstance.dispose();
                window.removeEventListener('resize', chartInstance.resize);
            };
        }
    }, [chartData]);



    return ReactDOM.createPortal(
        <div
            className="floating-window"
            style={{
                top: position.y,
                left: position.x,
            }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            <div className="window-header" onMouseDown={handleMouseDown}>
                {title}
                <button onClick={onClose} className="close-button">
                    {getIcon('CloseIcon', {})}
                </button>
            </div>
            <div className="window-content">
                <div ref={chartRef} style={{ width: '100%', height: '300px' }}></div>
            </div>
            <div className="resize-handle" onMouseDown={handleResizeMouseDown} />
        </div>,
        document.body
    );
};

export default FloatingWindow
