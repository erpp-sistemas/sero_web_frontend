import { ResponsiveBar } from '@nivo/bar';
import React from 'react';
import { useTheme } from '@mui/material'
import { tokens } from '../../theme'

const ChartComponent = ({ data, field, title }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const chartData = data.map(item => ({
        answer: item.answer,
        count: item.count,
        color: item.color  
    }));

    return (
        <div style={{ height: '400px', width:'100%', marginBottom: '40px' }}>
            <h3>{title}</h3>
            <ResponsiveBar
                data={chartData}
                keys={['count']}
                indexBy="answer"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
                padding={0.3}
                valueScale={{ type: 'symlog' }}
                indexScale={{ type: 'band', round: true }}
                // colors={{ scheme: 'yellow_green' }}
                colors={({ data }) => data.color}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{}}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'count',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
                tooltip={d => {
                    return (
                        <div style={{ width: '270px', padding: '5px 20px', backgroundColor: '#fffafa', borderRadius: '10px', color: '#000000', textAlign: 'center' }}>
                            <div style={{ width: '10px', height: '10px', marginRight: '10px', backgroundColor: d.color, display: 'inline-block' }}></div>
                            <h4 style={{ display: 'inline-block', fontWeight: 'bold' }}>
                                {d.indexValue.replaceAll('_', ' ')} - {d.formattedValue}
                            </h4>
                        </div>
                    )
                }}
                theme={{
                    // added
                    axis: {
                        domain: {
                            line: {
                                stroke: colors.grey[100],
                            },
                        },
                        legend: {
                            text: {
                                fill: colors.grey[100],
                            },
                        },
                        ticks: {
                            line: {
                                stroke: colors.grey[100],
                                strokeWidth: 1,
                            },
                            text: {
                                fill: colors.grey[100],
                            },
                        },
                    },
                    legends: {
                        text: {
                            fill: colors.grey[100],
                        },
                    }
                }}
                defs={[
                    {
                        id: 'dots',
                        type: 'patternDots',
                        background: 'inherit',
                        color: '#38bcb2',
                        size: 4,
                        padding: 1,
                        stagger: true
                    },
                    {
                        id: 'lines',
                        type: 'patternLines',
                        background: 'inherit',
                        color: '#eed312',
                        rotation: -45,
                        lineWidth: 6,
                        spacing: 10
                    }
                ]}
                fill={[
                    {
                        match: {
                            id: 'fries'
                        },
                        id: 'dots'
                    },
                    {
                        match: {
                            id: 'sandwich'
                        },
                        id: 'lines'
                    }
                ]}
                legends={[
                    
                ]}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
            />
        </div>
    );
};

export default ChartComponent;
