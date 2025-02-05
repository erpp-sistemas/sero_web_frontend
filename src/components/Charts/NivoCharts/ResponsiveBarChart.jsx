import React from 'react';
import { ResponsiveBar  } from '@nivo/bar';
import { Box, useTheme } from "@mui/material"
import { tokens } from "../../../theme.js"

const ResponsiveBarChart = ({ 
  data,
  barColor, 
  showLegend, 
  tooltipFormat, 
  margin,
  backgroundColor,
  keys,          
  indexBy,
  axisBottomLegend,
  axisLeftLegend,
  axisLeftLegendOffset, 
  showBarValues,
  groupMode,
  valueScale,
  tickRotation,
  axisBottomtLegendOffset
}) => {    

    const theme = useTheme()
    const colors = tokens(theme.palette.mode) 

    const themeBackgroundColor = theme.palette.background.paper;
    const gradientId = `gradient-${Math.random().toString(36).substring(2, 11)}`;

    const getBarColor = ({ id, data }) => {
        return data[`${id}Color`] || barColor || colors.primary[500];
    };

    const getTooltipColor = (id) => {
      
      const color = data.find(item => item[`${id}Color`])?.[`${id}Color`];
      return color || colors.primary[500];
  };

    return (
      <Box 
        sx={{ 
          height: '100%', 
          width: '100%',
          backgroundColor: backgroundColor === 'paper' ? themeBackgroundColor : backgroundColor
        }}>
       <ResponsiveBar
            data={data}
            keys={keys}
            indexBy={indexBy}
            margin={ margin }
            padding={0.3}
            valueScale={{ type: valueScale || 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={ getBarColor }
            borderColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
            }}
            yFormat={ tooltipFormat }
            groupMode={groupMode} 
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: tickRotation || 0,
                legend: axisBottomLegend,
                legendPosition: 'middle',
                legendOffset: axisBottomtLegendOffset || 70
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: axisLeftLegend,
                legendPosition: 'middle',                
                legendOffset: axisLeftLegendOffset,
            }}
            label={showBarValues ? d => `${d.value.toLocaleString()}` : null}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
                from: 'color',
                modifiers: [['darker', 1.6]]
            }}
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
            legends={showLegend ? [ {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ],                
            }] : []}
            role="application"
            ariaLabel="Nivo bar chart demo"
            barAriaLabel={e => `${e.id}: ${e.formattedValue} in month: ${e.indexValue}`}
            tooltip={({ id, value, indexValue }) => {
              const color = getTooltipColor(id);
              const label = keys.find(key => key === id);
              return (
                  <div
                      style={{
                          padding: '12px',
                          background: '#333333',
                          color: '#ffffff',
                          borderLeft: `4px solid ${color}`,
                      }}
                  >
                      <strong>{label}</strong>: {tooltipFormat ? tooltipFormat(value) : value}
                      <br />
                      <strong>{axisBottomLegend}</strong>: {indexValue}
                  </div>
              );
          }}
        />
    </Box>
    ) 
  }

export default ResponsiveBarChart;
