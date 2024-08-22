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
        title: [
            {
                text: title
            }
        ],
        xAxis: {
            type: 'category',
            data: chartData.map(c => c.name)
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: chartData.map(c => c.value),
            type: type,
            label: {
                show: true,
                formatter: (params) => params.value.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })
            },
            barWidth: '90%',
        }]
    }

    const optionsPie = {
        title: [
            {
                text: title
            }
        ],
        legend: {
            top: '1%',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                type: type,
                data: chartData,
                radius: ['36%', '81%'],
                avoidLabelOverlap: false,
                padAngle: 5,
                itemStyle: {
                    borderRadius: 10
                },
                label: {
                    show: false,
                    position: 'center',
                    formatter: (params) => params.value.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
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
                <button onClick={onClose} className="close-button">
                    {getIcon('CloseIcon', {})}
                </button>
            </div>
            <div className="window-content">
                <div ref={chartRef} style={{ width: '100%', height: '250px' }}></div>
            </div>
            <div className="resize-handle" onMouseDown={handleResizeMouseDown} />
        </div>,
        document.body
    );
};

export default FloatingWindow
