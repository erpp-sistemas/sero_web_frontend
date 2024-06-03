import { ResponsiveLine } from '@nivo/line'
import { useTheme } from '@mui/material'
import { tokens } from '../../theme'

const CustomTooltip = ({ point }) => (
    <div style={{ width: '270px', padding: '5px 20px', backgroundColor: '#fffafa', borderRadius: '10px', color: '#000000', textAlign: 'center' }}>
        <div style={{ width: '10px', height: '10px', marginRight: '10px', backgroundColor: point.serieColor, display: 'inline-block' }}></div>
        <h4 style={{ display: 'inline-block', fontWeight: 'bold' }}>
        {point.data.yFormatted} -{point.data.xFormatted} 
        </h4>
    </div>
);

const Line = ({ data, titlex }) => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    console.log(data)
    console.log(titlex)

    return (

    <ResponsiveLine
        data={data}
        margin={{ top: 30, right: 150, bottom: 70, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',            
        }}
        yFormat=" >-.2d"
        curve="linear"
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 45,
            legend: `${titlex}`,
            legendOffset: 36,
            legendPosition: 'middle',
          }}
        axisLeft={{
            tickSize: 6,
            tickPadding: 5,
            tickRotation: 0,            
            legendOffset: -40,
            legendPosition: 'middle',
            truncateTickAt: 0,            
        }}
        colors={{ scheme: 'category10' }}
        enableGridX={false}
        enableGridY={false}
        lineWidth={1}
        pointSize={3}
        pointColor={{ theme: 'labels.text.fill' }}
        pointBorderWidth={4}
        pointBorderColor={{ from: 'serieColor' }}
        enablePointLabel={true}
        pointLabel="data.yFormatted"
        pointLabelYOffset={-12}        
        areaOpacity={0.5}
        enableArea={true}
        areaBlendMode="multiply"
        enableTouchCrosshair={true}
        useMesh={true}
        legends={[
        {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            textColor: colors.grey[800],
            effects: [
            {
                on: 'hover',
                style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1
                }
            }
            ]
        }
        ]}
        theme={{
            textColor: colors.grey[200],
            axis: {
              ticks: {
                line: {
                  stroke: colors.grey[200]
                },
                text: {
                  fill: colors.grey[200]
                }
              }
            },
            legends: {
              text: {
                fill: colors.grey[200]
              }
            }
          }}
        labelTextColor={{
            from: 'color',
            modifiers: [
                [
                    'darker',
                    3
                ]
            ]
        }}        
        tooltip={CustomTooltip}
    />
    )
}

export default Line