
import { ResponsiveBar } from '@nivo/bar'
import { useTheme } from '@mui/material'
import { tokens } from '../../theme'

const Bar = ({ data, index, keys, position, format }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (

        <ResponsiveBar
            data={data}
            keys={keys}
			width={1100}
            indexBy={index}
            margin={{ top: 50, right: 30, bottom: 100, left: 90 }}
            padding={0.3}            
            layout={position}
            innerPadding={2}
            valueScale={{ type: 'symlog' }}
            indexScale={{ type: 'band', round: true }}
            colors={({ data }) => data.color}
            enableGridY={false}
            isInteractive={true}
            valueFormat={`${format}`}
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
                    id: 'gradientA',
                    type: 'linearGradient',
                    colors: [
                        { offset: 0, color: '#f39c12' },
                        { offset: 100, color: '#f1c40f' },
                    ],
                },
                {
                    id: 'gradientB',
                    type: 'linearGradient',
                    colors: [
                        { offset: 0, color: '#2980b9' },
                        { offset: 100, color: '#3498db' },
                    ],
                },
                // Add more gradients as needed
            ]}
            fill={[
                {
                    match: { id: 'fries' },
                    id: 'gradientA',
                },
                {
                    match: { id: 'sandwich' },
                    id: 'gradientB',
                },
                // Add more fill rules as needed
            ]}
            borderColor={{
                from: 'color',
                modifiers: [
                    ['darker', 1.6]
                ]
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 10,
                tickPadding: 8,
                tickRotation: 45,
                legendPosition: 'middle',
                legendOffset: 32,
                truncateTickAt: 0
            }}
            enableTotals={true}
            totalsOffset={100}
            labelTextColor= {colors.grey[100]}
            legends={[
                
            ]}
            role="application"
            ariaLabel="Nivo bar chart demo"
            barAriaLabel={e => e.id + ": " + e.formattedValue + " in usuario: " + e.indexValue}
        />
    )
}

export default Bar