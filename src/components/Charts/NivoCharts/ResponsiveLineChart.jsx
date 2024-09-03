import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Box, useTheme } from "@mui/material"
import { tokens } from "../../../theme.js"

const ResponsiveLineChart = ({ 
  data,   
  showLegend, 
  tooltipFormat, 
  margin,
  axisBottomLegend,
  axisLeftLegend,
  axisLeftLegendOffset,
  backgroundColor,
  enableArea,
  areaOpacity,
  areaBaselineValue
}) => {    

    const theme = useTheme()
    const colors = tokens(theme.palette.mode) 

    const themeBackgroundColor = theme.palette.background.paper;
    const gradientId = `gradient-${Math.random().toString(36).substring(2, 11)}`;

    return (
      <Box 
        sx={{ 
          height: '100%', 
          width: '100%',
          backgroundColor: backgroundColor === 'paper' ? themeBackgroundColor : backgroundColor
        }}>
        <ResponsiveLine
            data={data}
            margin={ margin }
            xScale={{ type: 'point', min: 0, max: 'auto' }}
            yScale={{
                type: 'linear',
                min: 0,
                max: 'auto',
                stacked: false,
                reverse: false
            }}
            yFormat={ tooltipFormat }
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: axisBottomLegend,
                legendOffset: 36,
                legendPosition: 'middle'
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: axisLeftLegend,
                legendOffset: axisLeftLegendOffset,
                legendPosition: 'middle'
            }}
            colors={d => d.color}
            enablePoints={ true }
            lineWidth={4}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabel="data.yFormatted"
            pointLabelYOffset={-12}
            enableSlices="x"
            useMesh={true}
            enableArea={enableArea}
            areaBaselineValue={areaBaselineValue}
            areaOpacity={areaOpacity}
            defs={[
              {
                  id: gradientId,
                  type: 'linearGradient',
                  colors: [
                      { offset: 0, color: 'inherit', opacity: 1 },
                      { offset: 100, color: 'inherit', opacity: 0 }
                  ],
              },
          ]}
          fill={[
              {
                  match: '*',
                  id: gradientId,
              },
          ]}
            theme={{
                textColor: '#ffffff',
                axis: {
                    ticks: {
                        text: {
                            fill: '#ffffff',
                        }
                    },
                    legend: {
                        text: {
                            fill: '#ffffff'
                        }
                    }
                },
                grid: {
                  line: {
                      stroke: colors.grey[500],
                      strokeWidth: 1,
                      strokeDasharray: "1 1",
                  },
                },
                tooltip: {
                    container: {
                        background: '#333333',
                        color: '#ffffff'
                    }
                },
                crosshair: {
                  line: {
                      stroke: colors.blueAccent[400],
                      strokeWidth: 3,
                      strokeDasharray: '3 3',
                  }
                }
            }}
            legends={showLegend ? [{
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
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }] : []}
        />
    </Box>
    ) 
  }

export default ResponsiveLineChart;
